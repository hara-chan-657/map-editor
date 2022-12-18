<?php
require_once('map-editor-ctrl.php');
require_once('map-editor-model.php');

$obj = new mapEditor();

if(isset($_GET['id']) && isset($_GET['pas'])) {
	$id = $_GET['id'];
	$pas = $_GET['pas'];
	$adminRes = $obj->isAdmin($id, $pas);
	if ($adminRes) {
        $saveMapContainer = $obj->getSaveMapContainer();
        $mapUpdateContainer = $obj->getMapUpdateContainer();
        $mapCopyContainer = $obj->getMapCopyContainer();
        $projectsData = $obj->getProjectsData();
        $deleteMaptipBtn = $obj->getdeleteMaptipBtn();
	}
} else {
    $saveMapContainer = '';
    $mapUpdateContainer = '';
    $mapCopyContainer = '';
    $projectsData = '';
    $deleteMaptipBtn = '';
}

if (isset($_POST['mapchipPath'])) {
    $mapchipPath = $_POST['mapchipPath'];
    $ret = $obj->deleteMapchip($mapchipPath);

    if ($ret['file']) {
        echo $_POST['mapchipPath'] . ' を削除しました！';
    } else {
        echo $_POST['mapchipPath'] . ' を削除できませんでした。';
    }

    if (isset($ret['dir'])) {
        if ($ret['dir']) {
            echo '<br>最後のファイルなのでディレクトリも削除しました！';
        } else {
            echo '<br>最後のファイルでしたがディレクトリを削除できませんでした';
        }
    }

}

if (isset($_POST['map_image_data']) && isset($_POST['map_obj_data'])) {
    //マップ画像データとマップオブジェクトデータを取得
    $mapImageData = $_POST['map_image_data'];
    $mapObjData = $_POST['map_obj_data'];

    if (isset($_POST['oldProjectName2'])) {
        //既存プロジェクトに保存の場合
        $oldProjectName = $_POST['oldProjectName2'];
        $mapName = $_POST['mapName'];
        $projectData = $_POST['project_data'];
        $ret = $obj->addMapDataToOldProject($oldProjectName, $mapImageData, $mapObjData, $mapName, $projectData);
        if ($ret === true) {
            echo '保存しました！';
        } else {
            echo $ret;
        }
    } else if (isset($_POST['updateMapName'])) {
        //マップ更新の場合
        $updateMapProject = $_POST['updateMapProject'];
        $mapName = $_POST['updateMapName'];
        $projectData = $_POST['project_data'];
        $allMapData = $_POST['all_map_data'];
        $ret = $obj->updateMapData($updateMapProject, $mapImageData, $mapObjData, $mapName, $projectData, $allMapData);
        if ($ret) {
            echo 'rpg-editorとrpg-playerを更新しました！';
        } else {
            echo $ret;
        }
    } else {
        //マップ複製の場合
        $updateMapProject = $_POST['copyMapProject'];
        $mapName = $_POST['copyMapName'];
        $projectData = $_POST['project_data'];
        $ret = $obj->addMapDataToOldProject($updateMapProject, $mapImageData, $mapObjData, $mapName, $projectData);
        if ($ret) {
            echo '複製しました！';
        } else {
            echo $ret;
        }
    }
}

if (isset($_POST['deleteMap'])) {
    $projectName = $_POST['projectName'];
    $pngBaseName = $_POST['pngBaseName'];
    $retArray = $obj->deleteMap($projectName, $pngBaseName);
    foreach ($retArray as $key => $value) {
        echo $value ."<br>";
    }
}

