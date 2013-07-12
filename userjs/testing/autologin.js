// login
//log('autologin.js active');
/*
TODO:
go through Wiki list from
 
 https://www.clipperz.com/ : form elements (pw?), login btn
 
 https://browserid.org/signin (regression) (stupid 'signup' form name, ignored )
 

t-online.de has login form in IFRAME (on other domain), not found

fubar.com - strange problems looking up elements..

*/
(function (storage, opera, window, document, JSON) { //log=function(){}
  if (!storage) return alert('Please set opera:config#User%20JS%20Storage%20Quota to some random large value to use the autologin.js script'); /* CONFIGURATION */
  var config={
    play_urls:1, interactivity_allowed:0, debug: 0
  }
  
  /** CONFIG stuff. Arrays of strings to look for. */ /* USER NAME field strings, then PASSWORD field strings */
  // 'session[username_or_email]' must precede  'user[email]' (Twitter). 'ciao_login_name' must precede 'email' (ciao), 'signinuser' must precede 'username' (xanga) 'vip_ulo' must precede 'name' (voila)
  var ustrings  = ['signinuser', 'username', 'user', 'userid', 'user_name', 'login', 'logonId', 'loginId', 'ciao_login_name', 'email', 'Email', 'session[username_or_email]', 'user[email]', 'EmailUsername', 'ctl00_tbUsername', 'vip_ulo', 'name', 'handle', 'signin_id', 'login_email', 'logstring', 'uid', 'nickname', 'contact_email', 'nick', 'login_name', 'id', 'acc', 'loginemail', 'name', 'usr'];
  // 'login_password' must precede 'password' (thanks ciao)
  var pstrings = ['login_password', 'password', 'login_passphrase_7' /*clipperz*/, 'pass', 'passord', 'passwd', 'Passwd', 'logonPassword', 'session[password]', 'user_pwd', 'pwd', 'txtPassword', 'login_pw', 'logpw', 'login_password', 'pword', 'txtPassword', 'pw', 'loginpw', 'myLogin_mdp', 'usrpsw1', 'login_pass'];
  /* Find "log in" link or element - strings to look for in link text, link href, img/input alt text. Must be all lower-case! */
  /* 'signup' breaks myspace */
  var lstrings = ['log in', 'login', 'sign in', 'login', 'signin', 'logg inn', 'logon', 'web sign in', 'my account', 'myaccount', 'member login', /*'signup',*/ 'log-in', 'ログイン', 'mystuff' /*travelocity*/ , 'conexion' /*submanga*/, 'logga inn', 'logg inn', 'einloggen', 'anmelden' /*zeit.de*/, "m'identifier" /*voila.fr*/, 'Войти' /*narod.yandex*/, 'logg på' /* expedia*/ ];
  var notloginstrings = ['log out', 'log off', 'sign out', 'forgot', 'lost', 'password' /* several sites: /login/lostpw type links */ , 'advertisers' /* myspace bogus link */, 'close login form' /*webshots*/ , 'homedesigning' /*tumblr*/, 'unshowlogin', 'closelogin', 'loginerror' /*all voila.fr*/]; // some sites make their "log out" link point to a URL saying 'log in', causing loops..
  var notloginforms = ['join', 'signup', 'register', 'newcustomer']; // forms with these strings in id or action will be ignored
  // strings we look for to identify submit buttons/images
  // TODO: should merge these with lstrings ? or look for lstrings if nothing is found for submstrings?
  var submstrings = ['log in', /* 'sign in', */ 'login', 'ctl00$cphcontent$imbsubmit', 'submitlogin'/*expedia*/, 'signin', 'sign in', 'submitid', 'Iniciar Sesión'];
  var success_strings=['inloggad som', 'logout [operatester]' /*dottnet forum*/];
  var success_elements=['liUserZone' /*nextvid*/, 'i-pseudo' /*match.com*/ ];
  var interval;
  /* Site specific customization should be kept to a minimum of course.. :-/ */
  var site_specific_data = {
    'digg.com' : { clickLoginFirst:true },
    'barnesandnoble.com' : { clickLoginFirst:true },
    'zapak.com' : { clickLoginFirst:true },
    'expedia.com':{ setup: function(){ if(location.hostname.indexOf('expedia.com')==-1) findAndClickLink('Expedia.com'); } } /*handle expedia's country selector*/,
    'runescape.com':{setup: function(){ if(location.hostname.indexOf('expedia.com')==-1) findAndClickLink('Continue to full website'); }},
  /*  'nextvid.com': {
      setup: function () {
        headerSignIn();
      },
      submitbtn: 'logInPopUpSubmitBtnLogIn'
    },*/
    'yammer.com': {
      submitbtn: 'qa-login-button'
    },
    'joost.com': { /*setup: function(){ document.getElementsByClassName('login popupTrigger')[0] .click();}, */
      submitbtn: function () {
        return document.selectSingleNode('//*[@dojoattachpoint="submitBtn"]/span');
      }
    },
    'visaliatimesdelta.com': {
      setup: function () {
        GEL.util.uautil.LoginProvider()
      },
      submitbtn: 'ody-login-btn'
    },
    'eharmony.com': {
      setup: function () {
        var tmp;
        if (tmp = document.getElementsByClassName('lnk-login')[0]) tmp.click();
      }
    },
    'nbc.com': {
      setup: function () {
        document.selectSingleNode('//h2[contains( text(), "myNBC" )]').click();
      }
    },
    'lastpass.com':{ 
      submitbtn:'buttonsigningo'
    },
    'opera.com': {
      isLoggedIn : function(){
        return document.body.innerText.indexOf('Opera Test User')>-1; /* My Opera */
      } 
    },
    'voila.fr':{
      clickLoginFirst:true,
      },
      'nullwebmail':{
        setup:function(){document.getElementsByName('WMPOP3SERVER')[0].value='';}
      }
  };
  var  submitting = false,
    login_complete = false;


  // Handle hostnames with and without www. prefix
  var hostname = getApproximatelyCorrectTld(location.hostname, location.href);
  if (storage[hostname]) {
    var data=JSON.parse( storage[hostname] );
    log('A login is stored for this site: ' + hostname+'\t'+ data.username);
  }
  // TODO: put these on storage[hostname] instead of window.localStorage to handle sites that redirect on login better
  if (typeof window.localStorage.sentLoginFrm == 'undefined') window.localStorage.sentLoginFrm = 0;
  if (typeof window.localStorage.clickedLoginLink == 'undefined') window.localStorage.clickedLoginLink = 0;
  if (typeof window.localStorage.autologinState == 'undefined') window.localStorage.autologinState = 0;
  var sites=[], allData={};
  if (location.pathname === '/staffwiki/TestAccounts') {
    opera.addEventListener('BeforeEvent.DOMContentLoaded', function (e) {
      if( storage.playIndex ) var tmpOldIndex=storage.playIndex;
      storage.clear();
      for (var trs = document.getElementsByTagName('tr'), tr, i = 0; tr = trs[i]; i++) {
        for (var as = tr.cells[0].getElementsByTagName('a'), a, j = 0; a = as[j]; j++) {
          var host, data={};
          if (host = a && tr.cells[1] && tr.cells[2] && a.hostname) {
            if (host === location.hostname) continue;
            sites.push(a.href);
            host = getApproximatelyCorrectTld(host, a.href);
            if (host.indexOf('cms.qa') > -1) {
              //log(''+host +' '+  trim(tr.cells[1].textContent) +' '+ trim(tr.cells[2].firstChild.data)+' '+a.href );
            }
            if (storage[host] ) continue;
            data.username= trim(tr.cells[1].textContent);
            data.password = trim(tr.cells[2].firstChild.data);
            storage[ host ] = JSON.stringify(data);
            //if (host.indexOf('cms.qa') > -1){ storage[ a.href ] = JSON.stringify(data); opera.postError( a.href+' '+storage[a.href] ); }
            data['url']=a.href;
            allData[ host ] =data;
          }
        }
      }
      storage['sites']=JSON.stringify(sites);
      storage.playIndex=tmpOldIndex||0;
      if(isNaN(parseInt(storage.playIndex)))storage.playIndex=0;
      log('Done storing user name/password entries for ' +sites.length + ' sites from the TestAccounts page');
      //jumpToSite('http://www.dailykos.com/');

      function trim(str) {
        return str.trim();
      }
      var a=document.getElementById('toc').insertBefore(document.createElement('a'), document.getElementById('toc').firstChild);
      a.href="#";
      a.onclick=function(){
        window.open('data:,'+encodeURIComponent(JSON.stringify(allData, null, 4)));
        return false;
      }
      a.textContent='Show JSON';
    }, false);
  } else {
    var sites=JSON.parse(storage.sites);
    if(config.play_urls&& storage.playIndex<sites.length)setTimeout( nextSite, 35000 ); // fallback - if no other venue triggers loading next site, this will in 35 seconds 

    if (storage && storage[hostname]){
      window.addEventListener('load', function (e) {if(config.debug)log('load event on '+location.href);
        if( !e.isTrusted )return;
        autologin();
      }, false);
      interval = setInterval(autologin, 10000);
    }
  }
  function autologin() {
    // It would make sense to try to check detectLoginSuccess() only after a form is sent (not doing so causes false positive "We're logged in" states on login pages). 
    // However, keeping track of this state is complicated if login forms are on other domains than the site. Hence, we run the login success heuristics first ..
    login_complete = login_complete || detectLoginSuccess();
    if( login_complete && self!=top ){ try{ top.opera.setLoginCompleted(true); }catch(e){} } // try to handle sites like web.de where the "login succeeded" info is found in an IFRAME but status message will show in top document
    if ( window.localStorage.sentLoginFrm && login_complete ){ if(config.debug)log('ah, form was sent and now we\'re done it seems');
      log('login OK ' + getApproximatelyCorrectTld( location.hostname, location.href ) );
      login_complete = true; // only report this once..
      if( hostname.indexOf('.yahoo.')>-1 )findAndClickLink('Go to the newest version of Yahoo! Mail');
      clearInterval(interval);
      if(config.play_urls && storage.playIndex<sites.length)setTimeout(nextSite, 5000);
    } else if( login_complete && ! window.localStorage.sentLoginFrm  ) { // hm.. we logged in without submitting any forms..? Maybe we did in a frame though..
      if(config.debug)log('the huh? part - '+location.href);
    }else{                                                                                                                                                                                                                                      if(config.debug)log('just getting started..');
      detectAndSubmitLoginForms();                                                                                                                                                                                                if(config.debug)log('detectAndSubmitLoginForms ran..');
      clearInterval(interval); // just in case load event is called more than once (synthetic?)
      interval = setInterval(autologin, 10000);
    }
  }
  function nextSite(){
    if( top!=window )return;
    storage.playIndex++;
    if( storage.playIndex>sites.length-1 ){
      log('DONE! DONE! DONE!');
      return;
      //storage.playIndex=1;
    }
    log('going to site '+storage.playIndex+', '+sites[storage.playIndex]);
    var prefix = (/https?:/.test(sites[storage.playIndex])) ? '' : 'http://';
    location.href=prefix+sites[storage.playIndex];
  }
  function detectAndSubmitLoginForms() { //if(self==top)log( 'load fires '+document.forms.length+'\n\n '+document.body.outerHTML )
   // return;
    if (document.styleSheets[0] && /file:\/\/localhost\/.*\/styles\/error\.css/.test(document.styleSheets[0].href)) return (config.play_urls) && nextSite(); // 404? Opera error page loaded
    if (submitting) return; // Might happen if interval / event fires after we've sent a form..
    if (site_specific_data[hostname] && site_specific_data[hostname].setup) try {
      site_specific_data[hostname].setup();
    } catch (e) {
      log('error on attempted "setup": ' + e);
    }
    var loginlink, ufield, pfield;
    loginlink = findLoginElement();
    if( loginlink && site_specific_data[hostname] && site_specific_data[hostname].clickLoginFirst ){ // click login link if found really early, might un-hide or create form elements we're looking for...
      if(config.debug)log('found login link, will click: ' + loginlink);
      window.localStorage.clickedLoginLink++;
      loginlink.click();
    }
    // look for login form fields
    pfield = findPasswordField();
    ufield = findUserNameField(pfield && pfield.form);
    if( loginlink && pfield && ufield && ! isNodeAndAncestorsVisible( ufield ) ){ // TODO: remove this again? It's a risky one - will show hidden login form or ruin something..
      loginlink.click();
    }
    // To try to submit the form, look for the nearest button..?
    var submitelm = findSubmitElement(ufield && ufield.form, ufield, pfield);
    if (config.debug )log('found \nu ' + (ufield ? ufield.outerHTML : ' NONE ') + ' \npfield: ' + (pfield ? pfield.outerHTML : ' NONE') + '\n link: ' + (loginlink ? loginlink.outerHTML : ' NONE') + '\nSubmit button: ' + (submitelm ? submitelm.outerHTML : ' NONE') + '\n values: ' + data.username + ', ' + data.password);
    if (loginlink && window.localStorage.clickedLoginLink < 1 && !( ufield || pfield )  ) {
      // many sites have both "register" forms (with user/pass fields) and login link. 
      // This is a matter of heuristic.. If we don't have fields and a login link, we try to click login first - once per site..
      if(config.debug)log('found login link, will click: ' + loginlink);
      window.localStorage.clickedLoginLink++;
      loginlink.click();
    } else if (ufield && pfield) {
      ufield.value =  data.username;
      pfield.value =  data.password;
      if (submitelm && window.localStorage.sentLoginFrm > 2 ) { // We only try automatically twice, except on cms.qa
        if (config.interactivity_allowed && window.localStorage.sentLoginFrm < 8) {
          if (!confirm('try to submit login form (already tried ' + window.localStorage.sentLoginFrm + ' times)?\n\n' + ufield.outerHTML + ': ' + ufield.value + '\n' + pfield.outerHTML + ': ' + pfield.value + '\n' + submitelm.outerHTML)) return;
        } else {
          if(config.play_urls && storage.playIndex<sites.length)setTimeout(nextSite, 2000);
          return log('tried more than twice to submit login, aborted');
        }
      }

      if (submitelm) {
        submitting = true;
        if (submitelm.tagName == 'FORM') {
          var evObj = document.createEvent('Event');
          evObj.initEvent('submit', true, true, window);
          if (submitelm.dispatchEvent(evObj)) submitelm.submit();
        } else {
          var evObj = document.createEvent('MouseEvents');
          evObj.initMouseEvent('mousedown', true, true, window, 0, 12, 345, 7, 220, false, false, false, false, 0, null);
          submitelm.dispatchEvent(evObj)
          evObj = document.createEvent('MouseEvents');
          evObj.initMouseEvent('mouseup', true, true, window, 0, 12, 345, 7, 220, false, false, false, false, 0, null);
          submitelm.dispatchEvent(evObj)
          evObj = document.createEvent('MouseEvents');
          evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          submitelm.dispatchEvent(evObj);
          setTimeout(function(){submitelm.click();}, 400); // Greymatter CMS does for some reason not respond to a synthetic click event on button.. Point of doing this from a timeout is the assumption that if dispatchEvent() worked, we'll be loading the next page and the timeout won't fire..
        }
         if(location.hostname.indexOf('cms.qa')==-1)window.localStorage.sentLoginFrm++; // cms.qa exception: lots of login forms on same server..
	log( 'attempting log in on '+hostname );
      }
    } else {
      if (!submitting && loginlink && window.localStorage.clickedLoginLink < 2 /* && !(ufield) */) { // consider trying to click any "log in" link again here, since we don't have password field?
        loginlink.click();
        window.localStorage.clickedLoginLink++;
      } else {
        //log('failed to find elements: '+ufield+' '+pfield+' '+loginlink+'\n Forms: '+document.forms.length+', inputs: '+document.getElementsByTagName('input').length);
	// we have not found any elements on this page. Now, *if* we got here by clicking a link we may of course have clicked one too many.. Go back and try again?
	if( window.localStorage.clickedLoginLink && !  window.localStorage.sentLoginFrm )history.go(-1);
        if(config.play_urls)setTimeout(nextSite, 2000);
      }
    }

    function findLoginElement() {
      var loginlink;
      for (var i = 0; i < lstrings.length; i++) {
        if (location.pathname.toLowerCase().indexOf(lstrings[i]) > -1) return; // it seems we already are on a 'log in' URL, let's not do any further link lookups and clicking..
      }
      // First look for a "log in" / "sign in" link
      var elms=findElementsGeneral( ['a'], lstrings, null, null, [ isElementFacebookjacked, isElementUnloginLike, isElementRedirectToSelf ] );
      if( elms[0] )return elms[0];
      // hm.. no such thing here? We could of course look for somewhat more dubious markup.. but let's do that only if necessary..
      // TODO: remove old code
      /*
      for (var i = 0; i < lstrings.length; i++) {
        var tmp1 = document.selectSingleNode('//a[contains(translate(text(),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        var tmp2 = document.selectSingleNode('//a[contains(translate(@href,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        var tmp3 = document.selectSingleNode('//a[contains(translate(@id,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        var tmp4 = document.selectSingleNode('//a[contains(translate(@title,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        var tmp5 = document.selectSingleNode('//*[contains(translate(@src,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        var tmp6 = document.selectSingleNode('//*[contains(translate(@alt,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "' + lstrings[i] + '")]');
        // TODO? We still don't handle stuff like <span class="button" onclick="login()">Log in</span> or even <button>Log in</button>
        //log( tmp1+' '+tmp2+' '+tmp3+' '+tmp4 )
        loginlink = tmp1 || tmp2 || tmp3 || tmp4 || tmp5 || tmp6;
        // Caveat: a few sites have Facebook login stuff on them. We don't want to go that route unless we're actually on Facebook...
        if (location.hostname.indexOf('facebook.') == -1 && loginlink && loginlink.outerHTML.toLowerCase().indexOf('facebook') > -1) continue;
        if (loginlink) { // check for false positive, i.e. <a href="login.php">Log out</a>
          for (var j = 0; j < notloginstrings.length; j++) {
            if (loginlink.textContent.toLowerCase().indexOf(notloginstrings[j]) > -1) {
              loginlink = null;
              break;
            }
          }
        }
        if (loginlink && location.pathname.length > 2 && loginlink.href && loginlink.href.indexOf(encodeURIComponent(location.pathname)) > -1) { // some sites have "do something else and come back to this login page" links - <a href="go.php?return=%2Flogin%2f"></a> - which trigger our "this is a login link" heuristic
          loginlink = null;
        }
        if (loginlink) break;
      }
      return loginlink;*/
    }

    function findUserNameField(frm) {
      var ar=findElementsGeneral( ['input'], ustrings, ['text', 'email'], frm, [ isElementInRegForm, isElementFacebookjacked ] );
      if( ar.length>0 )return ar[0];
      var ar = findInputElements(ustrings, {
        text: 1,
        email: 1
      }, frm);
      if (ar.length == 1) return ar[0]; 
      /* OK, dilemma: more than one input element looks like a user name input. How to weight this? */
      if (frm && ar.length) { // if we know the parent form, return the first element that belongs to the form..
        for (var elm, i = 0; elm = ar[i]; i++) if (elm && elm.form == frm) return elm;
      }
      if (document.forms.length > 1) { // login forms are typically short-ish. Let's say shortest form  with a "user name"-like input wins?
        var likelyElm = ar[0];
        for (var elm, i = 1; elm = ar[i]; i++) {
          if (elm.form && elm.form.elements.length <= 2) continue; // probably a simple search/subscribe form..?
          if (elm.form && likelyElm.form && elm.form.elements.length < likelyElm.form.elements.length && !isElementInRegForm(elm)) likelyElm = elm;
        }
        if (likelyElm) return likelyElm;
      } /* the order of strings in the array is fine-tuned to work better with certain problematic sites, so at this point the first element will have a somewhat better chance of being THE right one */
      if (ar[0] && !isElementInRegForm(ar[0])) return ar[0];
      // finally, we return the first element of type text or email in the form..
      if (frm) for (i = 0; elm = frm.elements[i]; i++) if (elm.type in {
        text: 1,
        email: 1
      }) return elm;
    }

    function findPasswordField(frm) {
      if (document.selectNodes('//input[@type="password"]').length == 1 && !isElementInRegForm(document.selectSingleNode('//input[@type="password"]'))) return document.selectSingleNode('//input[@type="password"]');
      var ar=findElementsGeneral( ['input'], pstrings, ['password'], frm, [ isElementInRegForm, isElementFacebookjacked ] );
      if( ar.length>0 )return ar[0];
      var ar = findInputElements(pstrings, {password:1}, frm);
      if (frm && ar.length) {
        for (var elm, i = 0; elm = ar[i]; i++) if (elm && elm.form == frm) return elm;
      }
      if( ar.length==0 ){ // no input type=password, but perhaps we find some <input name=password type=text> foo? (experts-exchange.com)
        ar=findInputElements(pstrings, {text:1}, frm);
      }
      return ar[0];
    }

    function findSubmitElement(frm, ufield, pfield) {
      // This turns out to be the hardest (and most important) part of the script. There are LOTS OF ways to code a "log in" button, and much JS abuse.
      // fall back is to just do form.submit() but this works only for simple cases with little JS.
      // Gem from clipperz: <td class="ybtn-center" unselectable="on">Login</td>
      var submitelm;
      if (site_specific_data[hostname] && site_specific_data[hostname].submitbtn) {
        if (typeof site_specific_data[hostname].submitbtn == 'function') {
          try {
            submitelm = site_specific_data[hostname].submitbtn();
            log('site-specific lookup found ' + submitelm.outerHTML);
          } catch (e) {
            log('submit button lookup method failed ' + e);
          }

        } else {
          submitelm = document.getElementById(site_specific_data[hostname].submitbtn);
        }
	if(submitelm)return submitelm;
      }
      // look for sanely coded forms first...
      var elms=findElementsGeneral( ['input', 'button'], submstrings, ['submit', 'image'], frm, [ isElementInRegForm, isElementUnloginLike, isElementFacebookjacked ] );
      if( elms[0] )return elms[0];
      // sometimes forms are sensibly coded, but just fail to use a @name / @id attr that looks login-like. Fair enough, we have a little trick for that..
      if (frm && (ufield || pfield)) { // start with the simple case: we know a form, it has at least a user or a password field. The submit button is usually found after other input fields.
        for (var i = 0, seen = false, elms = frm.selectNodes('.//input | .//button'), el; el = elms[i]; i++) { // we can't use form.elements collection because input type=image is missing (argh)
          if (el == ufield || el == pfield) {
            seen = true;
            continue;
          }
          if (!seen) continue; // I said "after"
          if (el.type in {
            submit: 1,
            image: 1
          } && isNodeAndAncestorsVisible(el)) {
            return el;
          }
        }
      }
      // TODO: consider looking for lstrings as well as submstrings here!
      // if login is JS-powered, it might use an element type=button
      var elms=findElementsGeneral( ['input', 'button'], submstrings, ['button'], frm, [ isElementInRegForm, isElementUnloginLike ] );
      if( elms[0] )return elms[0];
      // then not-quite-as-well-coded
      var elms=findElementsGeneral( ['a', 'img'], submstrings, undefined, frm, [ isElementInRegForm, isElementUnloginLike, isElementFacebookjacked ] );
      if( elms[0] )return elms[0];
      // then terrible ones
      var elms=findElementsGeneral( ['span', 'div', 'td'], submstrings, undefined, frm, [ isElementInRegForm, isElementUnloginLike, isElementFacebookjacked ] );
      if( elms[0] )return elms[0];
      // if we still failed, anything goes I guess..
      var elms=findElementsGeneral( ['*'], submstrings, undefined, frm, [ isElementInRegForm, isElementUnloginLike, isElementFacebookjacked ] );
      if( elms[0] )return elms[0];
      //  TODO: the rest of this function is now mostly dead legacy code, probably runs on very few sites..
      
      // we want to find INPUT or BUTTON or IMG elements where @id, @name, @src or content contain one of the strings in the submstrings array, maybe also look at @onclick
      // if frm is known preferably an element associated with that form..
      for (var i = 0, str; str = submstrings[i]; i++) {
        var xpr = document.evaluate(('.//input[contains( ' + caseinsensitive('@id') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('@id') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@id') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@name') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('@name') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@name') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@src') + ' , "' + str + '")] | .//img[contains( ' + caseinsensitive('@src') + ' , "' + str + '")]  | .//input[contains( ' + caseinsensitive('@value') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('text()') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@alt') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@alt') + ' , "' + str + '")] | .//a[contains(' + caseinsensitive('@onclick') + ', "' + str + '")] | .//a[contains(' + caseinsensitive('@href') + ', "' + str + '")]').replace(/input\[/g, 'input[(@type="submit" or @type="button" or @type="image") and '), frm||document.body||document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var tmp, ar = [];
        while (tmp = xpr.iterateNext()) {
          if (!isElementInRegForm(tmp) && !isElementUnloginLike(tmp)) ar.push(tmp);
        }
        submitelm = ar[0];
        if (submitelm) return submitelm;
      }
      // ..but if we didn't find it in the form, look outside (this duplication sucks of course. Thank you CVS.com...)
      for (var i = 0, str; str = submstrings[i]; i++) {
        var xpr = document.evaluate(('.//input[contains( ' + caseinsensitive('@id') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('@id') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@id') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@name') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('@name') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@name') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@src') + ' , "' + str + '")] | .//img[contains( ' + caseinsensitive('@src') + ' , "' + str + '")]  | .//input[contains( ' + caseinsensitive('@value') + ' , "' + str + '")] | .//button[contains( ' + caseinsensitive('text()') + ' , "' + str + '")]  | .//img[contains( ' + caseinsensitive('@alt') + ' , "' + str + '")] | .//input[contains( ' + caseinsensitive('@alt') + ' , "' + str + '")] | .//a[contains(' + caseinsensitive('@onclick') + ', "' + str + '")]').replace(/input\[/g, 'input[(@type="submit" or @type="button" or @type="image") and '), document.body||document.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var tmp, ar = [];
        while (tmp = xpr.iterateNext()) {
          if (!isElementInRegForm(tmp) && !isElementUnloginLike(tmp)) ar.push(tmp);
        }
        submitelm = ar[0];
        if (submitelm) return submitelm;
      }
      if (frm && !submitelm) { // we have not found the submit button but we know the form
        for (var el, i = 0; el = frm.elements[i]; i++) {
          //log(el.type+' '+el.name+' '+el.id);
          if (el.type === 'submit' || el.type === 'image') {
            submitelm = el;
            break;
          }
        }
        if (frm && !submitelm) {
          submitelm = frm;
        }
      } else if (!submitelm) { // no associated FORM - just randomly try to find some input type=submit and click it..
        for (var elms = document.getElementsByTagName('input'), i = 0; i < elms.length; i++) {
          if (elms[i].type === 'submit' || elms[i].type === 'image') {
            submitelm = elms[i];
            break;
          }
        }
      }
      // look for constructs like <a href="javascript:login()">
      var tmp=document.selectSingleNode( '//a[contains(@href, "javascript:") and contains( '+caseinsensitive('@href')+', "login" )]' );
      if(tmp)submitelm=tmp;
      if (frm && submitelm == frm) { // one desperate attempt for ciao.co.uk's <span>Log in</span> nonsense
        // modified to handle xanga where there is a "sign in" link pointing to a broken login form before the *actual* login form (whose button is an A tag)
        var tmp = document.selectNodes('//body//*[ contains( ' + caseinsensitive('text()') + ', "log in" ) ]/ancestor-or-self::a | //body//*[ contains( ' + caseinsensitive('text()') + ', "sign in" ) ]/ancestor-or-self::a');
        for (var i = 0; i < tmp.length; i++) {
          if (frm.contains(tmp[i])) submitelm = tmp[i];
        }
        // above handles xanga, now just in case any site actually puts the login buttonlink outside of the form... Might break things though.
        if (submitelm == frm && tmp.length) submitelm = tmp[0];
      }
      return submitelm;
    }

    function findInputElements(names, desiredTypes, frm) {
      var desiredTypes = desiredTypes || {
        text: 1,
        password: 1,
        email: 1
      };
      var ar = [];
      for (var i = 0; i < names.length; i++) {
	var candidate = document.getElementsByName(names[i])[0] || document.getElementById(names[i]);
        if (candidate && candidate.tagName === 'INPUT' && candidate.type in desiredTypes) {
          //log(names[i]+' '+candidate);
          if (!isElementInRegForm(candidate)) ar.push(candidate);
        }
      }
      if (ar.length) return ar;
      // now we're getting a bit desperate, right..?
      var elms = document.getElementsByTagName('input');
      for (var i = 0; i < names.length; i++) {
        for (var j = 0; j < elms.length; j++) {
          if (elms[j].type in desiredTypes && (elms[j].name.toLowerCase().indexOf(names[i].toLowerCase()) > -1 || elms[j].id.toLowerCase().indexOf(names[i].toLowerCase()) > -1)) {
            if (!isElementInRegForm(elms[j])) ar.push(elms[j]);
          }
        }
      }
      return ar;
    }

    function isElementInRegForm(candidate) {
      if (candidate.form) { /* first heuristic: count elements user is expected to fill in */
        var elmCount = 0, numPWs=0;
        for (var i = 0; i < candidate.form.elements.length; i++) {
          if (candidate.form.elements[i].type in {
            text: 1,
            email: 1,
            password: 1
          }) elmCount++;
          if(candidate.form.elements[i].type=='password')numPWs++;
        }
      }
      if(elmCount == 2) return false; /* typical username + password form.. few sites have reg forms with only two fields for input */
      if(numPWs>1)return true; /* normally login forms don't have two passwords, but registration forms often have a "re-type pw" field */
      // Now.. if there is only *one* form, we would be stupid to ignore the elements inside (too many false positives anyway)
      if( document.forms.length==1 && candidate.form==document.forms[0] )return false;
      for (var j = 0; j < notloginforms.length; j++) { // ignore certain forms that are probably new user registration forms
        if (candidate.form && (('' + candidate.form.action + candidate.form.id + candidate.form.name).toLowerCase().indexOf(notloginforms[j]) > -1)) {
          log('ignore ' + candidate + ' ' + candidate.form.action + candidate.form.id);
          return true;
        }
      }
      return false;
    }
  }
  function isElementUnloginLike(candidate){
      // ignore elements that contain certain strings like 'forgot (your password)'
      for (var j = 0; j < notloginstrings.length; j++) {
        if (candidate.textContent.toLowerCase().indexOf(notloginstrings[j]) > -1) {
          return true;
        }
        if( findInAttrs( candidate, notloginstrings[j] ) )return true;
      }
    return false;      
  }
  function isElementFacebookjacked(elm){
    if (location.hostname.indexOf('facebook.') == -1 && elm && elm.outerHTML.toLowerCase().indexOf('facebook') > -1) return true;
  }
  function isElementRedirectToSelf(elm){
    if (elm && location.pathname.length > 2 && elm.href && elm.href.indexOf(encodeURIComponent(location.pathname)) > -1) { // some sites have "do something else and come back to this login page" links - <a href="go.php?return=%2Flogin%2f"></a> - which trigger our "this is a login link" heuristic
      return true;
    }
  }
  function caseinsensitive(str) {
    return 'translate(' + str + ',"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")';
  }
  function findElementsGeneral( tagnames, strings, typefilter, parent, falseposfuncs ){
    /** Truly generalized function to look up elements by certain criteria.
          Expects: array of tag names, array of strings (will look in both elm contents and all attributes), editableOnly true if only input tpe=text and such are wanted, optional parent element 
          (if no matching elements found inside, it might call itself recursively to scan entire document), optional array of functions that can be called to exclude false positives
    */
    var returnElms=[];
    parent=parent||document;
    for(var i=0, string; string=strings[i]; i++){ // what should be the outer loop? I guess strings have more variation and more potential for false positive..
      for(var j=0,tag; tag=tagnames[j]; j++){
        for( var k=0, elms=parent.getElementsByTagName(tag), elm;elm=elms[k]; k++ ){
          if( typefilter && typefilter.indexOf( elm.type ) == -1 ) continue; // This query only wants elements of a certain @type - naturally, this argument is only useful when looking for INPUT, TEXTAREA or BUTTON..
          if( elm.textContent.toLowerCase().indexOf(string.toLowerCase())>-1 || findInAttrs(elm, string) ){ // we've found an element of type [TAGNAME] that contains [STRING] .. yay or no?
            if( falseposfuncs && falseposfuncs.length ){ //  we've got some function(s) to run to check for false positives
              var skip=false;
              for(var l=0; l<falseposfuncs.length; l++){
                if( falseposfuncs[l](elm) )skip=true; // oops, a false positive (unless the false positive detection is itself a false positive, of course). Lucky escape? Continue to next tag name.
              }
            }
            if(skip)continue;
            // OK, this REALLY seems like an element our caller will want to know about..
            if(config.interactivity_allowed)log( 'findElementsGeneral adds '+elm+' '+elm.outerHTML+' (looking for '+tag+' '+string+')' )
            returnElms.push(elm);
          }
        }
      }
    }
    return returnElms;
  }
  function findInAttrs(elm, str){
    // look for value in attributes of an element. Note: skips @type attributes, we typically filter on them elsewhere
    for(var i=0; i<elm.attributes.length; i++){
      if(elm.attributes[i].nodeName=='type')continue;
      if(elm.attributes[i].nodeValue.toLowerCase().indexOf(str.toLowerCase())>-1) return true; 
    }
    return false;
  }
  
  function detectLoginSuccess(doc) { if(config.debug)log('"are we logged in?" heuristics start');
    var elm, hostname = getApproximatelyCorrectTld(location.hostname, location.href),
      uname, tmp;
    doc=doc||document;
    if (storage[hostname]) {
      uname = JSON.parse(storage[hostname]).username;
    } else {
      return false;
    }
    if(!document.body)return; // too early? Likely a slow loading site..
    if( site_specific_data[hostname] && site_specific_data[hostname].isLoggedIn )return site_specific_data[hostname].isLoggedIn();
    var rx = new RegExp("(welcome,|hei|hey|hello|signed in as|thank you for logging in|account|kontoen til|willkommen|guten tag|guten morgen|gute nacht|hallo|main menu for|ol�|ciao|benvenuto|what are you up to),?\\s*.{0,50}(" + rxEscape( uname ) + "|opera)", 'i');
    if (document.body.innerText.match(rx)) return true;
    if (elm = document.getElementById('screen-name')) if( elm.innerText.indexOf(uname) > -1) return true; // twitter
    if (elm = document.selectSingleNode('//*[@class="userInfo"]/*[@class="displayname"]')) return true; // myspace
    if (document.title.match(/(opera ?tester's|by opera ?tester)/i)) return true; // photobucket ++
    if (document.body.innerText.match(/opera tester/i)) return true; // bebo ++
    if (document.body.innerText.match(/opera nordmann/i)) return true; // google ++
    if (document.body.innerText.match(/signed in successfully/i)) return true; // friendster ++
    if (document.getElementsByClassName('current-user-thumbnail').length) return true; // digg
    if (document.getElementsByClassName('name').length && document.getElementsByClassName('name')[0].textContent.indexOf(uname)>-1 ) return true; // web.de
    if (document.getElementsByClassName('gear-dropdown-user').length && document.getElementsByClassName('gear-dropdown-user')[0].textContent.indexOf(uname)>-1 ) return true; // evernote, maybe other GWT sites?
    if (document.getElementById('username') && ( document.getElementById('username').textContent.indexOf(uname)>-1 || document.getElementById('username').textContent.toLowerCase().indexOf('opera')>-1)) return true; // mirtesen.ru
    if (document.getElementsByClassName('sair_button').length) return true; // minhaseconomias.com.br
    if( tmp=document.getElementById('login') ) if( tmp.tagName=='FORM' && tmp.action.indexOf('mambo')>-1 && tmp.action.indexOf('option=logout')>-1 )return true;
    for( var i=0;i<success_elements.length;i++ )if(document.getElementById(success_elements[i]))return true;
    // <a href="foo"><img alt="Logout" src="logout.png"></a>
    if( document.selectSingleNode( '//a/img[contains( '+caseinsensitive('@alt')+', "logout" )]' ) )return true;
    if( document.selectSingleNode( '//a/img[contains( '+caseinsensitive('@src')+', "logout" )]' ) )return true;
    // some sites (seen on springnote.com) link to user name-in-hostname site when logged in
    if( findElementsGeneral( ['a'], [uname+'.'+hostname], null, null, null ).length )return true;
    // some sites (notably 126.com) load JSON-ish / JSONP data in SCRIPT elements with a user name in the URL
    if( findElementsGeneral( ['script'], [uname], null, null, [ function(elm){ return elm.src.indexOf(uname)==-1 } ] ).length )return true;
    // "edit user" link (seen on everythinghelpdesk.com)
    if( findElementsGeneral( ['a'], ['edit user'], null, null, null ).length )return true;
    if (elm = document.selectSingleNode('//a[contains(' + caseinsensitive('@href') + ', "signout")] | //a[contains(' + caseinsensitive('@href') + ', "logout")] | //a[contains(' + caseinsensitive('text()') + ', "log out")] | //a[contains(' + caseinsensitive('@href') + ', "logoff")]')){
      if(isNodeAndAncestorsVisible( elm ))
      return true; // steampowered ++
    }
    var doctxt=document.body.innerText.toLowerCase();
    for( var i=0; i<success_strings.length; i++ ){
      if(doctxt.indexOf( success_strings[i] )>-1) return true;
    }
    /* the login success indication might be in an IFRAME which doesn't have its own scripting environment (hi, Evernote!) */
    for( var elms=doc.getElementsByTagName('iframe'),i=0,el;el=elms[i];i++ ){
      try{
        if(detectLoginSuccess(el.contentDocument))return true;
      }catch(e){}
    }
    // <span onclick="return loginFnc.goToAccount();">operatester</span>
    if( document.selectSingleNode( '//*[contains('+caseinsensitive('@onclick')+', \'account\') and contains(text(), \'operatester\')]' ) )return true;
    // <span class="userName">opera</span>
    if( document.getElementsByClassName('userName').length )return true;
    var nl;
    if( (nl=document.selectNodes('//*[contains( '+caseinsensitive('@title')+', "your profile" )]')).length )if(nl.textContent.indexOf(uname)>-1)return true;
    if( (nl=document.selectNodes('//*[contains(  '+caseinsensitive('@title')+', "your account" )]')).length )if(nl.textContent.indexOf(uname)>-1)return true;
    
  }

  function getApproximatelyCorrectTld(hostname, url) {
    if( hostname.indexOf('cms.qa')>-1 ){ // on cms.qa server, hostname is not unique but first part of URL after hostname is
      opera.postError('CMS URL, will return ' + url.split('/')[3] );
      return url.split('/')[3];
    }
    // first: relax! It's not really a huge security risk if we use a user name and password on the wrong site for the purposes of this exercise
    // now: if we have a .com, return two last parts
    var oneLevelTLDs={com:1,no:1,de:1, it:1, org:1, lv:1, net:1}; // domains without "significant" sub-TLDs..
    var bits = hostname.split('.');
    var partcount = bits.length;
    if (bits[partcount - 1] in oneLevelTLDs) return bits[bits.length - 2] + '.' +  bits[bits.length - 1];
    // we don't care about the generic www prefixing
    if( bits.length>=3 ){
      if (bits[0] == 'www') bits.shift();
      if (bits[0] == 'login') bits.shift();
      if (bits[0] == 'secure') bits.shift();
      if (bits[0] == 'wwws') bits.shift();
    }
    // two-part TLD? Now it's getting a bit dubious though..
    if (bits.length > 3 && bits[1].length == 2 && bits[2].length == 2) {
      if(config.debug)log('removing ' + bits[0]);
      bits.shift();
    }

    return bits.join('.');
  }

  function log(str) {
    if (top === self || str.indexOf('OK')>-1) opera.postError('autologin.js info: ' + str);
  }
  function rxEscape(str){
    return str.replace( /(\+|\.|\\)/g, '\\$1' )
  }
  function isNodeAndAncestorsVisible(node){
    var compStyle=getComputedStyle(node, '');
    var seemsVisible = compStyle.display !='none' && compStyle.visibility != 'hidden' /* && compStyle.opacity != '0' */;
    if( node.parentNode && node.parentNode!=node.ownerDocument )seemsVisible = seemsVisible && isNodeAndAncestorsVisible(node.parentNode);
    return seemsVisible;
  }
  
  // script UI ... 
  window.addEventListener('load',
function(){ 
  if(location.protocol=='file:' || location.protocol=='data:')return;
	var warningElement;
	var showWarning=function( text ){
		var div=document.createElement('userjs_div');
		div.setAttribute('style', 'display:block;position: fixed; bottom: 0; left:75%; width: 25%; right: 0; background: #ccc URL(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAsCAIAAAArRUU2AAAAFUlEQVR42mPYxsDAxEAj%2FA2KqWgmADZlAvm%2FjveKAAAAAElFTkSuQmCC) -13px center repeat;text-align:center; padding:5px;color: #fff;z-index:100000');
 //               document.documentElement.style.marginTop='80px';
		div.appendChild(document.createTextNode(text));
                if( login_complete )div.appendChild(document.createTextNode(' LOGGED IN! '));
//		document.documentElement.style.paddingTop='3em';
		var frm=div.appendChild(document.createElement('form'));
		frm.style.display='inline';
		frm.appendChild(document.createTextNode(' Domain: '));
		frm.appendChild(document.createElement('input')).type='text';
		frm.lastChild.value=hostname;
		frm.appendChild(document.createTextNode(' '));
		frm.appendChild(document.createElement('input')).type='button';
		frm.lastChild.value='Try again'; frm.lastChild.onclick=function(){ 
		  hostname=frm.elements[0].value; 
		  window.localStorage.sentLoginFrm=window.localStorage.clickedLoginLink=0; 
		  autologin(); 
		};
		frm.appendChild(document.createElement('input')).type='button';
		frm.lastChild.value='Next..'; frm.lastChild.onclick=function(){ 
		  nextSite();
		};
		warningElement=document.body.appendChild(div);
	}
	var hideWarning=function(){
		if(warningElement){
			document.body.removeChild(warningElement);
			document.documentElement.style.paddingTop=0;
			warningElement=null;
		}
	}
	if(top===window&&document.body&&document.body.tagName==='BODY'){
          showStatus();
        }
        function showStatus(){
	  showWarning( ' Autologin status: site '+storage.playIndex+'  clicks: '+window.localStorage.clickedLoginLink+'	, submits: '+window.localStorage.sentLoginFrm );
        }
  window.opera.setLoginCompleted=function(val){
    login_complete=val;
    showStatus();
  }
},
false)
  function findAndClickLink(str){ 
    for(var i=0; i<document.links.length; i++){
      if( document.links[i].innerText.indexOf(str) >-1)document.links[i].click();
    }
  }
  
  function jumpToSite(site){
//    opera.postError(sites.indexOf(site)+' '+sites[400]);
    if( sites.indexOf(site)>-1 )storage.playIndex = sites.indexOf(site);
  }
  if( ! config.interactivity_allowed )window.alert = window.confirm = window.prompt = function(str){ 
    opera.postError( 'MSG: '+str );
    return true;  
  }
})(opera.scriptStorage, opera, window, document, JSON);

