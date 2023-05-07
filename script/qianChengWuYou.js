if (!$response.body) $done({});
let url = $request.url;
let obj = {};

if (url.includes('market/get_advertise')) {
    obj = '{"result":"1","status":"1","resultbody":{"banner":{"items":[],"totalCount":"0"},"hotCompany":{"items":[]},"personalization":"1"}}';
    $done({body: obj});
} else {
    obj = JSON.parse($response.body);
}

if (url.includes('user/get_person_center')) {
    obj.bootTaskList = [];
    if (typeof obj.jobservice.items != 'undefined' && obj.jobservice.items.length > 0) {
        obj.jobservice.items = obj.jobservice.items.filter(
            (i) =>
                i.adid != 'my_icon1_optimize' && //优化简历
                i.adid != 'my_icon2_careeradvice' && //职业咨询
                i.adid != 'my_icon4_jobdiagnosis' //求职诊断
        );
    }
    obj.tips = {}
}

$done({ body: JSON.stringify(obj) });