//初期表示のためのマップチップ取得
$mapChips = $obj->getMapChips();
//マップチップ一覧の取得
$allMapChips = $obj->makeAllMapChipHtml($mapChips);

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>mapEditor</title>
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
    <ul>
        <li style="color:red; font-size: 8px;">※マップの大きさを変更した時点で、「戻る・進む」はリセットされます（これは仕様）</li>
        <li style="color:red; font-size: 8px;">※デリート時、「マップ属性用もどる配列」のデータを一つ多く更新してしまうバグがたまに起きる（発生条件不明、なのでデリート→もどるは注意）</li>
        <li style="color:red; font-size: 8px;">※複数行・複数列のマップチップを使用する際は、はみ出ないように描画してください（めんどくさくて直していない仕様）</li>
        <li style="color:red; font-size: 8px;">※シフトする際は画面をまたがないようにしてください（設定済みの特定のイベントやプロジェクトデータが不正になる恐れがある）</li>
    </ul>
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
            <span class="option"><img src="./image/map-editor/addRowTop.png" alt="一行上に増やす" id="addRowTop" class="z1"><span class="z2">一行上に増やす</span></span>
            <span class="option"><img src="./image/map-editor/addRowUnder.png" alt="一行下に増やす" id="addRowUnder" class="z1"><span class="z2">一行下に増やす</span></span>
            <span class="option"><img src="./image/map-editor/addColRight.png" alt="一行右に増やす" id="addColRight" class="z1"><span class="z2">一列右に増やす</span></span>
            <span class="option"><img src="./image/map-editor/addColLeft.png" alt="一行左に増やす" id="addColLeft" class="z1"><span class="z2">一列左に増やす</span></span>
            <span class="option"><img src="./image/map-editor/delRowTop.png" alt="一行上を減らす" id="delRowTop" class="z1"><span class="z2">一行上を減らす</span></span>
            <span class="option"><img src="./image/map-editor/delRowUnder.png" alt="一行下を減らす" id="delRowUnder" class="z1"><span class="z2">一行下を減らす</span></span>
            <span class="option"><img src="./image/map-editor/delColRight.png" alt="一行右を減らす" id="delColRight" class="z1"><span class="z2">一列右を減らす</span></span>
            <span class="option"><img src="./image/map-editor/delColLeft.png" alt="一行左を減らす" id="delColLeft" class="z1"><span class="z2">一列左を減らす</span></span>
        </div>
        <div id="canvas-container">
            <button onclick="switchCanvasSize()">キャンバス大きさ変更</button>
            <p>カーソル位置（<span id="cursorPos"></span>）</p>
            <p>シフトX（<span id="map_shift_x">0</span>）： シフトY（<span id="map_shift_y">0</span>）</p>
            <div id="mapStatusContainer">
                <p id="mapStatus"></p>
                <p id="selectedMapName"></p>
                <button id="clearSelectedMapButton">選択中マップの編集を中止する</button>
            </div>
            <p style="color: red; margin:1px;">wキー長押し：playerの画面幅を表示します</p>
            <p style="color: red; margin:1px;">eキー長押し：選択中チップの範囲と画像を描画します</p>
            <p style="color: red; margin:1px;">rキー長押し：特殊チップのタグを表示します</p>
            <div id="mapContainer">
                <div id="mapBG">
                    <canvas id="mapCanvas"></canvas>
                    <img src="" id="currentMapImage" style="display:none">
                </div>
            </div>
            <div id="mapChipContainer">
                <div id="currentMapChipContainer">
                    <p class="mapCategory">現在選択中のチップ<span id="currentMapChipSize"><?php echo $deleteMaptipBtn ?></p>
                    <div id="currentMapChipBG">
                        <img src="" id="currentMapChip">
                    </div>
                </div>
                <div id="MprojectContainer">
                    <?php echo $allMapChips; ?>
                </div>
            </div>
            <div id="preview-link-container">
		        <span><label for="preview-link" id="previewLinkButton">プレビュー&ダウンロード</label></span>
		        <button id="preview-link">プレビュー&ダウンロード</button>
            </div>
            <div id="projectsContainer">
                <p>■ 既存マップ更新用コンテナ</p>
                <p style="color: red">
                    ※ 更新の際、設定済みのマップチップ情報は受け継がれます。<br>
                    ただし、上書きしたチップに関しては、初期化されます。ご注意ください。
                </p>
                <?php echo $projectsData ?>
            </div>
        </div>
    </div>
    <div id="preview-container">
        <img id ="preview" src="">
        <br>
		<span id="rewrite">書き直す</span>
        <a id="download-link" href="" download="">ダウンロード</a>
        <?php echo $saveMapContainer ?>
        <?php echo $mapUpdateContainer ?>
        <?php echo $mapCopyContainer ?>
    </div>

    <script src="./js/map-editor.js"></script>
</body>
</html>