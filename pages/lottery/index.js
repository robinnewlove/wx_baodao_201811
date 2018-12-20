//index.js
import Auth                     from '../../plugins/auth.plugin'
import Router                   from '../../plugins/router.plugin'
import Http                     from '../../plugins/http.plugin'
import Toast                    from '../../plugins/toast.plugin'

//获取应用实例
const app = getApp();
const stringUtil = require('../../utils/stringUtil.js');
const Tool = require('../../utils/tools.js');




Page({


    data: {
        lootery:"",
        openId:"",
        cando:"0",
        proname:"",
        tipshow:"0",
        result:""
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


        // Auth.getToken().then((info) => {
        //     //this.data.openId(info.openId);
        //     this.setData({
        //         openId:info.openId
        //     })
        // }).catch(() => {
        //     Router.push('authorization_index');
        // });




    },
    //中奖类型：1、爱马仕围巾  2、拍立得 3、星巴克(100) 4、星巴克(50) 5、爱奇艺 6、强生试戴片
    lottery:function () {
        console.log('抽奖开始！');
        this.setData({
            cando:"1"
        });
        var num=Math.floor(Math.random()*3+1);
        //console.log('随机数'+num);
        let that = this;
        let options = {
            url: 'https://werun.renlai.fun/wechat/cposition/user_lucky_draw',
            data:{
                openId:that.data.openId
            }
        };
        return Http(options).then((result) => {
            //console.log(result.data.errcode)
            if(result.data.errcode == 0){
                //抽奖逻辑
                //console.log(result.data.data.drawType)

                //if()
                var step = result.data.data.drawType;
                this.setData({
                    result:result.data.data.drawType
                });
                switch (step)
                {
                    case 1:
                        this.lotterystart(47);
                        this.setData({
                            proname:"爱马仕丝巾"
                        });
                        break;
                    case 2:
                        this.lotterystart(42);
                        this.setData({
                            proname:"拍立得"
                        });
                        break;
                    case 3:
                        this.lotterystart(48);
                        this.setData({
                            proname:"面值100元星巴克代金券"
                        });
                        break;
                    case 4:
                        this.lotterystart(46);
                        this.setData({
                            proname:"面值50元星巴克代金券"
                        });
                        break;
                    case 5:
                        this.lotterystart(44);
                        this.setData({
                            proname:"面值58元 爱奇艺"
                        });
                        break;
                    case 6:
                        this.setData({
                            proname:"强生试戴片"
                        });
                        if(num == 1){
                            this.lotterystart(49);
                        }else if(num == 2){
                            this.lotterystart(51);
                        }else{
                            this.lotterystart(53);
                        }
                        break;
                }

            }else{
                Toast.error(result.data.errmsg);
            }
        });




        //this.lotterystart(57);
    },
    lotterystart:function (_time) {
        let that = this;
        let times = 0;
        let _lootery = 1;
        var _speed = 100;
        var i = setInterval(function() {
            times++;
            if (times >= _time) {
                that.setData({
                    tipshow:"1"
                });
                clearInterval(i)
            } else {
                //console.log(times)
                if(_lootery<8){
                    _lootery++
                }else{
                    _lootery = 1;
                }
                that.setData({
                    lootery:_lootery
                })
            }
        }, _speed)
    },

    btnGet:function () {
        var _result = this.data.result;
        console.log(_result)

        //中奖类型：1、爱马仕围巾  2、拍立得 3、星巴克(100) 4、星巴克(50) 5、爱奇艺 6、强生试戴片
        switch (_result)
        {
            case 1:
                wx.navigateTo({
                    url: '/pages/form/form-1/index?categary=1'
                })
                break;
            case 2:
                wx.navigateTo({
                    url: '/pages/form/form-1/index?categary=2'
                })
                break;
            case 3:
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=3'
                })
                break;
            case 4:
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=2'
                })
                break;
            case 5:
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=1'
                })
                break;
            case 6:
                wx.navigateTo({
                    url: '/pages/form/form-3/index'
                })
                break;
        }
    },
    gotominiapp:function () {
        app.gotominiapp();
    }
});