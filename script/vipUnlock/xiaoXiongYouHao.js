let obj = JSON.parse($response.body);
let url = $request.url;

if (url.includes("api/vip/index")) {
    obj.vip_state = 2;
    obj.vip_valid_till_date = "2099\u5e7412\u670831\u65e5";
} else if ( url.includes("api/account_sync")) {
    obj.accountInfo.accountSetting.phone_number = "13012345678";
}
$done({ body:JSON.stringify(obj) });
