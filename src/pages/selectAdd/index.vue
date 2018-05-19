<template>
  <div class="app-bg">
    <radio-group @change='radioChange'>
      <div class="add" v-for="(item,index) in adArr" :key='index'>
        <div class="info">
          <div class="info1">
            <span>{{item.name}}</span>
            <span>{{item.phone}}</span>
          </div>
          <div class="info2">
            收货地址：{{item.three}}{{item.adress}}
          </div>
        </div>
        <div class="handle">
          <span class="set-default">
            <radio class="radio" :checked='item.status == 1?true:false' :value='item.id'></radio>设为默认地址</span>
          <span class="btns" v-if="item.status == 1?false:true">
            <span class="btn" @click="bianji(item.id)">编辑</span>
            <span class="btn" @click="shanchu(item.id,index)">删除</span>
          </span>
        </div>
      </div>
    </radio-group>
    <div class="add-btn" @click="add">新增地址</div>
  </div>
</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      adArr: []
    };
  },
  onShow() {
    var _this = this;
    wx.request({
      url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/get_adress",
      data: {
        uid: _this.sessionId
      },
      success: res => {
        console.log(res);
        _this.adArr = res.data;
      }
    });
  },
  methods: {
    radioChange: function(e) {
      var _this = this;
      console.log(e.mp.detail.value);
      var id = e.mp.detail.value;
      wx.request({
        url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/sz_mr_adress",
        data: {
          uid: _this.sessionId,
          id
        },
        success: res => {
          console.log(res);
          wx.request({
            url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/get_adress",
            data: {
              uid: _this.sessionId
            },
            success: res => {
              console.log(res);
              _this.adArr = res.data;
            }
          });
        }
      });
    },
    add() {
      var url = "../address/main";
      wx.navigateTo({ url });
    },
    bianji(id) {
      var url = "../address/main?id=" + id;
      wx.navigateTo({ url });
    },
    shanchu(id, index) {
      var _this = this;
      wx.showModal({
        title: "提示",
        content: "确定删除该地址？",
        success: res => {
          if (res.confirm) {
            wx.request({
              url: "https://jkfx.tianjinliwu.com.cn/Api/userShow/delete_adress",
              data: {
                id: id
              },
              success: res => {
                console.log(res);
                // _this.adArr.splice(index, 1);
                wx.request({
                  url:
                    "https://jkfx.tianjinliwu.com.cn/Api/userShow/get_adress",
                  data: {
                    uid: _this.sessionId
                  },
                  success: res => {
                    console.log(res);
                    _this.adArr = res.data;
                  }
                });
              }
            });
          }
        }
      });
    }
  },
  computed: {
    radioSelected: function() {
      if (this.payType == "") {
        return false;
      } else {
        return true;
      }
    }
  },
  onLoad() {},
  mixins: [ifLoginMixin]
};
</script>

<style lang='scss'>
.app-bg {
  padding-bottom: 55px;
}
.add {
  margin-top: $bot;
  background: #ffffff;
  padding-left: 15px;
  .info {
    padding-top: 19px;
    padding-bottom: 17px;
    line-height: 1;
    border-bottom: 1px solid #cccccc;
    .info1,
    .info2 {
      padding-right: 15px;
    }
    .info1 {
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 17px;
      color: #363636;
    }
    .info2 {
      font-size: 13px;
      color: #535353;
    }
  }
  .handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    height: 44px;
    .set-default {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #545454;
      .radio .wx-radio-input {
        width: 16px;
        height: 16px;
      }
      .radio .wx-radio-input.wx-radio-input-checked {
      }
      .radio .wx-radio-input.wx-radio-input-checked::before {
        // color: #cb2620;
        // border: 1px solid #cb2620;
      }
    }
    .btns {
      display: flex;
      .btn {
        border-radius: 6px;
        margin-right: 16px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 23px;
        width: 50px;
        border: 1px solid #e3928e;
        color: #cb2620;
      }
    }
  }
}
.add-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 55px;
  color: #ffffff;
  background: #cb2620;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
}
</style>
