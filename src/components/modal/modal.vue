<template>
  <div class="Mask">
    <div class="my-modal">
      <div class="title">确认身份</div>
      <div class="form-group">
        <span class="name">真实姓名：</span>
        <div class="input-box"><input type="text" placeholder="请输入真实姓名" v-model="realName"></div>
      </div>
      <div class="form-group">
        <span class="name">手机号码：</span>
        <div class="input-box"><input type="number" placeholder="请输入有效手机号" v-model="phone"></div>
      </div>
      <div class="form-group">
        <span class="name">短信验证码：</span>
        <div class="input-box"><input type="number" v-model="yzmNum">
          <button class="yzm" @click="yzmfn" v-if='!isSend' :disabled='yzming'>发送验证码</button>
          <span class="yzm ing" v-else>重新发送({{second}})</span>
        </div>
      </div>
      <div class="btns">
        <button size='mini' type="warn" class="btn" @click="submit" :disabled='submiting'>确认</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      submiting: false,
      yzming: false,
      realName: "",
      phone: "",
      yzmNum: "",
      code: "",
      isSend: false,
      second: 60
    };
  },
  computed: {
    ...mapState(["yzm", "sessionId"]),
    ...mapGetters(["isSend"])
  },

  onShow() {},
  methods: {
    ...mapMutations(["SAVE_ISSEND", "SAVE_SECOND", "SAVE_TIMESTRAP"]),
    yzmfn() {
      var _this = this;
      // 防止重复触发
      this.yzming = true;
      if (!_this.realName) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "请填写真实姓名",
          success() {
            _this.yzming = false;
          }
        });
      } else if (!this.phone || !/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone)) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "请填写正确手机号",
          success() {
            _this.yzming = false;
          }
        });
      } else {
        wx.request({
          url: "https://jkfx.tianjinliwu.com.cn/Api/Alidayu/alyzm",
          data: {
            mobile: _this.phone
          },
          success: res => {
            console.log(res);
            _this.isSend = true;
            _this.code = res.data.code;
            _this.djs();
          }
        });
      }
    },
    djs() {
      var djs = setInterval(() => {
        var newtime = this.second - 1;
        if (newtime <= 0) {
          this.isSend = false;
          clearInterval(djs);
          this.second = 60;
        } else {
          this.second = newtime;
        }
      }, 1000);
    },
    submit() {
      this.submiting = true;
      var _this = this;
      console.log("code:" + this.code);
      console.log("yzm:" + this.yzmNum);
      if (!_this.realName) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "请填写真实姓名",
          success() {
            _this.submiting = false;
          }
        });
      } else if (!this.phone || !/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone)) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "请填写正确手机号",
          success() {
            _this.submiting = false;
          }
        });
      } else if (!this.yzmNum || this.yzmNum != this.code) {
        wx.showModal({
          title: "提示",
          showCancel: false,
          content: "验证码填写错误",
          success() {
            _this.submiting = false;
          }
        });
      } else {
        this.$ajax("https://jkfx.tianjinliwu.com.cn/Api/userShow/ws", {
          uid: _this.sessionId,
          user_name: _this.realName,
          user_phone: _this.phone
        }).then(res => {
          console.log(res);
          if (res.data.status == 1) {
            wx.showModal({
              title: "提示",
              showCancel: false,
              content: "绑定身份成功！",
              success() {
                _this.$emit("modalShow", false);
              }
            });
          } else {
            wx.showModal({
              title: "提示",
              showCancel: false,
              content: "绑定身份失败！",
              success() {
                _this.checkSessinId();
              }
            });
          }
        });
      }
    }
    // checkYzm() {
    //   var timeStrap = this.yzm.timestrap;
    //   if (timeStrap) {
    //     var now = new Date().getTime.toString().substr(0, 10);
    //     var last = (parseInt(now * 1000) - timeStrap * 1000) / 1000;
    //     console.log(last);
    //     if (last >= 60) {
    //       this.SAVE_TIMESTRAP("");
    //     }
    //   }
    // }
  }
};
</script>
<style lang="scss">
.Mask {
  background: rgba(#000000, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
.my-modal {
  box-sizing: border-box;
  position: fixed;
  z-index: 200;
  margin-top: 50%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
  width: 315px;
  padding: 0 35px 15px;
  //   height: 269px;
  background: #ffffff;
  border-radius: 5px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    font-size: 15px;
    color: #0c0c0c;
    border-bottom: 1px solid #b1b1b1;
    margin-bottom: 15px;
  }
  .cancel {
    position: absolute;
    right: 21px;
    top: 16px;
    width: 22px;
  }
  .form-group {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #393837;
    margin-bottom: 20px;
    .name {
      flex: none;
      width: 90px;
    }
    .input-box {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #b1b1b1;
      .yzm {
        flex: none;
        font-size: 14px;
        color: #ca2f32;
      }
      .ing {
        color: #0c0c0c;
        opacity: 0.3;
      }
    }
    .text {
      font-size: 12px;
      color: #0c0c0c;
    }
  }
  .btns {
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>
