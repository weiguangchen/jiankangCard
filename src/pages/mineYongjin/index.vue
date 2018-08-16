<template>
  <div class="app-bg">
    <div class="top">
      <img src="/static/images/fenxiaoOrder/top-bg.png" alt="" mode='widthFix' class="top-bg">
      <div class="txt">
        <img src="/static/images/fenxiaoOrder/wen-bg.png" alt="" mode='widthFix' class="wen-bg">
        <div class="num-item">
          <div class="num">{{total.yjs_money || 0}}</div>
          <div class="tit">已结算佣金(￥)</div>
        </div>
        <!-- <div class="num-item">
          <div class="num">{{total.wjs_money || 0}}</div>
          <div class="tit">未结算佣金(￥)</div>
        </div> -->
      </div>
      <div class="tixian">
        <div class="left">
          <div class="tit">当前可提现佣金：</div>
          <div class="money">{{total.yue}}元</div>
        </div>
        <div class="right">
          <button size='mini' type="warn" class="btn" @click='tixianYue'>提现到余额</button>
          <button size='mini' type="warn" class="btn" @click="tixianYueDetail">提现记录</button>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="line line1">
        <div class="item">
          <div class="tit">佣金金额</div>
          <div class="num">{{total.give_all_money || 0}}元</div>
        </div>
        <div class="item">
          <div class="tit">提现总额</div>
          <div class="num">{{total.tixian_money || 0}}</div>
        </div>
      </div>
      <div class="line">
        <div class="item">
          <div class="tit">完成订单</div>
          <div class="num">{{total.yjs_danshu || 0}}笔</div>
        </div>
        <div class="item">
          <div class="tit">订单总额</div>
          <div class="num">{{total.yjs_danshu_money || 0}}元</div>
        </div>
      </div>
    </div>
    <div class="list-wrapper">
      <div class="title">
        <span class="l">佣金明细</span>
        <span class="r">全部</span>
      </div>
      <scroll-view scroll-y class="list" @scrolltolower='scrolltolower'>
        <div class="list-item" v-for="(item,index) in list" :key="index" @click="fenxiaoDetail(item.id)">
          <div class="line">
            <span>订单：{{item.order_num}}</span>
            <span class="date">21321321312321312{{item.pay_time}}</span>
          </div>
          <div class='line'>
            <span>来源：123{{item.ly}}

              <span class="status status-warn" v-if="item.status == 0">[已退款]</span>
              <span class="status status-warn" v-else-if="item.status == 1">[未结算]</span>
              <span class="status status-success" v-else-if='item.status == 2'>[已结算]</span>
              <span class="status status-warn" v-else-if='item.status == 3'>[申请退款中]</span>
            </span>
            <span class="money">+580.00</span>
          </div>
        </div>
        <div v-if='!more' class="nomore">暂无数据</div>
        <div v-else class="nomore">正在加载数据</div>
      </scroll-view>


    </div>

  </div>
</template>

<script>
  import ifLoginMixin from "@/mixin/ifLoginMixin";

  export default {
    data() {
      return {
        total: {},
        p: 1,
        list: [],
        more: true
      };
    },

    onShow() {
      var _this = this;
      // 获取统计信息
      this.$ajax(this.$API + "/Api/YjShow/yj", {
        uid: _this.sessionId
      }).then(res => {
        console.log(res);
        _this.total = res.data;
      });
      // 获取佣金明细
      this.get_all_order().then(res => {
        _this.list = res;
      });
    },
    onReachBottom() {
      var _this = this;
      if (this.more) {
        _this.p++;
        this.get_all_order().then(res => {
          _this.list = _this.list.concat(res);
        });
      }
    },
    computed: {},
    methods: {
      fenxiaoDetail(n) {
        var url = "../yongjinDetail/main?id=" + n + "&type=2";
        wx.navigateTo({
          url
        });
      },

      // 全部分销订单
      get_all_order() {
        var num = 8;
        var _this = this;
        return this.$ajax(
          this.$API + "/Api/fxOrder/all_fx_order", {
            uid: _this.sessionId,
            num,
            p: _this.p
          }
        ).then(res => {
          if (res.data.ok == 1) {
            _this.more = true;
          } else if (res.data.ok == 0) {
            _this.more = false;
          }
          return res.data.list;
        });
      },

      tixianYue() {
        var url = "../tixianYue/main";
        wx.navigateTo({
          url
        });
      },
      tixianYueDetail() {
        var url = "../tixianYueDetail/main?id=" + this.sessionId;
        wx.navigateTo({
          url
        });
      }
    },

    mixins: [ifLoginMixin]
  };

</script>

<style lang='scss'>
  .top {
    position: relative;
    background: #ffffff;
    height: 220px;
    margin-bottom: $bot;
    .txt {
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      height: 120px;
      width: 299px;
      z-index: 300;
      padding-top: 61px;
      line-height: 1;
      .num-item {
        text-align: center;
        flex: 1;
        position: relative;
        z-index: 300;
        .num {
          color: #ffffff;
          font-size: 23px;
          margin-bottom: 20px;
        }
        .tit {
          color: #000000;
          font-size: 12px;
        }
      }
    }
    .tixian {
      position: absolute;
      left: 50%;
      bottom: 25px;
      transform: translateX(-50%);
      width: 299px;
      display: flex;
      line-height: 1;
      .left {
        width: 139px;
        .tit {
          font-size: 15px;
          color: #080808;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .money {
          font-size: 18px;
          color: #121212;
          font-weight: bold;
        }
      }
      .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        .btn {
          flex: none;
          font-size: 11px;
          padding: 0 7px;
          height: 22px;
          line-height: 22px;
        }
      }
    }
  }

  .top-bg {
    width: 100%;
    position: absolute;
    top: -70px;
    left: 0;
  }

  .wen-bg {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .total {
    padding-left: 15px;
    background: #ffffff;
    margin-bottom: $bot;
    .line {
      height: 85px;
      display: flex;
      .item {
        flex: 1;
        color: #080808;
        line-height: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .tit {
          font-size: 15px;
          opacity: 0.3;
          margin-bottom: 15px;
        }
        .num {
          font-size: 18px;
        }
      }
    }
    .line1 {
      border-bottom: 1px solid #ebebeb;
    }
  }

  .list-wrapper {
    .title {
      height: 44px;
      line-height: 44px;
      font-size: 15px;
      color: #080808;
      padding: 0 15px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ebebeb;
      .l {
        font-weight: bold;
      }
      .r {
        color: #080808;
        opacity: 0.3;
      }
    }
    .list {
      // height: 417px;
      .list-item {
        margin-bottom: $bot;
        padding: 10px 15px;
        box-sizing: border-box;
        height: 60px;
        background: #ffffff;
        line-height: 1;
        font-size: 13px;
        .line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
          .date {
            color: #cbcbcb;
          }
          .money {
            color: #080808;
            font-weight: bold;
          }
          .status {
            margin-left: 32px;
          }
          .status-warn {
            color: #cb2620;
          }
          .status-success {
            color: #3b9c36;
          }
        }
      }
      .nomore {
        font-size: 12px;
        text-align: center;
        opacity: 0.8;
        margin-top: 10px;
      }
    }
  } 

</style>
