let url = $request.url
let headers = $request.headers
let body = $response.body
if (!body) $done({})

if (url.match(/action_set/)) {

$notification.post("错误", "请求:", $request.body);

    let new_setting = JSON.parse(body)
    $done({ response: { body: body, headers: { "Content-Type": "application/json" } } })
}

$notification.post("错误1", "请求:", $request.body);

$done({})
