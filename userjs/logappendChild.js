//if(top!==self)undefined();
HTMLElement.prototype.toString=function(){
	var str='['+this.tagName;
	if(this.id)str+=' #'+this.id;
	if(this.className)str+=' .'+this.className;
	return str+']';
}
if(0)Element.prototype.appendChild =(function(dc){
	return function(s){
		var str=(new XMLSerializer()).serializeToString(s) ;
		//if(opera.dcl && /<script/i.test(str)){
			opera.postError('now appending a '+s+' element '+(s.src?s.src:'')+' to '+this+'\nIn window '+(window===top?'top':window.parent===top?'child win':'subchild')+' \nFrom: '+opera._curScript+'\n'+(window.event?'Event: '+window.event.type+' on '+window.event.target:'no event\n'+str));
			//if( s.nodeType==11 ){
				//opera.postError( (new XMLSerializer()).serializeToString(s) );
			//}
			if(window.event&&event.type==='load')debugger;
		//}
		//try{undefined();}catch(e){opera.postError(e);}
		return dc.call(this, s);
	}
})( Element.prototype.appendChild );

Element.prototype.removeChild =(function(dc){
	return function(s){
		opera.postError((window.event?window.event.target.outerHTML+' '+window.event.target.currentStyle.zIndex+'\'s '+window.event.type:'')+' now removing a '+s+' element in '+this+'\nFrom:'+opera._curScript);
		//try{undefined();}catch(e){opera.postError(e.stack);}
		return dc.apply(this, arguments);
	}
})( Element.prototype.removeChild );

Element.prototype.replaceChild =(function(dc){
	return function(s){
		var str=(new XMLSerializer()).serializeToString(s) ;
		opera.postError('now replacing a '+s+' element in '+this+'\nFrom:'+opera._curScript+'\n'+str);
		//try{undefined();}catch(e){opera.postError(e);}
		return dc.apply(this, arguments);
	}
})( Element.prototype.replaceChild );

if(1)Element.prototype.insertBefore =(function(dc){
	return function(s){
		var str=(new XMLSerializer()).serializeToString(s) ;
		if(str.indexOf('hasht')>-1){
		  debugger;
		  
		  opera.postError('now insertBefore-ing a '+s+' element in '+this+'\nFrom:'+opera._curScript+'\n'+str);
		}
		//try{undefined();}catch(e){opera.postError(e);}
		return dc.apply(this, arguments);
	}
})( Element.prototype.insertBefore );

if(1)(function(){
	var tmp=document.createElement('span');
	var gInner=tmp.__lookupGetter__('innerHTML');
	var sInner=tmp.__lookupSetter__('innerHTML');
	Element.prototype.__defineSetter__('innerHTML', function(str){
		if(str.indexOf('th_12e72ca19e49c9d0')>-1){ // Gmail
			opera.postError('now set innerHTML on '+this+'\n'+str.substr(0,200));
		}
		return sInner.apply(this,arguments);
	});
	Element.prototype.__defineGetter__('innerHTML', function(){
		//opera.postError('now read innerHTML on '+this);
		return gInner.apply(this,arguments);
	});
})()

/*window.setTimeout=(
	function(sT){
		return function(fu,tim){
			//if(tim==10)try{undefined();}catch(e){opera.postError('setTimeout '+e+' \n'+opera._curScript+fu);}
			return sT.call(window,fu,tim);
		};
	}
)(window.setTimeout);

window.setInterval=(
	function(sT){
		return function(fu,tim){
			//if(tim==10)try{undefined();}catch(e){opera.postError('setInterval '+e+' \n'+opera._curScript);}
			return sT.call(window,fu,tim);
		};
	}
)(window.setInterval);*/

opera.addEventListener('BeforeScript', function(e){
	if(e.element.src){
		opera._curScript=e.element.src;
	}else if( e.element.srcIndex ){
		opera._curScript=e.element.srcIndex;
	}else{
		opera._curScript=e.element.text.substr(0,200);
	}
}, false);
opera.addEventListener('AfterScript', function(){opera._curScript=undefined;}, false);

document.addEventListener('DOMContentLoaded', function(){
	opera.dcl=1;
	document.write=function(){
		opera.postError('WRITTEN AFTER LOAD: '+arguments+'\nWritten from?: '+opera._curScript);
	}
}, false);

 opera.addEventListener('BeforeEventListener.load', function(e){
	opera._curScript='load event on '+e.event.target+' '+e.listener;
}, false); /**/

 opera.addEventListener('AfterEventListener.load', function(e){
//	opera.postError('load event on '+e.event.target+' '+e.listener);
	opera._curScript=undefined;
}, false); /**/

//document.addEventListener('DOMSubtreeModified', function(e){ opera.postError('subtre modified: '+e.target); }, false)
/* document.addEventListener('DOMNodeInserted', function(e){
	if( e.target )
		opera.postError('node inserted : '+e.target.outerHTML);
	},
false);

<iframe src="http://ad.doubleclick.net/adi/cblvsn.nwsd/home;sz=300x250;tile=12;pos=bs2;ord=1014938267262886?" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no" bordercolor="#000000" id="dclk1014938267262886" height="250" width="300"/>


 */
