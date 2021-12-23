// in ./build.js

process.env.GENERATE_SOURCEMAP=false

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

config.plugins = config.plugins.filter(p => 
  p?.constructor?.name !== 'ManifestPlugin'
  && p?.constructor?.name !== 'GenerateSW'
);

config.output.filename='static_js_[name].[contenthash:8].js'
config.output.chunkFilename='static_js_[name].[contenthash:8].chunk.js'

// console.log(config.plugins.map(x => x?.constructor?.name))
// console.log(config.output)

// also added homepage: "./" to package.json
