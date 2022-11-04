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

//推荐数据流
if (url.match(/paged_waterfall_recommendations/)) {
   let data = []
   for (var i in obj.multiplex_cells) {
       let label = obj.multiplex_cells[i].recommendation_cell.label
       if (label == '') {
           data.push(obj.multiplex_cells[i])
       }
   }
   obj.multiplex_cells = data
}

if (url.match(/init_page/)) {
   if (typeof obj.content.chustory_tab.banners != 'undefined' && obj.content.chustory_tab.banners.length > 0) {
       let bannersObj = obj.content.chustory_tab.banners
       let bannersData = []
       for (var i in bannersObj) {
           let slot_name = bannersObj[i].object.slot_name
           if (!slot_name.match(/_ad/)) {
               bannersData.push(bannersObj[i])
           }
       }
       obj.content.chustory_tab.banners = bannersData
   }
}

$done({ body:JSON.stringify(obj) });
