<template>
  <div class="app-bg">
    <div class="swiper-box">
      <img src="/static/images/index/index-bg.png" alt="" class="img" mode='widthFix'>
    </div>
    <div>
      <goods navUrl='../detail/main' :goodsId='goods.id'></goods>
    </div>
  </div>

</template>

<script>
import goods from "@/components/index-goods/goods";
import ifLoginMixin from '@/mixin/ifLoginMixin';
// import mymixin from '@/mixin/mymixin';

export default {
  data() {
    return {
      goods: {}
    };
  },

  components: {
    goods
  },

  methods: {
   
  },
  onLoad() {

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
  mixins: [ifLoginMixin],
  onShow() {
    
  },
  computed: {
  }
};
</script>

<style lang="scss">
.swiper-box {
  margin-bottom: $bot;
  .img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
