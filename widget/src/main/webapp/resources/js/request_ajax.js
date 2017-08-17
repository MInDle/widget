//const RequestWeather2 = require('./request_weather');
//const RequestAir2 = require('./request_air');
//const Locations2 = require('./locations');

//console.log(RequestWeather2, RequestAir2, Locations2);

module.exports = (function(){
	
	function Enum() {
	}

	//날씨 API 요청 타입 현재, 예보
	Enum.RequestType = {
		forecast : 0,
		current : 1,
		tmCoordinates : 2,
		adjacentStation : 3,
		currentAir : 4,
		minMax : 5,
		error : 6
	};
	
	function getRequestType(){
		return Enum.RequestType;
	}
	
	// 컨트롤러에 요청하는 함수, 전송할 파라미터, 콜백함수, 응답값저장 객체, 요청타입 등..
	function request(param, callBack, responseObj, requestType, isAsync){	
		let requestUrl;
		let dataType = '';
		
		if (isAsync !== false) {
			isAsync = true;
		}
		
		// 현재, 예보, 대기에 따라 요청 컨트롤러 설정
		switch (requestType) {
		case Enum.RequestType.current:
			requestUrl = currentController;
			break;
		case Enum.RequestType.forecast:
			requestUrl = forecastController;
			break;
		case Enum.RequestType.minMax:
			requestUrl = forecastController;
			break;
		case Enum.RequestType.tmCoordinates:
			requestUrl = tmCoordinatesController;
			dataType = 'XML';
			break;
		case Enum.RequestType.adjacentStation:
			requestUrl = adjacentStationController;
			dataType = 'XML';
			break;
		case Enum.RequestType.currentAir:
			requestUrl = currentAirController;
			dataType = 'XML';
			break;
		default:
		}
		
		if(requestUrl){
			$.ajax({
				url : requestUrl,
				type : 'GET',
				data : param,
				async : isAsync,
				dataType : dataType,
				success : function(response) {
					callBack(responseObj, requestType, response);
				},
				error : function(error) {
					console.log('ajax) api request error', error);
					
					// 에러가 발생할 경우 요청 타입을 error로 변경하여 콜백함수 호출
					callBack(callBackObj, Enum.RequestType.error);
					
				}
			});
		}
	}
	
	// 날씨관련 요청 콜백 함수
	function setWeatherResponse(responseObj, requestType, response){
		
		const weather = responseObj.weather;
		let func;
		
		if(!weather){
			return;
		}
		
		switch(requestType){
		case Enum.RequestType.current:
			func = weather.setCurrentResponse;
			break;
		case Enum.RequestType.forecast:
			func = weather.setForecastResponse;
			break;
		case Enum.RequestType.minMax:
			func = weather.setMinMaxTemp;
			break;
		case Enum.RequestType.error: // 에러일 경우 데이터 갱신 기준이 되는 날짜, 시간값 null
			callBackObj.time = null;
			callBackObj.date = null;
			break;
			default:
		}
		
		if(func){
			func.apply(weather, [$.parseJSON(response).response.body.items.item]);
		} else {
			console.log('is not a function');
		}
		
	}
	
	// 대기관련 요청 콜백함수
	function setAirResponse(responseObj, requestType, response){
		
		let func;
		
		switch(requestType){
		case Enum.RequestType.currentAir:
			responseObj = responseObj.air;
			func = responseObj.setAirResponse;
			break;
		case Enum.RequestType.tmCoordinates:
			func = responseObj.setTmCoordinates;
			break;
		case Enum.RequestType.adjacentStation:
			func = responseObj.setAdjacentStation;
			break;
		case Enum.RequestType.error: // 에러일 경우 데이터 갱신 기준이 되는 측정소값 null
			responseObj.stationName = null;
			break;
			default:
		}
		
		if(func){
			func.apply(responseObj, [$(response).find('response').find('body').find('items').find('item')]);
		} else {
			console.log('is not a function');
		}
	}
	
	return {
		request: request,
		getRequestType : getRequestType,
		setWeatherResponse : setWeatherResponse,
		setAirResponse : setAirResponse
	};
}());