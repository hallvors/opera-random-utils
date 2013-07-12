/*
Document / WebApp capture assistant
Makes potentially random stuff more predictable, makes some stuff loggable that normally wouldn't be

To be used with OpWatir capture script and/or Fiddler capture feature
*/

Math.random=function(){return 0};
top.opera._includes=[];
top.opera._regd={};
top.opera._cookie=document.cookie;
top.opera._ts=(new Date()).getTime();

(function(op){
	XMLHttpRequest.prototype.open=function(m,u,async){
		if( ! ( m+' '+u in top.opera._regd ) ){
			top.opera._includes.push( {m:m, u:u, obj:this } );
			top.opera._regd[m+' '+u]=true;
		}
		op.apply(this, arguments);
	}
})(XMLHttpRequest.prototype.open)