import { observable } from "mobx"

export class CertProofStore {
	@observable rawJson = {
		evidenceJson: {},
		sac: {},
		ssac: {},
		incEvidenceJson: {}
	};
	@observable data = {};
	@observable evidenceManifestData = {};
	@observable uploadedEvidence = false;
	@observable uploadedFileName = '';
	@observable uploadedFilePath = '';
	@observable error = '';
	@observable networkJson = '';
	@observable appDefaultNetworkJson = '';
	
	setData(data) {
		Object.assign(this.data, data);
		this.data = data;
	}
	
	setNetworkJson(json) {
		this.networkJson = [...json];
	}
	
	setAppDefaultNetworkJson(json) {
		this.appDefaultNetworkJson = [...json];
	}

	setRawJson(data) {
		switch(data.type){
			case "evidencemanifest":
				this.rawJson.evidenceJson = data.json;
			break;
			case "changeset":
				this.rawJson.sac[data.cnum] = data.json;
			break;
			case "sacchangeset":
				this.rawJson.ssac[data.cnum] = data.json;
			break;
			case "incevidencemanifest":
				this.rawJson.incEvidenceJson[data.cnum] = data.json;
			break;
		}
	}

	setEvidenceManifestData(data) {
		Object.assign(this.evidenceManifestData, data);
		this.evidenceManifestData = data;
	}

	setUploadEvidenceDetails(filename, filepath){
		if(filename)
			this.uploadedFileName = filename;
		else if(filename == null)
			this.uploadedFileName = '';

		if(filepath)
			this.uploadedFilePath = filepath;
		else if(filepath == null)
			this.uploadedFilePath = '';
	}

	setUploadedEvidenceFlag(isUploaded){
		this.uploadedEvidence = isUploaded;

		// should reset error if evidence flag === false
		if(isUploaded === false) this.setError("");
	}
	
	setError(err) {
		this.error = err;
	}

	resetRawJson(){
		this.rawJson = {
			evidenceJson: {},
			sac: {},
			ssac: {},
			incEvidenceJson: {}
		};
	}
	
	getError() {
		return this.error;
	}

	getData() {
		return this.data;
	}

	getNetworkJson() {
		return this.networkJson;
	}

	getAppDefaultNetworkJson() {
		return this.appDefaultNetworkJson;
	}

	getRawJson() {
		return this.rawJson;
	}
	
	getEvidenceManifestData() {
		return this.evidenceManifestData;
	}
	
	getFileName() {
		return this.uploadedFileName;
	}
	
	getFilePath() {
		return this.uploadedFilePath;
	}
	
	getUploadedEvidenceFlag() {
		return this.uploadedEvidence;
	}
}
export default new CertProofStore