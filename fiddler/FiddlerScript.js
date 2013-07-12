import System;
import System.Windows.Forms;
import Fiddler;
import System.IO;
import System.Text.RegularExpressions;

// GLOBALIZATION NOTE:
// Be sure to save this file with UTF-8 Encoding if using any non-ASCII characters
// in strings, etc.
//
// JScript Reference
// http://www.fiddlertool.com/redir/?id=msdnjsnet
//
// FiddlerScript Reference
// http://www.fiddlertool.com/redir/?id=fiddlerscriptcookbook
//
// FiddlerScript Editor:
// http://www.fiddlertool.com/redir/?id=fiddlerscripteditor

var gLocalDumpRoot = 'c:\\capture\\live\\';

class Handlers
{
	public static RulesOption("Hide 304s")
	var m_Hide304s: boolean = false;

	public static RulesOption("Dump &responses")
	var m_dumpAllResponses: boolean = false;

	public static RulesOption("Simple &ad removal")
	var m_NoAD: boolean = false;

	// Cause Fiddler to override the Accept-Language header with one of the defined values
	public static RulesOption("Request &Japanese Content")
	var m_Japanese: boolean = false;

	// Cause Fiddler to override the User-Agent header with one of the defined values
	public static RulesOption("Netscape &3", "&User-Agents", true)
	var m_NS3: boolean = false;
	public static RulesOption("&Firefox 1.5", "&User-Agents", true)
	var m_FFox: boolean = false;
	public static RulesOption("&Firefox 2", "&User-Agents", true)
	var m_FFox2: boolean = false;
    public static RulesOption("&Firefox 12", "&User-Agents", true)
    var m_FFox12: boolean = false;
    public static RulesOption("IE &6 (XPSP2)", "&User-Agents", true)
	var m_IE6: boolean = false;
	public static RulesOption("IE &7 (Vista)", "&User-Agents", true)
	var m_IE7: boolean = false;
	public static RulesOption("IE &8 (Win2k3)", "&User-Agents", true, true)
	var m_IE8: boolean = false;
	public static RulesOption("Opera 8.65 on WinCE", "&User-Agents", true)
	var m_OpWCE: boolean = false;
	public static RulesOption("Opera Moose", "&User-Agents", true)
	var m_OpMoose: boolean = false;
	public static RulesOption("Opera 9.5 on Samsung Windows mobile", "&User-Agents", true)
	var m_OpWMob: boolean = false;
	public static RulesOption("Opera 10 on Samsung Windows mobile", "&User-Agents", true)
	var m_Op10WMob: boolean = false;
    public static RulesOption("Opera 11.50 on Android", "&User-Agents", true)
    var m_Op12Andr: boolean = false;
    public static RulesOption("Opera Mini 5 on iPhone", "&User-Agents", true)
	var m_OpMiniPhone: boolean = false;
	public static RulesOption("Opera 9.62 on Windows", "&User-Agents", true)
	var m_Op962Win: boolean = false;
	public static RulesOption("Opera 9.63 IBIS edition on Windows", "&User-Agents", true)
	var m_Op963IBIS: boolean = false;
	public static RulesOption("Opera 9.63 on Linux", "&User-Agents", true)
	var m_Op963nix: boolean = false;
	public static RulesOption("Opera 11.51 on Mac", "&User-Agents", true)
	var m_Op1151mac: boolean = false;
	public static RulesOption("Opera 10 Turbo edition on Windows", "&User-Agents", true, true)
	var m_Op10Turbo: boolean = false;
	public static RulesOption("&Disabled", "&User-Agents", true)
	var m_UANONE: boolean = true;

	// Cause Fiddler to delay HTTP traffic to simulate typical 56k modem conditions
	public static RulesOption("Simulate &Modem speeds", "Per&formance")
	var m_SimulateModem: boolean = false;

	// Removes HTTP-caching related headers and specifies "no-cache" on requests and responses
	public static RulesOption("&Disable Caching", "Per&formance")
	var m_DisableCaching: boolean = false;

	// Show the duration between the start of Request.Send and Response.Completed in Milliseconds
	public static RulesOption("&Show Time-to-Last-Byte", "Per&formance")
	var m_ShowTTLB: boolean = false;

	// Show the time of response completion
	public static RulesOption("Show Response &Timestamp", "Per&formance")
	var m_ShowTimestamp: boolean = false;

	// Force a manual reload of the script file.  Resets all
	// RulesOption variables to their defaults.
	public static ToolsAction("Reset Script")
	function DoManualReload(){
		FiddlerObject.ReloadScript();
	}

