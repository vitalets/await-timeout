require('babel-register')({
  plugins: [
    'add-module-exports',
    'transform-es2015-modules-commonjs'
  ]
});

global.assert = require('assert');
global.sinon = require('sinon');
global.Timeout = require(process.env.LIB_PATH || '../src/index');
global.sleep = ms => new Promise(r => setTimeout(r, ms));
