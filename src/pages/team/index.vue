<template>
  <div class="app-bg">
    <div class="top">
      <img src="/static/images/team/top-bg.png" alt="" mode='widthFix' class="top-bg">
      <div class="navbar">
        <div class="nav" :class="{active:type}" @click="changeNavBar(true)">
          <div class="nav-text">我的分销商</div>
          <div class="navbar-item">
            <img src="/static/images/team/fxs1.png" alt="" mode='widthFix' class="img" v-if="type">
            <img src="/static/images/team/fxs2.png" alt="" mode='widthFix' class="img" v-else>
            <span class="point">{{fx_count}}</span>
          </div>
          <img src="/static/images/team/navbar.png" alt="" mode='widthFix' class="icon" v-if="type">

        </div>
        <div class="nav" :class="{active:!type}" @click="changeNavBar(false)">
          <div class="nav-text">我的会员</div>
          <div class="navbar-item">
            <img src="/static/images/team/hy1.png" alt="" mode='widthFix' class="img" v-if="!type">
            <img src="/static/images/team/hy2.png" alt="" mode='widthFix' class="img" v-else>
            <span class="point">{{hy_count}}</span>
          </div>
          <img src="/static/images/team/navbar.png" alt="" mode='widthFix' class="icon" v-if="!type">

        </div>
      </div>
    </div>
    <div class="boss" v-if="boss">
      <img :src="boss.avatarurl || '/static/images/team/boss.png'" alt="" mode='widthFix' class="img">
      <span class="tit">我的上级：
        <span class="txt">{{boss.nickname || ''}}</span>
      </span>
      <span class="tit">手机号：
        <span class="txt">{{boss.user_phone || ''}}</span>
      </span>
    </div>
    <div class="list" v-if="type">
      <div class="select">
        <span class="op" :class="{active:selectType_1==0}" @click="changeSelect_1(0)">所有分销商({{fx_count}})</span>
        <span class="op" :class="{active:selectType_1==1}" @click="changeSelect_1(1)">一级({{fx_count_1}})</span>
        <span class="op" :class="{active:selectType_1==2}" @click="changeSelect_1(2)">二级({{fx_count_2}})</span>
      </div>

      <scroll-view scroll-y class="scrollview" @scrolltolower='fxScrolltolower' :scroll-top='fx_scroll_top'>
        <div class="item" v-for="(item,index) in fx_list" :key="index">
          <div class="info-wrap">
            <img :src="item.avatarurl  || '/static/images/team/boss.png'" alt="" mode='widthFix' class="avatar">
            <div class="info">
              <div>昵称：{{item.nickname || ''}}</div>
              <div>手机：{{item.user_phone || ''}}</div>
              <div>姓名：{{item.user_name || ''}}</div>
            </div>
          </div>
          <div class="fx-info">
            <img src="/static/images/team/fx-bg.png" alt="" mode='widthFix' class="fx-bg">
            <div class="text-wrap">
              <div class="text">佣金：{{item.money}}</div>
              <div class="text">分销商：{{item.fxs_num}}</div>
              <div class="text">会员：{{item.hy_num}}</div>
            </div>

          </div>
        </div>
        <div v-if='!fx_can_scroll' class='nomore'>暂无数据</div>
        <div v-else class="nomore">正在加载数据</div>
      </scroll-view>
    </div>
    <div class="list" v-else>
      <div class="select">
        <span class="op" :class="{active:selectType_2==0}" @click="changeSelect_2(0)">所有会员({{hy_count}})</span>
        <span class="op" :class="{active:selectType_2==1}" @click="changeSelect_2(1)">一级({{hy_count_1}})</span>
        <span class="op" :class="{active:selectType_2==2}" @click="changeSelect_2(2)">二级({{hy_count_2}})</span>
      </div>
      <scroll-view scroll-y class="scrollview">
        <div class="item" v-for="(item,index) in hy_list" :key="index">
          <div class="info-wrap">
            <img :src="item.avatarurl || '/static/images/team/boss.png'" alt="" mode='widthFix' class="avatar">
            <div class="info">
              <div>昵称：{{item.nickname || ''}}</div>
              <div>手机：{{item.user_phone || ''}}</div>
              <div>姓名：{{item.user_name || ''}}</div>
            </div>
          </div>
          <div class="status">
            <div class="hy" v-if="item.jibie==1">一级</div>
            <div class="hy" v-else-if="item.jibie==2">二级</div>
          </div>
        </div>
        <div v-if='!fx_can_scroll' class="nomore">暂无数据</div>
        <div v-else class="nomore">正在加载数据</div>

      </scroll-view>

    </div>
  </div>

