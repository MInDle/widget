
const Locations = require('./locations');
//var reuqestWeather = 

module.exports = (function(){
	
	function weatherInfoEvent(event){
		const id = event.target.id;
		
		switch(id){
		case 'more_info_btn':
			
			break;
		case 'btn_pre':
			
			break;;
		case 'btn_next':
			
			break;
		case 'cur_location_name':
			
			break;
		}
	}
	
	//지역설정뷰 -> 날씨뷰, 사용자가 설정한 지역순서 설정
	function switchLocationToWeather() {

		// 사용자가 설정한 지역 순서의 고유키 리스트 
		const newNameList = $('#location_name_group .blind')
		let len = newNameList.length;

		// 설정 전 지역 정보 순서 리스트 복사
		const tmpLocationInfoArray = [ ...Locations.getLocationInfoArray()]; //locationInfoArray.slice(0);
		let tmp = null;

		// 키값을 사용해서 사용자가 설정한 순서대로 locationInfoArray에 지역정보 재배열
		for (let i = 0; i < len; i++) {
			tmp = null;
			for (let j = 0; j < len; j++) {

				// 변경 후 순서의 지역 고유키와 변경전 지역 고유키 값이 같으면 
				if (newNameList[i].innerText == tmpLocationInfoArray[j].key) {
					tmp = tmpLocationInfoArray[j];
					break;
				}
			}
			Locations.setLocationInfo(i, tmp);
		}

		$('#location_info').hide();
		Locations.resetLocation(0);
	}

	//날씨뷰 -> 지역설정뷰, 현재 지역순서 뷰에 설정
	function switchWeatherToLocation() {
		const locationInfoArray = Locations.getLocationInfoArray();
		const len = locationInfoArray.length;
		let name = '';
		let index = '';
	
		// 지역설정 뷰에 순서번호와 지역이름을 설정한다.
		for (let i = 0; i < len; i++) {
			index += '<li class="location_index">' + (i + 1) + '번 </li>';
			name += '<li><a class="location_name">' + locationInfoArray[i].name + '</a><span class="blind">' + locationInfoArray[i].key + '</span></li>';

		}
		
		$('#locatin_index_group').empty().html(index);
		$('#location_name_group').empty().html(name);

//		$('#locatin_index_group').html(index);
//		$('#location_name_group').html(name);

		checkMoreInfo();
		$('#weather_info').hide();
		$('#location_info').show();
	}
	
	// 지역 이동
	function moveLocation(event){
		let id = event.target.id;
		let value;
		
		switch(id){
		case 'btn_pre':
		case 'ico_pre':
			value = -1;
			break;
		case 'btn_next':
		case 'ico_next':
			value = 1;
			break;
			default:
		}
		
		if(value){
			Locations.resetLocation(value);
			checkMoreInfo();
		}
	}

	// 간단예보 활성화 <-> 비활성화
	function toggleMoreInfo() {
		const moreInfo = $('#more_info');
		const moreInfoBtn = $('#more_info_btn');

		moreInfo.slideToggle(150, function() {
			moreInfoBtn.toggleClass('more_info_toggle');
		});
	}

	//간단예보 활성화 상태일경우 비활성화로 설정한다.
	function checkMoreInfo() {
		if ($('#more_info').css('display') === 'block') {
			toggleMoreInfo();
		}
	}

	// 대기 <-> 날씨 상세 정보 전환
	function showDetail(event){
		const id = event.target.id;
		
		switch(id){
		case 'cur_rain_per_p':
		case 'cur_rain_per':
			$('#fine_dust_p').toggle();
			$('#weather_detail').toggle();
			break;
		case 'fine_dust_p':
		case 'fine_dust':
			$('#cur_rain_per_p').toggle();
			$('#air_detail').toggle();
			break;
			default:
		}
		
	}
	
	// 간단예보, 예보 타입 선택
	function selectForecastType(event){
		const targetEl = $('#' + event.target.id);
		
		const parentId = targetEl[0].parentNode.id;
		const elements = $('#' + parentId + ' > a');
		elements.removeClass('sel_forecast_type').addClass('forecast_type');
//		elements.addClass('forecast_type');
		
		targetEl.removeClass().addClass('sel_forecast_type');
		Locations.getCurrentInfo().weather.setForecastChart(event.target.id);
	}
	
	// 에러뷰에서 재요청
	function retryRequest(){
		Locations.resetLocation();
	}
	
	return {	
		switchLocationToWeather : switchLocationToWeather,
		switchWeatherToLocation : switchWeatherToLocation,
		moveLocation : moveLocation,
		toggleMoreInfo : toggleMoreInfo,
		checkMoreInfo : checkMoreInfo,
		selectForecastType : selectForecastType,
		showDetail : showDetail,
		retryRequest : retryRequest
	}
}());
