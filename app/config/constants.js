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
							url: "https://mainnet.infura.io/Rfiz1l4YFxXO9GRgpOaB",
							appDefault: true,
							default: true
						},
						{
							url: "https://mainnet.certcomm.io/f7dca",
							default: false
						}
					]
				},
				{
					name: "test_ropsten",
					value: [
						{
							url: "https://ropsten.infura.io/Rfiz1l4YFxXO9GRgpOaB",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_infuranet",
					value: [
						{
							url: "https://infuranet.infura.io/Rfiz1l4YFxXO9GRgpOaB",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_kovan",
					value: [
						{
							url: "https://kovan.infura.io/Rfiz1l4YFxXO9GRgpOaB",
							appDefault: true,
							default: true
						}
					]
				},
				{
					name: "test_rinkeby",
					value: [
						{
							url: "https://rinkeby.io/Rfiz1l4YFxXO9GRgpOaB",
							appDefault: true,
							default: true
						}
					]
				}
			]
		}
	]
}