const {remote} = window.require('electron');
const appPath = remote.app.getAppPath();
export function getModulePath(module, v) {
	return appPath+"/app/js/components/Thread/js/components/"+module;
}