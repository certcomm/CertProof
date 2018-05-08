import { observable } from "mobx"

export class ThreadStore {
	@observable thread = {};
	
	setData(data) {
		this.thread = data;
	}

	setError(err) {
		this.error = err;
	}
	
	getError() {
		return this.error;
	}

	getData() {
		return this.thread;
	}
}
export default new ThreadStore