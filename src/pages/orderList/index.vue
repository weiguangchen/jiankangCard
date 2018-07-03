<template>
  <div class="app-bg">
    <div class="order-item" v-for="(item,index) in orderList" :key='index'>
      <div class="title">
        <span class="bianhao">订单编号 : {{item.order_num}}</span>
        <span class="status" v-if="item.status == 0">状态：已退款</span>
        <span class="status" v-else-if="item.status == 1">状态：已付款</span>
        <span class="status" v-else-if="item.status == 2">状态：已完成</span>
        <span class="status" v-else-if="item.status == 3">状态：申请退款中</span>
      </div>
      <div class="intr">
        <img :src="goodsDetail.product_img" alt="" mode='widthFix' class="img" v-if="goodsDetail">
        <div class="content">{{goodsDetail.product_name}}</div>
        <img src="/static/images/finish.png" alt="" class="status-icon" mode='widthFix' v-if="item.status == 2">
      </div>
      <div class="info">
        <button size='mini' type="warn" class="btn" :disabled='item.status == 0 || item.status == 2 || item.status == 3' @click="tuikuan(item.id)">申请退款</button>
        <div class="prices">
          <div class="jiage">共1件商品&nbsp;&nbsp;&nbsp;&nbsp;实付款 :
            <span class="num">￥{{item.order_price}}</span>
          </div>
          <div class="buy-time">
            <span class="tit">下单时间 :</span>
            <span>{{item.pay_time}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="order-item">
      <div class="title">
        <span>订单信息</span>
        <span class="status">状态：已完成</span>
      </div>
      <div class="intr">
        <img src="/static/images/order/goods.png" alt="" mode='widthFix' class="img">
        <div class="content">华泽健康卡有健康的体魄才能有愉快的心情</div>
        <img src="/static/images/finish.png" alt="" class="status-icon" mode='widthFix'>
      </div>
      <div class="info">
        <button size='mini' :disabled='cantui' class="btn disabled-btn" @click="disabledbtn">申请退款</button>
        <div class="prices">
          <div class="jiage">共1件商品&nbsp;&nbsp;&nbsp;&nbsp;实付款 :
            <span class="num">￥980.00</span>
          </div>
          <div class="buy-time">
            <span class="tit">下单时间 :</span>
            <span>2018-05-21 12:18:33</span>
          </div>
        </div>
      </div>
    </div> -->
  </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      cantui: true,
      orderList: [],
      goodsDetail: {}
    };
  },

  methods: {
    disabledbtn() {
      console.log(1111);
    },
    if_status(status) {
      if (status == 0) {
        return "退款";
      } else if (status == 1) {
        return "已付款";
      } else if (status == 2) {
        return "已完成";
      } else if (status == 3) {
        return "申请退款中";
      }
    },
    get_list() {
      var _this = this;
      wx.request({
        url: this.$API+"/Api/userShow/pay_order_list",
        data: {
          uid: _this.sessionId
        },
        success: res => {
          console.log(res);
          _this.goodsDetail = res.data.xq[0];
          _this.orderList = res.data.list;
          wx.stopPullDownRefresh();
        }
      });
    },
    tuikuan(id) {
      var _this = this;
      wx.showLoading();
      this.$ajax(this.$API+"/Api/userShow/order_tui", {
        id
      }).then(
        res => {
          wx.hideLoading();
          console.log(res);
          _this.get_list();
        },
        err => {
          wx.hideLoading();
        }
      );
    }
  },
  onShow() {
    this.get_list();
  },
  onPullDownRefresh() {
    this.get_list();
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
%botbor {
  border-bottom: 1px solid #cccccc;
}
%rpad {
  padding-right: 15px;
}
.order-item {
  margin-top: 10px;
  background: #ffffff;
  padding-left: 15px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #363636;
    height: 55px;
    @extend %botbor;
    @extend %rpad;
    .status {
      font-size: 12px;
    }
  }
  .intr {
    position: relative;
    height: 73px;
    display: flex;
    align-items: center;
    padding-right: 110px;
    @extend %botbor;
    .img {
      flex: none;
      width: 64px;
      margin-right: 20px;
    }
    .content {
      font-size: 15px;
      color: #363636;
    }
    .status-icon {
      position: absolute;
      right: 0;
      top: 5px;
      width: 66px;
    }
  }
  .info {
    height: 79px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 18px;
    .btn {
      padding: 0;
      flex: none;
      margin: 0;
      width: 75px;
      font-size: 12px;
    }
    .disabled-btn {
      background: #d0d0d0;
      color: #ffffff;
      border: none;
    }
    .prices {
      flex: none;
      color: #363636;
      line-height: 1;
      .jiage {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
        margin-bottom: 18px;
        .num {
          font-size: 15px;
          margin-left: 11px;
        }
      }
      .buy-time {
        .tit {
          font-size: 12px;
          opacity: 0.3;
          margin-right: 28px;
        }
        font-size: 14px;
      }
    }
  }
}
</style>
