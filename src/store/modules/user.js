import { setCurrentUser, getCurrentUser } from '../../utils'

import axios from "axios";


export default {
  state: {
    currentUser: getCurrentUser(),
    loginError: null,
    processing: false,
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)

      const options = {
        method: "post",
        url: "http://desafio.conexasaude.com.br/api/login",
        data: payload,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGUifQ.8rm5Ug8hNsQ_Q5nPyB0YLd9KmumdzFHT-O_mrBQMrTY",
        },
      };

      axios(options).then((response) => {

        const item = {
          nome: response.data.data.nome,
          email: response.data.data.email,
          token: response.data.data.token
        }

        setCurrentUser(item)
        commit('setUser', item)

      });
    },
    signOut({ commit }) {
      setCurrentUser(null);
      commit('setLogout')
    }
  }
}








// .then(
//   user => {
//     const item = { uid: user.user.uid, ...currentUser }
//     setCurrentUser(item)
//     commit('setUser', item)
//   },
//   err => {
//     setCurrentUser(null);
//     commit('setError', err.message)
//     setTimeout(() => {
//       commit('clearError')
//     }, 3000)
//   }