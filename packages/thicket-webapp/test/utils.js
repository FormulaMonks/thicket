import rm from 'rmfr'

const relativePath = 'test/__storage__'

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
