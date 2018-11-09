
module.exports.default = {
	routeEvidenceJsonFileName: "evidenceManifest.json",
	manifestJsonFileName: "sacManifest.json",
	ssacManifestJsonFileName: "ssacManifest.json",
	incManifestJsonFileName: "incEvidenceManifest.json",
	errorFileName: "Errors.txt",
	supportedSchemaVersions: {
		current : "1.3",
		min : "1.0",
	},
	zeroBytesHash:"0000277125cdf08f863f790be510148a7e55116cc485b816852d56afe2940000",
	defaultNetworkNodeUrlsMap: {
        mainnet:["https://mainnet.infura.io/v3/96bd807ada6646b9b815e6bdac9db700"],
        test_ropsten:["https://ropsten.infura.io/v3/96bd807ada6646b9b815e6bdac9db700"],
        test_infuranet:["https://infuranet.infura.io/v3/96bd807ada6646b9b815e6bdac9db700"],
        test_kovan:["https://kovan.infura.io/v3/96bd807ada6646b9b815e6bdac9db700"],
        test_rinkeby:["https://rinkeby.infura.io/v3/96bd807ada6646b9b815e6bdac9db700"],
        test_localhost:["http://localhost:8545"]
	}
}