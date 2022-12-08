const TITLE = 'title';
const NAME = 'name';

var obj = JSON.parse($response.body);
if (typeof obj.overview == 'undefined' || obj.overview == null || obj.overview == '') {
    //let logMsg = $request.url + "\r\n\r\n\r\n" + $response.body;
    //$notification.post("匹配失败", "接口无overview参数", logMsg);
    $done({});
}

let type = isTitleOrName(obj);
let titleOrName = getTitleOrName(type, obj);
let isTranslateTitleResult = isTranslateTitle(titleOrName);

let titleNumber = '';
let dataTime = '';
if (type !== '') {
    obj.overview = isTranslateTitleResult ? titleOrName + '. ' + obj.overview : obj.overview;
    switch (type) {
        case TITLE:
            if (isTranslateTitleResult) {
                titleNumber = regNumber(obj.title, true);
            }
            dataTime = obj.release_date ? obj.release_date : ''
            break;
        case NAME:
            if (isTranslateTitleResult) {
                titleNumber = regNumber(obj.name, true);
            }
            dataTime = obj.first_air_date ? obj.first_air_date : ''
            break;
        default:
            break;
    }
}

let options = {
    url: "https://translate.google.com/translate_a/single?client=it&dt=qca&dt=t&dt=rmt&dt=bd&dt=rms&dt=sos&dt=md&dt=gt&dt=ld&dt=ss&dt=ex&otf=2&dj=1&hl=en&ie=UTF-8&oe=UTF-8&sl=auto&tl=zh-CN",
    headers: {"User-Agent": "GoogleTranslate/6.29.59279 (iPhone; iOS 15.4; en; iPhone14,2)"},
    body: `q=${encodeURIComponent(obj.overview)}`
}
$httpClient.post(options, function (error, response, data) {
    if (error) {
        $notification.post("请求失败", "请求翻译接口失败", error);
        $done({});
    }

    let trans = JSON.parse(data);
    if (typeof trans.sentences == 'undefined' || trans.sentences.length == 0) {
        $done({});
    }

    let str = '';
    for (var i in trans.sentences) {
        if (typeof trans.sentences[i].trans == 'undefined') {
            continue;
        }

        let googleTrans = trans.sentences[i].trans;
        if (i > 0 || type === '' || (!isTranslateTitleResult && dataTime === '')) {
            str += googleTrans;
            continue;
        }

        if (!isTranslateTitleResult && dataTime !== '') {
            str += '上映日期：' + dataTime + "\r\n\r\n";
            continue;
        }

        googleTrans = rtrim(googleTrans);
        googleTrans = googleTrans.replace(/(。+)$/g, '') + titleNumber;
        switch (type) {
            case TITLE:
                obj.title = googleTrans;
                break;
            case NAME:
                obj.name = googleTrans;
                break;
            default:
                break;
        }

        titleOrName = titleNumber !== '' ? titleOrName + ' ' + titleNumber : titleOrName;
        let newTitle = googleTrans + '（' + titleOrName + '）';
        str += '片名：' + newTitle + "\r\n";
        str += dataTime !== '' ? '上映日期：' + dataTime + "\r\n" : '';
        str += "\r\n";
    }
    if (str !== '') {
        obj.overview = str;
    }
    $done({body: JSON.stringify(obj)});
})

function isTitleOrName(obj) {
    let type = '';
    if (checkTitleStatus(obj)) {
        return TITLE;
    }

    if (checkNameStatus(obj)) {
        return NAME;
    }
    return type
}

function checkTitleStatus(obj) {
    return (typeof obj.title != 'undefined' && obj.title != null && obj.title != '');
}

function checkNameStatus(obj) {
    return (typeof obj.name != 'undefined' && obj.name != null && obj.name != '');
}

function getTitleOrName(type, obj) {
    if (type === '') {
        return '';
    }

    switch (type) {
        case TITLE:
            return strHandle(obj.title);
        case NAME:
            return strHandle(obj.name);
        default:
            return '';
    }
}

function rtrim(str) {
    return str.replace(/(\s+)$/g, '');
}

function strTrim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, '');
}

function delSpot(str) {
    return str.replace(/(\.+)$/g, '');
}

function regNumber(str, isTrim) {
    if (isTrim) {
        str = strTrimHandle(str);
    }
    let reg = /(\d+)$/g
    let result = reg.exec(str);
    return result ? result[1] : '';
}

function strHandle(str) {
    str = strTrimHandle(str);
    let number = regNumber(str, false);
    return rtrim(str.substr(0, str.length - number.length));
}

function isTranslateTitle(str) {
    if (str === '') {
        return false;
    }

    let number = regNumber(str, false);
    return str.length !== number.length;
}

function strTrimHandle(str) {
    str = strTrim(str);
    return rtrim(delSpot(str));
}
