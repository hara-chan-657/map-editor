<?php
//map-editorのmodel
//クラスを作って、コンストラクタと各ファンクションを記述する

class mapEditor {

    private $mapChips; //マップチップ配列
    private $mapChipDirPath;

    /**
     * マップエディタコンストラクタ
     */
    function __construct() {
        $this->mapChips = array();
        $this->mapChipDirPath = './image/map-editor/map-chip/';
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

}

?>