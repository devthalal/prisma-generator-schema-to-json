import { generatorHandler } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { extractFields } from './helpers'
import { saveSchema } from './utils/saveSchema'
import { writeFileSafely } from './utils/writeFileSafely'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options) => {
    options.dmmf.datamodel.models.forEach(async (model) => {
      const writeLocation = path.join(
        options.generator.output?.value,
        `${model.name}.json`,
      )

      model.fields = await extractFields(
        JSON.parse(JSON.stringify(model.fields)),
      )

      await saveSchema(model)

      // await writeFileSafely(writeLocation, modelData)
    })
  },
})
