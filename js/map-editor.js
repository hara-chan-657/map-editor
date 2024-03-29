//map-editor.phpの動的部分を担当する

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下プロパティ   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//================================ 各種変数 ===============================================//
//戻る用配列
var backArray = [];
var backArrayJson = [];
//進む用配列
var forwardArray = [];
var forwardArrayJson = [];
//ドラッグフラグ
var draggingFlg = false;
//現在マップチップキャンバスたて横
var currentMapChipCanvasHeight = 0;
var currentMapChipCanvasWidth = 0;
//現在マップチップ属性
var currentMapChipType;
//現在マップチップ属性縦
var currentMapChipRowNum;
//現在マップチップ属性横
var currentMapChipColNum;
//マップチップ属性記憶配列
var arrayMaptipType = [];
//１マップ大きさ
var mapLength = 32;
//表示キャンバス横
var viewCanvasWidth = 736;
//表示キャンバス縦
var viewCanvasHeight = 480;
//マップ行数
var mapRowNum = 15;
//マップ列数
var mapColNum = 15;
//スタートマップフラグ
var startMapFlg = false;
//プロジェクトのマップオブジェクト用配列
var mapObj = [];
//マップフォーカススタート位置
var startX = -1;
var startY = -1;
//表示中プロジェクトデータ
var currentProjectDataContainer = 'def';
var currentProjectName;


//================================ 各種エレメント ===============================================//
//編集時コンテナ
var editContainer = document.getElementById('editContainer');
//オプション
var option = document.getElementsByClassName('option');
//現在モード要素
var currentModeElement = document.getElementsByClassName('mode-on');
//戻る
var back = document.getElementById('back');
//進む
var forward = document.getElementById('forward');
// //進む
var forward = document.getElementById('forward');
// //進むダミー
var forwardDummy = document.getElementById('forwardDummy');
//プット
var put = document.getElementById('put');
//デリート
var del = document.getElementById('delete');
//シフト左
var shiftLeft = document.getElementById('shiftLeft');
//シフト右
var shiftRight = document.getElementById('shiftRight');
//シフト上
var shiftAbove = document.getElementById('shiftAbove');
//シフト下
var shiftBelow = document.getElementById('shiftBelow');
//一行増やす
var addRowTop = document.getElementById('addRowTop');
//一行増やす
var addRowUnder = document.getElementById('addRowUnder');
//一列増やす
var addColLeft = document.getElementById('addColLeft');
//一列増やす
var addColRight = document.getElementById('addColRight');
//一行減らす
var delRowTop = document.getElementById('delRowTop');
//一行減らす
var delRowUnder = document.getElementById('delRowUnder');
//一列減らす
var delColLeft = document.getElementById('delColLeft');
//一列減らす
var delColRight = document.getElementById('delColRight');
//マップステータス
var mapStatus = document.getElementById('mapStatus');
//選択中マップ名
var selectedMapName = document.getElementById('selectedMapName');
//選択中マップ解除ボタン
var clearSelectedMapButton = document.getElementById('clearSelectedMapButton');
//現在マップチップ
var currentMapChip = document.getElementById('currentMapChip');
//マップチップ削除ボタン
if (document.getElementById('deleteMapchip') != null) {
	var deleteMapchipButton = document.getElementById('deleteMapchip');
	deleteMapchipButton.addEventListener('click', deleteMapchip, false);
}
//現在マップチップサイズ
var currentMapChipSize = document.getElementById('currentMapChipSize');
// var currentMapChipContext = currentMapChipCanvas.getContext('2d');
//マップチップコンテナ
var mapChipContainer = document.getElementById('mapChipContainer');
//展開ボタン
var unfoldButtons = document.getElementsByClassName('unfoldButton');
//折り込みボタン
var foldButtons = document.getElementsByClassName('foldButton');
//キャラクタアイコンコンテナ
var characterIcon = document.getElementById('characterIconContainer');
//マップアイコンコンテナ
var mapIcon = document.getElementById('mapIconContainer');
//マップ通りぬけアイコンコンテナ
var mapPassIcon = document.getElementById('mapPassIconContainer');
//ツールアイコンコンテナ
var toolIcon = document.getElementById('toolIconContainer');
//建物アイコンコンテナ
var buildingIcon = document.getElementById('buildingIconContainer');
//各マップチップ
var mapchips = document.getElementsByClassName('mapchip');

//マップキャンバスBG
var mapBG = document.getElementById('mapBG');
//マップキャンバスコンテナ
var mapContainer = document.getElementById('mapContainer');
//マップキャンバス
var mapCanvas = document.getElementById('mapCanvas');
var mapContext = mapCanvas.getContext('2d');
//既存プロジェクト選択ボックス
if (document.getElementById('oldProjectName') != null) {
	var oldProjectName = document.getElementById('oldProjectName');
	oldProjectName.addEventListener('change', function () {ChangeOldProjectData(this);}, false);
}
//既存プロジェクトのマップ画像
var maps = document.getElementsByClassName('maps');
//プロジェクトのデータオブジェクト
var projectDataObj;
//プレビュー誘導ボタン
var previewLink = document.getElementById('preview-link');
//プレビューコンテナ
var previewContainer = document.getElementById('preview-container');
//プレビュー(画像)
var preview = document.getElementById('preview');
//書き直しボタン
var rewrite = document.getElementById('rewrite');
//ダウンロードボタン
var DlLink = document.getElementById('download-link');
//マップ保存コンテナ
if (document.getElementById('save-map-container') != null) {
	var saveMapContainer = document.getElementById('save-map-container');
}
//この内容で保存ボタン
if (document.getElementById('save-map-data') != null) {
	var saveMapData = document.getElementById('save-map-data');
	saveMapData.addEventListener('click', saveMapDataToSever, false);
}
//マップ更新コンテナ
var mapUpdateContainer = document.getElementById('map-update-container');
//更新マッププロジェクト
var updateMapProject = document.getElementById('updateMapProject');
//更新マップ名
var updateMapName = document.getElementById('updateMapName');
//マップ更新
if (document.getElementById('update-map-data') != null) {
	var updateMapData = document.getElementById('update-map-data');
	updateMapData.addEventListener('click', updateMapDataToSever, false);
}
//マップ複製コンテナ
var mapCopyContainer = document.getElementById('map-copy-container');
//複製マッププロジェクト
var copyMapProject = document.getElementById('copyMapProject');
//複製マップ名
var copyMapName = document.getElementById('copyMapName');
//マップ複製
if (document.getElementById('copy-map-data') != null) {
	var copyMapData = document.getElementById('copy-map-data');
	copyMapData.addEventListener('click', copyMapDataToSever, false);
}


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下イベント   ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', setDefault, false);
document.addEventListener('keydown', function (evt) {doKeyEvent(evt);}, false);
//document.addEventListener('keyup', function (evt) {doKeyEvent(evt);}, false);
for (var i=0; i<option.length; i++) {
	option[i].addEventListener('mouseenter', function(evt) {showDetail(evt);}, false);
}
for (var i=0; i<option.length; i++) {
	option[i].addEventListener('mouseleave', function(evt) {hideDetail(evt);}, false);
}
for (var i=0; i<mapchips.length; i++) {
	mapchips[i].addEventListener('click', function(evt) {setCurrentMapChip(evt);}, false);
}
mapCanvas.addEventListener('mousedown', editMap, false);
mapCanvas.addEventListener('mousemove', function (evt) {if (draggingFlg == true) editMap(evt);}, false);
mapCanvas.addEventListener('mousemove', function (evt) {showCursorPos(evt);}, false);
mapCanvas.addEventListener('mouseup', function () {if (draggingFlg == true) setDraggingFlg(false);}, false);
for (var i=0; i<unfoldButtons.length; i++) {
	unfoldButtons[i].addEventListener('click', function(evt) {changeCategoryDisplay(evt, 'unfold');}, false);
}
for (var i=0; i<foldButtons.length; i++) {
	foldButtons[i].addEventListener('click', function(evt) {changeCategoryDisplay(evt, 'fold');}, false);
}
back.addEventListener('click', function() {if (backArray.length > 0) doBack();}, false);
forward.addEventListener('click', function() {if (forwardArray.length > 0) doForward();}, false);
put.addEventListener('click', function (evt) {setCurrentMode(evt);}, false);
del.addEventListener('click', function (evt) {setCurrentMode(evt);}, false);
shiftLeft.addEventListener('click', function () {shiftCanvas('left');}, false);
shiftRight.addEventListener('click', function () {shiftCanvas('right');}, false);
shiftAbove.addEventListener('click', function () {shiftCanvas('top');}, false);
shiftBelow.addEventListener('click', function () {shiftCanvas('bottom');}, false);
addColLeft.addEventListener('click', function () {setMap('add','col','left');}, false);
addColRight.addEventListener('click', function () {setMap('add','col','right');}, false);
delColLeft.addEventListener('click', function () {setMap('del','col','left');}, false);
delColRight.addEventListener('click', function () {setMap('del','col','right');}, false);
addRowTop.addEventListener('click', function () {setMap('add','row','top');}, false);
addRowUnder.addEventListener('click', function () {setMap('add','row','bottom');}, false);
delRowTop.addEventListener('click', function () {setMap('del','row','top');}, false);
delRowUnder.addEventListener('click', function () {setMap('del','row','bottom');}, false);
clearSelectedMapButton.addEventListener('click', clearSelectedMap, false);
for (var i=0; i<maps.length; i++) {
	maps[i].addEventListener('click', function(evt) {setEditMap(evt);}, false);
}
previewLink.addEventListener('click', showPreview, false);
rewrite.addEventListener('click', doRewrite, false);
DlLink.addEventListener('click', downloadCanvas, false);



