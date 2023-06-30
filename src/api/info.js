import request from '@/utils/request'
//获取基本信息
export function getInfo() {
    return request({
        url: '/base/info',
        method: 'get',
    })
}
export function postCreateArticle(data){
    return request({
        url: '/article/add_article',
        method: 'post',
        data
    })
}
