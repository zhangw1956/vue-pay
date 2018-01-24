/* eslint-disable */
export default () => {
	  const userAgent = navigator.userAgent.toLowerCase()
	  console.log(userAgent);
	  if(userAgent.match(/MicroMessenger/i) == 'micromessenger'){
	    	return 'wx';
	  }else if (userAgent.match(/Alipay/i) == 'alipay') {
	    	return 'ali';
	  }else {
	  		return 'ot'
	  }
}
