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

//１マップ大きさ
var mapLength = 32;
//マップ行数
var mapRowNum = 15;
//マップ列数
var mapColNum = 15;
//マップフォーカススタート位置
var startX;
var startY;

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

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////　　以下ファンクション   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//デフォルト値設定
function setDefault() {
    setMap();
    setCurrentMode();
}

//現在のマップチップを表示する
function setCurrentMapChip(evt) {
    currentMapChip.src = evt.target.src;
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
        } else if (mode == 'del') {
			//一行減らす
			if (mapRowNum == 1) {
				return;
			}
			mapRowNum--;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
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
        } else if (mode == 'del') {
			//一列減らす
			if (mapColNum == 1) {
				return;
			}
			mapColNum--;
			mapCanvas.setAttribute('height', mapRowNum*mapLength);
			mapCanvas.setAttribute('width', mapColNum*mapLength);
			mapContext.putImageData(evacuateMap, 0, 0);
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
	} else if (direction == 'right') {
	//右シフト
		var rightLine = mapContext.getImageData(mapColNum*mapLength-mapLength, 0, mapLength, mapRowNum*mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength-mapLength, mapRowNum*mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(rightLine, 0, 0);
		mapContext.putImageData(other, mapLength, 0);
	} else if (direction == 'above') {
	//上シフト
		var aboveLine = mapContext.getImageData(0, 0, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, mapLength, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(aboveLine, 0, mapRowNum*mapLength-mapLength);
		mapContext.putImageData(other, 0, 0);
	} else if (direction == 'below') {
	//下シフト
		var belowLine = mapContext.getImageData(0, mapRowNum*mapLength-mapLength, mapColNum*mapLength, mapLength);
		var other = mapContext.getImageData(0, 0, mapColNum*mapLength, mapRowNum*mapLength-mapLength);
		mapContext.clearRect(0,0,mapColNum*mapLength,mapRowNum*mapLength);
		mapContext.putImageData(belowLine, 0, 0);
		mapContext.putImageData(other, 0, mapLength);
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
		updataBackForward();
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

	//スタート位置(マップごとの)
	startX = Math.floor(x/mapLength);
    startY = Math.floor(y/mapLength);

    //現在モードid取得
	var currentModeId = currentModeElement[0].id;

    if (currentModeId == 'put') {
        //現在チップをマップに表示
        mapContext.drawImage(currentMapChip, mapLength*startX, mapLength*startY);
    } else if (currentModeId == 'delete') {
		mapContext.clearRect(mapLength*startX, mapLength*startY, mapLength, mapLength);
		//現在チップをマップに表示
    } else if (currentModeId == '') {

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


