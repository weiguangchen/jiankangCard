<template>
  <div class="Mask">
    <div class="my-modal">
      <div class="title">确认身份</div>
      <!-- <img src="/static/images/cha.png" alt="" mode="widthFix" class="cancel" @click="cancel"> -->

      <div class="form-group">
        <span class="name">绑定手机号：</span>
        <div class="text">{{userDetail.user_phone}}</div>
      </div>
      <div class="form-group">
        <span class="name">短信验证码：</span>
        <div class="input-box"><input type="number" v-model="yzmNum">
          <span class="yzm" @click="yzmfn" v-if='!isSend'>发送验证码</span>
          <span class="yzm ing" v-else>重新发送({{second}})</span>
        </div>
      </div>
      <div class="btns">
        <button size='mini' type="warn" class="btn" @click="submit">确认</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      yzmNum: "",
      code: "",
      isSend: false,
      second: 60,
      interval:''
    };
  },
  computed: {
    ...mapState(["yzm", "userDetail"])
  },
  methods: {
    // ...mapMutations(["SAVE_ISSEND", "SAVE_SECOND"]),
    // cancel() {
    //   this.$emit("modalShow");
    // },
    yzmfn() {
      var _this = this;
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/Api/Alidayu/alyzm",
        data: {
          mobile: _this.userDetail.user_phone
        },
        success: res => {
          console.log(res);
          // _this.SAVE_ISSEND(true);
          _this.isSend = true;
          _this.code = res.data.code;
          _this.djs();
        }
      });
    },
    djs() {
      this.interval = setInterval(() => {
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
      console.log('code:'+this.code) 
      console.log('phone:'+this.userDetail.user_phone)
      if(this.code == this.yzmNum){
        this.$emit('queren');
      }else{
        wx.showModal({
          title:'提示',
          content:'验证码不正确',
          showCancel:false
        })
      }
    }
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
