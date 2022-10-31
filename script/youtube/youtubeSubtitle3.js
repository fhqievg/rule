let url = $request.url
let body = $response.body
let msg = url + '[body]===>'+body
$notification.post("调试1", "msg:", msg);
