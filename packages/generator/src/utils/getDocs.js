import { readFileSync, readdirSync, existsSync } from 'fs'
import { extractModelDocumentation } from '../helpers'
import path from 'path'
import axios from 'axios'
import apis from '../config/apis'
import { writeJsonFileSafely } from './writeJsonFileSafely'

const getExistingData = (docPath) => {
  try {
    return JSON.parse(readFileSync(docPath))
  } catch (error) {
    return {}
  }
}

const uploadfile = async (fileName, sdmDocsPath, version, modelName) => {
  try {
    const filePath = `${sdmDocsPath}/${fileName}`
    const fileData = readFileSync(filePath)

    const preSignedData = await axios.post(
      apis.sdmDocSignedUrl,
      {
        file_name: fileName,
        model_name: modelName,
        version,
      },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIELD_AUTH_TOKEN}`,
        space_id: process.env.SPACE_ID,
      },
    )

    await axios.put(preSignedData.data.url, fileData, {
      headers: {
        'Content-Type': 'text/markdown',
      },
    })

    console.log(`File ${fileName} uploaded`)
    return preSignedData.data.key
  } catch (error) {
    console.log(
      `Error File ${fileName} uploaded`,
      error.response?.data?.msg || error.message,
    )
    return null
  }
}

export const getDocs = async (options) => {
  if (!options.schemaPath) return {}

  const schemaBasePath = options.schemaPath.substring(
    0,
    options.schemaPath.replace(/[\\]/g, '/').lastIndexOf('/') + 1,
  )

  const sdmDocsPath = path.join(
    schemaBasePath,
    options.generator.config.sdm_docs || '../sdm-docs',
  )

  const models = options.dmmf.datamodel.models

  let existingData = {}

  if (!existsSync(sdmDocsPath)) {
    return existingData
  }

  let fileNames = readdirSync(sdmDocsPath)

  const docsJsonPath = path.join(sdmDocsPath, 'docs.json')

  if (existsSync(docsJsonPath)) {
    existingData = getExistingData(docsJsonPath)
    fileNames = fileNames.filter(
      (e) => e !== 'docs.json' && !existingData[e.replace('.md', '')],
    )
    console.log(
      `docs.json exist, If there is any update in specific doc Please remove that fileName_key from docs.json `,
    )
  }

  if (fileNames.length !== 0) {
    for await (const fileName of fileNames) {
      const fileModelName = fileName.split('_')[0]?.replace('.md', '')
      const modelData = models.find(({ name }) => name === fileModelName)
      const modelDoc = extractModelDocumentation(modelData.documentation)

      const keyValue = await uploadfile(
        fileName,
        sdmDocsPath,
        modelDoc.version,
        modelData.name,
      )
      existingData[fileName.replace('.md', '')] = keyValue
    }
  }

  writeJsonFileSafely(docsJsonPath, existingData)

  return existingData
}
