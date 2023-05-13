if (!$response.body) $done({});
let url = $request.url;
let obj = JSON.parse($response.body);

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

if (url.includes('banner.json')) {
    if (typeof obj.banner != 'undefined' && obj.banner.length > 0) {
        obj.banner = obj.banner.filter(
            (i) =>
                i.vod_url.includes('iosapp')
        );
    }
}
$done({ body: JSON.stringify(obj) });
