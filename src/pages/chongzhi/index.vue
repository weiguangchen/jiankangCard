<template>
    <div class="app-bg">
        <div class="money">
            <h2 class="title">充值金额</h2>
            <div class="m-input">
                ￥<input type="digit" placeholder="请输入充值金额" placeholder-class='placeholder-class' class='input' v-model="money" @input='replaceInput'>
            </div>
        </div>
        <div class="type">
            <span class="left">支付方式</span>
            <span class="right"><img src="/static/images/pay/wx.png" alt="" class="img" mode='widthFix'>微信支付</span>
        </div>
        <button type="warn" :disabled='!money' @click="chongzhi">充值</button>
        <div class="more" @click="more">查看充值记录</div>
    </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";
var md5 = require("js-md5");

export default {
  data() {
    return {
      money: ""
    };
  },

  methods: {
    more() {
      var url = "../chongzhiDetail/main?id=" + this.sessionId;
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
    chongzhi() {
      var _this = this;
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/api/WxPay/pay_chongzhi",
        data: {
          id: _this.sessionId,
          total_fee: 1
        },
        success: function(res) {
          console.log(res);
          // 数据中订单id
          var pay_order_id = res.data.pay_order_id;

          var appId = "wx8be30843f16d7320";
          var timeStamp = new Date().getTime().toString();
          var mypackage = res.data.package;
          var signType = "MD5";
          var nonceStr = _this.createNonceStr();

          var stringA =
            "appId=" +
            appId +
            "&nonceStr=" +
            nonceStr +
            "&package=" +
            mypackage +
            "&signType=" +
            signType +
            "&timeStamp=" +
            timeStamp;
          var stringSignTemp =
            stringA + "&key=606b755058932821cdbcbde7adbd0ee1"; //注：key为商户平台设置的密钥key
          var paySign = md5(stringSignTemp).toUpperCase(); //注：MD5签名方式

          wx.requestPayment({
            appId,
            timeStamp,
            package: mypackage,
            signType,
            paySign,
            nonceStr,
            success: function(res) {
              //   充值成功
              console.log(res);
              wx.request({
                url: "https://jkfx.tianjinliwu.com.cn/api/WxPay/chongzhi_ok",
                data: {
                  uid: _this.sessionId,
                  pay_order_id: pay_order_id
                },
                success: res => {
                  var url = "../me/main";
                  wx.switchTab({ url });
                }
              });
            }
          });
        }
      });
    },
    createNonceStr: function() {
      return Math.random()
        .toString(36)
        .substr(2, 15)
        .toString();
    }
  },
  onUnload() {
    this.money = "";
  },

  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg {
  padding: 10px 15px;
}
.money {
  background: #ffffff;
  padding: 20px 30px;
  margin-bottom: 10px;
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
  .placeholder-class {
    font-size: 14px;
    text-align: center;
  }
}
.type {
  background: #ffffff;
  margin-bottom: 30px;
  height: 60px;
  padding-left: 30px;
  padding-right: 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    font-size: 14px;
    color: #0c0c0c;
  }
  .right {
    display: flex;
    align-items: center;
    font-size: 16px;
    .img {
      width: 26px;
      margin-right: 8px;
    }
  }
}
.more {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #cb2620;
}
</style>
