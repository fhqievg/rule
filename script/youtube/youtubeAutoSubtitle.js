let url = $request.url
let headers = $request.headers
let body = $response.body
if (!body) $done({})

let service = "YouTube"
let settings = {
    YouTube: {
        tl: "zh-CN",
        line: "sl"  //sl:单行字幕 f：第一行 s：第二行
    }
}
let setting = settings[service]

let patt = new RegExp(`lang=${setting.tl}`)
if (url.replace(/&lang=zh(-Hans)*&/, "&lang=zh-CN&").replace(/&lang=zh-Hant&/, "&lang=zh-TW&").match(patt) || url.match(/&tlang=/)) $done({})

let t_url = `${url}&tlang=${setting.tl == "zh-CN" ? "zh-Hans" : setting.tl == "zh-TW" ? "zh-Hant" : setting.tl}`

let options = {
    url: t_url,
    headers: headers
}

$httpClient.get(options, function (error, response, data) {
    if (setting.line == "sl") $done({ body: data })
    let timeline = body.match(/<p t="\d+" d="\d+">/g)

    if (url.match(/&kind=asr/)) {
        body = body.replace(/<\/?s[^>]*>/g, "")
        data = data.replace(/<\/?s[^>]*>/g, "")
        timeline = body.match(/<p t="\d+" d="\d+"[^>]+>/g)
    }

    for (var i in timeline) {
        let patt = new RegExp(`${timeline[i]}([^<]+)<\\/p>`)
        if (body.match(patt) && data.match(patt)) {
            if (setting.line == "s") body = body.replace(patt, `${timeline[i]}$1\n${data.match(patt)[1]}</p>`)
            if (setting.line == "f") body = body.replace(patt, `${timeline[i]}${data.match(patt)[1]}\n$1</p>`)
        }
    }

    $done({ body })
})
