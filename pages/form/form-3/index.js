import Auth                     from '../../../plugins/auth.plugin'
import Router                   from '../../../plugins/router.plugin'
import Http                     from '../../../plugins/http.plugin'
import Toast                    from '../../../plugins/toast.plugin'

//获取应用实例
const app = getApp();


Page({
    data:{
       _cate: '',
        openId:'',
        codetxt:"",
        codeimg:"",
        issubmit:"0",
        vcode:"",
        valVcode:'',
        valTel:""

    },
    onLoad:function (e) {
        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            this.setData({
                openId:info.openId
            })

            if(app.globalData.store){
                console.log(app.globalData.store)
                this.setData({
                    storename:app.globalData.store
                })
            }

            this.getVcode();

        }).catch(() => {
            //console.log("是走了这里："+app.globalData.reurl);
            wx.redirectTo({url: "/pages/home/index"});
        });




    },

    userSubmit:function (e) {
        let that = this;
        //提交领券信息
        console.log('form发生了submit事件，携带数据为：', e.detail.value)

        if(e.detail.value.telePhone != ""){
            let that = this;
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/user_coupon',
                data:{
                    openId:that.data.openId,
                    userMobile :e.detail.value.telePhone,
                    userSmsCode:e.detail.value.msgCode,
                    userStoreName:e.detail.value.store,
                    userStoreNo:app.globalData.storeno

                }
            };
            return Http(options).then((result) => {
                if(result.data.errcode == 0){
                    Router.push('show-3');
                }else{
                    Toast.error(result.data.errmsg);
                }
            })
        }else{
            Toast.error("请正确的填写！");
        }



    },

    getVcode:function () {
        //获取验证码接口
        let that = this;
        let options = {
            url: 'https://werun.renlai.fun/wechat/cposition/get_verify_code',
            data:{
                openId:that.data.openId
            }
        };
        return Http(options).then((result) => {
            this.setData({
                vcode: result.data.data.code
            })
        })
    },
    valVcode: function(e){
        let that = this;
        that.setData({
            valVcode:e.detail.value
        });
    },
    valTel: function(e){
        let that = this;
        that.setData({
            valTel:e.detail.value
        });
    },
    getmsg:function(){
        //获取短信验证码接口
        console.log("valTel:"+this.data.valTel)
        console.log("valVcode:"+this.data.valVcode)

        //https://werun.renlai.fun/wechat/red/user_sendsms
        if(this.data.valTel&&this.data.valVcode){
            let that = this;
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/get_sendsms',
                data:{
                    openId:that.data.openId,
                    verify:this.data.valVcode,
                    mobile:this.data.valTel
                }
            };
            return Http(options).then((result) => {
                if(result.data.errcode != 0){
                    Toast.error(result.data.errmsg);
                }else{
                    Toast.error("短信发送成功，请注意查收！");
                }
            })
        }else{
            Toast.error("手机号和验证码为必须的！");
        }
    },
    selectstore:function () {
        Router.push('store');
        //wx.redirectTo({url: "/pages/store/store"});
    },
    gotominiapp:function () {
        app.gotominiapp();
    }
});
