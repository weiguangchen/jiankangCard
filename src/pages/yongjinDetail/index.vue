<template>
  <div class="app-bg">
    <div class="title">
      <span class="tit">佣金金额</span>
      <span class="money">￥{{detail.product_price}}</span>
    </div>
    <div class="detail">
      <div class="line">
        <span>当前状态</span>
        <span v-if="detail.status == 0">已退款</span>
        <span v-if="detail.status == 1">未结算</span>
        <span v-if="detail.status == 2">已结算</span>
        <span v-if="detail.status == 3">申请退款中</span>
      </div>
      <div class="line">
        <span>商品</span>
        <span>{{detail.product_name}}</span>
      </div>
      <div class="line">
        <span>交易金额</span>
        <span>{{detail.product_price}}</span>
      </div>
      <div class="line">
        <span>交易单号</span>
        <span>{{detail.order_num}}</span>
      </div>
      <div class="line">
        <span>交易人</span>
        <span>已结算</span>
      </div>
      <div class="line">
        <span>一级分销商</span>
        <span>{{detail.one }}</span>
      </div>
      <div class="line">
        <span>二级分销商</span>
        <span>{{detail.two}}</span>
      </div>
      <div class="line">
        <span>交易时间</span>
        <span>{{detail.pay_time}}</span>
      </div>
      <div class="line">
        <span>结算时间</span>
        <span>{{detail.ok_time}}</span>
      </div>
    </div>
  </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      detail: {}
    };
  },

  methods: {},
  onLoad() {},
  onShow() {
    var _this = this;
    var id = this.$root.$mp.query.id;
    var type = this.$root.$mp.query.type;    /* 1为订单详情2为佣金详情 */
    this.$ajax("https://jkfx.tianjinliwu.com.cn/Api/fxOrder/order_content", {
      id
    }).then(res => {
      console.log(res);
      _this.detail = res.data[0];
    });

    if(type == 1){
      wx.setNavigationBarTitle({
        title:'订单详情'
      })
    }else if(type == 2){
      wx.setNavigationBarTitle({
        title:'佣金详情'
      });
    }
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg {
  padding-top: $bot;
}
.title {
  padding: 0 16px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #080808;
  border-bottom: 1px solid #ebebeb;
  background: #ffffff;
  .tit {
    font-size: 15px;
  }
  .money {
    font-size: 18px;
    font-weight: bold;
  }
}

.detail {
  padding: 20px 15px;
  background: #ffffff;
  .line {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #080808;
    opacity: 0.8;
    line-height: 1;
    margin-bottom: 12px;
  }
}
</style>
