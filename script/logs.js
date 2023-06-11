let msg = "################   URL   ################\r\n\r\n";
msg += $request.url;
msg += "\r\n\r\n====================================== \r\n\r\n\r\n\r\n\r\n";

msg += "###############   请求头   ###############\r\n\r\n";
msg += JSON.stringify($request.headers);
msg += "\r\n\r\n====================================== \r\n\r\n\r\n\r\n\r\n";

msg += "##############   请求body   ##############\r\n\r\n";
msg += $request.body;
msg += "\r\n\r\n====================================== \r\n\r\n\r\n\r\n\r\n";

msg += "###############   响应头   ###############\r\n\r\n";
msg += JSON.stringify($response.headers);
msg += "\r\n\r\n====================================== \r\n\r\n\r\n\r\n\r\n";


msg += "##############   响应body   ##############\r\n\r\n";
msg += $response.body;
msg += "\r\n\r\n====================================== \r\n\r\n\r\n\r\n\r\n";

$notification.post("调试", "log", msg);
$done({});
