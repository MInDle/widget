var ForecastInfo = require('./forecast_info');
var RequestWeather = require('./request_weather');
const ForecastChart = require('./forecast_chart');

//위젯에서 표현하는 날씨 정보 객체 WeatherInfo
module.exports = (function () {
	
	function WeatherInfo(){
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
		this.windExp = null; // 풍속 설명
		this.humidifyExp = null; // 습도 설명

		// 예보 시간 인덱스
		this.forecastIndex = 0;
	}
	
	WeatherInfo.prototype.setForcastCategory = function(key, forcastInfo){
		this.forecastCategory[key].push(forcastInfo);
	}

	WeatherInfo.prototype.setCurrentMinTemp = function(value) {
		if (value !== undefined) {
			this.minTemp = value;
		}
	}

	WeatherInfo.prototype.setCurrentMaxTemp = function(value) {
		if (value !== undefined) {
			this.maxTemp = value;
		}
	}

	WeatherInfo.prototype.setCurrentRainPer = function() {
		this.rainPer = this.forecastCategory['POP'][0].value;
	}

	WeatherInfo.prototype.setCurrentSky = function(value) {
		if (value !== undefined) {
			this.currentSky = value;
		}
	}

	WeatherInfo.prototype.setCurTemp = function(value) {
		if (value !== undefined) {
			this.curTemp = value;
		}
	}

	WeatherInfo.prototype.setWindSpeed = function(value) {

		if (value !== undefined) {
			this.windSpeed = value;
		}

		// 풍속 설명 설정
		if (this.windSpeed < 4) {
			this.windExp = '바람약함';
		} else if (this.windSpeed < 9) {
			this.windExp = '바람약간강함';
		} else if (this.windSpeed < 14) {
			this.windExp = '바람강함'
		} else {
			this.windExp = '바람매우강함';
		}

	}


	WeatherInfo.prototype.setRainAmount = function(value) {
		if (value !== undefined) {
			this.rainAmount = value;
		}
	}

	WeatherInfo.prototype.setHumidify = function(value) {
		let humStr;

		if (value !== undefined) {
			this.humidify = value;
		}

		// 습도 설명 설정
		if (this.humidify < 40) {
			this.humidifyExp = '건조';
		} else if (this.humidify <= 60) {
			this.humidifyExp = '쾌적';
		} else {
			this.humidifyExp = '다습';
		}

	}

	// 하늘상태, 강수확률, 강수량을 통해 날씨 이미지를 정한다.
	WeatherInfo.prototype.setWeatherImage = function(id, sky, rainPer, rainAmount) {
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
	
	//금일 최저, 최고 기온 요청 및 응답값 설정
	WeatherInfo.prototype.setMinMaxTemp = function(item) {
		
		const baseDate = RequestWeather.requestParam.base_date;
		
		$.each(item, function(key, value) {
			
			// 날짜가 동일한 최고, 최저 기온만
			if (value.fcstDate == baseDate) {

				if (value.category === 'TMN') {
					this.setCurrentMinTemp(value.fcstValue);
				} else if (value.category === 'TMX') {
					this.setCurrentMaxTemp(value.fcstValue);
				}
			}
		}.bind(this));
	}

	// 예보 응답값 설정
	WeatherInfo.prototype.setForecastResponse = function(item) {
		
		$.each(item, function(key, value) {

			// 예보 종류 (온도, 습도, 강수량 ..)
			let category = value.category;

			// 실제 값
			let realValue = value.fcstValue;

			// 예보 날짜, 시간
			let date = value.fcstDate + '';
			let time = value.fcstTime + '';
			
			// category에 맞는 배열에 ForcoastInfo 객채로 만들어서 push 해준다.
			this.forecastCategory[category].push(new ForecastInfo(date + time, category, realValue));
		}.bind(this));
		
		this.setCurrentRainPer();
	}

	// 현재 날씨 응답값  설정
	WeatherInfo.prototype.setCurrentResponse = function(item) {
		$.each(item, function(key, value) {

			// 값 종류 (온도, 습도, 강수량 ..)
			let category = value.category;

			// 실제 값
			let realValue = value.obsrValue;

			switch (category) {
			case 'T1H':
				this.setCurTemp(Math.round(realValue));
				break;
			case 'RN1':
				this.setRainAmount(realValue);
				break;
			case 'SKY':
				this.setCurrentSky(realValue);
				break;
			case 'REH':
				this.setHumidify(realValue);
				break;
			case 'WSD':
				this.setWindSpeed(realValue);
				break;
			case 'PTY':

				break;
			case 'LGT':

				break;
			case 'VEC':

				break;
			default:
			}

		}.bind(this));
	}
	
	// 한 지역의 현재, 예보를 포함한 전체 날씨 정보 위젯에 설정
	WeatherInfo.prototype.setWeatherInfo = function() {

		$('#humidify').html(this.humidify);
		$('#humidify_exp').html(this.humidifyExp);
		$('#wind_speed').html(this.windSpeed);
		$('#wind_exp').html(this.windExp);
		$('#cur_rain_per').html(this.rainPer);
		$('#min_temp').html(this.minTemp);
		$('#max_temp').html(this.maxTemp);
		$('#temp_current').html(this.curTemp);
		$('#rain_amount').html(this.rainAmount);
		
		this.setWeatherImage('#cur_weather_img', this.currentSky, this.rainPer, this.rainAmount);
		
		// 예보 정보인 차트 초기화
		ForecastChart.initChart(this.forecastCategory);
	}
	
	WeatherInfo.prototype.setForecastChart = function(id){
		ForecastChart.setChart(id);
	}
	
	return WeatherInfo;
}());