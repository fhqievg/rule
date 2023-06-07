const API_SPLIT = '-';
const FIXED = 2;  //保留小数
const ENABLE_RATES_SHOW = true;

//策略规则
//1xx：轮流切换，2xx：指定接口
//100：每4小时；  101：每天；   102：每半个月
//200：指定第一个；  201：指定第二个；....以此类推
const API_CONFIG = {
    "A": {
        "tactic": 201,
        "information": [
            {"apiInterface": "v4", "apiUrl": "https://api.exchangerate-api.com/v4/latest/CNY"},
            {"apiInterface": "v6", "apiUrl": "https://open.er-api.com/v6/latest/CNY"},
        ]
    },
    "B": {
        "tactic": 100,
        "information": [
            //&currencies=CNY
            {
                "apiInterface": "vu",
                "apiUrl": "http://api.currencylayer.com/live?access_key=5298ce0787f0c48e3810e8aa1cd78ed6&format=1"
            },
            {
                "apiInterface": "vc",
                "apiUrl": "http://api.currencylayer.com/live?access_key=17d6fd122f9fd245212d82a67a130ccc&format=1"
            },
        ]
    }
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

let options = {
    url: apiInformation.apiUrl
}
$httpClient.get(options, function (error, response, data) {
    if (error) {
        $notification.post("请求失败", "", error);
        $done();
    }

    let obj = JSON.parse(data);
    let lastTime = '';
    let amount = '';
    let configKeys = Object.keys(API_CONFIG);
    switch (apiInformation.group) {
        case configKeys[0]:
            if (typeof obj.result != 'undefined' && obj.result === "error") {
                $notification.post("接口错误", "", obj["error-type"]);
                $done();
            }

            if (typeof obj.rates.USD === 'undefined') {
                $notification.post('接口错误', '', '未返回美元汇率');
                $done();
            }

            lastTime = (apiInformation.apiInterface === "v4") ? obj.time_last_updated : obj.time_last_update_unix;
            amount = rateConversion(obj.rates.USD);
            break;
        case configKeys[1]:
            if (typeof obj.success != 'undefined' && !obj.success) {
                $notification.post("接口错误", "", obj.error.info);
                $done();
            }

            if (typeof obj.quotes.USDCNY === 'undefined') {
                $notification.post("接口错误", "", "未返回人民币");
                $done();
            }

            lastTime = obj.timestamp;
            amount = obj.quotes.USDCNY;
            break;
        default:
            break;
    }

    let title = timestampToTime(lastTime, "t") + "[" + apiInformation.apiInterface + "]";
    let lastTimeStr = "最后更新时间：" + timestampToTime(lastTime, "h");
    let msg = "🇺🇸1美元  \t人民币:" + amountFixed(amount);
    if (ENABLE_RATES_SHOW) {
        msg += "(" + amount + ")";
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
                if (tactic !== 100 && tactic !== 101 && tactic !== 102) {
                    return false;
                }
                result = {"informationIndex": getIndexByTactic(tactic)};
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
    switch (tactic) {
        case 100:
            let hours = getData("h");   //获取当前小时
            return (hours % 4 === 0) ? 0 : 1;
        case 101:
        case 102:
            let day = getData("d");   //获取当前日期
            if (tactic === 101) {
                return (day % 2 === 0) ? 0 : 1;
            } else {
                return (day <= 15) ? 0 : 1;
            }
        default:
            //指定接口
            tactic = tactic.toString();
            return Number(tactic.substring(1));
    }
}

function getData(designate) {
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
