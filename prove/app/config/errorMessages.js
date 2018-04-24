module.exports = {
	// For a single Incremental Evidence 
	errors : {
		"1001":"Tampering with comment should cause FAIL",
		"1002":"Tampering with section content should cause FAIL",
		"1003":"Tampering with attachment content should cause FAIL",
		"1004":"SSAC does not hash to SSAC hash should cause FAIL",
		"1005":"SAC manifest does not hash to SAC manifest hash should cause FAIL",
		"1006":"Unsupported schema version should cause FAIL",
		"1007":"Invalid JSON Structure",
		"1008":"Unknown Thread Type",
		"1009":"Missing Subject",
		"1010":"Missing ttnGlobal",
		"1011":"Invalid ttnGlobal Structure",
		"1012":"Invalid Writer Structure",
		"1013":"Missing Governor",
		"1014": "Invalid Creator Structure",
		"1015":"Unknown Change Type",
		"1016":"Invalid or Missing Change Num",
		"1017":"Invalid Section Structure",
		"1018":"Unknown CERT-OP-TYPE",
		"1019":"Invalid Added Writer Structure",
		"1020":"Invalid JSON, Schema validation failed",
		"1021":"Creator Writer that is absent from Writer SAC",
		"1022":"CBlockInfo if present does not match its hash",
		"1023":"Digital Signature if present is not valid",
		"1024":"Missing incremental manifest file",

		 //Across Multiple Incremental Evidence 
		"2001":"Missing or non-contiguous change num",
		"2002":"Inconsistent TTN",
		"2003":"Inconsistent TTN Global",
		"2004":"Modified Section that did not exist or was deleted",
		"2005":"Deleted Section that did not exist or was deleted",
		"2006":"Narrowed Writer SAC across changeset",
		"2007":"Writer SAC (changeset N) != Writer SAC (Changeset N-1) + Added Writer (Changeset N)",
		"2008":"Unsupported Evidence Schema Version",
		"2009":"Inconsistent Digital Signature presence",
		"2010":"Inconsistent CBlockInfo presence",
		"2011":"Inconsistent governor",
		"2012":"Missing manifest file",
		// Blockchain Tests 
		"3001":"#SAC in incremental evidence does not match #SAC on Blockchain using Merkel path",
		"3002":"#SSAC in incremental evidence does not match #SSAC on Blockchain using Merkel path",
		"3003":"#CBlockInfo in incremental evidence does not match #CBlockInfo on Blockchain",
	},
	throwError: function(errorCode, msgSuffix) {
	    var errorMessage = this.errors[errorCode] + ", " + msgSuffix;
	    throw {name:errorCode, message:errorMessage};                            
	}
}