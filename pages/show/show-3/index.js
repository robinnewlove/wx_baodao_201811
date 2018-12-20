import Auth                     from '../../../plugins/auth.plugin'
import Router                   from '../../../plugins/router.plugin'
import Http                     from '../../../plugins/http.plugin'
import Toast                    from '../../../plugins/toast.plugin'

//获取应用实例
const app = getApp();


Page({
    data:{
        openId:'',
        codetxt:"",
        codeimg:"",
        userStoreName:"",
        issubmit:"0"

    },
    onLoad:function (e) {
        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            this.setData({
                openId:info.openId
            })

            this.getVcode();
            this.getUserinfo();

        }).catch(() => {
            //console.log("是走了这里："+app.globalData.reurl);
            wx.redirectTo({url: "/pages/home/index"});
        });




    },


   getVcode:function () {
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
                   codeimg:"data:image/png;base64,"+result.data.data.base64,
                   issubmit:"1"
               });

           }else{
               Toast.error(result.data.errmsg);
           }
       })
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
                that.setData({
                    userStoreName:result.data.data.userStoreName
                });

                //雷达图
                //this.drawRadar();

            }else{
                Toast.error(result.data.errmsg);
            }
        });
    },
    gotominiapp:function () {
        app.gotominiapp();
    }
});
