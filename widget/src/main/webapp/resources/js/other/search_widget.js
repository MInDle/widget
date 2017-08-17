
// 검색 위젯 초기 설정
function initSearchWidget() {
	$('#query').on('keydown', goSearch);

	$(function() {
		$('#search_widget').draggable({
			start : function() {
				isDrag = true;
				$(this).height(0).width(0);
			},
			stop : function() {
				isDrag = false;
				$(this).height(0).width(0);
			},
		});
	});

	$('#search_btn').on('mouseup', toggleSearchBar);

	$('#cur_search_type').on('click', selectSubType);

	$('#result').on('click', selectResult);
	
	$('#result').on('hover', viewMoreResult);

	$('#cur_search_type').hover(function() {
		console.log('hover');
		$('.sub_type_wrapper', this).slideDown(100);
	},
		function() {
			$('.sub_type_wrapper', this).fadeOut(200);
		});


	$('.go_to_web').on('click', goToWeb);

}

// 검색 아이콘 드래그 여부
var isDrag = false;

// 초기 타입 설정
var currentSearchType = 'blog';

// 검색 타입 데이터 저장 객체, 검색이름, 웹검색 url, 결과 출력 함수
function SearchInfo(name, webURL, setResult) {
	this.name = name;
	this.webURL = 'https://search.naver.com/search.naver?where=' + webURL + '&sm=tab_jum&ie=utf8&query=';
	this.setResult = setResult == null ? baseResult : setResult;

	function baseResult(items) {
		var inner = '';

		$.each(items, function(key, value) {

			inner += '<div id="' + value.link + '" class="m_section">';
			inner += '<div class="row title"><a href="#">' + value.title + '</a></div>';
			inner += '<div class="row description">' + value.description + '</div>';
			inner += '<div class="row link"><a href="#">' + value.link + '</div></div>';
			inner += '</div>';
		});

		return inner;
	}
}

// 검색 타입 종류 객체 all, blog, cafearticle, kin, encyc, news, webkr
var searchType = {
		
	all : new SearchInfo('통합검색'),

	blog : new SearchInfo('블로그', 'post', function(items) {
		var inner = '';

		$.each(items, function(key, value) {

			inner += '<div id="' + value.link + '" class="m_section">';
			inner += '<div class="row">';
			inner += '<div class="col_8_12 title"><a href="#">' + value.title + '</a></div>';
			inner += '<div class="col_4_12 date">' + value.postdate + '</div></div>';
			inner += '<div class="row description">' + value.description + '</div>';
			inner += '<div class="row">';
			inner += '<div class="col_5_12 author">' + value.bloggername + '</div>';
			inner += '<div class="col_7_12 link"><a href="#">' + value.link + '</div></div>';
			inner += '</div>';
		});

		return inner;
	}),

	cafearticle : new SearchInfo('카페', 'article', function(items) {
		var inner = '';

		$.each(items, function(key, value) {

			inner += '<div id="' + value.link + '" class="m_section">';
			inner += '<div class="row title"><a href="#">' + value.title + '</a></div>';
			inner += '<div class="row description">' + value.description + '</div>';
			inner += '<div class="row">';
			inner += '<div class="col_5_12 author">' + value.cafename + '</div>';
			inner += '<div class="col_7_12 link"><a href="#">' + value.link + '</div></div>';
			inner += '</div>';
		});

		return inner;
	}),

	kin : new SearchInfo('지식인', 'kin'),

	encyc : new SearchInfo('지식백과', 'kdic'),

	news : new SearchInfo('뉴스', 'news', function(items) {
		var inner = '';

		$.each(items, function(key, value) {

			inner += '<div id="' + value.link + '" class="m_section">';
			inner += '<div class="row">';
			inner += '<div class="col_8_12 title"><a href="#">' + value.title + '</a></div>';
			inner += '<div class="col_4_12 date">' + value.pubDate + '</div></div>';
			inner += '<div class="row description">' + value.description + '</div>';
			inner += '<div class="row link"><a href="#">' + value.link + '</div></div>';
			inner += '</div>';
		});

		return inner;
	}),

	webkr : new SearchInfo('웹문서', 'webkr'),

//		image : new SearchInfo('사진'),
//	doc : new SearchInfo('전문정보', '')
};

