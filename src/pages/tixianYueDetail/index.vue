<template>
  <div class="app-bg">
    <div class="cz-item" v-for="(item,index) in tx" :key="index">
      <!-- <div class="status" v-if='item.status == 0'>审核中</div> -->
      <!-- <div class="status" v-else>已完成</div> -->
      <div class="money">
        <div class="title">提现金额</div>
        <div class="num">￥{{item.money}}</div>
      </div>
      <div class="info">
        <div class="line">
          <span class="left">充值账户</span>
          <span class="right">{{userDetail.nickname}}</span>
        </div>
        <div class="line">
          <span class="left">提现时间</span>
          <span class="right">{{item.date}}</span>
        </div>
        <!-- <div class="line">
          <span class="left">到账日期</span>
          <span class="right">{{item.sdate || '--'}}</span>
        </div> -->
      </div>

    </div>
  </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      tx: []
    };
  },

  methods: {
    get_list() {
      var _this = this;
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/Api/YjShow/yj_order",
        data: {
          uid: _this.sessionId
        },
        success: res => {
          console.log(res);
          _this.tx = res.data.reverse();
          wx.stopPullDownRefresh();
        }
      });
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
.app-bg {
  padding: 10px 15px;
  .cz-item {
    position: relative;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #ffffff;
    .status {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 18px;
    }
    .money {
      text-align: center;
      border-bottom: 1px dashed #cccccc;
      padding: 25px 0;
      margin: 0 25px 8px;
      line-height: 1;
      .title {
        font-size: 14px;
        color: #cccccc;
        margin-bottom: 10px;
      }
      .num {
        font-size: 23px;
        font-weight: bold;
        color: #0c0c0c;
      }
    }
    .info {
      margin: 0 16px;
      padding-bottom: 18px;
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 24px;
        .left {
          color: #cccccc;
        }
        .right {
          color: #0c0c0c;
        }
      }
    }
  }
}
</style>
