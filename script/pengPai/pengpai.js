let obj = JSON.parse($response.body);
let url = $request.url;

//头部/首页、翻页
if (url.includes('channelContList') || url.includes('home_page_rcmd')) {
    if (typeof obj.winAdUrl != 'undefined') {
        obj.winAdUrl = '';
    }

    if (typeof obj.contList != 'undefined') {
        obj.contList = dataHandle(obj.contList);
    }
}

//个人中心
if (url.includes('popularize')) {
    if(typeof obj.data.pengpaiSelectPopularizeList != 'undefined'){
        delete obj.data.pengpaiSelectPopularizeList;
    }

    if(typeof obj.data.pengpaiShoppingConfig != 'undefined'){
        delete obj.data.pengpaiShoppingConfig;
    }

    if(typeof obj.data.pengpaiShoppingPopularizeList != 'undefined'){
        delete obj.data.pengpaiShoppingPopularizeList;
    }
}
$done({ body: JSON.stringify(obj) });

function dataHandle(contList) {
    if (contList.length <= 0) {
        return contList;
    }

    let topHandleData = [];
    for (let i in contList) {
        if (typeof contList[i].cardMode != 'undefined') {
            //过滤头部文章、专题(117)
            if (contList[i].cardMode != '102' && contList[i].cardMode != '5' && contList[i].cardMode != '117') {
                topHandleData.push(contList[i]);
            }

            //中间模块
            switch (contList[i].cardMode) {
                case '106':
                    //去掉填字
                    for (let j in contList[i].childList) {
                        if (contList[i].childList[j].cardMode == '133') {
                            contList[i].childList.splice(j, 1);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    return topHandleData;
}
