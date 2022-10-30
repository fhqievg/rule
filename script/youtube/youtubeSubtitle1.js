let url = $request.url
let headers = $request.headers
let body = $response.body
$notification.post("调试1", "body:", body);
if (!body) $done({})

let setting = {
    tl: "zh-CN",
    line: "f"  //sl:单语翻译字幕 f：双语（翻译在上，原字幕在下） s：双语（原字幕在上，翻译在下）
}

let patt = new RegExp(`lang=${setting.tl}`)
if (url.replace(/&lang=zh(-Hans)*&/, "&lang=zh-CN&").replace(/&lang=zh-Hant&/, "&lang=zh-TW&").match(patt) || url.match(/&tlang=/)) $done({})
let t_url = `${url}&tlang=${setting.tl == "zh-CN" ? "zh-Hans" : (setting.tl == "zh-TW" ? "zh-Hant" : setting.tl)}`
let options = {
    url: t_url,
    headers: headers
}

$httpClient.get(options, function (error, response, data) {
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
                    if (setting.line == "f") body = body.replace(patt, `${timeline[i]}${data.match(patt)[1]}\n$1</p>`)
                    if (setting.line == "s") body = body.replace(patt, `${timeline[i]}$1\n${data.match(patt)[1]}</p>`)
                }
            }
            $done({ body })
        default:
            $done({ body: data })
    }
})
