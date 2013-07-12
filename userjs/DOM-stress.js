/*
* DOM-messup user JS
* The idea is to do a sort of live fuzz testing by doing random operations on the DOM during URL playing
*/

Math.random = (function(nativeRandom){return function(){ // to control seeds, we add some logging to Math.random()
	if( arguments.callee.store && arguments.callee.store.length){
		return arguments.callee.store.pop();
	}else{
		var rnd = nativeRandom.apply(Math, arguments);
		(new Image).src = 'http://projects/utils/logme.php?code='+rnd;
		return rnd;
	}
}
})(Math.random);

window.addEventListener('load', function(){ // if( ! confirm( 'DOMContentLoaded fired on '+this.URL+'. Start fuzz testing?' ) ) return;
//	document.removeEventListener('load', arguments.callee, false);
//setTimeout( function(){ //if(opera.fuzzing)return; opera.fuzzing=true; // trying to figure out why script seems to start over and over..
	//document.designMode='on';
(function( root, childNodeIndex ){
	var fuzzFunc=arguments.callee;
	childNodeIndex=childNodeIndex||0;
	var  propsList =  { /*
			this is a "methods/properties map", mainly useful for methods to see what sort of arguments they expect
			It can also be used to access methods/properties that are dontEnum on the actual DOM object. For each
			node in the DOM we'll either enumerate the actual node or this object, for that reason.
		*/
		activeElement: {  type:"object", arguments: ""},
		alinkColor: {  type:"string", arguments: ""},
		all: {  type:"object", arguments: ""},
		anchors: {  type:"object", arguments: ""},
		applets: {  type:"object", arguments: ""},
		attributes: {  type:"object", arguments: ""},
		bgColor: {  type:"string", arguments: ""},
		body: {  type:"object", arguments: ""},
		characterSet: {  type:"string", arguments: ""},
		charset: {  type:"string", arguments: ""},
		childNodes: {  type:"object", arguments: ""},
		compatMode: {  type:"string", arguments: ""},
		cookie: {  type:"string", arguments: ""},
		defaultView: {  type:"object", arguments: ""},
		designMode: {  type:"string", arguments: ""},
		dir: {  type:"string", arguments: ""},
		doctype: {  type:"object", arguments: ""},
		document: {  type:"object", arguments: ""},
		documentElement: {  type:"object", arguments: ""},
		documentURI: {  type:"string", arguments: ""},
		domain: {  type:"string", arguments: ""},
		embeds: {  type:"object", arguments: ""},
		fgColor: {  type:"string", arguments: ""},
		firstChild: {  type:"object", arguments: ""},
		forms: {  type:"object", arguments: ""},
		frames: {  type:"function", arguments: "NUMBER"},
		images: {  type:"object", arguments: ""},
		implementation: {  type:"object", arguments: ""},
		lastChild: {  type:"object", arguments: ""},
		lastModified: {  type:"string", arguments: ""},
		linkColor: {  type:"string", arguments: ""},
		links: {  type:"object", arguments: ""},
		localName: {  type:"object", arguments: ""},
		location: {  type:"object", arguments: ""},
		namespaceURI: {  type:"object", arguments: ""},
		nextSibling: {  type:"object", arguments: ""},
		nodeName: {  type:"string", arguments: ""},
		nodeType: {  type:"number", arguments: ""},
		nodeValue: {  type:"string", arguments: ""},
		ownerDocument: {  type:"object", arguments: ""},
		parentNode: {  type:"object", arguments: ""},
		parentWindow: {  type:"object", arguments: ""},
		plugins: {  type:"object", arguments: ""},
		prefix: {  type:"object", arguments: ""},
		previousSibling: {  type:"object", arguments: ""},
		readyState: {  type:"string", arguments: ""},
		referrer: {  type:"string", arguments: ""},
		scripts: {  type:"object", arguments: ""},
		selection: {  type:"object", arguments: ""},
		styleSheets: {  type:"object", arguments: ""},
		textContent: {  type:"object", arguments: ""},
		title: {  type:"string", arguments: ""},
		vlinkColor: {  type:"string", arguments: ""},
		form1: {  type:"object", arguments: ""},
		onload: {  type:"object", arguments: ""},
		onunload: {  type:"object", arguments: ""},
		getElementsByName: {  type:"function", arguments: "STRING"},
		elementFromPoint: {  type:"function", arguments: "NUMBER, NUMBER"},
		captureEvents: {  type:"function", arguments: ""},
		releaseEvents: {  type:"function", arguments: ""},
		getSelection: {  type:"function", arguments: ""},
		moveFocusUp: {  type:"function", arguments: ""},
		moveFocusDown: {  type:"function", arguments: ""},
		moveFocusLeft: {  type:"function", arguments: ""},
		moveFocusRight: {  type:"function", arguments: ""},
		createDocumentFragment: {  type:"function", arguments: ""},
		createEvent: {  type:"function", arguments: "STRING"},
		createRange: {  type:"function", arguments: ""},
		createProcessingInstruction: {  type:"function", arguments: ""},
		importNode: {  type:"function", arguments: "NODE"},
		adoptNode: {  type:"function", arguments: "NODE"},
		createNSResolver: {  type:"function", arguments: ""},
		setFocus: {  type:"function", arguments: ""},
		getCurrentFocusedObject: {  type:"function", arguments: ""},
		createElement: {  type:"function", arguments: "STRING"},
		createElementNS: {  type:"function", arguments: "STRING,STRING"},
		createAttribute: {  type:"function", arguments: "STRING"},
		createAttributeNS: {  type:"function", arguments: "STRING,STRING"},
		createTextNode: {  type:"function", arguments: "STRING"},
		createComment: {  type:"function", arguments: "STRING"},
		createCDATASection: {  type:"function", arguments: "STRING"},
		getElementById: {  type:"function", arguments: "STRING"},
		getElementsByClassName: {  type:"function", arguments: "STRING"},
		createNodeIterator: {  type:"function", arguments: "NODE,NUMBER,OBJECT,BOOLEAN"},
		createTreeWalker: {  type:"function", arguments: "NODE,NUMBER,OBJECT,BOOLEAN"},
		getElementsByTagName: {  type:"function", arguments: "STRING"},
		getElementsByTagNameNS: {  type:"function", arguments: "STRING,STRING"},
		createExpression: {  type:"function", arguments: "STRING"},
		evaluate: {  type:"function", arguments: "STRING"},
		ELEMENT_NODE: {  type:"number", arguments: ""},
		ATTRIBUTE_NODE: {  type:"number", arguments: ""},
		TEXT_NODE: {  type:"number", arguments: ""},
		CDATA_SECTION_NODE: {  type:"number", arguments: ""},
		ENTITY_REFERENCE_NODE: {  type:"number", arguments: ""},
		ENTITY_NODE: {  type:"number", arguments: ""},
		PROCESSING_INSTRUCTION_NODE: {  type:"number", arguments: ""},
		COMMENT_NODE: {  type:"number", arguments: ""},
		DOCUMENT_NODE: {  type:"number", arguments: ""},
		DOCUMENT_TYPE_NODE: {  type:"number", arguments: ""},
		DOCUMENT_FRAGMENT_NODE: {  type:"number", arguments: ""},
		NOTATION_NODE: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_DISCONNECTED: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_PRECEDING: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_FOLLOWING: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_CONTAINS: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_CONTAINED_BY: {  type:"number", arguments: ""},
		DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {  type:"number", arguments: ""},
		dispatchEvent: {  type:"function", arguments: "OBJECT"},
		insertBefore: {  type:"function", arguments: "NODE,NODE"},
		hasChildNodes: {  type:"function", arguments: ""},
		cloneNode: {  type:"function", arguments: "BOOLEAN"},
		isSupported: {  type:"function", arguments: "STRING"},
		hasAttributes: {  type:"function", arguments: ""},
		isSameNode: {  type:"function", arguments: "NODE"},
		getFeature: {  type:"function", arguments: "STRING,STRING"},
		compareDocumentPosition: {  type:"function", arguments: "NODE"},
		addEventListener: {  type:"function", arguments: "STRING,FUNCTION,BOOLEAN"},
		removeEventListener: {  type:"function", arguments: "STRING,FUNCTION,BOOLEAN"},
		attachEvent: {  type:"function", arguments: "STRING,FUNCTION"},
		detachEvent: {  type:"function", arguments: "STRING,FUNCTION"},
		lookupPrefix: {  type:"function", arguments: "STRING"},
		isDefaultNamespace: {  type:"function", arguments: "STRING"},
		lookupNamespaceURI: {  type:"function", arguments: "STRING"},
		selectNodes: {  type:"function", arguments: "STRING"},
		selectSingleNode: {  type:"function", arguments: "STRING"},
		addEventSource: {  type:"function", arguments: "STRING"},
		removeEventSource: {  type:"function", arguments: "STRING"},
		normalize: {  type:"function", arguments: ""},
		 splitText: {type:"function", arguments:"NUMBER"} ,
		replaceChild: {  type:"function", arguments: "NODE,NODE"},
		removeChild: {  type:"function", arguments: "NODE"},
		appendChild: {  type:"function", arguments: "NODE"}
/*end object / method map */ };
 var ignoreMe = { /*
		this is a list of methods we don't call .. ever.. and properties we don't set.  Property value explains why.
	*/
	'write': 'no document overwrite.. ', 'writeln': 'ditto', 'URL': 'no navigation', 'location':'no navigation', 'open':'no document replacement, avoid user js running again?'};
 var destructive = { /*
		This is a list of methods/properties we call/set less often than the others. Property values or comments explain why.
	*/
	click:'click will follow links and cause navigation, don\'t call it too often ',
	removeChild:'removes document, terminates/limits fuzzing', replaceChild:'ditto', removeNode:'ditto',  /* can mess up more than intended by removing most of the document */
	textContent:'', innerHTML:'', outerHTML:'', innerText:'', text:'', textContent:'', outerText:'', nodeValue:'' /* ditto - if these are set too often the recursion can get into bad loops */
	, cloneNode:'' /* crashes WinGOGI 542 sometimes, bug 298897 */
 };
self.opera.fuzzcount=self.opera.fuzzcount||0;
var currentNodeDesc=''; var lastSeenSourceIndex; /* these are used to try to log exactly what we do to every node we come across */
var rnd;
if( location.search.match(/rnd=(\d*)/) ){ /* we support passing a random seed in address with ?rnd=XXXXXX */
	rnd = RegExp.$1;
}else{
	rnd = Math.floor(Math.random() * 1000000 + (new Date()).getMilliseconds());
}

var rndFun = randomizer(rnd);
opera.postError('Running on '+window.location+' with seed: '+rnd);
var log = location.search.match('logfuzz')?true:false; /* we support turning logging on/off with ?logfuzz in URL */

//if(root.nodeType == 3)return; /*  if this is enabled we skip text nodes to make the entire fuzz process faster. Note that getting into loops is still possible, yet slightly less frequent.  */

for(var cn=childNodeIndex;cn<root.childNodes.length;cn++){
	var prop, elm = root.childNodes[cn];
	if( log && (! lastSeenSourceIndex || lastSeenSourceIndex != elm.sourceIndex)){
		currentNodeDesc=describePathToNode(elm); /* get an absolute path / identification for the node we're dealing with */
		lastSeenSourceIndex = elm.sourceIndex;/* sourceIndex is an IE thing, Opera supports it too. Handy here though it's not as unique an identification as we might like (say last operation on a node removes that node and we move on to next - it would now have same sourceIndex so currentNodeDesc would not be updated...) */
		logme('elm = '+currentNodeDesc);
		currentNodeDesc='elm';
	}
	for( prop in (rndFun(2)==1 ? propsList : elm)  ){ /* we either enumerate propsList or elm, to make sure we sometimes mangle dontEnum stuff - if any - */
		//alert( prop +' on '+elm.nodeName);
		if(prop in ignoreMe)continue;
		if(prop in destructive){if(rndFun(300)!=35){continue;}} /* do "destructive" things relatively less often - statistically once in every 300 props */
		self.opera.fuzzcount++; /* for statistics.. */
		try{
			switch(typeof (elm[prop])){
					/* here we might add values.. methods.. whatever. */
				case 'string':
				case 'number':
//					if(!confirm( prop+' on '+elm.nodeName ))continue;
					var value = createArguments( (typeof (elm[prop])).toUpperCase() );
					if(log)logme( currentNodeDesc+'.'+prop+' = '+value.string+';');
					elm[prop] = value.argument;
					break;
				case 'function' :
					var arArgs =  createArgumentsArray(propsList[prop] ? propsList[prop].arguments : '' ) ;
					if(log)logme( currentNodeDesc+'[\''+prop+'\'].apply('+currentNodeDesc+','+(arArgs.strings.join(', ')||'[]')+')' );
//					if(!confirm( prop+' on '+elm.nodeName+' with '+arArgs ))continue;
					try{top.document.title=(self.opera.fuzzcount+' '+ prop+' on '+elm.nodeName+' with '+arArgs.strings );}catch(e){}
					elm [ prop ] . apply(elm, arArgs.arguments);
				case 'object' :
					elm[prop] && elm[prop].length ? /* this is a collection.. */  collectionMess(elm[prop], currentNodeDesc+'.'+prop) : '';
					break;
				default:
					;
			}
		}catch(e){/* opera.postError(e); */}
		try{ /* abusing new keyword - fuzzing across the ES / DOM boundary */
			if(log)logme( 'var obj = new '+currentNodeDesc+'[\''+prop+'\'];' );
			var obj = new elm[prop];
		}catch(e){}
		try{ /* abusing new keyword - fuzzing across the ES / DOM boundary */
			if(log)logme( 'var obj = new '+currentNodeDesc+'[\''+prop+'\'][\'constructor\'];' );
			var obj = new elm[prop]['constructor']; /* mostly Object .. */
		}catch(e){}
		try{ /* silly tricks with prototype keyword */
			value = createArgumentsRandomType();
			if(log)logme( 'var obj = '+currentNodeDesc+'[\''+prop+'\'][\'prototype\'] = '+value.string+';' );
			elm[prop]['prototype'] = value.argument;
		}catch(e){}
		try{ /* in operator */
			value = createArgumentsRandomType();
			if(log)logme( ' if( '+value.string+' in '+currentNodeDesc+'[\''+prop+'\'] );' );
			if( value.argument in elm[prop] );
		}catch(e){}
	}
	try{
		if(elm.hasAttributes())arguments.callee(elm.attributes); /*recurse over attributes too!..*/
	}catch(e){}
	try{
		if(elm.hasChildNodes()){
			setTimeout( function(){ fuzzFunc(elm); }, 50);/*recurse..*/
		}
	}catch(e){}
}
if(root==document)document.title='Done?!';

function collectionMess(col, desc){ /* what are the silliest things you can try to do with a collection? */
	var el;
	try{
		if(log)logme( 'Array.prototype.sort.call('+desc+');' )
		Array.prototype.sort.call(col)
	}catch(e){}
	try{
		if(log)logme( desc+'.length = '+desc + '.length - 1 ;' );
		col.length = col.length - 1;
	}catch(e){}
	for( var i=0; i<col.length; i++ ){
		try{
			if(log)logme( 'el = '+desc+'.item.call('+desc + ', '+i+') ;' );
			el=col.item.call(col, i);
		}catch(e){}
		if(log)logme( 'delete '+desc+'['+i+']' );
		delete col[i];
	}
}

function describePathToNode(node){ /* for logging, this tries to find an "absolute" reference to any element, text or attribute node in the DOM */
	if(!node)return;
	if(node==document)return 'document';
	if(node==document.firstChild)return 'document.firstChild';
	var str='document.';
	var element = (node.ownerElement) ? node.ownerElement : (node.tagName)?node:node.parentNode;
//	opera.postError( node+' '+element+' '+document+' element.tagName? '+element.tagName );
	if(element.tagName){ /* we're trying to resolve a reference to an actual element */
		var tmpcol = document.getElementsByTagName(element.tagName); var tmpel,i=0;
		for(tmpcol[i];tmpel=tmpcol[i];i++){
			if( tmpel == element )break;
		}
		str+='getElementsByTagName(\''+element.tagName+'\')['+i+']';
	}
	if( element != node ){ /* the node we are looking for is likely an attribute or text node, we've found its parent/ownerNode though */
		tmpcol = (node.ownerElement) ? tmpel.attributes : tmpel.childNodes;
		for(var j=0;j<tmpcol.length;j++){
			if(tmpcol[j]==node){
				str+='.'+(node.ownerElement ? 'attributes' : 'childNodes')+'['+j+']';
				break;
			}
		}
	}
	return str;
}

function createArgumentsArray( strArgs ){ /* this function is a little bit complex to support more detailed logging: it returns an object with a property 'arguments' - the actual arguments, and 'strings' - textual descriptions of the arguments suitable for a log statement */
	if( strArgs.length==0 )return {arguments:[], strings:[]};

	var args = strArgs.split(','), obj={arguments:[],strings:[]};
	for( var i=0; i<args.length; i++ ){
		args[i] = createArguments( args[i] );
		obj.arguments.push(args[i].argument);
		obj.strings.push( args[i].string ? args[i].string : '\''+args[i].argument+'\'' );
	}
	return obj;
}

function createArguments(strArg){/* this function is also complex to support more detailed logging: it returns an object with a property 'argument' - the actual js object, and 'string' - the JS code to create the JS object as a string for a log statement */
	switch (strArg){
		case 'STRING' :
			switch( rndFun(6) ){
				case 0:
					var tmp = (new Array(1024)).join('a') ;
					return { argument: tmp, string: '(new Array(1024)).join(\'a\')' };
				case 1:
					return {argument: '-512px', string:'\'-512px\'' };
				case 2:
					var tmp = document.body?document.body.innerHTML:document.documentElement.outerHTML;
					var tmp2 = document.body?'document.body.innerHTML':'document.documentElement.outerHTML';
					return {argument: tmp, string: tmp2};
				case 3:
					return {argument: '', string:'\'\''};
				case 4:
					return {argument: window.location.href.replace(window.location.search, ''), string: '\''+window.location.href.replace(window.location.search, '')+'\''};
				case 5:
					return {argument: 'http://www.w3.org/1999/xhtml', string: '\'http://www.w3.org/1999/xhtml\''};
			}
		case 'FUNCTION':
			return {argument: Function, string: 'Function' };
		case 'BOOLEAN':
			var tmp = rndFun(2)==1;
			return {argument: tmp, string: tmp}
		case 'NODE' :
			switch( rndFun(9) ){
				case 0:
					return {argument: document, string: 'document'};
				case 1:
					var tmp=document.body?document.body.lastChild:document.createElementNS('http://www.w3.org/1999/xhtml', 'span');
					var tmp=document.body?'document.body.lastChild':'document.createElementNS(\'http://www.w3.org/1999/xhtml\', \'span\')';
					return {argument: tmp, string: tmp2};
				case 2:
					var tmp = createArguments('STRING');
					return { argument: document.createTextNode( tmp.argument ), string: 'document.createTextNode('+tmp.string+')'};
				case 3:
					return {argument: document.createElement('div'), string: 'document.createElement(\'div\')' };
				case 4:
					return {argument: document.documentElement, string: 'document.documentElement'} ;
				case 5:
					var tmp = document.body?document.body.cloneNode(true) : document.documentElement.cloneNode(true);
					var tmp2 = document.body?'document.body.cloneNode(true)' : 'document.documentElement.cloneNode(true)';
					return {argument: tmp, string: tmp2};
				case 6:
					return {argument: document.createElementNS('http://www.w3.org/2000/svg', 'foo'), string: 'document.createElementNS(\'http://www.w3.org/2000/svg\', \'foo\')'};
				case 7:
					return {argument: document.createDocumentFragment(), string:'document.createDocumentFragment()'};
				case 8:
					return {argument: document.createElement('script'), string:'document.createElement(\'script\')'};
			}
		case 'NUMBER':
			var tmp = rndFun(122039);
			return {argument: tmp, string: tmp}
		case 'OBJECT':
			return {argument:{}, string: '{}'};
		default:
			alert( 'Don\'t know '+strArg )
	}
}

function createArgumentsRandomType(){
	switch( rndFun(6) ){
		case 0:
			return createArguments('STRING');
		case 1:
			return createArguments('NUMBER');
		case 2:
			return createArguments('OBJECT');
		case 3:
			return createArguments('NODE');
		case 4:
			return createArguments('BOOLEAN');
		case 5:
			return createArguments('FUNCTION');
	}
}

function logme( code ){
	opera.postError( 'try{ \n\t'+code+'\n}catch(e){}' );
}

// Given a seed, returns a function that generates random integers.
// Based on the Central Randomizer 1.3 (C) 1997 by Paul Houle (paul@honeylocust.com)
// See: http://www.honeylocust.com/javascript/randomizer.html
function randomizer(seed)
{
   // Returns a somewhat random real number between 0 (inclusive) and 1 (not inclusive), like Math.random() but with a seed I control.
   // Modulus is in parens to work around a Crunchinator bug.

   function rndReal() {
	seed = (seed*9301 + 49297) % (233280);
	return seed/(233280.0);
   };

   // Returns a somewhat random integer in the range {0, 1, 2, ..., number-1}
   function rndInt(number) {
	return Math.floor(rndReal() * number);
   };

   return rndInt;
}
}
//)(document);}, 1000);
)(document);}, false);