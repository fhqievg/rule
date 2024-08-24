const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes('/api/config/getInfo.action')) {
    //版本检测
    if(obj?.data?.length > 0) {
        for (let i in obj.data) {
            if (obj.data[i].num === "IOS_VERSION") {
                obj.data[i].upgradeExp = "";
                obj.data[i].tipRate = 0;
                obj.data[i].upgradeForce = 0;
                obj.data[i].value = "v4.0.0";
                obj.data[i].version = "v4.0.0";
           }
        }
    }
}

$done({ body: JSON.stringify(obj) });