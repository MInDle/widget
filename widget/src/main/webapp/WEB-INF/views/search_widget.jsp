<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<link type="text/css" rel="stylesheet" href="css/search_widget.css"></link>
<link type="text/css" rel="stylesheet" href="css/search_naver.css"></link>
<div id="search_widget">
	<div id="search" class="search search_div">

		<span class="green_window" style="width: 290px; display: none;">
			<input id="query" name="query" type="text" title="검색어 입력"
			maxlength="255" class="input_text" tabindex="1" accesskey="s"
			style="ime-mode: active; width: 240px;" autocomplete="off" value="" />
		</span>

		<div id="search_btn" type="submit" title="검색" tabindex="3"
			class="sch_smit" onmouseover="this.className='sch_smit over'"
			onmousedown="this.className='sch_smit down'"
			onmouseout="this.className='sch_smit'">
			<!-- onclick="clickcr(this,'sch.action','','',event);"> -->
			<span class="blind">검색</span><span class="ico_search_submit"></span>
		</div>

	</div>

	<div class="search_result search">
		<div id="lnb">
			<div class="lnb_group" style="width: 296px;">
				<div class="search_banner_container">
					<div class="search_banner_wrapper">
						<span id="cur_search_type" class="selected_type">
							<div class="sub_type_wrapper">
								<ul id="sub_type_list" class="sub_type">
									<li></li>
								</ul>
							</div>
						</span> <span class="go_to_web">웹으로 검색</span>
					</div>
				</div>
			</div>
		</div>
		<div id="result">
			<div class="m_section">
				<div class="row">
					<div id="title" class="col_8_12">dwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwdd</div>
					<div id="date" class="col_4_12">eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</div>
					<div id="description" class="row">dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</div>
					<div class="row">
						<div id="author" class="col_5_12">11111111111111111111111111111111111111111111111111111111111111111111111111111111111111</div>
						<div id="link" class="col_7_12">22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>


</div>

<script src="js/search_widget.js"></script>
<script>
	$(document).ready(initSearchWidget);
</script>


<!-- <ul class="search_type">
							<li class="lnb0"><span class="">통합검색</span></li>
							<li class="lnb3"><span class="">블로그</span></li>
							<li class="lnb6"><span class="">카페</span></li>
							<li class="lnb5"><span class="">지식iN</span></li>
							<li class="lnb2"><span class="">이미지</span></li>
							<li class="lnb1"><span class="">동영상</span></li>
							<li class="lnb8"><span class="">어학사전</span></li>
							<li class="lnb4"><span class="">뉴스</span></li>
						</ul> -->




<!-- 					<div class="lnb_menu">
						<ul class="base">
							<li class="lnb0"><span class="">통합검색</span></li>
							<li class="lnb3"><span class="">블로그</span></li>
							<li class="lnb6"><span class="">카페</span></li>
							<li class="lnb5"><span class="">지식iN</span></li>
							<li class="lnb2"><span class="">이미지</span></li>
							<li class="lnb1"><span class="">동영상</span></li>
							<li class="lnb8"><span class="">어학사전</span></li>
							<li class="lnb4"><span class="">뉴스</span></li>
						</ul>
					</div> -->


<!-- <div class="search_banner_wrapper">
						<span>ㅇㅇㅇ</span> <span>ㄱㄱㄱ</span> <span>ㄴㄴㄴ</span> <span>ㄷㄷㄷ</span>
						<span>ㅅㅅㅅ</span> <span>ㅛㅛㅛ</span> <span>ㅊㅊㅊ</span> <span>ㅍㅍㅍ</span>
						<span>ㅂㅂㅂ</span> <span>ㅋㅋㅋ</span> <span>ㅂㅂㅂ</span>
					</div> -->