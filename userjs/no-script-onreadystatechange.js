function disableScriptOnreadystateSupport(){
	if(window.__defineSetter__){
		var orsh; 
		HTMLScriptElement.prototype.__defineSetter__('onreadystatechange', function(f){orsh=f;}); 
		HTMLScriptElement.prototype.__defineGetter__('onreadystatechange', function(){return orsh;}); 
	}
}
disableScriptOnreadystateSupport();

HTMLScriptElement.prototype.addEventListener = function(e,f,c){
	opera.postError('adding listener for '+e.src);
	if(e!='readystatechange')
		Element.prototype.addEventListener.call(this,e,f,c);
}