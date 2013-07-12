(function(){
/*
Purpose: try to log all GMail's innerHTML usage
*/

	var setter = document.createElement('span').__lookupSetter__('innerHTML');
	var getter = document.createElement('span').__lookupGetter__('innerHTML');
	
	(function(win){
		win.Element.prototype.__defineSetter__('innerHTML', function(str){
			if(str.indexOf('blank.')>-1){
				str=str.replace(/\s*items/g, '');
				opera.postError('setting '+stringify_node(this)+'.innerHTML to \n'+str);
			}
			return setter.apply(this, arguments);
		});
		
		win.Element.prototype.__defineGetter__('innerHTML', function(){
			return getter.apply(this, arguments);
		});
		
		for( var i=0; i<win.frames.length;i++ )arguments.callee(win.frames[i]);
	})(top);
	
	var stringify_node=function(n){
		var str='';
		if(n.ownerDocument)str='doc in '+n.ownerDocument.URL+'\'s doc '+n.ownerDocument.compatMode;
		str+=' <'+n.tagName+' ';
		if(n.className)str+='.'+n.className+' ';
		if(n.id)str+='#'+n.id+' ';
		return str+'> ';
	}
	
})();

