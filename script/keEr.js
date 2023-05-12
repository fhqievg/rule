if (!$response.body) $done({});
let url = $request.url;
let obj = JSON.parse($response.body);

console.log('top1');
console.log(url);

if (url.includes('Aios/config')) {
    if (typeof obj.update != 'undefined') {
        //obj.update.open = 'false';  //更新提醒
    }

    if (typeof obj.adconfignew != 'undefined') {
        obj.adconfignew.kaiping = false;
        obj.adconfignew.homecha = false;
        obj.adconfignew.xiangqingcha = false;
        //obj.adconfignew.hengfu = false;
        obj.adconfignew.xiazaijili = false;
        obj.adconfignew.bofangjili = false;
        obj.adconfignew.adtime = 0;
    }
}

if (url.includes('adver/space/all/list')) {
    if (typeof obj.data != 'undefined') {
        obj.data.bindAdvertIds = [];
        delete obj.data.bindAppIds;
    }
}

if (url.includes('adver/data/insert')) {
    if (typeof obj.data != 'undefined') {
        obj.data = null;
    }
}

console.log('top2');
console.log(JSON.stringify(obj));
$done({ body: JSON.stringify(obj) });
