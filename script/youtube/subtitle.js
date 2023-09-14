const isQuanX = typeof $task !== "undefined";
let url = $request.url;

let storeKey = 'youTubeShortcutsSubtitleSetting';
let defaultSetting = {
    type: "enable",
    tl: "zh-CN",
    line: "sl"  //sl:单语翻译字幕 f：双语（翻译字幕在上） s：双语（翻译字幕在下）
}
let storeSetting = storeRead(storeKey);
let setting = (!storeSetting || storeSetting === '') ? defaultSetting : JSON.parse(storeSetting)
if (url.match(/action=shortcutsSet/)) {
    let params = JSON.parse($request.body)
    switch (params.type) {
        case 'disable':
            setting.type = 'disable'
            break;
        case 'enable':
            setting.type = 'enable'
            setting.line = params.line
            break;
        default:
            setting = defaultSetting
            break;
    }
    storeWrite(JSON.stringify(setting), storeKey);
    if (isQuanX) {
        $done({status: "HTTP/1.1 200 OK", headers: {"Content-Type": "application/json"}, body: JSON.stringify(setting)});
    } else {
        $done({response: {body: JSON.stringify(setting), headers: {"Content-Type": "application/json"}}});
    }
}

if (setting.type === 'disable') {
    $done({});
}

let headers = $request.headers;
let body = $response.body;
if (!body) $done({});
let patt = new RegExp(`lang=${setting.tl}`)
if (url.replace(/&lang=zh(-Hans)*&/, "&lang=zh-CN&").replace(/&lang=zh-Hant&/, "&lang=zh-TW&").match(patt) || url.match(/&tlang=/)) $done({})
let t_url = `${url}&tlang=${setting.tl === "zh-CN" ? "zh-Hans" : (setting.tl === "zh-TW" ? "zh-Hant" : setting.tl)}`
let options = {
    url: t_url,
    headers: headers
}

if (isQuanX) {
    options.method = 'GET';
    $task.fetch(options).then(response => {
        body = getResponseResult(response.body, body, setting);
        $done({ body });
    }, reason => {
        notify("youTube字幕", "请求失败", reason.error);
        $done();
    });
} else {
    $httpClient.get(options, function (error, response, data) {
        if (error) {
            notify("youTube字幕", "请求失败", error);
            $done();
        }

        body = getResponseResult(data, body, setting);
        $done({ body });
    })
}

function storeRead(key) {
    if (isQuanX) {
        return $prefs.valueForKey(key)
    } else {
        return $persistentStore.read(key)
    }
}

function storeWrite(value, key) {
    if (isQuanX) {
        return $prefs.setValueForKey(value, key)
    } else {
        return $persistentStore.write(value, key)
    }
}

function notify(title, subtitle, message) {
    if (isQuanX) {
        $notify(title, subtitle, message);
    } else {
        $notification.post(title, subtitle, message);
    }
}

function getResponseResult(data, body, setting) {
    switch (setting.line) {
        case "f":
        case "s":
            let timeline = body.match(/<p t="\d+" d="\d+">/g)
            if (url.match(/&kind=asr/)) {
                body = body.replace(/<\/?s[^>]*>/g, "")
                data = data.replace(/<\/?s[^>]*>/g, "")
                timeline = body.match(/<p t="\d+" d="\d+"[^>]+>/g)
            }

            for (var i in timeline) {
                let patt = new RegExp(`${timeline[i]}([^<]+)<\\/p>`)
                if (body.match(patt) && data.match(patt)) {
                    if (setting.line === "f") body = body.replace(patt, `${timeline[i]}${data.match(patt)[1]}\n$1</p>`)
                    if (setting.line === "s") body = body.replace(patt, `${timeline[i]}$1\n${data.match(patt)[1]}</p>`)
                }
            }
            return body;
        default:
            return data;
    }
}