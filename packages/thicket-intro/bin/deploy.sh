yarn build
mv ./build/index.html ./build/200.html
surge ./build https://introducing-thicket.surge.sh
