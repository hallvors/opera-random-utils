(function(rme){
  Element.prototype.removeEventListener=function(t,f,a){
    if(t in {click:1,mousedown:1})opera.postError('removing '+t+' listener from '+this+' '+(this.tagName? this.tagName+' .'+this.className+' #'+this.id :''));
    return rme.call(this,t,f,a);
  }
  window.removeEventListener=document.removeEventListener=Element.prototype.removeEventListener;
})(Element.prototype.removeEventListener);

(function(rme){
  Element.prototype.addEventListener=function(t,f,a){
    if(t in {click:1,mousedown:1})opera.postError('adding '+t+' listener for '+this+' '+(this.tagName? this.tagName+' .'+this.className+' #'+this.id :''));
    return rme.call(this,t,f,a);
  }
  window.addEventListener=document.addEventListener=Element.prototype.addEventListener;
})(Element.prototype.addEventListener);

