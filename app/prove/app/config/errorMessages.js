module.exports = {
	// For a single Incremental Evidence 
	errors : {
		"1001":"Failure due to Tampered comment",
		"1002":"Failure due to Tampered section content",
		"1003":"Failure due to Tampered attachment content",
		"1004":"SSAC does not hash to SSAC hash",
		"1005":"SAC manifest does not hash to SAC manifest hash",
		"1006":"Failure due to Unsupported Schema Version",
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
		"1023":"Digital Signature if present is not valid",//TODO
		"1024":"Missing incremental manifest file",
		"1025":"Forwarded comment if present does not match its hash",

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
		"3001":"Block does not exists on Blockchain",
		"3002":"CThinBlockHash in incremental evidence does not match CThinBlockHash on Blockchain",
		"3003":"MerkleRootHash in incremental evidence does not match MerkleRootHash on Blockchain",
	},
	throwError: function(errorCode, msgSuffix) {
	    var errorMessage = this.errors[errorCode] + ", " + msgSuffix;
	    throw {name:errorCode, message:errorMessage};                            
	}
}