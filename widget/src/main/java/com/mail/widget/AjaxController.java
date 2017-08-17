package com.mail.widget;

import java.net.URI;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.mail.widget.ConstantValue.*;


@RestController
public class AjaxController {
	
	@RequestMapping(value = FORECAST_WEATHER)
	public String forecastWeather(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		System.out.println(FORECAST_WEATHER + ", " + queryString);
		
		return requestWeather(WeatherURL.FORCAST_URL.getURL() + queryString);
	}

	@RequestMapping(value = CURRENT_WEATHER)
	public String currentWeather(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		System.out.println(CURRENT_WEATHER + ", " + queryString);

		return requestWeather(WeatherURL.CURRENT_URL.getURL() + queryString);
	}
	
	@RequestMapping(value = CURRENT_AIR, produces="application/string;charset=utf-8")
	public String currentAir(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		System.out.println(CURRENT_AIR + ", " + queryString);
		
		return requestWeather(AirURL.CURRENT_AIR_URL.getURL() + queryString);
	}
	
	@RequestMapping(value = TM_COORDINATES, produces="application/string;charset=utf-8")
	public String tmCoordinates(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		System.out.println(TM_COORDINATES + ", " + queryString);
		
		return requestWeather(AirURL.TM_COORDINDATES_URL.getURL() + queryString);
	}
	
	@RequestMapping(value = ADJACENT_STATION, produces="application/string;charset=utf-8")
	public String adjacentStation(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		System.out.println(ADJACENT_STATION + ", " + queryString);
		
		return requestWeather(AirURL.ADJACENT_STATION_URL.getURL() + queryString);
	}
	
	private String requestWeather(String url) throws Exception {
		String result = "";
		
		HttpClient httpClient = HttpClientBuilder.create().build();
		URI uri = new URI(url);
		HttpResponse httpResponse = httpClient.execute(new HttpGet(uri));
		result = EntityUtils.toString(httpResponse.getEntity());
		
		System.out.println(result);
		return result;
	}

}
