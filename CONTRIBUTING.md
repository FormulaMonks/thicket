# Prerequisites

[Node.js](http://nodejs.org/) >= v4 and <= v9 must be installed.

[Yarn](https://yarnpkg.com/en/docs/install) >= v1 must be installed.

# Installation

- Running `yarn` and then `yarn bootstrap` in the project root directory will install and link everything you need for development.

# Webapp

The main project is in `packages/thicket-webapp`. To get started, `cd` into this directory and run `yarn start`. It will open a development server at [http://localhost:3000](http://localhost:3000)

For more info on the specifics of how to use the thicket-webapp packages, see its README.

# The other subprojects

You can explore the other subprojects by looking around the `packages` directory and looking at different projects' README files.

One notable other project is thicket-intro, which explains Citrusbyte's motivation for building Thicket. Some other projects, like thicket-elements and thicket-camera, contain components shared by both thicket-webapp and thicket-intro.

# Using Lerna

This is a **monorepo**, a single repo that contains several related projects. We are using [Lerna](https://lernajs.io/) to accomplish this.

Lerna does several things for us. The following commands can be run from the monorepo root:

- `lerna updated` - display info about which subprojects have been updated since last being published

- `lerna publish` - publish each subproject that has been updated

- `lerna run build` or `lerna run test` or `lerna run ______` - run the given command for all subprojects. Uses the script defined in the monorepo root, if defined, but can be overridden by each individual subproject's `package.json`
