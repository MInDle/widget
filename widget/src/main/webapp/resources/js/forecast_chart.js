
const RequestWeather = require('./request_weather');
const Chart = require('chart.js');
const moment = require('moment');

// 간단 예보
module.exports = (function() {

	// 차트 엘리먼트
	const ctx = $('#forecast_chart');
	let lineChart;

	// 현재 예보 타입, FORECAST_TYPE (기온, 강수확률, 습도, 풍속, 강수량)
	let currentType;
	let forecastCategory;

	// 현재 시간을 기준으로 더해질 예보 시간 값
	//	const forecastGap = [ 0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400 ];
	const forecastGap = [ 0, 3, 6, 9, 12, 15, 18, 21, 24 ];

	const forecastGapLen = forecastGap.length;

	// 예보 타입데이터 저장 객체
	function ForecastTypeInfo(name, dataKeyword, min, max) {

		// 예보 타입 이름
		this.name = name;

		// 예보타입 키 (forecastCategory에서 사용)
		this.dataKeyword = dataKeyword;

		// 예보 시간별 데이터
		this.valueMap

		this.min = min;
		this.max = max;
	}

	// 예보 타입 객체
	const FORECAST_TYPES = {
		forecast_type_temp : new ForecastTypeInfo('기온˚C', 'T3H'),
		forecast_type_rain_per : new ForecastTypeInfo('강수확률%', 'POP', 0, 100),
		forecast_type_humidify : new ForecastTypeInfo('습도%', 'REH', 0, 100),
		forecast_type_wind_speed : new ForecastTypeInfo('풍속m/s', 'WSD'),
		forecast_type_rain_amount : new ForecastTypeInfo('강수량mm', 'R06')
	};

	// 차트 초기 설정
	function initChart(forecastData) {
		const forecastTypes = $('#forecast_types');
		let inner = '';
		let forcastTypeInfo;

		forecastCategory = forecastData;

		// 기온을 초기 예보타입으로 설정
		currentType = 'forecast_type_temp';
		forecastTypes.empty();

		$.each(FORECAST_TYPES, function(key, value) {
			value.valueMap = undefined;

			if (key + '' === currentType) {
				inner += '<a id="' + key + '" class="sel_forecast_type">' + value.name + '</a>';
			} else {
				inner += '<a id="' + key + '" class="forecast_type">' + value.name + '</a>';
			}
			inner += '<i class="hi_slash" aria-hidden="true" role="presentation">|</i>';
		});

		forecastTypes.html(inner);
		setChart();
	}

	// 현제 타입에 맞는 차트 데이터 설정
	function setChart(type) {
		let labels = [];
		let datas = [];

		// type의 값이 존재할 경우에만 현재 타입 값 변경
		if (type) {
			currentType = type;
		}

		// 현재 예보 타입의 예보객체
		const currentForecast = FORECAST_TYPES[currentType];

		// 예보 시간별 데이터가 존재하지 않을 경우에만 데이터 생성
		if (!currentForecast.valueMap) {
			let timeValue = {};
			let key = currentForecast.dataKeyword;
			let forecastValue;

			for (let i = 0; i < forecastGapLen; i++) {
				forecastValue = getForecastDateTime(forecastGap[i], key);
				
				timeValue[forecastValue.result] = forecastValue.value;
			}

			currentForecast.valueMap = timeValue;
		}

		$.each(currentForecast.valueMap, function(key, value) {
			labels.push(key);
			datas.push(value);
		});

		// 기존 차트가 존재할 경우, 기존 차트 삭제
		if (lineChart) {
			lineChart.destroy();
		}

		// 차트 그리기
		makeChart(labels, datas, currentForecast.min, currentForecast.max);
	}

	function makeChart(labels, datas, min, max) {
		lineChart = new Chart(ctx, {
			type : 'line',
			data : {
				labels : labels,
				datasets : [ {
					label : '',
					data : datas,
					backgroundColor : [
						'rgba(0, 199, 60, 0.2)'
					],
					borderColor : [
						'rgba(255,99,132,1)'
					],
					borderWidth : 1
				} ]
			},
			options : {
				scales : {
					yAxes : [ {
						ticks : {
							beginAtZero : true,
							fontSize : 10,
							suggestedMin : min,
							suggestedMax : max
						},
						display : true
					} ],
					xAxes : [ {
						ticks : {
							fontSize : 11,
							beginAtZero : false,
							maxRotation : 0,
							minRotation : 0
						}
					} ]
				},
				legend : {
					display : false
				},
				tooltips : {
					enabled : true,
					mode : 'index',
//					yAlign : 'left',
//					xAlign : 'center',
					position : 'nearest',
					yPadding : 6,
					backgroundColor : 'rgba(0,0,0,0.3)'
//					enabled: false,
//					mode: 'index',
//					intersect: false,
//					custom: customTooltips
					
				}
			}
		});
	}
	
	var customTooltips = function (tooltip) {
		$(this._chart.canvas).css("cursor", "pointer");

		var positionY = this._chart.canvas.offsetTop;
		var positionX = this._chart.canvas.offsetLeft;

		console.log(positionY, positionX);
		
		$(".chartjs-tooltip").css({
			opacity: 0,
		});

		if (!tooltip || !tooltip.opacity) {
			return;
		}

		if (tooltip.dataPoints.length > 0) {
			tooltip.dataPoints.forEach(function (dataPoint) {
				var content = [dataPoint.xLabel, dataPoint.yLabel].join(": ");
				var $tooltip = $("#tooltip-" + dataPoint.datasetIndex);

				$tooltip.html(content);
				$tooltip.css({
					opacity: 1,
					top: positionY + dataPoint.y + "px",
					left: positionX + dataPoint.x + "px",
				});
			});
		}
	};

	// 현재시간에서 gap시간을 더한 시간에 가장 근접한 예보 시간, 값을 추출한다.
	function getForecastDateTime(gap, key) {
		let len = forecastCategory[key].length;
		const format = 'YYYYMMDDHH00';
		let tmpDateTime = moment(RequestWeather.requestParam.base_date + RequestWeather.requestParam.base_time, format);
		let isNext = '오늘';
		let dateTime = '';
		let result = '';
		let value = null;

		tmpDateTime.add(gap, 'hours');

		for (let i = 0; i < len; i++) {
			dateTime = forecastCategory[key][i].dateTime;
			if (tmpDateTime.format(format) <= dateTime) {
				value = forecastCategory[key][i].value;
				break;
			}
		}

		if (dateTime.slice(0, 8) != RequestWeather.requestParam.base_date) {
			isNext = '내일 ';
		}

		result = isNext + dateTime.slice(8, 10) + '시';
		return {
			dateTime : dateTime,
			result : result,
			value : value
		};
	}

	return {
		initChart : initChart,
		setChart : setChart
	};
}());
