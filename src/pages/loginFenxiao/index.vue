<template>
  <div class="app-bg">
    <div class="banner">
      <img src="/static/images/fx/fx-banner.png" alt="" class="img" mode='widthFix'>
    </div>
    <div class="introduce">
      <div class="userinfo">
        <img src="/static/images/avatar.png" alt="" mode='widthFix' class="avatar">
        <span class="username">春天的小树苗</span>
      </div>
      <p class="content">健康卡拥有6大服务板块，分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。分别针对人体的各个组织进行调整。</p>
      <div class="qrcode">
        <img src="/static/images/fx/qrcode.png" alt="" mode='widthFix' class="img">
        <p class="tip">长按识别二维码，马上可以体验健康卡发的服务</p>
        <button class="btn" type="warn">马上分享</button>
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
export default {
  data() {
    return {
      motto: "Hello World",
      userInfo: {}
    };
  },

  components: {},

  methods: {
    bindViewTap() {
      const url = "../logs/main";
      wx.navigateTo({ url });
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  }
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
    .tip {
      font-size: 14px;
      line-height: 1;
      margin-bottom: 12px;
    }
    .btn{
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
