<?php
//map-editorのmodel
//クラスを作って、コンストラクタと各ファンクションを記述する
require("admin.php");

class mapEditor {

    private $mapChips; //マップチップ配列
    private $maptipTypes; //マップチップ種類
    private $mapChipDirPath; //マップチップディレクトリパス
    private $projectDirPath; //プロジェクトディレクトリパス
    private $projectDirPathPlayer; //プロジェクトディレクトリパス

    /**
     * マップエディタコンストラクタ
     */
    function __construct() {
        $this->mapChips = array();
        $this->MaptipTypes = array(
            '選択してください',
            'character',
            'map',
            'mapPass',
            'tool',
            'building',
            'mapRepeat',
            'mapTurn',
            'mapTurnPass',
            'design'
        );
        $this->mapChipDirPath = './image/map-editor/map-chip/';
        $this->projectDirPath = '../rpg-editor/public/projects/';
        $this->projectDirPathPlayer = '../rpg-player/public/projects/'; //このパスを保存に反映させる！！！！！
    }

    /**
     * マップチップを取得する
     */
    function getMapChips(){
        //表示させないディレクトリ配列
        $excludes = array(
            '.',
            '..',
            '.DS_Store'
        );
        $retArray = array();
        //マップチップディレクトリのディレクトリ（カテゴリ）を取得する
        $projects = scandir($this->mapChipDirPath);
        if ($this->checkIsDirEmpty($projects)) {
            $retArray[0] = 'プロジェクトがありません';
            return $retArray;
        }
        foreach ($projects AS $project) {
            //特定のディレクトリの場合は表示させない
            if (in_array($project, $excludes)) continue;
            $mapTypes = scandir($this->mapChipDirPath . $project);
            if ($this->checkIsDirEmpty($mapTypes)) {
                $retArray[$project][0] = $project .'は空です';
                continue;
            }
            foreach ($mapTypes AS $mapType) {
                //特定のディレクトリの場合は表示させない
                if (in_array($mapType, $excludes)) continue;
                //ここからはファイルとディレクトリが混在する。
                $rets = scandir($this->mapChipDirPath . $project . '/' . $mapType);
                if ($this->checkIsDirEmpty($rets)) {
                    $retArray[$project][$mapType][0] = $mapType .'は空です';
                    continue;
                }
                foreach ($rets AS $ret) {
                    //特定のディレクトリの場合は表示させない
                    if (in_array($ret, $excludes)) continue;
                    if (substr($ret, -4) == '.png') {
                        //マップファイルの場合
                        $retArray[$project][$mapType][] = $ret;
                    } else {
                        //ディレクトリの場合
                        //正直ここからはマップチップの構成が変わると階層をいじる必要が出てくるかも。まあそん時はそん時。
                        $files = scandir($this->mapChipDirPath . $project . '/' . $mapType . '/' . $ret);
                        if ($this->checkIsDirEmpty($files)) {
                            //$retArray[$project][$mapType][$ret][0] = $project . '/' . $mapType . '/' . $ret. 'は空です';
                            $retArray[$project][$mapType][$ret][0] = $ret. 'は空です';
                            continue;
                        }
                        foreach ($files AS $file) {
                            //特定のディレクトリの場合は表示させない
                            if (in_array($file, $excludes)) continue;
                            $retArray[$project][$mapType][$ret][] = $file;
                        }
                    }
                }
            }
        }
        return $retArray;
    }

    function checkIsDirEmpty($dir) {
        if (count($dir) == 0) return true;
        foreach ($dir AS $file) {
            if ($file == '.' || $file == '..') continue;
            return false;
        }
        return true;
    }

