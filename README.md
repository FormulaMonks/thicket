# Thicket: a decentralized, offline-first Vine clone

## Projects

- [React Native App](https://github.com/citrusbyte/thicket/tree/master/packages/rnapp)
- [Webapp](https://github.com/citrusbyte/thicket/tree/master/packages/webapp)


## Lerna

This repo uses [Lerna](https://lernajs.io/) to manage the different projects.

### How do I add a package to my Lerna repository?

For any packages that you add to your Lerna repository, instead of running npm install you should run lerna bootstrap. This will take into account the existing projects in the packages folder as well as external dependencies.

### Adding new packages

Create a directory for your package in the packages folder, and run npm init as normal to create the package.json for your new package.


For additional help using Lerna visit [lerna-wizard](https://github.com/szarouski/lerna-wizard)
