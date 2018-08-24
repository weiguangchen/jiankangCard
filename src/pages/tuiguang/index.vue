<template>
  <div class="tuiguang">
    <img src="/static/images/tuiguang/bg.png" alt="" class="bg" mode='widthFix'>
    <div class="content" @touchstart="createShareImg" @touchend='endTouch'>
      <div class="box">
        <img src="/static/images/tuiguang/box.png" alt="" mode='widthFix' class="box-bg">
        <div class="box-text">
          {{text}}
        </div>
      </div>
      <div class="qrcode">
        <img :src="qrcode" alt="" mode='widthFix' class="img">
        <p>长按识别二维码，马上可以体验健康卡的服务</p>
      </div>
      <div class="userinfo">
        <img :src="userInfo.avatarUrl" alt="">
        <span>{{userInfo.nickName}}</span>
      </div>
    </div>
    <canvas canvas-id="tuiguang" class="canvas"></canvas>

    <van-popup :show="show" :closeOnClickOverlay='true' class="m-van-popup">
      <div class="preivew-img">
        <img :src="shareTempFilePath" alt="" class="img">
      </div>
      <div class="close">
        <img src="/static/images/tuiguang/close.png" alt="" class="icon" mode='widthFix' @click="show = false">
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions
  } from "vuex";
  import ifLoginMixin from "@/mixin/ifLoginMixin";

  export default {
    data() {
      return {
        qrcode: '',
        qrcodeTmp: '',
        userAvatar: '',
        show: false,
        shareTempFilePath: '',

        system_info: '',
        text:''
      };
    },
    onLoad() {

      this.get_qrcode();
      this.get_system();
      this.get_text();
    },
    onShow() {

    },
    computed: {
      screenWidth() {
        if (this.system_info) {
          return this.system_info.screenWidth * this.system_info.pixelRatio;

        }
      },
      screenHeight() {
        if (this.system_info) {
          return this.system_info.screenHeight * this.system_info.pixelRatio;

        }
      }
    },
    methods: {
      get_system() {
        this.system_info = wx.getSystemInfoSync();
      },
      get_text(){
        this.$ajax(this.$API+'/Api/pro/get_fx_content').then(({data})=>{
          this.text = data.fx_content;
        })
      },
      get_qrcode() {
        this.$ajax(this.$API + '/Api/Ewm/get_ewm', {
          path: 'pages/index/main',
        }).then(res => {
          console.log(res)
          this.qrcode = res.data;
        })
      },
      createShareImg() {
        var _this = this;
        this.touchtime = setTimeout(() => {
          this.createCanvas();
        }, 2000);
      },
      endTouch() {
        clearTimeout(this.touchtime);
      },
      setCanvas() {
        var _this = this;
        const ctx = wx.createCanvasContext('tuiguang');
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, 375, 667)

        ctx.drawImage('/static/images/tuiguang/bg.png', 0, 0, 375, 667)
        ctx.drawImage('/static/images/tuiguang/box.png', 57, 50, 262.5, 222);

        ctx.setTextAlign('left') // 文字居中
        ctx.setFillStyle('#fff') // 文字颜色：黑色
        ctx.setFontSize(14) // 文字字号：14px
        var text = this.text;
        var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 225) {
            temp += chr[a];
          } else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        for (var b = 0; b < row.length; b++) {
          console.log(row[b])
          ctx.fillText(row[b], 75, 80 + b * 24, 225);
        }



        ctx.drawImage(this.qrcodeTmp, 150, 320, 75, 75);
        ctx.setTextAlign('left') // 文字居中
        ctx.setFillStyle('#000000') // 文字颜色：黑色
        ctx.setFontSize(14) // 文字字号：22px
        ctx.fillText("长按识别二维码，马上可以体验健康卡的", 70, 860 / 2, 480 / 2);

        ctx.drawImage(this.userAvatar, 110, 500, 45, 45);
        ctx.fillText(this.userInfo.nickName, 163, 522.5);
        ctx.stroke()
        ctx.draw(false, function () {
          _this.getTempFilePath();
        })

      },
      getTempFilePath() {
        console.log(this.system_info)
        console.log(this.screenWidth)
        console.log(this.screenHeight)
        // return;
        var _this = this;
        wx.canvasToTempFilePath({
          canvasId: 'tuiguang',
          destWidth: _this.screenWidth,
          destHeight: _this.screenHeight,
          success: (res) => {
            console.log(res);
            this.shareTempFilePath = res.tempFilePath
            this.saveImageToPhotosAlbum();
          }
        })
      },
      saveImageToPhotosAlbum() {

        wx.saveImageToPhotosAlbum({
          filePath: this.shareTempFilePath,
          success: (res) => {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '已保存图片到手机'
            })
          },
          fail: (err) => {
            wx.showModal({
              title: '提示',
              content: '保存图片失败'
            })
          }
        })
      },
      createCanvas() {
        console.log(this.qrcode)
        this.getImageInfo(this.qrcode).then(res => {
          console.log(res);
          this.qrcodeTmp = res.path;
        }).then(() => {
          return this.getImageInfo(this.userInfo.avatarUrl).then(res => {
            console.log('头像')
            console.log(res)
            this.userAvatar = res.path;
          })
        }).then(() => {
          this.setCanvas();

        })
        // 画图

        // this.show = true;

      },
      getImageInfo(src) {
        return new Promise((resolve, reject) => {
          wx.getImageInfo({
            src,
            success(res) {
              resolve(res);
            },
            fail(err) {
              reject(err);
            }
          })
        })

      }
    },



    components: {},

    mixins: [ifLoginMixin]
  };

</script>

<style lang='scss'>
  .tuiguang {
    position: relative;
    width: 100%;
    height: 100%;
    .bg {
      width: 100%;
      left: 0;
      top: 0;
      position: absolute;
      z-index: 2;
    }
    .content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .box {
        width: 262.5px;
        height: 262.5px;
        margin: 50px auto 0 auto;
        position: relative;
        .box-bg {
          width: 100%;
          position: relative;
        }
        .box-text {
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          position: absolute;
          box-sizing: border-box;
          font-size: 14px;
          color: #fff;
          line-height: 2;
          padding: 20px;
        }
      }
      .qrcode {
        text-align: center;
        font-size: 14px;
        .img {
          width: 120px;
          height: 120px;
        }
      }
      .userinfo {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        margin-bottom: 50px;
        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
        }

      }
    }

    .preivew-img {
      width: 225px;
      height: 400px;
      background: #fff;
      position: relative;
      .img {
        width: 100%;
        height: 100%;
      }

    }
    .close {
      margin-left: 50%;
      transform: translateX(-15px);
      .icon {
        width: 30px;
      }
    }
    .canvas {
      opacity: 0;
      position: absolute;
      top: -99999px;
      width: 100vw;
      height: 100vh;
      z-index: -999;
    }

  }

</style>
