<?php
$imageData = $_POST["hidden_input"];
var_dump($imageData);
$imageData = base64_decode($imageData);
var_dump($imageData);
// 画像を保存
$fp = fopen("test.png", "wb");
fwrite($fp, $imageData);
fclose($fp);

$jsonTxt = $_POST["hidden_input2"];
var_dump($jsonTxt);
$fp = fopen("testjson.json", "wb");
fwrite($fp, $jsonTxt);
fclose($fp);



// 保存した画像を出力
// header('Content-Type: image/png');
// header("Cache-control: no-cache");
// header('Content-Disposition: attachment; filename="test.png"');
// readfile("test.png");

?>