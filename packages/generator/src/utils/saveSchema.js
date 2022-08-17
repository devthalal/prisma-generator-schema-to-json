import axios from 'axios'
import { extractModelDocumentation } from '../helpers'

const appBlockRegistryOrigin = `http://localhost:9056/api/registry/v0.1`
// const appBlockRegistryOrigin = `https://dev.api.blocks-registry.yahilo.com/api/registry/v0.1/`

export const saveSchema = async (modelData) => {
  try {
    const modelDoc = extractModelDocumentation(modelData.documentation)
    const res = await axios.post(
      `${appBlockRegistryOrigin}/add-sdm-model-schema`,
      {
        name: modelData.name,
        version: modelDoc.version,
        schema_json: { ...modelData, ...modelDoc },
        type: parseInt(modelDoc.type),
      },
    )
    console.log(`${modelData.name} ${res.data?.msg}`)
  } catch (error) {
    console.log('Error adding schema', error.response?.data?.msg || error.message)
  }
}
