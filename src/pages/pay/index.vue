<template>
  <div class="app-bg">
    <div class="pay">
      <img src="/static/images/me/person-info-bg.png" alt="" class="info-bg" mode='widthFix'>
      <div class="money">
        <h2 class="title">订单金额</h2>
        <div class="count">￥{{price * count}}</div>
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
            <span class="text"><img src="/static/images/pay/ye.png" alt="" mode='widthFix' class="img">余额支付
              (余额：{{userDetail.money}}元)</span>
            <radio value='1' />
          </label>
          <label class="pay-type-item">
            <span class="text"><img src="/static/images/pay/hh.png" alt="" mode='widthFix' class="img">混合支付</span>
            <radio value='2' />
          </label>
        </radio-group>
      </div>
      <button :disabled='enable' class="pay-btn" @click="pay">确认支付
        <span>￥{{price*count}}</span>
      </button>
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

  var md5 = require("js-md5");
  export default {
    data() {
      return {
        payType: "",
        buying: false,
        price: "" /* 商品价格 */ ,
        addressId: "" /* 收货地址id */ ,
        goodsId: '' /* 商品id */ ,
        count: '' /* 商品数量 */
      };
    },

    computed: {
      enable: function () {
        if (!this.payType || this.buying) {
          return true;
        } else {
          return false;
        }
      },
      format_yue(price) {
        var yue = this.userDetail;
      }
    },
    methods: {
      payChange: function (e) {
        console.log(e);
        this.payType = e.target.value;
      },
      pay: function () {
        var _this = this;
        var yue = this.userDetail.money - this.price;

        if (this.payType == 0) {
          this.buying = true;
          // 微信支付
          wx.request({
            url: this.$API + "/api/WxPay/pay",
            data: {
              id: _this.sessionId,
              zong: _this.price * _this.count,
              yue: 0,
              adress: _this.addressId,
              product_id: _this.goodsId,
              shop_num: _this.count
            },
            success: function (res) {
              _this.buying = false;
              console.log(res);
              console.log("package:" + res.data.package);
              // 数据中订单id
              var pay_order_id = res.data.pay_order_id;

              var appId = "wx5a2e090b5a4d6c5a";
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
                success: function (res) {
                  console.log(res);
                  // 支付成功修改数据库订单状态
                  wx.request({
                    url: _this.$API + "/api/WxPay/pay_ok",
                    data: {
                      pay_order_id: pay_order_id
                    },
                    success: res => {
                      var url = "../me/main";
                      wx.switchTab({
                        url
                      });
                    }
                  });
                }
              });
            }
          });
        } else if (this.payType == 1) {
          if (yue < 0) {
            // 余额不足
            wx.showModal({
              title: "提示",
              showCancel: false,
              content: "您的账户余额不足，请选择其他支付方式。"
            });
          } else {
            // 余额支付
            wx.showModal({
              title: "支付",
              content: "确认使用余额支付？",
              success: res => {
                if (res.confirm) {
                  wx.showLoading();
                  wx.request({
                    url: this.$API + "/api/WxPay/yue_pay",
                    data: {
                      id: _this.sessionId,
                      yue: _this.price * _this.count,
                      adress: _this.addressId,
                      product_id: _this.goodsId,
                      shop_num: _this.count
                    },
                    success: function (res) {
                      console.log(res);
                      var pay_order_id = res.data.pay_order_id;
                      wx.request({
                        url: _this.$API + "/api/WxPay/pay_ok",
                        data: {
                          pay_order_id: pay_order_id
                        },
                        success: res => {
                          wx.hideLoading();
                          wx.showModal({
                            title: "提示",
                            content: "支付成功！",
                            showCancel: false,
                            success: res => {
                              var url = "../me/main";
                              wx.switchTab({
                                url
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        } else if (this.payType == 2) {
          // 混合支付
          if (yue < 0) {
            this.buying = true;
            // 余额不足
            wx.request({
              url: this.$API + "/api/WxPay/pay",
              data: {
                id: _this.sessionId,
                zong: _this.price * _this.count,
                yue: _this.userDetail.money,
                adress: _this.addressId,
                product_id: _this.goodsId,
                shop_num: _this.count
              },
              success: function (res) {
                _this.buying = false;
                console.log(res);
                // 数据中订单id
                var pay_order_id = res.data.pay_order_id;
                var appId = "wx5a2e090b5a4d6c5a";
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
                  success: function (res) {
                    console.log(res);
                    // 支付成功修改数据库订单状态
                    wx.request({
                      url: _this.$API + "/api/WxPay/pay_ok",
                      data: {
                        pay_order_id: pay_order_id
                      },
                      success: res => {
                        var url = "../me/main";
                        wx.switchTab({
                          url
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            // 余额足够
            wx.showModal({
              title: "支付",
              content: "确认使用余额支付？",
              success: res => {
                if (res.confirm) {
                  wx.showLoading();
                  wx.request({
                    url: this.$API + "/api/WxPay/yue_pay",
                    data: {
                      id: _this.sessionId,
                      yue: _this.price * _this.count,
                      adress: _this.addressId,
                      product_id: _this.goodsId,
                      shop_num: _this.count
                    },
                    success: function (res) {
                      var pay_order_id = res.data.pay_order_id;
                      wx.request({
                        url: _this.$API + "/api/WxPay/pay_ok",
                        data: {
                          pay_order_id: pay_order_id
                        },
                        success: res => {
                          wx.hideLoading();
                          wx.showModal({
                            title: "提示",
                            content: "支付成功！",
                            showCancel: false,
                            success: res => {
                              var url = "../me/main";
                              wx.switchTab({
                                url
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        }
      },
      createNonceStr: function () {
        return Math.random()
          .toString(36)
          .substr(2, 15)
          .toString();
      }
    },

    onLoad() {
      this.price = this.$root.$mp.query.price;
      this.addressId = this.$root.$mp.query.addressId;
      this.goodsId = this.$root.$mp.query.goodsId;
      this.count = this.$root.$mp.query.count;
    },
    onUnload() {
      this.buying = false
    },
    onShow() {
      this.payType = "";
    },
    mixins: [ifLoginMixin]
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
        display: flex;
        justify-content: center;
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
