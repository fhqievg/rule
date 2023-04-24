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
        obj.data.pengpaiSelectPopularizeList = [];
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
    if (contList.length === 0) {
        return contList;
    }

    let handleResult = [];
    for (let i in contList) {
        if (typeof contList[i].cardMode == 'undefined') {
            handleResult.push(contList[i]);
            continue;
        }

        //头部轮播文章：103
        switch (contList[i].cardMode) {
            case '106':
                //中间模块
                contList[i].childList = contList[i].childList.filter(
                    (item) =>
                        //item.cardMode != '107'  //24h
                        //item.cardMode != '108'  //早晚
                        //item.cardMode != '109'  //消费
                        //item.cardMode != '110'  //热评
                        item.cardMode != '133'  //填字
                );
                handleResult.push(contList[i]);
                break;
            default:
                //过滤头部文章(102)、ad(5)、专题(117)、官方网站(121)
                let filterArr = ['102','5','117','121'];
                if(filterArr.indexOf(contList[i].cardMode) === -1){
                    handleResult.push(contList[i]);
                }
                break;
        }
    }

    return handleResult;
}
