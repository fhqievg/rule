let obj = JSON.parse($response.body);
let url = $request.url;

//弹框
if (url.includes('mtop.film.life.aristotle.get')) {
    if (typeof obj.data.layers == 'undefined' || obj.data.layers.length === 0) {
        $done({});
    }

    let layers = obj.data.layers;
    for (let i in layers) {
        if (typeof layers[i].sections == 'undefined' || layers[i].sections.length === 0) {
            continue;
        }

        obj.data.layers[i].sections = layers[i].sections.filter(
            (item) =>
                item.componentId == 'taopiaopiao_decode_token_component' || //人传人
                item.componentId == 'taopiaopiao_soon_ticket_popup_component' || //取票提醒
                item.componentId == 'taopiaopiao_red_packet_popup_component' || //天降红包
                //item.componentId == 'taopiaopiao_birthday_component' || //生日提醒
                //item.componentId == 'taopiaopiao_upgrade_component' || //会员升级
                //item.componentId == 'taopiaopiao_user_message_popup_component' || //达人
                //item.componentId == 'taopiaopiao_comment_guide_popup_component' || //影评提醒
                item.componentId == 'taopiaopiao_homepage_tip_popup_component' || //首页浮层
                //item.componentId == 'taopiaopiao_cycle_discount_popup_component' || //新人礼
                //item.componentId == 'taopiaopiao_transparent_video_component' ||  //视频ad
                item.componentId == 'taopiaopiao_activity_info_alert_component'   //普通弹窗
        );
    }
}

//首页配置
if (url.includes('mtop.film.mtopintegrationapi.homeconfig')) {
    if(typeof obj.data.returnValue.secondFloorBanner.actionUrl != 'undefined'){
        obj.data.returnValue.secondFloorBanner.actionUrl = '';
    }
    if(typeof obj.data.returnValue.secondFloorBanner.advertiseContainer != 'undefined'){
        obj.data.returnValue.secondFloorBanner.advertiseContainer = '';
    }
    if(typeof obj.data.returnValue.secondFloorBanner.dispatchId != 'undefined'){
        obj.data.returnValue.secondFloorBanner.dispatchId = '';
    }
    if(typeof obj.data.returnValue.secondFloorBanner.smallPicUrl2 != 'undefined'){
        obj.data.returnValue.secondFloorBanner.smallPicUrl2 = '';
    }

    if (typeof obj.data.returnValue.topTab != 'undefined' && obj.data.returnValue.topTab.length > 0) {
        obj.data.returnValue.topTab = obj.data.returnValue.topTab.filter(
            (i) =>
                i.dispatchId == '283861' || //精选
                i.name == '精选' ||
                i.dispatchId == '277532' || //最新预告
                i.name == '最新预告' ||
                i.dispatchId == '276981' || //口碑趋势
                i.name == '口碑趋势' ||
                i.dispatchId == '217667' || //最新影讯
                i.name == '最新影讯'
        );
    }
}

$done({ body: JSON.stringify(obj) });
