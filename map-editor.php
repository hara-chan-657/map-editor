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
        $projectsData = $obj->getProjectsData();
	}
} else {
    $saveMapContainer = '';
    $projectsData = '';
}

if (isset($_POST['map_image_data']) && isset($_POST['map_obj_data'])) {
    //マップ画像データとマップオブジェクトデータを取得
    $mapImageData = $_POST['map_image_data'];
    $mapObjData = $_POST['map_obj_data'];

    if (isset($_POST['oldProjectName'])) {
        //既存プロジェクトに保存の場合
        $oldProjectName = $_POST['oldProjectName'];
        $mapName = $_POST['mapName'];
        $ret = $obj->addMapDataToOldProject($oldProjectName, $mapImageData, $mapObjData, $mapName);
        if ($ret) {
            echo '保存しました！';
        } else {
            echo $ret;
        }
    } else if (isset($_POST['newProjectName'])) {
        //新規プロジェクトに保存の場合
        $newProjectName = $_POST['newProjectName'];
        $mapName = $_POST['mapName'];
        $projectData = $_POST['project_data'];
        $ret = $obj->addMapDataToNewProject($newProjectName, $mapImageData, $mapObjData, $mapName, $projectData);
        if ($ret) {
            echo '保存しました！';
        } else {
            echo $ret;
        }
    } else {
        //マップ更新の場合
        $updateMapProject = $_POST['updateMapProject'];
        $mapName = $_POST['updateMapName'];
        $projectData = $_POST['project_data'];
        $ret = $obj->updateMapData($updateMapProject, $mapImageData, $mapObjData, $mapName, $projectData);
        if ($ret) {
            echo '保存しました！';
        } else {
            echo $ret;
        }
    }
}

//初期表示のためのマップチップ取得
$mapChips = $obj->getMapChips();

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>map-editor</title>
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
            <!-- <span class="option"><img src="./image/map-editor/back.png" alt="戻るダミー" id="backDummy"><img src="./image/map-editor/backActv.png" alt="戻る" id="back"><span class="z2">戻る</span></span>
            <span class="option"><img src="./image/map-editor/forward.png" alt="進むダミー" id="forwardDummy"><img src="./image/map-editor/forwardActv.png" alt="進む" id="forward"><span class="z2">進む</span></span> -->
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
            <div id="mapStatusContainer">
                <p id="mapStatus"></p>
                <p id="selectedMapName"></p>
                <button id="clearSelectedMapButton">選択中マップの編集を中止する</button>
            </div>
            <div id="mapContainer">
                <div id="mapBG">
                    <canvas id="mapCanvas"></canvas>
                    <img src="" id="currentMapImage" style="display:none">
                </div>
            </div>
            <div id="mapChipContainer">
                <div id="currentMapChipContainer">
                    <p class="mapCategory">現在選択中のチップ<span id="currentMapChipSize"></p>
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
                                echo '<img src="'.$file.'" alt="キャラクターマップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                    <div id="mapIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>地形
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['map'] AS $file) {
                                echo '<img src="'.$file.'" alt="地形マップチップ" class="mapchip">';
                            }
                            ?>
                        </div>
                    </div>
                    <div id="mapPassIconContainer">
                        <p class="mapCategory">
                            <span class="unfoldButton">＋</span>
                            <span class="foldButton">ー</span>地形通りぬけ
                        </p>
                        <div class="acordion">
                            <?php
                            foreach ($mapChips['mapPass'] AS $file) {
                                echo '<img src="'.$file.'" alt="地形通りぬけマップチップ" class="mapchip">';
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
                                echo '<img src="'.$file.'" alt="ツールマップチップ" class="mapchip">';
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
                                echo '<img src="'.$file.'" alt="建物マップチップ" class="mapchip">';
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
            <div id="projectsContainer">
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
    </div>

    <script src="./js/map-editor.js"></script>
</body>
</html>