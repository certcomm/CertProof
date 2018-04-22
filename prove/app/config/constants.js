const userDataPath = "/tmp";

module.exports.default = {
	userDataPath: userDataPath,
	evidenceFolder: userDataPath+"/uploads/",
	extractedEvidenceFolder: userDataPath+"/uploads/extracted/",
	routeEvidenceJsonFileName: "evidenceManifest.json",
	manifestJsonFileName: "sacManifest.json",
	ssacManifestJsonFileName: "ssacManifest.json",
	incManifestJsonFileName: "incEvidenceManifest.json",
	errorFileName: "Errors.txt",
	supportedSacSchemaVersion:9,
	zeroBytesHash:"0000277125cdf08f863f790be510148a7e55116cc485b816852d56afe2940000"
}