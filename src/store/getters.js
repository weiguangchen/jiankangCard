const getters = {
  ifLogin: state => {
    return state.sessionId?true:false;
  },
  ifFenxiaoshang: state => {
    return state.userDetail.status == 1?true:false;
  },
  ifBangding: state => {
    return state.userDetail.bangding == 1?true:false;
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
