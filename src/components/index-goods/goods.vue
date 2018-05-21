<template>
  <div class="goods" @click="navigate">
    <h2 class="title">华泽健康卡 <img src="/static/images/index/arrow.png" alt="" class="arrow" mode='widthFix'></h2>
    <img :src="goods.product_img" mode='widthFix' alt="" class="thumb">
    <div class="desc">
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
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goods: {}
    };
  },
  props: ["navUrl", "goodsId"],
  created() {
    // 获取商品
    wx.request({
      url:
        "https://jkfx.tianjinliwu.com.cn/index.php?g=Api&m=pro&a=get_product",
      success: res => {
        console.log(res);
        this.goods = res.data.data[0];
      }
    });
  },
  methods: {
    navigate() {
      console.log(this.goodsId);
      wx.navigateTo({ url: this.navUrl + "?id=" + this.goodsId });
    }
  }
};
</script>
<style lang="scss">
.goods {
  padding: 24px 15px;
  background: #ffffff;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
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
    margin-bottom: 14px;
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
