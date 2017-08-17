<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>검색 위젯</title>
<link type="text/css" rel="stylesheet" href="css/widget.css"></link>
</head>
<body>
	<div id="search" class="search">
		<!--자동완성 입력창-->

		<form id="sform" name="sform"
			action="https://search.naver.com/search.naver" method="get">

			<fieldset>
				<legend class="blind">검색</legend>
				<select id="where" name="where" title="검색 범위 선택" class="blind">
					<option value="nexearch" selected="selected">통합검색</option>
					<option value="post">블로그</option>
					<option value="cafeblog">카페</option>
					<option value="cafe">- 카페명</option>
					<option value="article">- 카페글</option>
					<option value="kin">지식iN</option>
					<option value="news">뉴스</option>
					<option value="web">사이트</option>
					<option value="category">- 카테고리</option>
					<option value="site">- 사이트</option>
					<option value="movie">영화</option>
					<option value="webkr">웹문서</option>
					<option value="dic">사전</option>
					<option value="100">- 백과사전</option>
					<option value="endic">- 영어사전</option>
					<option value="eedic">- 영영사전</option>
					<option value="krdic">- 국어사전</option>
					<option value="jpdic">- 일본어사전</option>
					<option value="hanja">- 한자사전</option>
					<option value="terms">- 용어사전</option>
					<option value="book">책</option>
					<option value="music">음악</option>
					<option value="doc">전문자료</option>
					<option value="shop">쇼핑</option>
					<option value="local">지역</option>
					<option value="video">동영상</option>
					<option value="image">이미지</option>
					<option value="mypc">내PC</option>
					<optgroup label="스마트 파인더">
						<option value="movie">영화</option>
						<option value="auto">자동차</option>
						<option value="game">게임</option>
						<option value="health">건강</option>
						<option value="people">인물</option>
					</optgroup>
					<optgroup label="네이버 랩">
						<option>긍정부정검색</option>
					</optgroup>
				</select> <input type="hidden" id="sm" name="sm" value="top_hty" /> <input
					type="hidden" id="fbm" name="fbm" value="0" /> <input
					type="hidden" id="acr" name="acr" value="" disabled="disabled" />
				<input type="hidden" id="acq" name="acq" value=""
					disabled="disabled" /> <input type="hidden" id="qdt" name="qdt"
					value="" disabled="disabled" /> <input type="hidden" id="ie"
					name="ie" value="utf8" /> <input type="hidden" id="acir"
					name="acir" value="" disabled="disabled" /> <input type="hidden"
					id="os" name="os" value="" disabled="disabled" /> <input
					type="hidden" id="bid" name="bid" value="" disabled="disabled" />
				<input type="hidden" id="pkid" name="pkid" value=""
					disabled="disabled" /> <input type="hidden" id="eid" name="eid"
					value="" disabled="disabled" /> <input type="hidden" id="mra"
					name="mra" value="" disabled="disabled" /> <span
					class="green_window"> <input id="query" name="query"
					type="text" title="검색어 입력" maxlength="255" class="input_text"
					tabindex="1" accesskey="s" style="ime-mode: active;"
					autocomplete="off"
					onclick="document.getElementById('fbm').value=1;" value="" />
				</span>
				<div id="nautocomplete" class="autocomplete">
					<!-- 자동완성 열린 경우 fold 클래스 추가, 딤드인 경우 dim 추가 -->
					<a href="javascript:;" role="button" tabindex="2"
						class="btn_arw _btn_arw fold"><span class="blind _text">자동완성
							펼치기</span><span class="ico_arr"></span></a>
				</div>
				<button id="search_btn" type="submit" title="검색" tabindex="3"
					class="sch_smit" onmouseover="this.className='sch_smit over'"
					onmousedown="this.className='sch_smit down'"
					onmouseout="this.className='sch_smit'"
					onclick="clickcr(this,'sch.action','','',event);">
					<span class="blind">검색</span><span class="ico_search_submit"></span>
				</button>
			</fieldset>
		</form>
		<!--자동완성 입력창-->
		<!--한글입력기 -->
		<a href="javascript:;" id="ke_kbd_btn" role="button"
			class="btn_keyboard" onclick="nx_ime_load(this)" data-clk="sch.ime"><span
			class="blind">한글 입력기</span><span class="ico_keyboard"></span></a>
		<style type="text/css" id="_nx_kbd_style"></style>
		<div id="_nx_kbd" style="display: none;"></div>
		<!--한글입력기 -->
		<!--자동완성 레이어 -->
		<div id="autoFrame" class="reatcmp"
			style="background-color: rgb(255, 255, 255); display: none;">
			<div class="api_atcmp_wrap _atcmp" style="display: none;">
				<div class="words nature">
					<h3 class="tit">
						생각한대로 검색해 보세요 <span class="beta">Beta</span>
					</h3>
					<ul class="_nature">
						<li class="_item"><a href="#" onclick="return false;">@txt@</a><span
							style="display: none" id="rank@rank@">@txt@</span></li>
					</ul>
				</div>
				<div class="words _words">
					<div class="_atcmp_result_wrap">
						<ul class="_resultBox"></ul>
						<ul class="_resultBox"></ul>
						<ul class="_resultBox"></ul>
						<ul class="_resultBox"></ul>
					</div>
					<!-- 우측 정답형 영역 -->
					<div class="add_group _atcmp_answer_wrap"></div>
				</div>
				<!-- 컨텍스트 자동완성 플러스 -->
				<!-- [AU] _plus -->
				<div class="atcmp_plus _plus">
					<span class="desc"> <span class="plus_txt _plusTxt">시간대와
							관심사에 맞춘 <em class='txt'>컨텍스트 자동완성</em>
					</span> <a onclick="__atcmpCR(event, this, 'plus.help', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_16.naver"
						target="_blank" class="spat ico_info"><span class="blind">도움말
								보기</span></a>
					</span>
					<!-- [AU] _plus_btn -->
					<span class="switch _plus_btn"> <a href="#"
						class="btn_turnon active"
						onclick="__atcmpCR(event, this, 'plus.use', '','','');">ON<span
							class="blind">선택됨</span></a> <a href="#" class="btn_turnoff"
						onclick="__atcmpCR(event, this, 'plus.unuse', '','','');">OFF</a>
					</span>
					<div class="layer_plus _plusAlert">
						<strong class="tit">컨텍스트 자동완성</strong>
						<div class="_logout" style="display: block;">
							<p class="dsc">
								<em class="txt">동일한 시간대/연령/남녀별</em> 사용자 그룹의<br>관심사에 맞춰
								자동완성을 제공합니다.
							</p>
							<div class="btn_area">
								<a onclick="__atcmpCR(event, this, 'plus.login', '','','');"
									href="https://nid.naver.com/nidlogin.login"
									class="btn btn_login">로그인</a> <a target="_blank"
									onclick="__atcmpCR(event, this, 'plus.detail', '','','');"
									href="https://help.naver.com/support/alias/search/word/word_16.naver"
									class="btn btn_view">자세히</a>
							</div>
						</div>
						<div class="_login" style="display: none;">
							<p class="dsc">
								ON/OFF설정은<br>해당 기기(브라우저)에 저장됩니다.
							</p>
							<div class="btn_area">
								<a target="_blank"
									onclick="__atcmpCR(event, this, 'plus.detail', '','','');"
									href="https://help.naver.com/support/contents/contents.nhn?serviceNo=606&categoryNo=16659"
									class="btn btn_view">자세히</a>
							</div>
						</div>
						<button type="button" class="btn_close _close"
							onclick="__atcmpCR(event, this, 'plus.close', '','','');">
							<i class="spat ico_close">컨텍스트 자동완성 레이어 닫기</i>
						</button>
					</div>
				</div>
				<!-- //컨텍스트 자동완성 플러스 -->
				<p class="func">
					<span class="fl"><a
						onclick="__atcmpCR(event, this, 'help', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_17.naver"
						target="_blank">도움말</a><span class="atcmp_bar"></span><a
						onclick="__atcmpCR(event, this, 'report', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_18.naver"
						target="_blank">신고</a></span><span><em><a class="hisoff"
							href="javascript:;">검색어저장 켜기</a><span class="atcmp_bar"></span></em><a
						class="funoff" href="javascript:;">자동완성 끄기</a></span>
				</p>
				<span class="atcmp_helper _help_tooltip1">기능을 다시 켤 때는 <em
					class="ico_search spat">자동완성 펼치기</em>을 클릭하세요
				</span>
			</div>
			<div class="api_atcmp_wrap _atcmpIng" style="display: none;">
				<div class="words">
					<p class="info_words">현재 자동완성 기능을 사용하고 계십니다.</p>
				</div>
				<p class="func">
					<span class="fl"><a
						onclick="__atcmpCR(event, this, 'help', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_17.naver"
						target="_blank">도움말</a><span class="atcmp_bar"></span><a
						onclick="__atcmpCR(event, this, 'report', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_18.naver"
						target="_blank">신고</a></span><span><em><a class="hisoff"
							href="javascript:;">검색어저장 켜기</a><span class="atcmp_bar"></span></em><a
						class="funoff" href="javascript:;">자동완성 끄기</a></span>
				</p>
				<span class="atcmp_helper _help_tooltip2">기능을 다시 켤 때는 <em
					class="ico_search spat">자동완성 펼치기</em>을 클릭하세요
				</span>
			</div>
			<div class="api_atcmp_wrap _atcmpStart" style="display: none;">
				<div class="words">
					<p class="info_words">자동완성 기능이 활성화되었습니다.</p>
				</div>
				<p class="func">
					<span class="fl"><a
						onclick="__atcmpCR(event, this, 'help', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_17.naver"
						target="_blank">도움말</a><span class="atcmp_bar"></span><a
						onclick="__atcmpCR(event, this, 'report', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_18.naver"
						target="_blank">신고</a></span><span><em><a class="hisoff"
							href="javascript:;">검색어저장 켜기</a><span class="atcmp_bar"></span></em><a
						class="funoff" href="javascript:;">자동완성 끄기</a></span>
				</p>
				<span class="atcmp_helper _help_tooltip3">기능을 다시 켤 때는 <em
					class="ico_search spat">자동완성 펼치기</em>을 클릭하세요
				</span>
			</div>
			<div class="api_atcmp_wrap _atcmpOff" style="display: none;">
				<div class="words">
					<p class="info_words">자동완성 기능이 꺼져 있습니다.</p>
				</div>
				<p class="func">
					<span class="fl"><a
						onclick="__atcmpCR(event, this, 'help', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_17.naver"
						target="_blank">도움말</a><span class="atcmp_bar"></span><a
						onclick="__atcmpCR(event, this, 'report', '','','');"
						href="https://help.naver.com/support/alias/search/word/word_18.naver"
						target="_blank">신고</a></span><span><em><a class="hisoff"
							href="javascript:;">검색어저장 켜기</a><span class="atcmp_bar"></span></em><a
						class="funoff" href="javascript:;">자동완성 켜기</a></span>
				</p>
			</div>
			<!-- 최근검색어 & 내검색어 -->
			<div class="api_atcmp_wrap _keywords" style="display: none;">
				<div class="my_words">
					<div class="lst_tab">
						<ul>
							<li class="on _recentTab"><a href="javascript:;">최근검색어</a></li>
							<li class="_myTab"><a href="javascript:;">내 검색어</a></li>
						</ul>
					</div>
					<div class="words _recent">
						<ul>
							<li data-rank="@rank@"><a class="t@my@ _star _myBtn"
								title="내 검색어 등록" href="javascript:;"><em class="spat">내
										검색어 등록</em></a><a href="javascript:;" class="keyword">@txt@</a><em
								class="keyword_date">@date@.</em><a href="javascript:;"
								class="btn_delete spat _del" title="검색어삭제">삭제</a><span
								style="display: none">@in_txt@</span></li>
						</ul>
						<div class="info_words _recentNone" style="display: none">최근검색어
							내역이 없습니다.</div>
						<p class="info_words _offMsg" style="display: none">검색어 저장 기능이
							꺼져 있습니다.</p>
					</div>
					<div class="words _my" style="display: none">
						<ul>
							<li data-rank="@rank@"><a class="ton _star _myBtn"
								title="내 검색어 해제" href="javascript:;"><em class="spat">내
										검색어 해제</em></a><a href="javascript:;" class="keyword">@txt@</a></li>
						</ul>
						<div class="info_words _myNone" style="display: none">
							설정된 내 검색어가 없습니다.<br />최근검색어에서 <span class="star spat">내
								검색어 등록</span>를 선택하여 자주 찾는 검색어를<br />내 검색어로 저장해 보세요.
						</div>
						<p class="info_words _offMsg" style="display: none">검색어 저장 기능이
							꺼져 있습니다.</p>
					</div>
					<p class="noti _noti" style="display: none">
						<em class="ico_noti spat"><span class="blind">알림</span></em>공용
						PC에서는 개인정보 보호를 위하여 반드시 로그아웃을 해 주세요.
					</p>
					<p class="func _recentBtnGroup">
						<span class="fl"><a class="_delMode" href="javascript:;">기록
								삭제</a></span><span><a class="_keywordOff" href="javascript:;">검색어저장
								끄기</a><span class="atcmp_bar"></span><a class="_acOff"
							href="javascript:;">자동완성 끄기</a></span>
					</p>
					<p class="func _recentDelBtnGroup" style="display: none">
						<span class="fl"><a class="_delAll" href="javascript:;"
							title="최근 검색어 기록을 모두 삭제합니다.">기록 전체 삭제</a></span><span><a
							class="_delDone" href="javascript:;">완료</a></span>
					</p>
					<p class="func _myBtnGroup" style="display: none">
						<span class="fl"><a class="_delAll" href="javascript:;"
							title="설정된 내 검색어를 모두 삭제합니다.">기록 전체 삭제</a></span><span><a
							class="_keywordOff" href="javascript:;">검색어저장 끄기</a><span
							class="atcmp_bar"></span><a class="_acOff" href="javascript:;">자동완성
								끄기</a></span>
					</p>
					<span class="atcmp_helper _help2">기능을 다시 켤 때는 <em
						class="ico_search spat">자동완성 펼치기</em>을 클릭하세요
					</span>
					<div class="ly_noti _maxLayer" style="display: none">
						<span class="mask"></span>
						<p>
							<span class="ico_alert spat"></span>내 검색어는 <em>최대 10</em>개 까지 저장할
							수 있습니다.<br />추가하시려면 기존 내 검색어를 지워주세요. <a href="javascript:;"
								class="btn_close _close"><i class="spat ico_close">닫기</i></a>
						</p>
					</div>
				</div>
			</div>
			<!-- 자동완성 안내문구 (선거) -->
			<div class="api_atcmp_wrap _alert" style="display: none;">
				<div class="api_atcmp_alert">
					<span class="ico_alert spat"></span>
					<p class="dsc_txt">
						제19대 대통령선거 후보에 대해 5월 9일 선거일까지 자동완성 기능이 제공되지 않습니다.<br> <a
							href="http://naver_diary.blog.me/220982360603" target="_blank"
							onclick="clickcr(this,'sug.vote','','',event);">자세히보기</a>
					</p>
				</div>
			</div>
			<!-- //자동완성 안내문구 (선거) -->
			<!-- [D] IE 계열, wmode="window" flash와 겹치지 않기 위함 -->
			<iframe vspace="0" hspace="0" border="0"
				style="display: none; display: block\9; display: block\0/; position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: -1;"
				title="빈 프레임"></iframe>
		</div>
		<!--자동완성 레이어 -->
</body>
</html>