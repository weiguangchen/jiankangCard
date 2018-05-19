<template>
  <div class="app-bg">
    <div class="pay">
      <img src="/static/images/me/person-info-bg.png" alt="" class="info-bg" mode='widthFix'>
      <div class="money">
        <h2 class="title">订单金额</h2>
        <div class="count">￥{{price}}</div>
      </div>
    </div>
    <div class="pay-type">
      <div class="pay-type-list">
        <h2 class="title">选择支付方式</h2>
        <radio-group @change='payChange'>
          <label class="pay-type-item">
            <span class="text"><img src="/static/images/pay/wx.png" alt="" mode='widthFix' class="img">微信支付</span>
            <radio value='0' />
          </label>
          <label class="pay-type-item">
            <span class="text"><img src="/static/images/pay/ye.png" alt="" mode='widthFix' class="img">余额支付</span>
            <radio value='1' />
          </label>
          <label class="pay-type-item">
            <span class="text"><img src="/static/images/pay/hh.png" alt="" mode='widthFix' class="img">混合支付</span>
            <radio value='2' />
          </label>
        </radio-group>
      </div>
      <button :disabled='!radioSelected' class="pay-btn" @click="pay">确认支付
        <span>￥{{price}}</span>
      </button>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
var md5 = require("js-md5");
export default {
  data() {
    return {
      payType: "",
      price: ""
    };
  },

  components: {},
  computed: {
    ...mapState(["userInfo", "sessionId"]),
    radioSelected: function() {
      if (this.payType == "") {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    payChange: function(e) {
      console.log(e);
      this.payType = e.target.value;
    },
    pay: function() {
      var _this = this;
      var userId = this.sessionId;
      var price = this.price;
      console.log("id" + userId);
      console.log("price" + price);
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/api/WxPay/pay",
        data: {
          id: userId,
          total_fee: price
        },
        success: function(res) {
          console.log(res);
          var appId = "wx8be30843f16d7320";
          var timeStamp = new Date().getTime().toString();
          var mypackage = res.data;
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
              console.log(res);
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

  onLoad() {
    this.payType = "";
    this.price = this.$root.$mp.query.price;
  },
  created() {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo();
  }
};
</script>

<style lang='scss'>
page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.app-bg {
  flex: 1;
}
.info-bg {
  position: absolute;
  width: 100%;
}

.pay {
  height: 181px;
  display: flex;
  justify-content: center;
  align-items: center;
  .money {
    z-index: 100;
    color: #ffffff;
    .title,
    .count {
      line-height: 1;
    }
    .title {
      font-size: 22px;
      margin-bottom: 23px;
    }
    .count {
      font-size: 23px;
    }
  }
}

.pay-type {
  box-sizing: border-box;
  width: 349px;
  position: relative;
  margin: -37px auto 0;
  z-index: 200;
  .pay-type-list {
    padding-left: 12px;
    background: #ffffff;
    border-radius: 4px;

    .title {
      height: 72px;
      display: flex;
      align-items: center;
    }
    .pay-type-item {
      height: 57px;
      border-top: 1px solid #cccccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 18px;
      .text {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #3a3a3a;
      }
      .img {
        width: 26px;
        flex: none;
        margin-right: 8px;
      }
    }
  }
  .pay-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    columns: #ffffff;
    margin-top: 26px;
    height: 55px;
    // background: #f4c291;
    background: #fd9939;
    color: #ffffff;
  }
}
</style>
