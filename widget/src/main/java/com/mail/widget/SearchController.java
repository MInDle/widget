package com.mail.widget;

import java.io.BufferedReader;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.mail.widget.ConstantValue.*;

@RestController
public class SearchController {

	@RequestMapping(value = "/search_query", produces="application/string;charset=utf-8")
	public String search(HttpServletRequest request) throws Exception {
		String queryString = request.getQueryString();
		String result = "";
		System.out.println(queryString);
		StringBuffer response = new StringBuffer();

		try {
																						
			URL url = new URL(SEARCH_REQUEST_URL + queryString);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("X-Naver-Client-Id", CLIENT_ID);
			con.setRequestProperty("X-Naver-Client-Secret", CLIEENT_SECRET);
			int responseCode = con.getResponseCode();
			BufferedReader br;
			if (responseCode == 200) { // 정상 호출
				br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			} else { // 에러 발생
				br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			}
			String inputLine;
			while ((inputLine = br.readLine()) != null) {
				response.append(inputLine);
			}
			br.close();
			
			JSONParser parser = new JSONParser();
            JSONObject object = (JSONObject)parser.parse(response.toString());
            System.out.println(object.toJSONString());
		} catch (Exception e) {
			System.out.println(e);
		}
		return response.toString();
	}
}
