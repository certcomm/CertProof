require("babel-polyfill");

var errorMessages = require("../config/errorMessages.js");
var Constants = require("../config/constants.js");
var registryAbi = require("../contract-abi/Registry.json");
var cThinBlockAnchorOpsAbi = require("../contract-abi/CThinBlockAnchorOps.json");
var Web3 = require('web3');
module.exports = {
    proveOnBlockChain: async function(logEmitter, networkType, governorDomainName, shard, cblockNum, cThinBlockHash, cThinBlockMerkleRootHash) {
        logEmitter.log("Proving cblockNum=" + cblockNum  + " on blockchain networkType= " + networkType);
        try {
            logEmitter.indent();
            var web3 = getWeb3(networkType);
            var cThinBlockAnchor = await getCThinBlockAnchor(web3, networkType, governorDomainName, shard, cblockNum);
            logEmitter.log("Found cThinBlockAnchor=[" + cThinBlockAnchor +"] on blockchain networkType= " + networkType);
            if(cThinBlockAnchor==null) {
                errorMessages.throwError("3001", ", shard="+shard+",blockNum="+cblockNum);
            }
            var cThinBlockHashOnBlockChain = cThinBlockAnchor[0];
            var cThinBlockMerkleRootHashOnBlockChain = cThinBlockAnchor[1];
            if (cThinBlockHash != cThinBlockHashOnBlockChain) {
                errorMessages.throwError("3002", ", cThinBlockHash="+cThinBlockHash+",cThinBlockHashOnBlockChain="+cThinBlockHashOnBlockChain);
            }
            if (cThinBlockMerkleRootHash != cThinBlockMerkleRootHashOnBlockChain) {
                errorMessages.throwError("3003", ", cThinBlockMerkleRootHash="+cThinBlockMerkleRootHash+",cThinBlockMerkleRootHashOnBlockChain="+cThinBlockMerkleRootHashOnBlockChain);
            }
        } finally {
            logEmitter.deindent();
        }
        logEmitter.log("Proved cblockNum=" + cblockNum  + " on blockchain networkType= " + networkType);
    }
}

function getWeb3(networkType) {
    var networkUrl=getNetworkUrl(networkType);
    return new Web3(new Web3.providers.HttpProvider(networkUrl));
}

async function getCThinBlockAnchor(web3, networkType, governorDomainName, shard, cblockNum) {
    var cThinBlockAnchorOps = await getCThinBlockAnchorOps(web3, networkType);
    var exists = await cThinBlockAnchorOps.cThinBlockAnchorExists(governorDomainName, shard, cblockNum);
    if(exists) {
        return await cThinBlockAnchorOps.getCThinBlockAnchor(governorDomainName, shard, cblockNum);
    }
    return null;
}

async function getCThinBlockAnchorOps(web3, networkType) {
    var registry = getRegistry(web3, networkType);
    var cThinBlockAnchorOpsAddress = await registry.getContractAddr("CThinBlockAnchorOps");
    return web3.eth.contract(cThinBlockAnchorOpsAbi).at(cThinBlockAnchorOpsAddress);
}

function getRegistry(web3, networkType) {
    var registryAddress = getRegistryAddress(networkType);
    return web3.eth.contract(registryAbi).at(registryAddress);
}

function getNetworkUrl(networkType) {
    var infuraToken = Constants.default.infuraApiToken;
    switch (networkType) {
        case "mainnet":
            return "https://mainnet.infura.io/v3/" + infuraToken;
        case "test_ropsten":
            return "https://ropsten.infura.io/v3/" + infuraToken;
        case "test_infuranet":
            return "https://infuranet.infura.io/v3/" + infuraToken;
        case "test_kovan":
            return "https://kovan.infura.io/v3/" + infuraToken;
        case "test_rinkeby":
            return "https://rinkeby.infura.io/v3/" + infuraToken;
        case "test_localhost":
            return "http://localhost:8545";
    }
    return null;
}

function getRegistryAddress(networkType) {
    switch (networkType) {
        case "mainnet":
            return "0x8f83c92dc3c874005e7c8151300eeabdf4a86023";
        case "test_rinkeby":
            return "0x8f83c92dc3c874005e7c8151300eeabdf4a86023";
    }
    return null;
}
