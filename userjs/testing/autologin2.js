/* (function (storage, opera, window, document) { //log=function(){}
  var interval;
  window.addEventListener('load', function(){
    interval = setInterval( findLoginForm, 1000 );
  }, false);
  function findLoginForm(){
    // First we try to find a form that contains one password input
    var candForms=[], frmDesc, type;
    for(var i=0; i<document.forms.length; i++){
      frmDesc={};
      for(var j=0; j<document.forms[i].elements.length; j++){
	type=document.forms[i].elements[j].type;
	frmDesc[ type ] = frmDesc[ type ] ?  frmDesc[ type ] +1 : 1;
      }
      if(frmDesc.password==1)candForms.push([document.forms[i], frmDesc]);
    }
    if( candForms.length == 1 ){
      log( 'found form: '+candForms[0][0]+'\n '+JSON.stringify(candForms[0][1]) );
    }
  }
  
  
  function log(str) {
    if (top === self) opera.postError('autologin.js info: ' + str);
  }

})(opera.scriptStorage, opera, window, document);

 */