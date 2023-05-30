//let mock = '{"provider":"https://www.exchangerate-api.com","WARNING_UPGRADE_TO_V6":"https://www.exchangerate-api.com/docs/free","terms":"https://www.exchangerate-api.com/terms","base":"CNY","date":"2023-05-30","time_last_updated":1685404802,"rates":{"CNY":1,"AED":0.519,"AFN":12.4,"ALL":14.59,"AMD":54.63,"ANG":0.253,"AOA":80.3,"ARS":33.34,"AUD":0.216,"AWG":0.253,"AZN":0.24,"BAM":0.258,"BBD":0.283,"BDT":15.21,"BGN":0.258,"BHD":0.0531,"BIF":399.03,"BMD":0.141,"BND":0.191,"BOB":0.979,"BRL":0.706,"BSD":0.141,"BTN":11.68,"BWP":1.95,"BYN":0.377,"BZD":0.283,"CAD":0.192,"CDF":329.5,"CHF":0.128,"CLP":112.9,"COP":629.24,"CRC":76.51,"CUP":3.39,"CVE":14.54,"CZK":3.12,"DJF":25.11,"DKK":0.984,"DOP":7.74,"DZD":19.35,"EGP":4.37,"ERN":2.12,"ETB":7.72,"EUR":0.132,"FJD":0.318,"FKP":0.114,"FOK":0.984,"GBP":0.114,"GEL":0.365,"GGP":0.114,"GHS":1.67,"GIP":0.114,"GMD":8.36,"GNF":1208.17,"GTQ":1.11,"GYD":29.91,"HKD":1.11,"HNL":3.48,"HRK":0.994,"HTG":19.88,"HUF":48.97,"IDR":2110.7,"ILS":0.526,"IMP":0.114,"INR":11.68,"IQD":185.08,"IRR":6016.72,"ISK":19.69,"JEP":0.114,"JMD":21.89,"JOD":0.1,"JPY":19.82,"KES":19.57,"KGS":12.39,"KHR":579.92,"KID":0.216,"KMF":64.87,"KRW":187.08,"KWD":0.0434,"KYD":0.118,"KZT":62.95,"LAK":2532.27,"LBP":2119.11,"LKR":41.79,"LRD":24.04,"LSL":2.78,"LYD":0.682,"MAD":1.44,"MDL":2.52,"MGA":621.47,"MKD":8.08,"MMK":334.19,"MNT":494.25,"MOP":1.14,"MRU":4.87,"MUR":6.43,"MVR":2.18,"MWK":145.72,"MXN":2.48,"MYR":0.651,"MZN":9.04,"NAD":2.78,"NGN":65.21,"NIO":5.18,"NOK":1.57,"NPR":18.68,"NZD":0.233,"OMR":0.0543,"PAB":0.141,"PEN":0.52,"PGK":0.505,"PHP":7.93,"PKR":40.34,"PLN":0.596,"PYG":1016.32,"QAR":0.514,"RON":0.654,"RSD":15.47,"RUB":11.35,"RWF":165.12,"SAR":0.53,"SBD":1.19,"SCR":1.88,"SDG":63.22,"SEK":1.53,"SGD":0.191,"SHP":0.114,"SLE":3.21,"SLL":3206.74,"SOS":80.4,"SRD":5.24,"SSP":139.12,"STN":3.23,"SYP":355.85,"SZL":2.78,"THB":4.91,"TJS":1.54,"TMT":0.495,"TND":0.437,"TOP":0.335,"TRY":2.84,"TTD":0.961,"TVD":0.216,"TWD":4.33,"TZS":334.21,"UAH":5.22,"UGX":526.26,"USD":0.141,"UYU":5.49,"UZS":1611.14,"VES":3.71,"VND":3327.41,"VUV":17.09,"WST":0.385,"XAF":86.5,"XCD":0.381,"XDR":0.106,"XOF":86.5,"XPF":15.74,"YER":35.39,"ZAR":2.78,"ZMW":2.74,"ZWL":277.82}}'

let options = {
    url: "https://api.exchangerate-api.com/v4/latest/CNY"
}
$httpClient.get(options, function (error, response, data) {
    if (error) {
        $notification.post("请求汇率失败", "", error);
        $done();
    }

    let obj = JSON.parse(data);
    let lastTime = "最后更新时间："+timestampToTime(obj.time_last_updated);
    let msg = "🇺🇸1美元  \t人民币:"+getCurrency(obj.rates.USD);

    $notification.post(obj.date, lastTime, msg);
    $done();
})

function getCurrency(rate) {
    return (1/rate).toFixed(2);
}

function timestampToTime(timestamp) {
    let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    //var Y = date.getFullYear() + '-';
    //var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
    //var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
    let hours = date.getHours();
    let h = (hours < 10 ? '0'+hours: hours)+ ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes(): date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0'+date.getSeconds(): date.getSeconds();
    return h+m+s;
}
