(function (win){
	var document = (win&&win.location) ? win.document : self.document;
	var dmSetter=document.__lookupSetter__('designMode');
	document.__defineSetter__('designMode', function(state){
		debugger;
		// dmSetter.apply(this, arguments);
		document.body.contentEditable=state=='on';
	} );
	document.__defineGetter__('designMode', function(){
		debugger;
		// dmSetter.apply(this, arguments);
		return document.body.contentEditable==true ? 'on' : 'off';
	} );
	var func=arguments.callee;
	document.addEventListener( 'load', function(e){ //opera.postError(e.target);
		if(e.target.tagName=='IFRAME')func(e.target.contentWindow);
	}, true );
})();