    function makeAllMapChipHtml($mapChips) {
        $html = '';
        if ($mapChips[0] == 'プロジェクトがありません') {
            $html .= '<div>プロジェクトがありません</div>';
            return $html;
        }
        foreach($mapChips AS $prjKey => $project){ 
            if (substr($project[0], -9) == '空です') {
                $html .= '<div style="color:red;">' . $project[0] . '</div>';
                continue;
            }
            $html .= '<div class="Cprojects" style="color:red">';
            $html .= '<span class="unfoldButton">＋</span>';
            $html .= '<span class="foldButton">ー</span>' . $prjKey;
            $html .= '</div>';
            $html .= '<div class="acordion">';
            foreach ($project AS $mapTypeKey => $mapType) {
                if (substr($mapType[0], -9) == '空です') {
                    $html .= '<div style="color:orange; margin-left:10px; margin-top:4px; border-left:1px solid black;">' . $mapType[0] . '</div>';
                    continue;
                }
                $html .= '<div class="CmapTypes" style="color:orange; margin-left:10px; margin-top:4px; border-left:1px solid black;">';
                $html .= '<span class="unfoldButton">＋</span>';
                $html .= '<span class="foldButton">ー</span>' . $mapTypeKey;
                $html .= '</div>';
                $html .= '<div class="acordion" style="margin-left:10px; border-left:1px solid black;">';
                foreach ($mapType AS $mapkey => $map) {
                    if (is_array($map)) {
                        if (substr($map[0], -9) == '空です') {
                            $html .= '<div style="color:green; margin-left:20px; margin-top:4px; border-left:1px solid black;">' . $map[0] . '</div>';
                            continue;
                        }
                        $html .= '<div class="Cmaps" style="color:green; margin-left:20px; margin-top:4px; border-left:1px solid black;">';
                        $html .= '<span class="unfoldButton">＋</span>';
                        $html .= '<span class="foldButton">ー</span>' . $mapkey;
                        $html .= '</div>';
                        $html .= '<div class="acordion" style="margin-left:20px; border-left:1px solid black;">';
                        foreach ($map AS $file) {
                            //今のところここが最下層
                            if ($mapTypeKey == 'mapRepeat') {
                            //mpaRepeatの場合方向が分かるようにする（方向でマップチップタイプが変わってくるので）
                                switch ($mapkey) {
                                    case 'left': //6
                                        $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $mapkey . '/' .$file.'" alt="' . $mapTypeKey .'_left" class="mapchip">';
                                    break;
                                    case 'right': //10
                                        $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $mapkey . '/' .$file.'" alt="' . $mapTypeKey.'_right" class="mapchip">';
                                    break;
                                    case 'up': //11
                                        $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $mapkey . '/' .$file.'" alt="' . $mapTypeKey.'_up" class="mapchip">';
                                    break;
                                    case 'down': //12
                                        $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $mapkey . '/' .$file.'" alt="' . $mapTypeKey.'_down" class="mapchip">';
                                    break;
                                    default:
                                        # code...
                                    break;
                                }
                            } else {
                            //それ以外の場合
                                $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $mapkey . '/' .$file.'" alt="' . $mapTypeKey . '" class="mapchip">';
                            }
                        }
                        $html .= '</div>';
                    } else {
                        $html .= '<img src="'. $this->mapChipDirPath . $prjKey . '/' . $mapTypeKey . '/' . $map .'" alt="' . $mapTypeKey . '" class="mapchip">';
                    }
                    //$html .= '</div>';
                }
                $html .= '</div>';
            }
            $html .= '</div>';
        }
        return $html;
    }

    /**
     * 既存のプロジェクトを取得する（編集画面）
     * return プロジェクトのセレクトボックス
     */
    function getProjects() {
        $dirs = scandir($this->projectDirPath);
        //表示させないディレクトリ配列
        $excludes = array(
            '.',
            '..',
            '.DS_Store'
        );
        $projects = '<select id="oldProjectName" name="oldProjectName">';
        $projects .= '<option value="">プロジェクトを選択</option>';
        foreach ($dirs AS $dir) {
            //特定のディレクトリの場合は表示させない
            if (in_array($dir, $excludes)) {
                continue;
            }
            //最初の要素を選択状態に
            if ($dir === reset($dirs)) {
                $projects .= '<option value="' . $dir . '">' . $dir . '</option>';
            }
            $projects .= '<option value="' . $dir . '">' . $dir . '</option>';
        }
        $projects .= '</select>';
        return $projects;
    }

