<template>
    <div class="app-bg">
        <div class="cz-item" v-for="(item,index) in cz" :key="index">
            <div class="money">
                <div class="title">充值金额</div>
                <div class="num">￥{{item.money}}</div>
            </div>
            <div class="info">
                <div class="line">
                    <span class="left">充值账户</span>
                    <span class="right">{{userDetail.nickname}}</span>
                </div>
                <div class="line">
                    <span class="left">充值时间</span>
                    <span class="right">{{item.pay_time}}</span>
                </div>
                <div class="line">
                    <span class="left">到账日期</span>
                    <span class="right">{{item.pay_time}}</span>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      cz: []
    };
  },

  methods: {},
  onShow() {
    var _this = this;
    wx.request({
      url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/chongzhi_list",
      data: {
        uid: _this.sessionId
      },
      success: res => {
        console.log(res);
        _this.cz = res.data;
      }
    });
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg {
  padding: 10px 15px;
  .cz-item {
    margin-bottom: 10px;
    border-radius: 5px;
    background: #ffffff;
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
