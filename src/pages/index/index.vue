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
import mymixin from '@/mixin/mymixin';

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
    wxModal() {
      var _this = this;
      wx.showModal({
        title: "是否打开设置页面重新授权",
        content: "需要获取您的用户信息授权，请到小程序设置中打开授权",
        confirmText: "去设置",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            wx.openSetting();
          } else if (res.cancel) {
            console.log("用户点击取消");
            _this.wxModal();
          }
        }
      });
    }
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
  mixins: [ifLoginMixin,mymixin],
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
