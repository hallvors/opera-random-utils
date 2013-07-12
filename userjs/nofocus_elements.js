opera.addEventListener('BeforeEvent.mousedown', function(e){
  opera.postError('  '+e.event.target);
}, false);

//HTMLElement.prototype.focus =
/* HTMLElement.prototype.scrollIntoView =  */function(){
  opera.postError( 'tried to focus or scroll to '+this.outerHTML );
};
