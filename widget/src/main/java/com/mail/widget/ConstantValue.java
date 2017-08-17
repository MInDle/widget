package com.mail.widget;

public class ConstantValue {
	public static final String API_KEY = "ktQYKpl0EtzxCJEN2tYsgocTERzvhMFoP4q0A%2Fi9ZQ8EAMS97Ie1anCY3Dj9ZHdI4s%2BGspQgM6TqBMA5pZj1xQ%3D%3D";
	
	enum WeatherURL{
		FORCAST_URL("ForecastSpaceData"),
		
		CURRENT_URL("ForecastGrib");
		
		private String url;
		private static final String WEATHER_REQUEST_URL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/";
		
		private WeatherURL(String url){
			this.url = WEATHER_REQUEST_URL + url + "?ServiceKey=" + API_KEY;
		}
		
		public String getURL(){
			return url;
		}
	};
	
//	public static final String FORECAST_URL = WEATHER_REQUEST_URL + "ForecastSpaceData?ServiceKey=" + API_KEY;
//	public static final String CURRENT_URL = WEATHER_REQUEST_URL + "ForecastGrib?ServiceKey=" + API_KEY;
	
	
	enum AirURL{
		TM_COORDINDATES_URL("MsrstnInfoInqireSvc/getTMStdrCrdnt"),
		
		ADJACENT_STATION_URL("MsrstnInfoInqireSvc/getNearbyMsrstnList"),
		
		CURRENT_AIR_URL("ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty");
		
		private String url;
		private static final String AIR_REQUEST_URL = "http://openapi.airkorea.or.kr/openapi/services/rest/";
		
		private AirURL(String url){
			this.url = AIR_REQUEST_URL + url + "?serviceKey=" + API_KEY;
		}
		
		public String getURL(){
			return url;
		}
	}
	
	
	public static final String FORECAST_WEATHER = "/forecast_weather";
	public static final String CURRENT_WEATHER = "/currenet_weather";
	public static final String CURRENT_AIR = "/current_air";
	public static final String TM_COORDINATES = "/tm_coordinates";
	public static final String ADJACENT_STATION = "/adjacent_station";
	
	
	public static final String SEARCH_REQUEST_URL = "https://openapi.naver.com/v1/search/";
	public static final String CLIENT_ID = "eSez1gcGAZUzO3T_T4MR";
	public static final String CLIEENT_SECRET = "kEYHr3ZNAd";
	
}
































//	public static final String API_KEY = "bZqcUVvRPCFz3AV62ILBAq9m%2FENgmc3Att9tTbfaQ9YcD%2BfCIUGImMSfhXdAwLchSze5qYS0l7Uh%2BRb3X42fKQ%3D%3D";