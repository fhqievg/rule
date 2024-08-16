const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes('/account/detail') || url.includes('/user/get_profile')) {
    if (url.includes('/account/detail') && obj?.account?.user?.ip_location) {
        obj.account.user.ip_location = '';
    }

    if (url.includes('/user/get_profile') && obj?.user?.ip_location) {
        obj.user.ip_location = '';
    }

    obj.prime_portal = [];
}

if (url.includes('/init_page')) {
    if (obj?.content?.chustory_tab?.banners?.length > 0) {
        let bannersObj = obj.content.chustory_tab.banners
        let bannersData = []
        for (let i in bannersObj) {
            let slot_name = bannersObj[i].object.slot_name
            if (!slot_name.includes("_ad")) {
                bannersData.push(bannersObj[i])
            }
        }
        obj.content.chustory_tab.banners = bannersData
    }
}

//推荐流
if (url.includes('/homepage/paged_waterfall_recommendations')) {
    if (obj?.multiplex_cells?.length > 0) {
        let multiplexCells = obj.multiplex_cells;
        let multiplexCellsArr = [];
        for (let i in multiplexCells) {
            let cell = multiplexCells[i][multiplexCells[i].WaterfallMultiplexCell_cell_OneOfCase];
            if (cell?.impression_sensor_events?.length > 0) {
                for (let j in cell.impression_sensor_events) {
                    if (cell.impression_sensor_events[j].properties?.target_type !== 'ad') {
                        multiplexCellsArr.push(multiplexCells[i]);
                    }
                }
            }
        }
        obj.multiplex_cells = multiplexCellsArr;
    }
}

//分类
if (url.includes('/homepage/ranking_list/paged_homepage_ranking_list_section_v')) {
    if (obj?.cells?.length > 0) {
        obj.cells = obj.cells.filter(
            (i) =>
                !(
                    i.GetHomePageVerticalRankingListSectionRespCell_cell_OneOfCase === "side_slip_activity_cell" || // 活动
                    i.GetHomePageVerticalRankingListSectionRespCell_cell_OneOfCase === "dish_square_cell" //作品广场
                )
        );
    }
}

//详情
if(url.includes('/recipe/detail_v')){
    if(obj?.recipe?.hasOwnProperty('overall_rating')){
        obj.recipe.overall_rating.dishes = [];  //顶部评分下方的其他人作品图片
    }
}

//详情底部
if(url.includes('/recipe/bottom_list')){
    if (obj?.cells?.length > 0) {
        obj.cells = obj.cells.filter(
            (i) =>
                !(
                    i.RecipeDetailBottomListHybridCell_cell_OneOfCase === "dish" || //大家交的作业
                    //i.RecipeDetailBottomListHybridCell_cell_OneOfCase === "question" || //评论
                    i.RecipeDetailBottomListHybridCell_cell_OneOfCase === "ad"

                )
        );
    }
}

//搜索入口页
if(url.includes('/search/popular_queries')){
    if (obj?.cells?.length > 0) {
        for (let i in obj.cells) {
            if(obj.cells[i][obj.cells[i].SearchPopularQueriesRespCell_cell_OneOfCase].ads?.length > 0) {
                obj.cells[i][obj.cells[i].SearchPopularQueriesRespCell_cell_OneOfCase].ads = [];
            }
        }
        obj.cells = obj.cells.filter(
            (i) =>
                !(
                    //i.SearchPopularQueriesRespCell_cell_OneOfCase === "latest_search_section_cell" || // 最近搜索
                    i.SearchPopularQueriesRespCell_cell_OneOfCase === "text_suggestion_section_cell" //搜索发现
                )
        );
    }
}

//搜索结果页
if(url.includes('/search/universal_search_v')){
    if (obj?.cells?.length > 0) {
        obj.cells = obj.cells.filter(
            (i) =>
                !(
                    i.UniversalSearchRespCell_cell_OneOfCase === "icon_title_text_section_cell" //相关搜索
                )
        );
    }
}

$done({ body: JSON.stringify(obj) });
