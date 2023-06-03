const V4 = 'v4';
const V6 = 'v6';
const VU = 'vu';
const VC = 'vc';
const API_URL = {
    "v4": "https://api.exchangerate-api.com/v4/latest/CNY",
    "v6": "https://open.er-api.com/v6/latest/CNY",
    "vu": "http://api.currencylayer.com/live?access_key=5298ce0787f0c48e3810e8aa1cd78ed6&format=1",  //&currencies=CNY
    "vc": "http://api.currencylayer.com/live?access_key=17d6fd122f9fd245212d82a67a130ccc&format=1"  //&currencies=CNY
}

let apiInterface = getApiInterface($argument);
let options = {
    url: API_URL[apiInterface]
}
$httpClient.get(options, function (error, response, data) {
    if (error) {
        $notification.post("请求汇率失败", "", error);
        $done();
    }

    let obj = JSON.parse(data);
    let lastTime = '';
    let rates = '';
    switch (apiInterface) {
        case V4:
        case V6:
            if (typeof obj.result != 'undefined' && obj.result === "error") {
                $notification.post("汇率接口返回错误", "", obj["error-type"]);
                $done();
            }

            if (typeof obj.rates.USD === 'undefined'){
                $notification.post('汇率接口错误', '', '接口未返回美元汇率');
                $done();
            }

            lastTime = (apiInterface === V4) ? obj.time_last_updated : obj.time_last_update_unix;
            rates = obj.rates.USD;
            break;
        case VU:
        case VC:
            if (typeof obj.success != 'undefined' && !obj.success) {
                $notification.post("汇率接口返回错误", "", obj.error.info);
                $done();
            }

            if (typeof obj.quotes.USDCNY === 'undefined'){
                $notification.post('汇率接口错误', '', '接口未返回人民币');
                $done();
            }

            lastTime = obj.timestamp;
            rates = obj.quotes.USDCNY;
            break;
        default:
            break;
    }

    let title = timestampToTime(lastTime, "t") + "[" + apiInterface + "]";
    let lastTimeStr = "最后更新时间：" + timestampToTime(lastTime, "h");
    let msg = "🇺🇸1美元  \t人民币:" + getCurrency(apiInterface, rates)+"("+rates+")";

    $notification.post(title, lastTimeStr, msg);
    $done();
})

function getApiInterface(argument) {
    switch (argument) {
        case 'v4':
            return V4;
        case 'v6':
            return V6;
        case 'vu':
            return VU;
        case 'vc':
            return VC;
        default:
            break;
    }
}

function getCurrency(apiInterface, rate) {
    switch (apiInterface) {
        case V4:
        case V6:
            return (1 / rate).toFixed(2);
        case VU:
        case VC:
            return rate.toFixed(2);
        default:
            return '';
    }
}

function timestampToTime(timestamp, type) {
    let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    switch (type) {
        case "t":
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            return Y + M + D;
        case "h":
            let hours = date.getHours();
            let h = (hours < 10 ? '0' + hours : hours) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return h + m + s;
        default:
            break;
    }
}
