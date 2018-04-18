import rm from 'rmfr'
import fs from 'fs'
import { promisify } from 'util'

const relativePath = 'test/__storage__'
const getFileContents = promisify(fs.readFile)

export const options = namespace => test => ({
  repo: `${relativePath}/repo-${namespace}-${test}-${Date.now()}`,
  config: {
    Addresses: {
      Swarm: [
        '/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star',
      ]
    },
    Bootstrap: []
  }
})

export const cleanup = async namespace => {
  await rm(`${relativePath}/repo-${namespace}-*`, { glob: true })
}

export const getGIFSource = (() => {
  const p = getFileContents(`${__dirname}/gif.gif`)
    .then(buffer => buffer.toString())
  return () => p
})()

export const GIF_HASH = 'QmYWRS7rqok7zvFBmAm1JBbzPEAMdkkfxwfhfPNoX9vAuQ'

export const GIF_SIZE = 1082
