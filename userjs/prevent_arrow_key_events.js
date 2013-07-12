opera.addEventListener( 'BeforeEventListener.keydown', function(e){
	var list={ 37:1,39:1 };
	var elm=e.event.target;
		if( e.event.keyCode in list ){
			if(document.activeElement && document.activeElement.getAttribute('aria-pressed')=='true'){
				var evt=document.createEvent('Event');
				evt.initEvent('keydown', true, true);
				evt.keyCode=27; // esc
				e.event.target.dispatchEvent(evt);
				e.preventDefault();
			}
		}else if( e.event.keyCode == 13 && elm.getAttribute('aria-expanded')=='true' && elm.getAttribute('data-button-menu-id') ){
			// if user presses enter when a button that has an open subMenu has focus, we want to send a click event to the submenu
			var subMenu=document.getElementById( elm.getAttribute('data-button-menu-id') );
			if(subMenu){
				var elm=subMenu.getElementsByClassName('yt-uix-button-menu-item-highlight')[0];
				if(elm){
					if(elm.getElementsByTagName('a').length)elm=elm.getElementsByTagName('a')[0]; // some submenus have A inside.. sigh..
					if(elm.getElementsByTagName('span').length)elm=elm.getElementsByTagName('span')[0]; // some submenus have SPAN inside..
					var evt=document.createEvent('MouseEvent');
					evt.initMouseEvent('click', true, true, window, null, 0, 0,0,0, false, false, false, false, 0, null);
					elm.dispatchEvent(evt);
					e.preventDefault();
				}
			}
		}
	},false );

