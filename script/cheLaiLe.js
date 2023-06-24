if (!$response.body) $done({});
let body = $response.body;
let url = $request.url;

let dataObj = getDataObj(body);
let obj = JSON.parse(dataObj.content);
if (url.includes("goocity/city!localCity.action") || url.includes("goocity/city!cityInfo.action")) {
    //首页
    let cityData = {};
    if (url.includes("goocity/city!localCity.action")) {
        if (obj.jsonr?.data?.localCity) {
            cityData = obj.jsonr.data.localCity;
        }
    } else {
        if (obj.jsonr?.data?.city) {
            cityData = obj.jsonr.data.city;
        }
    }

    if (cityData) {
        cityData.bcPointList = [];
        //顶部icon
        if (typeof cityData.homePointList != 'undefined') {
            cityData.homePointList = cityData.homePointList.filter(
                (i) =>
                    !(
                        i.id === 613 || //免广告
                        i.id === 280 || //今日热点
                        i.id === 299    //小视频
                    )
            );
        }

        //底部tab
        if (typeof cityData.tabbar != 'undefined') {
            cityData.tabbar = cityData.tabbar.filter(
                (i) =>
                    !(
                        i === 5 //发现
                    )
            );
        }

        if (url.includes("goocity/city!localCity.action")) {
            obj.jsonr.data.localCity = cityData;
        } else {
            obj.jsonr.data.city = cityData;
        }
    }
}

if (url.includes("goocity/config/notices")) {
    //首页右上角
    if (obj.jsonr?.data?.notice) {
        obj.jsonr.data.notice = obj.jsonr.data.notice.filter(
            (i) =>
                !(
                    i.id === 2 || //今日天气
                    //i.id === 3 || //我的反馈
                    i.id === 5  //本地热点
                )
        );
    }
}

body = dataObj.startStr + JSON.stringify(obj) + dataObj.endStr;
$done({ body });

function getDataObj(body) {
    let dataObj = {
        "startStr": "",
        "content": "",
        "endStr": ""
    }
    let start = body.indexOf("{");
    if (start > -1) {
        dataObj.startStr = body.substring(0, start);
        dataObj.content = body.substring(start);
    }

    let end = body.lastIndexOf("}");
    if (end > -1) {
        dataObj.endStr = body.substring(end + 1);

        let endNum = (end + 1) - dataObj.startStr.length;
        dataObj.content = dataObj.content.substring(0, endNum);
    }
    return dataObj;
}
