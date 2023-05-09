import axios from 'axios'
import { extractModelDocumentation } from '../helpers'
import apis from '../config/apis'

export const saveSchema = async (modelData) => {
  try {
    const modelDoc = extractModelDocumentation(modelData.documentation)

    const res = await axios.post(
      apis.addSdmModelUrl,
      {
        name: modelData.name,
        version: modelDoc.version,
        schema_json: { ...modelData, ...modelDoc },
        type: parseInt(modelDoc.type),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SHIELD_AUTH_TOKEN}`,
          space_id: process.env.SPACE_ID,
        },
      },
    )
    console.log(`${modelData.name} ${res.data?.msg}`)
  } catch (error) {
    console.log(
      'Error adding schema',
      error.response?.data?.msg || error.message,
    )
  }
}
