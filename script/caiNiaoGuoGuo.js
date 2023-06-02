const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("nbpresentation.homepage.merge.get.cn")) {
    if (obj.data) {
        // 移除 反馈组件
        const item = [
            "mtop.cainiao.nbmensa.research.researchservice.acquire.cn@0",
            "mtop.cainiao.nbmensa.research.researchservice.acquire.cn@1",
            "mtop.cainiao.nbmensa.research.researchservice.acquire.cn@2",
            "mtop.cainiao.nbmensa.research.researchservice.acquire.cn@3"
        ];
        for (let i of item) {
            if (obj.data?.[i]) {
                delete obj.data[i];
            }
        }
    }
} else if (url.includes("nbpresentation.pickup.empty.page.get.cn")) {
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
} else if (url.includes("nbpresentation.protocol.homepage.get.cn")) {
    if (obj.data.result) {
        let res = obj.data.result;
        if (res.dataList) {
            res.dataList = res.dataList.filter((i) => {
                // 顶部图标
                if (i.type.includes("icons_scroll_unable")) {
                    if (i.bizData.items) {
                        const item = [
                            "bgxq", // 包裹星球
                            "cngy", // 免费领水果
                            "cngreen", // 绿色家园
                            "gjjf", // 裹酱积分
                            "ljjq", // 领寄件券
                            "ttlhb" // 天天领红包
                        ];
                        i.bizData.items = i.bizData.items.filter(
                            (ii) => !item.includes(ii.key)
                        );
                    }
                } else if (i.type.includes("big_banner_area")) {
                    // 新人福利
                    return false;
                } else if (i.type.includes("promotion")) {
                    // 促销活动
                    return false;
                } else {
                    return true;
                }
                res.dataList.forEach((i) => {
                    i.bizData.items.forEach((ii) => {
                        ii.rightIcon = null;
                        ii.bubbleText = null;
                    });
                });
            });
        }
    }
}

$done({ body: JSON.stringify(obj) });