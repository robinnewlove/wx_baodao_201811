//index.js
import Auth                     from '../../plugins/auth.plugin'
import Router                   from '../../plugins/router.plugin'
import Http                     from '../../plugins/http.plugin'
import Toast                    from '../../plugins/toast.plugin'

//获取应用实例
const app = getApp();



Page({

    // 授权并登录
    bindGetUserInfo (e){
        //console.log(e.detail)
        let { userInfo } = e.detail;
        if (!userInfo) return;
        //console.log(e.detail.formid)
        this.userLogin(e.detail);
    },
    // 用户登录
    userLogin (_userinfo) {
        console.log('3333='+_userinfo.rawData)
        Auth.login().then((result) => {
            console.log('4444='+result)
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/user_login',
                data: {
                    code: result,
                    rawData:_userinfo.rawData,
                    signature:_userinfo.signature,
                    encryptedData:_userinfo.encryptedData,
                    iv:_userinfo.iv
                },
                loading: true,
                auth: false,
                method:"GET"
            };
        return Http(options);
    }).then((result) => {
            return Auth.updateToken(result.data.data);
    }).then((result) => {
            console.log('123='+app.globalData.reurl)
            if(app.globalData.reurl){//判断是否为跳转url
                return wx.navigateTo({url: "/"+app.globalData.reurl});
            }else{
                console.log("result.isSuccess=="+result.isSuccess)
                if(result.isSuccess == 0){
                    return Router.push('avatarupload');
                }else{
                    return Router.push('home_index');
                }
            }

    }).catch((err) => {
            Toast.error(err);
    })
    },

    clearall:function () {
        console.log("前："+wx.getStorageSync("$USER_TOKEN"))
        Auth.logout();
        Toast.error("清理完毕")
        console.log("后："+wx.getStorageSync("$USER_TOKEN"))
    }
});
