<template>
  <div class="app-bg">
    <div class="banner">
      <img src="/static/images/fx/fx-banner.png" alt="" class="img" mode='widthFix'>
    </div>
    <template v-if="!ifFenxiaoshang">
      <div class="tip">
        <h2 class="title">温馨提示 : </h2>
        <p class="content">亲爱的会员，你还不是分销商，在本店该买产品，消费满980元，即可成为本店的分销商，成为分销商有更多的收益模式，详情查看本页下面的分销说明。</p>
      </div>
      <button class="btn" type="warn" @click='buy'>购买</button>
    </template>
    <div class="introduce" v-else>
      <div class="userinfo">
        <img :src="userInfo.avatarUrl" alt="" mode='widthFix' class="avatar">
        <span class="username">{{userInfo.nickName}}</span>
      </div>
      <p class="content">健康卡拥有6大服务板块，分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。</p>
      <div class="qrcode">
        <img src="/static/images/fx/qrcode.png" alt="" mode='widthFix' class="img">
        <p class="qrcode-tip">长按识别二维码，马上可以体验健康卡发的服务</p>
        <button class="btn" type="warn" open-type='share'>马上分享</button>
      </div>

    </div>
    <div class="intr">
      <h2 class="title">新零售模式分销说明 :</h2>
      <div class="media">
        <p class="content">亲爱的会员，你还不是分销商，在本店购买产品，消费满980元，即可成为本店的分销商，成为分销商有更多的收益模式，详情查看本页下面的分销说明。</p>
        <img src="/static/images/fx/fx-intr.png" alt="" class="img" mode='widthFix'>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {};
  },

  onShow() {
    var scene = this.$root.$mp.appOptions.scene;
    var fid = this.$root.$mp.query.fid;
    // 判断是否是通过别人分享进入小程序    
    if(scene == 1007 || scene == 1008){ 
      this.SAVE_FID_SYNC(fid);
    }else{
      this.CLEAR_FID_SYNC(0);
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['SAVE_FID_SYNC',"CLEAR_FID_SYNC"]),
    buy() {
      var url = "../detail/main?id=3";
      wx.navigateTo({ url });
    }
  },
  onShareAppMessage() {
    const _this = this;
    return {};
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
}
</style>
