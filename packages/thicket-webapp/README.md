# Thicket Webapp

## Dev

By setting the corresponding `env` var the IPFS instance will connect to the defined Swarm endpoint: `REACT_APP_SWARM`. Possible values are:

- `WRTC_LOCAL` - will use a local [`webrtc-star`](https://github.com/libp2p/js-libp2p-webrtc-star) signaling server (run `yarn run wrtc` to execute the signaling server)
- `WSIO_LOCAL` - will use a local [`websocket-star-rendezvous`](https://github.com/libp2p/js-libp2p-websocket-star-rendezvous) server to relay data. Same server used for `database` tests (execute with the following command `yarn run wsio`)
- `WSIO_IPFS` - will use IPFS’s [`websocket-star-rendezvous`](https://ws-star.discovery.libp2p.io) server. **Every now and then this server stops working**.
- `WRTC_IPFS` - will use IPFS’s [`webrtc-star-signal`](https://wrtc-star.discovery.libp2p.io) server. Default value if no value is set.

```sh
# please make sure you have bootstrapped all the packages successfully
# from repo root (cd ../../) run:
yarn
yarn bootstrap

# then in packages/thicket-webapp (cd packages/thicket-webapp) run:
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

# start the local webrtc-star signaling server in another console (port 9090)
yarn wrtc

# start dev server with local webrtc-star signal swarm endpoint
REACT_APP_SWARM=WRTC_LOCAL yarn start

# run the all the tests
yarn test
```

### E2E Tests

**Firefox**

Download the latest [`geckodriver`](https://github.com/mozilla/geckodriver/releases) to the `test/__drivers__/` folder and add this folder to your $PATH.

**Safari**

`Safaridriver` should be included with Safari 10 and later.

**Running the tests**

```sh
# will run tests with chrome, firefox and safari
yarn test e2e
```

By setting the `BROWSER` `env` var to any of `chrome`, `firefox` or `safari` the tests will execute only using the defined browser.

By default `chrome` and `firefox` run in `headless` mode. By setting the `HEADLESS` `env` var to false the tests will run in a browser.
