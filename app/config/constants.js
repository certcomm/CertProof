const electron = window.require('electron');
const remote = electron.remote;
const appPath = remote.app.getAppPath();
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

export default {
	supportedSchemaVersions: {
		current : "1.0",
		min : "1.0",
	},
	appPath: appPath,
	userDataPath: userDataPath,
	evidenceFolder: userDataPath+"/uploads/",
	extractedEvidenceFolder: userDataPath+"/uploads/extracted/",
	routeEvidenceJsonFileName: "evidenceManifest.json",
	manifestJsonFileName: "sacManifest.json",
	smanifestJsonFileName: "ssacManifest.json",
	incManifestJsonFileName: "incEvidenceManifest.json",
	errorFileName: "Errors.txt",
	networkFileFolder: userDataPath+"/networks/",
	networkJsonFileName: "networks.json",
	blockChainAnchorsOn: [
		{
			type: "Ethereum",
			networks: [
				{
					name: "mainnet",
					value: [
						{
							url: "https://mainnet.infura.io/v3/96bd807ada6646b9b815e6bdac9db700",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_ropsten",
					value: [
						{
							url: "https://ropsten.infura.io/v3/96bd807ada6646b9b815e6bdac9db700",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_infuranet",
					value: [
						{
							url: "https://infuranet.infura.io/v3/96bd807ada6646b9b815e6bdac9db700",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_kovan",
					value: [
						{
							url: "https://kovan.infura.io/v3/96bd807ada6646b9b815e6bdac9db700",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_rinkeby",
					value: [
						{
							url: "https://rinkeby.infura.io/v3/96bd807ada6646b9b815e6bdac9db700",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_localhost",
					value: [
						{
							url: "http://localhost:8545",
							appDefault: true,
							default: true
						}
					]
				}
			]
		}
	]
}