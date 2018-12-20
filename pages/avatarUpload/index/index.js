import Auth                     from '../../../plugins/auth.plugin'
import Router                   from '../../../plugins/router.plugin'
import Http                     from '../../../plugins/http.plugin'
import Toast                    from '../../../plugins/toast.plugin'

//获取应用实例
const app = getApp();


Page({
  data: {
    src: '',
    openId:''
  },
  upload () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        wx.redirectTo({
          url: `../upload/upload?src=${src}`
        })
      }
    })
  },
  onLoad (option) {
    let { avatar } = option
    if (avatar) {
      this.setData({
        src: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync(avatar, "base64")
      })
    }
  },

    onShow () {
        Auth.getToken().then((info) => {
           //this.data.openId(info.openId);
            this.setData({
                openId:info.openId
            })
        }).catch(() => {
            Router.push('authorization_index');
        });
    },

    startGame:function (e) {
        console.log(e.detail)
        let that = this;
        //console.log(that.data.openId)
        if(that.data.src != ''){
            let options = {
                url: 'https://werun.renlai.fun/wechat/cposition/user_update',
                data:{
                    openId:that.data.openId,
                    formData:that.data.src,
                    formId:e.detail.formId
                }
            };
            return Http(options).then((result) => {
                //console.log(result.data.errcode)
                 if(result.data.errcode == 0){
                     Router.push('home_index');
                 }else{
                     Toast.error(result.data.errmsg);
                 }
            });
        }else{
            Toast.error("您尚未选择图片！");
        }



    },

    gotominiapp:function () {
        app.gotominiapp();
    }
})
