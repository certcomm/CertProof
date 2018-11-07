var assert = require('assert');
var rewire = require('rewire');
var blockchainUtils = rewire("../app/util/blockchainUtils.js");
var logEmitter = require("../logEmitter").createLogEmitter();

describe('BlockchainUtils', function() {
  describe('#getRegistryAddress()', function() {
    it('should return correct registry address', function() {
      getRegistryAddress = blockchainUtils.__get__('getRegistryAddress');
      assert.equal(getRegistryAddress("testcase"), "testDevRegistry");
      assert.equal(getRegistryAddress("testcase", false), "testDevRegistry");
      assert.equal(getRegistryAddress("testcase", true), "testProdRegistry");
    });
  });
});
