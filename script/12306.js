let obj = JSON.parse($request.body);
let data = '{"code":"00","message":"无广告返回"}';
let logMsg = $request.url + "\r\n\r\n\r\n" + $request.body;
$notification.post("第一步", "接口参数", logMsg);
if (typeof obj.placementNo != 'undefined') {
    $notification.post("第二步", "placementNo", obj.placementNo);
    switch (obj.placementNo) {
        case '0007':
            data = '{"code":"00","materialsList":[{"billMaterialsId":"255","filePath":"h","creativeType":1}],"advertParam":{"skipTime":1}}';
            break;
        case 'G0054':
            data = '{"code":"00","materialsList":[]}';
            break;
        default:
            break;
    }
    $notification.post("第三步", "data", data);
}
$done({body: data});
