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
      <button class="btn" type="warn" @click='buy'>购买</button>
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
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      pageInfo: {},
      goodsDetail: ""
    };
  },

  onShow() {
    var _this = this;
    var scene = this.$root.$mp.appOptions.scene;
    var fid = this.$root.$mp.query.fid;
    // 判断是否是通过别人分享进入小程序
    if (scene == 1007 || scene == 1008) {
      this.SAVE_FID_SYNC(fid);
    } else {
      this.CLEAR_FID_SYNC(0);
    }
    this.$ajax("https://jkfx.tianjinliwu.com.cn/Api/Qian/index").then(res => {
      console.log(res);
      _this.pageInfo = res.data[0];
      wx.setNavigationBarTitle({
        title: res.data[0].title1
      });
    });
    this.$ajax(
      "https://jkfx.tianjinliwu.com.cn/index.php?g=Api&m=pro&a=get_product"
    ).then(res => {
      console.log(res);
      this.goodsDetail = res.data.data[0];
    });
  },
  computed: {},
  methods: {
    ...mapMutations(["SAVE_FID_SYNC", "CLEAR_FID_SYNC"]),
    buy() {
      var url = "../detail/main?id=3";
      wx.navigateTo({ url });
    }
  },
  onShareAppMessage(res) {
    const _this = this;
    // if (res.from === "button") {
    //   console.log("转发");
    //   console.log(this.userDetail);
      // 来自页面内转发按钮
      var url;
      if (this.userDetail.status == 1) {
        url = "/pages/fenxiao/main?fid=" + this.sessionId;
        console.log(url);
      } else if (this.userDetail.status == 0) {
        url = "/pages/fenxiao/main?fid=" + this.userDetail.fid;
        console.log(url);
      }
      return {
        path: url,
        title: _this.goodsDetail.product_name
      };
    // }
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
}
// .btn-hover{
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
