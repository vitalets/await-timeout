global.assert = require('assert');
global.assert.rejects = require('assert-rejects');
global.sinon = require('sinon');
global.Timeout = require(process.env.LIB_PATH || '..');
global.sleep = ms => new Promise(r => setTimeout(r, ms));

