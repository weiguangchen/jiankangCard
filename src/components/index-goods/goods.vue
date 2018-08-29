<template>
  <div class="goods" @click="navigate">
    <h2 class="title">{{good.product_name}}<img src="/static/images/index/arrow.png" alt="" class="arrow" mode='widthFix'></h2>
    <img :src="good.product_img" mode='widthFix' alt="" class="thumb">
    <!-- goods.product_img -->
    <!-- <div class="desc">
      <div class="form">
        <div class="form-item">
          <span>属性1</span>
          <span>介绍1</span>
        </div>
        <div class="form-item">
          <span>属性2</span>
          <span>介绍2</span>
        </div>
        <div class="form-item">
          <span>属性3</span>
          <span>介绍3</span>
        </div>
        <div class="form-item">
          <span>属性4</span>
          <span>介绍4</span>
        </div>

      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  props: ["good"],
  created() {

  },
  methods: {
    navigate() {
      console.log(this.good);
      wx.navigateTo({ url: "../detail/main?id=" + this.good.id });
    }
  }
};
</script>
<style lang="scss">
.goods {
  flex: 1;
  padding: 20px 0 0 0;
  background: #ffffff;
  margin-bottom: 20px;
  h2{
    padding: 0 15px;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    color: #3a3a3a;
    font-weight: bold;
    margin-bottom: 20px;
    .arrow {
      width: 10px;
      flex: none;
    }
  }
  .thumb {
    width: 100%;
  }
  .desc {
    font-size: 14px;
    line-height: 24px;
    .form {
      .form-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
