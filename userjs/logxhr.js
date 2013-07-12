(function(){
var xhropen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(){
	opera.postError('open : '+arguments.join('", "'));
	xhropen.apply(this,arguments);
};
})()