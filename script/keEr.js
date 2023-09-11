if (!$response.body) $done({});
let url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes('Aios/config') || url.includes('Aios/clothes') || url.includes('Aios/Climber')) {
    if (typeof obj.gonggao != 'undefined') {
        obj.gonggao.open = false;
    }
    
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
        
        if (typeof obj.data.newAPPAids != 'undefined' && obj.data.newAPPAids.length > 0) {
            obj.data.newAPPAids = obj.data.newAPPAids.filter(
                (i) =>
                    i.type === "1"
            );
        }
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

        if (obj.banner.length === 0) {
            let newData = {
                "vod_url": "",
                "vod_title": "",
                "vod_type": 0,
                "vod_pic": "https://t7.baidu.com/it/u=2722048286,215476551&fm=193&f=JPG&w=900&h=383"
            };
            obj.banner.push(newData);
        }
    }
    
    if (typeof obj.homeicon != 'undefined') {
        obj.homeicon = [];
    }
}
$done({ body: JSON.stringify(obj) });