///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////　　以下ファンクション   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//戻るの完全禁止
history.pushState(null, null, location.href);
window.addEventListener('popstate', (e) => {
  history.go(1);
});

//デフォルト値設定
function setDefault() {
	setMap();
	setArrayMaptipType('load');
	setCurrentMode();
}

//キーボードからの入力でイベントを実行する
var bkCanvasForWinRect = null;
var bkCanvasForTags = null;
function doKeyEvent (evt) {
	//戻る
	if (evt.key === 'a' && (evt.ctrlKey || evt.metaKey)) {
		if (backArray.length > 0) {
			doBack();
		}
	//進む
	} else if (evt.key === 's' && (evt.ctrlKey || event.metaKey)) {
		if (forwardArray.length > 0) {
			doForward();
		}
	} else if (evt.key === 'w') {

    	if (bkCanvasForWinRect == null) bkCanvasForWinRect = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength);

    	if( evt.repeat ) {
    		showWindowRect(evt);
    	} else {
    		mapContext.putImageData(bkCanvasForWinRect,0,0);
    		bkCanvasForWinRect = null;
    	}
    } else if (evt.key === 'e') {

    	if (bkCanvasForWinRect == null) bkCanvasForWinRect = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength);

    	if( evt.repeat ) {
    		showCurrentChipRect(evt);
    	} else {
    		mapContext.putImageData(bkCanvasForWinRect,0,0);
    		bkCanvasForWinRect = null;
    	}
    } else if (evt.key === 'r') {

    	if (bkCanvasForTags == null) bkCanvasForTags = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength);

    	if( evt.repeat ) {
			//特殊チップタグを表示
			drawSpecialChipTags();
    	} else {
    		mapContext.putImageData(bkCanvasForTags,0,0);
    		bkCanvasForTags = null;
    	}
    } else {
		return;
	}
}

