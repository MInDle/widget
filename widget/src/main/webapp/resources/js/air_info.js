
module.exports = (function(){
	
	// 대기 정보 등급 객체
	function GradeInfo(name, type){
		this.name = name;
		this.type = type;
	}
	
	// 대기정보 등급 배열
	const Grade = [
		new GradeInfo('좋음', 'good'),
		new GradeInfo('보통', 'average'),
		new GradeInfo('나쁨', 'bad'),
		new GradeInfo('매우나쁨', 'so_bad')
	];
	
	// 대기정보 저장 객체
	function AirInfo(){
		
		// 미세먼지 수치
		this.fineDustValue;
		
		// 오존 수치
		this.ozoneValue;
		
		// 미세먼지 등급
		this.fineDustGrade;
		
		// 오존 등급
		this.ozoneGrade;
		
		// 초미세먼지 수치 (모든 지역에 응답값을 주지 않아 보류..)
		this.superFineDustValue;
		// 초미세먼지 등급
		this.superFineDustGrade;
	}
	
	// 대기정보 응답값 설정
	AirInfo.prototype.setAirResponse = function(item){
		
		let that;
		let fineDustValue;
		let fineDustGrade;
		let ozoneValue;
		let ozoneGrade;
		let isOk;
		let len = item.length;
		
		for(let i = 0; i < len; i++){
			that = $(item[i]);
			isOk = true;
			
			fineDustValue = that.find('pm10Value').text();
			fineDustGrade = that.find('pm10Grade1h').text();
			ozoneValue = that.find('o3Value').text();
			ozoneGrade = that.find('o3Grade').text();

			// 응답값을 내려주지 않는 경우를 판별 
			if(!(parseInt(fineDustValue, 10) + 1)){
				isOk = false;
			} else if(!((fineDustGrade = parseInt(fineDustGrade, 10)) + 1)){
				isOk = false;
			} else if(!(parseInt(ozoneValue, 10) + 1)){
				isOk = false;
			} else if(!((ozoneGrade = parseInt(ozoneGrade, 10)) + 1)){
				isOk = false;
			}
			
			// 사용해야할 응답 값이 모두 있을 경우에만 값 설정
			if(isOk){
				
				// 미세먼지 수치, 등급 설정
				this.fineDustValue = fineDustValue;
				this.fineDustGrade = Grade[fineDustGrade - 1];
				
				// 오존 수치, 등급 설정
				this.ozoneValue = ozoneValue;
				this.ozoneGrade = Grade[ozoneGrade - 1];
				
				break;
			}
			
		}
	}
	
	// 대기정보 위젯에 설정
	AirInfo.prototype.setAirInfo = function(){
		const fineDust = $('#fine_dust');
		const ozone = $('#ozone');
		
//		fineDust.removeClass();
//		ozone.removeClass();
//		ozone.html(this.ozoneGrade.name);
//		fineDust.html(this.fineDustGrade.name);
		
		fineDust.removeClass().addClass('air_' + this.fineDustGrade.type).html(this.ozoneGrade.name);
		ozone.removeClass().addClass('air_' + this.ozoneGrade.type).html(this.ozoneGrade.name);
		$('#fine_dust_value').html(this.fineDustValue);
		$('#ozone_value').html(this.ozoneValue);
	}
	
	
	return AirInfo;
}());