<?php
//map-editorのmodel
//クラスを作って、コンストラクタと各ファンクションを記述する
require("admin.php");

class mapEditor {

    private $mapChips; //マップチップ配列
    private $mapChipDirPath; //マップチップディレクトリパス
    private $projectDirPath; //プロジェクトディレクトリパス

    /**
     * マップエディタコンストラクタ
     */
    function __construct() {
        $this->mapChips = array();
        $this->mapChipDirPath = './image/map-editor/map-chip/';
        $this->projectDirPath = '../rpg-editor/public/projects/';
    }

    /**
     * マップチップを取得する
     */
    function getMapChips(){
        //マップチップディレクトリのディレクトリ（カテゴリ）を取得する
        $dirs = scandir($this->mapChipDirPath);
        //表示させないディレクトリ配列
        $excludes = array(
            '.',
            '..',
            '.DS_Store'
        );
        foreach ($dirs AS $dir) {
            //特定のディレクトリの場合は表示させない
            if (in_array($dir, $excludes)) {
                continue;
            }
            //ディレクトリの中のマップチップを取得する
            foreach(glob($this->mapChipDirPath . $dir . '/*') AS $file){
                if(is_file($file)){
                    $mapChips[$dir][] = $file;
                }
            }
        }
        return $mapChips;
    }

    /**
     * 既存のプロジェクトを取得する
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
        foreach ($dirs AS $dir) {
            //特定のディレクトリの場合は表示させない
            if (in_array($dir, $excludes)) {
                continue;
            }
            //最初の要素を選択状態に
            if ($dir === reset($dirs)) {
                $projects .= '<option value="' . $dir . '" selected>' . $dir . '</option>';
            }
            $projects .= '<option value="' . $dir . '">' . $dir . '</option>';
        }
        $projects .= '</select>';
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
    function addMapDataToOldProject($oldProjectName, $mapImageData, $mapObjData, $mapName) {
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

                return true;

            } else {
                return '同名のファイルが存在します'; 
            }

        } else {
            return 'プロジェクトがありません。'; 
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
        $html = '<div id="save-map-container"><form name="map_data" action="" method="post">';
        $html .= '<br><input type="radio" id="old" name="projectType" value="old" checked>既存のプロジェクトに追加<br>';
        $html .= $this->getProjects();
        $html .= '<br><br><input type="radio" id="new" name="projectType" value="new">新規プロジェクトに追加<br>';
        $html .= '<input type="text" id="newProjectName" name="newProjectName"><br>';  
        $html .= '<br><p>マップ名を入力</p>';
        $html .= '<input type="text" id="mapName" name="mapName"><br>';        
        $html .= '<span id="save-map-data">この内容でサーバに保存</span>';
        $html .= '<input type="hidden" name="map_image_data" value="" />';
        $html .= '<input type="hidden" name="map_obj_data" value="" />';
        $html .= '<input type="hidden" name="project_data" value="" />';
        $html .= '</form></div>';
        return $html;
    }
}

?>