yarn build
mv ./build/index.html ./build/200.html
node_modules/.bin/surge ./build thicket.citrusbyte.com
