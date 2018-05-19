<template>
    <div class="app-bg">
        <div class="form">
            <div class="input">
                <label>收款人姓名</label>
                <input type="text" placeholder="请输入收款人姓名" placeholder-class='placeholder-class' v-model="username">
            </div>
            <div class="input">
                <label>手机号</label>
                <input type="number" placeholder="请输入收货人手机号" placeholder-class='placeholder-class' v-model="phone">
            </div>
            <div class="input">
                <label>省市区</label>
                <picker mode="region" @change="regionChange" :value="region">
                    <div class="address-text" v-if="!addressed">请选择地址</div>
                    <label v-else>{{region}}</label>

                </picker>
            </div>
            <div class="input">
                <label>详细地址</label>
                <input type="text" placeholder="请输入详细地址" placeholder-class='placeholder-class' v-model="address">
            </div>
            <!-- <div class="input input-last">
                <label>邮编</label>
                <input type="text" placeholder="请输入邮编" placeholder-class='placeholder-class'>
            </div> -->
        </div>
        <button type="warn" @click="save_ad">保存地址</button>
    </div>
</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      username: "",
      phone: "",
      region: [],
      address: "",
      addressId: ""
    };
  },
  onShow() {
    this.addressId = this.$root.$mp.query.id;
    var _this = this;
    if (this.addressId) {
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/get_adress",
        data: {
          uid: _this.sessionId,
          id: _this.addressId
        },
        success: res => {
          console.log(res);
          _this.username = res.data[0].name;
          _this.phone = res.data[0].phone;
          _this.region = res.data[0].three;
          _this.address = res.data[0].adress;
        }
      });
    }
  },
  onUnload() {
    this.username = "";
    this.phone = "";
    this.region = [];
    this.address = "";
  },
  components: {},
  methods: {
    regionChange: function(e) {
      console.log("picker发送选择改变，携带值为", e.target.value);

      this.region = e.target.value;
    },
    save_ad() {
      var _this = this;
      // 表单验证
      //   if (!_this.username || _this.username.length < 3) {
      //     wx.showToast({
      //       title: "填写正确用户名",
      //       icon: "none",
      //       mask: true,
      //       success: res => {
      //         return false;
      //       }
      //     });
      //   } else if (
      //     !_this.phone ||
      //     !/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone)
      //   ) {
      //     wx.showToast({
      //       title: "请填写正确手机号",
      //       mask: true,
      //       success: res => {
      //         return false;
      //       }
      //     });
      //   } else if (!_this.region) {
      //     wx.showToast({
      //       title: "请选择省市区",
      //       mask: true,
      //       success: res => {
      //         return false;
      //       }
      //     });
      //   } else if (_this.address.lenght<0) {
      //     wx.showToast({
      //       title: "请填写详细地址",
      //       mask: true,
      //       success: res => {
      //         return false;
      //       }
      //     });
      //   } else {

      if (_this.addressId) {
        // 编辑地址
        wx.request({
          url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/edit_adress",
          data: {
            uid: _this.sessionId,
            id: _this.addressId,
            name: _this.username,
            phone: _this.phone,
            three:
              _this.region[0] + "," + _this.region[1] + "," + _this.region[2],
            adress: _this.address
          },
          success: res => {
            console.log(res);
            wx.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        //   新增地址
        wx.request({
          url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/add_adress",
          data: {
            id: _this.sessionId,
            name: _this.username,
            phone: _this.phone,
            three: _this.region[0] + "," + _this.region[1] + "," + _this.region[2],
            adress: _this.address
          },
          success: res => {
            console.log(res);
            // 判断用户是否有地址信息
            wx.request({
              url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/get_adress",
              data: {
                uid: _this.sessionId
              },
              success: res => {
                console.log(res);
                if (res.data.length > 1) {
                  //   多于一条
                  //   wx.navigateBack({
                  //     delta: 1
                  //   });
                } else {
                  //   没有地址
                  // 设置为默认地址
                  wx.request({
                    url:
                      "https://jkfx.tianjinliwu.com.cn/Api/userShow/sz_mr_adress",
                    data: {
                      uid: _this.sessionId,
                      id: res.data[0].id
                    },
                    success: res => {
                      console.log(res);

                      //   wx.navigateBack({
                      //     delta: 1
                      //   });
                    }
                  });
                }
              }
            });
          }
        });
      }

      //   }
    },
    usernameBlur() {
      _this.usernameFocus = false;
    },
    phoneBlur() {
      _this.phoneFocus = false;
    },
    addressFocus() {
      _this.addressFocus = false;
    }
  },
  computed: {
    addressed: function() {
      if (this.region.length <= 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang='scss'>
.app-bg {
  padding-top: $bot;
}
.form {
  background: #ffffff;
  padding-left: 21px;
  margin-bottom: 26px;
  .input {
    display: flex;
    align-items: center;
    height: 51px;
    border-bottom: 1px solid #cccccc;
    label {
      font-size: 17px;
      color: #3a3a3a;
      width: 117px;
      flex: none;
    }
    .address-text {
      color: #d0d0d0;
    }
  }
  .input-last {
    border-bottom: none;
  }
}

.placeholder-class {
  font-size: 17px;
  color: #d0d0d0;
}
</style>
