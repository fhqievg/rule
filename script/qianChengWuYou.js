if (!$response.body) $done({});
let obj = JSON.parse($response.body);
let url = $request.url;

if(url.includes('user/get_person_center')){
    obj.bootTaskList = [];
    if(typeof obj.jobservice.items != 'undefined' && obj.jobservice.items.length > 0){
        obj.jobservice.items = obj.jobservice.items.filter(
            (i) =>
                i.adid != 'my_icon1_optimize' && //优化简历
                i.adid != 'my_icon2_careeradvice' && //职业咨询
                i.adid != 'my_icon4_jobdiagnosis' //求职诊断
        );
    }
    obj.tips = {}
}

if(url.includes('market/get_advertise')){
    if(obj.resultbody?.banner?.items){
        obj.resultbody.banner.items = [];
        obj.resultbody.banner.totalCount = '0';
    }

    if(obj.resultbody?.hotCompany?.items){
        obj.resultbody.hotCompany.items = [];
    }
}
$done({ body: JSON.stringify(obj) });
