//接口
module.exports = {
  /*
    用户登录,注册,退出接口
   */
  "login": {
    api: "user/login",
    method: "post"
  },
  "reg": {
    api: "user/register",
    method: "post"
  },
  "getUserInfo": {
    api: "user/getUserInfo",
    method: "post"
  },
  "logout": {
    api: "user/logout",
    method: "post"
  },
  "chkUser": {
    api: "user/checkUser",
    method: "post"
  },

  //获取授权公众号列表
  "getMulApp": {
    api: "authinfo/getMulAppid",
    method: "post"
  },

  //获取公众号信息
  "getAppInfo": {
    api: "authinfo/getAuthInfo",
    method: "post"
  },

  //获取自定义菜单列表
  "getMenuList": {
    api: "menu/getMenuList",
    method: "post"
  },
  "createMenu": {
    api: "menu/createMenu",
    method: "post"
  },

  /*
    素材接口
   */
  "synchMaterial": {  //同步素材数据到本地数据库
    api: "dataSynch/dataSynchMaterial",
    method: "post"
  },
  "getNews": { //获取图文列表
    api: "material/getBatchMeteriaNews",
    method: "post"
  },
  "getMedialist": {  //获取其他素材列表(img, audio, video)
    api: "material/getBatchMeterialList",
    method: "post"
  },
  "delMedias": { //删除素材
    api: "material/delMaterial",
    method: "post"
  },
  "getMaterialInfo": { //获取素材信息
    api: "material/getMediaImage",
    method: "post"
  },
  "getTempMaterial": { //获取临时素材信息
    api: "material/getTemporaryMaterial",
    method: "post"
  },
  "getBatchMaterialInfo": { //批量获取素材信息
    api: "material/getMediaList",
    method: "post"
  },


  /*
    用户接口
   */
  "getUserList": {  //获取用户列表
    api: "wxuser/getWxUserListInfo",
    method: "post"
  },
  "updateRemark": { //修改用户备注
    api: "wxuser/updateRemark",
    method: "post"
  },
  "getUserlistByGroupId": { //根据组ID获取用户列表
    api: "wxuser/getUserByGroup",
    method: "post"
  },

  /*
    分组接口
   */
  "getUserGroup": { //获取用户分组列表
    api: "group/findAllGroups",
    method: "post"
  },
  "createUserGroup": { //创建用户分组
    api: "group/createNewGroup",
    method: "post"
  },
  "modifyGroupName": { //修改分组名称
    api: "group/modifyGroupName",
    method: "post"
  },
  "delGroup": { //删除分组
    api: "group/delUserGroup",
    method: "post"
  },
  "userGroupBatchUpdate": {  //批量更新用户分组(多个分组ID,多个用户ID)
    api: "group/membersBatchUpdate",
    method: "post"
  },
  "moveUserToGroup": { //移动单个用户到分组(多个分组ID,单个用户ID)
    api: "group/moveUserToGroup",
    method: "post"
  },

  /*
  自动回复接口
   */
  "isOpenReplyStatus": {
    api: "replymsg/getGhAutoReplyInfoYesOrNo",
    method: "post"
  },
  "getReplyInfo": { //获取自动回复信息
    api: "replymsg/GhAutoReplyInfo",
    method: "post"
  },
  "saveReplyRule": { //保存自动回复规则
    api: "replymsg/UpdateAutoRelyMsg",
    method: "post"
  },
  "delAutoRelyMsg": {  //删除自动回复信息
    api: "replymsg/delAutoRelyMsg",
    method: "post"
  },

  /*
  信息接口
   */
  "getWxMsg": { //获取信息列表
    api: "wxusermsg/getWxUserMsgByAppid",
    method: "post"
  },
  "replyMsg": { //回复信息
    api: "replymsg/relyMsgbyWeb",
    method: "post"
  },


  /*
  数据中心
   */
  "getFansData": {  //粉丝数据
    api: "dataCenter/getXfxUserDayAdd",
    method: "post"
  },
  "getArticleAnalysisData": {  //阅读数
    api: "dataCenter/getArticleAnalysisData",
    method: "post"
  },
  "getXfxUserAdd": { //获取粉丝每时增加数
    api: "dataCenter/getXfxUserHourAdd",
    method: "post"
  },

  /*
  生成企业二维码
   */
  "createQyQr": {  //生成企业二维码
    api: "wxqrcode/createQyQr",
    method: "post"
  },
  "getQrcodeList": {  //获取企业二维码
    api: "wxqrcode/getQrcodeList",
    method: "post"
  },

  "delQrcodeList": {
    api: "wxqrcode/delQrcodeList",
    method: "post"
  }


}