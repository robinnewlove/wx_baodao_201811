import Auth                     from '../../plugins/auth.plugin'
import Router                   from '../../plugins/router.plugin'
import Http                     from '../../plugins/http.plugin'
import Toast                    from '../../plugins/toast.plugin'

//获取应用实例
const app = getApp();
const stringUtil = require('../../utils/stringUtil.js');
const Tool = require('../../utils/tools.js');

const avatarStrokeWidth = 3;



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
        owner:null,//0 客人  1主人
        isSuccess:null,
        //avatar:"../../../assets/images/avatar.jpg",
        stateValueA:"",
        stateValueB:"",
        stateValueC:"",
        stateValueD:"",
        isStateA:"",
        isStateB:"",
        isStateC:"",
        isStateD:"",
        isReceive:"",
        drawType:"",

        //分享用到字段
        showimgbox:false,


        //画布相关字段
        canvasHeight:"0",
        canvasWidth:"0",
        avatar:'',
        uploadavatar:'',
        bgImage: ['https://werun.renlai.fun/static/cposition/share-1.jpg'],
        qurl:"",
        imgload:0,
        bgImagePath:"",
        avatarPath:"",
        qurlPath:"",
        uploadavatarPath:"",
        targetSharePath: null,
        avatarWidth:'0',
        avatarLeft:"",
        avatarTop:"",
        nickName:"亲爱的用户",
        nickNameTop:"",
        nickNameLeft:"",
        txtTop:"",
        txtLeft:"",
        qcodeTop:"",
        qcodeWidth:0,
        qcodeLeft:"",
        uploadavatarWidth:"",
        uploadavatarLeft:"",
        uploadavatarTop:""

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function (e) {

        let that = this;

        Auth.getToken().then((info) => {
            console.log('=========='+info.openId)
            //this.data.openId(info.openId);
            that.setData({
                localopenId:info.openId
            })
            this.getUserqrcode();
            //雷达图
            this.getUserinfo(that.data.openId)


        }).catch(() => {

            //app.globalData.reurl = Tool.getCurrentPageUrlWithArgs();
            console.log("是走了这里："+app.globalData.reurl);

            //Router.push('authorization_index');

            wx.redirectTo({url: "/pages/home/index"});
        });



        wx.getSystemInfo({
            success: function (res) {
                //console.log(res.windowWidth)
                //根据图片算图片矩形的宽高
                var scaleNum = res.windowWidth*0.7/750;
                that.setData({
                    canvasWidth:res.windowWidth*0.7,
                    canvasHeight:scaleNum*1334,
                    avatarWidth:scaleNum*120,
                    avatarTop:scaleNum*133,
                    avatarLeft:scaleNum*60,
                    nickNameTop:scaleNum*160,
                    nickNameLeft:scaleNum*219,
                    qcodeTop:scaleNum*948,
                    qcodeLeft:scaleNum*948,
                    qcodeWidth:scaleNum*300*0.8,
                    txtTop:scaleNum*340,
                    txtLeft:scaleNum*218,
                    qcodeLeft:scaleNum*80,
                    uploadavatarWidth:scaleNum*200,
                    uploadavatarLeft:scaleNum*470,
                    uploadavatarTop:scaleNum*276,

                })


                //console.log("qcodeWidth:"+that.data.qcodeWidth)
            },
        });


        app.globalData.reurl="";
        wx.showShareMenu({
            withShareTicket: true
        });


        let _openid;

    },

    getUserinfo:function(openid){
        let that = this;
        let options = {
            url: 'https://werun.renlai.fun/wechat/cposition/get_user_info',
            data:{
                openId:that.data.localopenId
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
                     isReceive:result.data.data.isReceive,
                     drawType:result.data.data.drawType,
                     nickName:result.data.data.nickName,
                     uploadavatar:result.data.data.activityUrl
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
    //分享
    onShareAppMessage: function (res) {
        let that = this;
        return {
            title: '缺标题缺标题缺标题！',
            path: '/pages/visit/index?openId='+that.data.localopenId,
            imageUrl:'https://werun.renlai.fun/static/cposition/share.jpg',
            success: function (res) {
                console.log("shareTickets:"+res)
              //  that.hideshare();
                // console.log
            },
            fail: function (res) {
                // 分享失败
                console.log(res)
            }

        }
    },

    lottery:function () {
        return Router.push('lottery');
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



    //显示分享层
    showshare:function(){


        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })

        this.animation = animation

        animation.bottom(0).step();

        this.setData({
            animationData:animation.export(),
            maskboxshow:"show"

        })
    },
    //隐藏分享层
    hideshare:function(){


        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })

        this.animation = animation

        animation.bottom("-450rpx").step();

        this.setData({
            animationData:animation.export(),
            maskboxshow:""

        })
    },

    shereImgshow:function () {
        let that = this;
        that.hideshare();
        that.setData({
            showimgbox:true
        });

        that.shareMoments();
    },

    shareMoments: function () {
        let that = this;
        //没有分享图先用 canvas 生成，否则直接预览
        // if (that.data.targetSharePath) {
        //     that.setData({
        //         realShow: false
        //     })
        // } else {
        that.showLoading();
        that.downloadAvatar();
        //}
    },

    showLoading: function () {
        wx.showLoading({
            title: '加载中...',
        })
    },

    hideLoading: function () {
        wx.hideLoading();
    },

    showErrorModel: function (content) {
        this.hideLoading();
        if (!content) {
            content = '网络错误';
        }
        // wx.showModal({
        //     title: '提示',
        //     content: content,
        // })
    },

    /**
     * 改变字体样式
     */
    setFontStyle: function (ctx, fontWeight) {
        if (wx.canIUse('canvasContext.font')) {
            ctx.font = 'normal ' + fontWeight + ' ' + '14px' + ' sans-serif';
        }
    },

    //下载资源
    //下载资源
    downloadAvatar: function () {
        var that = this;
        that.setData({
            imgload:0
        });
        console.log("头像资源："+that.data.avatar);
        const downloadTask1 = wx.downloadFile({
            url: that.data.avatar,
            success: function (res) {
                that.setData({
                    avatarPath: res.tempFilePath
                })
            },
            fail: function (err) {
                console.log(err)
                that.showErrorModel();
            }
        });


        downloadTask1.onProgressUpdate((res) => {
            console.log(res.progress)
            if(res.progress == 100){
                console.log('头像下载完成');
                that.setData({
                    imgload:that.data.imgload+1
                })
                if(that.data.imgload == 4){
                    console.log('执行画画3');
                    that.drawImage();
                }
            }
        })


        const downloadTask4 = wx.downloadFile({
            url: that.data.uploadavatar,
            success: function (res) {
                that.setData({
                    uploadavatarPath: res.tempFilePath
                })
            },
            fail: function (err) {
                console.log(err)
                that.showErrorModel();
            }
        });


        downloadTask4.onProgressUpdate((res) => {
            console.log(res.progress)
            if(res.progress == 100){
                console.log('上传头像下载完成');
                that.setData({
                    imgload:that.data.imgload+1
                })
                if(that.data.imgload == 4){
                    console.log('执行画画3');
                    that.drawImage();
                }
            }
        })

        var bgImageitem = that.data.bgImage[Math.floor(Math.random()*that.data.bgImage.length)];

        wx.downloadFile({
            url: bgImageitem,
            success: function (res) {
                that.setData({
                    bgImagePath: res.tempFilePath,
                    imgload:that.data.imgload+1
                })
                console.log(that.data.imgload);
                if(that.data.imgload == 4){
                    console.log('执行画画2');
                    that.drawImage();
                }

            },
            fail: function () {
                that.showErrorModel();
            }
        });
        const downloadTask = wx.downloadFile({
            url: that.data.qurl,
            success: function (res) {
                console.log("获得URL："+res.tempFilePath)
                that.setData({
                    qurlPath: res.tempFilePath,
                })
            },
            fail: function () {
                that.showErrorModel();
            }
        });
        downloadTask.onProgressUpdate((res) => {
            console.log(res)
            if(res.progress == 100){
                console.log('二维码下载完成');
                that.setData({
                    imgload:that.data.imgload+1,
                })
                if(that.data.imgload == 4){
                    console.log('执行画画3');
                    console.log(that.data.qurlPath);
                    that.drawImage();
                }
            }
        })

    },

    drawImage: function () {

        var that = this;
        const ctx = wx.createCanvasContext('myCanvas', this);


        var bgPath = that.data.bgImagePath;
        ctx.setFillStyle("#734c73");
        ctx.fillRect(0, 0, that.data.canvasWidth, that.data.canvasHeight);

        //绘制背景图片
        ctx.drawImage(bgPath, 0, 0, that.data.canvasWidth, that.data.canvasHeight);


        //用户名
        that.setFontStyle(ctx, 'bold');
        ctx.setFillStyle("#ff5a71");
        ctx.setFontSize(15);
        ctx.setTextAlign('left');
        ctx.setTextBaseline('top');
        ctx.fillText(stringUtil.substringStr(that.data.nickName),that.data.nickNameLeft,that.data.nickNameTop);

//开始





///结束
        //绘制头像



        // ctx.arc(that.data.avatarWidth/2+avatarStrokeWidth+that.data.avatarLeft, that.data.avatarWidth/2+avatarStrokeWidth+that.data.avatarTop, that.data.avatarWidth/2+avatarStrokeWidth, 0, 2 * Math.PI);
        // ctx.setFillStyle('#FFFFFF');
        // ctx.fill();

        //头像裁剪
        ctx.save();



        ctx.arc(that.data.qcodeLeft + that.data.qcodeWidth / 2, that.data.qcodeWidth/2+that.data.qcodeTop, that.data.qcodeWidth/2*1.1, 0, 2 * Math.PI);
        ctx.setFillStyle("#ffffff");
        ctx.fill();




        ctx.arc(that.data.avatarWidth/2+avatarStrokeWidth+that.data.avatarLeft, that.data.avatarWidth/2+avatarStrokeWidth+that.data.avatarTop, that.data.avatarWidth/2, 0, 2 * Math.PI);
        ctx.setFillStyle('#FFFFFF');
        ctx.fill();

        ctx.arc(that.data.uploadavatarWidth/2+avatarStrokeWidth+that.data.uploadavatarLeft, that.data.uploadavatarWidth/2+avatarStrokeWidth+that.data.uploadavatarTop, that.data.uploadavatarWidth/2, 0, 2 * Math.PI);
        ctx.setFillStyle('#FFFFFF');
        ctx.fill();

        ctx.clip();

        var avatarWidth = that.data.avatarWidth;//头像半径
        ctx.drawImage(that.data.avatarPath,that.data.avatarLeft+avatarStrokeWidth,that.data.avatarTop+avatarStrokeWidth, avatarWidth, avatarWidth);

        var avatarWidth1 = that.data.uploadavatarWidth;//头像半径
        ctx.drawImage(that.data.uploadavatarPath,that.data.uploadavatarLeft+avatarStrokeWidth,that.data.uploadavatarTop+avatarStrokeWidth, avatarWidth1, avatarWidth1);


        ctx.drawImage(that.data.qurlPath,that.data.qcodeLeft,that.data.qcodeTop, that.data.qcodeWidth,that.data.qcodeWidth);



        ctx.restore();










        // //ctx.arc(that.data.qcodeWidth/2+that.data.avatarLeft*1.1, that.data.qcodeWidth/2+that.data.qcodeTop, that.data.qcodeWidth/2*1.1, 0, 2 * Math.PI);
        // ctx.arc(that.data.qcodeLeft + that.data.qcodeWidth / 2, that.data.qcodeWidth/2+that.data.qcodeTop, that.data.qcodeWidth/2*1.1, 0, 2 * Math.PI);
        // ctx.setFillStyle("#ffffff");
        // ctx.fill();
        // ctx.clip();


        // console.log("========:"+that.data.qurlPath);
        // ctx.drawImage(that.data.qurlPath,that.data.qcodeLeft,that.data.qcodeTop, that.data.qcodeWidth,that.data.qcodeWidth);




        //绘制到 canvas 上
        ctx.draw(false, function () {
            console.log('callback--------------->');
            that.saveCanvasImage();
        });
    },

    saveCanvasImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function (res) {
                console.log(res.tempFilePath);
                that.setData({
                    targetSharePath: res.tempFilePath,
                    realShow: false
                })
            },
            complete: function () {
                that.hideLoading();
            }
        }, this)
    },
    /**
     * 保存到相册
     */
    saveImageTap: function () {
        var that = this;
        that.requestAlbumScope();
    },

    /**
     * 检测相册权限
     */
    requestAlbumScope: function () {
        var that = this;
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    that.saveImageToPhotosAlbum();
                } else {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success(res) {
                            that.saveImageToPhotosAlbum();
                        },
                        fail() {
                            wx.showModal({
                                title: '提示',
                                content: '你需要授权才能保存图片到相册',
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.openSetting({
                                            success: function (res) {
                                                if (res.authSetting['scope.writePhotosAlbum']) {
                                                    that.saveImageToPhotosAlbum();
                                                } else {
                                                    console.log('用户未同意获取用户信息权限-------->success');
                                                }
                                            },
                                            fail: function () {
                                                console.log('用户未同意获取用户信息权限-------->fail');
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    saveImageToPhotosAlbum: function () {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.targetSharePath,
            success: function () {
                wx.showModal({
                    title: '',
                    content: '✌️图片保存成功，\n快去分享到朋友圈吧',
                    showCancel: false
                })
                that.hideDialog();
            }
        })
    },

    closesaveImage:function () {
        let that = this;
        that.setData({
            showimgbox:false
        })
    },

    getUserqrcode:function () {
        let that = this;

        let options = {
            url: 'https://werun.renlai.fun/wechat/cposition/get_wxapp_qrcode',
            data:{
                openId:that.data.localopenId
            }
        };
        return Http(options).then((result) => {
            if(result.data.errcode == 0){
                that.setData({
                    qurl:result.data.data.qrcode,
                    //avatar:result.data.data.avatarUrl,
                    //nickName:result.data.data.nickName
                })
                this.downloadAvatar();
            }else{
                Toast.error(result.data.errmsg);
            }
        });

    }

})