    /**
     * 既存のプロジェクトを取得する（登録画面）
     * return プロジェクトのセレクトボックス
     */
    function getProjects2() {
        $dirs = scandir($this->projectDirPath);
        //表示させないディレクトリ配列
        $excludes = array(
            '.',
            '..',
            '.DS_Store'
        );
        $projects = '<select id="oldProjectName2" name="oldProjectName2" onChange="showProjectMapNames(this)"">';
        $projects .= '<option value="">プロジェクトを選択</option>';
        foreach ($dirs AS $dir) {
            //特定のディレクトリの場合は表示させない
            if (in_array($dir, $excludes)) {
                continue;
            }
            //最初の要素を選択状態に
            if ($dir === reset($dirs)) {
                $projects .= '<option value="' . $dir . '">' . $dir . '</option>';
            }
            $projects .= '<option value="' . $dir . '">' . $dir . '</option>';
        }
        $projects .= '</select>';
        return $projects;
    }

    /**
     * 既存のプロジェクトのデータ（画像
     * return プロジェクトのセレクトボックス
     */
    function getProjectsData() {
        $dirs = scandir($this->projectDirPath);
        //表示させないディレクトリ配列
        $excludes = array(
            '.',
            '..',
            '.DS_Store'
        );
        $projects = $this->getProjects();
        foreach ($dirs AS $dir) {
            //特定のディレクトリの場合は表示させない
            if (in_array($dir, $excludes)) {
                continue;
            }
            $project = '<div id="'. $dir .'" class="eachProjectContainer">';
            //プロジェクトのマップと、マップデータを探しにいく
            //ディレクトリの中のマップ画像パスを取得する
            $i = 0; //マップ画像インデックス
            foreach(glob($this->projectDirPath . $dir . '/*.png') AS $pngFile){
                if(is_file($pngFile)){
                    $pngBaseName = basename($pngFile, '.png');
                    $project .= '<div  id="'. $pngBaseName. '" class="eachMapContainer">';
                    $project .= '<form name="deleteMap action="" method="post">';
                    $project .= '<p class="mapNames">'. $pngBaseName. '</p>';
                    $project .= '<img src="' . $pngFile .'" class="maps" width="200" height="150" alt="'. $pngBaseName .'">';
                    $project .= '<br><input type="submit" value="※削除" style="background-color:red"></input>';
                    $project .= '<input type="hidden" name="deleteMap" value="true"></input>';
                    $project .= '<input type="hidden" name="projectName" value="' . $dir .'"></input>';
                    $project .= '<input type="hidden" name="pngBaseName" value="' . $pngBaseName .'"></input>';
                    $project .= '</form>';
                    $project .= '</div>';
                    $i++;
                }
            }
            $project .= '</div>';
            $projects .= $project;
        }
        return $projects;
    }

    /**
     * マップデータを新規プロジェクトに追加する
     * プロジェクトデータjsonも作成する
     * param1 : 新規プロジェクト名
     * param2 : param1 : マップ画像データ(ベース64エンコードずみのもの)
     * param3 : マップオブジェクトデータ（jsonのテキストばんのもの）
     * return bool
     */
    function addMapDataToNewProject($newProjectName, $mapImageData, $mapObjData, $mapName, $projectData) {
        //新規プロジェクトのパスを保存
        $newProjectPath = $this->projectDirPath . $newProjectName;
        //新規プロジェクトディレクトリ作成
        if(mkdir($newProjectPath)) {
            //マップデータデコード
            $decodedImageData = base64_decode($mapImageData);
            //マップ画像を保存
            $fp = fopen($newProjectPath . "/" . $mapName . ".png", "wb");
            fwrite($fp, $decodedImageData);
            fclose($fp);
            //マップオブジェクトデータを保存
            $fp = fopen($newProjectPath . "/" . $mapName . ".json", "wb");
            fwrite($fp, $mapObjData);
            fclose($fp);
            //プロジェクトデータファイルを保存
            $fp = fopen($newProjectPath . "/projectData.json", "wb");
            fwrite($fp, $projectData);
            fclose($fp);

            return true;
        };
        return false;
    }

