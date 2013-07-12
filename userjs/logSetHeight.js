(function(hsetter){
	hsetter=(document.createElement('iframe')).__lookupSetter__('height');
	Element.prototype.__defineSetter__('height', function(val){
		opera.postError('setting height to '+val+' on '+this);
		try{undefined();}catch(e){opera.postError(e.stack);}
		hsetter.apply(this,arguments);
	});
})();