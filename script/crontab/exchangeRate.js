//let mockV4 = '{"provider":"https://www.exchangerate-api.com","WARNING_UPGRADE_TO_V6":"https://www.exchangerate-api.com/docs/free","terms":"https://www.exchangerate-api.com/terms","base":"CNY","date":"2023-05-30","time_last_updated":1685404802,"rates":{"CNY":1,"AED":0.519,"AFN":12.4,"ALL":14.59,"AMD":54.63,"ANG":0.253,"AOA":80.3,"ARS":33.34,"AUD":0.216,"AWG":0.253,"AZN":0.24,"BAM":0.258,"BBD":0.283,"BDT":15.21,"BGN":0.258,"BHD":0.0531,"BIF":399.03,"BMD":0.141,"BND":0.191,"BOB":0.979,"BRL":0.706,"BSD":0.141,"BTN":11.68,"BWP":1.95,"BYN":0.377,"BZD":0.283,"CAD":0.192,"CDF":329.5,"CHF":0.128,"CLP":112.9,"COP":629.24,"CRC":76.51,"CUP":3.39,"CVE":14.54,"CZK":3.12,"DJF":25.11,"DKK":0.984,"DOP":7.74,"DZD":19.35,"EGP":4.37,"ERN":2.12,"ETB":7.72,"EUR":0.132,"FJD":0.318,"FKP":0.114,"FOK":0.984,"GBP":0.114,"GEL":0.365,"GGP":0.114,"GHS":1.67,"GIP":0.114,"GMD":8.36,"GNF":1208.17,"GTQ":1.11,"GYD":29.91,"HKD":1.11,"HNL":3.48,"HRK":0.994,"HTG":19.88,"HUF":48.97,"IDR":2110.7,"ILS":0.526,"IMP":0.114,"INR":11.68,"IQD":185.08,"IRR":6016.72,"ISK":19.69,"JEP":0.114,"JMD":21.89,"JOD":0.1,"JPY":19.82,"KES":19.57,"KGS":12.39,"KHR":579.92,"KID":0.216,"KMF":64.87,"KRW":187.08,"KWD":0.0434,"KYD":0.118,"KZT":62.95,"LAK":2532.27,"LBP":2119.11,"LKR":41.79,"LRD":24.04,"LSL":2.78,"LYD":0.682,"MAD":1.44,"MDL":2.52,"MGA":621.47,"MKD":8.08,"MMK":334.19,"MNT":494.25,"MOP":1.14,"MRU":4.87,"MUR":6.43,"MVR":2.18,"MWK":145.72,"MXN":2.48,"MYR":0.651,"MZN":9.04,"NAD":2.78,"NGN":65.21,"NIO":5.18,"NOK":1.57,"NPR":18.68,"NZD":0.233,"OMR":0.0543,"PAB":0.141,"PEN":0.52,"PGK":0.505,"PHP":7.93,"PKR":40.34,"PLN":0.596,"PYG":1016.32,"QAR":0.514,"RON":0.654,"RSD":15.47,"RUB":11.35,"RWF":165.12,"SAR":0.53,"SBD":1.19,"SCR":1.88,"SDG":63.22,"SEK":1.53,"SGD":0.191,"SHP":0.114,"SLE":3.21,"SLL":3206.74,"SOS":80.4,"SRD":5.24,"SSP":139.12,"STN":3.23,"SYP":355.85,"SZL":2.78,"THB":4.91,"TJS":1.54,"TMT":0.495,"TND":0.437,"TOP":0.335,"TRY":2.84,"TTD":0.961,"TVD":0.216,"TWD":4.33,"TZS":334.21,"UAH":5.22,"UGX":526.26,"USD":0.141,"UYU":5.49,"UZS":1611.14,"VES":3.71,"VND":3327.41,"VUV":17.09,"WST":0.385,"XAF":86.5,"XCD":0.381,"XDR":0.106,"XOF":86.5,"XPF":15.74,"YER":35.39,"ZAR":2.78,"ZMW":2.74,"ZWL":277.82}}'

