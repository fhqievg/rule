let url = $request.url
let headers = $request.headers

let default_settings = {
    YouTube: {
        type: "Enable", // Enable, Disable
        lang: "English",
        sl: "auto",
        tl: "en",
        line: "sl"
    }
}

let settings = $persistentStore.read()
if (!settings) settings = default_settings
if (typeof (settings) == "string") settings = JSON.parse(settings)

let service = "YouTube"
if (!settings[service]) settings[service] = default_settings[service]
let setting = settings[service]

if (url.match(/action=get/)) {
    delete setting.t_subtitles_url
    delete setting.subtitles
    delete setting.external_subtitles
    $done({ response: { body: JSON.stringify(setting), headers: { "Content-Type": "application/json" } } })
}

if (url.match(/action=set/)) {
    let new_setting = JSON.parse($request.body)
    settings[service].external_subtitles = "null"
    if (new_setting.type == "Reset") new_setting = default_settings[service]
    if (new_setting.type) settings[service].type = new_setting.type
    if (new_setting.lang) settings[service].lang = new_setting.lang
    if (new_setting.sl) settings[service].sl = new_setting.sl
    if (new_setting.tl) settings[service].tl = new_setting.tl
    if (new_setting.line) settings[service].line = new_setting.line
    if (new_setting.s_subtitles_url) settings[service].s_subtitles_url = new_setting.s_subtitles_url
    if (new_setting.t_subtitles_url) settings[service].t_subtitles_url = new_setting.t_subtitles_url
    if (new_setting.subtitles) settings[service].subtitles = new_setting.subtitles
    if (new_setting.subtitles_type) settings[service].subtitles_type = new_setting.subtitles_type
    if (new_setting.subtitles_sl) settings[service].subtitles_sl = new_setting.subtitles_sl
    if (new_setting.subtitles_tl) settings[service].subtitles_tl = new_setting.subtitles_tl
    if (new_setting.subtitles_line) settings[service].subtitles_line = new_setting.subtitles_line
    $persistentStore.write(JSON.stringify(settings))
    delete settings[service].t_subtitles_url
    delete settings[service].subtitles
    delete settings[service].external_subtitles
    $done({ response: { body: JSON.stringify(settings[service]), headers: { "Content-Type": "application/json" } } })
}

if (setting.type == "Disable") $done({})

let body = $response.body
if (!body) $done({})
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