//canvasを一動作前の状態に戻す
function doBack() {
	//戻るよう配列の最後（最新）のデータを、進む用配列に退避
	var lastData = backArray[backArray.length-1];
	var lastDataJson = backArrayJson[backArrayJson.length-1].concat();
	backArray.pop();
	backArrayJson.pop();
	forwardArray.push(lastData);
	forwardArrayJson.push(lastDataJson);
	//canvasをクリア
	mapContext.clearRect(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
	if (backArray.length > 0) {
		//一個前（だった）の戻る用配列のcanvasを表示
		mapContext.putImageData(backArray[backArray.length-1],0,0);
		//一個前（だった）の戻る用配列jsonのjsonを現在のjsonに
		arrayMaptipType = backArrayJson[backArrayJson.length-1].concat();
	}

	if (backArray.length == 0) {

		if (orgEditMapImg != null && orgEditMapJson != null) {
			//一個前（だった）の戻る用配列のcanvasを表示
			mapContext.drawImage(orgEditMapImg, 0, 0);
			//一個前（だった）の戻る用配列jsonのjsonを現在のjsonに
			arrayMaptipType = orgEditMapJson;
		} else {
			//もう戻れないので、画像は表示しない
			//チップ属性のみ初期化する
			for (var i=0; i<mapRowNum; i++) {
				for (var j=0; j<mapColNum; j++) {
					arrayMaptipType[i][j]['maptipType'] = 0;
				}
			}
		}

		//戻るを非活性に
		back.style.display = "none";
		backDummy.style.display = "inline";
	}
	if (forwardArray.length > 0) {
		forwardDummy.style.display = "none";
		forward.style.display = "inline";
	}

}

//canvasの状態を戻したものを一個進める
function doForward () {
	//進めるよう配列から、戻るよう配列に戻す
	var lastData = forwardArray[forwardArray.length-1];
	var lastDataJson = forwardArrayJson[forwardArrayJson.length-1].concat();
	forwardArray.pop();
	forwardArrayJson.pop();
	backArray.push(lastData);
	backArrayJson.push(lastDataJson);
	back.style.display = "inline";
	backDummy.style.display = "none";
	//canvasをクリア
	mapContext.clearRect(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
	//最新の戻る用配列のcanvasを表示
	var newCanvas = backArray[backArray.length-1];
	mapContext.putImageData(newCanvas,0,0);
	//最新の戻る用配列jsonのjsonを現在のjsonに
	arrayMaptipType = backArrayJson[backArrayJson.length-1].concat();
	//進む配列がなくなった段階で進むを非活性に
	if (forwardArray.length == 0) {
		forwardDummy.style.display = "inline";
		forward.style.display = "none";
	}

}

//マップ編集上、特殊なチップはわかりやすい様にタグを表示する
function drawSpecialChipTags() {
	for (var i=0; i<arrayMaptipType.length; i++) {
		for (var j=0; j<arrayMaptipType[i].length; j++) {
            //一番最初に、マップ分類に近いマップ交互のデータを描画
            if (arrayMaptipType[i][j].hasOwnProperty('turnChip')) {
                drawTags('turnChip',j,i);
            }
            if (arrayMaptipType[i][j].hasOwnProperty('turnChipPass')) {
                drawTags('turnChip',j,i);
            }
            if (arrayMaptipType[i][j]['maptipType'] == 6){
                drawTags('repeatChip',j,i);
            }
        }
    }
}

//タグを描画する（タイプ、x、y）
function drawTags(type, j, i) {

    switch(type) {

        case 'turnChip':
            // パスをリセット
            mapContext.beginPath () ;
            // レクタングルの座標(50,50)とサイズ(75,50)を指定
            mapContext.rect(j*mapLength ,i*mapLength , 10, 10);
            // 塗りつぶしの色
            mapContext.fillStyle = "lime"; //イベントは設定済みだが、トリガーを設定してない場合、黄色
            // 塗りつぶしを実行
            mapContext.fill();
            // 線の色
            mapContext.strokeStyle = "purple" ;
            // 線の太さ
            mapContext.lineWidth =  1;
            // 線を描画を実行
            mapContext.stroke() ;
        break;
        case 'repeatChip':
            // パスをリセット
            mapContext.beginPath () ;
            // レクタングルの座標(50,50)とサイズ(75,50)を指定
            mapContext.rect(j*mapLength ,i*mapLength , 10, 10);
            // 塗りつぶしの色
            mapContext.fillStyle = "yellow"; //イベントは設定済みだが、トリガーを設定してない場合、黄色
            // 塗りつぶしを実行
            mapContext.fill();
            // 線の色
            mapContext.strokeStyle = "purple" ;
            // 線の太さ
            mapContext.lineWidth =  1;
            // 線を描画を実行
            mapContext.stroke() ;
        break;
    }
}

//マップチップを削除する
function deleteMapchip() {
	//マップチップの情報を出してアラート
	var res = confirm('選択中のマップチップをサーバから削除します。\nよろしいですか？');
	if (res) {
		//フォーム送信
		var delMapchipForm = document.forms['deleteMapchip'];
		delMapchipForm.elements['mapchipPath'].value = currentMapChip.src;
		delMapchipForm.submit();
	}

}

//選択中マップ解除
function clearSelectedMap() {
	var res = confirm('選択中のマップの編集を中止します。\nよろしいですか？');
        if (res) {
			mapContext.clearRect(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
			//マップチップ属性配列初期化
			for (var i=0; i<arrayMaptipType.length; i++) {
				for (var j=0; j<arrayMaptipType[i].length; j++) {
					arrayMaptipType[i][j]['maptipType'] = 0;
				}
			}
			//スタートマップフラグをfalseに
			startMapFlg = false;
			//（一応）現在選択中画像のsrcクリア
			currentMapImage.src = ''; 
			//マップステータスの選択中マップ名とボタンを非表示
			selectedMapName.innerText = '';
			clearSelectedMapButton.style.display = 'none'
			//マップ更新用コンテナを保存用コンテナへ切り替え
			saveMapContainer.style.display = 'block';
			mapUpdateContainer.style.display = 'none';
			mapCopyContainer.style.display = 'none';
        }
}

//編集するマップをセットする
var orgEditMapImg = null;
var orgEditMapJson = null;
function setEditMap(evt) {
    //本当は同じマップだったらスキップしたいけど後回し
    if (selectedMapName.innerText != ''){
        var res = confirm('マップを変更すると変更内容は失われます。\nよろしいですか？');
        if (!res) {
            return;
        }    
    }
    //現在マップをクリア    
    mapContext.clearRect(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
    //選択したマップを表示（キャンバス表示用に使う、非表示画像）
    currentMapImage.src = evt.target.src; 
    //戻るの最後用の画像を保存しておく
    orgEditMapImg = currentMapImage;
    //キャンバスの大きさを更新
    mapCanvas.height = currentMapImage.naturalHeight;
    mapCanvas.width = currentMapImage.naturalWidth;
    //新しいマップを表示
    mapContext.drawImage(currentMapImage, 0, 0);
	//現在選択中マップを更新
	var mapName = evt.target.alt; //マップ名更新
	selectedMapName.innerText = mapName;
	arrayMaptipType = [];
	var maptipTypeObj = Object.keys(mapObj[mapName]).map(function (key) {return mapObj[mapName][key]});
	for (var i=0; i<maptipTypeObj.length; i++) {
		arrayMaptipType[i] = [];
		maptipTypeObj[i] = Object.keys(maptipTypeObj[i]).map(function (key) {return maptipTypeObj[i][key]});
		for (var j=0; j<maptipTypeObj[i].length; j++) {
			//arrayMaptipType[i][j] = maptipTypeObj[i][j]['maptipType'];
			arrayMaptipType[i][j] = maptipTypeObj[i][j];//マップチップタイプだけでなく、設定済みの全データに変更
		}	
	}
    //戻るの最後用のjsonを保存しておく
    //orgEditMapJson = arrayMaptipType.slice();
	var tmpRow = [];
	for (var i=0; i<arrayMaptipType.length; i++) {
		tmpRow.push(arrayMaptipType[i].concat()); //配列をpushするときは、concat()しないと参照渡しになってしまうので注意！
	}
	orgEditMapJson = tmpRow.concat();
	mapColNum = currentMapImage.naturalWidth/mapLength;
	mapRowNum = currentMapImage.naturalHeight/mapLength;
	mapBG.style.width = mapColNum*mapLength + 'px';
	mapStatus.innerHTML = 'マップステータス <br>■ 縦：' + mapRowNum + '行(' + mapRowNum*mapLength + 'px) ■ 横：' + mapColNum + '列(' + mapColNum*mapLength + 'px)';
	document.getElementById("map_shift_x").innerText = '0';
	document.getElementById("map_shift_y").innerText = '0';
	if (mapName == projectDataObj['startMap']) {
		startMapFlg = true; //選択したマップがプロジェクトのスタートマップだった場合フラグを立てる
	} else {
		startMapFlg = false; //プロジェクトのスタートマップでない場合にfalse
	}
	//div切り替え
	clearSelectedMapButton.style.display = 'inline-block';
	//マップ保存用コンテナを更新用コンテナへ切り替え
	saveMapContainer.style.display = 'none';
	mapUpdateContainer.style.display = 'block';
	mapCopyContainer.style.display = 'block';
	//更新用コンテナのフォームに更新用マップの情報をいれる
	updateMapProject.value = currentProjectName;
	updateMapName.value = evt.target.alt;
	copyMapProject.value = currentProjectName;
	copyMapName.value = evt.target.alt;
}

//プロジェクトのjsonをすべてオブジェクトにロードする
function loadJsonToObj(projectContainer) {
	//プロジェクトの画像名を取得（divから）
	eachMapContainer = projectContainer.children;
    //マップのオブジェクトをロードする
    for (var i=0; i<eachMapContainer.length; i++) {
		//なんでホスト名は要らないのか不明!謎！
        //var url = 'https://hara-chan.com/rpg-editor/public/projects/' + currentProjectName + '/' + eachMapContainer[i].id + '.json';
		var url = '../../rpg-editor/public/projects/' + currentProjectName + '/' + eachMapContainer[i].id + '.json';
		url = decodeURI(url);
		var xhr = new XMLHttpRequest();
        //同期処理なので、ここで毎回取得
		xhr.open('GET', url, false);
		xhr.setRequestHeader('Pragma', 'no-cache');
		xhr.setRequestHeader('Cache-Control', 'no-cache');
		xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
        xhr.send(null);
		mapObj[eachMapContainer[i].id] = JSON.parse(xhr.responseText);
    }
    //プロジェクトデータをロードする
	//var url = 'https://hara-chan.com/rpg-editor/public/projects/' + currentProjectName + '/projectData.json';
	var url = '../../rpg-editor/public/projects/' + currentProjectName + '/projectData.json';
	url = decodeURI(url);
    var xhr = new XMLHttpRequest();
    //同期処理（false）なので、ここで毎回取得
	xhr.open('GET', url, false);
	//リクエストヘッダにキャッシュしない旨の情報を付与
	xhr.setRequestHeader('Pragma', 'no-cache');
	xhr.setRequestHeader('Cache-Control', 'no-cache');
	xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
	xhr.send(null);
	//スタートポジションなどのイベントも更新する必要がある
	projectDataObj = JSON.parse(xhr.responseText);
	console.log(projectDataObj);//開発用
}

//現在のマップチップを表示する。
//マップチップタイプもセットする。
//マップチップの縦横も取得する
function setCurrentMapChip(evt) {
	//クリックしたチップのurl取得
	currentMapChip.src = evt.target.src;
	//クリックしたチップのタイプ取得
	var currentMapChipTypeId = evt.target.parentNode.parentNode.id;
	var currentMapChipTypeId = evt.target.alt;
	switch (currentMapChipTypeId) {
		case 'character':
			//ドラッグフラグ変更
			currentMapChipType = 1;
			break;

		case 'map':
			//ドラッグフラグ変更
			currentMapChipType = 2;
			break;

		case 'mapPass':
			//ドラッグフラグ変更
			currentMapChipType = 3;
			break;

		case 'tool':
			//ドラッグフラグ変更
			currentMapChipType = 4;
			break;

		case 'building':
			//ドラッグフラグ変更
			currentMapChipType = 5;
			break;

		case 'mapRepeat_left':
			//ドラッグフラグ変更
			currentMapChipType = 6;
			break;

		case 'mapTurn':
			//ドラッグフラグ変更
			currentMapChipType = 7;
			break;

		case 'mapTurnPass':
			//ドラッグフラグ変更
			currentMapChipType = 8;
			break;

		case 'design':
			//ドラッグフラグ変更
			currentMapChipType = 9;
			break;
		case 'mapRepeat_right':
			//ドラッグフラグ変更
			currentMapChipType = 10;
			break;
		case 'mapRepeat_up':
			//ドラッグフラグ変更
			currentMapChipType = 11;
			break;
		case 'mapRepeat_down':
			//ドラッグフラグ変更
			currentMapChipType = 12;
			break;
	}
	//マップチップの縦横（マップチップ数）を取得する、画面にも表示する
	currentMapChipRowNum = currentMapChip.naturalHeight/32;
	currentMapChipColNum = currentMapChip.naturalWidth/32;
	var mapSizeTxt = ' (' + currentMapChipRowNum + '×'　+ currentMapChipColNum + 'マス)';
	currentMapChipSize.innerText = mapSizeTxt;
	//マップチップ削除のボタンを表示する
	if (deleteMapchipButton != undefined) {
		deleteMapchipButton.style.display = 'inline-block';
	}
}

//マップを表示する
//
function setMap(mode, direction, side) {

	//マップを退避
	var evacuateMap = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
	if (direction == 'row') {
        if (mode == 'add') {
			//一行増やす
			mapRowNum++;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			setArrayMaptipType(mode, direction, side);
			if (side == 'top') {
				mapContext.putImageData(evacuateMap, 0, mapLength);
				if (startMapFlg) {
					editStartMapPos(mode, 'bottom'); //スタートマップならスタートポジションを更新（下方向に移動だからbottom）
				}
				calcMapShit('top', 'plus'); //マップのシフト情報を更新
			} else if (side == 'bottom') {
				mapContext.putImageData(evacuateMap, 0, 0);
			} else {
				//何もしない
			}
        } else if (mode == 'del') {
			if (mapRowNum == 1) {
				return; //一行しかないのに消そうとしたらエラー
			}
			var res = true;
			if (startMapFlg) {
				res = editStartMapPos(mode, side); //スタートマップならスタートポジションを更新
			}
			if (res) {
				//スタートポジションの更新が正常終了した場合、マップを更新
				mapRowNum--;
				mapCanvas.setAttribute('height', mapRowNum*mapLength);
				mapCanvas.setAttribute('width', mapColNum*mapLength);
				setArrayMaptipType(mode, direction, side);
				if (side == 'top') {
					mapContext.putImageData(evacuateMap, 0, -mapLength);
					calcMapShit('top', 'minus'); //マップのシフト情報を更新
				} else if (side == 'bottom') {
					mapContext.putImageData(evacuateMap, 0, 0);
				} else {
					//何もしない
				}
			}
        } else {
			//何もしない
        }
    } else if (direction == 'col') {
        if (mode == 'add') {
			//一列増やす
			mapColNum++;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			setArrayMaptipType(mode, direction, side);
			if (side == 'left') {
				mapContext.putImageData(evacuateMap, mapLength, 0);
				if (startMapFlg) {
					editStartMapPos(mode, 'right'); //スタートマップならスタートポジションを更新（左方向に移動だからright）
				}
				calcMapShit('left', 'plus'); //マップのシフト情報を更新
			} else if (side == 'right') {
				mapContext.putImageData(evacuateMap, 0, 0);
			} else {
				//何もしない
			}
        } else if (mode == 'del') {
			if (mapColNum == 1) {
				return; //一行しかないのに消そうとしたらエラー
			}
			var res = true;
			if (startMapFlg) {
				res = editStartMapPos(mode, side); //スタートマップならスタートポジションを更新
			}
			if (res) {
				//スタートポジションの更新が正常終了した場合、マップを更新
				mapColNum--;
				mapCanvas.setAttribute('height', mapRowNum*mapLength);
				mapCanvas.setAttribute('width', mapColNum*mapLength);
				setArrayMaptipType(mode, direction, side);
				if (side == 'left') {
					mapContext.putImageData(evacuateMap, -mapLength, 0);
					calcMapShit('left', 'minus'); //マップのシフト情報を更新
				} else if (side == 'right') {
					mapContext.putImageData(evacuateMap, 0, 0);
				} else {
					//何もしない
				}
			}
        } else {
            //何もしない
        }
    } else {
		//何でもない時（初期表示）
		mapCanvas.setAttribute('height', mapRowNum*mapLength);
		mapCanvas.setAttribute('width', mapColNum*mapLength);
	}

	//マップの大きさを変更する際は、今までの大きさでの戻る進む用の配列をリセットする
	backArray = [];
	backArrayJson = [];
	forwardArray = [];
	forwardArrayJson = [];

	//マップを退避（orgに入れておく、マップの大きさを変更時はこれがオリジナルになる））
	var img = new Image();
	img.src = mapCanvas.toDataURL();
	orgEditMapImg = img;
    //戻るの最後用のjsonを保存しておく（orgに入れておく、マップの大きさを変更時はこれがオリジナルになる）
	var tmpRow = [];
	for (var i=0; i<arrayMaptipType.length; i++) {
		tmpRow.push(arrayMaptipType[i].concat()); //配列をpushするときは、concat()しないと参照渡しになってしまうので注意！
	}
	orgEditMapJson = tmpRow.concat();

	// 戻る進むボタンも非活性に戻す
	forward.style.display = "none";
	forwardDummy.style.display = "inline";
	back.style.display = "none";
	backDummy.style.display = "inline";

	mapBG.style.width = mapColNum*mapLength + 'px';
	mapStatus.innerHTML = 'マップステータス <br>■ 縦：' + mapRowNum + '行(' + mapRowNum*mapLength + 'px) ■ 横：' + mapColNum + '列(' + mapColNum*mapLength + 'px)';
}

//クリックされた座標を返す
//param1 : canvas要素
//param2 : eventオブジェクト
//return : クリックされたxy座標
function getMousePosition(mapCanvas, evt) {
    var rect = mapCanvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

//現在モードをセットする
function setCurrentMode(evt) {
	//ロード時のみデフォルトの現在モードをセット
	if (evt === undefined || evt === null) {
		put.classList.add('mode-on');
		put.parentNode.style.backgroundColor = "yellow";
	} else {
		//クリックされたアイコンが現在モードか調べる
		var isCurrentMode = evt.target.classList.contains('mode-on')
		//現在モードでなければ現在モード要素を入れ替える
		if (!isCurrentMode) {
			currentModeElement[0].parentNode.style.backgroundColor = "";
			currentModeElement[0].classList.remove('mode-on');
			evt.target.classList.add('mode-on');
			currentModeElement[0] = evt.target;
			currentModeElement[0].parentNode.style.backgroundColor = "yellow";
		}
	}
}

//オプションの詳細を表示する
function showDetail(evt) {
	var hoverSpan = evt.target;
	var z2 = hoverSpan.lastChild;
	z2.style.display = "inline";
	//現在モードでなければ現在モード要素を入れ替える
	if (hoverSpan.style.backgroundColor != "yellow") {
		hoverSpan.style.backgroundColor = "khaki";
	} else {
		//何もしない
	}
}

//オプションの詳細を非表示にする
function hideDetail(evt) {
	var hoverSpan = evt.target;
	var z2 = hoverSpan.lastChild;
	z2.style.display = "none";
	//現在モードでなければ現在モード要素を入れ替える
	if (hoverSpan.style.backgroundColor != "yellow") {
		hoverSpan.style.backgroundColor = "";
	} else {
		//何もしない
	}
}

//スタートマップの位置を編集する
function editStartMapPos(mode, side) {
	if (mode == 'shift') {
		switch(side) {
			case 'right':
				if (projectDataObj['startPosX'] != mapColNum-1) {
					projectDataObj['startPosX']++; //スタートXが一番右の列でなければ
				} else {
					projectDataObj['startPosX'] = 0; //スタートXが一番右の列なら、一周回って一番左に
				}
				console.log(projectDataObj['startPosX']);
				break;
			case 'left':
				if (projectDataObj['startPosX'] != 0) {
					projectDataObj['startPosX']--; //スタートXが一番左の列でなければ
				} else {
					projectDataObj['startPosX'] = mapColNum-1; //スタートXが一番左の列なら、一周回って一番右に
				}
				console.log(projectDataObj['startPosX']);
				break;
			case 'top':
				if (projectDataObj['startPosY'] != 0) {
					projectDataObj['startPosY']--; //スタートYが一番上の列でなければ
				} else {
					projectDataObj['startPosY'] = mapRowNum-1; //スタートYが一番上の列なら、一周回って一番下に
				}
				console.log(projectDataObj['startPosY']);
				break;
			case 'bottom':
				if (projectDataObj['startPosY'] != mapRowNum-1) {
					projectDataObj['startPosY']++; //スタートYが一番下の列でなければ
				} else {
					projectDataObj['startPosY'] = 0; //スタートYが一番下の列なら、一周回って一番上に
				}
				console.log(projectDataObj['startPosY']);
				break;
		}	
	} else if (mode == 'add') {
		switch(side) {
			case 'right':
				projectDataObj['startPosX']++;
				console.log(projectDataObj['startPosX']);
				break;
			case 'bottom':
				projectDataObj['startPosY']++;
				console.log(projectDataObj['startPosY']);
				break;
			default:
				break;
		}
	} else if (mode == 'del') {
		var res = true; //戻り値
		switch(side) {
			case 'right':
				if (projectDataObj['startPosX'] == mapColNum-1) {
					res = sub_confirmDelete('col');
				}
				console.log(projectDataObj['startPosX']);
				return res;
				//単純な右列削除の場合、スタートポジションは変更なし
				break;
			case 'left':
				if (projectDataObj['startPosX'] == 0) {
					res = sub_confirmDelete('col');
				} else {
					//左列削除の場合、スタートポジション変更
					projectDataObj['startPosX']--;
				}
				console.log(projectDataObj['startPosX']);
				return res;
				break;
			case 'top':
				if (projectDataObj['startPosY'] == 0) {
					res = sub_confirmDelete('row');
				} else {
					//単純に上行削除の場合、スタートポジション変更
					projectDataObj['startPosY']--;
				}
				console.log(projectDataObj['startPosY']);
				return res;
				break;
			case 'bottom':
				if (projectDataObj['startPosY'] == mapRowNum-1) {
					res = sub_confirmDelete('row');
				}
				console.log(projectDataObj['startPosY']);
				return res;
				//単純な下行削除の場合、スタートポジションは変更なし
				break;
		}
	} else {
		//何もしない
	}
	function sub_confirmDelete (direction) {
		var delDir;
		if (direction == 'col') {
			delDir = '列';
		} else {
			delDir = '行';
		}
		var confirmTxt = 'スタートポジションを含む' + delDir +'を削除しようとしています。\n削除を行うとスタートプロジェクトからも解除されます\n\nこの作業は取り消せません\nよろしいですか？';
		var ret = confirm(confirmTxt);
		if (ret) {
			//削除処理
			projectDataObj['startMap'] = 'null';
			projectDataObj['startPosX'] = 'null';
			projectDataObj['startPosY'] = 'null';
			//フラグオフ
			startMapFlg = false;
			return true;
		} else {
			return false;
		}
	}
}

//キャンバスを上下左右にシフトする
function shiftCanvas (direction) {

	if (direction == 'left') {
	//左シフト
		var leftLine = mapContext.getImageData(0, 0, mapLength, mapRowNum*mapLength);
		var other = mapContext.getImageData(mapLength, 0, mapColNum*mapLength-mapLength, mapRowNum*mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(leftLine, mapColNum*mapLength-mapLength, 0);
		mapContext.putImageData(other, 0, 0);
		setArrayMaptipType('shift', direction, 'dummy');
		if (startMapFlg) {
			editStartMapPos('shift', direction); //スタートマップならスタートポジションを更新
		}
		calcMapShit('left', 'munus'); //マップのシフト情報を更新
	} else if (direction == 'right') {
	//右シフト
		var rightLine = mapContext.getImageData(mapColNum*mapLength-mapLength, 0, mapLength, mapRowNum*mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength-mapLength, mapRowNum*mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(rightLine, 0, 0);
		mapContext.putImageData(other, mapLength, 0);
		setArrayMaptipType('shift', direction, 'dummy');
		if (startMapFlg) {
			editStartMapPos('shift', direction); //スタートマップならスタートポジションを更新
		}
		calcMapShit('left', 'plus'); //マップのシフト情報を更新
	} else if (direction == 'top') {
	//上シフト
		var topLine = mapContext.getImageData(0, 0, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, mapLength, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(topLine, 0, mapRowNum*mapLength-mapLength);
		mapContext.putImageData(other, 0, 0);
		setArrayMaptipType('shift', direction, 'dummy');
		if (startMapFlg) {
			editStartMapPos('shift', direction); //スタートマップならスタートポジションを更新
		}
		calcMapShit('top', 'minus'); //マップのシフト情報を更新
	} else if (direction == 'bottom') {
	//下シフト
		var bottomLine = mapContext.getImageData(0, mapRowNum*mapLength-mapLength, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(bottomLine, 0, 0);
		mapContext.putImageData(other, 0, mapLength);
		setArrayMaptipType('shift', direction, 'dummy');
		if (startMapFlg) {
			editStartMapPos('shift', direction); //スタートマップならスタートポジションを更新
		}
		calcMapShit('top', 'plus'); //マップのシフト情報を更新
	} else {
		//何もしない
	}
	setDraggingFlg(false);
	//戻る進むを更新
	//updataBackForward();
}


//画面のマップシフトの値を変更する
function calcMapShit(direction, mode) {
	var tmpX = Number(document.getElementById("map_shift_x").innerText);
	var tmpY = Number(document.getElementById("map_shift_y").innerText);
	if (direction == 'top') {
	//top
		if (mode == 'plus') {
		// plus
			document.getElementById("map_shift_y").innerText = tmpY+1;
		} else {
		// minus
			document.getElementById("map_shift_y").innerText = tmpY-1;
		}
	} else {
	//left
		if (mode == 'plus') {
		// plus
			document.getElementById("map_shift_x").innerText = tmpX+1;
		} else {
		// minus
			document.getElementById("map_shift_x").innerText = tmpX-1;
		}

	}


}

//ドラッグフラグをセットする
function setDraggingFlg (bool) {
	if (!currentMapChip.src.endsWith('.png')) {
		alert('マップチップが選択されていません！（シフト時も選択してください）。');
		return; 
	}
	draggingFlg = bool; // ここはドラッグフラグを引数の値で変更する。
	if (!bool) { // マウスアップ時、戻る進むを更新する（canvasとjson。また、色の判定は行わない、めんどくさいので）
		//進む配列初期化
		forwardArray = [];
		forwardArrayJson = [];
		//進むを非活性化
		forward.style.display = "none";
		forwardDummy.style.display = "inline";
		//戻る用配列更新
		backArray.push(mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength));
		var tmpRow = [];
		for (var i=0; i<arrayMaptipType.length; i++) {
			tmpRow.push(arrayMaptipType[i].concat()); //配列をpushするときは、concat()しないと参照渡しになってしまうので注意！
		}
		backArrayJson.push(tmpRow.concat());
		//戻るを活性化
		backDummy.style.display = "none";
		back.style.display = "inline";
		//canvas変更フラグも元に戻す
		canvasChangeFlg = false;
	}
}

//カーソル位置を表示
var cursorPos = document.getElementById("cursorPos");
var cursorPosHiddenX = 0;
var cursorPosHiddenY = 0;
function showCursorPos(evt) {
	//クリックした座標を取得する
	var mousePos = getMousePosition(mapCanvas, evt);
	var x = mousePos.x;
    var y = mousePos.y;

	var tmpPositionX = Math.floor(x/mapLength);
	var tmpPositionY = Math.floor(y/mapLength);

	cursorPosHiddenX = tmpPositionX;
	cursorPosHiddenY = tmpPositionY;

	cursorPos.innerText = tmpPositionX + "：" + tmpPositionY;

}

function showWindowRect(evt) {

	// パスをリセット
	mapContext.beginPath();
	// レクタングルの座標(50,50)とサイズ(75,50)を指定
	mapContext.rect(cursorPosHiddenX*mapLength ,cursorPosHiddenY*mapLength , viewCanvasWidth, viewCanvasHeight);
	// 線の色
	mapContext.strokeStyle = "orange";
	// 線の太さ
	mapContext.lineWidth =  3;
	// 線を描画を実行
	mapContext.stroke() ;
}

function showCurrentChipRect(evt) {

	// パスをリセット
	mapContext.beginPath();
	// レクタングル
	mapContext.rect(cursorPosHiddenX*mapLength ,cursorPosHiddenY*mapLength , currentMapChipColNum*mapLength, currentMapChipRowNum*mapLength);
	// 線の色
	mapContext.strokeStyle = "red";
	// 線の太さ
	mapContext.lineWidth =  3;
	// 線を描画を実行
	mapContext.stroke() ;
	//現在チップを表示
	mapContext.drawImage(currentMapChip, cursorPosHiddenX*mapLength ,cursorPosHiddenY*mapLength);
}

//マップを編集する
//param1 : クリック時イベント情報
function editMap(evt) {
	//ドラッグフラグ変更
	setDraggingFlg(true);

	//クリックした座標を取得する
	var mousePos = getMousePosition(mapCanvas, evt);
	var x = mousePos.x;
    var y = mousePos.y;

	var tmpPositionX = Math.floor(x/mapLength);
	var tmpPositionY = Math.floor(y/mapLength);

	//(ドラッグの時用)前回のスタート位置とスタート位置を比較、同じ場合は何もしない
	if (startX != tmpPositionX || startY != tmpPositionY) {
		//スタート位置(マップごとの)
		startX = tmpPositionX;
    	startY = tmpPositionY;
    	//現在モードid取得
		var currentModeId = currentModeElement[0].id;
		//マップ属性を更新前に退避
		var tmpEvacuateMapTipe = arrayMaptipType;
    	if (currentModeId == 'put') {
    		//デザインチップ以外の場合は、プロジェクトデータ、マップデータをいじる必要あり
    		if (currentMapChipType != 7 && currentMapChipType != 8 && currentMapChipType != 9) {
				//マップチップ属性を更新
				//マップチップの縦横分更新
				for (i=0; i<currentMapChipRowNum; i++) {
					for (j=0; j<currentMapChipColNum; j++) {
						if (startMapFlg) {
							if (startY+i == projectDataObj['startPosY'] && startX+j == projectDataObj['startPosX']) {
								//確認ウィンドウを出す前にドラッグフラグをfalseに
								setDraggingFlg(false);
								var confirmTxt = 'スタートポジションを含む範囲を編集しようとしています。\n編集を行うとスタートポジションの解除およびスタートプロジェクトからも解除されます\n\nこの作業は取り消せません\nよろしいですか？';
								var ret = confirm(confirmTxt);
								if (ret) {
									//OKなら削除処理
									projectDataObj['startMap'] = 'null';
									projectDataObj['startPosX'] = 'null';
									projectDataObj['startPosY'] = 'null';
									//フラグオフ
									startMapFlg = false;							
								} else {
									//消さない場合はマップ属性を元に戻してリターン
									arrayMaptipType = tmpEvacuateMapTipe;
									return;
								}
							}
						}
						//マップ更新時、イベント等の情報をリセットするために配列を初期化
						//arrayMaptipType[startY+i][startX+j] = [];
						arrayMaptipType[startY+i][startX+j] = new Object();
						//初期化後マップ属性を配置
						arrayMaptipType[startY+i][startX+j]['maptipType'] = currentMapChipType;
					}
				}
    		}
        	//現在チップをマップに表示
			mapContext.drawImage(currentMapChip, mapLength*startX, mapLength*startY);
    	} else if (currentModeId == 'delete') {
			if (startMapFlg) {
				if (startY == projectDataObj['startPosY'] && startX == projectDataObj['startPosX']) {
					//確認ウィンドウを出す前にドラッグフラグをfalseに
					setDraggingFlg(false);
					var confirmTxt = 'スタートポジションを含む範囲を編集しようとしています。\n編集を行うとスタートポジションの解除およびスタートプロジェクトからも解除されます\n\nこの作業は取り消せません\nよろしいですか？';
					var ret = confirm(confirmTxt);
					if (ret) {
						//OKなら削除処理
						projectDataObj['startMap'] = 'null';
						projectDataObj['startPosX'] = 'null';
						projectDataObj['startPosY'] = 'null';
						//フラグオフ
						startMapFlg = false;							
					} else {
						//消さない場合はマップ属性を元に戻してリターン
						arrayMaptipType = tmpEvacuateMapTipe;
						return;
					}
				}
			}
			//マップチップ消去
			mapContext.clearRect(mapLength*startX, mapLength*startY, mapLength, mapLength);
			//マップ更新時、イベント等の情報をリセットするために配列を初期化
			arrayMaptipType[startY][startX] = new Object();
			//マップチップ属性を更新（削除）
			arrayMaptipType[startY][startX]['maptipType'] = 0;
    	} else if (currentModeId == '') {

		}

	}
}

//カテゴリを展開する or たたむ
function changeCategoryDisplay (evt, mode) {
	if (mode == 'unfold') {
		//プラスボタンを非表示に
		evt.target.style.display = 'none';
		//マイナスボタンを表示
		var minus = evt.target.nextElementSibling;
		minus.style.display = 'inline';
		// コンテンツを表示
		var parent = evt.target.parentNode;
		var div = parent.nextElementSibling;
		div.style.display = 'block';
	} else if (mode == 'fold') {
		//マイナスボタンを非表示に
		evt.target.style.display = 'none';
		//プラスボタンを表示
		var plus = evt.target.previousElementSibling;
		plus.style.display = 'inline';
		// コンテンツを非表示
		var parent = evt.target.parentNode;
		var div = parent.nextElementSibling;
		div.style.display = 'none';
	} else {

	}
}

//プロジェクトデータを切り替える
function ChangeOldProjectData(evt) {
	//切り替えたプロジェクトのvalueを取得
	var index = evt.selectedIndex;
	if (index == 0) return; //「プロジェクトを選択の時は何もしない」
	var value = evt.options[index].value; // 値
	//divの表示切り替え
	if (currentProjectDataContainer != 'def') {
		currentProjectDataContainer.style.display = 'none';
	}
	//プロジェクトのdivを表示
	currentProjectDataContainer = document.getElementById(value);
	currentProjectDataContainer.style.display = 'block';
	//現在選択中プロジェクト名を更新
	currentProjectName = value;
	//プロジェクトのjsonをロード
	loadJsonToObj(currentProjectDataContainer);
}

//プレビューを表示する
function showPreview () {
	preview.src = mapCanvas.toDataURL();
	editContainer.style.display = 'none';
	previewContainer.style.display = 'block';
}

//書き直す
function doRewrite () {
	//プレビューのURLを消去
	preview.src = "";
	editContainer.style.display = 'block';
	previewContainer.style.display = 'none';
}

//canvasの描画をダウンロードする
function downloadCanvas(evt) {
	const a = evt.target; //e.targetはクリックされた要素を指す（<a>タグ）
	a.href = mapCanvas.toDataURL(); //Canvasからdata:URLを取得
	a.download = new Date().getTime() + '.png'; //ダウンロードファイル名はタイムスタンプに設定
}

//既存プロジェクトのマップ名を一覧表示する（確認画面）
var currentProjectDataContainer2 = document.getElementById("currentProjectDataContainer2");
function showProjectMapNames(evt) {
	// prjNameの既存マップを一覧で取得して、ソースに表示する
	//切り替えたプロジェクトのvalueを取得
	var index = evt.selectedIndex;
	if (index == 0) return; //「プロジェクトを選択の時は何もしない」
	var value = evt.options[index].value; // 値
	//プロジェクトのdivを表示
	currentProjectDataContainer2.innerHTML = document.getElementById(value).innerHTML;
}

//マップチップ属性配列をセットする
function setArrayMaptipType (mode, direction, side) {
	if (mode == 'load') {
		//マップチップ属性デフォルトセット
		for (var i=0; i<mapRowNum; i++) {
			arrayMaptipType[i] = new Array();
			for (var j=0; j<mapColNum; j++) {
				arrayMaptipType[i][j] = new Object();
				arrayMaptipType[i][j]['maptipType'] = 0;
			}
		}
	} else if (mode == 'add') {
		if (direction == 'row') {
			if (side == 'top') {
				arrayMaptipType.unshift(new Array());
				for (var i=0; i<mapColNum; i++) {
					arrayMaptipType[0][i] = new Object();
					arrayMaptipType[0][i]['maptipType'] = 0;
				}
			} else if (side == 'bottom') {
				arrayMaptipType.push(new Array());
				for (var i=0; i<mapColNum; i++) {
					arrayMaptipType[mapRowNum-1][i] = new Object();
					arrayMaptipType[mapRowNum-1][i]['maptipType'] = 0;
				}
			} else {
				//何もしない
			}
		} else if (direction == 'col') {
			if (side == 'left') {
				for (var i=0; i<mapRowNum; i++) {
					arrayMaptipType[i].unshift(new Array());
					arrayMaptipType[i][0] = new Object();
					arrayMaptipType[i][0]['maptipType'] = 0;
				}
			} else if (side == 'right') {
				for (var i=0; i<mapRowNum; i++) {
					arrayMaptipType[i].push(new Array());
					arrayMaptipType[i][mapColNum-1] = new Object();
					arrayMaptipType[i][mapColNum-1]['maptipType'] = 0;
				}
			} else {
				//何もしない
			}
		} else {
			//何もしない
		}
		
	} else if (mode == 'del') {
		if (direction == 'row') {
			if (side == 'top') {
				arrayMaptipType.shift();
			} else if (side == 'bottom') {
				arrayMaptipType.pop();
			} else {
				//何もしない
			}
		} else if (direction == 'col') {
			if (side == 'left') {
				for (var i=0; i<mapRowNum; i++) {
					arrayMaptipType[i].shift();
				}
			} else if (side == 'right') {
				for (var i=0; i<mapRowNum; i++) {
					arrayMaptipType[i].pop();
				}
			} else {
				//何もしない
			}
		} else {
			//何もしない
		}
	} else if (mode == 'shift') {
		if (direction == 'left') {
			//一番左のマップチップの値
			var leftSideTipValue;
			for (var i=0; i<mapRowNum; i++) {
				for (var j=0; j<mapColNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番左の列のチップの値を取得しておく
						leftSideTipValue = arrayMaptipType[i][j];
						continue;
					}
					arrayMaptipType[i][j-1] = arrayMaptipType[i][j];
				}
				//一行ループが終わったら、最初に確保した一番左の値を一番右の値に代入
				arrayMaptipType[i][mapColNum-1] = leftSideTipValue;
			}

		} else if (direction == 'right') {
			//一番右のマップチップの値
			var rightSideTipValue;
			for (var i=0; i<mapRowNum; i++) {
				for (var j=0; j<mapColNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番右の列のチップの値を取得しておく
						rightSideTipValue = arrayMaptipType[i][mapColNum-1];
						continue;
					}
					arrayMaptipType[i][mapColNum-j] = arrayMaptipType[i][mapColNum-1-j];
				}
				//一行ループが終わったら、最初に確保した一番右の値を一番左の値に代入
				arrayMaptipType[i][0] = rightSideTipValue;
			}

		} else if (direction == 'top') {
			//一番上のマップチップの値
			var topSideTipValue;
			for (var i=0; i<mapColNum; i++) {
				for (var j=0; j<mapRowNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番上の列のチップの値を取得しておく
						topSideTipValue = arrayMaptipType[j][i];
						continue;
					}
					arrayMaptipType[j-1][i] = arrayMaptipType[j][i];
				}
				//一行ループが終わったら、最初に確保した一番右の値を一番下の値に代入
				arrayMaptipType[mapRowNum-1][i] = topSideTipValue;
			}

		} else if (direction == 'bottom') {
			//一番上のマップチップの値
			var bottomSideTipValue;
			for (var i=0; i<mapColNum; i++) {
				for (var j=0; j<mapRowNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番下の列のチップの値を取得しておく
						bottomSideTipValue = arrayMaptipType[mapRowNum-1][i];
						continue;
					}
					arrayMaptipType[mapRowNum-j][i] = arrayMaptipType[mapRowNum-j-1][i];
				}
				//一行ループが終わったら、最初に確保した一番下の値を一番上の値に代入
				arrayMaptipType[0][i] = bottomSideTipValue;
			}

		} else {

		}
	}
}

//マップチップ属性をjsonにして保存する
function savaMaptipTypeAsJson(mode) {
	var obj = new Object();
		for (var i=0; i<mapRowNum; i++) {
			obj[i] = new Object();
			for (var j=0; j<mapColNum; j++) {
				obj[i][j] = new Object();
				//obj[i][j]['maptipType'] = arrayMaptipType[i][j];
				obj[i][j] = arrayMaptipType[i][j];
			}
		}
		var objTxt = JSON.stringify(obj);
	if (mode == 'save') {
		document.forms['map_data'].elements['map_obj_data'].value = objTxt;
	} else if (mode == 'update') {
		document.forms['update_map_data'].elements['map_obj_data'].value = objTxt;
	} else if ('copy') {
		document.forms['copy_map_data'].elements['map_obj_data'].value = objTxt;
	} else {

	}
	
}

//画像を保存
function saveMaptip(mode) {
	var data = mapCanvas.toDataURL("image/png");
	data = data.replace("data:image/png;base64,", "");
	if (mode == 'save') {
		document.forms['map_data'].elements['map_image_data'].value = data;
	} else if (mode == 'update') {
		document.forms['update_map_data'].elements['map_image_data'].value = data;
	} else if (mode == 'copy') {
		document.forms['copy_map_data'].elements['map_image_data'].value = data;
	} else {

	}
}

//プロジェクトファイルのデータ（デフォルト)作成
function setProjectData(mode, projectData) {
	if (mode == 'save') {
		var obj = new Object();
		obj['prjName'] = projectData; //新規の場合プロジェクト名が渡ってくる
		obj['startMap'] = 'null';
		obj['startPosX'] = 'null';
		obj['startPosY'] = 'null';
		var objTxt = JSON.stringify(obj);
		document.forms['map_data'].elements['project_data'].value = objTxt;
	} else if (mode == 'update') {
		var objTxt = JSON.stringify(projectData); //更新の場合プロジェクトデータが渡ってくる
		document.forms['update_map_data'].elements['project_data'].value = objTxt;
	} else if (mode == 'copy') {
		var objTxt = JSON.stringify(projectData); //複製の場合プロジェクトデータが渡ってくる
		document.forms['copy_map_data'].elements['project_data'].value = objTxt;
	} else {

	}
}

//シフト情報を保存する
function saveShiftData(mode) {
	//画面のシフトの数をpost値（map_shift_x、map_shift_y）に入れる
	document.forms['map_data'].elements['map_shift_x'].value = document.getElementById("map_shift_x").innerText;
	document.forms['map_data'].elements['map_shift_y'].value = document.getElementById("map_shift_y").innerText;

}


//マップデータをサーバに保存する
function saveMapDataToSever() {
	var error = false; //エラーフラグ
	var oldProjectName; //既存プロジェクト名
	var newProjectName; //新規プロジェクト名
	var oldFlg = false; //既存プロジェクトフラグ
	var newFlg = false; //新規プロジェクトフラグ
	var MapDataForm = document.forms['map_data'];
	if (MapDataForm.old.checked) {
		//既存プロジェクトの場合
		if (MapDataForm.oldProjectName2.children.length == 0){
			alert('既存プロジェクトがありません');
			error = true;	
		} else if (MapDataForm.oldProjectName2.disabled) {
			MapDataForm.oldProjectName2.disabled = false;
		} else {
			//MapDataForm.newProjectName.disabled = true;	
			oldProjectName = MapDataForm.oldProjectName2.value;
			oldFlg = true;
		}
	} else if (MapDataForm.new.checked) {
		//新規プロジェクトの場合
		newProjectName = MapDataForm.newProjectName.value;
		if (MapDataForm.newProjectName.disabled) {
			MapDataForm.newProjectName.disabled = false;
		}
		if (newProjectName == null || newProjectName.length == 0) {
			alert('新規プロジェクト名を入力してください。');
			error = true;
		} else {
			MapDataForm.oldProjectName2.disabled = true;
			newFlg = true;
		}
	} else {

	}
	
	if (!error) {
		var mapData;
		if (oldFlg) {
			mapData = '既存プロジェクト：' + oldProjectName;
		} else if (newFlg) {
			mapData = '新規プロジェクト：' + newProjectName;
		}
		//いったん本当に良いかアラート
		var confirmTxt = '下記の情報でマップデータをサーバに保存します。\n\n' + mapData + '\n\n編集画面には戻れません。\nよろしいですか？';
		var ret = confirm(confirmTxt);
		if (ret) {
			//アラートの結果もよければ、マップデータを保存して、サブミット
			savaMaptipTypeAsJson('save');
			saveMaptip('save');
			setProjectData('save', oldProjectName);
			//saveShiftData('save'); 　//新規はいらないはずだが一応残しておく！
			//setProjectData('save', newProjectName);
			MapDataForm.submit();
		} else {
			MapDataForm.oldProjectName2.disabled = false;
			MapDataForm.newProjectName2.disabled = false;
		}
	}
}

//マップデータをサーバに更新する
function updateMapDataToSever() {

	var shiftX = document.getElementById("map_shift_x").innerText;
	var shiftY = document.getElementById("map_shift_y").innerText;

	//プロジェクトのスタートマップの場合、スタートポジションのバリデーションを行う
	if (startMapFlg) {
		//スタートポジションのバリデーション
		var sPosFlg = true;
		if (shiftX != 0 && shiftY != 0) {
			var ret = confirm('スタートマップに設定されている既存マップです。\n縦横ずらした分、設定中スタートポジションを更新します。\nよろしいですか？');
			if (!ret) {
				return;
			}

			//更新した結果が不正な値（マイナスな値）ならreturn;
			if (projectDataObj['startPosX'] < 0 || projectDataObj['startPosY'] < 0) {
				alert('スタートポジションがマップの範囲外になってしまいます。\n修正してください。');
				return;
			}
		}
		if (arrayMaptipType[projectDataObj['startPosY']][projectDataObj['startPosX']]['maptipType'] != 3) {
			alert('スタートポジションに設定できるのは、「地形通りぬけ」のマップチップのみです!\n編集してください\n\nスタートポジション = [' + projectDataObj['startPosX'] + ',' + projectDataObj['startPosY'] +']');
			return;
		}
	}

	//マップをシフトした分、関連するデータを更新する
	updateDataByShiftNum(shiftX, shiftY);

	var MapDataForm = document.forms['update_map_data'];
	var mapData = '既存プロジェクト：' + currentProjectName +'\nマップ名：' + selectedMapName.innerText;
	//いったん本当に良いかアラート
	var confirmTxt = '下記の情報でマップデータをサーバに保存します。\n\n' + mapData + '\n\n編集画面には戻れません。\nよろしいですか？';
	var ret = confirm(confirmTxt);
	if (ret) {
		//アラートの結果もよければ、マップデータを保存して、サブミット
		savaMaptipTypeAsJson('update');
		saveMaptip('update');
		setProjectData('update', projectDataObj);
		// saveShiftData('updata');
		MapDataForm.submit();
	}
}

//マップデータをサーバに複製する
function copyMapDataToSever() {

	var shiftX = document.getElementById("map_shift_x").innerText;
	var shiftY = document.getElementById("map_shift_y").innerText;

	//マップをシフトした分、関連するデータを更新する
	updateDataByShiftNum(shiftX, shiftY);

	var MapDataForm = document.forms['copy_map_data'];
	var mapData = '既存プロジェクト：' + currentProjectName +'\nマップ名：' + selectedMapName.innerText;
	//いったん本当に良いかアラート
	var confirmTxt = '下記の情報でマップデータをサーバに保存します。\n\n' + mapData + '\n\n編集画面には戻れません。\nよろしいですか？';
	var ret = confirm(confirmTxt);
	if (ret) {
		//アラートの結果もよければ、マップデータを保存して、サブミット
		savaMaptipTypeAsJson('copy');
		saveMaptip('copy');
		setProjectData('copy', projectDataObj);
		// saveShiftData('updata');
		MapDataForm.submit();
	}
}

//既存マップを編集でシフトした分の関連データを更新する
var allMapData = [];
function updateDataByShiftNum(shiftX, shiftY) {
	//自身のマップの設定済みの以下のイベントの位置情報を更新する
	//ムーブイベント
	//デリートオブジェクトイベント
	//エフェクトイベント：アニメーション
	//横倒しイベント
	//マップイベントとオブジェクトイベントがあるので注意。
	for (var i=0; i<arrayMaptipType.length; i++) {
		for (var j=0; j<arrayMaptipType[i].length; j++) {
			//マップイベント
			if (arrayMaptipType[i][j].hasOwnProperty('events')) {
				var eventNames = Object.keys(arrayMaptipType[i][j]['events']);
				for (var k=0; k<eventNames.length; k++) {
    				var firstLetter = eventNames[k].substr(0, 1);
    				//イベント名が数字始まりだった場合（既存のイベント）の処理。変なイベント登録仕様にした過去の自分に後悔。
    				if (isNaN(firstLetter) == false) {
        				//イベントネームを取得
        				var index = eventNames[k].indexOf('_');
        				var eventName = eventNames[k].substr(index+1);
        				if (eventName == 'move') {
        					//chip_n > fromX fromYで情報を持っている
        					//シフト分ずらす
        					var chip_n_keys = Object.keys(arrayMaptipType[i][j]['events'][eventNames[k]]);
        					for (var l=0; l<chip_n_keys.length; l++) {
        						var index2 = chip_n_keys[l].indexOf('chip_');
        						if (index2 == -1) continue;
        						var chip_n_info = arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]];
        						var tmpX = Number(chip_n_info['fromX'])+Number(shiftX);
        						var tmpY = Number(chip_n_info['fromY'])+Number(shiftY);
        						arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]]['fromX'] = tmpX.toString();
        						arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]]['fromY'] = tmpY.toString();
        					}
        				}
        				if (eventName == 'deleteObject') {
        					//delX delYで情報を持っている
        					//シフト分ずらす
        					var tmpX = Number(arrayMaptipType[i][j]['events'][eventNames[k]]['delX'])+Number(shiftX);
        					var tmpY = Number(arrayMaptipType[i][j]['events'][eventNames[k]]['delY'])+Number(shiftY);
        					arrayMaptipType[i][j]['events'][eventNames[k]]['delX'] = tmpX.toString();
        					arrayMaptipType[i][j]['events'][eventNames[k]]['delY'] = tmpY.toString();
        				}
        				if (eventName == 'effect') {
        					if (arrayMaptipType[i][j]['events'][eventNames[k]]['type'] == 'animation') {//effectの場合typeを持ってる
        						//シフト分ずらす
								var chip_n_keys = Object.keys(arrayMaptipType[i][j]['events'][eventNames[k]]['animationCells']);
        						for (var m=0; m<chip_n_keys.length; m++) {
        							var tmpX = Number(arrayMaptipType[i][j]['events'][eventNames[k]]['animationCells'][m]['x'])+Number(shiftX);
        							var tmpY = Number(arrayMaptipType[i][j]['events'][eventNames[k]]['animationCells'][m]['y'])+Number(shiftY);
        							arrayMaptipType[i][j]['events'][eventNames[k]]['animationCells'][m]['x'] = tmpX.toString();
        							arrayMaptipType[i][j]['events'][eventNames[k]]['animationCells'][m]['y'] = tmpY.toString();
        						}
        					}
        				}
        				if (eventName == 'layDown') {
        					//シフト分ずらす
        					var chip_n_keys = Object.keys(arrayMaptipType[i][j]['events'][eventNames[k]]);
        					for (var l=0; l<chip_n_keys.length; l++) {
        						var index2 = chip_n_keys[l].indexOf('chip_');
        						if (index2 == -1) continue;
        						var chip_n_info = arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]];
        						var tmpX = Number(chip_n_info['X'])+Number(shiftX);
        						var tmpY = Number(chip_n_info['Y'])+Number(shiftY);
        						arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]]['X'] = tmpX.toString();
        						arrayMaptipType[i][j]['events'][eventNames[k]][chip_n_keys[l]]['Y'] = tmpY.toString();
        					}
        				}
    				}
				}
			}
			//オブジェクトイベント
			if (arrayMaptipType[i][j].hasOwnProperty('object') && arrayMaptipType[i][j]['object'].hasOwnProperty('events')) {
				var eventNames = Object.keys(arrayMaptipType[i][j]['object']['events']);
				for (var k=0; k<eventNames.length; k++) {
    				var firstLetter = eventNames[k].substr(0, 1);
    				//イベント名が数字始まりだった場合（既存のイベント）の処理。変なイベント登録仕様にした過去の自分に後悔。
    				if (isNaN(firstLetter) == false) {
        				//イベントネームを取得
        				var index = eventNames[k].indexOf('_');
        				var eventName = eventNames[k].substr(index+1);
        				if (eventName == 'move') {
        					//chip_n > fromX fromYで情報を持っている
        					//シフト分ずらす
        					var chip_n_keys = Object.keys(arrayMaptipType[i][j]['object']['events'][eventNames[k]]);
        					for (var l=0; l<chip_n_keys.length; l++) {
        						var index2 = chip_n_keys[l].indexOf('chip_');
        						if (index2 == -1) continue;
        						var chip_n_info = arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]];
        						var tmpX = Number(chip_n_info['fromX'])+Number(shiftX);
        						var tmpY = Number(chip_n_info['fromY'])+Number(shiftY);
        						arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]]['fromX'] = tmpX.toString();
        						arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]]['fromY'] = tmpY.toString();
        					}
        				}
        				if (eventName == 'deleteObject') {
        					//delX delYで情報を持っている
        					//シフト分ずらす
        					var tmpX = Number(arrayMaptipType[i][j]['object']['events'][eventNames[k]]['delX'])+Number(shiftX);
        					var tmpY = Number(arrayMaptipType[i][j]['object']['events'][eventNames[k]]['delY'])+Number(shiftY);
        					arrayMaptipType[i][j]['object']['events'][eventNames[k]]['delX'] = tmpX.toString();
        					arrayMaptipType[i][j]['object']['events'][eventNames[k]]['delY'] = tmpY.toString();
        				}
        				if (eventName == 'effect') {
        					if (arrayMaptipType[i][j]['events'][eventNames[k]]['type'] == 'animation') {//effectの場合typeを持ってる
        						//シフト分ずらす
								var chip_n_keys = Object.keys(arrayMaptipType[i][j]['object']['events'][eventNames[k]]['animationCells']);
        						for (var m=0; m<chip_n_keys.length; m++) {
        							var tmpX = Number(arrayMaptipType[i][j]['object']['events'][eventNames[k]]['animationCells'][m]['x'])+Number(shiftX);
        							var tmpY = Number(arrayMaptipType[i][j]['object']['events'][eventNames[k]]['animationCells'][m]['y'])+Number(shiftY);
        							arrayMaptipType[i][j]['object']['events'][eventNames[k]]['animationCells'][m]['x'] = tmpX.toString();
        							arrayMaptipType[i][j]['object']['events'][eventNames[k]]['animationCells'][m]['y'] = tmpY.toString();
        						}
        					}
        				}
        				if (eventName == 'layDown') {
        					//シフト分ずらす
        					var chip_n_keys = Object.keys(arrayMaptipType[i][j]['object']['events'][eventNames[k]]);
        					for (var l=0; l<chip_n_keys.length; l++) {
        						var index2 = chip_n_keys[l].indexOf('chip_');
        						if (index2 == -1) continue;
        						var chip_n_info = arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]];
        						var tmpX = Number(chip_n_info['X'])+Number(shiftX);
        						var tmpY = Number(chip_n_info['Y'])+Number(shiftY);
        						arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]]['X'] = tmpX.toString();
        						arrayMaptipType[i][j]['object']['events'][eventNames[k]][chip_n_keys[l]]['Y'] = tmpY.toString();
        					}
        				}
    				}
				}
			}
		}
	}
	//トランジションイベント
	//allMapDataを取得
	//マップごとにループ
	var mapNames = Object.keys(mapObj);
	for (var k=0; k<mapNames.length; k++) {
		allMapData[mapNames[k]] = [];
		var maptipTypeObj = Object.keys(mapObj[mapNames[k]]).map(function (key) {return mapObj[mapNames[k]][key]});
		//マップの行ごとにループ
		for (var y=0; y<maptipTypeObj.length; y++) {
			allMapData[mapNames[k]][y] = [];
			//マップの列ごとにループ
			var xIndexs = Object.keys(maptipTypeObj[y])
			for (var x=0; x<xIndexs.length; x++) {
				allMapData[mapNames[k]][y][x] = maptipTypeObj[y][xIndexs[x]];//マップチップタイプだけでなく、設定済みの全データ
			}	
		}
	}
	//allMapDataからトランジションデータを修正していく
	//マップイベントとオブジェクトイベントがあるので注意。
	for (var i=0; i<mapNames.length; i++) {
		for (var y=0; y<allMapData[mapNames[i]].length; y++) {
			for (var x=0; x<allMapData[mapNames[i]][y].length; x++) {
				//マップイベントのトランジション
				if (allMapData[mapNames[i]][y][x].hasOwnProperty('events')) {
					var eventNames = Object.keys(allMapData[mapNames[i]][y][x]['events']);
					for (var j=0; j<eventNames.length; j++) {
    					var firstLetter = eventNames[j].substr(0, 1);
    					//イベント名が数字始まりだった場合（既存のイベント）の処理。変なイベント登録仕様にした過去の自分に後悔。
    					if (isNaN(firstLetter) == false) {
        					//イベントネームを取得
        					var index = eventNames[j].indexOf('_');
        					var eventName = eventNames[j].substr(index+1);
        					if (eventName == 'transition') {
        						//遷移先が編集中のマップへだったら
        						if (allMapData[mapNames[i]][y][x]['events'][eventNames[j]]['transitionMap'] == selectedMapName.innerText) {
        							//シフト分ずらす
        							var tmpX = Number(allMapData[mapNames[i]][y][x]['events'][eventNames[j]]['transitionX'])+Number(shiftX);
        							var tmpY = Number(allMapData[mapNames[i]][y][x]['events'][eventNames[j]]['transitionY'])+Number(shiftY);
        							allMapData[mapNames[i]][y][x]['events'][eventNames[j]]['transitionX'] = tmpX.toString();
        							allMapData[mapNames[i]][y][x]['events'][eventNames[j]]['transitionY'] = tmpY.toString();
        						}
        					}
    					}
					}
				}
				//オブジェクトイベントのトランジション
				if (allMapData[mapNames[i]][y][x].hasOwnProperty('object') && allMapData[mapNames[i]][y][x]['object'].hasOwnProperty('events')) {
					var eventNames = Object.keys(allMapData[mapNames[i]][y][x]['object']['events']);
					for (var j=0; j<eventNames.length; j++) {
    					var firstLetter = eventNames[j].substr(0, 1);
    					//イベント名が数字始まりだった場合（既存のイベント）の処理。変なイベント登録仕様にした過去の自分に後悔。
    					if (isNaN(firstLetter) == false) {
        					//イベントネームを取得
        					var index = eventNames[j].indexOf('_');
        					var eventName = eventNames[j].substr(index+1);
        					if (eventName == 'transition') {
        						if (allMapData[mapNames[i]][y][x]['object']['events'][eventNames[j]]['transitionMap'] == selectedMapName.innerText) {
        							//シフト分ずらす
        							var tmpX = Number(allMapData[mapNames[i]][y][x]['object']['events'][eventNames[j]]['transitionX'])+Number(shiftX);
        							var tmpY = Number(allMapData[mapNames[i]][y][x]['object']['events'][eventNames[j]]['transitionY'])+Number(shiftY);
        							allMapData[mapNames[i]][y][x]['object']['events'][eventNames[j]]['transitionX'] = tmpX.toString();
        							allMapData[mapNames[i]][y][x]['object']['events'][eventNames[j]]['transitionY'] = tmpY.toString();
        						}
        					}
    					}
					}
				}
			}
		}
	}

	//allMapDataをストリンギファイしてフォームに詰める
	var obj = new Object();
	for (var i=0; i<mapNames.length; i++) {
		obj[mapNames[i]] = new Object();
		for (var j=0; j<allMapData[mapNames[i]].length; j++) {
			obj[mapNames[i]][j] = new Object();
			for (var k=0; k<allMapData[mapNames[i]][j].length; k++) {
				obj[mapNames[i]][j][k] = new Object();
				obj[mapNames[i]][j][k] = allMapData[mapNames[i]][j][k];
			}
		}
	}
	var objTxt = JSON.stringify(obj);
	document.forms['update_map_data'].elements['all_map_data'].value = objTxt;
	document.forms['copy_map_data'].elements['all_map_data'].value = objTxt;
}

var isNormal = true; //ノートPC
function switchCanvasSize() {
    if (isNormal) {
        document.getElementById('mapContainer').style.width = 2000 + 'px';
        document.getElementById('mapContainer').style.height = 1300 + 'px';
        isNormal = false;
    } else {
        document.getElementById('mapContainer').style.width = 480 + 'px';
        document.getElementById('mapContainer').style.height = 480 + 'px';
        isNormal = true;
    }
}

function confirmDelMap(e) {

	var res = confirm('マップを削除します。\nよろしいですか？');
	if (!res) {
		e.preventDefault();
		return;
	}
}

