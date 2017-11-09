//=======================================================================
//  ClassName : Clalis HTML5+Javascriptサンプル
//  概要      : ClalisAPIサンプル
//
// Copyright  : 2013 LipliStyle
// 
// ライセンス : MIT License
// ・本ソフトウェアは無保証です。作者は責任を追いません。
// ・上記の著作権表示を記載して下さい。
// ・上記の２項に同意頂ければ自由に使用して頂けます。
//=======================================================================

///-----------------------------------------------------------------------
///
///                                初期化
///
///-----------------------------------------------------------------------

function init()
{
	//document.getElementById("inputClalisEmotional").value="今日はお天気がいいですね。お洗濯にはもってこいです！";
	
//xml defaultURI:http://liplis.mine.nu/xml/Tone/LiplisLili.xml
	document.getElementById("inputClalisTone").value="今日はお天気がいいですね。お洗濯にはもってこい！";
	document.getElementById("inputClalisToneUrl").value="http://liplis.mine.nu/xml/Tone/LiplisLili.xml";
	
	//document.getElementById("inputClalisToneEmotional").value="今日はお天気がいいですね。お洗濯にはもってこい！";
	//document.getElementById("inputClalisToneEmotionalUrl").value="http://liplis.mine.nu/xml/Tone/LiplisLili.xml";
}

///-----------------------------------------------------------------------
///
///                          イベントハンドラ
///
///-----------------------------------------------------------------------
function ClalisEmotional() {
	clalisEmotional(document.getElementById("inputClalisEmotional").value);
}

function ClalisTone() {
	clalisTone(document.getElementById("inputClalisTone").value,document.getElementById("inputClalisToneUrl").value);
}

function ClalisToneEmotionnal() {
	clalisToneEmotional(document.getElementById("inputClalisToneEmotional").value,document.getElementById("inputClalisToneEmotionalUrl").value);
}

///-----------------------------------------------------------------------
///
///                              一般処理
///
///-----------------------------------------------------------------------

///----------------------------------------------
/// getUserAgent
/// ユーザーエージェントを取得する
/// 引数   : なし
/// 戻り値 : なし
///----------------------------------------------
function getUserAgent() {
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('opera') != -1) {
        return 'opera';
    } else if (userAgent.indexOf('msie') != -1) {
        return 'ie'
    } else if (userAgent.indexOf('chrome') != -1) {
        return 'chrome'
    } else if (userAgent.indexOf('safari') != -1) {
        return 'safari'
    } else if (userAgent.indexOf('gecko') != -1) {
        return 'gecko'
    } else {
        return 'other'
    }
}

/// <summary>
/// タイムスタンプを取得する
/// </summary>
function getTimeText() {
	var date = new Date();
    
    return date.getFullYear() + (date.getMonth() + 1)+ date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
}


///-----------------------------------------------------------------------
///
///                        Clalis APIアクセス処理
///
///-----------------------------------------------------------------------

///----------------------------------------------
/// clalisEmotional
/// 対象の文章にメタ感情を付与して結果を返します。
/// 引数   : 対象の日本語の文章
/// 戻り値 : なし
///----------------------------------------------
function clalisEmotional(sentence) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisEmotional.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisEmotionalIe(sentence);
	}
	else {
		clalisEmotionalFx(sentence);
	}
	
	///--------------------------
	/// clalisEmotionalFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalFx(sentence) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisEmotionalSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence);
	}
	
	///--------------------------
	/// clalisEmotionalIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalIe(sentence) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisEmotionalSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence));
	}
	
	///--------------------------
	/// clalisEmotionalSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalSetResult(jsonDoc)
	{

		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + "単語:" + jsonDoc.resWordList[i].name + " , 感情:" + jsonDoc.resWordList[i].emotion + " , 感情値:" + jsonDoc.resWordList[i].point + "\n";
		}
				
		document.getElementById("resultClalisEmotional").value = result;
	}
}


///----------------------------------------------
/// clalisTone
/// 対象の文章を口調変換ルールファイルに従って変換します。
/// 引数   : 対象の日本語の文章
///          口調変換ルールURL
/// 戻り値 : なし
///----------------------------------------------
function clalisTone(sentence, rureUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/ClalisTone.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisToneIe(sentence, rureUrl);
	}
	else {
		clalisToneFx(sentence, rureUrl);
	}
	
	///--------------------------
	/// clalisToneFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneFx(sentence, rureUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				var jsonDoc = eval( '(' + xmlhttp.responseText + ')' );
				document.getElementById("resultClalisTone").value = jsonDoc.result;
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneIe(sentence, rureUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			var jsonDoc = eval( '(' + xdr.responseText + ')' );
			document.getElementById("resultClalisTone").value = jsonDoc.result;
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence) + "&toneFileUrl=" + rureUrl);
	}
}


///----------------------------------------------
/// clalisToneEmotional
/// 対象の文章を口調変換ルールファイルに従って変換します。さらに、感情付与を行います。
/// 引数   : 対象の日本語の文章
///          口調変換ルールURL
/// 戻り値 : なし
///----------------------------------------------
function clalisToneEmotional(sentence, rureUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/ClalisToneEmotional.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisToneEmotionalIe(sentence, rureUrl);
	}
	else {
		clalisToneEmotionalFx(sentence, rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalFx(sentence, rureUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisToneEmotionalSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalIe(sentence, rureUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisToneEmotionalSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence) + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalSetResult(jsonDoc)
	{

		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + "単語:" + jsonDoc.resWordList[i].name + " , 感情:" + jsonDoc.resWordList[i].emotion + " , 感情値:" + jsonDoc.resWordList[i].point + "\n";
		}
				
		document.getElementById("resultClalisToneEmotional").value = result;
	}
}