	public static ContextAction("Decode Selected Sessions")
	function DoRemoveEncoding(oSessions: Fiddler.Session[]){
		for (var x = 0; x < oSessions.Length; x++){
			oSessions[x].utilDecodeRequest();
			oSessions[x].utilDecodeResponse();
		}
	}

	public static ContextAction("Reissue Selected Requests")
	function ReRunSessions(oSessions: Fiddler.Session[]){
		if (null == oSessions){
			MessageBox.Show("Please select sessions to reissue.", "Nothing to Do");
			return;
		}

		for (var x = 0; x < oSessions.Length; x++){
			FiddlerObject.utilIssueRequest(oSessions[x].oRequest.headers.ToString(true, true) +
											System.Text.Encoding.UTF8.GetString(oSessions[x].requestBodyBytes));
		}
	}

	static function OnBoot(){
//		MessageBox.Show("Fiddler has finished booting");
//		System.Diagnostics.Process.Start("iexplore.exe");

		// FiddlerObject.UI.miManipulateIgnoreImages.Checked = false;

//		FiddlerObject.UI.ActivateRequestInspector("HEADERS");
//		FiddlerObject.UI.ActivateResponseInspector("HEADERS");
	}

	static function OnShutdown(){
//		MessageBox.Show("Fiddler has shutdown");
	}

	static function OnAttach(){
//		MessageBox.Show("Fiddler is now the system proxy");
//		System.Diagnostics.Process.Start("proxycfg.exe", "-u");	// Notify WinHTTP of proxy change
	}

	static function OnDetach(){
//		MessageBox.Show("Fiddler is no longer the system proxy");
//		System.Diagnostics.Process.Start("proxycfg.exe", "-u");	// Notify WinHTTP of proxy change
	}

