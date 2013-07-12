(function( setCN, getCN ){
	Element.prototype.__defineSetter__('innerHTML', function(n){
		if(n=='')n='&nbsp;';
		if(this.tagName=='SPAN' && ! isNaN(n) ){
			opera.postError(' set innerHTML of  '+this.outerHTML+' to '+n);
			//return n;
		}
		if(n=='' && this.contentEditable){
			try{undefined();}catch(e){opera.postError(e.stack);}
		}
		return setCN.call(this, n);
	});
	Element.prototype.__defineGetter__('innerHTML', function(){
		return getCN.call(this);
	});
})( document.createElement('div').__lookupSetter__('innerHTML'), document.createElement('div').__lookupGetter__('innerHTML') );
