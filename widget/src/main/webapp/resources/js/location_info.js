var WeatherInfo = require('./weather_info');
var AirInfo = require('./air_info');

module.exports = (function(){
	
	function LocationInfo(sidoName, sggName, umdName, nx, ny, key){
		this.sidoName = sidoName;
		this.sggName = sggName;
		this.umdName = umdName;
		this.name = sidoName + ' ' + sggName + ' ' + umdName;
		this.nx = nx;
		this.ny = ny;
		this.key = key;
		this.stationName;
		this.weather = new WeatherInfo();
		this.air = new AirInfo();
	}
	
	return LocationInfo;
}());
