let obj=JSON.parse($response.body)
obj.data["versionsUrl"]=''
obj.data["versionsinfo"]=''
obj.data["versionsNum"]="7100"
obj.data["versionsMin"]="7.0.3"
obj.data["versionsName"]="7.1.0"
$done({body:JSON.stringify(obj)});
