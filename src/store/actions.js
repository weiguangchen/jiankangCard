const actions = {
    SAVE_SESSIONID(context,preload){
        context.commit('SAVE_SESSIONID_SYNC',preload)
    },
    SAVE_USERINFO(context,preload){
        context.commit('SAVE_USERINFO_SYNC',preload)        
    }
}

export default actions;