    /**
     * マップデータを既存プロジェクトに追加する
     * param1 : 既存プロジェクト名
     * param2 : param1 : マップ画像データ(ベース64エンコードずみのもの)
     * param3 : マップオブジェクトデータ（jsonのテキストばんのもの）
     * return bool
     */
    function addMapDataToOldProject($oldProjectName, $mapImageData, $mapObjData, $mapName, $projectData) {
        //既存プロジェクトのパスを保存
        $oldProjectPath = $this->projectDirPath . $oldProjectName;
        //既存プロジェクトがあるか調べる
        if(file_exists($oldProjectPath)) {
            if(!file_exists($oldProjectPath.'/'.$mapName.'.png')) {
                //マップデータデコード
                $decodedImageData = base64_decode($mapImageData);
                // 画像を保存
                $fp = fopen($oldProjectPath . "/" . $mapName . ".png", "wb");
                fwrite($fp, $decodedImageData);
                fclose($fp);

                //マップオブジェクトデータを保存
                $fp = fopen($oldProjectPath . "/" . $mapName . ".json", "wb");
                fwrite($fp, $mapObjData);
                fclose($fp);

                //プロジェクトデータファイルを保存
                //最初だけ作る
                if (!file_exists($oldProjectPath . "/projectData.json")) {
                    $fp = fopen($oldProjectPath . "/projectData.json", "wb");
                    fwrite($fp, $projectData);
                    fclose($fp);
                    $fp = fopen($oldProjectPathPlyr . "/projectData.json", "wb");
                    fwrite($fp, $projectData);
                    fclose($fp);
                }

                return true;

            } else {
                return 'editorに同名のファイルが存在します'; 
            }

        } else {
            return 'editorにプロジェクトがありません。'; 
        }
        return false;
    }

    /**
     * マップデータを更新する
     * param1 : 既存プロジェクト名
     * param2 : param1 : マップ画像データ(ベース64エンコードずみのもの)
     * param3 : マップオブジェクトデータ（jsonのテキストばんのもの）
     * return bool
     */
    function updateMapData($oldProjectName, $mapImageData, $mapObjData, $mapName, $projectData, $allMapData) {
        //既存プロジェクトのパスを保存
        $oldProjectPath = $this->projectDirPath . $oldProjectName;
        $oldProjectPathPlyr = $this->projectDirPathPlayer . $oldProjectName;
        //既存プロジェクトがあるか調べる
        if(file_exists($oldProjectPath)) {
            if(file_exists($oldProjectPath.'/'.$mapName.'.png')) {

                //allMapDataから全マップのデータを更新
                //一回全部デコードして、マップ単位でエンコードしなおす
                $allMapDataDecoded = json_decode($allMapData,true);
                foreach($allMapDataDecoded AS $otherMapName => $otherEach){ 
                    $otherEachDecoded = json_encode($otherEach, JSON_UNESCAPED_UNICODE);
                    $fp = fopen($oldProjectPath . "/" . $otherMapName . ".json", "wb");
                    fwrite($fp, $otherEachDecoded);
                    fclose($fp);
                    $fp = fopen($oldProjectPathPlyr . "/" . $otherMapName . ".json", "wb");
                    fwrite($fp, $otherEachDecoded);
                    fclose($fp);
                }

                //マップデータデコード
                $decodedImageData = base64_decode($mapImageData);
                //マップ画像を保存
                $fp = fopen($oldProjectPath . "/" . $mapName . ".png", "wb");
                fwrite($fp, $decodedImageData);
                fclose($fp);
                $fp = fopen($oldProjectPathPlyr . "/" . $mapName . ".png", "wb");
                fwrite($fp, $decodedImageData);
                fclose($fp);

                //マップオブジェクトデータを保存
                $fp = fopen($oldProjectPath . "/" . $mapName . ".json", "wb");
                fwrite($fp, $mapObjData);
                fclose($fp);
                $fp = fopen($oldProjectPathPlyr . "/" . $mapName . ".json", "wb");
                fwrite($fp, $mapObjData);
                fclose($fp);

                //プロジェクトデータファイルを保存
                $fp = fopen($oldProjectPath . "/projectData.json", "wb");
                fwrite($fp, $projectData);
                fclose($fp);
                $fp = fopen($oldProjectPathPlyr . "/projectData.json", "wb");
                fwrite($fp, $projectData);
                fclose($fp);

                return true;
            }
        }
        return false;
    }

    function isAdmin ($id, $pas) {
        global $adminId;
        global $adminPas;
        if ($id == $adminId && $pas == $adminPas) {
            return true;
        }
        return false;
    }

