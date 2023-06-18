const API_SPLIT = '-';
const FIXED = 2;  //保留小数位数
const ENABLE_RATES_SHOW = true; //是否显示转换后的原始金额(未处理小数)
const MAX_FIXED = 6;  //原始金额最长小数位数
//订阅转换
const CONVERSION_TO = "->";   //转配置的基准货币
const CONVERSION_FROM = "<-";   //从配置的基准货币转
const SUBSCRIBE_CONVERSION = [
    ["🇺🇸", "美元", "USD", CONVERSION_TO],    //USD -> CNY
    ["🇯🇵", "日元", "JPY", CONVERSION_FROM],  //CNY <- JPY =====> CNY -> JPY
    ["🇹🇷", "土耳其里拉", "TRY", CONVERSION_FROM]  //CNY <- TRY =====> CNY -> TRY
]

//策略规则
//1xx：轮流切换，2xx：指定接口
//100：每4小时； 101：每天； 102：每半个月
//200：指定第一个； 201：指定第二个；....以此类推
//apiInterface不能是纯数字，推荐以v开头
//eg:A-101，A-v6
const TACTIC_HANDOFF = [100, 101, 102];
const API_CONFIG = {
    "A": {
        "tactic": 201,
        "isCode": true,
        "isRateConversion": true,    //是否返回的是汇率，需要进行转换
        "isBaseConnect": false,  //返回的汇率数据字段是否有连接基准货币，eg：USDCNY\CNY
        "information": [
            {"apiInterface": "v4", "apiUrl": "aHR0cHM6Ly9hcGkuZXhjaGFuZ2VyYXRlLWFwaS5jb20vdjQvbGF0ZXN0L0NOWQ=="},
            {"apiInterface": "v6", "apiUrl": "aHR0cHM6Ly9vcGVuLmVyLWFwaS5jb20vdjYvbGF0ZXN0L0NOWQ=="}
        ]
    },
    "B": {
        "tactic": TACTIC_HANDOFF[0],
        "isCode": true,
        "isRateConversion": false,   //返回的是金额
        "isBaseConnect": true,
        "information": [
            {
                "apiInterface": "vu",
                "apiUrl": "aHR0cDovL2FwaS5jdXJyZW5jeWxheWVyLmNvbS9saXZlP2FjY2Vzc19rZXk9NTI5OGNlMDc4N2YwYzQ4ZTM4MTBlOGFhMWNkNzhlZDYmc291cmNlPVVTRCZmb3JtYXQ9MQ=="
            },
            {
                "apiInterface": "vc",
                "apiUrl": "aHR0cDovL2FwaS5jdXJyZW5jeWxheWVyLmNvbS9saXZlP2FjY2Vzc19rZXk9MTdkNmZkMTIyZjlmZDI0NTIxMmQ4MmE2N2ExMzBjY2Mmc291cmNlPVVTRCZmb3JtYXQ9MQ=="
            }
        ]
    }
}

//结果基准货币
const CONVERSION_BASE = {
    "currency": "CNY",
    "name": "人民币"
}

let resultResponse = {
    "success": true, //接口状态，true:成功   false:失败
    "errMsg": "",    //失败原因，false时返回
    "lastTime": "",  //最后更新时间
    "base": "",  //接口返回的基准货币
    "erObj": [] //订阅汇率对象，金额需转换处理，eg：[{"curreny":"USD","country":"🇺🇸","name":"美元","amount":"222.77（222.76599）","type":"->"}],
}

if (typeof $argument === 'undefined' || $argument === null || $argument === '') {
    $notification.post("传参错误", "", "请传入argument参数");
    $done();
}
const ARGUMENT = $argument;
let apiInformation = getApiInformation();
if (apiInformation === false) {
    $done();
}

let apiUrl = "";
if (API_CONFIG[apiInformation.group].isCode) {
    let code = new StrCode();
    apiUrl = code.decode(apiInformation.apiUrl);
} else {
    apiUrl = apiInformation.apiUrl;
}
let options = {
    url: apiUrl
}
$httpClient.get(options, function (error, response, data) {
    if (error) {
        $notification.post("请求失败", "", error);
        $done();
    }

    let obj = JSON.parse(data);
    let functionName = "getResultBy" + apiInformation.group;
    let result = eval(functionName)(obj, apiInformation, API_CONFIG[apiInformation.group]);
    if (result.success === false) {
        $notification.post("接口错误", "", result.errMsg);
        $done();
    }

    let title = timestampToTime(result.lastTime, "y") + "[" + apiInformation.apiInterface + "] [" + result.base + "]";
    let lastTimeStr = "最后更新时间：" + timestampToTime(result.lastTime, "h");
    let msg = "";
    let num = result.erObj.length - 1;
    for (let i in result.erObj) {
        switch (result.erObj[i].type) {
            case CONVERSION_TO:
                msg += `${result.erObj[i].country}1${result.erObj[i].name}   \t${CONVERSION_BASE.name}:${result.erObj[i].amount}`;
                break;
            case CONVERSION_FROM:
                msg += `${result.erObj[i].country}1${CONVERSION_BASE.name}   \t${result.erObj[i].name}:${result.erObj[i].amount}`;
                break;
        }
        if (Number(i) !== num) {
            msg += "\r\n";
        }
    }

    $notification.post(title, lastTimeStr, msg);
    $done();
})

