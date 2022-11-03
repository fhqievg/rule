let obj = JSON.parse($response.body)
let url = $request.url

//个人中心
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

//分类
if (url.match(/api/) && url.match(/ranking_list/)) {
   let caregory = []
   for (var i in obj.cells) {
      let filed = obj.cells[i].GetHomePageVerticalRankingListSectionRespCell_cell_OneOfCase
      if (filed != "side_slip_activity_cell" && filed != "dish_square_cell") {
          caregory.push(obj.cells[i])
      }
   }
   obj.cells = caregory
}

$done({ body:JSON.stringify(obj) });
