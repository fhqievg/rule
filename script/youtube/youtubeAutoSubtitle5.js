let url = $request.url
let headers = $request.headers
let body = ''

let tl = 'zh-CN'
let line = 'sl'
let patt = new RegExp(`lang=${tl}`)
if (url.replace(/&lang=zh(-Hans)*&/, "&lang=zh-CN&").replace(/&lang=zh-Hant&/, "&lang=zh-TW&").match(patt) || url.match(/&tlang=/)){
$done({ body })
}

let t_url = `${url}&tlang=${tl == "zh-CN" ? "zh-Hans" : (tl == "zh-TW" ? "zh-Hant" : tl)}`
let options = {
    url: t_url,
    headers: headers
}

$httpClient.get(options, function (error, response, data) {
    if (line == "sl") $done({ body: data })

    let timeline = body.match(/<p t="\d+" d="\d+">/g)
    if (url.match(/&kind=asr/)) {
        body = body.replace(/<\/?s[^>]*>/g, "")
        data = data.replace(/<\/?s[^>]*>/g, "")
        timeline = body.match(/<p t="\d+" d="\d+"[^>]+>/g)
    }

    for (var i in timeline) {
        let patt = new RegExp(`${timeline[i]}([^<]+)<\\/p>`)
        if (body.match(patt) && data.match(patt)) {
            if (line == "s") body = body.replace(patt, `${timeline[i]}$1${data.match(patt)[1]}</p>`)
            if (line == "f") body = body.replace(patt, `${timeline[i]}${data.match(patt)[1]}$1</p>`)
        }
    }

    $done({ body })
})
