import path from 'path'

import { generatorHandler } from '@prisma/generator-helper'
import { logger } from '@prisma/internals'

import { GENERATOR_NAME } from './constants'
import { extractFields } from './helpers'
import { saveSchema } from './utils/saveSchema'
import { writeJsonFileSafely } from './utils/writeJsonFileSafely'
import { getDocs } from './utils/getDocs'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options) => {
    try {
      const models = {}
      let modelRelTemp = {}

      const docsJson = await getDocs(options)

      for (const model of options.dmmf.datamodel.models) {
        const parsedFields = JSON.parse(JSON.stringify(model.fields))
        const { fields = {}, relations = {} } = await extractFields(
          parsedFields,
          modelRelTemp,
          model.name,
          docsJson,
        )

        modelRelTemp = relations
        models[model.name] = { ...model, fields, doc_url: docsJson[model.name] }
      }

      for (const relationFields of Object.values(modelRelTemp)) {
        relationFields.forEach(({ modelName, ...fieldData }) => {
          if (!models[modelName].relations) models[modelName].relations = []
          models[modelName].relations.push(fieldData)
        })
      }

      const outputPath = options.generator.output?.value
      for (const model of Object.values(models)) {
        //   await saveSchema(model)

        if (outputPath) {
          const writeLocation = path.join(outputPath, `${model.name}.json`)
          await writeJsonFileSafely(writeLocation, model)
        }
      }
    } catch (error) {
      console.log('Something went wrong', error)
    }
  },
})
