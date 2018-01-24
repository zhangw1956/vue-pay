/* eslint-disable */
export default function(_object){
		
	if (_object){
		
		var _array = [];
		
		for (var i in _object){
			_array.push(i + '=' + _object[i]);
		}
		
		return _array.join('&');
	}else{
		
		return '';
	}
}