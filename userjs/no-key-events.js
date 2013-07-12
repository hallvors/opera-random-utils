opera.addEventListener('BeforeEventListener', function(e){
}, false);

opera.addEventListener('BeforeEventListener.load', function(e){
	if( e.event.target instanceof HTMLIFrameElement ){
		e.event.target.contentWindow.opera.addEventListener('BeforeEventListener', function(e){
			opera.postError(e.event.type);
			if( /^key/.test(e.event.type) ){ opera.postError(e.event.type+' blocked (in iframe) '+e.event.key+' ' +e.event.target);
					e.preventDefault();
			}
		}, false);
	}
}, false);