//index.js
import Auth                     from '../../plugins/auth.plugin'
import Router                   from '../../plugins/router.plugin'
import Http                     from '../../plugins/http.plugin'
import Toast                    from '../../plugins/toast.plugin'



//获取应用实例
const app = getApp();
const stringUtil = require('../../utils/stringUtil.js');


Page({
    data:{
        storedata:[],
        //testname:"1234567890"
    },
    onLoad:function () {
        let that = this;



    },

    onShow () {
        Auth.getToken().then((info) => {
            this.showStore(info);
        }).catch(() => {
            Router.push('authorization_index');
        });
    },

    showStore:function () {
        let that = this;
        wx.getLocation({
            type: 'wgs84',
            success (res) {
                //const latitude = res.latitude
                //const longitude = res.longitude

                let options = {
                    url: 'https://werun.renlai.fun/wechat/cposition/get_store_list',
                    data:{
                        coordinate:res.longitude+","+res.latitude,
                        num:200
                    }
                };
                return Http(options).then((result) => {
                    //console.log(result.data.data.list.length)
                    that.setData({
                        selectdata:result.data.data.list
                    })
                    //if(result.data.data.list.length)
                });

            }
        })


    },
    placeChoose:function (options) {
        //console.log(options.currentTarget.dataset.location)
        app.globalData.store = options.currentTarget.dataset.location;
        app.globalData.storeno = options.currentTarget.dataset.storeno;
        wx.redirectTo({url: "/pages/form/form-3/index"});
    }

})