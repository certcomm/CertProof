import { observable } from "mobx"

export class CertProofStore {
	@observable json = {};
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

	setIncJson(cnum, data) {
		this.json[cnum] = data;
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

	getIncJson(data) {
		return this.json;
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