function getApiInformation() {
    let status = false;
    let errorMsg = '';
    let information = {};
    if (checkIsManualSelection()) {
        //手动选择
        let arr = ARGUMENT.split(API_SPLIT)
        if (!checkGroup(arr[0])) {
            errorMsg = '不存在分组' + arr[0];
        } else {
            let checkResult = checkTactic(arr[0], arr[1]);
            if (checkResult === false) {
                errorMsg = '不存在策略' + arr[1];
            } else {
                status = true;
                information = API_CONFIG[arr[0]].information[checkResult.informationIndex];
                information.informationIndex = checkResult.informationIndex;
                information.group = arr[0];
            }
        }
    } else {
        //按配置
        if (!checkGroup(ARGUMENT)) {
            errorMsg = '不存在分组' + ARGUMENT;
        } else {
            status = true;
            information = getInformationByConfig(ARGUMENT);
            information.group = ARGUMENT;
        }
    }

    if (status) {
        return information;
    } else {
        $notification.post('传参错误', '', errorMsg);
        return false;
    }
}

function checkIsManualSelection() {
    return ARGUMENT.includes(API_SPLIT);
}

function checkGroup(group) {
    return (typeof API_CONFIG[group] != 'undefined');
}

function checkTactic(group, tactic) {
    //判断是指定策略还是接口
    if (!isNaN(parseFloat(tactic)) && isFinite(tactic)) {
        //指定策略
        let first = tactic.substring(0, 1);  //取第一位
        let result = {};
        switch (first) {
            case "1":
                tactic = Number(tactic);
                if (TACTIC_HANDOFF.indexOf(tactic) === -1) {
                    return false;
                }
                result = {"informationIndex": getIndexByTactic(tactic, group)};
                break;
            case "2":
                let index = Number(tactic.substring(1));
                if (typeof API_CONFIG[group].information[index] === 'undefined') {
                    return false;
                }
                result = {"informationIndex": index};
                break;
            default:
                return false;
        }
        return result;
    } else {
        //指定接口
        let isMatch = false;
        let index = 0;
        for (let i in API_CONFIG[group].information) {
            if (API_CONFIG[group].information[i].apiInterface === tactic) {
                isMatch = true;
                index = Number(i);
            }
        }
        let result = {"informationIndex": index};
        return isMatch ? result : false;
    }
}

function getInformationByConfig(group) {
    let index = getIndexByTactic(API_CONFIG[group].tactic, group);
    let information = API_CONFIG[group].information[index];
    information.informationIndex = index;
    return information;
}

function getIndexByTactic(tactic, group) {
    let number = API_CONFIG[group].information.length;
    switch (tactic) {
        case TACTIC_HANDOFF[0]:
            let hours = getDateInfo("h");   //获取当前小时
            return (hours % 4 === 0) ? 0 : (number > 1 ? 1 : 0);
        case TACTIC_HANDOFF[1]:
        case TACTIC_HANDOFF[2]:
            let day = getDateInfo("d");   //获取当前日期
            if (tactic === TACTIC_HANDOFF[1]) {
                return (day % 2 === 0) ? 0 : (number > 1 ? 1 : 0);
            } else {
                return (day <= 15) ? 0 : (number > 1 ? 1 : 0);
            }
        default:
            //指定接口
            tactic = tactic.toString();
            return Number(tactic.substring(1));
    }
}

function getDateInfo(designate) {
    let currDate = new Date();
    switch (designate) {
        case "d":
            return currDate.getDate();
        case "h":
            return currDate.getHours();
        default:
            break;
    }
}

function rateConversion(rate) {
    return 1 / rate;
}

function amountFixed(amount) {
    return amount.toFixed(FIXED);
}

function amountHandle(amount) {
    let newAmount = amountFixed(amount);
    if (amount.toString().includes(".")) {
        let split = amount.toString().split(".");
        if (typeof split[1] != 'undefined' && split[1].length > MAX_FIXED) {
            amount = amount.toFixed(MAX_FIXED);
        }
    }
    return ENABLE_RATES_SHOW ? newAmount + "（" + amount + "）" : newAmount;
}

