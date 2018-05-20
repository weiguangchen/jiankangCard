<template>
  <div class="app-bg">
    <div class="person-info">
      <img src="/static/images/me/person-info-bg.png" alt="" background-size='cover' class="info-bg" mode='widthFix'>
      <div class="person-content" v-if="ifLogin">
        <div class="person-box">
          <img :src="userInfo.avatarUrl" alt="" class="avatar">
          <div class="username">{{userInfo.nickName}}</div>
          <div class="level">普通会员</div>
        </div>
        <div class="info">
          <div class="balance">我的余额</div>
          <div class="count">￥{{userDetail.money}}</div>
          <div class="handle">
            <button size='mini'>充值</button>
            <button size='mini'>提现</button>
          </div>
        </div>
      </div>
      <div class="person-content-noLogin" v-else>
        <img src="/static/images/me/avatar.png" alt="" class="defalut-avatar">
        <button open-type='getUserInfo' @getuserinfo='getUserInfo' v-if="!ifLogin" class="wxLogin">微信登录</button>

      </div>
    </div>

    <!-- <button @click="getSetting">获取权限列表</button>
    <button @click="login">登录</button> -->

    <div class="dingdan">
      <h2 class="title">我的订单</h2>
      <div class="menu">
        <div class="menu-item"><img src="/static/images/me/wfk.png" alt="" mode='widthFix'>
          <span>未付款</span>
        </div>
        <div class="menu-item"><img src="/static/images/me/wsy.png" alt="" mode='widthFix'>
          <span>未使用</span>
        </div>
        <div class="menu-item"><img src="/static/images/me/ywc.png" alt="" mode='widthFix'>
          <span>已完成</span>
        </div>
        <div class="menu-item"><img src="/static/images/me/tkd.png" alt="" mode='widthFix'>
          <span>退款单</span>
        </div>
        <div class="menu-item"><img src="/static/images/me/qb.png" alt="" mode='widthFix'>
          <span>全部</span>
        </div>
      </div>
    </div>
    <div class="menu-list">
      <div class="cell">
        <span>我的名片</span>
        <img src="/static/images/arrow.png" alt="" mode='widthFix' class="img">
      </div>
      <div class="cell">
        <span>我的团队</span>
        <img src="/static/images/arrow.png" alt="" mode='widthFix' class="img">
      </div>
      <div class="cell">
        <span>我的佣金</span>
        <img src="/static/images/arrow.png" alt="" mode='widthFix' class="img">
      </div>
      <div class="cell last-cell">
        <span>分销订单</span>
        <img src="/static/images/arrow.png" alt="" mode='widthFix' class="img">
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
// mixin   包含大量复用的方法和变量
import ifLoginMixin from "@/mixin/ifLoginMixin";
// import mymixin from "@/mixin/mymixin";
export default {
  data() {
    return {};
  },

  components: {},
  computed: {
    ...mapState(["userDetail", "fid", "pre_goodsId"]),
    ...mapGetters(["ifLogin"])
  },
  methods: {
    ...mapActions(["SAVE_SESSIONID", "SAVE_USERINFO"]),
    ...mapMutations(["CLEAR_FID_SYNC"]),
    getUserInfo(res) {
      var _this = this;
      wx.getSetting({
        success: res => {
          console.log("授权列表");
          console.log(res);
        }
      });
      console.log("获取权限");
      console.log(res);
      if (res.mp.detail.errMsg == "getUserInfo:ok") {
        wx.showLoading();
        // console.log("授权了");
        // 获取用户信息授权
        console.log(res);
        // 存储用户信息到微信缓存
        this.SAVE_USERINFO_SYNC(res.mp.detail.userInfo);
        var encryptedData = res.mp.detail.encryptedData;
        // 替换加号防止ajax传输+变为空格
        encryptedData = encryptedData.replace(/\+/g, "%2B");
        var iv = res.mp.detail.iv;
        iv = iv.replace(/\+/g, "%2B");
        if (!this.ifLogin) {
          wx.login({
            success: res => {
              console.log(res);
              if (res.code) {
                // 用户登录
                wx.request({
                  url:
                    "https://jkfx.tianjinliwu.com.cn/index.php?g=Api&m=GetUser&a=get_sk",
                  data: {
                    code: res.code,
                    encryptedData,
                    iv,
                    fid: _this.fid
                  },
                  success: res => {
                    console.log(res);
                    // 登陆成功
                    if (res.statusCode == 200) {
                      _this.SAVE_SESSIONID(res.data.a);
                    }

                    _this.getUserDetail();
                    wx.hideLoading();

                    //  如果是从商品页跳转过来，登录成功后返回商品页
                    var goodsId = _this.pre_goodsId;
                    if (goodsId) {
                      var url = "../detail/main?id=" + goodsId;
                      wx.navigateTo({ url });
                    }
                  }
                });
              }
            }
          });
        }
      } else if (res.mp.detail.errMsg == "getUserInfo:fail auth deny") {
        // console.log("拒绝了");
      }
    }
  },
  onHide() {
    this.CLEAR_FID_SYNC();
  },
  // onLoad() {
  //   // wx.getUserInfo({
  //   //   success: res => {
  //   //     // console.log(res);
  //   //     this.userInfo = res.userInfo;
  //   //   }
  //   // });
  //   // 获取sessionid
  //   // var sessionid = wx.getStorageSync("sessionid");
  // },
  mixins: [ifLoginMixin]
};
</script>

<style lang='scss'>
.person-info {
  color: #ffffff;
  height: 181px;
  display: flex;
  margin-bottom: $bot;
  .info-bg {
    position: absolute;
    width: 100%;
  }
  .person-content,
  .person-content-noLogin {
    z-index: 100;
    display: flex;
    flex: auto;
  }
  .person-content {
    .person-box,
    .info {
      // width: 50%;
      // flex: none;
    }
    .person-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 83px;
        height: 83px;
        border-radius: 50%;
        margin-bottom: 9px;
      }
      .username {
        font-size: 18px;
        margin-bottom: 9px;
      }
      .level {
        font-size: 12px;
      }
    }
    .info {
      line-height: 1;
      width: 165px;
      flex: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .balance {
        font-size: 18px;
        margin-bottom: 14px;
        margin-left: 6px;
      }
      .count {
        font-size: 30px;
        margin-bottom: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .handle {
        display: flex;
        padding-left: 6px;
        button {
          color: #ffffff;
          width: 48px;
          height: 23px;
          font-size: 12px;
          border: 1px solid #ffffff;
          background: transparent;
          margin: 0 16px 0 0;
          padding: 0;
          flex: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .person-content-noLogin {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .defalut-avatar {
      width: 84px;
      height: 84px;
      margin-bottom: 15px;
    }
    .wxLogin {
      width: 219px;
      height: 35px;
      line-height: 35px;
    }
  }
}

.dingdan {
  background: #ffffff;
  height: 135px;
  margin-bottom: $bot;
  .title {
    padding: 12px 15px 0;
    line-height: 1;
    margin-bottom: 29px;
    @extend %fontsize;
  }
  .menu {
    display: flex;
    .menu-item {
      font-size: 15px;
      color: #3a3a3a;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 26px;
        flex: none;
        margin-bottom: 18px;
      }
      span {
        line-height: 1;
      }
    }
  }
}

.menu-list {
  .cell {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 49px;
    padding: 0 15px;
    border-bottom: 1px solid #cccccc;
    span {
      @extend %fontsize;
    }
    .img {
      width: 11px;
      flex: none;
    }
  }
  .last-cell {
    border-bottom: none;
  }
}
</style>
