const electron = window.require('electron');
const remote = electron.remote;
const appPath = remote.app.getAppPath();
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

export default {
	appPath: appPath,
	userDataPath: userDataPath,
	evidenceFolder: userDataPath+"/uploads/",
	extractedEvidenceFolder: userDataPath+"/uploads/extracted/",
	routeEvidenceJsonFileName: "evidenceManifest.json",
	manifestJsonFileName: "sacManifest.json",
	incManifestJsonFileName: "incEvidenceManifest.json",
	errorFileName: "Errors.txt"
}