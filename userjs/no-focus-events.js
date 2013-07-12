opera.addEventListener('BeforeEventListener', function(e){
	if( e.event.type in {blur:1, focus:1/* , click:1 */} )e.preventDefault();
}, false)