
import { createStore } from 'vuex'
 
const store = createStore({
  state: {
    userInfo: {
      name:'myName'
    }
  },
  mutations: {
    getUserInfo (state, name) {
      state.userInfo.name = name
    }
  },
  actions: {
    asyncGetUserInfo ({ commit }) {
      setTimeout(() => {
        commit("getUserInfo", +new Date() + 'action')
      },2000)
    }
  },
  getters: {
  
  } 
})
 
export default store
