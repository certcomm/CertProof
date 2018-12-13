var assert = require('assert');
var evidenceUtils = require("../app/util/evidenceUtils.js");
var logEmitter = require("../logEmitter").createLogEmitter();

describe('EvidenceUtils', function() {
  describe('#schemaVersionGreaterThanEqualTo()', function() {
    it('should return true when greater than equal to', function() {
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("2.1","1.1"), true);
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("1.1","1.0"), true);
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("1.1","1.1"), true);
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("1.1","2.1"), false);
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("1.0","2.1"), false);
      assert.equal(evidenceUtils.schemaVersionGreaterThanEqualTo("1.0","1.1"), false);
    });
  });

  describe('#getInlineImageExtensionByMimeType()', function() {
    it('should return proper MimeType', function() {
      assert.equal(evidenceUtils.getInlineImageExtensionByMimeType("image/jpeg"), "jpg");
      assert.equal(evidenceUtils.getInlineImageExtensionByMimeType("image/jpg"), "jpg");
      assert.equal(evidenceUtils.getInlineImageExtensionByMimeType("image/png"), "png");
      assert.equal(evidenceUtils.getInlineImageExtensionByMimeType("image/gif"), "gif");
      assert.equal(evidenceUtils.getInlineImageExtensionByMimeType(undefined), "");
    });
  });

  describe('#schemaVersionSupported()', function() {
    var supportedSchemaVersions = {
        current : "1.5",
        min : "1.1",
    };
    it('should not throw error', function() {
        evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1.1", false);
        evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1.5", false);
        evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1.6", false);
    });
    it('should throw error on Bad Schema version', function() {
        assert.throws(()=>evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1", false)
                      ,(err) =>err.name=="1026");
    });
    it('should throw error on Minor Schema version greater than min', function() {
        assert.throws(()=>evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1.0", false)
                      ,(err) =>err.name=="1006");
    });
    it('should throw error on Major Schema version greater than current', function() {
        assert.throws(()=>evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "2.1", false)
                      ,(err) =>err.name=="1027");
    });
    it('should throw error on MinorVersionForwardCompatiblity', function() {
        assert.throws(()=>evidenceUtils.schemaVersionSupported(logEmitter, supportedSchemaVersions, "incEvidence", "1.6", true)
                      ,(err) =>err.name=="1028");
    });
  });

  describe('#getIncEvidenceFileName()', function() {
    it('should return proper incremental zip file Name', function() {
      var ttn = "124-0203-0241";
      var cnum = 6;
      assert.equal(evidenceUtils.getIncEvidenceFileName({"hasCBlockInfo":true}, ttn, cnum), "L1_INC_EV_124-0203-0241_6.zip");
      assert.equal(evidenceUtils.getIncEvidenceFileName({"hasCBlockInfo":false, "hasDigitalSignature":true}, ttn, cnum), "L2_INC_EV_124-0203-0241_6.zip");
      assert.equal(evidenceUtils.getIncEvidenceFileName({"hasCBlockInfo":false, "hasDigitalSignature":false, "certified":true}, ttn, cnum), "L2_INC_EV_124-0203-0241_6.zip");
      assert.equal(evidenceUtils.getIncEvidenceFileName({"hasCBlockInfo":false, "hasDigitalSignature":false}, ttn, cnum), "BACKUP_INC_124-0203-0241_6.zip");
      assert.equal(evidenceUtils.getIncEvidenceFileName({"hasCBlockInfo":false, "hasDigitalSignature":false, "certified":false}, ttn, cnum), "BACKUP_INC_124-0203-0241_6.zip");
    });
  });
});
