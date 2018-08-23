<template>
  <div class="app-bg">
    <!-- 轮播 -->
    <!-- <swiper class="banner" indicator-dots='true' autoplay='true' indicator-color='#a5a5a7' indicator-active-color='#ffffff'>
      <swiper-item>
        <image src="/static/images/index/jhk-1525856981592@2x.png" class="slide-image" mode='widthFix' />
      </swiper-item>
      <swiper-item>
        <image src="/static/images/index/jhk-1525856981592@2x.png" class="slide-image" mode='widthFix' />
      </swiper-item>
      <swiper-item>
        <image src="/static/images/index/jhk-1525856981592@2x.png" class="slide-image" mode='widthFix' />
      </swiper-item>
      <swiper-item>
        <image src="/static/images/index/jhk-1525856981592@2x.png" class="slide-image" mode='widthFix' />
      </swiper-item>
    </swiper> -->
    <image :src="goodsDetail.hot_img" mode='widthFix' class="banner" />
    <!-- 介绍 -->
    <div class="intr">
      <div class="title-wrap">
        <img src="/static/images/detail/logo.png" alt="" mode='widthFix' class="logo">
        <div class="title">
          <span class="name">{{goodsDetail.product_name}}</span>
          <span class="rhfx">如何分销</span>
        </div>
      </div>
      <div class="introduce">
        <!-- <div class="form">
          <div class="form-item">
            <span>属性1</span>
            <span>介绍1</span>
          </div>
          <div class="form-item">
            <span>属性2</span>
            <span>介绍2</span>
          </div>
          <div class="form-item">
            <span>属性3</span>
            <span>介绍3</span>
          </div>
          <div class="form-item">
            <span>属性4</span>
            <span>介绍4</span>
          </div>

        </div> -->
        <div class="content">
          <img :src="item.url" alt="" v-for="(item,index) in goodsDetail.smeta" :key="index" mode='widthFix' class="img">
        </div>
      </div>

    </div>
    <!-- 购买 -->
    <div class="buy-wrap">
      <button class="fx-btn" open-type='share' v-if="ifFenxiaoshang">分销</button>
      <div class="fx-btn" @click="notfx" v-else>分销</div>
      <div class="buy-btn" @click="buy">立刻购买
        <span class="price">￥{{goodsDetail.product_price}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  // var QQMapWX =require('/static/js/qqmap-wx-jssdk.min.js');
  import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions
  } from "vuex";

  export default {
    data() {
      return {
        goodsDetail: {},
        goodsId: ""
      };
    },
    onLoad() {

      var scene = this.$root.$mp.appOptions.scene;
      var fid = this.$root.$mp.query.fid;
      var userId = this.$root.$mp.query.userId;
      if (scene == 1007 || scene == 1008) {
        if (!fid) {
          //   分享者为分销商
          this.SAVE_FID_SYNC('');
          this.SAVE_UID_SYNC(userId);
        } else {
          //   分享者为会员
          this.SAVE_FID_SYNC(fid);
          this.SAVE_UID_SYNC(userId);
        }
      } else {
        //   清空
        this.SAVE_FID_SYNC('');
        this.SAVE_UID_SYNC('')
      }

      // 腾讯地图
      // console.log(QQMapWX)
      // this.qqmapsdk = new QQMapWX({
      //   key: '62KBZ-2WXKQ-5GI53-GDT33-LKMPV-34FWO'
      // });
      // console.log('腾讯地图')
      // console.log(this.qqmapsdk)
      this.get_goods();

    },
    onShow() {
      if (!this.sessionId) {
        wx.hideShareMenu();
      } else {
        wx.showShareMenu();
      }
      // 清空pre_goodsId
      this.SET_PREGOODSID_SYNC('');

    },
    methods: {
      ...mapMutations(["SET_PREGOODSID_SYNC","SAVE_FID_SYNC","SAVE_UID_SYNC"]),
      // sessionIdIfTimeOut(fn) {
      //   wx.showLoading();
      //   var _this = this;
      //   wx.request({
      //     url: this.$API + "/Api/GetUser/get_user_id",
      //     data: {
      //       id: _this.sessionId
      //     },
      //     success: res => {
      //       console.log(res);
      //       _this.sessionIsOk = res.data.status;
      //       wx.hideLoading();
      //       fn();
      //     }
      //   });
      // },
      notfx() {
        var url = "../fenxiao/main";
        wx.switchTab({
          url
        });
      },
      buy() {
        var url = "../me/main";
        // this.get_city().then(() => {
          // id可用
          var url = "../order/main" + "?id=" + this.goodsDetail.id;
          wx.navigateTo({
            url
          });
        // })


      },
      get_city() {

        return new Promise((resolve, reject) => {
          console.log(this.qqmapsdk)
          this.qqmapsdk.reverseGeocoder({
            success(res) {
              console.log(res);
              if (res.result.ad_info.city != '天津市') {
                wx.showModal({
                  title: '提示',
                  content: '该商品只限天津市使用'
                })
              } else {
                resolve();
              }
            },
            fail(err) {
              reject();
            }
          })

        })

      },
      get_goods() {
        // 获取产品id
        const goodId = this.$root.$mp.query.id;
        this.$ajax(this.$API + "/Api/Pro/get_product", {
          id: goodId
        }).then(({
          data
        }) => {
          this.goodsDetail = data.data[0];
        })
      }
    },
    onShareAppMessage(res) {
      const _this = this;
      var url;
      if (this.userDetail.status == 1) {
        url = "/pages/fenxiao/main?userId=" + this.sessionId;
      } else if (this.userDetail.status == 0) {
        url = "/pages/fenxiao/main?fid=" + this.userDetail.fid + "&userId=" + this.sessionId;
      }
      console.log(url);
      return {
        path: url,
        title: _this.goodsDetail.product_name
      };
    },

    computed: {
      ...mapState(["sessionId", "userInfo", "userDetail"]),
      ...mapGetters(["ifFenxiaoshang"])
    }
  };

</script>

<style lang='scss'>
  .app-bg {
    padding-bottom: 55px;
  }

  .banner {
    width: 100%; // height: 195px;
    // .slide-image {
    //   width: 100%;
    // }
  }

  .intr {
    padding-left: 14px;
    background: #ffffff;
    .title-wrap {
      padding-top: 6px;
      .logo {
        width: 55px;
        margin-bottom: 8px;
      }
      .title {
        display: flex;
        justify-content: space-between;
        padding-bottom: 12px;
        padding-right: 16px;
        border-bottom: 1px solid #cccccc;
        margin-bottom: 14px;
        .name {
          font-size: 22px;
          color: #3c3c3c;
          line-height: 1;
        }
        .rhfx {
          flex: none;
          font-size: 14px;
          color: #8c8c8c;
        }
      }
    }
    .introduce {
      padding-right: 15px;
      font-size: 14px;
      color: #000000;
      line-height: 26px;
      .form {
        .form-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .content {
        .img {
          width: 100%;
          margin: 10px 0;
        }
      }
      .img {
        width: 100%;
      }
    }
  }

  .buy-wrap {
    position: fixed;
    width: 100%;
    height: 55px;
    bottom: 0;
    left: 0;
    font-size: 16px;
    color: #ffffff;
    display: flex;
    .fx-btn,
    .buy-btn {
      border-radius: 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fx-btn {
      background: #fd9939;
      width: 130px;
    }
    .buy-btn {
      flex: 1;
      background: #cb2620;
      .price {
        margin-left: 18px;
        font-size: 26px;
      }
    }
  }

</style>
