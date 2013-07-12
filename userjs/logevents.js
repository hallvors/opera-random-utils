(function(){
	var logThese={/*click:1 load:1, focusin:1, click:1,keydown:1*/ /*, keypress:1, keyup:1*/ message:1};
	var first=true;
opera.addEventListener('BeforeEventListener', function(e){ if(e.event.type=='keydown' && e.event.keyCode==27){
	if(first){e.preventDefault();}
	if(e.event.type in logThese)opera.postError(e.event.type+' on '+e.event.target+(e.event.target.src||'')+' '+e.listener);// first=false;
}
//	if(e.event.type=='resize')e.preventDefault();
}, false);

opera.addEventListener('AfterEventListener', function(e){
	var info=/^key/.test(e.event.type) ?  ' keyCode: '+ e.event.keyCode : (e.event.data) ? '"'+ e.event.data+'" from '+e.event.origin : '';
	if(e.event.type in logThese)opera.postError(e.event.type+' on '+e.event.target+' '+info+' '+e.event.defaultPrevented);
//	if(e.event.type=='resize')e.preventDefault();
}, false);

})();
/*
document.addEventListener('keydown', function(e){e.preventDefault();}, false);
*/