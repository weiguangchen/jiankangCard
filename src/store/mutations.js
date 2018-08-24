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

    SET_PREGOODSID_SYNC(state,preload){
        state.pre_goodsId = preload;
    },


    SAVE_USERDETAIL_SYNC(state,preload){
        state.userDetail = preload;
    },
    CLEAR_USERDETAIL_SYNC(state,preload){
        state.userDetail = '';
    },

    SAVE_FID_SYNC(state,preload){
        state.shareFid = preload;
    },
    SAVE_UID_SYNC(state,preload){
        state.shareUserId = preload;
    },
    SAVE_USTATUS_SYNC(state,preload){
        state.shareStatus = preload;
    },
    SAVE_SHAREINFO(state,preload){
        state.shareInfo = preload;
    },
    // CLEAR_FID_SYNC(state,preload){
    //     state.fid = 0;
    // },

    // 设置验证码倒计时
    SAVE_ISSEND(state,preload){
        state.yzm.isSend = preload 
    },
    SAVE_SECOND(state,preload){
        state.yzm.second = preload;
    },
    SAVE_TIMESTRAP(state,preload){
        state.yzm.timestrap = preload;
    },

    // 设置sessionIsOk
    SET_SESSIONISOK_SYNC(state,preload){
        state.sessionIsOk = preload;
    },

    // 设置用户地址
    SET_AD(state,preload){
        state.user_ad = preload;
    }
}


export default mutations;