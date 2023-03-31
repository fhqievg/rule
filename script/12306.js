let obj = JSON.parse($response.body);
let body = '{"code":"00","message":"无广告返回"}';
if (typeof obj.advertParam != 'undefined' && typeof obj.advertParam.showSkipBtn != 'undefined') {
    if (obj.advertParam.showSkipBtn == 1) {
        //0007
        body = '{"code":"00","materialsList":[{"billMaterialsId":"255","filePath":"h","creativeType":1}],"advertParam":{"skipTime":1}}';
    } else {
        //G0054
        body = '{"code":"00","materialsList":[]}';
    }
}
$done({ body });

