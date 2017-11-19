<?php

/**
 * Yahoo! JAPAN Web APIのご利用には、アプリケーションIDの登録が必要です。
 * あなたが登録したアプリケーションIDを $appid に設定してお使いください。
 * アプリケーションIDの登録URLは、こちらです↓
 * http://e.developer.yahoo.co.jp/webservices/register_application
 */
$appid = '<アプリケーションID>'; // <-- ここにあなたのアプリケーションIDを設定してください。

function escapestring($str) {
    return htmlspecialchars($str, ENT_QUOTES);
}
if (isset($_POST['sentence'])) {
    $sentence = mb_convert_encoding($_POST['sentence'], 'utf-8', 'auto');
}
else {
    $sentence = "";
}
if (isset($_POST['ma_response'])) {
    $ma_response = join(",", array_values($_POST['ma_response']));
    $arr_response = $_POST['ma_response'];
}
else {
    $ma_response = "";
    $arr_response = array();
}
if (isset($_POST['ma_filter'])) {
    $ma_filter = join("|", array_values($_POST['ma_filter']));
    $arr_filter = $_POST['ma_filter'];
}
else {
    $ma_filter = "";
    $arr_filter = array();
}
?>
<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=UTF-8">
<title>テキスト解析デモ - 日本語形態素解析</title>
</head>
<body>
<h3>テキスト解析デモ - 日本語形態素解析</h3><br />
<form name="myForm" method="post" action="./ma_sample.php">
<table>
<tr><th bgcolor="#ffff77">解析対象の文</th><th bgcolor="#77ffff">　　文書の解析結果</th></tr>
<tr>
<td valign="top">
<textarea name="sentence" rows="15" cols="50"><?php echo escapestring($sentence); ?></textarea><br />
<input type="submit" name="exec" value="解析" /><br />
</td>
<td valign="top">
<?php 
if ($sentence != "") {
    $url = "http://jlp.yahooapis.jp/MAService/V1/parse?appid=".$appid."&results=ma";
    $url .= "&sentence=".urlencode($sentence);
    $xml  = simplexml_load_file($url);
    foreach ($xml->ma_result->word_list->word as $cur){echo escapestring($cur->surface)." | "; }
}
?>
</td>
</tr>
<tr><th bgcolor="#ccff66">解析オプション</th><th bgcolor="#0099ff">形態素の表示</th></tr>
<tr>
<td valign="top">
レスポンスの種類を指定<br />
<input type="checkbox" name="ma_response[0]" value="surface"  <?php if (isset($arr_response[0]) && $arr_response[0] != "") { echo "checked"; } ?>>表記
<input type="checkbox" name="ma_response[1]" value="reading"  <?php if (isset($arr_response[1]) && $arr_response[1] != "") { echo "checked"; } ?>>よみ
<input type="checkbox" name="ma_response[2]" value="pos"      <?php if (isset($arr_response[2]) && $arr_response[2] != "") { echo "checked"; } ?>>品詞
<input type="checkbox" name="ma_response[3]" value="baseform" <?php if (isset($arr_response[3]) && $arr_response[3] != "") { echo "checked"; } ?>>基本形
<input type="checkbox" name="ma_response[4]" value="feature"  <?php if (isset($arr_response[4]) && $arr_response[4] != "") { echo "checked"; } ?>>全情報<br />
<br />
指定した品詞のみ出力<br />
<input type="checkbox" name="ma_filter[0]"   value="1"        <?php if (isset($arr_filter[0]) && $arr_filter[0] != "") { echo "checked"; } ?>>1:形容詞
<input type="checkbox" name="ma_filter[1]"   value="2"        <?php if (isset($arr_filter[1]) && $arr_filter[1] != "") { echo "checked"; } ?>>2:形容動詞
<input type="checkbox" name="ma_filter[2]"   value="3"        <?php if (isset($arr_filter[2]) && $arr_filter[2] != "") { echo "checked"; } ?>>3:感動詞
<input type="checkbox" name="ma_filter[3]"   value="4"        <?php if (isset($arr_filter[3]) && $arr_filter[3] != "") { echo "checked"; } ?>>4:副詞<br />
<input type="checkbox" name="ma_filter[4]"   value="5"        <?php if (isset($arr_filter[4]) && $arr_filter[4] != "") { echo "checked"; } ?>>5:連体詞
<input type="checkbox" name="ma_filter[5]"   value="6"        <?php if (isset($arr_filter[5]) && $arr_filter[5] != "") { echo "checked"; } ?>>6:接続詞
<input type="checkbox" name="ma_filter[6]"   value="7"        <?php if (isset($arr_filter[6]) && $arr_filter[6] != "") { echo "checked"; } ?>>7:接頭辞
<input type="checkbox" name="ma_filter[7]"   value="8"        <?php if (isset($arr_filter[7]) && $arr_filter[7] != "") { echo "checked"; } ?>>8:接尾辞<br />
<input type="checkbox" name="ma_filter[8]"   value="9"        <?php if (isset($arr_filter[8]) && $arr_filter[8] != "") { echo "checked"; } ?>>9:名詞
<input type="checkbox" name="ma_filter[9]"   value="10"       <?php if (isset($arr_filter[9]) && $arr_filter[9] != "") { echo "checked"; } ?>>10:動詞
<input type="checkbox" name="ma_filter[10]"  value="11"       <?php if (isset($arr_filter[10]) && $arr_filter[10] != "") { echo "checked"; } ?>>11:助詞
<input type="checkbox" name="ma_filter[11]"  value="12"       <?php if (isset($arr_filter[11]) && $arr_filter[11] != "") { echo "checked"; } ?>>12:助動詞<br />
<input type="checkbox" name="ma_filter[12]"  value="13"       <?php if (isset($arr_filter[12]) && $arr_filter[12] != "") { echo "checked"; } ?>>13:特殊（句読点、カッコ、記号など）<br />
</td>
<td valign="top" align="center">
<table border="1">
<?php
if ($sentence != "") {
    echo "<tr>\n";
    if (isset($arr_response[0]) && $arr_response[0] != "") { echo "<th>表記</th>"  ; }
    if (isset($arr_response[1]) && $arr_response[1] != "") { echo "<th>よみ</th>"  ; }
    if (isset($arr_response[2]) && $arr_response[2] != "") { echo "<th>品詞</th>"  ; }
    if (isset($arr_response[3]) && $arr_response[3] != "") { echo "<th>基本形</th>"; }
    if (isset($arr_response[4]) && $arr_response[4] != "") { echo "<th>全情報</th>"; }
    echo "</tr>\n";
    $url = "http://jlp.yahooapis.jp/MAService/V1/parse?appid=".$appid."&results=ma";
    if ($ma_response != "") { $url .= "&ma_response=".$ma_response;          }
    if ($ma_filter   != "") { $url .= "&ma_filter="  .urlencode($ma_filter); }
    $url .= "&sentence=".urlencode($sentence);
    $xml  = simplexml_load_file($url);
    foreach ($xml->ma_result->word_list->word as $cur){
        echo "<tr>\n";
        if (isset($arr_response[0]) && $arr_response[0] != "") { echo "<td>".escapestring($cur->surface )."</td>"; }
        if (isset($arr_response[1]) && $arr_response[1] != "") { echo "<td>".escapestring($cur->reading )."</td>"; }
        if (isset($arr_response[2]) && $arr_response[2] != "") { echo "<td>".escapestring($cur->pos     )."</td>"; }
        if (isset($arr_response[3]) && $arr_response[3] != "") { echo "<td>".escapestring($cur->baseform)."</td>"; }
        if (isset($arr_response[4]) && $arr_response[4] != "") { echo "<td>".escapestring($cur->feature )."</td>"; }
        echo "</tr>\n";
    }
}
?>
</table></td></tr></table></form>

</body>
</html>