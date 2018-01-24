/* eslint-disable */
import axios from 'axios'
import serialize from './serialize'

const serverURL = process.env.SERVER_API;

export default function(setting){

	let settings = setting || {};
  	let contentType = ''
	if (settings.dataType && settings.dataType.toLocaleLowerCase() == 'json'){
		contentType = 'application/json;charset=utf-8'
	}
	
	// 创建一个请求实例
	const instance = axios.create({
	    baseURL: serverURL,
	    timeout: settings.timeout || 20000,
	    responseType: 'json',
	    validateStatus: function(status){
	    	return status >= 200 && status < 300;//默认
	    },
  		headers: {'Content-Type': contentType || 'application/x-www-form-urlencoded;charset=utf-8'}
	});
	
	// 添加请求拦截器
	instance.interceptors.request.use(
	  	function(config) {
		   	
		   	// 此处自动序列化数据类型
		    if (config.headers['Content-Type']=='application/json;charset=utf-8'){
		    	
		    	config.data = JSON.stringify(config.data)
		    }else{
		    	config.data = serialize(config.data)
		    }
			
			const logTextArray = [config.method, config.url, config.data || 'null', config.headers['Content-Type']];
			console.log('京喜多:request.js 请求拦截=====> '+ logTextArray.join(' | '))
			
		    return config
	  	},
	  	function(error) {
		    Promise.reject(error)
	  	}
	);
	
	// 添加响应拦截器
	instance.interceptors.response.use(function (response) {

	    const logTextArray = [response.config.method, response.status, response.config.url, JSON.stringify(response.data)];
	    // 打印响应数据
	    console.log('京喜多:request.js 响应拦截=====> ' + logTextArray.join(' | '));
	    
	    if (response.data){
	    	
	    	// 处理未返回0000情况下，msga为空
	    	if (response.data.code && response.data.code !== '0000' && response.data.msg === ''){
	    		response.data.msg = '请求失败，错误信息未知';
	    	}
	    	
	    	return response.data;
	    }else{
	    	Promise.reject('serverError: 未返回数据');
	    }
  	}, function (error) {
  		
	    // Do something with response error
		if(error.response){
            //存在请求，但是服务器的返回一个状态码
            //他们都在2xx之外
            //console.log(error.response.data);
            //console.log(error.response.status);
            //console.log(error.response.headers);
            //alert(error.message+'['+error.response.status+']');
            switch (error.response.status) {
		      	case 400:
			        error.message = '请求错误'
			        break
		      	case 401:
					error.message = '未授权，请登录'
					break
				case 403:
					error.message = '拒绝访问'
					break
				case 404:
					error.message = `请求地址出错: ${err.response.config.url}`
					break
				case 408:
					error.message = '请求超时'
					break
				case 500:
					error.message = '服务器内部错误'
					break
				case 501:
					error.message = '服务未实现'
					break
				case 502:
					error.message = '网关错误'
					break
				case 503:
					error.message = '服务不可用'
					break
				case 504:
					error.message = '网关超时'
					break
				case 505:
					error.message = 'HTTP版本不受支持'
					break
				default:
		    }
        }else{
            //一些错误是在设置请求时触发的
            if (error.message.indexOf('timeout')>-1){
            	error.message = '请求超时';
            }
        }
		
	    return Promise.reject(error);
  	});
  
	return instance
}