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
            cityData.homePointList = pointListHandle(cityData.homePointList);
        }

        //底部tab
        if (typeof cityData.tabbar != 'undefined') {
            cityData.tabbar = tabHandle(cityData.tabbar);
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

if (url.includes("goocity/city!morecities.action")) {
    //切换城市
    if (obj.jsonr?.data?.cities) {
        for (let i of obj.jsonr.data.cities) {
            i.bcPointList = []
            //顶部icon
            if (typeof i.homePointList != 'undefined') {
                i.homePointList = pointListHandle(i.homePointList);
            }

            //底部tab
            if (typeof i.tabbar != 'undefined') {
                i.tabbar = tabHandle(i.tabbar);
            }
        }
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
    dataObj.startStr = body.substring(0, start);

    let end = body.lastIndexOf("}");
    end++;
    dataObj.endStr = body.substring(end);
    
    dataObj.content = body.substring(start, end);
    return dataObj;
}

function pointListHandle(pointList) {
    pointList = pointList.filter(
        (i) =>
            !(
                //i.id === 1 || //地铁
                //i.id === 106 || //站点地图
                i.id === 280 || //今日热点
                i.id === 299 ||  //小视频
                //i.id === 320 ||  //扫码乘车
                //i.id === 332 ||  //定制公交
                //i.id === 441 ||  //辅助公交
                //i.id === 452 ||  //定制公交
                i.id === 493 ||  //现金签到
                i.id === 494 ||  //打车
                //i.id === 516 ||  //九水巴士
                i.id === 543 ||  //失物招领
                //i.id === 565 ||  //网约巴士
                //i.id === 567 ||  //琴岛通
                i.id === 593 ||  //本地景点
                //i.id === 597 ||  //网约巴士
                //i.id === 598 ||  //站点地图
                i.id === 599 ||  //免广告
                i.id === 600 ||  //小视频
                i.id === 613 || //免广告
                i.id === 614 || //充电站
                i.id === 615 || //烧烤导航
                //i.id === 617 || //定制巴士
                //i.id === 619 || //机场快线
                i.id === 620    //绿色出行
            )
    );
    return pointList;
}

function tabHandle(tab) {
    tab = tab.filter(
        (i) =>
            !(
                i === 5 //发现
            )
    );
    return tab;
}
