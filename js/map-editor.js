//map-editor.phpの動的部分を担当する

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下プロパティ   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//================================ 各種変数 ===============================================//
//戻る用配列
var backArray = [];
//進む用配列
var forwardArray = [];
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
//マップ行数
var mapRowNum = 15;
//マップ列数
var mapColNum = 15;
//マップフォーカススタート位置
var startX = -1;
var startY = -1;

//================================ 各種エレメント ===============================================//
//編集時コンテナ
var editContainer = document.getElementById('editContainer');
//オプション
var option = document.getElementsByClassName('option');
//現在モード要素
var currentModeElement = document.getElementsByClassName('mode-on');
//戻る
var back = document.getElementById('back');
//戻るダミー
var backDummy = document.getElementById('backDummy');
//進む
var forward = document.getElementById('forward');
//進むダミー
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
var addRow = document.getElementById('addRow');
//一列増やす
var addCol = document.getElementById('addCol');
//一行減らす
var delRow = document.getElementById('delRow');
//一列減らす
var delCol = document.getElementById('delCol');

//マップステータス
var mapStatus = document.getElementById('mapStatus');

//現在マップチップ
var currentMapChip = document.getElementById('currentMapChip');
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
//この内容で保存ボタン
var saveMapData = document.getElementById('save-map-data');

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下イベント   ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', setDefault, false);
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
shiftAbove.addEventListener('click', function () {shiftCanvas('above');}, false);
shiftBelow.addEventListener('click', function () {shiftCanvas('below');}, false);
addRow.addEventListener('click', function () {setMap('row','add');}, false);
addCol.addEventListener('click', function () {setMap('col','add');}, false);
delRow.addEventListener('click', function () {setMap('row','del');}, false);
delCol.addEventListener('click', function () {setMap('col','del');}, false);
previewLink.addEventListener('click', showPreview, false);
rewrite.addEventListener('click', doRewrite, false);
DlLink.addEventListener('click', downloadCanvas, false);
saveMapData.addEventListener('click', saveMapDataToSever, false);


///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////　　以下ファンクション   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//デフォルト値設定
function setDefault() {
	setMap();
	setArrayMaptipType('load');
	setCurrentMode();
}

//現在のマップチップを表示する。
//マップチップタイプもセットする。
//マップチップの縦横も取得する
function setCurrentMapChip(evt) {
	//クリックしたチップのurl取得
	currentMapChip.src = evt.target.src;
	//クリックしたチップのタイプ取得
	var currentMapChipTypeId = evt.target.parentNode.parentNode.id;
	switch (currentMapChipTypeId) {
		case 'characterIconContainer':
			//ドラッグフラグ変更
			currentMapChipType = 1;
			break;

		case 'mapIconContainer':
			//ドラッグフラグ変更
			currentMapChipType = 2;
			break;

		case 'mapPassIconContainer':
			//ドラッグフラグ変更
			currentMapChipType = 3;
			break;

		case 'toolIconContainer':
			//ドラッグフラグ変更
			currentMapChipType = 4;
			break;

		case 'buildingIconContainer':
			//ドラッグフラグ変更
			currentMapChipType = 5;
			break;
	}
	//マップチップの縦横（マップチップ数）を取得する、画面にも表示する
	currentMapChipRowNum = currentMapChip.naturalHeight/32;
	currentMapChipColNum = currentMapChip.naturalWidth/32;
	var mapSizeTxt = ' (' + currentMapChipRowNum + '×'　+ currentMapChipColNum + 'マス)';
	currentMapChipSize.innerText = mapSizeTxt;
}

//マップを表示する
function setMap(direction, mode) {
	//マップを退避
	var evacuateMap = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength);
	if (direction == 'row') {
        if (mode == 'add') {
			//一行増やす
			mapRowNum++;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
			setArrayMaptipType('add', 'row');
        } else if (mode == 'del') {
			//一行減らす
			if (mapRowNum == 1) {
				return;
			}
			mapRowNum--;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
			setArrayMaptipType('del', 'row');
        } else {
			//何もしない
        }
    } else if (direction == 'col') {
        if (mode == 'add') {
			//一列増やす
			mapColNum++;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
			setArrayMaptipType('add', 'col');
        } else if (mode == 'del') {
			//一列減らす
			if (mapColNum == 1) {
				return;
			}
			mapColNum--;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
			setArrayMaptipType('del', 'col');
        } else {
            //何もしない
        }
    } else {
		//何でもない時（初期表示）
		mapCanvas.setAttribute('height', mapRowNum*mapLength);
		mapCanvas.setAttribute('width', mapColNum*mapLength);
	}
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

