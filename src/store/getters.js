const getters = {
  ifLogin: state => {
    if (state.sessionId) {
      return true;
    } else {
      return false;
    }
  },
  ifFenxiaoshang: state => {
    if (state.userDetail.status == 1) {
      // 是分销商
      return true;
    } else if (state.userDetail.status == 0) {
      // 不是分销商
      return false;
    }
  },
  ifBangding: state => {
    // if ('bangding' in this.userDetail) {
      if (state.userDetail.bangding == 1) {
        // 已绑定
        return true;
      } else if (state.userDetail.bangding == 0) {
        // 未绑定
        return false;
      }
    // }
  },
  isSend:state=>{
    // var now = new Date().getTime.toString().substr(0,10);
    // var lastTime = parseInt(now) - state.yzm.timestrap;
    // if(lastTime>60){
    //   return false;
    // }else{
    //   return true;
    // }
  }
}
export default getters;