    static function OnBeforeRequest(oSession:Fiddler.Session)
    {
        var loadTFilesFromLocal=false;
        if( loadTFilesFromLocal && oSession.url.IndexOf('t/core/bts/interactive/') > -1 ){
            var lFile=oSession.url.Replace('t/core/bts/interactive/', 'e:\\svn\\tmp\\rbtestfix\\');
            lFile = lFile.Replace( '/', '\\' );
            oSession["x-replywithfile"] = lFile;
            return;
        }
        if ((null != gs_ReplaceToken) && (oSession.url.indexOf(gs_ReplaceToken)>-1)){
            oSession.url = oSession.url.Replace(gs_ReplaceToken, gs_ReplaceTokenWith);
        }
        if ((null != gs_OverridenHost) && (oSession.host.toLowerCase() == gs_OverridenHost)){
            oSession["x-overridehost"] = gs_OverrideHostWith;
        }

        if ((null!=bpRequestURI) && (oSession.url.indexOf(bpRequestURI)>-1)){
            oSession["x-breakrequest"]="uri";
        }

        if ((null!=bpMethod) && (oSession.oRequest.headers.HTTPMethod == bpMethod)){
            oSession["x-breakrequest"]="method";
        }

        if ((null!=uiBoldURI) && (oSession.url.toUpperCase().indexOf(uiBoldURI)>-1)){
            oSession["ui-bold"]="QuickExec";
        }

        if (m_SimulateModem){
            // Delay sends by 300ms per KB uploaded.
            oSession["request-trickle-delay"] = "200";
        }

        if (m_DisableCaching || m_dumpAllResponses){
            oSession.oRequest.headers.Remove("If-None-Match");
            oSession.oRequest.headers.Remove("If-Modified-Since");
            oSession.oRequest["Pragma"] = "no-cache";
        }

        if (m_NoAD &&
            (oSession.host.indexOf("ad.")>-1 ||
            oSession.host.indexOf("ad2")>-1 ||
        oSession.url.indexOf("/ad")>-1)){
            oSession.oRequest.FailSession(403, "Advertisement", "This looks like an ad");
        }

        // User-Agent Overrides
        if (m_NS3){
            oSession.oRequest["User-Agent"] = "Mozilla/3.0 (Win95; I)";
        }
        else
            if (m_FFox){
            oSession.oRequest["User-Agent"] = "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.8.0.5) Gecko/20060719 Firefox/1.5.0.5)";
        }
        else
            if (m_FFox2){
            oSession.oRequest["User-Agent"] = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13";
        }
        else
            if (m_FFox12){
            oSession.oRequest["User-Agent"] = "Mozilla/5.0 (Windows NT 5.1; rv:13.0) Gecko/20100101 Firefox/13.0.1";
        }
        else
            if (m_IE6){
            oSession.oRequest["User-Agent"] = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)";
        }
        else
            if (m_IE7){
            oSession.oRequest["User-Agent"] = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1)";
        }
        else
            if (m_IE8){
            oSession.oRequest["User-Agent"] = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; WOW64)";
        }
        else
            if (m_OpWCE){
            oSession.oRequest["User-Agent"] = "Opera/9.5 (Windows NT 5.1; U; en) SAMSUNG-GT-i8000";
        }
        else
            if (m_OpMoose){
            oSession.oRequest["User-Agent"] = "Opera/9.63  (X11;  FreeBSD  7.1-STABLE  i386;  U;  en)  Presto/2.1.1";
        }
        else
            if (m_OpWMob){
            oSession.oRequest["User-Agent"] = "Opera/9.5 (Windows NT 5.1; U; en) SAMSUNG-GT-i8000";
            //oSession.oRequest["X-Wap-Profile"] = '"http://wap.samsungmobile.com/uaprof/SGH-L810V_3G.rdf"';
        }
        if (m_OpMiniPhone){
            oSession.oRequest["User-Agent"] = "Opera/9.8 (iPhone; Opera Mini/5.0.0176/812; U; fr) Presto/2.4.15";
            //oSession.oRequest["X-Wap-Profile"] = '"http://wap.samsungmobile.com/uaprof/SGH-L810V_3G.rdf"';
        }
        if (m_Op10WMob){
            oSession.oRequest["User-Agent"] = "SAMSUNG-SGH-L810-Vodafone/L810BUHC1 SHP/VPP/R5 Opera/10.00 SMM-MMS/1.2.0 profile/MIDP-2.0 configuration/CLDC-1.1";
            oSession.oRequest["X-Wap-Profile"] = '"http://wap.samsungmobile.com/uaprof/SGH-L810V_3G.rdf"';
        }
        else
            if (m_Op12Andr){
            oSession.oRequest["User-Agent"] = "Opera/9.80 (Android 2.3.3; Linux; Opera Mobi/ADR-1111101157; U; es-ES) Presto/2.9.201 Version/11.50";
        }
        else
            if (m_Op962Win){
            oSession.oRequest["User-Agent"] = "Opera/9.62 (Windows NT 5.1; U; en) Presto/2.1.1";
        }
        else
            if (m_Op963IBIS){
            oSession.oRequest["User-Agent"] = "Opera/9.63 (Windows NT 5.1; U; Edition IBIS; zh-cn) Presto/2.1.1";
        }
        else
            if (m_Op963nix){
            oSession.oRequest["User-Agent"] = "Opera/9.70 (Linux i686 ; U; en) Presto/2.2.1";
        }
        else
            if (m_Op1151mac){
            oSession.oRequest["User-Agent"] = "Opera/9.80 (Macintosh; Intel Mac OS X 10.7.1; U; en) Presto/2.9.168 Version/11.51";
        }

        else
            if (m_Op10Turbo){
            oSession.oRequest["User-Agent"] = "Opera/10.00 (Windows NT 5.1; U; Edition; en) Presto/2.2.0";
        }


        if (m_Japanese){
            oSession.oRequest["Accept-Language"] = "ja";
        }
        //		if (oSession.url.indexOf("sap-ext-sid=s")>-1){
        //			oSession.url = oSession.url.replace('sap-ext-sid=sWUhxI5mn4QAQCXGo7f00Q--FPRokQ2f1CkpEn*clW*aAA--', 'sap-ext-sid=9XvIbWi3H5nXJR0N8YF9jw--aYI*eUtzzw7eHEFRkOdMNw--');
        //			oSession.oFlags["x-breakrequest"] = "yup";		// The very existence of this Flag triggers breakpoint; value is unimportant.
        //		}

        //if (oSession.url.toLowerCase().indexOf("/sandbox/")>-1){
        //	oSession.oFlags["x-breakrequest"] = "yup";		// The very existence of this Flag triggers breakpoint; value is unimportant.
        //}

        /*		if (oSession.url.toLowerCase().indexOf(".google.")>-1){ */
        //			oSession.oRequest["User-Agent"] = "SAMSUNG-SGH-L810-Vodafone/L810BUHC1 SHP/VPP/R5 Opera/9.5 SMM-MMS/1.2.0 profile/MIDP-2.0 configuration/CLDC-1.1"; // bug 338101
        //			oSession.oRequest["Accept"] = "text/html, application/xml, multipart/mixed, application/vnd.wap.multipart.mixed;q=0.9, application/xhtml+xml, image/png, image/jpeg, image/gif, image/x-xbitmap, */*"; // bug 338101
        //			oSession.oRequest["Accept-Encoding"] = "deflate, gzip, x-gzip, identity, *;q=0"; // bug 338101
        //			oSession.oRequest["X-Wap-Profile"] = "\"http://wap.samsungmobile.com/uaprof/SGH-L810V_3G.rdf\""; // bug 338101
        //}*/

    }

	static function OnBeforeResponse(oSession:Fiddler.Session)
	{
		if (m_SimulateModem){
			// Delay receives by 150ms per KB downloaded.
			oSession["response-trickle-delay"] = "150";
		}
		
		if ( (m_dumpAllResponses || oSession.oRequest['x-saveme'] ) && ! oSession.HTTPMethodIs('CONNECT') && oSession.hostname !='capture' ){ // stay away from CONNECT, PathAndQuery is weird
			dumpResponseData(oSession);
		}
		if( oSession.hostname =='capture' && oSession.responseCode==404 ){
			var oldUrl=oSession.url;
			var oldPath=oSession.PathAndQuery;
			var lpath=gLocalDumpRoot.Replace('c:\\capture', '');
			lpath=lpath.Replace('\\', '/')
			var actualUrl=oSession.PathAndQuery.Replace(lpath, '');
			oSession.url=actualUrl;
			oSession.oRequest['x-saveme']=1;
			// if the previous request was a hard-coded relative path starting with /
			// we try to extract the hostname from the referer header
			if(oSession.hostname == '' && oSession.oRequest.headers.Exists('Referer')){
				var referer=oSession.oRequest['Referer'].Replace('capture'+lpath, '');
				referer = (new Regex("https?://", RegexOptions.IgnoreCase)).Replace(referer, '');
				referer=referer.substr(0, referer.indexOf('/'));
				if(referer != '' && referer != 'capture'){
					// we assume that we could extract the right hostname..
					oSession.hostname=referer;
					// should we try to fix the broken reference too?!
					oldPath=oldPath.substr(0, oldPath.indexOf('?'));
					FiddlerObject.log('WARNING: broken reference to '+oldPath+' on '+ oSession.oRequest['Referer'] );
				}
			}
			
			if(oSession.hostname!='capture' && oSession.hostname!=''){ // re-request session
				FiddlerObject.log('will re-request '+actualUrl);
				FiddlerObject.utilIssueRequest(
					oSession.oRequest.headers.ToString(true, true) +
					System.Text.Encoding.UTF8.GetString(oSession.requestBodyBytes)
					);
			}else{
				FiddlerObject.log('NO re-request '+actualUrl);
				FiddlerObject.log('hard-coded relative URL in '+oSession.oRequest['Referer']);
				
			}
			
			oSession.url=oldUrl; // so that Fiddler's session list will be correct..
		}

		if (m_DisableCaching || m_dumpAllResponses ){
			oSession.oResponse.headers.Remove("Expires");
			oSession.oResponse["Cache-Control"] = "no-cache";
		}

		if (m_ShowTimestamp){
			oSession["ui-customcolumn"] = DateTime.Now.ToString("H:mm:ss.ffff") + " " + oSession["ui-customcolumn"];
		}

		if (m_ShowTTLB){
			oSession["ui-customcolumn"] = oSession.oResponse.iTTLB + "ms " + oSession["ui-customcolumn"];
		}

		if (m_Hide304s && oSession.responseCode == 304){
			oSession["ui-hide"] = "true";
		}

		if ((bpStatus>0) && (oSession.responseCode == bpStatus)){
			oSession["x-breakresponse"]="status";
		}

		if ((null!=bpResponseURI) && (oSession.url.indexOf(bpResponseURI)>-1)){
			oSession["x-breakresponse"]="uri";
		}
		//		if (oSession.oResponse.headers.ExistsAndContains("Content-Type", "text/html") && oSession.utilFindInResponse("sap-ext-sid=", false)>-1){
		//			 	oSession.oFlags["x-breakrequest"] = "yup";
		//		}
		/*		if (oSession.host=="www.tom.com" && oSession.oResponse["Content-Type"]=="text/html"){
		// PATCH-63 experiment..
		oSession.oResponse["Content-Type"]='application/xhtml+xml';
		}*/
		/*		if (oSession.host=="www.sasbraathens.no" && oSession.oResponse["Content-Type"]=="text/html; charset=utf-8"){
		oSession.utilDecodeResponse();
		oSession.utilReplaceInResponse('/js/calendar/CEPcalendar.js','http://projects/tmp/sascal.js?');
		oSession.utilReplaceInResponse('/js/misc.js','http://projects/tmp/sasmisc.js?');
		}
		*/
		if (oSession.host=="booking.dfds.it" && oSession.oResponse["Content-Script-Type"]=="text/javascript"){
			/* bad, bad DFDS */
			//			oSession.utilDecodeResponse();
			//			oSession.utilReplaceInResponse('for (q=0; q<document.forms.length; q++) {\n document.forms[q].acceptCharset = \'iso-8859-1\'; }','');
		}
		// Uncomment to reduce incidence of "unexpected socket closure" exceptions in .NET code.
		// Note that you really should also fix your .NET code to gracefully handle unexpected connection closure.
		//
		// if ((oSession.responseCode != 401) && (oSession.responseCode != 407)){
		//   oSession.oResponse["Connection"] = "close";
		// }

		// CORE-23862
		//		oSession.utilDecodeResponse();
		//		oSession.utilReplaceInResponse('onload="if(window.RTE','onload="opera.postError(\'look:\'+this.parentNode.getElementsByTagName(\'textarea\')[0].value);if(window.RTE');

		// CORE-40401
		/*
		if (oSession.host=="stable.philips.2k11.philips2k11.mine.nu" && oSession.oResponse["Content-Type"]=="application/ce-html+xml;charset=\"UTF-8\""){
			oSession.oResponse["Content-Type"]='text/html';
		}*/
		
		/* Y!Mail chat debug section */ 
		if (oSession.oResponse.headers.ExistsAndContains("Content-Type", "text") || oSession.oResponse.headers.ExistsAndContains("Content-Type", "script")){ 
			oSession.utilDecodeResponse();
			var oBody = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);
			var oRegExpPostM=/\C.postMessage\((.*?)\);/g;
			oBody=oBody.replace( oRegExpPostM, 'C.postMessage($1);\nconsole.log("POSTING: "+$1, E.target, window.name, location.href);\n' ); 
			oBody=oBody.replace( '=handlerMap[id];', '=handlerMap[id];if(/_20/.test(id))debugger;console.log("looked up handlerMap["+id+"]", window.name, location.href);' );
			//oBody=oBody.replace('send("reportJSError",', 'console.log("YDEBUG: reportJSError", ' );
			//oBody=oBody.replace('var k=new l.om.ui.views.Overlay(', 'debugger;\nvar k=new l.om.ui.views.Overlay(' );
			//oBody=oBody.replace('v=v.frames[t[1]]', 'if(t[1].indexOf("conversation-window-0")>-1)debugger;\nv=v.frames[t[1]];console.log("after reading frames "+t[1]);' );
			oSession.utilSetResponseBody(oBody);
			//oSession.utilReplaceInResponse( );
			//FiddlerObject.log(oSession.oResponse.headers['Content-Type']+'\n'+oBody.replace(oRegExpPostM, '.postMessage($1);\nconsole.log("POSTING: "+$1);\n' ));
		}
		if( oSession.responseCode==404 && (oSession.host=='t' || oSession.host=='testsuites' || oSession.hostname=='testsuites.oslo.opera.com' || oSession.hostname=='testsuites.oslo.osa' || oSession.hostname=='t.oslo.opera.com' || oSession.hostname=='t.oslo.osa'  )){
			var localWorkInProgressPath= 'e:\\svn\\tmp\\';
			var pathparts = oSession.PathAndQuery.split('/');
            var dirAndFile = pathparts[pathparts.length-2]+'\\'+ pathparts[pathparts.length-1];
            FiddlerObject.log('t 404 - wil look for ' + localWorkInProgressPath+dirAndFile );
			if( File.Exists( localWorkInProgressPath+dirAndFile ) )
    			oSession["x-replywithfile"] = localWorkInProgressPath+dirAndFile ;
            if( File.Exists( 'd:\\projects\\testcases\\'+ pathparts[pathparts.length-1] ) ){
                FiddlerObject.log('t 404 - wil look for ' + 'd:\\projects\\testcases\\'+ pathparts[pathparts.length-1] );
                oSession["x-replywithfile"] = 'd:\\projects\\testcases\\'+ pathparts[pathparts.length-1] ;
            }
		}
        

	}

	static function Main()
	{
  		var today: Date = new Date();
		FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;
	}


	// These static variables are used for simple breakpointing & other QuickExec rules
	static var bpRequestURI:String = null;
	static var bpResponseURI:String = null;
	static var bpStatus:int = -1;
	static var bpMethod: String = null;
	static var uiBoldURI: String = null;
	static var gs_ReplaceToken: String = null;
	static var gs_ReplaceTokenWith: String = null;
	static var gs_OverridenHost: String = null;
	static var gs_OverrideHostWith: String = null;

	// The ExecAction function is called by either the QuickExec box in the Fiddler window,
	// or by the ExecAction.exe command line utility.
	static function OnExecAction(sParams: String[]){
	FiddlerObject.StatusText = "ExecAction: " + sParams[0];

	var sAction = sParams[0].toLowerCase();
	switch (sAction){
	case "bold":
		if (sParams.Length<2) {uiBoldURI=null; FiddlerObject.StatusText="Bolding cleared"; return;}
		uiBoldURI = sParams[1].toUpperCase(); FiddlerObject.StatusText="Bolding requests for " + uiBoldURI;
		break;
	case "bp":
    		FiddlerObject.alert("bpu = breakpoint request for uri\nbpm = breakpoint request method\nbps=breakpoint response status\nbpafter = breakpoint response for URI");
		break;
	case "bps":
		if (sParams.Length<2) {bpStatus=-1; FiddlerObject.StatusText="Response Status breakpoint cleared"; return;}
		bpStatus = parseInt(sParams[1]); FiddlerObject.StatusText="Response status breakpoint for " + sParams[1];
		break;
	case "bpv":
	case "bpm":
		if (sParams.Length<2) {bpMethod=null; FiddlerObject.StatusText="Request Method breakpoint cleared"; return;}
		bpMethod = sParams[1].toUpperCase(); FiddlerObject.StatusText="Request Method breakpoint for " + bpMethod;
		break;
	case "bpu":
		if (sParams.Length<2) {bpRequestURI=null; FiddlerObject.StatusText="RequestURI breakpoint cleared"; return;}
		if (sParams[1].toLowerCase().StartsWith("http://")){sParams[1] = sParams[1].Substring(7);}
		bpRequestURI = sParams[1];
		FiddlerObject.StatusText="RequestURI breakpoint for "+sParams[1];
	break;
	case "bpafter":
		if (sParams.Length<2) {bpResponseURI=null; FiddlerObject.StatusText="ResponseURI breakpoint cleared"; return;}
		if (sParams[1].toLowerCase().StartsWith("http://")){sParams[1] = sParams[1].Substring(7);}
		bpResponseURI = sParams[1];
		FiddlerObject.StatusText="ResponseURI breakpoint for "+sParams[1];
	break;
	case "overridehost":
		if (sParams.Length<3) {gs_OverridenHost=null; FiddlerObject.StatusText="Host Override cleared"; return;}
		gs_OverridenHost = sParams[1].toLowerCase();
		gs_OverrideHostWith = sParams[2];
		FiddlerObject.StatusText="Connecting to [" + gs_OverrideHostWith + "] for requests to [" + gs_OverridenHost + "]";
		break;
	case "urlreplace":
		if (sParams.Length<3) {gs_ReplaceToken=null; FiddlerObject.StatusText="URL Replacement cleared"; return;}
		gs_ReplaceToken = sParams[1];
		gs_ReplaceTokenWith = sParams[2].Replace(" ", "%20");  // Simple helper
		FiddlerObject.StatusText="Replacing [" + gs_ReplaceToken + "] in URIs with [" + gs_ReplaceTokenWith + "]";
		break;
	case "select":
		if (sParams.Length<2) { FiddlerObject.StatusText="Please specify Content-Type to select."; return;}
		FiddlerObject.UI.actSelectSessionsWithResponseHeaderValue("Content-Type", sParams[1]);
		FiddlerObject.StatusText="Searching for Content-Type: " + sParams[1];
		break;
	case "allbut":
	case "keeponly":
		if (sParams.Length<2) { FiddlerObject.StatusText="Please specify Content-Type to retain during wipe."; return;}
		FiddlerObject.UI.actSelectSessionsWithResponseHeaderValue("Content-Type", sParams[1]);
		FiddlerObject.UI.actRemoveUnselectedSessions();
		FiddlerObject.UI.lvSessions.SelectedItems.Clear();
		FiddlerObject.StatusText="Removed all but Content-Type: " + sParams[1];
		break;
	case "stop":
    		FiddlerObject.UI.actDetachProxy();
    		break;
    	case "start":
    		FiddlerObject.UI.actAttachProxy();
    		break;
    	case "cls":
    	case "clear":
    		FiddlerObject.UI.actRemoveAllSessions();
    		break;
	case "g":
	case "go":
		FiddlerObject.UI.actResumeAllSessions();
		break;
    	case "help":
		System.Diagnostics.Process.Start("http://www.fiddlertool.com/redir/?id=quickexec");
    		break;
    	case "hide":
    		FiddlerObject.UI.actMinimizeToTray();
    		break;
    	case "nuke":
		FiddlerObject.UI.actClearWinINETCache();
		FiddlerObject.UI.actClearWinINETCookies();
	break;
    	case "show":
    		FiddlerObject.UI.actRestoreWindow();
    		break;
    	case "quit":
    		FiddlerObject.UI.actExit();
    		break;
    	case "dump":
    		FiddlerObject.UI.actSelectAll();
    		FiddlerObject.UI.actSaveSessionsToZip("C:\\dump.zip");
    		FiddlerObject.UI.actRemoveAllSessions();
    		break;
		case "dump-cleanup":
				FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']='';
				FiddlerApplication.Prefs['urlRewriteValues_ephemeral']='';
			break;
    	default:
    		if (sAction.StartsWith("http") || sAction.StartsWith("www")){
    			System.Diagnostics.Process.Start(sAction);
    		}
    		else
    		FiddlerObject.StatusText = "Requested action: " + sAction + " not found.";
    	}
	}
}

