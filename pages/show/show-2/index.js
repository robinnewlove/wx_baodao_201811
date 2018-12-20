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
        contents:""
    },
    onLoad:function (e) {
        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            this.setData({
                openId:info.openId
            })
            this.getUserinfo();
        }).catch(() => {
            //console.log("是走了这里："+app.globalData.reurl);
            wx.redirectTo({url: "/pages/home/index"});
        });

        //console.log(e.categary)
        let that = this;
        that.setData({
            _cate:e.categary
            //_cate:"3"
        });

    },
    getUserinfo:function(openid){
        let that = this;
        let options = {
            url: 'https://werun.renlai.fun/wechat/cposition/get_user_info',
            data:{
                openId:that.data.openId
            }
        };
        return Http(options).then((result) => {
            console.log(result.data)
            if(result.data.errcode == 0){
                //console.log('3333333')
                let that = this;
                let options = {
                    url: 'https://werun.renlai.fun/wechat/cposition/get_card_qrcode',
                    data:{
                        openId:that.data.openId
                    }
                };

                return Http(options).then((result) => {
                    if(result.data.errcode == 0){
                        //data:image/png;base64,
                        //console.log('成功')
                        var str = result.data.data.code;
                        str = str.replace(/(\d{4})/g,'$1 ').replace(/\s*$/,'');
                        that.setData({
                            codetxt:str,
                            contents:result.data.data.code,
                            codeimg:"data:image/png;base64,"+result.data.data.base64,
                            issubmit:"1"
                        });

                    }else{
                        Toast.error(result.data.errmsg);
                    }
                })

            }else{
                Toast.error(result.data.errmsg);
            }
        });
    },

    copyText: function (e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.dataset.text,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    gotominiapp:function () {
        app.gotominiapp();
    }


});