//マップを一動作前の状態に戻す
function doBack() {
	//戻るよう配列の最後（最新）のデータを、進む用配列に退避
	var lastData = backArray[backArray.length-1];
	backArray.pop();
	forwardArray.push(lastData);
	//マップをクリア
	mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
	//一個前（だった）の戻る用配列のcanvasを表示
	if (backArray.length > 0) {
		var preCanvas = backArray[backArray.length-1];
		mapContext.putImageData(preCanvas,0,0);
	} else {
		//もう戻れない場合は何もせず、戻るを非活性に
		back.style.display = "none";
		backDummy.style.display = "inline";
	}
	if (forwardArray.length > 0) {
		forwardDummy.style.display = "none";
		forward.style.display = "inline";
	}
}

//マップの状態を戻したものを一個進める
function doForward() {
	//進めるよう配列から、戻るよう配列に戻す
	var lastData = forwardArray[forwardArray.length-1];
	forwardArray.pop();
	backArray.push(lastData);
	back.style.display = "inline";
	backDummy.style.display = "none";
	//マップをクリア
	mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
	//最新の戻る用配列のcanvasを表示
	var newCanvas = backArray[backArray.length-1];
	mapContext.putImageData(newCanvas,0,0);
	//進む配列がなくなった段階で進むを非活性に
	if (forwardArray.length == 0) {
		forwardDummy.style.display = "inline";
		forward.style.display = "none";
	}
}

