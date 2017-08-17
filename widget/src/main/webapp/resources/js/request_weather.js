
const RequestAjax = require('./request_ajax');
const moment = require('moment');
//const Constant = require('./constant');

module.exports = (function() {

	//요청 파라미터 값 저장 객체
	const requestParam = {
		base_date : '',
		base_time : '',
		nx : '',
		ny : '',
		numOfRows : 200,
		pageNo : 1,
		_type : 'json'
	};

	//현재 시간을 기준으로 바로 이전 발표시간을 정한다.
	 function setBasehour() {
		let result = null;

		// 현재 시간
		const hours = requestParam.base_time;

		// 발표시간 목록
		const baseHours = [ '0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300' ];
		const size = baseHours.length;

		for (let i = 0; i < size; i++) {
			if (baseHours[i] <= hours) {
				result = baseHours[i];
			}
		}

		// 없을 경우 가장 작은 발표시간값으로 설정
		if (!result) {
			result = '0200';
		}
		requestParam.base_time = result;
	}

	//현재 날짜, 시간 정보를 설정, 시간 변경여부 리턴
	function setCurrentDateTime(locationInfo) {
		const currentDateTime = moment().locale('ko');
		const formatWidgetDate = 'MM.DD.';
		const formatWidgetDay = '(dd)';
		const formatWidgetTime = 'HH시';
		const formatDate = 'YYYYMMDD';
		const formatTime = 'HH00';
		let tmpDate = '';
		let tmpTime = '';
		
		// 시간 값이 바뀌었을 경우 true 새로운 요청 여부 결정
		let isNewTime = false;
		
		if(currentDateTime.format('mm') < 30){
			currentDateTime.add(-1, 'hours');
		}

		tmpDate = currentDateTime.format(formatDate);
		tmpTime = currentDateTime.format(formatTime);

		// 날짜가 바뀌었을 경우에만 날짜를 갱신하고, 당일 최저, 최고기온을 갱신 시킨다.
		if (locationInfo.date !== tmpDate) {
			console.log('new date');
			locationInfo.date = tmpDate
			requestParam.base_date = tmpDate;
			$('#current_date').html(currentDateTime.format(formatWidgetDate));
			requestMinMaxTemp(locationInfo);
		}

		// 시간이 바뀌었을 경우에만 시간값을 갱신하고, 현재 지역의 새로운 요청 여부를 결정한다.
		if (locationInfo.time !== tmpTime) {
			isNewTime = true;
			$('#current_day').html(currentDateTime.format(formatWidgetDay));
			$('#current_hours').html(currentDateTime.format(formatWidgetTime));
			locationInfo.time = tmpTime;
			requestParam.base_time = tmpTime;
		}

		return isNewTime;
	}
	
	function requestMinMaxTemp(locationInfo){
		
		// 최저 기온과 최고기온은  02시 발표 데이터 사용
		requestParam.base_time = '0200';
		request(RequestAjax.getRequestType().minMax, locationInfo);
	}

	function requestWeatherInfo(locationInfo) {
		
		// 시간값 변동 여부
		let isNew; 
		
		//api에서 사용할 지역과 위젯의 지역 정보를 설정한다.
		requestParam.nx = locationInfo.nx;
		requestParam.ny = locationInfo.ny;
		
		isNew = setCurrentDateTime(locationInfo);
		
		if(isNew){
			request(RequestAjax.getRequestType().current, locationInfo);
			
			setBasehour(locationInfo);
			request(RequestAjax.getRequestType().forecast, locationInfo);
		}
		
		return isNew
	}
	
	function request(requestType, locationInfo){
		RequestAjax.request(requestParam, RequestAjax.setWeatherResponse, locationInfo, requestType, false);
	}

	return {
		requestWeatherInfo : requestWeatherInfo,
		requestParam : requestParam
	};

}());
