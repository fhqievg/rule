let obj = JSON.parse($response.body)
let url = $request.url

if (url.match(/account/)) {
   if (url.match(/api/)) {
       //obj.account.is_admin = true
       obj.account.user.ip_location = ""
       obj.prime_portal = []
   }
   
   if (url.match(/www/)) {
       //obj.content.is_admin = true
       obj.content.ip_location = ""
       obj.content.prime_portal = []
   }
}

if (url.match(/get_profile/)) {
  obj.user.ip_location = ""
  obj.prime_portal = []
}

$done({body:JSON.stringify(obj)});
