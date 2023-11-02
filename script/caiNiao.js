//个人页面绑定banner、果酱过期、首页绑定提示、tab
const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("nbfriend.message.conversation.list")) {
  if (obj.data.data) {
    obj.data.data = obj.data.data.filter((i) =>
      i?.conversationId?.includes("logistic_message")
    );
  }
} else if (url.includes("nbpresentation.pickup.empty.page.get")) {
    // 取件页面
    if (obj.data.result) {
        let ggContent = obj.data.result.content;
        if (ggContent.middle) {
            ggContent.middle = ggContent.middle.filter(
                (i) =>
                    ![
                        "guoguo_pickup_empty_page_relation_add", // 添加亲友
                        "guoguo_pickup_helper_feedback", // 反馈组件
                        "guoguo_pickup_helper_tip_view" // 取件小助手
                    ].includes(i.template.name)
            );
        }
    }
} else if (url.includes("nbpresentation.protocol.homepage.get")) {
    // 首页
    if (obj.data.result) {
        let res = obj.data.result;
        if (res.dataList) {
            res.dataList = res.dataList.filter((i) => {
                if (i.type.includes("kingkong")) {
                    if (i.bizData.items) {
                        for (let ii of i.bizData.items) {
                            ii.rightIcon = null;
                            ii.bubbleText = null;
                        }
                        return true;
                    }
                } else if (i.type.includes("icons_scroll")) {
                    // 顶部图标
                    if (i.bizData.items) {
                        const item = [
                            "618cjhb", // 超级红包
                            "bgxq", // 包裹星球
                            "cncy", // 填字赚现金
                            "cngy", // 免费领水果
                            "cngreen", // 绿色家园
                            "gjjf", // 裹酱积分
                            "jkymd", // 集卡赢免单
                            "ljjq", // 领寄件券
                            "ttlhb", // 天天领红包
                            "xybg", // 幸运包裹
                            "cnhs" //回收
                        ];
                        i.bizData.items = i.bizData.items.filter(
                            (ii) => !item.includes(ii.key)
                        );
                        for (let ii of i.bizData.items) {
                            ii.rightIcon = null;
                            ii.bubbleText = null;
                        }
                        return true;
                    }
                } else if (i.type.includes("banner_area")) {
                    // 新人福利 幸运抽奖
                    return false;
                } else if (i.type.includes("promotion")) {
                    // 促销活动
                    return false;
                } else if (i.type.includes("todo_list")) {
                    // 果酱过期
                    return false;
                } else {
                    return true;
                }
            });
        }
    }
} else if (url.includes("guoguo.nbnetflow.ads.show")) {
    // 我的页面
    // 29338 寄件会员
    // 29339 裹酱积分
    // 33927 绿色能量
    if (obj.data.result) {
        obj.data.result = obj.data.result.filter(
            (i) =>
                !(
                    i?.materialContentMapper?.adItemDetail ||
                    (i?.materialContentMapper?.bgImg && i?.materialContentMapper?.advRecGmtModifiedTime) ||
                    ["entertainment", "kuaishou_banner"].includes(i?.materialContentMapper?.group_id) ||
                    ["29338", "29339", "32103", "33927"].includes(i.id) ||
                    (i?.materialContentMapper?.group_id?.includes("common_header_banner") && ["event_kuaishoubanner", "event_qingyoubanner"].includes(i?.materialContentMapper?.ut_event_name)) ||
                    (i?.materialContentMapper?.group_id?.includes("interests") && ["event_jijianhuiyuan", "event_guojiangjifeng", "event_greenhome"].includes(i?.materialContentMapper?.ut_event_name))
                )
        );
    }
} else if (url.includes("guoguo.nbnetflow.ads.mshow")) {
    // 首页
    if (obj.data) {
        const item = [
            "10", // 物流详情页 底部横图
            "498", // 物流详情页 左上角
            "328", // 3位数为家乡版本
            "366",
            "369",
            "615",
            "616",
            "727",
            "793", // 支付宝 小程序 搜索框
            "954", // 支付宝 小程序 置顶图标
            "1017", //关联淘宝
            "1255", //关联快手
            "1308", // 支付宝 小程序 横图
            "1316", // 头部 banner
            "1332", // 我的页面 横图
            "1340", // 查快递 小妙招
            "1371", //绑定快手
            "1391", // 支付宝 小程序 寄包裹
            "1410", // 导入拼多多、抖音快递
            "1428", // 幸运号
            "1524", // 抽现金
            "1525" // 幸运包裹
        ];
        for (let i of item) {
            if (obj.data?.[i]) {
                delete obj.data[i];
            }
        }

        let tabItem = [843, 862, 863];
        for (let i in tabItem) {
            if (obj.data.hasOwnProperty(tabItem[i])) {
                obj.data[tabItem[i]] = materialContentHandle(obj.data[tabItem[i]], tabItem[i]);
            }
        }
    }
}

function materialContentHandle(data, index) {
    let defaultIndex = index === 863 ? 2 : 3;
    for (let i in data) {
        if (data[i].hasOwnProperty("materialContentMapperMD5")) {
            delete data[i].materialContentMapperMD5;
        }

        if (data[i].hasOwnProperty("materialContentMapper")) {
            for (let j = 1; j <= 4; j++) {
                switch (j) {
                    case 1:
                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_action') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_action")) {
                            data[i].materialContentMapper["tab_" + j + '_action'] = data[i].materialContentMapper["tab_" + defaultIndex + "_action"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_action_type') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_action_type")) {
                            data[i].materialContentMapper["tab_" + j + '_action_type'] = data[i].materialContentMapper["tab_" + defaultIndex + "_action_type"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_checked_icon') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_checked_icon")) {
                            data[i].materialContentMapper["tab_" + j + '_checked_icon'] = data[i].materialContentMapper["tab_" + defaultIndex + "_checked_icon"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_normal_icon') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_normal_icon")) {
                            data[i].materialContentMapper["tab_" + j + '_normal_icon'] = data[i].materialContentMapper["tab_" + defaultIndex + "_normal_icon"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_tab_key') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_tab_key")) {
                            data[i].materialContentMapper["tab_" + j + '_tab_key'] = data[i].materialContentMapper["tab_" + defaultIndex + "_tab_key"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_title') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_title")) {
                            data[i].materialContentMapper["tab_" + j + '_title'] = data[i].materialContentMapper["tab_" + defaultIndex + "_title"];
                        }

                        if (data[i].materialContentMapper.hasOwnProperty("tab_" + j + '_type') && data[i].materialContentMapper.hasOwnProperty("tab_" + defaultIndex + "_type")) {
                            data[i].materialContentMapper["tab_" + j + '_type'] = data[i].materialContentMapper["tab_" + defaultIndex + "_type"];
                        }
                        break;
                    default:
                        data[i].materialContentMapper["tab_" + j + '_action'] = '';
                        data[i].materialContentMapper["tab_" + j + '_action_type'] = '';
                        data[i].materialContentMapper["tab_" + j + '_checked_icon'] = '';
                        data[i].materialContentMapper["tab_" + j + '_normal_icon'] = '';
                        data[i].materialContentMapper["tab_" + j + '_tab_key'] = '';
                        data[i].materialContentMapper["tab_" + j + '_title'] = '';
                        data[i].materialContentMapper["tab_" + j + '_type'] = 'embed';
                        break;
                }
            }
        }
    }
    return data;
}

$done({ body: JSON.stringify(obj) });