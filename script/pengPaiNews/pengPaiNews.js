let obj = JSON.parse($response.body);
let url = $request.url;

//启动APP
if (url.includes('loading')) {
    if (typeof obj.config.pengpaiShoppingDesc != 'undefined') {
        obj.config.pengpaiShoppingDesc = '';
    }
    if (typeof obj.config.pengpaiShoppingUrl != 'undefined') {
        obj.config.pengpaiShoppingUrl = '';
    }

    if (typeof obj.reqAddressInfo.coverReviewUrl != 'undefined') {
        obj.reqAddressInfo.coverReviewUrl = '';
    }
    if (typeof obj.reqAddressInfo.ipadLaunchAdUrl != 'undefined') {
        obj.reqAddressInfo.ipadLaunchAdUrl = '';
    }
    if (typeof obj.reqAddressInfo.launchAdUrl != 'undefined') {
        obj.reqAddressInfo.launchAdUrl = '';
    }

    if (typeof obj.versionInfo.updateType != 'undefined') {
        obj.versionInfo.updateType = '0';
    }
    if (typeof obj.versionInfo.versionCode != 'undefined') {
        obj.versionInfo.versionCode = '401';
    }
    if (typeof obj.versionInfo.versionName != 'undefined') {
        obj.versionInfo.versionName = '4.0.1';
    }
}

//头部/首页、翻页、分类
if (url.includes('channelContList') || url.includes('home_page_rcmd') || url.includes('categoryContList') || url.includes('channelList') || url.includes('nodeList')) {
    if (typeof obj.winAdUrl != 'undefined') {
        obj.winAdUrl = '';
    }

    if (typeof obj.wholeTitleAdUrl != 'undefined') {
        obj.wholeTitleAdUrl = '';
    }

    obj = deleteAdUrl(obj);
    if (typeof obj.contList != 'undefined') {
        let nodeName = (typeof obj.nodeName != 'undefined') ? obj.nodeName : '';
        obj.contList = dataHandle(obj.contList, nodeName);
    }
}

//个人中心
if (url.includes('popularize')) {
    if (typeof obj.data.pengpaiSelectPopularizeList != 'undefined') {
        obj.data.pengpaiSelectPopularizeList = [];
    }

    if (typeof obj.data.pengpaiShoppingConfig != 'undefined') {
        delete obj.data.pengpaiShoppingConfig;
    }

    if (typeof obj.data.pengpaiShoppingPopularizeList != 'undefined') {
        delete obj.data.pengpaiShoppingPopularizeList;
    }
}

//详情
if (url.includes('newDetail')) {
    obj = deleteAdUrl(obj);
    if (typeof obj.floatingAdUrl != 'undefined') {
        obj.floatingAdUrl = '';
    }

    if (typeof obj.wholeTitleAdUrl != 'undefined') {
        obj.wholeTitleAdUrl = '';
    }

    if (typeof obj.winAdUrl != 'undefined') {
        obj.winAdUrl = '';
    }

    if (typeof obj.stickerAdUrl != 'undefined') {
        obj.stickerAdUrl = '';
    }

    if (typeof obj.rewardObj.title != 'undefined') {
        obj.rewardObj.title = '';
    }
    if (typeof obj.rewardObj.total != 'undefined') {
        obj.rewardObj.total = '';
    }
    if (typeof obj.rewardObj.userList != 'undefined') {
        obj.rewardObj.userList = [];
    }
}

//其它
if (url.includes('getTopBarData')) {
    if (typeof obj.data.adData != 'undefined') {
        delete obj.data.adData;
    }
}

$done({ body: JSON.stringify(obj) });

function dataHandle(contList, nodeName) {
    if (contList.length === 0) {
        return contList;
    }

    let handleResult = [];
    for (let i in contList) {
        if (typeof contList[i].cardMode == 'undefined') {
            handleResult.push(contList[i]);
            continue;
        }

        //轮播文章：103
        switch (contList[i].cardMode) {
            case '106':
                //中间模块
                contList[i].childList = contList[i].childList.filter(
                    (item) =>
                        //item.cardMode != '107' && //24h
                        //item.cardMode != '108' && //早晚
                        //item.cardMode != '109' && //消费
                        //item.cardMode != '110' && //热评
                        item.cardMode != '133'  //填字
                );
                handleResult.push(contList[i]);
                break;
            default:
                //过滤头部文章(102)、ad(5)、专题(117)、宣传栏(121)
                let filterArr = ['102', '5', '121'];
                if (nodeName != '专题') {
                    filterArr.push('117');
                }
                if (filterArr.indexOf(contList[i].cardMode) === -1) {
                    handleResult.push(contList[i]);
                }
                break;
        }
    }

    return handleResult;
}

function deleteAdUrl(obj) {
    for (i = 0; i < 5; i++) {
        if (i === 0) {
            i = '';
        }
        if (typeof obj['adUrl' + i] != 'undefined') {
            obj['adUrl' + i] = '';
        }
    }
    return obj;
}
