document.createElement=(function(dc){
	return function(s){
		opera.postError('now creating a '+s+' element');
		try{undefined();}catch(e){opera.postError(e);}
		return dc.call(document, s);
	}
})(document.createElement)

//document.addEventListener('DOMSubtreeModified', function(e){ opera.postError('subtre modified: '+e.target); }, false)
/* document.addEventListener('DOMNodeInserted', function(e){

if( e.target && e.target.outerHTML && e.target.outerHTML.indexOf('demoPane')>-1 )
opera.postError('node inserted : '+e.target.outerHTML);


}, false);
 */
/*
	var postError = opera.postError,
	call = Function.prototype.call,
	indexOf=String.prototype.indexOf,
	lastIndexOf=String.prototype.lastIndexOf,
	replace=String.prototype.replace,
	match=String.prototype.match,
	toLowerCase=String.prototype.toLowerCase,
	getAttribute=Element.prototype.getAttribute,
	setAttribute=Element.prototype.setAttribute,
	insertBefore=Element.prototype.insertBefore,
	insertAdjacentHTML=Element.prototype.insertAdjacentHTML,
	defineMagicVariable=opera.defineMagicVariable,
	defineMagicFunction=opera.defineMagicFunction,
	version=opera.version,
	getElementById=Document.prototype.getElementById,
	appendChild=Document.prototype.appendChild,
	evaluate=Document.prototype.evaluate,
	getElementsByTagName=Document.prototype.getElementsByTagName,
	createElement=Document.prototype.createElement,
	createTextNode=Document.prototype.createTextNode,
	stopPropagation=Event.prototype.stopPropagation,
	preventDefault=Event.prototype.preventDefault,
	getComputedStyle=window.getComputedStyle,
	slice=Array.prototype.slice,
	setTimeout=window.setTimeout,
	evaluate=document.evaluate,
	isNaN=window.isNaN;

document.addEventListener('load', function(e){

	//addCssToDocument( 'opacity: inherit !important' );opera.postError('added opacity');
	if(e.event.target.tagName=='IFRAME')
	for(var els=document.getElementsByTagName('*'),el=null,i=0;el=els[i];i++){
		if(el.style.opacity) el.style.opacity=''; opera.postError(el.tagName);
	}

},true);


	function addCssToDocument(cssText, doc, mediaType){
		getElementsByTagName.call=addEventListener.call=createElement.call=createTextNode.call=insertBefore.call=setAttribute.call=appendChild.call=version.call=call;
		doc = doc||document;
		mediaType = mediaType||'';
		addCssToDocument.styleObj=addCssToDocument.styleObj||{};
		var styles = addCssToDocument.styleObj[mediaType];
		if(!styles){
			var head = getElementsByTagName.call(doc, "head")[0];
			if( !head ){
				var docEl = getElementsByTagName.call(doc, "html")[0]||doc.documentElement;
				if(!docEl){
					// :S this shouldn't happen - see if document hasn't loaded
					addEventListener.call(doc, opera&&version.call(opera)>=9?'DOMContentLoaded':'load',
					function(){ addCssToDocument(cssText, doc); },false);
					return;
				}
				head = createElement.call(doc, "head");
				if(head) insertBefore.call(docEl, head,docEl.firstChild);
				else head = docEl;
			}
			addCssToDocument.styleObj[mediaType] = styles = createElement.call(doc, "style");
			setAttribute.call(styles, "type","text/css");
			if(mediaType)setAttribute.call(styles, "media", mediaType);
			appendChild.call(styles, createTextNode.call(doc,' '));
			appendChild.call(head, styles)
		}
		styles.firstChild.nodeValue += cssText+"\n";
		return true;
	}
*/
