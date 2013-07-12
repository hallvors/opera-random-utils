document.write=document.writeln=( function(orig){ return function(s){
//	if(document.readyState=='complete'){
	try{ undefined();}catch(e){
		opera.postError('doc.write called '+' with stack: \n'+e.stack+/**/'\n\n readyState: '+document.readyState+'\nscripts: '+document.getElementsByTagName('script').length+' frames: '+window.frames.length+'\n\n inserted node: \n\n'+s);
	}
//	}else{
		orig.apply(document, arguments);
//	}
}
} )(document.write)
opera.addEventListener('BeforeScript', function(e){
	if(!top.opera.scriptlog)top.opera.scriptlog=[];
	top.opera.scriptlog.push(e.element);
	opera.postError( e.element.sourceIndex +' in '+document.location+'\n'+e.element.src+'\n'+e.element.text.substr(0, 300) );
}, false);
/*
*/
/*
(function(dw){
document.write=function( str ){
	opera.postError('doc.write '+str.length);
	dw.call(this,str);
	}})(document.write);*/
document.addEventListener('DOMContentLoaded', function(){
	opera.postError('DCL '+location.href);
}, false);