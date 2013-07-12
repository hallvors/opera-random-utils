/**
* URL Player and DOM dumper script
* on load, script will
*    a) Check if a keyword exists in all JS
*    b) walk the DOM, create a very basic serialization
*    c) submit serialization
*    d) load next site
*/

//navigator.appName='Netscape';
var nextSiteDelay = 3500; // ms before loading next site

(function(){
	var startTime = new Date().getTime();
	var playerBackendURL = 'http://hallvord.com/opera/bugs/urlplayer.php'; // append this script to get next URL
	var playerURLList = 'wikilist.txt'; // file to pass to above backend as ?urlfile=

	if(location.href.indexOf(playerBackendURL)>-1) return;

	opera.addEventListener('AfterEvent.DOMContentLoaded', function(e){
		if(top==self ){
//				location.href=playerBackendURL+'?urlfile='+playerURLList;
			setTimeout(  submitDOMDump, nextSiteDelay );
		}
	}, false);
	setTimeout( submitDOMDump, nextSiteDelay+5000 ); /* a backup timeout just in case...  */
//	opera.addEventListener( 'AfterEvent.load', function(e){if( e.event.target instanceof Document ) { loadNextURL(); } }, false )


	function submitDOMDump(){
		var DOMDump = (function(n, ar, str){ if(n.nodeType!=3)ar.push( str+n.nodeName+' '+(n.id||'') );  for( var i=0,c;c=n.childNodes[i];i++ ){ arguments.callee(c, ar, str+' '); } return ar; })(document.documentElement, [], '').join('\r\n');
		//var i=document.body.appendChild(document.createElement('iframe'));i.src='about:blank';i.name='_opera_submit_frame';
		var f=document.documentElement.appendChild(document.createElement('form'));f.action=playerBackendURL+'?urlfile='+playerURLList;f.method='post';//f.target='_opera_submit_frame';
		var i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='DOM'; i.value=DOMDump;
		i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='hostname'; i.value=location.hostname;
		i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='loadtime'; i.value=(new Date()).getTime() - startTime;
		i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='reflowCount'; i.value=opera.reflowCount;
		i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='reflowTime'; i.value=opera.reflowTime;
		//i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='layoutTime'; i.value=opera.layoutTime;
//		i=f.appendChild(document.createElement('input')); i.type='hidden'; i.name='appNameFound'; i.value=opera._foundSearchString;
		setTimeout( function(){f.submit();}, 0);
	}


/*	function loadNextURL(){
		if( opera._urlplayerLoading ) return;
		var s=document.body.appendChild(document.createElement('script')); s.src=playerBackendURL+'?urlfile='+playerURLList;
		opera._urlplayerLoading=true;
	}*/
})()

window.alert=opera.postError;
window.confirm=function(){return true;};
window.prompt=function(a,b){return b;};
