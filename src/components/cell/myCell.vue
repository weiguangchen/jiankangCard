<template>
  <div class="cell">
    <span class="left">{{leftText}}</span>
    <span class="right">
      <span class="right-text">
        <picker @change="pickerChange" :value="index" :range="op">
          {{op[index]}}
        </picker>
      </span>

      <img src="/static/images/arrow.png" alt="" mode='widthFix' class="img">
    </span>
  </div>
</template>
<script>
export default {
  props: ["leftText", "rightText", "op", "index"],
  methods: {
    pickerChange: function(e) {
      this.$emit('finishChange',e.target.value);
    }
  }
};
</script>
<style lang="scss">
.cell {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 49px;
  padding: 0 15px;
  border-bottom: 1px solid #cccccc;
  .left {
    @extend %fontsize;
  }
  .right {
    display: flex;
    align-items: center;
  }
  .right-text {
    font-size: 14px;
    color: #9b9b9b;
    margin-right: 16px;
  }
  .img {
    width: 11px;
    flex: none;
  }
}
</style>
