if (!$response.body) $done({});
let body = $response.body;
let url = $request.url;

let dataObj = getDataObj(body);
let obj = JSON.parse(dataObj.content);
if (url.includes("goocity/city!localCity.action")) {
    //首页
    if (obj.jsonr?.data?.localCity) {
        obj.jsonr.data.localCity.bcPointList = [];

        //顶部icon
        if (typeof obj.jsonr.data.localCity.homePointList != 'undefined') {
            obj.jsonr.data.localCity.homePointList = obj.jsonr.data.localCity.homePointList.filter(
                (i) =>
                    !(
                        i.id === 613 || //免广告
                        i.id === 280 || //今日热点
                        i.id === 299    //小视频
                    )
            );
        }

        //底部tab
        if (typeof obj.jsonr.data.localCity.tabbar != 'undefined') {
            obj.jsonr.data.localCity.tabbar = obj.jsonr.data.localCity.tabbar.filter(
                (i) =>
                    !(
                        i === 5 //发现
                    )
            );
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
