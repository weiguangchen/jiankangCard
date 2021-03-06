import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from "vuex";

export default {
  data() {
    return {
      sessionIsOk: 0,
      // bangding: false
    }
  },
  methods: {
    ...mapMutations([
      "SAVE_USERINFO_SYNC",
      "CLEAR_USERINFO_SYNC",
      "CLEAR_SESSIONID_SYNC",
      "SAVE_USERDETAIL_SYNC",
      "CLEAR_USERDETAIL_SYNC",
      "SET_SESSIONISOK_SYNC",
      'SAVE_TIMESTRAP'
    ]),
    sessionIdIfTimeOut(fn) {
      wx.showLoading();
      var _this = this;
      wx.request({
        url: this.$API+"/Api/GetUser/get_user_id",
        data: {
          id: _this.sessionId
        },
        success: res => {
          console.log('id验证是否可用');
          console.log(res);
          _this.sessionIsOk = res.data.status;
          wx.hideLoading();
          fn();
        }
      });
    },
    getUserDetail() {
      var _this = this;
      // 获取用户信息
      wx.request({
        url: this.$API+"/Api/userShow/get_userinfo",
        data: {
          id: _this.sessionId
        },
        success: res => {
          console.log('用户详情')
          console.log(res)
          _this.SAVE_USERDETAIL_SYNC(res.data[0])

          _this.checkYzm();
          wx.stopPullDownRefresh();

        }
      });
    },
    checkSessinId() {
      var cur = getCurrentPages();
      //   判断缓存中是否存在sessionId，如果不存在就重新登录;如果存在判断sessionId是否可用，可用不进行操作，不可用就重新登录
      var _this = this;
      if (this.sessionId) {
        console.log('缓存中有id')
        // 判断id是否可用
        this.sessionIdIfTimeOut(function () {
          if (_this.sessionIsOk == 1) {
            console.log('id可用')
            _this.getUserDetail();
            // _this.checkPhone();
            // id可用
          } else if (_this.sessionIsOk == 0) {
            console.log('id不可用')
            // id不存在
            // 重新授权登录，获取用户信息

            if (cur[0].route != 'pages/me/main') {
              wx.showModal({
                title: "提示",
                content: "授权已过期，请重新登录",
                showCancel: false,
                complete: res => {
                  _this.CLEAR_USERINFO_SYNC();
                  _this.CLEAR_SESSIONID_SYNC();
                  _this.CLEAR_USERDETAIL_SYNC();
                  var url = '../me/main';
                  wx.switchTab({
                    url
                  })
                }
              });
            }

          }
        });
      } else {
        console.log('缓存无id');
        if (cur[0].route != 'pages/me/main') {
          wx.showModal({
            title: "提示",
            content: "请登录",
            showCancel: false,
            complete: res => {
              _this.CLEAR_USERINFO_SYNC();
              _this.CLEAR_SESSIONID_SYNC();
              _this.CLEAR_USERDETAIL_SYNC();
              var url = '../me/main';
              wx.switchTab({
                url
              })
            }
          });
          // 缓存中无id
        }
      }
    },
    checkPhone() {
      // if ('bangding' in this.userDetail) {
      //   if (this.userDetail.bangding == 1) {
      //     console.log('已绑定')
      //     this.bangding = true
      //   } else if (this.userDetail.bangding == 0) {
      //     console.log('未绑定')
      //     this.bangding = false
      //   }
      // } else {
      //   console.log('没有bangding')
      // }

    },
    checkYzm() {
      var timeStrap = this.yzm.timestrap;
      if (timeStrap) {
        var now = new Date().getTime.toString().substr(0, 10);
        var last = (parseInt(now * 1000) - timeStrap * 1000) / 1000;
        console.log(last);
        if(last>=60){
          this.SAVE_TIMESTRAP('')
        }
      }

    }
  },
  computed: {
    ...mapState(["sessionId", "userInfo", "userDetail","yzm"]),
    ...mapGetters(["ifFenxiaoshang","ifBangding"])
  },
  onShow() {
    this.checkSessinId();
  },

}
