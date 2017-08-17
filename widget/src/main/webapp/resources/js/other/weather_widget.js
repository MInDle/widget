//날씨 위젯 초기 설정
function initWeatherWidget() {

	// 간단에보 버튼을 눌렀을 때, 간단예보를 내려준다.
	$('#more_info_btn').on('click', toggleMoreInfo);

	// 이전 지역
	$('#btn_pre').on('click', movePreLocation);

	// 다음 지역
	$('#btn_next').on('click', moveNextLocation);

	// 예보 시간 바꾸기
	$('#move_forecast_weather').on('click', switchForecast);

	// 날씨 뷰에서 지역 이름을 누르면 지역설정 뷰로 전환
	$('#cur_location_name').on('click', switchWeatherToLocation);

	// 지역설정 뷰에서 뒤로가기 버튼을 누르면 날씨 뷰로 전환
	$('#location_close').on('click', switchLocationToWeather);

	// 지역설정 순서 드래그엔 드롭
	$('#location_name_group').sortable({
		axis : 'y',
		containment : '#location_list',
		scroll : false,
	});

	// 지역 총 수 설정
	$('#total_loc_cnt').html(MAX_LOCATION);

	// 초기지역설설정
	resetLocation(currentLocationIndex);
}










//지역정보 저장  이름, 위치, 날씨정보 날짜, 시간, 날씨정보, 지역고유키
function LocationInfo(name, nx, ny, key) {
	this.name = name;
	this.nx = nx;
	this.ny = ny;
	this.date = null;
	this.time = null;
	this.key = key;
	this.weather = new WeatherInfo;
}

//등록된 지역 정보
const locationInfoArray = [
	new LocationInfo('서울시 종로구 평창동', 60, 127, 100),
	new LocationInfo('성남시 분당구 정자1동', 62, 122, 200),
	new LocationInfo('제주도 제주시 우로면', 60, 38, 300),
	new LocationInfo('부산시 중구 남포동', 97, 74, 400),
	new LocationInfo('광주시 북구 용봉동', 59, 75, 500),
];

// 하나의 예보 정보를 저장하는 객체
function ForecastInfo(dateTime, category, value) {

	// 예보 날짜 + 시간
	this.dateTime = dateTime;

	// 예보 종류
	this.category = category;

	// 예보 값
	this.value = value;
}

