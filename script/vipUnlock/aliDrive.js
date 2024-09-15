const url = $request.url;
if (!$response.body) $done({});
let body = $response.body;

if (url.includes("/business/v1.0/users/feature/list")) {
    body = body
        .replace(/"intercept":true/g, '"intercept":false')
        .replace(/"name":"[^"]+"/g, '"name":"会员"');
    $done({ body });
} else {
    let obj = JSON.parse(body);
    if (url.includes("/apps/v1/users/apps/widgets")) {
        if (typeof obj.result != 'undefined' && obj.result.length > 0) {
            obj.result = obj.result.filter(
                (i) =>
                    //silentUserBack 回归礼
                    //vip 限时领vip
                    //recent_share_save 最近转存
                    //recent_video 放映室
                    //recent_document 最近文档
                    //subscriptionRecommend 订阅推荐
                    //album_backup_task 福利社
                    //imageToText 传图识字
                    //search 全网搜索
                    //auto_addressbook_backup 通讯录
                    !(
                        ["vip", "subscriptionRecommend", "imageToText", "search", "auto_addressbook_backup", "recent_document"].includes(i.code)
                    )
            );
        }
    } else if (url.includes("/apps/v1/users/home/widgets")) {
        const item = [
            "recentUsed", // 最近在看
            "coreFeatures", // 顶部图标
            "activities", // 精选活动
            "myBackup", // 我的备份
            // "recentSaved", // 最近转存
            "signIn" // 顶部签到
        ];
        item.forEach((i) => {
            delete obj[i];
        });
    } else if (url.includes("/business/v1/users/me/vip/info")) {
        obj = {
            rightButtonText: "SVIP",
            identity: "svip",
            level: "8t",
            titleNotice: "SVIP",
            titleImage:
                "https://gw.alicdn.com/imgextra/i1/O1CN01Z2Yv4u1jrJ5S5TYpo_!!6000000004601-2-tps-216-60.png",
            description: "有效期至 2040-01-01"
        };
    } else if (url.includes("/business/v1.0/users/vip/info")) {
        obj = {
            status: "normal",
            identity: "svip",
            icon: "https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png",
            level: "8t",
            vipList: [
                {
                    code: "svip.8t",
                    promotedAt: 1262275200,
                    expire: 2209046399,
                    name: "8TB超级会员"
                }
            ],
            mediumIcon:
                "https://gw.alicdn.com/imgextra/i4/O1CN01Mk916Y1c99aVBrgxM_!!6000000003557-2-tps-222-60.png"
        };
    } else if (url.includes("/v1/users/me")) {
        obj.membershipIdentity = "svip";
        obj.membershipIcon =
            "https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png";
    }
    $done({ body: JSON.stringify(obj) });
}