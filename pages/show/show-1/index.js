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
        userName:"",
        userMobile:"",
        userAddress:"",
        drawType:""

    },
    onLoad:function (e) {
        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            this.setData({
                openId:info.openId
            });
            this.getUserinfo();
        }).catch(() => {
            //console.log("是走了这里："+app.globalData.reurl);
            wx.redirectTo({url: "/pages/home/index"});
        });

        //console.log(e.categary)
        let that = this;
        that.setData({
            _cate:e.categary
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



                that.setData({
                    userName: result.data.data.userName,
                    userMobile: result.data.data.userMobile,
                    userAddress: result.data.data.userAddress,
                    drawType:result.data.data.drawType
                });


            }else{
                Toast.error(result.data.errmsg);
            }
        });
    },
    gotominiapp:function () {
        app.gotominiapp();
    }
});
