<template>
  <div class="app-bg">
    <div class="swiper-box">
      <img :src="pageInfo.one_img" alt="" class="img" mode='widthFix'>
    </div>
    <div class="goodslist">
      <goods :good='item' v-for="(item,index) in goods" :key="index"></goods>
    </div>
  </div>

</template>

<script>
  import goods from "@/components/index-goods/goods";
  import ifLoginMixin from "@/mixin/ifLoginMixin";

  export default {
    data() {
      return {
        goods: [],
        pageInfo: {},
        noData: false,
        num: 8,
        p: 1
      };
    },

    components: {
      goods
    },

    methods: {
      get_pro() {
        // 获取商品

        if (this.noData) {
          return;
        } else {
          this.$ajax(this.$API + "/Api/Pro/get_pro", {
            num: 8,
            p: this.p
          }).then(({
            data
          }) => {
            console.log(data)
            if (data.ok == 1) {
              this.p++;
            } else {
              this.noData = true;
            }
            this.goods = this.goods.concat(data.list);

          })

        }
      },
      get_title() {
        this.$ajax(this.$API + "/Api/Qian/index").then(res => {
          console.log(res);
          this.pageInfo = res.data[0];
        });
      }
    },
    onLoad() {
      var _this = this;
      // 动态获取title
      this.get_title();
      this.get_pro();
    },
    onShareAppMessage(res) {
      const _this = this;
      // if (res.from === "button") {
      //   console.log("转发");
      //   console.log(this.userDetail);
      // 来自页面内转发按钮
      var url;
      if (this.userDetail.status == 1) {
        url = "/pages/fenxiao/main?fid=" + this.sessionId;
        console.log(url);
      } else if (this.userDetail.status == 0) {
        url = "/pages/fenxiao/main?fid=" + this.userDetail.fid;
        console.log(url);
      }
      console.log(url)
      return {
        path: url,
        title: _this.goods.product_name
      };
      // }
    },
    onReachBottom() {
      this.get_pro();
    },
    mixins: [ifLoginMixin],
    onShow() {
      if (!this.sessionId) {
        wx.hideShareMenu();
      } else {
        wx.showShareMenu();
      }
    },
    computed: {}
  };

</script>

<style lang="scss">
  .app-bg {
    display: flex;
    flex-direction: column;
  }

  .swiper-box {
    margin-bottom: $bot;
    .img {
      width: 100%;
      vertical-align: middle;
    }
  }

  .goodslist {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: $bot;

  }

</style>
