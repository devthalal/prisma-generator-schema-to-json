import fs from 'fs'
import path from 'path'

export const writeJsonFileSafely = async (writeLocation, content) => {
  fs.mkdirSync(path.dirname(writeLocation), { recursive: true })
  fs.writeFileSync(writeLocation, JSON.stringify(content, null, 2), { encoding: 'utf8' })
}
