<%@page import="com.mail.widget.ConstantValue"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>


<%
	String root = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<title>위젯</title>

<script>
	var forecastController = '<%=root%>' + '<%=ConstantValue.FORECAST_WEATHER%>?';
	//var forecastController = '<%=root%>/forecast?';
	var currentController = '<%=root%><%=ConstantValue.CURRENT_WEATHER%>?';
	var currentAirController = '<%=root%><%=ConstantValue.CURRENT_AIR%>?';
	var tmCoordinatesController = '<%=root%><%=ConstantValue.TM_COORDINATES%>?';
	var adjacentStationController = '<%=root%><%=ConstantValue.ADJACENT_STATION%>?';
	var searchController = '<%=root%>/search_query?';
</script>

<!-- <link type="text/css" rel="stylesheet" href="css/naver.css"></link> -->

</head>
<body>


	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<!-- <script src="js/jquery.xdomainajax.js"></script> -->

	<div id="widget">
		<%--
		<%@ include file="/WEB-INF/views/search_widget.jsp"%>
		 --%>
		<%@ include file="/WEB-INF/views/weather_widget.jsp"%>
	</div>





</body>
</html>