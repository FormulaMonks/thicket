# Thicket Webapp

## Dev

By setting the corresponding env var the IPFS instance will connect to the Swarm endpoint: `REACT_APP_SWARM`. Possible values are:

- `WRTC_LOCAL` - will use a local [`webrtc-star`](https://github.com/libp2p/js-libp2p-webrtc-star) signaling server (run `yarn run wrtc:signaling` to execute the signaling server)
- `WSIO_LOCAL` - will use a local [`websocket-star-rendezvous`](https://github.com/libp2p/js-libp2p-websocket-star-rendezvous) server to relay data. Same server used for `database` tests (execute with the following command `yarn run test:server`)
- `WSIO_IPFS` - will use IPFS’s [`websocket-star-rendezvous`](https://ws-star.discovery.libp2p.io) server. **Every now and then this server stops working**.
- `WRTC_IPFS` - will use IPFS’s [`webrtc-star-signal`](https://wrtc-star.discovery.libp2p.io) server. Default value if no value is set.

```sh
yarn
yarn start
```

## Build

```sh
yarn build
```

## Tests

Test results will vary depending on the swarm endpoint that was set.

```sh
# start the local websocket-star-rendezvous server in one console (port 9191)
yarn wsio

# start the local webrtc-star singnaling server in another console (port 9090)
yarn wrtc

# run the all the tests
yarn test
```
