hack_source() {
  file="./node_modules/$1"
  echo "babelify $file"
  ./node_modules/babel-cli/bin/babel.js $file --presets=es2015 -o $file
  echo "uglify $file"
  ./node_modules/uglify-es/bin/uglifyjs $file -o $file
}
