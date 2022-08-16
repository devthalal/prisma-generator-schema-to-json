import axios from 'axios'

const appBlockRegistryOrigin = `http://localhost:9056/api/registry/v0.1`
// const appBlockRegistryOrigin = `https://dev.api.blocks-registry.yahilo.com/api/registry/v0.1/`

export const saveSchema = async (modelData) => {
  try {
    console.log('saveSchema', modelData.name)
    const schema_json = JSON.stringify(modelData, null, 2)
    const res = await axios.post(
      `${appBlockRegistryOrigin}/add-sdm-model-schema`,
      {
        name: modelData.name,
        version: '0.0.2',
        schema_json: modelData,
        type: 2,
      },
    )
    console.log('res.data', res.data)
  } catch (error) {
    console.log('Error adding schema', error.data)
  }
}
