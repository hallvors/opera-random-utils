/* experimental upgrade warning
*/

window.addEventListener('load',
function(){
	var urls=[ 'http://www.opera.com/browser/features/'  /* why? */, 'http://www.opera.com/download/' /* update now */ ];
	var warningElement;
	var showWarning=function( text, upgradeLink ){
		var div=document.createElement('userjs_div');
		div.setAttribute('style', 'display:block;position: fixed; top: 0; left:0; right: 0; background: #ccc URL(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAsCAIAAAArRUU2AAAAFUlEQVR42mPYxsDAxEAj%2FA2KqWgmADZlAvm%2FjveKAAAAAElFTkSuQmCC) -13px center repeat;text-align:center; padding:5px;color: #fff');
		div.appendChild(document.createTextNode(text));
		document.documentElement.style.paddingTop='3em';
		if(upgradeLink){
			var frm=div.appendChild(document.createElement('form'));
			frm.style.display='inline';
//			frm.appendChild(document.createElement('input')).type='button';
//			frm.firstChild.value='Why?'; frm.firstChild.onclick=function(){ window.location=urls[0]; };
//			frm.appendChild(document.createTextNode(' '));
			frm.appendChild(document.createElement('input')).type='button';
			frm.lastChild.value='Download update!'; frm.lastChild.onclick=function(){ window.location=urls[1]; };
		}
		warningElement=document.body.appendChild(div);
	}
	var hideWarning=function(){
		if(warningElement){
			document.body.removeChild(warningElement);
			document.documentElement.style.paddingTop=0;
			warningElement=null;
		}
	}
	if(top===self&&document.body&&document.body.tagName==='BODY'&&!/\.opera\.com$/.test(location.hostname)){
    showWarning( 'You are running an old version of the Opera browser.  ', true );
  }
},
false)
