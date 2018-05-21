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
    <image :src="goodsDetail.product_img" mode='aspectFit' class="banner" />
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
        <div class="form">
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

        </div>
        <div class="content" v-html="goodsDetail.product_content">
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
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      goodsDetail: {},
      goodsId: ""
    };
  },

  components: {},

  methods: {
    ...mapMutations(["SAVE_PREGOODSID_SYNC", "CLEAR_PREGOODSID_SYNC"]),
    sessionIdIfTimeOut(fn) {
      wx.showLoading();
      var _this = this;
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/Api/GetUser/get_user_id",
        data: {
          id: _this.sessionId
        },
        success: res => {
          console.log(res);
          _this.sessionIsOk = res.data.status;
          wx.hideLoading();
          fn();
        }
      });
    },
    notfx() {
      var url = "../fenxiao/main";
      wx.switchTab({ url });
    },
    buy() {
      var _this = this;
      var url = "../me/main";
      if (this.sessionId) {
        // 缓存中有id
        // 判断id是否可用
        this.sessionIdIfTimeOut(function() {
          if (_this.sessionIsOk == 1) {
            // id可用
            var url = "../order/main" + "?id=" + _this.goodsId;
            wx.navigateTo({ url });
          } else if (_this.sessionIsOk == 0) {
            // id不存在
            // 跳转登录
            wx.showModal({
              title: "授权失效",
              content: "请重新授权登录",
              success: res => {
                if (res.confirm) {
                  wx.switchTab({ url });
                  _this.SAVE_PREGOODSID_SYNC(_this.goodsId);
                }
              }
            });
          }
        });
      } else {
        // 缓存中无id
        // 跳转登录
        wx.showModal({
          title: "提示",
          content: "请授权登录",
          success: res => {
            if (res.confirm) {
              wx.switchTab({ url });
              _this.SAVE_PREGOODSID_SYNC(_this.goodsId);
            }
          }
        });
      }
    }
  },
  onShareAppMessage(res) {
    const _this = this;
    if (res.from === "button") {
      console.log('转发')
      console.log(this.userDetail)
      // 来自页面内转发按钮
      var url;
      if (this.userDetail.status == 1) {
        url = "/pages/fenxiao/main?fid=" + this.sessionId;
      } else if (this.userDetail.status == 0) {
        url = "/pages/fenxiao/main?fid=";
      }
      return {
        path: url,
        title: _this.goodsDetail.product_name
      };
    }
  },
  onLoad() {
    // 获取产品id
    this.goodsId = this.$root.$mp.query.id;

    wx.request({
      url:
        "https://jkfx.tianjinliwu.com.cn/index.php?g=Api&m=pro&a=get_product",
      success: res => {
        console.log(res);
        this.goodsDetail = res.data.data[0];
      }
    });
  },
  onShow() {
    // 清空pre_goodsId
    this.CLEAR_PREGOODSID_SYNC();
    // 判断不是分销商不显示转发按钮
    if (!this.ifFenxiaoshang) {
      wx.hideShareMenu();
    }
  },
  computed: {
    ...mapState(["sessionId", "userInfo","userDetail"]),
    ...mapGetters(["ifFenxiaoshang"])
  }
};
</script>

<style lang='scss'>
.app-bg {
  padding-bottom: 55px;
}
.banner {
  width: 100%;
  // height: 195px;
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
      image {
        width: 100%;
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
