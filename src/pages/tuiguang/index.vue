<template>
  <div class="tuiguang">
    <img src="/static/images/tuiguang/bg.png" alt="" class="bg" mode='widthFix'>
    <div class="content">
      <div class="box">
        <img src="/static/images/tuiguang/box.png" alt="" mode='widthFix' class="box-bg">
        <div class="box-text">
          金额为佛IE文件覅额外金佛IE文件佛IE文件佛IE文件佛IE文件佛IE文件佛IE文件佛IE文件佛IE文件佛覅额外附加而我方将额外if就而王菲王菲今儿我if而无法金额威锋网 解放军噢IE文件佛IE文件佛IE无附件为 金
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
        qrcode:''
      };
    },
    onLoad() {

      this.get_qrcode();

    },
    onShow() {

    },
    computed: {

    },
    methods: {

      get_qrcode() {
        this.$ajax(this.$API + '/Api/Ewm/get_ewm', {
          param: {
            path: 'pages/index/main',
          }
        }).then(({data})=>{
          console.log(data)
        })
      }

    },



    components: {},

    mixins: [ifLoginMixin]
  };

</script>

<style lang='scss'>
  .tuiguang {
    width: 100%;
    height: 100%;
    .bg {
      width: 100%;
      left: 0;
      top: 0;
      position: absolute;
      z-index: -1;
    }
    .content {
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
        margin-bottom: 50px;
        .img{
          width: 150px;
          height: 150px;
        }
      }
      .userinfo {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
        }

      }
    }

  }

</style>
