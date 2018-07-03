import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from "vuex";

export default {
  data() {
    return {
    }
  },
  onShow() {



  },
  computed: {
    ...mapState(["sessionId", "userInfo", "pre_goodsId"]),
    ...mapGetters(["ifLogin"])
  },
  methods: {
    ...mapActions(["SAVE_SESSIONID", "SAVE_USERINFO"]),
    ...mapMutations([
      "SAVE_USERINFO_SYNC",
      "CLEAR_USERINFO_SYNC",
      "CLEAR_SESSIONID_SYNC",
      "SAVE_USERDETAIL_SYNC",
      "CLEAR_USERDETAIL_SYNC",
      "SET_SESSIONISOK_SYNC",
    ]),
    
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
        }
      });
    }
  }
}