</template>

<script>
import ifLoginMixin from "@/mixin/ifLoginMixin";

export default {
  data() {
    return {
      boss: {},
      type: true /* true为分销商   false为会员 */,
      fx_p: 1 /* 分销商页码 */,
      selectType_1: 0 /*    分销筛选项 */,
      fx_count_1: "" /*  一级数量 */,
      fx_count_2: "" /*  二级数量 */,
      fx_list: [] /*   分销列表数据 */,
      fx_can_scroll: false,
      fx_scroll_top: 0,
      hy_p: 1 /* 会员页码 */,
      selectType_2: 0 /* 会员筛选项 */,
      hy_count_1: "" /*  一级数量 */,
      hy_count_2: "" /*  二级数量 */,
      hy_list: [] /* 会员列表数据 */,
      hy_can_scroll: false
    };
  },

  methods: {
    get_fx() {
      var _this = this;
      var NUM = 8; // 每页多少条
      wx.showLoading();
      wx.request({
        url: this.$API+"/Api/userShow/user",
        data: {
          uid: _this.sessionId,
          p: _this.fx_p,
          num: NUM
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          _this.fx_count_1 = res.data.one_num || 0;
          _this.fx_count_2 = res.data.two_num || 0;
          _this.fx_list = res.data.data;

          if (res.data.ok == 1) {
            _this.fx_can_scroll = true;
          } else {
            _this.fx_can_scroll = false;
          }
        }
      });
    },
    get_fx_1() {
      const _this = this;
      const NUM = 8;
      wx.request({
        url: this.$API+"/Api/userShow/one_fxs",
        data: {
          uid: _this.sessionId,
          num: NUM,
          p: _this.fx_p
        },
        success: res => {
          console.log(res);
          _this.fx_count_1 = res.data.count;
          _this.fx_list = res.data.list;
          if (res.data.ok == 1) {
            _this.fx_can_scroll = true;
          } else {
            _this.fx_can_scroll = false;
          }
        }
      });
    },
    get_fx_2() {
      const _this = this;
      const NUM = 8;
      wx.request({
        url: this.$API+"/Api/userShow/two_fxs",
        data: {
          uid: _this.sessionId,
          num: NUM,
          p: _this.fx_p
        },
        success: res => {
          console.log(res);
          if (res.data) {
            _this.fx_count_2 = res.data.count;
            _this.fx_list = res.data.list;
            if (res.data.ok == 1) {
              _this.fx_can_scroll = true;
            } else {
              _this.fx_can_scroll = false;
            }
          }else{
            _this.fx_list = [];
          }
        }
      });
    },
    get_hy() {
      const NUM = 8;
      const _this = this;
      wx.showLoading();
      wx.request({
        url: this.$API+"/Api/userShow/huiyuan",
        data: {
          uid: _this.sessionId,
          p: _this.hy_p,
          num: NUM
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          _this.hy_count_1 = res.data.one_num || 0;
          _this.hy_count_2 = res.data.two_num || 0;
          _this.hy_list = res.data.list;
          if (res.data.ok == 1) {
            _this.fx_p++;
            _this.fx_can_scroll = true;
          } else {
            _this.fx_can_scroll = false;
          }
        }
      });
    },
    get_hy_1() {
      const _this = this;
      const NUM = 8;
      wx.request({
        url: this.$API+"/Api/FxOrder/get_one_user",
        data: {
          uid: _this.sessionId,
          num: NUM,
          p: _this.hy_p
        },
        success: res => {
          console.log(res);
          _this.hy_count_1 = res.data.list.length;
          _this.hy_list = res.data.list;
          if (res.data.ok == 1) {
            _this.fx_p++;
            _this.fx_can_scroll = true;
          } else {
            _this.fx_can_scroll = false;
          }
        }
      });
    },
    get_hy_2() {
      const _this = this;
      const NUM = 8;
      wx.request({
        url: this.$API+"/Api/FxOrder/get_two_user",
        data: {
          uid: _this.sessionId,
          num: NUM,
          p: _this.hy_p
        },
        success: res => {
          console.log(res);
          _this.hy_count_2 = res.data.list.length;
          _this.hy_list = res.data.list;
          if (res.data.ok == 1) {
            _this.fx_p++;
            _this.fx_can_scroll = true;
          } else {
            _this.fx_can_scroll = false;
          }
        }
      });
    },
    // 获取上一级
    get_boss() {
      var _this = this;
      wx.request({
        url: this.$API+"/Api/userShow/f_user",
        data: {
          uid: _this.sessionId
        },
        success: res => {
          console.log("boss");
          console.log(res);
          if (res.data) {
            this.boss = res.data[0];
          } else {
            this.boss = null;
          }
        }
      });
    },
    // 分销商滚动加载
    fxScrolltolower() {
      var _this = this;
      var NUM = 8; // 每页多少条
      _this.fx_p++;
      if (this.fx_can_scroll) {
        if (this.selectType_1 == 0) {
          wx.showLoading();
          wx.request({
            url: this.$API+"/Api/userShow/user",
            data: {
              uid: _this.sessionId,
              p: _this.fx_p,
              num: NUM
            },
            success: res => {
              wx.hideLoading();
              console.log(res);
              _this.fx_count_1 = res.data.one_num || 0;
              _this.fx_count_2 = res.data.two_num || 0;

              if (res.data.ok == 1) {
                _this.fx_p++;
                _this.fx_can_scroll = true;
              } else if (res.data.ok == 0) {
                _this.fx_can_scroll = false;
              }

              _this.fx_list = _this.fx_list.concat(res.data.data);
            }
          });
        } else if (this.selectType_1 == 1) {
          wx.showLoading();
          wx.request({
            url: this.$API+"/Api/userShow/one_fxs",
            data: {
              uid: _this.sessionId,
              num: NUM,
              p: _this.fx_p
            },
            success: res => {
              wx.hideLoading();
              console.log(res);
              _this.fx_count_1 = res.data.count;
              if (res.data.ok == 1) {
                _this.fx_can_scroll = true;
              } else {
                _this.fx_can_scroll = false;
              }
              _this.fx_list = _this.fx_list.concat(res.data.list);
            }
          });
        } else if (this.selectType_1 == 2) {
          wx.request({
            url: this.$API+"/Api/userShow/two_fxs",
            data: {
              uid: _this.sessionId,
              num: NUM,
              p: _this.fx_p
            },
            success: res => {
              console.log(res);
              _this.fx_count_2 = res.data.count;
              if (res.data.ok == 1) {
                _this.fx_can_scroll = true;
              } else {
                _this.fx_can_scroll = false;
              }
              _this.fx_list = _this.fx_list.concat(res.data.list);
            }
          });
        }
      }
    },
    // 会员滚动加载
    hyScrolltolower() {
      console.log(1);
    },
    // 切换用户和会员
    changeNavBar(t) {
      this.type = t;
    },
    // 切换分销商select
    changeSelect_1(n) {
      this.selectType_1 = n;
      this.fx_p = 1;
      if (n == 0) {
        this.get_fx();
      } else if (n == 1) {
        this.get_fx_1();
      } else if (n == 2) {
        this.get_fx_2();
      }
    },
    // 切换会员select
    changeSelect_2(n) {
      this.selectType_2 = n;
      this.hy_p = 1;
      if (n == 0) {
        this.get_hy();
      } else if (n == 1) {
        this.get_hy_1();
      } else if (n == 2) {
        this.get_hy_2();
      }
    }
  },
  computed: {
    fx_count() {
      return parseInt(this.fx_count_1) + parseInt(this.fx_count_2);
    },
    hy_count() {
      return parseInt(this.hy_count_1) + parseInt(this.hy_count_2);
    },
    level(n) {
      if (n == 1) {
        return "一级";
      } else if (n == 2) {
        return "二级";
      }
    }
  },
  onUnload() {},
  onLoad() {},
  onShow() {
    this.get_fx();
    this.get_hy();
    this.get_boss();
  },
  mixins: [ifLoginMixin]
};
</script>