    function getSaveMapContainer() {
        $html = '<div id="save-map-container">';
        $html .= '<form name="map_data" action="" method="post">';
        $html .= '<br><input type="radio" id="old" name="projectType" value="old" checked>既存のプロジェクトに追加<br>';
        $html .= $this->getProjects2();
        //新規プロジェクトの追加はマップエディターではなくドットエディターで行う。なので既存のプロジェクトに追加のみ。
        // $html .= '<br><br><input type="radio" id="new" name="projectType" value="new">新規プロジェクトに追加<br>';
        // $html .= '<input type="text" id="newProjectName" name="newProjectName"><br>';
        $html .= '<br><p>マップ名を入力</p>';
        $html .= '<input type="text" id="mapName" name="mapName"><br>';        
        $html .= '<span id="save-map-data">この内容でサーバに保存</span>';
        $html .= '<input type="hidden" name="map_image_data" value="" />';
        $html .= '<input type="hidden" name="map_obj_data" value="" />';
        $html .= '<input type="hidden" name="project_data" value="" />';
        // $html .= '<input type="hidden" name="map_shift_x" value="" />';　//新規はいらないはずだが一応残しておく！
        // $html .= '<input type="hidden" name="map_shift_y" value="" />';　//新規はいらないはずだが一応残しておく！
        $html .= '</form>';
        $html .= '</div>';
        $html .= '<div id="currentProjectDataContainer2">';
        $html .= '</div>';
        return $html;
    }

    function getMapUpdateContainer() {
        $html = '<div id="map-update-container"><form name="update_map_data" action="" method="post">';
        $html .= '<p style="color:red">※ 既存のマップです。更新をします。</p>';
        $html .= '<input type="text" id="updateMapProject" name="updateMapProject" value="" readonly="readonly"><br>';
        $html .= '<input type="text" id="updateMapName" name="updateMapName" value="" readonly="readonly"><br>';
        $html .= '<span id="update-map-data">マップを更新</span>';
        $html .= '<input type="hidden" name="map_image_data" value="" />';
        $html .= '<input type="hidden" name="map_obj_data" value="" />';
        $html .= '<input type="hidden" name="project_data" value="" />';
        $html .= '<input type="hidden" name="all_map_data" value="" />';
        $html .= '</form></div>';
        return $html;
    }

    function getdeleteMaptipBtn() {
        $html = '</span><span id="deleteMapchip">削除</span>';
        $html .= '<div id="deleteMapchipContainer"><form name="deleteMapchip" action="" method="post">';
        $html .= '<input type="hidden" name="mapchipPath" value="" /></form></div>';
        return $html;
    }

    function deleteMapchip($mapchipPath) {
        $mapchipPath = preg_replace('/http.*?\/map-editor\//', '', $mapchipPath); //preg_replaceの使い方（//で囲むに注意）
        $ret = array();
        // ファイル削除
        $delBase = basename(dirname($mapchipPath));
        $ret['file'] = unlink($mapchipPath);
        //ディレクトリ削除
        $delPathDir = dirname($mapchipPath);
        $dirs = scandir($this->projectDirPath);
        if (!in_array($delBase, $dirs) && !in_array($delBase, $this->MaptipTypes)) { //プロジェクトとマップチップタイプのディレクトリの場合消さない
            $files = array_diff(scandir($delPathDir), array('.','..'));
            if (empty($files)) {
                $ret['dir'] = rmdir($delPathDir);
            }
        }
        return $ret;

    }

    function deleteMap($projectName, $pngBaseName) {
        //rpg-editorとplayerから、マップのpngとjsonを削除する
        $edtPng = unlink($this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.png');
        $edtJsn = unlink($this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.json');
        $plyPng = unlink($this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.png');
        $plyJsn = unlink($this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.json');

        $retArray = array();
        $retArray[0] = $edtPng ? $this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.png の削除に成功しました。' : '※※※' . $this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.png の削除に失敗しました。';
        $retArray[1] = $edtJsn ? $this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.json の削除に成功しました。' : '※※※' . $this->projectDirPath . $dir . $projectName . '/' . $pngBaseName . '.json の削除に失敗しました。';
        $retArray[2] = $plyPng ? $this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.png の削除に成功しました。' : '※※※' . $this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.png の削除に失敗しました。';
        $retArray[3] = $plyJsn ? $this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.json の削除に成功しました。' : '※※※' . $this->projectDirPathPlayer . $dir . $projectName . '/' . $pngBaseName . '.json の削除に失敗しました。';

        return $retArray;

    }
}

?>