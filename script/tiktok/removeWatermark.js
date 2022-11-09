const enabled_live = false; //是否开启直播推荐

function dataHandle(data) {
    if (data && data.length > 0) {
        for (let i in data) {
            if (data[i].aweme.video) {
                data[i].aweme = videoHandle(data[i].aweme);
            }
        }
    }
    return data;
}

function awemeDataHandle(aweme_list) {
    if (aweme_list && aweme_list.length > 0) {
        for (let i in aweme_list) {
            if (aweme_list[i].is_ads == true) {
                aweme_list.splice(i, 1);
            } else if (aweme_list[i].video) {
                aweme_list[i] = videoHandle(aweme_list[i]);
            } else {
                if (!enabled_live) aweme_list.splice(i, 1);
            }
        }
    }
    return aweme_list;
}

function awemeDetailHandle(aweme_detail) {
    if (typeof aweme_detail.video != 'undefined') {
        aweme_detail = videoHandle(aweme_detail);
    } else if (typeof aweme_detail[0] != 'undefined') {
        for (var i in aweme_detail) {
            if (aweme_detail[i].video) {
                aweme_detail[i] = videoHandle(aweme_detail[i]);
            }
        }
    }
    return aweme_detail;
}

function videoHandle(lists) {
    lists.prevent_download = false;
    lists.status.reviewed = 1;
    lists.video_control.allow_download = true;
    lists.video_control.prevent_download_type = 0;
    delete lists.video.misc_download_addrs;
    lists.video.download_addr = lists.video.play_addr;
    lists.video.download_suffix_logo_addr = lists.video.play_addr;
    lists.aweme_acl.download_general.mute = false;
    if (lists.aweme_acl.download_general.extra) {
        delete lists.aweme_acl.download_general.extra;
        lists.aweme_acl.download_general.code = 0;
        lists.aweme_acl.download_general.show_type = 2;
        lists.aweme_acl.download_general.transcode = 3;
        lists.aweme_acl.download_mask_panel = lists.aweme_acl.download_general;
        lists.aweme_acl.share_general = lists.aweme_acl.download_general;
    }
    return lists;
}

try {
    let body = $response.body
    body = body.replace(/\"room_id\":(\d{2,})/g, '"room_id":"$1"');
    let obj = JSON.parse(body);
    if(typeof obj.data != 'undefined'){
        obj.data = dataHandle(obj.data);
    }

    if(typeof obj.aweme_list != 'undefined'){
        obj.aweme_list = awemeDataHandle(obj.aweme_list);
    }

    if(typeof obj.aweme_detail != 'undefined'){
        obj.aweme_detail = awemeDetailHandle(obj.aweme_detail);
    }

    if(typeof obj.aweme_details != 'undefined'){
        obj.aweme_details = awemeDetailHandle(obj.aweme_details);
    }
    $done({ body: JSON.stringify(obj) });
} catch (err) {
    $done({});
}