//위젯에서 표현하는 날씨 정보 객체
function WeatherInfo() {

	// 예보 날씨 정보 종류를 각 ForecastInfo 객체  배열 형식으로 저장
	this.forecastCategory = {
		POP : [], // 강수확률
		PTY : [], // 강수형태
		R06 : [], // 6시간 강수량
		REH : [], // 습도
		S06 : [], // 6시간 적설량
		SKY : [], // 하늘상태
		T3H : [], // 3시간 기온
		TMN : [], // 아침 최저기온
		TMX : [], // 낮 최고기온
		UUU : [],
		VVV : [],
		WAV : [],
		VEC : [], // 풍향
		WSD : [] // 풍속
	};

	this.curTemp = null; // 현재 기온
	this.windSpeed = null; // 현재 풍속
	this.rainAmount = null; // 현재 강수량
	this.humidify = null; // 현재 습도
	this.currentSky = null; // 현재 하늘상태
	this.rainPer = null; // 현재 강수확률
	this.maxTemp = null; // 금일 최고 기온
	this.minTemp = null; // 금일 최저 기온

	// 예보 시간 인덱스
	this.forecastIndex = 0;

	// 현재 시간을 기준으로 더해질 예보 시간 값
	this.forecastGap = [ 300, 600, 900, 1200, 1500, 1800, 2100, 2400 ];

	this.setCurrentMinTemp = function(minTemp) {
		if (minTemp !== undefined) {
			this.minTemp = minTemp;
		}
	}

	this.setCurrentMaxTemp = function(maxTemp) {
		if (maxTemp !== undefined) {
			this.maxTemp = maxTemp;
		}
	}

	this.setCurrentRainPer = function() {
		console.log(this.forecastCategory['POP']);
		this.rainPer = this.forecastCategory['POP'][0].value;
		$('#cur_rain_per').html(this.rainPer);
	}

	this.setCurrentSky = function(currentSky) {
		if (currentSky !== undefined) {
			this.currentSky = currentSky;
		}
	}

	this.setCurTemp = function(curTemp) {
		if (curTemp !== undefined) {
			this.curTemp = curTemp;
		}
	}

	this.setWindSpeed = function(windSpeed) {
		let windStr;

		if (windSpeed !== undefined) {
			this.windSpeed = windSpeed;
		}

		// 풍속 설명 설정
		if (this.windSpeed < 4) {
			windStr = '바람약함';
		} else if (this.windSpeed < 9) {
			windStr = '바람약간강함';
		} else if (this.windSpeed < 14) {
			windStr = '바람강함'
		} else {
			windStr = '바람매우강함';
		}

		$('#wind_speed').html(this.windSpeed);
		$('#wind_exp').html(windStr);
	}


	this.setRainAmount = function(rainAmount) {
		if (rainAmount !== undefined) {
			this.rainAmount = rainAmount;
		}
	}

	this.setHumidify = function(humidify) {
		let humStr;

		if (humidify !== undefined) {
			this.humidify = humidify;
		}

		// 습도 설명 설정
		if (this.humidify < 40) {
			humStr = '건조';
		} else if (this.humidify <= 60) {
			humStr = '쾌적';
		} else {
			humStr = '다습';
		}

		$('#humidify').html(this.humidify);
		$('#humidify_exp').html(humStr);
	}

	// 하늘상태, 강수확률, 강수량을 통해 날씨 이미지를 정한다.
	this.setWeatherImage = function(id, sky, rainPer, rainAmount) {
		let imgNum = 0;

		switch (sky + '') {
		case '1': // 맑음
			if (rainPer <= 50) {
				imgNum = 1;
			} else {
				imgNum = 27;
			}
			break;
		case '2': // 구름 조금
			if (rainPer <= 50) {
				imgNum = 3;
			} else {
				imgNum = 22;
			}
			break;
		case '3': // 구름많음
			if (rainPer <= 50) {
				imgNum = 5;
			} else if (rainPer <= 70) {
				imgNum = 25;
			} else {
				imgNum = 22;
			}
			break;
		case '4': // 흐림
			if (rainPer <= 50) {
				imgNum = 7;
			} else {
				if (rainAmount < 1) {
					imgNum = 8;
				} else if (rainAmount <= 20) {
					imgNum = 9;
				} else if (rainAmount <= 70) {
					imgNum = 10;
				} else {
					imgNum = 15;
				}
			}
			break;
		default:
			imgNum = 25;
		}

		$(id).removeClass();
		if (imgNum < 10) {
			imgNum = '0' + imgNum;
		}

		$(id).addClass('thumb_lg ico_w' + imgNum);
	}

	// forecastCategory의 key 배열에서 예보시간이 dateTime인 값을 리턴한다.
	this.getDateTimeValue = function(key, dateTime) {
		const array = this.forecastCategory[key];
		let len = array.length;

		// 예보시간이 dateTime인 값, 없을 경우 dateTime보다 작으면서 가장 큰 값
		let value = null;

		for (let i = 0; i < len; i++) {

			// dateTime보다 작으면서 가장 큰 값
			if (array[i].dateTime < dateTime) {
				value = array[i].value;
			}

			// dateTime과 같은 값
			if (array[i].dateTime == dateTime) {
				value = array[i].value;
				break;
			}
		}

		// 존재하지 않을 경우에는 배열의 첫 예보 값
		if (!value) {
			value = array[0].value;
		}

		return value;
	}

	// 한 지역의 현재, 예보를 포함한 전체 날씨 정보 위젯에 설정
	this.setWeatherInfo = function() {
		this.setCurrentRainPer();
		this.setWindSpeed();
		this.setHumidify();
		$('#min_temp').html(this.minTemp);
		$('#max_temp').html(this.maxTemp);
		$('#temp_current').html(this.curTemp);
		$('#rain_amount').html(this.rainAmount);

		this.setWeatherImage('#cur_weather_img', this.currentSky, this.rainPer, this.rainAmount);

		// 예보 정보 설정
		this.forecastIndex = -1;
		this.nextForecastIndex(1);
	}

	// 예보 날짜 시간 설정
	this.getForecastDateTime = function(gap) {
		let len = this.forecastCategory['POP'].length;
		let tmpHours = (parseInt(requestParam.base_time, 10) + gap); //forecastGap);
		let tmpDate = requestParam.base_date;
		let isNext = '오늘';
		let dateTime = '';

		if (tmpHours >= 2400) {
			tmpDate = (parseInt(tmpDate, 10) + 1) + '';
			tmpHours %= 2400;
		}
		tmpHours = tmpHours < 1000 ? '0' + tmpHours : tmpHours + '';
		tmpDate += tmpHours;

		for (let i = 0; i < len; i++) {
			dateTime = this.forecastCategory['POP'][i].dateTime;
			if (tmpDate <= dateTime) {
				break;
			}
		}

		if (dateTime.slice(0, 8) != requestParam.base_date) {
			isNext = '내일 ';
		}

		return {
			dateTime : dateTime,
			isNext : isNext
		};

	}
	
//	this.setForcastValue = function({dateTime, isNext}, img, hours, temp, rainPer, windSpeed, humidify, rainAmount){
//		console.log(dateTime, isNext);
//		this.setWeatherImage(img, this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
//		$(hours).html(isNext + dateTime.slice(8, 10));
//		$(temp).html(this.getDateTimeValue('T3H', dateTime));
//		$(rainPer).html(this.getDateTimeValue('POP', dateTime));
//		$(windSpeed).html(this.getDateTimeValue('WSD', dateTime));
//		$(humidify).html(this.getDateTimeValue('REH', dateTime));
//		$(rainAmount).html(this.getDateTimeValue('R06', dateTime));
//	}

	// 현재 시간으로 부터 gap시간후 예보정보 위젯에 설정
	this.setForecastWeatherInfo = function(gap) {
		let {dateTime, isNext} = this.getForecastDateTime(gap);

		this.setWeatherImage('#forecast_weather_img', this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
		$('#forecast_hours').html(isNext + dateTime.slice(8, 10));
		$('#temp_forecast').html(this.getDateTimeValue('T3H', dateTime));
		$('#forecast_rain_per').html(this.getDateTimeValue('POP', dateTime));
		$('#forecast_wind_speed').html(this.getDateTimeValue('WSD', dateTime));
		$('#forecast_humidify').html(this.getDateTimeValue('REH', dateTime));
		$('#forecast_rain_amount').html(this.getDateTimeValue('R06', dateTime));
	}

	// 현재 시간으로 부터 gap시간후  다음 예보정보 위젯에 설정
	this.setNextForecastWeatherInfo = function(gap) {
		let {dateTime, isNext} = this.getForecastDateTime(gap);

		this.setWeatherImage('#next_forecast_weather_img', this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
		$('#next_forecast_hours').html(isNext + dateTime.slice(8, 10));
		$('#temp_next_forecast').html(this.getDateTimeValue('T3H', dateTime));
		$('#next_forecast_rain_per').html(this.getDateTimeValue('POP', dateTime));
		$('#next_forecast_wind_speed').html(this.getDateTimeValue('WSD', dateTime));
		$('#next_forecast_humidify').html(this.getDateTimeValue('REH', dateTime));
		$('#next_forecast_rain_amount').html(this.getDateTimeValue('R06', dateTime));
	}

	// 예보 인덱스 설정에 따른 예보 시간 설정
	this.nextForecastIndex = function(num) {
		let len = this.forecastGap.length;

		if ((this.forecastIndex += num) >= len - 1) {
			this.forecastIndex = 0;
		}

		if (this.forecastIndex < 0) {
			this.forecastIndex = len - 2;
		}
		
//		this.setForcastValue(this.getForecastDateTime(this.forecastGap[this.forecastIndex]), '#forcast_weather_img', '#forcast_hours', '#temp_forcast', '#forcast_rain_per', '#forcast_wind_speed', '#forcast_humidify', '#forcast_rain_amount');
//		this.setForcastValue(this.getForecastDateTime(this.forecastGap[++this.forecastIndex]), '#next_forcast_weather_img', '#next_forcast_hours', '#temp_next_forcast', '#next_forcast_rain_per', '#next_forcast_wind_speed', '#next_forcast_humidify', '#next_forcast_rain_amount');
		
		// 한번에 2개의 예보 시간 설정 (0 1, 2 3, ...)
		this.setForecastWeatherInfo(this.forecastGap[this.forecastIndex]);
		this.setNextForecastWeatherInfo(this.forecastGap[++this.forecastIndex]);

	}
}

function Enum() {
}

//날씨 API 요청 타입 현재, 예보
Enum.WeatherType = {
	forecast : 0,
	current : 1
};

//현재 지역 인덱스
let currentLocationIndex = 0;

//지역 총 갯수
var MAX_LOCATION = locationInfoArray.length;

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






///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////











//현재 날짜, 시간 정보를 설정, 시간 변경여부 리턴
function setCurrentDateTime() {
	const currentDate = new Date();
	const week = [ '일', '월', '화', '수', '목', '금', '토' ];
	let day = week[currentDate.getDay()];
	let year = currentDate.getFullYear();
	let month = currentDate.getMonth() + 1;
	let date = currentDate.getDate();
	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();
	let tmpDate = '';
	let tmpTime = '';

	// 시간 값이 바뀌었을 경우 true 새로운 요청 여부 결정
	let isNewTime = false;

	if (minutes < 30) {
		if ((hours -= 1) < 0) {
			hours = 23;
			currentDate.setDate(date -= 1);
			month = currentDate.getMonth() + 1;
			year = currentDate.getFullYear();
		}
	}

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (month < 10) {
		month = '0' + month;
	}
	if (date < 10) {
		date = '0' + date;
	}

	tmpDate = year + '' + month + '' + date;
	tmpTime = hours + '00';

	// 날짜가 바뀌었을 경우에만 날짜를 갱신하고, 당일 최저, 최고기온을 갱신 시킨다.
	if (locationInfoArray[currentLocationIndex].date !== tmpDate) {
		console.log('new date');
		locationInfoArray[currentLocationIndex].date = tmpDate
		requestParam.base_date = tmpDate;
		$('#current_date').html(month + '.' + date + ".");
		setMinMaxTemp();
	}

	// 시간이 바뀌었을 경우에만 시간값을 갱신하고, 현재 지역의 새로운 요청 여부를 결정한다.
	if (locationInfoArray[currentLocationIndex].time !== tmpTime) {
		isNewTime = true;
		$('#current_day').html('(' + day + ')');
		$('#current_hours').html(hours + '시');
		locationInfoArray[currentLocationIndex].time = tmpTime;
		requestParam.base_time = tmpTime;
	}

	return isNewTime;
}

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

//현재 날씨 응답값 해당 지역 weatherInfo에 저장
function setCurrentWeatherInfo(item) {
	$.each(item, function(key, value) {

		// 값 종류 (온도, 습도, 강수량 ..)
		let category = value.category;

		// 실제 값
		let realValue = value.obsrValue;

		// 응답값을 저장할 해당지역 weather 객체
		const weather = locationInfoArray[currentLocationIndex].weather;

		switch (category) {
		case 'T1H':
			weather.setCurTemp(Math.round(realValue));
			break;
		case 'RN1':
			weather.setRainAmount(realValue);
			break;
		case 'SKY':
			weather.setCurrentSky(realValue);
			break;
		case 'REH':
			weather.setHumidify(realValue);
			break;
		case 'WSD':
			weather.setWindSpeed(realValue);
			break;
		case 'PTY':

			break;
		case 'LGT':

			break;
		case 'VEC':

			break;
		default:
		}

	})
}

//예보 응답값 현재 지역 weatherInfo에 저장
function setForecastWeatherInfo(item) {
	$.each(item, function(key, value) {

		// 예보 종류 (온도, 습도, 강수량 ..)
		let category = value.category;

		// 실제 값
		let realValue = value.fcstValue;

		// 예보 날짜, 시간
		let date = value.fcstDate + '';
		let time = value.fcstTime + '';

		// category에 맞는 배열에 ForcoastInfo 객채로 만들어서 push 해준다.
		locationInfoArray[currentLocationIndex].weather.forecastCategory[category].push(new ForecastInfo(date + time, category, realValue));
	});
	console.log(locationInfoArray[currentLocationIndex].weather.forecastCategory);

}

//금일 최저, 최고 기온 요청 및 응답값 현재 지역 weatherInfo에 저장
function setMinMaxTemp() {
	const weather = locationInfoArray[currentLocationIndex].weather;

	// 최저 기온과 최고기온은  02시 발표 데이터 사용
	requestParam.base_time = '0200';

	requestWeather(function(item) {
		$.each(item, function(key, value) {

			// 날짜가 동일한 최고, 최저 기온만
			if (value.fcstDate == requestParam.base_date) {

				if (value.category === 'TMN') {
					weather.setCurrentMinTemp(value.fcstValue);
				} else if (value.category === 'TMX') {
					weather.setCurrentMaxTemp(value.fcstValue);
				}
			}
		});
	}, Enum.WeatherType.forecast, false);
}

//ajax를 통해 Controller로 현재 지역 날씨 정보 요청
function requestWeather(callBack, weatherType, isAsync) {
	let requestUrl;

	if (isAsync !== false) {
		isAsync = true;
	}

	// 현재, 예보에 따라 요청 컨트롤러 설정
	switch (weatherType) {
	case Enum.WeatherType.current:
		requestUrl = currentController;
		break;
	case Enum.WeatherType.forecast:
		requestUrl = forecastController;
		break;
	default:
	}

	//		requestUrl += $.param(requestParam);
	console.log(requestUrl);
	$.ajax({
		url : requestUrl,
		type : 'GET',
		data : requestParam,
		async : isAsync,
		//		dataType : 'json',
		success : function(result) {
			//											console.log(result);
			callBack($.parseJSON(result).response.body.items.item);

		},
		error : function(error) {
			console.log('ajax) api request error');
			console.log(error);
		}
	});
}








//지역설정뷰 -> 날씨뷰, 사용자가 설정한 지역순서 설정
function switchLocationToWeather() {

	// 사용자가 설정한 지역 순서의 고유키 리스트 
	const newNameList = $('#location_name_group .blind')
	let len = newNameList.length;

	// 설정 전 지역 정보 순서 리스트 복사
	const tmpLocationInfoArray = [ ...locationInfoArray ]; //locationInfoArray.slice(0);
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
		locationInfoArray[i] = tmp;
	}

	currentLocationIndex = 0;
	resetLocation();
	switchLocationWeatherView();
}

//날씨뷰 -> 지역설정뷰, 현재 지역순서 뷰에 설정
function switchWeatherToLocation() {
	const len = locationInfoArray.length;
	let name = '';
	let index = '';

	$('#locatin_index_group').empty();
	$('#location_name_group').empty();

	// 지역설정 뷰에 순서번호와 지역이름을 설정한다.
	for (let i = 0; i < len; i++) {
		index += '<li class="location_index">' + (i + 1) + '번 </li>';
		name += '<li><a class="location_name">' + locationInfoArray[i].name + '</a><span class="blind">' + locationInfoArray[i].key + '</span></li>';

	}
	$('#locatin_index_group').html(index);
	$('#location_name_group').html(name);

	checkMoreInfo();
	switchLocationWeatherView();
}

//다음 지역
function moveNextLocation() {
	++currentLocationIndex;
	resetLocation();
	checkMoreInfo();
}

//이전 지역
function movePreLocation() {
	if (--currentLocationIndex < 0) {
		currentLocationIndex = MAX_LOCATION - 1;
	}

	resetLocation();
	checkMoreInfo();
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

//날씨 정보 뷰 <-> 지역관련 뷰로 전환
function switchLocationWeatherView() {
	$('#weather_info').toggle();
	$('#location_info').toggle();
}

// 예보 시간 변경에 따른 예보 정보 갱신
function switchForecast(event) {
	let id = event.target.id;
	let num;

	switch (id) {
	case 'next_forecast_weather':
		num = 1;
		break;
	case 'prev_forecast_weather':
		num = -3;
		break;
	}

	if (num) {
		locationInfoArray[currentLocationIndex].weather.nextForecastIndex(num);
	}
}






//지역변경에 따라 날씨 정보를 업데이트 한다.
function resetLocation() {
	currentLocationIndex = Math.abs(currentLocationIndex % MAX_LOCATION);

	$('#cur_loc_index').html(currentLocationIndex + 1);

	//api에서 사용할 지역과 위젯의 지역 정보를 설정한다.
	requestParam.nx = locationInfoArray[currentLocationIndex].nx;
	requestParam.ny = locationInfoArray[currentLocationIndex].ny;
	$('#cur_location_name').html(locationInfoArray[currentLocationIndex].name);

	// 새로운 시간일 경우에만 날씨정보를 요청한다.
	if (setCurrentDateTime()) {
		requestWeather(setCurrentWeatherInfo, Enum.WeatherType.current, false);

		setBasehour();
		requestWeather(setForecastWeatherInfo, Enum.WeatherType.forecast, false);
		console.log(locationInfoArray[currentLocationIndex].weather);
	}

	// 위젯에 날씨정보를 설정한다.
	locationInfoArray[currentLocationIndex].weather.setWeatherInfo();

}










//this.setForcastValue(dateTime, '#forcast_weather_img', '#forcast_hours', '#temp_forcast', '#forcast_rain_per', '#forcast_wind_speed', '#forcast_humidify', '#forcast_rain_amount');
//this.setForcastValue(dateTime, '#next_forcast_weather_img', '#next_forcast_hours', '#temp_next_forcast', '#next_forcast_rain_per', '#next_forcast_wind_speed', '#next_forcast_humidify', '#next_forcast_rain_amount');
//this.setForcastValue = function(dateTime, img, hours, temp, rainPer, windSpeed, humidify, rainAmount){
//	this.setWeatherImage(img, this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
//	$(hours).html(dateTime.slice(8, 10));
//	$(temp).html(this.getDateTimeValue('T3H', dateTime));
//	$(rainPer).html(this.getDateTimeValue('POP', dateTime));
//	$(windSpeed).html(this.getDateTimeValue('WSD', dateTime));
//	$(humidify).html(this.getDateTimeValue('REH', dateTime));
//	$(rainAmount).html(this.getDateTimeValue('R06', dateTime));
//}//날씨 위젯 초기 설정
function initWeatherWidget() {

	// 간단에보 버튼을 눌렀을 때, 간단예보를 내려준다.
	$('#more_info_btn').on('click', toggleMoreInfo);

	// 이전 지역
	$('#btn_pre').on('click', movePreLocation);

	// 다음 지역
	$('#btn_next').on('click', moveNextLocation);

	// 예보 시간 바꾸기
	$('#move_forecast_weather').on('click', switchForecast);

	// 날씨 뷰에서 지역 이름을 누르면 지역설정 뷰로 전환
	$('#cur_location_name').on('click', switchWeatherToLocation);

	// 지역설정 뷰에서 뒤로가기 버튼을 누르면 날씨 뷰로 전환
	$('#location_close').on('click', switchLocationToWeather);

	// 지역설정 순서 드래그엔 드롭
	$('#location_name_group').sortable({
		axis : 'y',
		containment : '#location_list',
		scroll : false,
	});

	// 지역 총 수 설정
	$('#total_loc_cnt').html(MAX_LOCATION);

	// 초기지역설설정
	resetLocation(currentLocationIndex);
}










//지역정보 저장  이름, 위치, 날씨정보 날짜, 시간, 날씨정보, 지역고유키
function LocationInfo(name, nx, ny, key) {
	this.name = name;
	this.nx = nx;
	this.ny = ny;
	this.date = null;
	this.time = null;
	this.key = key;
	this.weather = new WeatherInfo;
}

//등록된 지역 정보
const locationInfoArray = [
	new LocationInfo('서울시 종로구 평창동', 60, 127, 100),
	new LocationInfo('성남시 분당구 정자1동', 62, 122, 200),
	new LocationInfo('제주도 제주시 우로면', 60, 38, 300),
	new LocationInfo('부산시 중구 남포동', 97, 74, 400),
	new LocationInfo('광주시 북구 용봉동', 59, 75, 500),
];

// 하나의 예보 정보를 저장하는 객체
function ForecastInfo(dateTime, category, value) {

	// 예보 날짜 + 시간
	this.dateTime = dateTime;

	// 예보 종류
	this.category = category;

	// 예보 값
	this.value = value;
}

//위젯에서 표현하는 날씨 정보 객체
function WeatherInfo() {

	// 예보 날씨 정보 종류를 각 ForecastInfo 객체  배열 형식으로 저장
	this.forecastCategory = {
		POP : [], // 강수확률
		PTY : [], // 강수형태
		R06 : [], // 6시간 강수량
		REH : [], // 습도
		S06 : [], // 6시간 적설량
		SKY : [], // 하늘상태
		T3H : [], // 3시간 기온
		TMN : [], // 아침 최저기온
		TMX : [], // 낮 최고기온
		UUU : [],
		VVV : [],
		WAV : [],
		VEC : [], // 풍향
		WSD : [] // 풍속
	};

	this.curTemp = null; // 현재 기온
	this.windSpeed = null; // 현재 풍속
	this.rainAmount = null; // 현재 강수량
	this.humidify = null; // 현재 습도
	this.currentSky = null; // 현재 하늘상태
	this.rainPer = null; // 현재 강수확률
	this.maxTemp = null; // 금일 최고 기온
	this.minTemp = null; // 금일 최저 기온

	// 예보 시간 인덱스
	this.forecastIndex = 0;

	// 현재 시간을 기준으로 더해질 예보 시간 값
	this.forecastGap = [ 300, 600, 900, 1200, 1500, 1800, 2100, 2400 ];

	this.setCurrentMinTemp = function(minTemp) {
		if (minTemp !== undefined) {
			this.minTemp = minTemp;
		}
	}

	this.setCurrentMaxTemp = function(maxTemp) {
		if (maxTemp !== undefined) {
			this.maxTemp = maxTemp;
		}
	}

	this.setCurrentRainPer = function() {
		console.log(this.forecastCategory['POP']);
		this.rainPer = this.forecastCategory['POP'][0].value;
		$('#cur_rain_per').html(this.rainPer);
	}

	this.setCurrentSky = function(currentSky) {
		if (currentSky !== undefined) {
			this.currentSky = currentSky;
		}
	}

	this.setCurTemp = function(curTemp) {
		if (curTemp !== undefined) {
			this.curTemp = curTemp;
		}
	}

	this.setWindSpeed = function(windSpeed) {
		let windStr;

		if (windSpeed !== undefined) {
			this.windSpeed = windSpeed;
		}

		// 풍속 설명 설정
		if (this.windSpeed < 4) {
			windStr = '바람약함';
		} else if (this.windSpeed < 9) {
			windStr = '바람약간강함';
		} else if (this.windSpeed < 14) {
			windStr = '바람강함'
		} else {
			windStr = '바람매우강함';
		}

		$('#wind_speed').html(this.windSpeed);
		$('#wind_exp').html(windStr);
	}


	this.setRainAmount = function(rainAmount) {
		if (rainAmount !== undefined) {
			this.rainAmount = rainAmount;
		}
	}

	this.setHumidify = function(humidify) {
		let humStr;

		if (humidify !== undefined) {
			this.humidify = humidify;
		}

		// 습도 설명 설정
		if (this.humidify < 40) {
			humStr = '건조';
		} else if (this.humidify <= 60) {
			humStr = '쾌적';
		} else {
			humStr = '다습';
		}

		$('#humidify').html(this.humidify);
		$('#humidify_exp').html(humStr);
	}

	// 하늘상태, 강수확률, 강수량을 통해 날씨 이미지를 정한다.
	this.setWeatherImage = function(id, sky, rainPer, rainAmount) {
		let imgNum = 0;

		switch (sky + '') {
		case '1': // 맑음
			if (rainPer <= 50) {
				imgNum = 1;
			} else {
				imgNum = 27;
			}
			break;
		case '2': // 구름 조금
			if (rainPer <= 50) {
				imgNum = 3;
			} else {
				imgNum = 22;
			}
			break;
		case '3': // 구름많음
			if (rainPer <= 50) {
				imgNum = 5;
			} else if (rainPer <= 70) {
				imgNum = 25;
			} else {
				imgNum = 22;
			}
			break;
		case '4': // 흐림
			if (rainPer <= 50) {
				imgNum = 7;
			} else {
				if (rainAmount < 1) {
					imgNum = 8;
				} else if (rainAmount <= 20) {
					imgNum = 9;
				} else if (rainAmount <= 70) {
					imgNum = 10;
				} else {
					imgNum = 15;
				}
			}
			break;
		default:
			imgNum = 25;
		}

		$(id).removeClass();
		if (imgNum < 10) {
			imgNum = '0' + imgNum;
		}

		$(id).addClass('thumb_lg ico_w' + imgNum);
	}

	// forecastCategory의 key 배열에서 예보시간이 dateTime인 값을 리턴한다.
	this.getDateTimeValue = function(key, dateTime) {
		const array = this.forecastCategory[key];
		let len = array.length;

		// 예보시간이 dateTime인 값, 없을 경우 dateTime보다 작으면서 가장 큰 값
		let value = null;

		for (let i = 0; i < len; i++) {

			// dateTime보다 작으면서 가장 큰 값
			if (array[i].dateTime < dateTime) {
				value = array[i].value;
			}

			// dateTime과 같은 값
			if (array[i].dateTime == dateTime) {
				value = array[i].value;
				break;
			}
		}

		// 존재하지 않을 경우에는 배열의 첫 예보 값
		if (!value) {
			value = array[0].value;
		}

		return value;
	}

	// 한 지역의 현재, 예보를 포함한 전체 날씨 정보 위젯에 설정
	this.setWeatherInfo = function() {
		this.setCurrentRainPer();
		this.setWindSpeed();
		this.setHumidify();
		$('#min_temp').html(this.minTemp);
		$('#max_temp').html(this.maxTemp);
		$('#temp_current').html(this.curTemp);
		$('#rain_amount').html(this.rainAmount);

		this.setWeatherImage('#cur_weather_img', this.currentSky, this.rainPer, this.rainAmount);

		// 예보 정보 설정
		this.forecastIndex = -1;
		this.nextForecastIndex(1);
	}

	// 예보 날짜 시간 설정
	this.getForecastDateTime = function(gap) {
		let len = this.forecastCategory['POP'].length;
		let tmpHours = (parseInt(requestParam.base_time, 10) + gap); //forecastGap);
		let tmpDate = requestParam.base_date;
		let isNext = '오늘';
		let dateTime = '';

		if (tmpHours >= 2400) {
			tmpDate = (parseInt(tmpDate, 10) + 1) + '';
			tmpHours %= 2400;
		}
		tmpHours = tmpHours < 1000 ? '0' + tmpHours : tmpHours + '';
		tmpDate += tmpHours;

		for (let i = 0; i < len; i++) {
			dateTime = this.forecastCategory['POP'][i].dateTime;
			if (tmpDate <= dateTime) {
				break;
			}
		}

		if (dateTime.slice(0, 8) != requestParam.base_date) {
			isNext = '내일 ';
		}

		return {
			dateTime : dateTime,
			isNext : isNext
		};

	}
	
//	this.setForcastValue = function({dateTime, isNext}, img, hours, temp, rainPer, windSpeed, humidify, rainAmount){
//		console.log(dateTime, isNext);
//		this.setWeatherImage(img, this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
//		$(hours).html(isNext + dateTime.slice(8, 10));
//		$(temp).html(this.getDateTimeValue('T3H', dateTime));
//		$(rainPer).html(this.getDateTimeValue('POP', dateTime));
//		$(windSpeed).html(this.getDateTimeValue('WSD', dateTime));
//		$(humidify).html(this.getDateTimeValue('REH', dateTime));
//		$(rainAmount).html(this.getDateTimeValue('R06', dateTime));
//	}

	// 현재 시간으로 부터 gap시간후 예보정보 위젯에 설정
	this.setForecastWeatherInfo = function(gap) {
		let {dateTime, isNext} = this.getForecastDateTime(gap);

		this.setWeatherImage('#forecast_weather_img', this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
		$('#forecast_hours').html(isNext + dateTime.slice(8, 10));
		$('#temp_forecast').html(this.getDateTimeValue('T3H', dateTime));
		$('#forecast_rain_per').html(this.getDateTimeValue('POP', dateTime));
		$('#forecast_wind_speed').html(this.getDateTimeValue('WSD', dateTime));
		$('#forecast_humidify').html(this.getDateTimeValue('REH', dateTime));
		$('#forecast_rain_amount').html(this.getDateTimeValue('R06', dateTime));
	}

	// 현재 시간으로 부터 gap시간후  다음 예보정보 위젯에 설정
	this.setNextForecastWeatherInfo = function(gap) {
		let {dateTime, isNext} = this.getForecastDateTime(gap);

		this.setWeatherImage('#next_forecast_weather_img', this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
		$('#next_forecast_hours').html(isNext + dateTime.slice(8, 10));
		$('#temp_next_forecast').html(this.getDateTimeValue('T3H', dateTime));
		$('#next_forecast_rain_per').html(this.getDateTimeValue('POP', dateTime));
		$('#next_forecast_wind_speed').html(this.getDateTimeValue('WSD', dateTime));
		$('#next_forecast_humidify').html(this.getDateTimeValue('REH', dateTime));
		$('#next_forecast_rain_amount').html(this.getDateTimeValue('R06', dateTime));
	}

	// 예보 인덱스 설정에 따른 예보 시간 설정
	this.nextForecastIndex = function(num) {
		let len = this.forecastGap.length;

		if ((this.forecastIndex += num) >= len - 1) {
			this.forecastIndex = 0;
		}

		if (this.forecastIndex < 0) {
			this.forecastIndex = len - 2;
		}
		
//		this.setForcastValue(this.getForecastDateTime(this.forecastGap[this.forecastIndex]), '#forcast_weather_img', '#forcast_hours', '#temp_forcast', '#forcast_rain_per', '#forcast_wind_speed', '#forcast_humidify', '#forcast_rain_amount');
//		this.setForcastValue(this.getForecastDateTime(this.forecastGap[++this.forecastIndex]), '#next_forcast_weather_img', '#next_forcast_hours', '#temp_next_forcast', '#next_forcast_rain_per', '#next_forcast_wind_speed', '#next_forcast_humidify', '#next_forcast_rain_amount');
		
		// 한번에 2개의 예보 시간 설정 (0 1, 2 3, ...)
		this.setForecastWeatherInfo(this.forecastGap[this.forecastIndex]);
		this.setNextForecastWeatherInfo(this.forecastGap[++this.forecastIndex]);

	}
}

function Enum() {
}

//날씨 API 요청 타입 현재, 예보
Enum.WeatherType = {
	forecast : 0,
	current : 1
};

//현재 지역 인덱스
let currentLocationIndex = 0;

//지역 총 갯수
var MAX_LOCATION = locationInfoArray.length;

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






///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////











//현재 날짜, 시간 정보를 설정, 시간 변경여부 리턴
function setCurrentDateTime() {
	const currentDate = new Date();
	const week = [ '일', '월', '화', '수', '목', '금', '토' ];
	let day = week[currentDate.getDay()];
	let year = currentDate.getFullYear();
	let month = currentDate.getMonth() + 1;
	let date = currentDate.getDate();
	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();
	let tmpDate = '';
	let tmpTime = '';

	// 시간 값이 바뀌었을 경우 true 새로운 요청 여부 결정
	let isNewTime = false;

	if (minutes < 30) {
		if ((hours -= 1) < 0) {
			hours = 23;
			currentDate.setDate(date -= 1);
			month = currentDate.getMonth() + 1;
			year = currentDate.getFullYear();
		}
	}

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (month < 10) {
		month = '0' + month;
	}
	if (date < 10) {
		date = '0' + date;
	}

	tmpDate = year + '' + month + '' + date;
	tmpTime = hours + '00';

	// 날짜가 바뀌었을 경우에만 날짜를 갱신하고, 당일 최저, 최고기온을 갱신 시킨다.
	if (locationInfoArray[currentLocationIndex].date !== tmpDate) {
		console.log('new date');
		locationInfoArray[currentLocationIndex].date = tmpDate
		requestParam.base_date = tmpDate;
		$('#current_date').html(month + '.' + date + ".");
		setMinMaxTemp();
	}

	// 시간이 바뀌었을 경우에만 시간값을 갱신하고, 현재 지역의 새로운 요청 여부를 결정한다.
	if (locationInfoArray[currentLocationIndex].time !== tmpTime) {
		isNewTime = true;
		$('#current_day').html('(' + day + ')');
		$('#current_hours').html(hours + '시');
		locationInfoArray[currentLocationIndex].time = tmpTime;
		requestParam.base_time = tmpTime;
	}

	return isNewTime;
}

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

//현재 날씨 응답값 해당 지역 weatherInfo에 저장
function setCurrentWeatherInfo(item) {
	$.each(item, function(key, value) {

		// 값 종류 (온도, 습도, 강수량 ..)
		let category = value.category;

		// 실제 값
		let realValue = value.obsrValue;

		// 응답값을 저장할 해당지역 weather 객체
		const weather = locationInfoArray[currentLocationIndex].weather;

		switch (category) {
		case 'T1H':
			weather.setCurTemp(Math.round(realValue));
			break;
		case 'RN1':
			weather.setRainAmount(realValue);
			break;
		case 'SKY':
			weather.setCurrentSky(realValue);
			break;
		case 'REH':
			weather.setHumidify(realValue);
			break;
		case 'WSD':
			weather.setWindSpeed(realValue);
			break;
		case 'PTY':

			break;
		case 'LGT':

			break;
		case 'VEC':

			break;
		default:
		}

	})
}

//예보 응답값 현재 지역 weatherInfo에 저장
function setForecastWeatherInfo(item) {
	$.each(item, function(key, value) {

		// 예보 종류 (온도, 습도, 강수량 ..)
		let category = value.category;

		// 실제 값
		let realValue = value.fcstValue;

		// 예보 날짜, 시간
		let date = value.fcstDate + '';
		let time = value.fcstTime + '';

		// category에 맞는 배열에 ForcoastInfo 객채로 만들어서 push 해준다.
		locationInfoArray[currentLocationIndex].weather.forecastCategory[category].push(new ForecastInfo(date + time, category, realValue));
	});
	console.log(locationInfoArray[currentLocationIndex].weather.forecastCategory);

}

//금일 최저, 최고 기온 요청 및 응답값 현재 지역 weatherInfo에 저장
function setMinMaxTemp() {
	const weather = locationInfoArray[currentLocationIndex].weather;

	// 최저 기온과 최고기온은  02시 발표 데이터 사용
	requestParam.base_time = '0200';

	requestWeather(function(item) {
		$.each(item, function(key, value) {

			// 날짜가 동일한 최고, 최저 기온만
			if (value.fcstDate == requestParam.base_date) {

				if (value.category === 'TMN') {
					weather.setCurrentMinTemp(value.fcstValue);
				} else if (value.category === 'TMX') {
					weather.setCurrentMaxTemp(value.fcstValue);
				}
			}
		});
	}, Enum.WeatherType.forecast, false);
}

//ajax를 통해 Controller로 현재 지역 날씨 정보 요청
function requestWeather(callBack, weatherType, isAsync) {
	let requestUrl;

	if (isAsync !== false) {
		isAsync = true;
	}

	// 현재, 예보에 따라 요청 컨트롤러 설정
	switch (weatherType) {
	case Enum.WeatherType.current:
		requestUrl = currentController;
		break;
	case Enum.WeatherType.forecast:
		requestUrl = forecastController;
		break;
	default:
	}

	//		requestUrl += $.param(requestParam);
	console.log(requestUrl);
	$.ajax({
		url : requestUrl,
		type : 'GET',
		data : requestParam,
		async : isAsync,
		//		dataType : 'json',
		success : function(result) {
			//											console.log(result);
			callBack($.parseJSON(result).response.body.items.item);

		},
		error : function(error) {
			console.log('ajax) api request error');
			console.log(error);
		}
	});
}








//지역설정뷰 -> 날씨뷰, 사용자가 설정한 지역순서 설정
function switchLocationToWeather() {

	// 사용자가 설정한 지역 순서의 고유키 리스트 
	const newNameList = $('#location_name_group .blind')
	let len = newNameList.length;

	// 설정 전 지역 정보 순서 리스트 복사
	const tmpLocationInfoArray = [ ...locationInfoArray ]; //locationInfoArray.slice(0);
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
		locationInfoArray[i] = tmp;
	}

	currentLocationIndex = 0;
	resetLocation();
	switchLocationWeatherView();
}

//날씨뷰 -> 지역설정뷰, 현재 지역순서 뷰에 설정
function switchWeatherToLocation() {
	const len = locationInfoArray.length;
	let name = '';
	let index = '';

	$('#locatin_index_group').empty();
	$('#location_name_group').empty();

	// 지역설정 뷰에 순서번호와 지역이름을 설정한다.
	for (let i = 0; i < len; i++) {
		index += '<li class="location_index">' + (i + 1) + '번 </li>';
		name += '<li><a class="location_name">' + locationInfoArray[i].name + '</a><span class="blind">' + locationInfoArray[i].key + '</span></li>';

	}
	$('#locatin_index_group').html(index);
	$('#location_name_group').html(name);

	checkMoreInfo();
	switchLocationWeatherView();
}

//다음 지역
function moveNextLocation() {
	++currentLocationIndex;
	resetLocation();
	checkMoreInfo();
}

//이전 지역
function movePreLocation() {
	if (--currentLocationIndex < 0) {
		currentLocationIndex = MAX_LOCATION - 1;
	}

	resetLocation();
	checkMoreInfo();
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

//날씨 정보 뷰 <-> 지역관련 뷰로 전환
function switchLocationWeatherView() {
	$('#weather_info').toggle();
	$('#location_info').toggle();
}

// 예보 시간 변경에 따른 예보 정보 갱신
function switchForecast(event) {
	let id = event.target.id;
	let num;

	switch (id) {
	case 'next_forecast_weather':
		num = 1;
		break;
	case 'prev_forecast_weather':
		num = -3;
		break;
	}

	if (num) {
		locationInfoArray[currentLocationIndex].weather.nextForecastIndex(num);
	}
}






//지역변경에 따라 날씨 정보를 업데이트 한다.
function resetLocation() {
	currentLocationIndex = Math.abs(currentLocationIndex % MAX_LOCATION);

	$('#cur_loc_index').html(currentLocationIndex + 1);

	//api에서 사용할 지역과 위젯의 지역 정보를 설정한다.
	requestParam.nx = locationInfoArray[currentLocationIndex].nx;
	requestParam.ny = locationInfoArray[currentLocationIndex].ny;
	$('#cur_location_name').html(locationInfoArray[currentLocationIndex].name);

	// 새로운 시간일 경우에만 날씨정보를 요청한다.
	if (setCurrentDateTime()) {
		requestWeather(setCurrentWeatherInfo, Enum.WeatherType.current, false);

		setBasehour();
		requestWeather(setForecastWeatherInfo, Enum.WeatherType.forecast, false);
		console.log(locationInfoArray[currentLocationIndex].weather);
	}

	// 위젯에 날씨정보를 설정한다.
	locationInfoArray[currentLocationIndex].weather.setWeatherInfo();

}










//this.setForcastValue(dateTime, '#forcast_weather_img', '#forcast_hours', '#temp_forcast', '#forcast_rain_per', '#forcast_wind_speed', '#forcast_humidify', '#forcast_rain_amount');
//this.setForcastValue(dateTime, '#next_forcast_weather_img', '#next_forcast_hours', '#temp_next_forcast', '#next_forcast_rain_per', '#next_forcast_wind_speed', '#next_forcast_humidify', '#next_forcast_rain_amount');
//this.setForcastValue = function(dateTime, img, hours, temp, rainPer, windSpeed, humidify, rainAmount){
//	this.setWeatherImage(img, this.getDateTimeValue('SKY', dateTime), this.getDateTimeValue('POP', dateTime), this.getDateTimeValue('R06', dateTime));
//	$(hours).html(dateTime.slice(8, 10));
//	$(temp).html(this.getDateTimeValue('T3H', dateTime));
//	$(rainPer).html(this.getDateTimeValue('POP', dateTime));
//	$(windSpeed).html(this.getDateTimeValue('WSD', dateTime));
//	$(humidify).html(this.getDateTimeValue('REH', dateTime));
//	$(rainAmount).html(this.getDateTimeValue('R06', dateTime));
//}