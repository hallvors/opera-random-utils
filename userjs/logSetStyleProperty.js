//opera.postError('logfile active '+location.href);

(function(){
	var styleGetter=(document.createElement('div')).__lookupGetter__('style'); 
	Element.prototype.__defineGetter__('style', function(){
		var obj=styleGetter.call(this); //opera.postError(obj);
		if(obj)obj._elm=this;
		return obj;
	});

      function hackStyleProp(property, tagName){
	var originalSetter = (document.createElement('span')).style.__lookupSetter__(property);
	var originalGetter = (document.createElement('span')).style.__lookupGetter__(property);
	CSSStyleDeclaration.prototype.__defineSetter__( property,
	   function(value){
	      if( tagName==undefined || tagName == this._elm.tagName ){
		  opera.postError(property+'  set to '+value+'\n'+this._elm.outerHTML+' '+(this._elm.contentDocument?this._elm.contentDocument.compatMode:'')+' '+this._elm.src+' \n'+this._elm.contentWindow+' '+' '+this._elm.id );
		  try{diedida();}catch(e){opera.postError(value,e.stack);debugger;}
		}
		return originalSetter.call(this,value);
	   }
	);
	CSSStyleDeclaration.prototype.__defineGetter__( 'background',
	 function(){
		return originalGetter.call(this);
	 }
	);
      }
      // What to log..
      hackStyleProp('background');
})();
