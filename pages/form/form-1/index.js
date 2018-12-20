import Auth                     from '../../../plugins/auth.plugin'
import Router                   from '../../../plugins/router.plugin'
import Http                     from '../../../plugins/http.plugin'
import Toast                    from '../../../plugins/toast.plugin'

//获取应用实例
const app = getApp();


Page({
    data:{
       _cate: '',
        openId:''
    },
    onLoad:function (e) {
        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            this.setData({
                openId:info.openId
            })
        }).catch(() => {
            //console.log("是走了这里："+app.globalData.reurl);
            wx.redirectTo({url: "/pages/home/index"});
        });

        //console.log(e.categary)
        let that = this;
        that.setData({
            _cate:e.categary
        });
        //this.userSubmit();

    },

    userSubmit:function (e) {
        let that = this;
        //提交领券信息
        console.log('form发生了submit事件，携带数据为：', e.detail.value)

        if(e.detail.value.name != "" && e.detail.value.telePhone != "" && e.detail.value.addr != ""){
            let that = this;
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/user_coupon',
                data:{
                    openId:that.data.openId,
                    userName:e.detail.value.name,
                    userMobile :e.detail.value.telePhone,
                    userAddress :e.detail.value.addr
                }
            };
            return Http(options).then((result) => {
                if(result.data.errcode == 0){
                    wx.redirectTo({
                        url: '/pages/main/index'
                    })
                }else{
                    Toast.error(result.data.errmsg);
                }
            })
        }else{
            Toast.error("请正确的填写！");
        }



    },
    gotominiapp:function () {
        app.gotominiapp();
    }
});
