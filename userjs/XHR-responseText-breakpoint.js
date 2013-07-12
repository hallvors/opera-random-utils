/* images.google */
(function(){
	var tmp=new XMLHttpRequest();
	var gtr=tmp.__lookupGetter__('responseText');
	XMLHttpRequest.prototype.__defineGetter__('responseText', function(){
		debugger;
		return gtr.call(this);
	});
})();
