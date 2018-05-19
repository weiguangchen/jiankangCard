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
}
export default getters;
