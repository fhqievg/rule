let obj = JSON.parse($request.body);
let body = '{"code":"00","message":"无广告返回"}';
if (typeof obj.placementNo != 'undefined') {
    switch (obj.placementNo) {
        case '0007':
            body = '{"code":"00","materialsList":[{"billMaterialsId":"255","filePath":"h","creativeType":1}],"advertParam":{"skipTime":1}}';
            break;
        case 'G0054':
            body = '{"code":"00","materialsList":[]}';
            break;
        default:
            break;
    }
}
$done({ body });
