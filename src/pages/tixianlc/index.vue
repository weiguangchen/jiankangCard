<template>
    <div class="app-bg">
        <div class="liucheng">
          <img src="/static/images/tixian/step1.png" alt="" mode='widthFix' class="step" >
          <div class="step-info">
            <div class="step1">发起提现申请</div>
            <div class="step2">
              <p>系统审核中</p>
              <p class="dzTime">预计到账时间 05-21 14:20</p>
            </div>
            <div class="step3">到账成功</div>
          </div>
        </div>
        <div class="info">
          <div class="line"><span>提现金额</span><span>￥980.00</span></div>
          <div class="line"><span>手续费</span><span>￥0.10</span></div>
          <div class="line"><span>提现账户</span><span>李海东</span></div>
        </div>
        <button class="btn" type="warn">完成</button>
    </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
    };
  },

  methods: {
    
  },
  onUnload() {
  },

  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg{
  padding: 36px 15px 0;
}

.liucheng{
  display: flex;
  border-bottom: 1px solid #bcbcbc;
  padding: 0 35px 40px;
  .step{
    width: 28px;
    margin-right: 28px;
  }
  .step-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 15px;
    color: #0c0c0c;
    .dzTime{
      opacity: .3;
    }
  }
}
.info{
  font-size: 15px;
  color: #0c0c0c;
  line-height: 1; 
  padding: 26px 15px;
  .line{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
.btn{
  height: 38px;
  line-height: 38px;
  width: 220px;
}
</style>