//戻る進むを更新する
function updataBackForward() {
		//進む配列初期化
		forwardArray = [];
		forward.style.display = "none";
		forwardDummy.style.display = "inline";
		//戻る用配列更新
		backArray.push(mapContext.getImageData(0,0,mapColNum*mapLength,mapRowNum*mapLength));
		//戻るを活性化
		backDummy.style.display = "none";
		back.style.display = "inline";
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
		setArrayMaptipType('shift', direction);
	} else if (direction == 'right') {
	//右シフト
		var rightLine = mapContext.getImageData(mapColNum*mapLength-mapLength, 0, mapLength, mapRowNum*mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength-mapLength, mapRowNum*mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(rightLine, 0, 0);
		mapContext.putImageData(other, mapLength, 0);
		setArrayMaptipType('shift', direction);
	} else if (direction == 'above') {
	//上シフト
		var aboveLine = mapContext.getImageData(0, 0, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, mapLength, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(aboveLine, 0, mapRowNum*mapLength-mapLength);
		mapContext.putImageData(other, 0, 0);
		setArrayMaptipType('shift', direction);
	} else if (direction == 'below') {
	//下シフト
		var belowLine = mapContext.getImageData(0, mapRowNum*mapLength-mapLength, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(belowLine, 0, 0);
		mapContext.putImageData(other, 0, mapLength);
		setArrayMaptipType('shift', direction);
	} else {
		//何もしない
	}
	//戻る進むを更新
	updataBackForward();
}

//ドラッグフラグをセットする
function setDraggingFlg (bool) {
	draggingFlg = bool;
	// var currentModeId = currentModeElement[0].id;
	if (bool == false) {
		//戻る進むを更新する
		updataBackForward();
		//スタート位置を初期化
		startX = -1;
		startY = -1;
	}
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

    	if (currentModeId == 'put') {
        	//現在チップをマップに表示
			mapContext.drawImage(currentMapChip, mapLength*startX, mapLength*startY);
			//マップチップ属性を更新
			//マップチップの縦横分更新
			for (i=0; i<currentMapChipRowNum; i++) {
				for (j=0; j<currentMapChipColNum; j++) {
					arrayMaptipType[startY+i][startX+j] = currentMapChipType;
				}
			}
    	} else if (currentModeId == 'delete') {
			//マップチップ消去
			mapContext.clearRect(mapLength*startX, mapLength*startY, mapLength, mapLength);
			//マップチップ属性を更新（削除）
			arrayMaptipType[startY][startX] = 0;
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

//マップチップ属性配列をセットする
function setArrayMaptipType (mode, direction) {
	if (mode == 'load') {
		//マップチップ属性デフォルトセット
		for (var i=0; i<mapRowNum; i++) {
			arrayMaptipType[i] = [];
			for (var j=0; j<mapColNum; j++) {
				arrayMaptipType[i][j] = 0;
			}
		}
	} else if (mode == 'add') {
		if (direction == 'row') {
			arrayMaptipType[mapRowNum-1] = [];
			for (var i=0; i<mapColNum; i++) {
				arrayMaptipType[mapRowNum-1][i] = 0;
			}
		} else if (direction == 'col') {
			for (var i=0; i<mapRowNum; i++) {
				arrayMaptipType[i][mapColNum-1] = 0;
			}
		} else {

		}
		
	} else if (mode == 'del') {
		if (direction == 'row') {
			arrayMaptipType.pop();
		} else if (direction == 'col') {
			for (var i=0; i<mapRowNum; i++) {
				arrayMaptipType[i].pop();
			}
		} else {

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

		} else if (direction == 'above') {
			//一番上のマップチップの値
			var aboveSideTipValue;
			for (var i=0; i<mapColNum; i++) {
				for (var j=0; j<mapRowNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番上の列のチップの値を取得しておく
						aboveSideTipValue = arrayMaptipType[j][i];
						continue;
					}
					arrayMaptipType[j-1][i] = arrayMaptipType[j][i];
				}
				//一行ループが終わったら、最初に確保した一番右の値を一番下の値に代入
				arrayMaptipType[mapRowNum-1][i] = aboveSideTipValue;
			}

		} else if (direction == 'below') {
			//一番上のマップチップの値
			var belowSideTipValue;
			for (var i=0; i<mapColNum; i++) {
				for (var j=0; j<mapRowNum; j++) {
					if (j==0) {
						//一列目の時だけ、あらかじめ一番下の列のチップの値を取得しておく
						belowSideTipValue = arrayMaptipType[mapRowNum-1][i];
						continue;
					}
					arrayMaptipType[mapRowNum-j][i] = arrayMaptipType[mapRowNum-j-1][i];
				}
				//一行ループが終わったら、最初に確保した一番下の値を一番上の値に代入
				arrayMaptipType[0][i] = belowSideTipValue;
			}

		} else {

		}
	}
}

//マップチップ属性をjsonにして保存する
function savaMaptipTypeAsJson() {
	var obj = new Object();
	for (var i=0; i<mapRowNum; i++) {
		obj[i] = new Object();
		for (var j=0; j<mapColNum; j++) {
			obj[i][j] = Object();
			obj[i][j]['maptipType'] = arrayMaptipType[i][j];
		}
	}
	var objTxt = JSON.stringify(obj);
	document.forms['map_data'].elements['map_obj_data'].value = objTxt;
}

//画像を保存
function saveMaptip() {
	var data = mapCanvas.toDataURL("image/png");
	data = data.replace("data:image/png;base64,", "");
	document.forms['map_data'].elements['map_image_data'].value = data;
}

//プロジェクトファイルのデータ（デフォルト)作成
function setProjectData(newProjectName) {
	var obj = new Object();
	obj['prjName'] = newProjectName;
	obj['startMap'] = 'null';
	obj['startPosX'] = 'null';
	obj['startPosY'] = 'null';
	var objTxt = JSON.stringify(obj);
	document.forms['map_data'].elements['project_data'].value = objTxt;
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
		if (MapDataForm.oldProjectName.children.length == 0){
			alert('既存プロジェクトがありません');
			error = true;	
		} else if (MapDataForm.oldProjectName.disabled) {
			MapDataForm.oldProjectName.disabled = false;
		} else {
			MapDataForm.newProjectName.disabled = true;	
			oldProjectName = MapDataForm.oldProjectName.value;
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
			MapDataForm.oldProjectName.disabled = true;
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
			savaMaptipTypeAsJson();
			saveMaptip();
			setProjectData(newProjectName);
			MapDataForm.submit();
		} else {
			MapDataForm.oldProjectName.disabled = false;
			MapDataForm.newProjectName.disabled = false;
		}
	}
}


