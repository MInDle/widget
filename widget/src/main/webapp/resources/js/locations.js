var LocationInfo = require('./location_info');
const RequestWeather = require('./request_weather');
const RequestAir = require('./request_air');

module.exports = (function() {

	//등록된 지역 정보
	const locationInfoArray = [
		new LocationInfo('서울', '종로구', '평창동', 60, 127, 100),
		new LocationInfo('', '성남시 분당구', '정자동', 62, 122, 200),
		new LocationInfo('제주', '제주시', '우도면', 60, 38, 300),
		new LocationInfo('부산', '중구', '남포동', 97, 74, 400),
		new LocationInfo('광주', '북구', '용봉동', 59, 75, 500),
	];

	//현재 지역 인덱스
	let currentLocationIndex = 0;

	//지역 총 갯수
	const MAX_LOCATION = locationInfoArray.length;

	// num값을 통해 지역 인덱스 설정
	function setIndex(num) {
		
		// num 값이 존재할 때만 현재 지역 인덱스 설정, 존재하지 않을 경우 그대로 사용
		if(num){
			if(num === 0){
				currentLocationIndex = 0;
			} else {
				let tmp = currentLocationIndex + num;
				if (tmp < 0) {
					tmp = MAX_LOCATION - 1;
				}
				
				currentLocationIndex = Math.abs(tmp % MAX_LOCATION);
			}
		}
	}
	
	function getLocationInfoArray(){
		return locationInfoArray;
	}
	
	function setLocationInfo(index, info){
		locationInfoArray[index] = info;
	}

	function getCurrentInfo() {
		return locationInfoArray[currentLocationIndex];
	}
	
	function setMaxLocation(){
		$('#total_loc_cnt').html(MAX_LOCATION);
	}

	//지역변경에 따라 날씨, 대기 정보를 업데이트 한다.
	function resetLocation(num) {
		// 현재 지역 저장 변수
		let current;
		
		// 위젯 엘리먼트
		const weatherInfoEl = $('#weather_info');
		
		// 에러 엘리먼트
		const errorEl = $('#error');
		
		weatherInfoEl.hide();
		
		// 현재 지역 인덱스 설정
		setIndex(num);
		current = locationInfoArray[currentLocationIndex];

		$('#cur_loc_index').html(currentLocationIndex + 1);

		$('#cur_location_name').html(current.name);

		// 날씨, 대기 정보 요청 (시간값이 바뀌었을경우, 측정소가 없을 경우 재요청)
		if(RequestWeather.requestWeatherInfo(current) || !current.stationName){
			RequestAir.requestAirInfo(current);
		}
		
		// 요청 에러여부 검사
		if(isError(current)){
			errorEl.show();
		} else {
			
			// 위젯에 날씨정보를 설정한다.
			current.weather.setWeatherInfo();
			
			// 위젯에 대기정보를 설정한다.
			current.air.setAirInfo();
			
			weatherInfoEl.show();
			errorEl.hide();
			
			console.log(locationInfoArray);
		}
		
	}
	
	// 현재 지역의 날짜, 시간, 측정소 데이터로 요청 에러여부 검사
	function isError(current){
		let result = false;
		
		// 날씨 요청의 경우 날짜와 시간 값이 존재 해야하고, 대기요청의 경우 측정소 값이 존재해야 정상
		if(!current.time || !current.date || !current.stationName){
			result = true;
		}
		
		return result;
	}

	return {
		getCurrentInfo : getCurrentInfo,
		setIndex : setIndex,
		resetLocation : resetLocation,
		getLocationInfoArray : getLocationInfoArray,
		setLocationInfo : setLocationInfo,
		setMaxLocation : setMaxLocation
	};
	
}());