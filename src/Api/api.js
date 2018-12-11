import axios from 'axios';
import store from '../store/store.js'
import router from '../router'
import Vue from 'vue'

let SESSION=localStorage.getItem('sessionId') ? localStorage.getItem('sessionId') : null;

let appType = {
	type: function() {
		var u = navigator.userAgent;
		return { //移动终端浏览器版本信息
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			androidToJs: u.indexOf('androidToJs') > -1 || u.indexOf('Linux') > -1, //androidToJs终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mapi/ads/StarRankingac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1,
			wechat: u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
			//是否web应该程序，没有头部与底部
		};
	}()

}

const key = '';

let devUrl = "/api/";

if(window.location.host == "xx.xx.com") {
		let url = 'http://' + window.location.host;
	Vue.prototype.$shareUrl = 'https://xx.xx.com';
	Vue.prototype.$imgUrl = url;
  	devUrl = "https://xx.xx.com"+devUrl;
}


 function getSession(){

	let result = localStorage.getItem('sessionId');
	if(result) {
    SESSION = result;

		return result;
	}
}

axios.defaults.timeout = 10000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 10000;

axios.interceptors.request.use(config => {
	// Do something before request is sent
	//let token =  = store.getters.token;

	//config.headers['X-Token'] = "sassssssssssssssssssss";

	return config;
}, error => {


	// Do something with request error
	return Promise.reject(error);
});

//axios响应拦截
axios.interceptors.response.use(response => {

	return response;
}, err => {
	let config = err.config;
	const pattern = /timeout of 10000ms exceeded/g;
  const isChunkLoadFailed = err.message.match(pattern);
  if(isChunkLoadFailed){
	// If config does not exist or the retry option is not set, reject
	if(!config || !config.retry) return Promise.reject(err);

	// Set the variable for keeping track of the retry count
	config.__retryCount = config.__retryCount || 0;

	// Check if we've maxed out the total number of retries
	if(config.__retryCount >= config.retry) {
		// Reject with the error
		return Promise.reject(err);
	}

	// Increase the retry count
	config.__retryCount += 1;
	config.retry += 1 //去掉则不会无限循环
	// Create new promise to handle exponential backoff
	var backoff = new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, config.retryDelay || 1);
	});

	// Return the promise in which recalls axios to retry the request
	return backoff.then(function() {
		return axios(config);
	});

  }


});

  function axiosApi(url, option, method = 'post', stopLogin = false) {
	let promise;

	promise = new Promise((resolve, reject) => {

  		if(method != 'post') {
  			option.data = {};
  		}

			if(option.data) {       //php接口
        option.headers = {
    			'Content-Type': 'application/json'  //php 接口
    		}

			} else {              //java接口

        option.headers = {
  				'Content-Type': 'multipart/form-data' //java 接口
  			}
				option.params.m = '123' //m值
				//   var key="cssH5-8149537095"
				//   option.params.m = md5(key+md5(JSON.stringify(option.params)));
				let formdata = new FormData();
				formdata.append('json', JSON.stringify(option.params));
				option.data = formdata;
				option.params = null;
			}



    let obj = Object.assign({
			method,
			url,
		}, option)

		axios(obj).then((response) => {
      if(response.data.q.s==1106){
				router.replace({
           name:"Home"
				})

			}else{
				resolve(response.data)
			}


		}).catch((err) => {

			reject(err)
		})
	})
	return promise;
}
let ApiList={
  UserLogin({
    name,
    pwd,
    code
  }) {
    return axiosApi(devUrl + 'XX/XX', {
      data: {   //php接口为data  java为params
        'n': 'XX',
        "s": "",
        "q": {
          name,
          pwd,
          code
        }
      }

    })

  }
}



export default ApiList;
