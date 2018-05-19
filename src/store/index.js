import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'
import state from "./state.js";
import mutations from './mutations.js';
import actions from "./actions.js";
import getters from "./getters.js";

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [
        createPersistedState({
          storage: {
            getItem: key => wx.getStorageSync(key),
            // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
            setItem: (key, value) => wx.setStorageSync(key,value),
            removeItem: key => {
                // console.log('清空了缓存')
            }
          }
        })
      ]
})

export default store;