function dumpResponseData( oSession ){
	var localRoot = gLocalDumpRoot, fname='';
	var tmpName=oSession.PathAndQuery.Substring(1); // removes initial slash
	if( tmpName.indexOf('?')>-1 ){ // removes query
		tmpName=tmpName.Substring(0,tmpName.indexOf('?') ); 
	}
	if( tmpName.indexOf('|')>-1 ){ // removes pipe
		tmpName=tmpName.Substring(0,tmpName.indexOf('|') ); 
	}
	if( tmpName.indexOf(';')>-1 ){ // removes semicolon (probably more invalid chars that should be removed)
		tmpName=tmpName.Substring(0,tmpName.indexOf(';') ); 
	}
	
	if( tmpName==='' ){
		tmpName = oSession.SuggestedFilename;
	}else if( tmpName.lastIndexOf('/')==tmpName.length-1 ){ //ends with a slash
		// maybe naming the file 'index' and creating a suitable .htaccess would be better?
		//tmpName = tmpName + oSession.SuggestedFilename;			
		tmpName = tmpName + 'index'; // extension likely .html but there is separate logic for figuring out extension later
	}else{
				
	}
	var hostname = oSession.hostname;
	//			if( hostname.indexOf(':')>-1 ){ // removes port, per Fiddler documentation it should not be there but.. (only CONNECT?)
	//				hostname=hostname.Substring(0,hostname.indexOf(':') ); 
	//			}
	var ext='', localPath='', rewriteReq=false;
	if( tmpName.indexOf('.')==-1 ){ // no extension.. :-/
		if( oSession.oResponse.MIMEType.Contains( 'html' ) ){
			ext='.html';
		}else if( oSession.oResponse.MIMEType.Contains( 'css' ) ){
			ext='.css';
		}else if(oSession.oResponse.MIMEType.Contains( 'javascript' )){
			ext='.js';
		}else if(oSession.oResponse.MIMEType.Contains( 'json' )){
			ext='.json';
		}
	}
	fname= tmpName.Replace( '/', '\\');
	var fileCounter='';
	while( File.Exists( localRoot+hostname + '\\' +fname+fileCounter+ext ) ){
		if(fileCounter==''){
			fileCounter=1;
		}else{
			fileCounter++;
		}
	}
	fname+=fileCounter+ext;
	try{
		localPath = System.IO.Path.GetDirectoryName( localRoot + hostname + '\\' + fname );
	}catch(e){ // GetDirectoryName caused exception, probably too long file or dir name..
		fname = oSession.SuggestedFilename +ext;
		localPath = System.IO.Path.GetDirectoryName( localRoot + hostname + '\\' + oSession.SuggestedFilename +ext );
		FiddlerObject.log(oSession.SuggestedFilename );
		rewriteReq=true;
	}
	if( ext || fileCounter || rewriteReq ){ // this may be obsolete with the new URL Rewrite approach..
		registerURLRewrite( tmpName, fname.Replace('\\', '/'),  hostname );
	}
	fname=localRoot + hostname + '\\' + fname;
	oSession.oFlags['ui-comments']=fname;

	oSession.utilDecodeResponse();
	//var localPath = localRoot + oSession.hostname + '\\' + localDir.replace( '/', '\\' ) + '\\' ;
	if( ! System.IO.Directory.Exists( localPath )) {
		System.IO.Directory.CreateDirectory( localPath );
	}
			
	if( oSession.oResponse.MIMEType.Contains( 'text' ) || oSession.oResponse.MIMEType.Contains( 'script' )  ){
		var code = oSession.GetResponseBodyAsString();
		// trying to rewrite absolute and relative URLs with a crude replace approach..
		// Absolute URLs (breaks all links, sorry)
		var relativePathPrefix = '' ;
		// calculate relative path back to root
		var subfolderCount = oSession.PathAndQuery.Split('/').length-1; // minus one for file name slot 
		for( var i = 0; i < subfolderCount ; i++ ){
			relativePathPrefix +=  '../';
		}
		// Absolute URLs (also tries to handle and Hotmail's odd &#58;-escapes)
		code = (new Regex('(https?(:|&#58;))//', RegexOptions.IgnoreCase )).Replace(code, relativePathPrefix )
		// this rather lame approach breaks xmlns though..
		code = (new Regex('xmlns=("|\')'+relativePathPrefix, 
			RegexOptions.IgnoreCase)).Replace( code, 'xmlns=$1http://' );
		// Google's favourite syntax, //server.name.com/some/file.js - we need to handle this 
		// on a per-server name basis to avoid breaking JS single-line comments..
		code = (new Regex( '//(ssl\.gstatic\.com|gfx\d\.hotmail\.com|ajax\.googleapis\.com|ajax\.cdnjs\.com)' ) ).Replace( code, relativePathPrefix + '$1' );
		// JSON data (hello, Facebook!)
		code = (new Regex( '"src":"https?:\\\\/\\\\/', 
			RegexOptions.IgnoreCase)).Replace( code, '"src":"'+relativePathPrefix );
		// Escaped protocols (hello, Hotmail!)
		code = (new Regex( 'https?\\\\u003a\\\\u002f\\\\u002f', 
			RegexOptions.IgnoreCase)).Replace( code, relativePathPrefix );
		// Kill <base href> (hello, Hotmail!)
		code = (new Regex( '<base href', 
			RegexOptions.IgnoreCase)).Replace( code, '<!base href' );
				
		// relative URLs, SCRIPT and IMG that start with / (relative to hostname)
		relativePathPrefix += oSession.hostname + '/';
		code = (new Regex('src=("|\')/', 
			RegexOptions.IgnoreCase)).Replace(code, 'src=$1'+relativePathPrefix );
		// relative URLs, <LINK>
		code = (new Regex('href=("|\')/', 
			RegexOptions.IgnoreCase)).Replace( code, 'href=$1'+relativePathPrefix );
		// Relative URLs, CSS
		code = (new Regex( 'url\\(("|\'|)/', 
			RegexOptions.IgnoreCase)).Replace( code, 'url($1'+relativePathPrefix );
		if(FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']){
			var keys = FiddlerApplication.Prefs['urlRewriteKeys_ephemeral'].split('\t'), 
				replacements = FiddlerApplication.Prefs['urlRewriteValues_ephemeral'].split('\t');
			for(var i=0;i<keys.length;i++){
				code=code.Replace( keys[i], replacements[i] );
			}
		}
		System.IO.File.WriteAllText( fname, code );
	}else{
		oSession.SaveResponseBody( fname  );
	}
	// update the "map" of resources used by URL rewriter
	System.IO.File.AppendAllText( localRoot+'_index.csv', '\n'+hostname+oSession.PathAndQuery+'\t'+fname.replace(localRoot, '') );
	System.IO.File.AppendAllText( localRoot+'_hostnames.txt', '\n'+hostname );
			
	// OK. So far, so good. We've created a local resource, but the real challenge
	// is updating any references to it...
	var relativePath = '..\\' + oSession.hostname + '\\' + oSession.SuggestedFilename;
	var files = System.IO.Directory.GetFiles( localRoot, '*.*');
	
	}


function registerURLRewrite( realURL, rewriteURL, hostname ){
	if( ! FiddlerApplication.Prefs['urlRewriteKeys_ephemeral'] ){
		FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']='';
	}else{
		FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']+='\t';
	}
	
	if( ! FiddlerApplication.Prefs['urlRewriteValues_ephemeral'] ){
		FiddlerApplication.Prefs['urlRewriteValues_ephemeral']='';
	}else{
		FiddlerApplication.Prefs['urlRewriteValues_ephemeral']+='\t';
	}
	
	FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']+=realURL;
	FiddlerApplication.Prefs['urlRewriteValues_ephemeral']+=rewriteURL;
	FiddlerApplication.Prefs['urlRewriteKeys_ephemeral']+='\t'+hostname+'/'+realURL;
	FiddlerApplication.Prefs['urlRewriteValues_ephemeral']+='\t'+hostname+'/'+rewriteURL;

}