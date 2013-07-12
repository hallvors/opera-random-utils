(function(cr){
	document.createRange=function(){
		try{undefined();}catch(e){opera.postError('createRange called from '+e);}
		cr.apply(this,arguments);
	}
})(document.createRange);

HTMLTextAreaElement.prototype.select=(function(select){
	return function(){
		try{undefined();}catch(e){opera.postError('textarea.select() called from '+e);}
		select.apply(this, arguments);
	};
})(HTMLTextAreaElement.prototype.select);

opera.postError('applied selection tracking');