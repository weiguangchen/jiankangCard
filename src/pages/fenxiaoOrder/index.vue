<template>
  <div class="app-bg">
    <div class="top">
      <img src="/static/images/fenxiaoOrder/top-bg.png" alt="" mode='widthFix' class="top-bg">
      <div class="txt">
        <img src="/static/images/fenxiaoOrder/wen-bg.png" alt="" mode='widthFix' class="wen-bg">
        <div class="num-item">
          <div class="num">{{total.all_money || 0}}</div>
          <div class="tit">我的佣金总额(￥)</div>
        </div>
        <div class="num-item">
          <div class="num">{{total.fx_order_money || 0}}</div>
          <div class="tit">分销订单总额(￥)</div>
        </div>
      </div>
      <radio-group>
        <scroll-view scroll-x class="select" scroll-into-view='scrollIntoView'>
          <div class="select-item" :class="{active:isActive===1}" @click="changeSelect(1)" id="select1">
            <span class="tit">所有订单</span>
            <span class="num">({{total.all_order || 0}})</span>
          </div>
          <div class="select-item" :class="{active:isActive===2}" @click="changeSelect(2)" id="select2">
            <span class="tit">未结算</span>
            <span class="num">({{total.wjs_order || 0}})</span>
          </div>
          <div class="select-item" :class="{active:isActive===3}" @click="changeSelect(3)" id="select3">

            <span class="tit">已结算</span>
            <span class="num">({{total.yjs_order || 0}})</span>
          </div>
          <div class="select-item" :class="{active:isActive===4}" @click="changeSelect(4)" id="select4">

            <span class="tit">一级</span>
            <span class="num">({{total.one || 0}})</span>
          </div>
          <div class="select-item" :class="{active:isActive===5}" @click="changeSelect(5)" id="select5">

            <span class="tit">二级</span>
            <span class="num">({{total.two || 0}})</span>
          </div>
        </scroll-view>
      </radio-group>
    </div>
    <scroll-view scroll-y class="list" @scrolltolower='scrolltolower'>
      <div class="list-item" v-for="(item,index) in list" :key="index" @click="fenxiaoDetail(item.id)">
        <div class="line">
          <span>订单：{{item.order_num}}</span>
          <span class="date">{{item.pay_time}}</span>
        </div>
        <div class='line'>
          <span>来源：{{item.ly}}
            <span class="status status-warn" v-if="item.status == 0">[已退款]</span>
            <span class="status status-warn" v-else-if="item.status == 1">[未结算]</span>
            <span class="status status-success" v-else-if='item.status == 2'>[已结算]</span>
            <span class="status status-warn" v-else-if='item.status == 3'>[申请退款中]</span>
          </span>
          <span class="money">+{{item.zj}}</span>
        </div>
      </div>
      <div v-if='!more' class="nomore">暂无数据</div>
      <div v-else class="nomore">正在加载数据</div>
    </scroll-view>
  </div>
</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      isActive: 1,
      scrollIntoView: "",
      total: {},
      p: 1,
      list: [],
      more: true
    };
  },

  onShow() {
    var _this = this;
    // 获取统计信息
    this.$ajax("https://jkfx.tianjinliwu.com.cn/Api/fxOrder/user_fx_order", {
      id: _this.sessionId
    }).then(res => {
      _this.total = res.data;
    });

    // 获取所有订单
    this.get_all_order().then(res => {
      console.log(res);
      this.list = res;
    });
  },
  computed: {},
  methods: {
    changeSelect(n) {
      if (this.isActive != n) {
        this.isActive = n;
        this.p = 1;

        if (n == 1) {
          // 获取所有订单
          this.get_all_order().then(res => {
            console.log(res);
            this.list = res;
          });
        } else if (n == 2) {
          // 获取所有订单
          this.get_wjs_order().then(res => {
            console.log(res);
            this.list = res;
          });
        } else if (n == 3) {
          // 获取所有已结算订单
          this.get_yjs_order().then(res => {
            console.log(res);
            this.list = res;
          });
        } else if (n == 4) {
          // 获取所有已结算订单
          this.get_one_order().then(res => {
            console.log(res);
            this.list = res;
          });
        } else if (n == 5) {
          // 获取所有已结算订单
          this.get_two_order().then(res => {
            console.log(res);
            this.list = res;
          });
        }
      }
    },
    fenxiaoDetail(n) {
      var url = "../yongjinDetail/main?id=" + n + "&type=1";
      wx.navigateTo({ url });
    },

    // 全部分销订单
    scrolltolower() {
      var _this = this;
      if (this.more) {
        _this.p++;

        if (this.isActive == 1) {
          this.get_all_order().then(res => {
            console.log(_this.list);
            _this.list = _this.list.concat(res);
            console.log(_this.list);
          });
        } else if (this.isActive == 2) {
          this.get_wjs_order().then(res => {
            console.log(_this.list);
            _this.list = _this.list.concat(res);
            console.log(_this.list);
          });
        } else if (this.isActive == 3) {
          this.get_yjs_order().then(res => {
            console.log(_this.list);
            _this.list = _this.list.concat(res);
            console.log(_this.list);
          });
        } else if (this.isActive == 4) {
          this.get_one_order().then(res => {
            console.log(_this.list);
            _this.list = _this.list.concat(res);
            console.log(_this.list);
          });
        } else if (this.isActive == 5) {
          this.get_two_order().then(res => {
            console.log(_this.list);
            _this.list = _this.list.concat(res);
            console.log(_this.list);
          });
        }
      }
    },
    // 获取所有分销订单
    get_all_order() {
      var _this = this;
      var num = 8;
      return this.$ajax(
        "https://jkfx.tianjinliwu.com.cn/Api/fxOrder/all_fx_order",
        {
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
    // 获取所有未结算订单
    get_wjs_order() {
      var _this = this;
      var num = 8;
      return this.$ajax(
        "https://jkfx.tianjinliwu.com.cn/Api/fxOrder/wjs_order",
        {
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
    // 获取所有已结算订单
    get_yjs_order() {
      var _this = this;
      var num = 8;
      return this.$ajax(
        "https://jkfx.tianjinliwu.com.cn/Api/fxOrder/yjs_order",
        {
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
    // 获取所有已结算订单
    get_one_order() {
      var _this = this;
      var num = 8;
      return this.$ajax(
        "https://jkfx.tianjinliwu.com.cn/Api/fxOrder/one_fx_order",
        {
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
    // 获取所有已结算订单
    get_two_order() {
      var _this = this;
      var num = 8;
      return this.$ajax(
        "https://jkfx.tianjinliwu.com.cn/Api/fxOrder/two_fx_order",
        {
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
    }
  },

  mixins: [ifLoginMixin]
};
</script>

<style lang='scss'>
.top {
  position: relative;
  background: #ffffff;
  height: 195px;
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
  .select {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 56px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    .select-item {
      padding: 0 16px;
      height: 56px;
      line-height: 56px;
      display: inline-block;
      font-size: 15px;
      color: #080808;
      opacity: 0.8;
      .num {
        font-size: 9px;
        color: #cb2620;
        opacity: 0.8;
      }
    }
    .active {
      font-size: 18px;
      opacity: 1;
      font-weight: bold;
      .num {
        font-weight: bold;
      }
      .tit {
        border-bottom: 2px solid #cb2620;
      }
    }
    .radio:checked + span {
      color: blue;
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

.list {
  height: 417px;
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
</style>
