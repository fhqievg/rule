let obj = JSON.parse($response.body)
let url = $request.url

//首页
if (url.includes('movie/index_recommend')) {
    if (typeof obj.data != 'undefined' && obj.data.length > 0) {
        obj.data = obj.data.filter(
            (item) =>
                item.layout != 'advert_self'
        );

        for (let i in obj.data) {
            switch (obj.data[i].layout) {
                //轮播
                case 'index_recommend_carousel':
                    obj.data[i].list = obj.data[i].list.filter(
                        (item) =>
                            item.type != 3
                    );
                    break;
                default:
                    break;
            }
        }
    }
}


$done({ body: JSON.stringify(obj) });
