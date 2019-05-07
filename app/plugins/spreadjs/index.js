var gc = require('@grapecity/spread-sheets');

// var ssLicense = process.env.npm_package_config_SPREADJS_LICENSE.replace (/(^")|("$)/g, '')
// gc.Spread.Sheets.LicenseKey = ssLicense;

var onLoadInitializeSpreadSheet = function (id, data, license) {
    gc.Spread.Sheets.LicenseKey = license.replace (/(^")|("$)/g, '');

    var spread = new gc.Spread.Sheets.Workbook(document.getElementById(id));
    try {
        spread.fromJSON(JSON.parse(data));
        spread.getActiveSheet().clearSelection();
        
        setTimeout(() => {
            spread.suspendPaint();
            spread.getActiveSheet().options.isProtected = true;
            spread.getActiveSheet().getRange(0, 0, spread.getActiveSheet().getRowCount(), spread.getActiveSheet().getColumnCount(), gc.Spread.Sheets.SheetArea.viewport).locked(true);
            spread.getActiveSheet().clearSelection()
            spread.resumePaint();
        }, 500);
    } catch(e) {
        // 
    }

    if($(".modal-content-container-span") && $(".modal-content-container-span").hide) $(".modal-content-container-span").hide();
}
window.onLoadInitializeSpreadSheet = onLoadInitializeSpreadSheet;