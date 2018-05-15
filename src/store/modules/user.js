import {getUserInfo, loginByUsername, logout} from "@/api/login";
import {getToken, removeToken, setToken} from "@/utils/auth";
import { MessageBox } from 'element-ui';
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({commit}, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if(response){
            const data = response.data;
            commit('SET_TOKEN', data.token);
            setToken(data.token);
            resolve()
          }else{
              MessageBox.alert('登录失败,请检查用户名或密码', {
              confirmButtonText: '确定'
            });
            resolve()
          }

        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          //1-普通微信用户  2-代理商 3-加盟商 4-代理+加盟 5-仓库管理员 6-admin
          const role = response.data.role;
          let roles = [];
          if (role == 1) {
            roles.push("weixin")
          }else if (role == 2) {
            roles.push("angel")
          } else if (role == 3) {
            roles.push("jiameng")
          } else if (role == 4) {
            roles.push("angel");
            roles.push("jiameng")
          } else if (role == 5) {
            roles.push("store")
          } else if (role == 6) {
            roles.push("admin")
          }else{
            roles.push("nofound")
          }
          commit('SET_ROLES', roles);
          commit('SET_NAME', response.data.loginName);
          commit('SET_AVATAR', response.data.avatar);
          commit('SET_INTRODUCTION', response.data.introduction);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({commit}, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role);
        setToken(role);
        getUserInfo(role).then(response => {
          commit('SET_ROLES', response.data.roles);
          commit('SET_NAME', response.data.name);
          commit('SET_AVATAR', response.data.avatar);
          commit('SET_INTRODUCTION', response.data.introduction);
          resolve()
        })
      })
    }
  }
};

export default user
