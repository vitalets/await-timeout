require('babel-register')({
  plugins: [
    'add-module-exports',
    'transform-es2015-modules-commonjs'
  ]
});

global.assert = require('assert');
global.Timeout = require(process.env.LIB_PATH || '../index');
global.wait = ms => new Promise(r => setTimeout(r, ms));
