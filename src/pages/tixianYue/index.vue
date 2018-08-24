<template>
  <div class="app-bg">
    <div class="account">
      <span class="left">提现到余额</span>
    </div>
    <div class="money">
      <h2 class="title">提现金额</h2>
      <div class="m-input">
        ￥<input type="digit" placeholder="请输入提现金额" placeholder-class='placeholder-class' class='input' v-model="money" @input='replaceInput'>
      </div>
      <div class="can-use">可用金额：{{yj}}元</div>
    </div>

    <button type="warn" :disabled='!money' @click="tixian" class="btn">提现</button>
    <div class="more" @click="more">查看提现到余额记录</div>
    <!-- <myModal v-if="!ifBangding"></myModal>
    <qrModal v-if='queren' @queren='querenFn'></qrModal> -->
  </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";
import myModal from "@/components/modal/modal";
import qrModal from "@/components/modal/modal2";
var md5 = require("js-md5");

export default {
  data() {
    return {
      money: "",
      queren: false,
      yj:''
    };
  },
  components: {
    myModal,
    qrModal
  },
  methods: {
    more() {
      var url = "../tixianDetail/main?id=" + this.sessionId;
      wx.navigateTo({ url });
    },
    replaceInput(e) {
      console.log(e.mp.detail);
      var val = e.mp.detail.value;
      if (val != "") {
        if (val < 1) {
          this.money = 1;
        }
      }
    },
    tixian() {
      var _this = this;
      if (parseFloat(this.money) <= parseFloat(this.yj)) {
        // 余额大于提现金额，可以提现
        this.$ajax(this.$API+"/Api/YjShow/yj_yue", {
          uid: _this.sessionId,
          yj: _this.money
        }).then(res => {
          console.log(res);
          wx.showModal({
            title: "提示",
            content: "提现成功",
            showCancel: false,
            success: res => {
              if (res.confirm) {
                var url = "../me/main";
                wx.switchTab({ url });
              }
            }
          });
        });
      } else {
        // 余额小于提现金额，不可以提现
        wx.showModal({
          title: "提示",
          content: "可用金额不足！"
        });
      }
    }
  },
  onUnload() {
    this.money = "";
  },
  onShow() {
    var _this = this;
    // 获取统计信息
    this.$ajax(this.$API+"/Api/YjShow/yj", {
      uid: _this.sessionId
    }).then(res => {
      console.log(res);
      _this.yj = res.data.yue;
    });
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg {
  padding: 10px 0;
}
.money {
  background: #ffffff;
  padding: 20px 30px;
  margin: 0 15px 10px;
  .title {
    font-size: 14px;
    color: #0c0c0c;
    line-height: 1;
  }
  .m-input {
    border-bottom: 1px solid #cccccc;
    height: 95px;
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    .input {
      margin-left: 14px;
      font-weight: normal;
      font-size: 36px;
      height: 36px;
    }
  }
  .can-use {
    height: 53px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .placeholder-class {
    font-size: 14px;
    text-align: center;
  }
}
.account {
  background: #ffffff;
  margin-bottom: 30px;
  height: 50px;
  padding: 0 15px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    color: #0c0c0c;
  }
  .right {
    display: flex;
    align-items: center;
    color: #d6d6d6;
    .img {
      border-radius: 50%;
      width: 35px;
      margin-right: 8px;
      border: 1px solid #c2c2c2;
    }
  }
}
.btn {
  margin: 0 15px;
}
.more {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #cb2620;
}
</style>
