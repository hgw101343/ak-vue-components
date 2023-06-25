import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import settings from "@/settings";
// create an axios instance
const service = axios.create({
  baseURL: (settings.site + "/api/") || process.env.VUE_APP_BASE_API, // url = base url + request url  "http://localhost:9528/recruit/"
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const nowToken = getToken();
    if (store.getters.token || nowToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = store.getters.token || nowToken;
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response;

    const isDownloadFileSuccess =
    response.request.responseType == "arraybuffer" && response.status == 200; // 增加下载文件判断

    // if the custom code is not 20000, it is judged as an error.
    if (res.status != 200 && !Array.isArray(res.data) && res.data.code !== 0 && res.data.code !== 20000 && !isDownloadFileSuccess) {
      Message({
        message: res.msg || res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      });
      if (response && (response.status == 401 || response.data.code == 401)) {
        // 假如401 退出账号

        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || res.msg || 'Error'));
    } else if (isDownloadFileSuccess) {
      return response;
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    });
    return Promise.reject(error);
  }
);

function tansParams(params) {
  let result = '';
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
  });
  return result;
}

export const request = {

  login(url, params) {
    if (!params['grant_type']) params['grant_type'] = 'b_password';
    return service.post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        }
      ],
      headers: {

      }
    });
  },
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  post2(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  put2(url, params) {
    return service.put(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  get(url, params) {
    let _params;
    if (Object.is(params, undefined)) {
      _params = '';
    } else {
      _params = '?';
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`;
        }
      }
    }
    return service.get(`${url}${_params}`);
  },
  delete(url, params) {
    let _params;
    if (Object.is(params, undefined)) {
      _params = '';
    } else {
      _params = '?';
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`;
        }
      }
    }
    return service.delete(`${url}${_params}`);
  },
  delete2(url, params) {
    return service.delete(`${url}`, {
      data: params
    });
  },

  upload(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
export default service;
