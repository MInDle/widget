var Event = require('./event');
var Locations = require('./locations');
//var $ = require('jquery');

//날씨 위젯 초기 설정
module.exports = (function() {

	function initWeatherWidget(){
		
		// 간단에보 버튼을 눌렀을 때, 간단예보를 내려준다.
		$('#weather_info').on('click', '#more_info_btn', Event.toggleMoreInfo);
		
		// 지역이동 버튼
		$('#weather_info').on('click', '#btn_pre, #btn_next', Event.moveLocation)

		// 날씨 뷰에서 지역 이름을 누르면 지역설정 뷰로 전환
		$('#weather_info').on('click', '#cur_location_name', Event.switchWeatherToLocation);

		// 대기 <-> 날씨 상세정보 보이게
		$('#weather_info').on('mouseover mouseout', '#weather_text > p', Event.showDetail);
		
		// 간편 예보에서 예보 타입 선택
		$('#more_info').on('click', '#forecast_types > a', Event.selectForecastType);
		
		// 지역설정 뷰에서 뒤로가기 버튼을 누르면 날씨 뷰로 전환
		$('#location_info').on('click', '#location_close', Event.switchLocationToWeather);

		// 지역설정 순서 드래그엔 드롭
		$('#location_name_group').sortable({
			axis : 'y',
			containment : '#location_list',
			scroll : false,
		});
		
		$('#error').on('click', '#error_retry', Event.retryRequest);

		// 지역 총 수 설정
		Locations.setMaxLocation();

		// 초기지역설설정
		Locations.resetLocation(0);
		
	}
	
	return {
		initWeatherWidget : initWeatherWidget
	};
	
}());