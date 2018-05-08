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
	
	setData(data) {
		Object.assign(this.data, data);
		this.data = data;
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
		this.uploadedFileName = filename;

		if(filepath)
			this.uploadedFilePath = filepath;
	}

	setUploadedEvidenceFlag(isUploaded){
		this.uploadedEvidence = isUploaded;

		// should reset error if evidence flag === false
		if(isUploaded === false) this.setError("");
	}
	
	setError(err) {
		this.error = err;
	}
	
	getError() {
		return this.error;
	}

	getData() {
		return this.data;
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