<style lang="scss">
.app-bg {
  display: flex;
  flex-direction: column;
}
.top {
  height: 126px;
  flex: none;
}
.top-bg {
  width: 100%;
  position: absolute;
  top: -2px;
  left: 0;
}
.navbar {
  height: 100%;
  position: relative;
  z-index: 100;
  display: flex;
  color: #ffffff;
  .nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    display: flex;
    padding-top: 6px;
    position: relative;
    z-index: 200;
    .nav-text {
      text-align: center;
      font-size: 11px;
    }
    .navbar-item {
      flex: none;
      display: flex;
      justify-content: center;
      margin-top: 48px;
      position: relative;
      .img {
        width: 29px;
      }
      .point {
        position: absolute;
        top: -30%;
        right: -30%;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #ffffff;
        background: #cb2620;
        border-radius: 50%;
      }
    }
    .icon {
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 500;
      width: 60px;
    }
  }
  .active {
    .navbar-item {
      transform: scale(1.3);
    }
  }
}

.boss {
  flex: none;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #222222;

  .img {
    width: 37px;
    margin-right: 8px;
  }
  .tit {
    font-size: 12px;
    margin-right: 28px;
  }
  .txt {
    font-size: 14px;
    font-weight: bold;
  }
}
.list {
  display: flex;
  flex-direction: column;
  flex: 1;
  .select {
    flex: none;
    background: #ffffff;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    .op {
      display: inline-block;
      font-size: 12px;
      height: 23px;
      line-height: 23px;
      padding: 0 14px;
      border: 1px solid #cb2620;
      border-radius: 10px;
    }
    .active {
      color: #ffffff;
      background: #cb2620;
    }
  }

  .scrollview {
    flex: 1;
    height: 225px;
  }

  .item {
    background: #ffffff;
    display: flex;
    padding-left: 15px;
    margin-bottom: 10px;
    .info-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .avatar {
        width: 60px;
        border-radius: 4px;
        margin-right: 15px;
      }
      .info {
        font-size: 12px;
        line-height: 20px;
        color: #151515;
        opacity: 0.8;
      }
    }
    .fx-info {
      position: relative;
      flex: none;
      width: 116px;
      font-size: 12px;
      color: #ffffff;
      font-weight: bold;
      .text-wrap {
        position: relative;
        z-index: 100;
        padding: 16px 0 0 25px;
        .text {
          line-height: 1;
          margin-bottom: 7px;
        }
      }
      .fx-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    }
    .status {
      display: flex;
      align-items: center;
    }
    .hy {
      text-align: center;
      height: 35px;
      line-height: 35px;
      width: 66px;
      border-radius: 18px;
      font-size: 12px;
      color: #ffffff;
      background: #cb2620;
      margin-right: 25px;
    }
  }
  .nomore {
    font-size: 12px;
    text-align: center;
    opacity: 0.8;
    margin-top: 10px;
  }
}
</style>