// 검색 요청 파라미터 값 저장 객체 
const requestSearchParam = {
	query : '',
	display : 20
};

// 검색 결과를 현제 검색 타입에 맞게 설정한다.
function setSearchResult(result) {
	const items = $.parseJSON(result).items;
	const resultElement = $('#result');

	resultElement.empty();
	resultElement.html(searchType[currentSearchType].setResult(items));
}

// ajax를 통해 Controller로 검색 API 요청을 보낸다.
function requestSearch(callBack) {
	var requestUrl;

	setSearchType(currentSearchType);

	requestUrl = searchController;
	requestUrl += currentSearchType + '?';
	console.log(requestUrl);

	$.ajax({
		url : requestUrl,
		type : 'GET',
		async : true,
		data : requestSearchParam,
		//				dataType : 'json',
		success : callBack
	});

}

function toggleSearchResult() {
	$('.search_result').toggle('fade', {
		direction : 'up'
	}, 200);

}

function setSearchType() {
	var inner = '';
	selectedType = $('#cur_search_type');
	selectedType.empty();
	
	inner = searchType[currentSearchType].name;
	inner += '<div class="sub_type_wrapper">';
	inner += '<ul id="sub_type_list" class="sub_type">';

	for (type in searchType) {

		if (type !== currentSearchType) {
			inner += '<li id="' + type + '">' + searchType[type].name + ' </li>';
		}
	}
	inner += '</ul>';
	inner += '</div>';
	selectedType.html(inner);

}

function openNewWindow(url) {
	window.open(url);
}

// 웹으로 열기(검색)
function goToWeb() {
	openNewWindow(searchType[currentSearchType].webURL + requestSearchParam.query);
}

function search() {
	requestSearchParam.query = $('#query').val();
	requestSearch(setSearchResult);
}

function goSearch(event) {
	if (event.keyCode === 13) {
		var searchResult = $('.search_result');

		search();

		// 한번 검색을 했을 경우 다시 엔터를 쳤을때 toggle이 되는걸 막는다.
		if (searchResult.css('display') === 'none') {
			toggleSearchResult();
		}
	}
}

function toggleSearchBar() {

	// 드래그가 아닐 경우에만 검색바 toggle
	if (!isDrag) {
		var searchResult = $('.search_result');
		if (searchResult.css('display') === 'block') {
			currentSearchType = 'blog';
			toggleSearchResult();
		}

		$('.green_window').toggle("slide", {
			direction : "right"
		}, 200,
			function() {
				$('#query').val('');

			});
	}
}

function selectSubType(event) {
	var newSelectType = event.target.id;

	if (newSelectType !== $(this).attr('id')) {
		if (newSelectType === 'all') {
			openNewWindow(searchType['all'].webURL + requestSearchParam.query);
		} else {
			currentSearchType = newSelectType;
			setSearchType();
			search();
		}
	}
}

function selectResult(event) {	
	var target = event.target.parentNode;
	url = '';
	isLink = false;
	
//	if(!($(target).parents('.title') === undefined) || !($(target).parents('.link') === undefined))
//	{
//		url = $(target).parents('.m_section').attr('id');
//		openNewWindow(url);
//	}
	
	if($(target).hasClass('title') || $(target).hasClass('link')){
		isLink = true;
	} else {
		target = target.parentNode;
		
		if($(target).hasClass('title') || $(target).hasClass('link')){
			isLink = true;
		} 
	}
	
	if(isLink){
		url = $(target).parents('.m_section').attr('id');
		openNewWindow(url);
	}
}

function viewMoreResult(event){
	var target = event.target.parentNode;
	
	console.log(target);
}
