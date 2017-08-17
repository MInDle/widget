<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!-- <link type="text/css" rel="stylesheet" href="css/weather_widget.css"></link> -->

<div class="_PM_timesquare_wrapper" id="time_square">

	<div id="error" class="section_timesquare _PM_timesquare_base" style="display: none">
		<p class="error_msg">
			서비스 상태가 좋지 않습니다.<br>
			<a id="error_retry" class="error_re">재시도</a>
		<p>
	</div>
	<div id="weather_info" class="section_timesquare _PM_timesquare_base"
		data-code="weather" style="display: none">
		<h2 class="blind">타임스퀘어</h2>
		<div class="area_header">
			<div class="header_info _PM_timesquare_info">
				<a href="https://calendar.naver.com" data-clk="squ.date"
					class="hi_date"><span id="current_date" class="hi_dnum">07.31.</span><span
					id="current_day" class="hi_day">(월)</span><span id="current_hours"
					class="hi_day">07시</span></a><i class="hi_slash" aria-hidden="true"
					role="presentation">|</i> <a id="cur_location_name" href="#"
					data-clk="squ_wea.set" class="hi_tit _PM_timesquare_weather_loc">성남시
					정자1동<i class="ico_btn_arrow" aria-hidden="true"></i>
				</a>
			</div>
			<div class="header_paging _PM_timesquare_navi">
				<b id="cur_loc_index" class="hp_curr">위치번호</b>/<b id="total_loc_cnt"
					class="hp_total">위치총개수</b>
			</div>
			<div id="move_btn" class="header_btns">
				<a id="btn_pre" data-clk="squ.pre"
					class="header_btn_prev _PM_timesquare_prev" href="#"><i
					class="ico_btn_prev" id="ico_pre" aria-hidden="true"></i><span class="blind">앞의
						목록으로 이동</span></a> <a id="btn_next" data-clk="squ.next"
					class="header_btn_next _PM_timesquare_next" href="#"><i
					class="ico_btn_next" id="ico_next" aria-hidden="true"></i><span class="blind">뒤의
						목록으로 이동</span></a>
			</div>
		</div>


		<div class="area_ct">
			<div class="flick-view">
				<div class="flick-container">
					<div class="flick-panel _PM_timesquare_list" data-code="weather">

						<div class="type_weather">
							<a data-clk="squ_wea.con"
								href="http://weather.naver.com/rgn/townWetr.nhn?naverRgnCd=02135550"
								class="info_layer" style="padding-top: 5px;">
								<div id="cur_weather_img" class="thumb_lg ico_w09">
									<span class="blind">날씨 비</span>
								</div>
								<div class="info_temp">
									<div class="temp_current" aria-label="현재기온">
										<span id="temp_current" class="tc_text">0</span>°C
									</div>
									<span id="min_temp" class="temp_lowest" aria-label="최저기온"><span
										id="temp_lowest_text" class="tl_text">0</span>°<i
										class="tl_slash" aria-hidden="true">/</i></span> <span id="max_temp"
										class="temp_highest" aria-label="최고기온"><span
										class="th_text">0</span>°</span>
								</div>
								<div id="weather_text" class="info_text" style="width: 190px;">
									<p id="cur_rain_per_p" class="text_current">
										강수확률 <span id="cur_rain_per"></span>%
										<!-- /어제보다 <span>6</span>° 낮아요/ -->
									</p>

									<span id="air_detail" style="display: none;">
										<p class="text_fine_dust">
											미세먼지 농도 <span id="fine_dust_value"></span>
										</p>

										<p class="text_fine_dust">
											오존 <span id="ozone"></span> <i class="hi_slash"
												aria-hidden="true" role="presentation">|</i> 오존 농도 <span
												id="ozone_value"></span>
										</p>
									</span>

									<!-- <i class="hi_slash" aria-hidden="true" role="presentation">|</i> -->
									<p id="fine_dust_p" class="text_current">
										미세먼지 <span id="fine_dust">eee</span>
									</p>

									<span id="weather_detail" style="display: none;">
										<p class="text_fine_dust">
											풍속<span id="wind_speed"></span>m/s&nbsp;(<span id="wind_exp"
												style="font-size: 11px">바람약함</span>)

										</p>
										<p class="text_fine_dust">
											습도 <span id="humidify"></span>% (<span id="humidify_exp">ㅇㅇ</span>)<i
												class="hi_slash" aria-hidden="true" role="presentation">|</i>강수량
											<span id="rain_amount"></span>mm
											<!-- /미세먼지 <span class="text_fd_good">좋음/</span> -->
										</p>
									</span>
								</div>
							</a>
							<div class="info_breaking">
								<a data-clk="squ_wea.tit" href="http://weather.naver.com/"><em
									class="ib_wt">날씨</em></a> <a data-clk="squ_wea.news"
									href="https://search.naver.com/search.naver?sm=top_tsi&where=nexearch&query=%EC%98%A4%EB%8A%98+%EB%82%A0%EC%94%A8"><span
									class="ib_text"> <!--  실시간 기상 정보 확인하기-->실시간 기상 정보
								</span></a><i class="ib_vertical" aria-hidden="true">|</i><a
									data-clk="squ_wea.news"
									href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%A3%BC%EA%B0%84+%EC%98%88%EB%B3%B4"><span
									class="ib_date">주간예보</span></a>
								<!-- 	<i class="ib_vertical"
										aria-hidden="true">|</i> -->
								<div style="float: right">
									<a id="more_info_btn" class="header_btn_prev"
										style="border-left: 0px; padding: 0px"><l
											class="init_down ico_btn_prev "></l></a><span class="ib_date">간단예보</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>





