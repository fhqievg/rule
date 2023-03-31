console.log("top10");
let body = '{"code":"00","message":"无广告返回"}';
console.log($request.url);
console.log($request);
console.log("top6");
if(!$request.body){
    $done({ body });
}
let obj = JSON.parse($request.body);
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

