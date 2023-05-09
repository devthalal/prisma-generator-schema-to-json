const env = process.env.ENV || "dev"
// Environments are prod, dev, test
const appBlockRegistryOrigin = `https://${env === 'prod' ? '' : env + '-'}api-blocks-registry.appblocks.com/api/registry/v0.1/`

const apis = {
  addSdmModelUrl: `${appBlockRegistryOrigin}add-sdm-model-schema/invoke`,
  sdmDocSignedUrl: `${appBlockRegistryOrigin}create-sdm-doc-signed-url/invoke`,
}

export default apis
