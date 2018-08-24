<template>
  <div class="app-bg">
    <div class="banner">
      <img :src="pageInfo.two_img" alt="" class="img" mode='widthFix'>
    </div>
    <template v-if="!ifFenxiaoshang">
      <div class="tip">
        <h2 class="title">温馨提示 : </h2>
        <p class="content">{{pageInfo.product_content}}</p>
      </div>
      <!-- <button class="btn" type="warn" @click='buy'>分享</button> -->
      <button class="btn" type="warn" open-type='share'>分享</button>
    </template>
    <div class="introduce" v-else>
      <div class="userinfo">
        <img :src="userInfo.avatarUrl" alt="" mode='widthFix' class="avatar">
        <span class="username">{{userInfo.nickName}}</span>
      </div>
      <!-- <p class="content">健康卡拥有6大服务板块，分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。</p> -->
      <!-- <div class="qrcode">
        <img src="/static/images/fx/qrcode.png" alt="" mode='widthFix' class="img">
        <p class="qrcode-tip">长按识别二维码，马上可以体验健康卡发的服务</p>
      </div> -->
      <img :src="pageInfo.fx_img" alt="" class="img" mode='widthFix'>
      <button class="btn" type="warn" open-type='share'>马上分享</button>

    </div>
    <div class="intr">
      <img :src="item.url" alt="" v-for="(item,index) in pageInfo.smeta" :key="index" class="img" mode='widthFix'>
      <!-- <h2 class="title">新零售模式分销说明 :</h2>
      <div class="media">
        <p class="content">亲爱的会员，你还不是分销商，在本店购买产品，消费满980元，即可成为本店的分销商，成为分销商有更多的收益模式，详情查看本页下面的分销说明。</p>
        <img src="/static/images/fx/fx-intr.png" alt="" class="img" mode='widthFix'>
      </div>
      <div class="content">
        <img src="/static/images/fx/info.png" alt="" mode='widthFix' class="img">
      </div> -->
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
  //   import QQMapWX from '../../../static/js/qqmap-wx-jssdk.min.js'
  export default {
    data() {
      return {
        pageInfo: {},
      };
    },
    onLoad() {
      // 腾讯地图
      //   this.qqmapsdk = new QQMapWX({
      //     key: '62KBZ-2WXKQ-5GI53-GDT33-LKMPV-34FWO'
      //   });
      this.shareMenu();

      var scene = this.$root.$mp.appOptions.scene;
      var fid = this.$root.$mp.query.fid;
      var userId = this.$root.$mp.query.userId;
      var status = this.$root.$mp.query.status;
      var obj = {
        fid,
        userId,
        status
      }
      if (scene == 1007 || scene == 1008) {
        this.SAVE_SHAREINFO(obj);
      } else {
        //   清空
        this.SAVE_SHAREINFO('');
      }


    },
    onShow() {
      this.shareMenu();
      this.get_pageInfo();
    },
    computed: {},
    methods: {
      ...mapMutations(["SAVE_FID_SYNC", "SAVE_UID_SYNC", "SAVE_USTATUS_SYNC", "SAVE_SHAREINFO"]),
      shareMenu() {
        if (!this.sessionId) {
          wx.hideShareMenu();
        } else {
          wx.showShareMenu();
        }
      },
      buy() {
        var url = "../index/main";

        wx.navigateTo({
          url
        });
      },
      //   get_city() {
      //     return new Promise((resolve, reject) => {
      //       this.qqmapsdk.reverseGeocoder({
      //         success(res) {
      //           console.log(res);
      //           if (res.result.ad_info.city != '天津市') {
      //             wx.showModal({
      //               title: '提示',
      //               content: '该商品只限天津市使用'
      //             })
      //           } else {
      //             resolve();
      //           }
      //         },
      //         fail(err) {
      //           reject();
      //         }
      //       })

      //     })

      //   },
      get_pageInfo() {
        this.$ajax(this.$API + "/Api/Qian/index").then(res => {
          console.log(res);
          this.pageInfo = res.data[0];

        });
      },
    },

    onShareAppMessage(res) {
      const _this = this;
      //   this.get_city().then(() => {
      var url = "/pages/fenxiao/main?fid=" + this.userDetail.fid + "&userId=" + this.sessionId + "&status=" + this.userDetail
        .status;
      console.log(url);
      return {
        path: url,
        //   title: _this.goodsDetail.product_name
      };
      //   })

    },
    mixins: [ifLoginMixin]
  };

</script>

<style lang='scss'>
  $text-color: "#3A3A3A";
  .banner {
    margin-bottom: $bot;
    .img {
      width: 100%;
      vertical-align: middle;
    }
  }

  .tip {
    padding: 20px 15px;
    color: $text-color;
    background: #ffffff;
    margin-bottom: $bot;
    .title {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .content {
      font-size: 14px;
      line-height: 22px;
    }
  }

  .introduce {
    padding: 20px 15px;
    color: $text-color;
    background: #ffffff;
    margin-bottom: $bot;
    .img {
      width: 100%;
    }
    .userinfo {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .avatar {
        width: 45px;
        margin-right: 10px;
      }
      .username {
        font-size: 15px;
      }
    }
    .title {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .content {
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 12px;
    }
    .qrcode {
      display: flex;
      flex-direction: column;
      align-items: center;
      .img {
        width: 77px;
        margin-bottom: 14px;
      }
      .qrcode-tip {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 12px;
      }
      .btn {
        width: 242px;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
      }
    }
  }

  .btn {
    background-color: #cb2620;
    color: #ffffff;
    margin-bottom: $bot;
    font-size: 18px;
  } // .btn-hover{
  //   background: blue;
  // }
  .intr {
    padding: 20px 15px;
    background: #ffffff;
    .img {
      width: 100%;
      height: auto;
    }
    .title {
      font-size: 18px;
      margin-bottom: 38px;
    }
    .media {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .content {
        font-size: 14px;
        line-height: 22px;
        margin-right: 20px;
      }
      .img {
        width: 130px;
        flex: none;
      }
    }
    .content {
      .img {
        width: 100%;
        margin: 10px 0;
      }
    }
  }

</style>