<!-- height 142px -->
		<div id="more_info" class="section_timesquare _PM_timesquare_base"
			style="display: none; height : 170px;" data-code="weather">
			<div class="area_header">
				<div id="forecast_types" class="header_info _PM_timesquare_info" style="max-width : 330px; width: 330px;">
					<!-- <a id="forecast_type_temp" class="forcast_type">기온</a><i class="hi_slash" aria-hidden="true"
					role="presentation">|</i> 
				<a id="forecast_type_rain_per" class="forcast_type">강수확률</a><i class="hi_slash" aria-hidden="true"
					role="presentation">|</i> 
				<a id="forecast_type_humidify" class="forcast_type">습도</a><i class="hi_slash" aria-hidden="true"
					role="presentation">|</i> 
				<a id="forecast_type_wind_speed" class="forcast_type">풍속</a><i class="hi_slash" aria-hidden="true"
					role="presentation">|</i> 
				<a id="forecast_type_rain_amount" class="forcast_type">강수량</a> -->
				</div>
			</div>

			<canvas id="forecast_chart" width="340" height="110"
				style="padding-top: 15px">
			
			</canvas>


		</div>












	</div>








	<div id="location_info" class="section_timesquare _PM_timesquare_base"
		style="display: none;" data-code="weather">
		<div class="area_header">
			<div class="header_info _PM_timesquare_info">
				<div class="header_btns">
					<!-- <a id="back_to_weather" class="header_btn_prev"
							style="border-left: 0px;"><l class="ico_btn_prev "></l></a> -->
					<a class="sl_btn_close _PM_timesquare_weather_close"
						data-custom-clk="squ_wea.close"> <i id="location_close"
						class="sl_ico_close" aria-hidden="true"></i>
					</a>
				</div>
				<span id="current_date" class="location_setting">지역설정</span>
			</div>
		</div>
		<div id="location_list" class="location_list_container">
			<ol id="locatin_index_group" class="location_index_list">
				<li class="location_index">1.</li>
				<li class="location_index">1.</li>

			</ol>

			<ol id="location_name_group" class="location_name_list">
				<li class="location_name">ddddd</li>
			</ol>
		</div>
	</div>





</div>




<script src="resources/weather_widget_bundle.js"></script>


<!-- <script>
$(document).ready(init.initWeatherWidget);
</script> -->
















<!-- 		<div id="more_info" class="section_timesquare _PM_timesquare_base"
			style="display: none;" data-code="weather">
			<div class="area_header"></div>
			<div class="type_weather forecast_weather">
				<p class="text_current">
					<span id="forecast_hours">00</span>시 예보
					/어제보다 <span>6</span>° 낮아요/
				</p>
				<div id="forecast_weather_img" class="thumb_lg ico_w09"
					style="display: block;">
					<span class="blind">날씨 비</span>
				</div>
				<div class="info_temp">
					<div class="temp_current" aria-label="현재기온">
						<span id="temp_forecast" class="tc_text">0</span>°C
					</div>
					<span class="temp_lowest" aria-label="최저기온">
						<span id="cur_min_temp" class="tl_text">0</span>°<i
							class="tl_slash" aria-hidden="true">/</i></span> <span 
							class="temp_highest" aria-label="최고기온"><span id="cur_max_temp"
							class="th_text">0</span>°</span>
				</div>

				<p>
					강수확률<span id="forecast_rain_per">100</span>%
				</p>
				<p>
					풍속<span id="forecast_wind_speed">10.5</span>m/s
				</p>
				<p>
					습도 <span id="forecast_humidify"></span>%<i class="hi_slash"
						aria-hidden="true" role="presentation">|</i>강수량 <span
						id="forecast_rain_amount">00</span>mm
						/미세먼지 <span class="text_fd_good">좋음/</span>
				</p>
			</div>

			<div class="type_weather forecast_weather">
				<p class="text_current">
					<span id="next_forecast_hours">00</span>시 예보
					/어제보다 <span>6</span>° 낮아요/
				</p>
				<div id="next_forecast_weather_img" class="thumb_lg ico_w09"
					style="display: block;">
					<span class="blind">날씨 비</span>
				</div>
				<div class="info_temp">
					<div class="temp_current" aria-label="현재기온">
						<span id="temp_next_forecast" class="tc_text">0</span>°C
					</div>
					<span class="temp_lowest" aria-label="최저기온"><span
							id="temp_lowest_text" class="tl_text">0</span>°<i
							class="tl_slash" aria-hidden="true">/</i></span> <span id="temp_highest"
							class="temp_highest" aria-label="최고기온"><span
							class="th_text">0</span>°</span>


				</div>
				<p>
					강수확률<span id="next_forecast_rain_per">100</span>%
				</p>
				<p>
					풍속<span id="next_forecast_wind_speed">10.5</span>m/s
				</p>
				<p>
					습도 <span id="next_forecast_humidify"></span>%<i class="hi_slash"
						aria-hidden="true" role="presentation">|</i>강수량 <span
						id="next_forecast_rain_amount">00</span>mm
						/미세먼지 <span class="text_fd_good">좋음/</span>
				</p>
			</div>
			<span id="move_forecast_weather">
			
			<a id="prev_forecast_weather" data-clk="squ.pre"
					class="header_btn_prev _PM_timesquare_prev" href="#" style="width:15px;"><i
					class="ico_btn_prev" aria-hidden="true"></i><span class="blind">앞의
						목록으로 이동</span></a>
			<a id="next_forecast_weather" data-clk="squ.next"
					class="header_btn_next _PM_timesquare_next" href="#" style="width:15px;"><i
					class="ico_btn_next" aria-hidden="true"></i><span class="blind">뒤의
						목록으로 이동</span></a>
			</span>
			
			
		</div> -->