<template>
  <div class="app-bg">
    <div class="address">
      <template v-if="ifHasAd">
        <div class="info">
          <div class="title">收货信息</div>
          <div class="detail">
            <div class="person">
              <span class="name">收款人： {{ad.name}}</span>
              <span class="phone">手机号： {{ad.phone}}</span>
            </div>
            <div class="add">收货地址： {{ad.three}}{{ad.adress}}</div>
          </div>
        </div>
        <div class="btn">
          <div class="changeAdd" @click="changeAdd">更换地址</div>
        </div>
      </template>
      <button v-else class="add-newAd" type="warn" @click="add_new">新增地址</button>
    </div>
    <!-- <button>原生地址</button> -->
    <!-- 配送方式 -->
    <!-- <div class="peisong">
      <myCell leftText='配送方式' :op='array1' :index='index1' @finishChange='finishSendChange'></myCell>

      <myCell leftText='发票信息' :op='array2' :index='index2' @finishChange='finishReceiptChange'></myCell>
    </div> -->
    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="title">
        <span class="txt">商品信息：</span>
        <span class="goods">{{goodsDetail.product_name}}/1张</span>
      </div>
      <div class="content">
        <img :src="goodsDetail.product_img" alt="" class="img" mode='aspectFit' @click="previewImg">
        <div class="info">
          <p class="intr">{{goodsDetail.product_name}}</p>
          <p class="price">￥
            <span class="num">{{goodsDetail.product_price}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 订单结算 -->
    <div class="order">
      <div class="title">
        <span class="tit">订单结算</span>
        <span class="price">{{goodsDetail.product_price}}</span>
      </div>
      <div class="order-list">
        <div class="order-item">
          <span>商品价格</span>
          <span>￥{{goodsDetail.product_price}}</span>
        </div>
        <div class="order-item">
          <span>运费总额</span>
          <span>免费</span>
        </div>
      </div>
    </div>
    <!-- 提交订单 -->
    <div class="submit" @click="submitOrder">提交订单</div>
    <myModal v-if="showMyModal" @modalShow='closeModal'></myModal>
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
  import myModal from "@/components/modal/modal";

  export default {
    data() {
      return {
        goodsId: "",
        goodsDetail: {},
        ad: '',
        showMyModal: false
      };
    },
    onLoad() {
      this.goodsId = this.$root.$mp.query.id;;
      this.get_pro();
      this.get_mr_ad();
    },
    onUnload() {
      // 清除用户选择地址
      this.SET_AD('');
    },
    onShow() {
      if (this.user_ad) {
        // 已选地址
        console.log(this.user_ad)
        this.ad = this.user_ad;
      } else {
        // 使用默认地址
        this.get_mr_ad();
      }



    },
    computed: {
      ...mapState(["userDetail", "user_ad"]),
      ...mapGetters(["ifBangding"]),
      currentCity() {
        return this.ad ? this.ad.three.split(',')[0] : "";
      },
      ifHasAd() {
        return this.ad ? true : false;

      },
    },
    components: {
      myModal
    },

    methods: {
      ...mapMutations(['SET_AD']),

      // finishSendChange(data) {
      //   console.log(data);
      //   this.index1 = data;
      // },
      // finishReceiptChange(data) {
      //   this.index2 = data;
      // },

      closeModal(val) {
        this.showMyModal = val;
        this.checkSessinId();
      },
      add_new() {
        var url = "../address/main";
        wx.navigateTo({
          url
        });
      },
      changeAdd() {
        var url = "../selectAdd/main";
        wx.navigateTo({
          url
        });
      },
      submitOrder() {
        var _this = this;

        if (this.ifHasAd) {
          if (this.currentCity != '天津市' && this.goodsId == 22) {
            wx.showModal({
              title: '提示',
              content: '该商品只能在天津地区使用！'
            })
            return;
          }
        }
        if (this.ifBangding) {
          console.log("绑定了");
          if (this.ifHasAd) {
            var url =
              "../pay/main?price=" +
              this.goodsDetail.product_price +
              "&addressId=" +
              this.ad.id + "&goodsId=" + this.goodsId;
            console.log("跳转支付url：" + url);
            wx.navigateTo({
              url
            });
          } else {
            wx.showModal({
              title: "提示",
              content: "请添加收货地址",
              success: res => {
                _this.add_new();
              }
            });
          }
        } else {
          console.log("没绑定");
          this.showMyModal = true;
        }
      },
      previewImg() {
        var _this = this;
        wx.previewImage({
          urls: [_this.goodsDetail.product_img] // 需要预览的图片http链接列表
        });
      },
      get_pro() {
        // 获取商品信息
        this.$ajax(this.$API + "/Api/Pro/get_product", {
          id: this.goodsId
        }).then(({
          data
        }) => {
          this.goodsDetail = data.data[0];
        })
      },
      get_mr_ad() {
        // 获取默认地址
        this.$ajax(this.$API + "/Api/userShow/moren_adress", {
          id: this.sessionId
        }).then(({
          data
        }) => {
          console.log(this.ad);
          if (this.ad.log == 0) {
            // 没有默认地址
            this.ad = '';
          } else {
            // 有默认地址
            this.ad = data[0];
          }
        })
      },
    },

    mixins: [ifLoginMixin]
  };

</script>

<style lang='scss'>
  $paddingleft: 15px;
  .app-bg {
    padding-top: $bot;
  }

  .address {
    display: flex;
    height: 110px;
    background: #ffffff;
    padding: 19px $paddingleft 0;
    box-sizing: border-box;
    margin-bottom: $bot;
    .add-newAd {
      flex: none;
      width: 100%;
      height: 55px;
      line-height: 55px;
    }
    .info {
      // width: 264px;
      flex: 1;
      .title {
        font-size: 17px;
        color: #363636;
        margin-bottom: 15px;
      }
      .detail {
        font-size: 13px;
        color: #545454;
        .person {
          margin-bottom: 10px;
          .name {
            margin-right: 16px;
          }
        }
      }
    }
    .btn {
      position: absolute;
      top: 18px;
      right: 6px;
      flex: 1;
      font-size: 11px;
      .changeAdd {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        width: 80px;
        height: 35px;
        border-radius: 18px;
        background: #cb2620;
      }
    }
  }

  .peisong {
    margin-bottom: $bot;
  }

  .goods-info {
    background: #ffffff;
    padding-left: $paddingleft;
    margin-bottom: $bot;
    .title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      height: 55px;
      font-size: 17px;
      color: #373737;
      .txt {
        flex: none;
      }
      .goods {
        font-size: 15px;
      }
    }
    .content {
      padding: 18px 0;
      display: flex;
      .img {
        width: 111px;
        height: 72px;
      }
      .info {
        display: flex;
        flex-direction: column;
        padding: 0 10px 0 6px;
        font-size: 14px;
        color: #363636;
        .intr {
          flex: auto;
        }
        .price {
          .num {
            color: #cd2620;
          }
        }
      }
    }
  }

  .order {
    background: #ffffff;
    padding-left: $paddingleft;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1;
      height: 55px;
      border-bottom: 1px solid #cccccc;
      padding-right: 15px;
      .tit {
        font-size: 16px;
      }
      .price {
        font-size: 18px;
        color: #cd2620;
      }
    }
    .order-list {
      .order-item {
        padding-right: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 31px;
        font-size: 14px;
        color: #373737;
      }
    }
  }

  .submit {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: #cb2620;
    color: #ffffff;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }

</style>
