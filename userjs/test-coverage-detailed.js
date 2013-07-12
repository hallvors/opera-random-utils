/*
* Tracking test coverage (personal)
*/
(function(storage){
	var testSuitePrefixes = ['http://w3c-test.org/web-platform-tests/master/', 'http://w3c.test/', 'http://www2.w3c.test/'];
	var specPrefixes = ['http://xhr.spec.whatwg.org/', 'http://www.w3.org/TR/XMLHttpRequest/', 'https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html'];
	var suite = 'XMLHttpRequest';
	var tcInfo={}, tc;
	tc = location.href.substr(location.href.indexOf(suite));
	if(storage.getItem(tc))opera.postError('data already exists: '+storage.getItem(tc))
	function runInTestsuite(tests){
		if(!tc)return;
		tcInfo.refdata=[];
		if (tests && tests instanceof Array) {
			tcInfo.passes = 0, tcInfo.failures = 0;
			tests.forEach(function (testInfoObj) {
				if(testInfoObj.status === 0){
					tcInfo.passes ++;
				}else{
					tcInfo.failures ++; // todo - consider tracking failures like "timeout" and "not run"
				}
			});
		var hasHelpLinks = false;
		for(var link, links = document.getElementsByTagName('link'), i=0; link=links[i]; i++){
			if(link.rel !== 'help')continue;
			tcInfo.refdata.push({ ref:link.href.match(/#.*/)[0], xpath:link.getAttribute('data-tested-assertations') })
			hasHelpLinks = true;
		}
		var evt = document.createEvent('Event'); // This is a hack because opera.scriptStorage can only be used from user JS event listeners, 
		evt.initEvent('_o_ujs_custom_save_data', false, false); // not from a thread initiated by a page callback like runInTestsuite is
		window.dispatchEvent(evt);
		if(!hasHelpLinks){opera.postError(document.title = 'Ops! no LINK tags.. '+tc)}
		}
	}
	function runInSpec(){
		opera.postError('in spec, data: '+storage.length)
		for(var i=0, key, data; i<storage.length; i++){
			key = storage.key(i);
			//opera.postError(key +': '+storage[key])
			var tcInfo = JSON.parse(storage[key]);
			data = tcInfo.refdata ? tcInfo.refdata : tcInfo;
			if (!('passes' in tcInfo)) {tcInfo.passes=0;tcInfo.failures=0}; // hack to make old stored stats work
			//opera.postError(key+'\n'+data+' '+data.length)
			for (var j = 0; j < data.length; j++) { 
				var ref = data[j].ref.substr(1);
				var elm = document.getElementById(ref);
				if(!elm){
					opera.postError('WARNING: no elm#'+ref +' '+key+' in '+location.href);
					continue;
				}
				if(!data[j].xpath)continue; // some tests don't have xpath info yet
				var xpaths = data[j].xpath.split(/ /);
				//opera.postError(xpaths.length+' '+xpaths)
				for(var k = 0; k < xpaths.length; k++){
					if(xpaths[k].indexOf('/') === 0)xpaths[k] = xpaths[k].substr(1); // pardon, it was wrong to start those expressions with a slash..
					try{
						var iterator = document.evaluate(xpaths[k], elm, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
					}catch(e){
						opera.postError('ERROR: syntax error in selector '+xpaths[k]+' for '+ref+', '+key);
						continue;
					}
					var thisElm = iterator.iterateNext();
					if (!thisElm) {
						opera.postError('WARNING: no elm found by selector '+xpaths[k]+' in context '+ref+', '+key+' '+location.href);
						continue;
					};
					var img;
					if (thisElm.tagName == 'TR') {thisElm = thisElm.getElementsByTagName('td')[0]};
					(img = thisElm.insertBefore(new Image(), thisElm.firstChild)).src = tcInfo.passes > 0 && tcInfo.failures == 0 ? greenCheckMark : tcInfo.passes > 0 && tcInfo.failures > 0 ? redGreenMark : redMark;
					img.title='tested in '+key;
					img.style.cssFloat = 'left';
				};
			};
		}
	}

	testSuitePrefixes.forEach(function(value){
		if (value && location.href.indexOf(value) === 0) {
			//document.addEventListener('DOMContentLoaded', runInTestsuite);
			opera.addEventListener('AfterScript', function(){
				if (typeof add_completion_callback === 'function') {
					add_completion_callback(runInTestsuite);
					opera.removeEventListener('AfterScript',arguments.callee, false)
				};
			}, false);
		};
	});
	specPrefixes.forEach(function(value){
		if (value && location.href.indexOf(value) === 0) {
			document.addEventListener('DOMContentLoaded', runInSpec);
		};
	});
	var greenCheckMark = 'data:image/gif;base64,R0lGODlhFAAQALMAAAAAAP%2F%2F%2FwCAADOZM2bMZmaZZpnMmcz%2FzMzMzMDAwP%2F%2F%2FwAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAAUABAAAAQwMMhJq704650T4VVRgNQwktIwoKlwcK9UCAhnCOv9gYNA4KiDYJhg9U4ow47FZEUAADs%3D';
	var redMark = 'data:image/gif;base64,R0lGODlhFAAQAOMIAPUAfv4ymf5mmf9lzP%2BZzP%2FN%2Fv%2Ff3%2F%2Fl5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH%2BEUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAFAAQAAAEMBDJSau9OOudzeCVIIBUMJJSEKApUHCvJAAHRwDr%2FYEBMOCoAmBoYPVOKMKOxWRFAAA7';
	var redGreenMark = 'data:image/gif;base64,R0lGODlhFAAQAOMNAPoAfgCAAP8zmDOZM%2F9nmf9my2bMZv%2Bay5nMmf%2FAwP%2FMzP%2FN%2Fsz%2FzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH%2BEUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAFAAQAAAEM7DJSau9OOudU%2BEVQYCUMJKSIKApsHDMRAAKhwRDcwAfOAQGwIrECAQACdbvhEIYWNBoBAA7';
	opera.addEventListener('BeforeEvent._o_ujs_custom_save_data', function(){
		storage[tc] = JSON.stringify(tcInfo);
		opera.postError('saved data for '+tc+'\n'+storage[tc]);
	}, false);
})(opera.scriptStorage)

opera.addEventListener('BeforeExternalScript', function(e){
	if(e.element.src.indexOf('coverage.js')>-1)e.preventDefault(); // the elements coverage.js add might mess up our logic..
})
