import Auth                     from '../../plugins/auth.plugin'
import Router                   from '../../plugins/router.plugin'
import Http                     from '../../plugins/http.plugin'
import Toast                    from '../../plugins/toast.plugin'

//获取应用实例
const app = getApp();
const stringUtil = require('../../utils/stringUtil.js');
const Tool = require('../../utils/tools.js');



var rpx;
//获取屏幕宽度，获取自适应单位
wx.getSystemInfo({
    success: function(res) {
        rpx = res.windowWidth/750;
    },
})


var numCount = 4;
var numSlot = 4;
var mW = 365*rpx;
var mH = 300*rpx;
var mCenter = mW / 2; //中心点
var mCenterY = mH / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenterY - 45*rpx; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")

//console.log(mH)


Page({

    /**
     * 页面的初始数据
     */
    data: {
        stepText:5,
        chanelArray1:"",
        openId:"",//查询当前页面用户的openid
        localopenId:"",
        owner:"0",//0 客人  1主人
        isSuccess:null,
        avatar:"../../../assets/images/avatar.jpg",
        stateValueA:"",
        stateValueB:"",
        stateValueC:"",
        stateValueD:"",
        isStateA:"",
        isStateB:"",
        isStateC:"",
        isStateD:"",
        drawType:"",
        isReceive:"",
        showtip:"助力成功，我也要抽奖",
        tipshow:0

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function (e) {
        app.globalData.reurl="";

        let that = this;

        let _openid;




            if(e.scene){
                //&是我们定义的参数链接方式
                var scene = decodeURIComponent(e.scene)
                _openid = scene;
                //其他逻辑处理。。。。。
            }else if(e.openId){
                _openid = e.openId;

            }

                that.setData({
                    openId: _openid
                });


        Auth.getToken().then((info) => {
            //console.log('=========='+info.openId)
            //this.data.openId(info.openId);
            let that = this;
            console.log("that.data.openId:"+that.data.openId);
            console.log("info.openId:"+info.openId);
            if(info.openId){
                if(that.data.openId == info.openId){
                   // console.log("同样")
                    //that.setData({
                      //  owner: "1"
                    //});

                    Router.push('home_index');
                }
            }

        }).catch(() => {
            app.globalData.reurl = Tool.getCurrentPageUrlWithArgs();
            wx.redirectTo({url: "/pages/home/index"});
        });

            this.getUserinfo()



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

                 var arr = new Array(new Array("健康",result.data.data.stateValueD),new Array("桃花运",result.data.data.stateValueC),new Array("职场",result.data.data.stateValueB),new Array("颜值",result.data.data.stateValueA));


                 that.setData({
                     stateValueA: result.data.data.stateValueA,
                     stateValueB: result.data.data.stateValueB,
                     stateValueC: result.data.data.stateValueC,
                     stateValueD: result.data.data.stateValueD,
                     isStateA: result.data.data.isStateA,
                     isStateB: result.data.data.isStateB,
                     isStateC: result.data.data.isStateC,
                     isStateD: result.data.data.isStateD,
                     chanelArray1:arr,
                     activityUrl:result.data.data.activityUrl,
                     avatar:result.data.data.avatar,
                     isSuccess:result.data.data.isSuccess,
                     drawType:result.data.data.drawType,
                     isReceive:result.data.data.isReceive
                 });

                 //雷达图
                 this.drawRadar();

             }else{
                 Toast.error(result.data.errmsg);
             }
        });
    },

    // 雷达图
    drawRadar:function(){
        var sourceData1 = this.data.chanelArray1
       // var sourceData2 = this.data.chanelArray2

        //调用
        //this.drawEdge() //画六边形
        this.drawArcEdge() //画圆
       // this.drawLinePoint()
        //设置数据
        this.drawRegion(sourceData1,'rgba(255, 255, 255, 0.5)') //第一个人的
        //this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人
        //设置文本数据
        //this.drawTextCans(sourceData1)
        //设置节点
        this.drawCircle(sourceData1,'white')
        //this.drawCircle(sourceData2,'yellow')
        //开始绘制
        radCtx.draw()
    },
    // 绘制6条边
    drawEdge: function(){
        radCtx.setStrokeStyle("white")
        radCtx.setLineWidth(2)  //设置线宽
        for (var i = 0; i < numSlot; i++) {
            //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)
            //画6条线段
            for (var j = 0; j < numCount; j++) {
                //坐标
                var x = mCenter + rdius * Math.cos(mAngle * j);
                var y = mCenter + rdius * Math.sin(mAngle * j);
                radCtx.lineTo(x, y);
            }
            radCtx.closePath()
            radCtx.stroke()
        }
    },
    // 第一步：绘制6个圆，你可以通过修改numSlot的数的大小，来确定绘制几个圆
    drawArcEdge: function(){
        radCtx.setStrokeStyle("white")  //设置线的颜色
        radCtx.setLineWidth(1)  //设置线宽
        for (var i = 0; i < numSlot; i++) {  //需要几个圆就重复几次
            // //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)  //计算每个圆的半径
            radCtx.arc(mCenter, mCenterY, rdius, 0, 2 * Math.PI) //开始画圆
            radCtx.stroke()
        }
    },
    // 绘制连接点
    drawLinePoint:function(){
        radCtx.beginPath();
        for (var k = 0; k < numCount; k++) {
            var x = mCenter + mRadius * Math.cos(mAngle * k);
            var y = mCenterY + mRadius * Math.sin(mAngle * k);

            radCtx.moveTo(mCenter, mCenterY);
            radCtx.lineTo(x, y);
        }
        radCtx.stroke();
    },
    //绘制数据区域(数据和填充颜色)
    drawRegion: function (mData,color){

        radCtx.beginPath();
        for (var m = 0; m < numCount; m++){
            var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
            var y = mCenterY + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

            radCtx.lineTo(x, y);
        }
        radCtx.closePath();
        radCtx.setFillStyle(color)
        radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData){

        radCtx.setFillStyle("white")
        radCtx.font = 'bold 12px cursive'  //设置字体
        for (var n = 0; n < numCount; n++) {
            var x = mCenter + mRadius * Math.cos(mAngle * n);
            var y = mCenterY + mRadius * Math.sin(mAngle * n);
            // radCtx.fillText(mData[n][0], x, y);
            //通过不同的位置，调整文本的显示位置
            if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
                radCtx.fillText(mData[n][1], x-25, y+15);
            } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
            } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-5, y);
            } else {
                radCtx.fillText(mData[n][0], x+7, y+2);
            }

        }
    },
    //画点
    drawCircle: function(mData,color){
        var r = 1.5; //设置节点小圆点的半径
        for(var i = 0; i<numCount; i ++){
            var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
            var y = mCenterY + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

            radCtx.beginPath();
            radCtx.arc(x, y, r, 0, Math.PI * 2);
            radCtx.fillStyle = color;
            radCtx.fill();
        }

    },

    
    userHelp:function () {
        //console.log('进入这里')
        let that = this;

        let userToken = wx.getStorageSync("$USER_TOKEN");
        console.log(userToken);
        if(userToken){
            console.log("userToken.openId:"+userToken.data);

            console.log("that.data.openId:"+that.data.openId);
                        let options = {
                            url: 'https://werun.renlai.fun/wechat/cposition/user_help',
                            data:{
                                openId:userToken.openId,
                                fromOpenId:that.data.openId
                            }
                        };
                        return Http(options).then((result) => {
                            console.log(result.data)
                            if(result.data.errcode == 0){
                               // Toast.error("助力成功");
                                if(result.data.data.isSuccess == 1){

                                    that.setData({
                                        tipshow:"1",
                                        showtip:"助力成功，我也要去抢C位"
                                    });
                                }else{
                                    that.setData({
                                        tipshow:"1",
                                        showtip:"助力成功，我也要去抢C位"
                                    });
                                }


                                this.getUserinfo()
                            }else{
                                Toast.error(result.data.errmsg);
                            }
                        });
        }else{
            //console.log("毛都没有")
            console.log('这里去登陆')
            app.globalData.reurl = Tool.getCurrentPageUrlWithArgs();
            wx.redirectTo({url: "/pages/home/index"});
        }


    },

    wantJoin:function(){


        let that = this;
        let userToken = wx.getStorageSync("$USER_TOKEN");
        if(userToken){
            let that = this;
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/get_user_info',
                data:{
                    openId:userToken.openId
                }
            };
            return Http(options).then((result) => {
                console.log(result.data)
                if(result.data.errcode == 0){
                    //this.getUserinfo()
                    if(result.data.data.isSuccess == 0){
                        return Router.push('avatarupload');
                    }else{
                        return Router.push('home_index');
                    }

                }else{
                    Toast.error(result.data.errmsg);
                }
            });
        }else{
            //console.log("毛都没有")
            console.log('这里去登陆')
            //app.globalData.reurl = Tool.getCurrentPageUrlWithArgs();
            wx.redirectTo({url: "/pages/home/index"});
        }



    },
    gotoform:function () {
        var _result = this.data.drawType;
        console.log(_result)

        //中奖类型：1、爱马仕围巾  2、拍立得 3、星巴克(100) 4、星巴克(50) 5、爱奇艺 6、强生试戴片
        switch (_result)
        {
            case "1":
                wx.navigateTo({
                    url: '/pages/form/form-1/index?categary=1'
                })
                break;
            case "2":
                wx.navigateTo({
                    url: '/pages/form/form-1/index?categary=2'
                })
                break;
            case "3":
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=3'
                })
                break;
            case "4":
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=2'
                })
                break;
            case "5":
                wx.navigateTo({
                    url: '/pages/form/form-2/index?categary=1'
                })
                break;
            case "6":
                wx.navigateTo({
                    url: '/pages/form/form-3/index'
                })
                break;
        }
    },
    gotoshow:function () {
        var _result = this.data.drawType;
        console.log(_result)

        //中奖类型：1、爱马仕围巾  2、拍立得 3、星巴克(100) 4、星巴克(50) 5、爱奇艺 6、强生试戴片
        switch (_result)
        {
            case "1":
                wx.navigateTo({
                    url: '/pages/show/show-1/index?categary=1'
                })
                break;
            case "2":
                wx.navigateTo({
                    url: '/pages/show/show-1/index?categary=2'
                })
                break;
            case "3":
                wx.navigateTo({
                    url: '/pages/show/show-2/index?categary=3'
                })
                break;
            case "4":
                wx.navigateTo({
                    url: '/pages/show/show-2/index?categary=2'
                })
                break;
            case "5":
                wx.navigateTo({
                    url: '/pages/show/show-2/index?categary=1'
                })
                break;
            case "6":
                wx.navigateTo({
                    url: '/pages/show/show-3/index'
                })
                break;
        }
    },
    gotohome:function () {
        Router.push('authorization_index')
    },

    closetip:function () {
        let that = this;
        that.setData({
            tipshow:"0"
        });
    },
    gotominiapp:function () {
        app.gotominiapp();
    }

})