<?php
require_once('map-editor-ctrl.php');
require_once('map-editor-lgc.php');

//初期表示のためのマップチップ取得
$obj = new mapEditor();
$mapChips = $obj->getMapChips();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>はらちゃんマップエディタ</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="favicon.ico">
<link rel="apple-touch-icon" href=".png">
<link rel="stylesheet" href="./css/map-editor.css">
<link rel="stylesheet"
	href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
	integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
	crossorigin="anonymous">
<script
    src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js">
</script>
</head>
<body>
    <div id="header-container">
		<img src="./image/map-editor/header.png" alt="ヘッダー画像">	
	</div>
    <div id="editContainer">
        <div id="options">
            <span class="option"><img src="./image/map-editor/back.png" alt="戻るダミー" id="backDummy"><img src="./image/map-editor/backActv.png" alt="戻る" id="back"><span class="z2">戻る</span></span>
            <span class="option"><img src="./image/map-editor/forward.png" alt="進むダミー" id="forwardDummy"><img src="./image/map-editor/forwardActv.png" alt="進む" id="forward"><span class="z2">進む</span></span>
            <span class="option"><img src="./image/map-editor/put.png" alt="プット" id="put" class="z1"><span class="z2">プット</span></span>
		    <span class="option"><img src="./image/map-editor/delete.png" alt="デリート" id="delete" class="z1"><span class="z2">デリート</span></span>
		    <span class="option"><img src="./image/map-editor/shiftLeft.png" alt="左シフト" id="shiftLeft" class="z1"><span class="z2">左シフト</span></span>
		    <span class="option"><img src="./image/map-editor/shiftRight.png" alt="右シフト" id="shiftRight" class="z1"><span class="z2">右シフト</span></span>
		    <span class="option"><img src="./image/map-editor/shiftAbove.png" alt="上シフト" id="shiftAbove" class="z1"><span class="z2">上シフト</span></span>
            <span class="option"><img src="./image/map-editor/shiftBelow.png" alt="下シフト" id="shiftBelow" class="z1"><span class="z2">下シフト</span></span>
            <span class="option"><img src="./image/map-editor/addRow.png" alt="一行増やす" id="addRow" class="z1"><span class="z2">一行増やす</span></span>
            <span class="option"><img src="./image/map-editor/addCol.png" alt="一行増やす" id="addCol" class="z1"><span class="z2">一列増やす</span></span>
            <span class="option"><img src="./image/map-editor/delRow.png" alt="一行減らす" id="delRow" class="z1"><span class="z2">一行減らす</span></span>
            <span class="option"><img src="./image/map-editor/delCol.png" alt="一行減らす" id="delCol" class="z1"><span class="z2">一列減らす</span></span>
        </div>
        <div id="canvas-container">
            <div id="mapStatusContainer">
                <p id="mapStatus"></p>
            </div>
            <div id="mapContainer">
                <div id="mapBG">
                    <canvas id="mapCanvas"></canvas>
                </div>
            </div>
            <div id="mapChipContainer">
                <div id="currentMapChipContainer">
                    <p class="mapCategory">現在選択中のチップ</p>
                    <div id="currentMapChipBG">
                        <img src-"" id="currentMapChip">
                    </div>
                </div>
                <div id="maps">
                    <div id="characterIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>キャラクター
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['character'] AS $file) {
                                echo '<img src="'.$file.'" alt="マップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                    <div id="mapIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>マップ
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['map'] AS $file) {
                                echo '<img src="'.$file.'" alt="マップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                    <div id="toolIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>ツール
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['tool'] AS $file) {
                                echo '<img src="'.$file.'" alt="マップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                    <div id="buildingIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>建物
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['building'] AS $file) {
                                echo '<img src="'.$file.'" alt="マップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
            <div id="preview-link-container">
		        <span><label for="preview-link" id="previewLinkButton">プレビュー&ダウンロード</label></span>
		        <button id="preview-link">プレビュー&ダウンロード</button>
            </div>
        </div>
    </div>
    <div id="preview-container">
		<img id ="preview" src="">
		<span id="rewrite">書き直す</span>
		<a id="download-link" href="" download="">ダウンロード</a>
	</div>
    <script src="./js/map-editor.js"></script>
</body>
</html>