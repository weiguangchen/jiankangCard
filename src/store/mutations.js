const mutations = {
    SAVE_SESSIONID_SYNC(state,preload){
        state.sessionId = preload;
    },
    CLEAR_SESSIONID_SYNC(state){
        state.sessionId = '';
    },


    SAVE_USERINFO_SYNC(state,preload){
        state.userInfo = preload;
    },
    CLEAR_USERINFO_SYNC(state){
        state.userInfo = ''
    },

    SAVE_PREGOODSID_SYNC(state,preload){
        state.pre_goodsId = preload;
    },
    CLEAR_PREGOODSID_SYNC(state){
        state.pre_goodsId = '';
    },

    SAVE_USERDETAIL_SYNC(state,preload){
        state.userDetail = preload;
    },
    CLEAR_USERDETAIL_SYNC(state,preload){
        state.userDetail = '';
    },
    
    // 设置sessionIsOk
    SET_SESSIONISOK_SYNC(state,preload){
        state.sessionIsOk = preload;
    },
}


export default mutations;