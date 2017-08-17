
module.exports = (function(){
	
	function ForcastInfo(dateTime, category, value){
		this.dateTime = dateTime;
		this.category = category;
		this.value = value;
	}
	
	return ForcastInfo;
}());