function timestampToTime(timestamp, type) {
    let date = '';
    let len = timestamp.toString().length;
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    if (len === 10) {
        date = new Date(timestamp * 1000);
    } else {
        date = new Date(timestamp);
    }

    switch (type) {
        case "y":
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            return M + D;
        case "h":
            let hours = date.getHours();
            let h = (hours < 10 ? '0' + hours : hours) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return h + m + s;
        default:
            return '';
    }
}

function getEr(rates, base, apiConfig) {
    let erObj = [];
    for (let i in SUBSCRIBE_CONVERSION) {
        let subscribeConfigObj = SUBSCRIBE_CONVERSION[i];
        let key = apiConfig.isBaseConnect ? (base === subscribeConfigObj[2] ? subscribeConfigObj[2] : base + subscribeConfigObj[2]) : subscribeConfigObj[2];
        if (typeof rates[base] === 'undefined') {
            rates[base] = 1;
        }
        if (typeof rates[key] != 'undefined') {
            let er = {
                "curreny": subscribeConfigObj[2],
                "country": subscribeConfigObj[0],
                "name": subscribeConfigObj[1],
                "type": subscribeConfigObj[3]
            }

            //处理金额
            let pendingAmount = 0;
            switch (base) {
                case CONVERSION_BASE.currency:
                    switch (er.type) {
                        case CONVERSION_TO:
                            pendingAmount = apiConfig.isRateConversion ? rateConversion(rates[key]) : rates[key];
                            break;
                        case CONVERSION_FROM:
                            pendingAmount = rates[key];
                            break;
                        default:
                            break;
                    }
                    break;
                case "USD":
                    let cny = (typeof rates[base + CONVERSION_BASE.currency] != 'undefined') ? rates[base + CONVERSION_BASE.currency] : ((typeof rates[CONVERSION_BASE.currency] != 'undefined') ? rates[CONVERSION_BASE.currency] : 0);
                    switch (er.type) {
                        case CONVERSION_TO:
                            pendingAmount = cny;
                            break;
                        case CONVERSION_FROM:
                            pendingAmount = rates[key] / cny;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            er.amount = amountHandle(pendingAmount);
            erObj.push(er);
        }
    }
    return erObj;
}

function getResultByA(obj, apiInformation, apiConfig) {
    if (typeof obj.result != 'undefined' && obj.result === "error") {
        resultResponse.success = false;
        resultResponse.errMsg = obj["error-type"];
        return resultResponse;
    }

    if (typeof obj.rates.USD === 'undefined') {
        resultResponse.success = false;
        resultResponse.errMsg = "未返回美元汇率";
        return resultResponse;
    }

    resultResponse.lastTime = (apiInformation.apiInterface === "v4") ? obj.time_last_updated : obj.time_last_update_unix;
    resultResponse.base = (apiInformation.apiInterface === "v4") ? obj.base : obj.base_code;
    resultResponse.erObj = getEr(obj.rates, resultResponse.base, apiConfig);
    return resultResponse;
}

function getResultByB(obj, apiInformation, apiConfig) {
    if (typeof obj.success != 'undefined' && !obj.success) {
        resultResponse.success = false;
        resultResponse.errMsg = obj.error.info;
        return resultResponse;
    }

    if (typeof obj.quotes.USDCNY === 'undefined') {
        resultResponse.success = false;
        resultResponse.errMsg = "未返回人民币";
        return resultResponse;
    }

    resultResponse.lastTime = obj.timestamp;
    resultResponse.base = obj.source;
    resultResponse.erObj = getEr(obj.quotes, resultResponse.base, apiConfig);
    return resultResponse;
}

function StrCode(){var _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var _utf8_encode=function(string){var utftext="",c,n;string=string.replace(/\r\n/g,"\n");for(n=0;n<string.length;n++){c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c)}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128)}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128)}}return utftext};var _utf8_decode=function(utftext){var string="",i=0,c=0,c1=0,c2=0;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++}else if((c>191)&&(c<224)){c1=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c1&63));i+=2}else{c1=utftext.charCodeAt(i+1);c2=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c1&63)<<6)|(c2&63));i+=3}}return string};var encode=function(input){var output="",chr1,chr2,chr3,enc1,enc2,enc3,enc4,i=0;input=_utf8_encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64}else if(isNaN(chr3)){enc4=64}output+=_keyStr.charAt(enc1);output+=_keyStr.charAt(enc2);output+=_keyStr.charAt(enc3);output+=_keyStr.charAt(enc4)}return output};var decode=function(input){var output="",chr1,chr2,chr3,enc1,enc2,enc3,enc4,i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=_keyStr.indexOf(input.charAt(i++));enc2=_keyStr.indexOf(input.charAt(i++));enc3=_keyStr.indexOf(input.charAt(i++));enc4=_keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output+=String.fromCharCode(chr1);if(enc3!==64){output+=String.fromCharCode(chr2)}if(enc4!==64){output+=String.fromCharCode(chr3)}}return _utf8_decode(output)};return{'encode':encode,'decode':decode}}
