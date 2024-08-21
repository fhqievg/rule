if (!$response.body) $done({});
let url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes('/app_config')) {
    if (obj?.data?.advert_config) {
        obj.data.advert_config.config_start = "0";
        obj.data.advert_config.advert_sdk_open = "0";
        obj.data.advert_config.config_vip_advert = "0";
        obj.data.advert_config.config_mine_info = "0";
        obj.data.advert_config.config_video_start_interval_minute = "0";
        obj.data.advert_config.config_video_start = "0";
        obj.data.advert_config.config_search = "0";
        obj.data.advert_config.config_leave_msg = "0";
        obj.data.advert_config.config_video_start_day_num = "0";
        obj.data.advert_config.config_video_pause = "0";
        obj.data.advert_config.config_video_download = "0";
        obj.data.advert_config.config_urge = "0";
        obj.data.advert_config.config_video_info = "0";
        obj.data.advert_config.config_index_alert = "0";
    }
}

$done({ body: JSON.stringify(obj) });