//let mockV6 = '{"result":"success","provider":"https://www.exchangerate-api.com","documentation":"https://www.exchangerate-api.com/docs/free","terms_of_use":"https://www.exchangerate-api.com/terms","time_last_update_unix":1685404952,"time_last_update_utc":"Tue, 30 May 2023 00:02:32 +0000","time_next_update_unix":1685491822,"time_next_update_utc":"Wed, 31 May 2023 00:10:22 +0000","time_eol_unix":0,"base_code":"CNY","rates":{"CNY":1,"AED":0.51883,"AFN":12.398157,"ALL":14.588694,"AMD":54.63042,"ANG":0.252881,"AOA":80.295705,"ARS":33.340654,"AUD":0.21617,"AWG":0.252881,"AZN":0.240285,"BAM":0.257905,"BBD":0.282549,"BDT":15.214797,"BGN":0.25791,"BHD":0.053119,"BIF":399.027523,"BMD":0.141274,"BND":0.191213,"BOB":0.978806,"BRL":0.706302,"BSD":0.141274,"BTN":11.677481,"BWP":1.947332,"BYN":0.376597,"BZD":0.282549,"CAD":0.192003,"CDF":329.5,"CHF":0.127726,"CLP":112.897046,"COP":629.23668,"CRC":76.505476,"CUP":3.390584,"CVE":14.540051,"CZK":3.123309,"DJF":25.107413,"DKK":0.98376,"DOP":7.742726,"DZD":19.346776,"EGP":4.370449,"ERN":2.119115,"ETB":7.722656,"EUR":0.131865,"FJD":0.317772,"FKP":0.114364,"FOK":0.98376,"GBP":0.114364,"GEL":0.364864,"GGP":0.114364,"GHS":1.672454,"GIP":0.114364,"GMD":8.357802,"GNF":1208.166667,"GTQ":1.105558,"GYD":29.913343,"HKD":1.106445,"HNL":3.478861,"HRK":0.993534,"HTG":19.878428,"HUF":48.970919,"IDR":2110.696104,"ILS":0.525929,"IMP":0.114364,"INR":11.677484,"IQD":185.080851,"IRR":6016.715182,"ISK":19.689024,"JEP":0.114364,"JMD":21.88804,"JOD":0.100163,"JPY":19.822663,"KES":19.572888,"KGS":12.392403,"KHR":579.92,"KID":0.216139,"KMF":64.873135,"KRW":187.079973,"KWD":0.043439,"KYD":0.117729,"KZT":62.953877,"LAK":2532.265626,"LBP":2119.114739,"LKR":41.790176,"LRD":24.039125,"LSL":2.777267,"LYD":0.682312,"MAD":1.443899,"MDL":2.5175,"MGA":621.473901,"MKD":8.082512,"MMK":334.188698,"MNT":494.25,"MOP":1.139642,"MRU":4.865101,"MUR":6.429075,"MVR":2.183343,"MWK":145.724987,"MXN":2.483983,"MYR":0.650775,"MZN":9.037995,"NAD":2.777267,"NGN":65.206956,"NIO":5.175846,"NOK":1.569824,"NPR":18.683969,"NZD":0.233318,"OMR":0.05432,"PAB":0.141274,"PEN":0.519829,"PGK":0.505105,"PHP":7.925385,"PKR":40.342166,"PLN":0.595548,"PYG":1016.317387,"QAR":0.514239,"RON":0.654046,"RSD":15.465648,"RUB":11.350705,"RWF":165.120201,"SAR":0.529779,"SBD":1.193915,"SCR":1.875869,"SDG":63.218023,"SEK":1.528924,"SGD":0.191214,"SHP":0.114364,"SLE":3.206742,"SLL":3206.740778,"SOS":80.395564,"SRD":5.241504,"SSP":139.115241,"STN":3.230683,"SYP":355.848537,"SZL":2.777267,"THB":4.905254,"TJS":1.54139,"TMT":0.494538,"TND":0.437445,"TOP":0.33539,"TRY":2.842974,"TTD":0.960571,"TVD":0.216139,"TWD":4.328411,"TZS":334.213995,"UAH":5.223408,"UGX":526.25792,"USD":0.141273,"UYU":5.486797,"UZS":1611.137086,"VES":3.712605,"VND":3327.407977,"VUV":17.085852,"WST":0.384956,"XAF":86.497513,"XCD":0.381441,"XDR":0.106392,"XOF":86.497513,"XPF":15.735667,"YER":35.392608,"ZAR":2.778457,"ZMW":2.736647,"ZWL":277.815843}}'

$notification.post('测试', '', JSON.stringify($argument));
$done();

const V4 = 'v4';
const V6 = 'v6';
const API_URL = {
    "v4": "https://api.exchangerate-api.com/v4/latest/CNY",
    "v6": "https://open.er-api.com/v6/latest/CNY",
}

let apiInterface = ($argument === 'v4') ? V4 : V6;
let options = {
    url: API_URL[apiInterface]
}
$httpClient.get(options, function (error, response, data) {
    if (error) {
        $notification.post("请求汇率失败", "", error);
        $done();
    }

    let obj = JSON.parse(data);
    if (typeof obj.result != 'undefined' && obj.result === "error") {
        $notification.post("汇率接口返回错误", "", obj.error - type);
        $done();
    }

    let lastTime = (apiInterface === V4) ? obj.time_last_updated : obj.time_last_update_unix;
    let title = timestampToTime(lastTime, "t") + "[" + apiInterface + "]";
    let lastTimeStr = "最后更新时间：" + timestampToTime(lastTime, "h");
    let msg = "🇺🇸1美元  \t人民币:" + getCurrency(obj.rates.USD);

    $notification.post(title, lastTimeStr, msg);
    $done();
})

function getCurrency(rate) {
    return (1 / rate).toFixed(2);
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
            let hours = date.getHours() - 8;
            let h = (hours < 10 ? '0' + hours : hours) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return h + m + s;
        default:
            break;
    }
}
