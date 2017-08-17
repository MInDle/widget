var RequestAjax = require('./request_ajax');

module.exports = (function(){
	
	// tm좌표 요청 파라미터 (등읍면 이름 사용)
	const requestTmCoordinatesParam = {
			umdName : ''
	};
	
	// 근접 측정소 요청 파라미터 (tm좌표 사용)
	const requestAdjacentStationParam = {
			tmX : '',
			tmY : ''
	};
	
	// 대기정보 요청 파라미터 (측정소 이름 사용)
	const requestAirParam = {
			numOfRows : 10,
			pageNo : 1,
			stationName : '',
			dataTerm : 'DAILY',
			ver : 1.3
	};
	
	function RequestAir(){
	}
	
	const reuqestAir = new RequestAir();
	let currentLocation;
		
	// tm좌표 응답값 설정
	RequestAir.prototype.setTmCoordinates = function(item){
		
		// 유사도가 가장 높은 카운트
		let maxCount = 0;
		
		// 현재 응답값의 유사도 카운트 
		let tmpCount = 0;
		let that;
		
		// 응답값으로 온 시도, 시군구, 동읍면 중  현재 지역과 가장 유사도가 높은 tm좌표 설정
		$(item).each(function(){
			tmpCount = 0;
			that = $(this);
			
			if(that.find('sidoName').text().indexOf(currentLocation.sidoName) != -1){
				tmpCount++;
				
				if(that.find('sggName').text().indexOf(currentLocation.sggName) != -1){
					tmpCount++;
					
					if(that.find('umdName').text().indexOf(currentLocation.umdName) != -1){
						tmpCount++;
					}
				}
			}
			
			// 현재 응답값이 유사도가 가장 높을 경우 tm좌표 갱신
			if(tmpCount > maxCount){
				maxCount = tmpCount;
				requestAdjacentStationParam.tmX = that.find('tmX').text();
				requestAdjacentStationParam.tmY = that.find('tmY').text();
			}
		});
		
	}
	
	// 근접 측정소 응답값 설정
	RequestAir.prototype.setAdjacentStation = function(item){
		currentLocation.stationName = $(item[0]).find('stationName').text();
	}

	// 대기정보 요청
	function requestAirInfo(locationInfo){
		
		// 현재 지역 측정소 이름이 없을 경우에만, 주소값 -> tm좌표 -> 근접 측정소 요청
		if(!locationInfo.stationName){
			currentLocation = locationInfo;
			
			// 현재 지역(동읍면 이름 기준) tm좌표값 요청
			requestTmCoordinatesParam.umdName = currentLocation.umdName;
			request(requestTmCoordinatesParam, reuqestAir, RequestAjax.getRequestType().tmCoordinates);
			
			// tm좌표에 근접한 측정소 요청
			request(requestAdjacentStationParam, reuqestAir, RequestAjax.getRequestType().adjacentStation);
		}
		
		// 실시간 측정소 측정값 요청
		requestAirParam.stationName = currentLocation.stationName;
		request(requestAirParam, currentLocation, RequestAjax.getRequestType().currentAir);
	}
	
	function request(param, responseObj, requestType){
		RequestAjax.request(param, RequestAjax.setAirResponse, responseObj, requestType, false);
	}
	
	return {
		requestAirInfo : requestAirInfo
	};
	
}());
