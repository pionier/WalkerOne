//==================================================================================
//	WalkerOne	--- Realtime 4D CG
//	2017/05/24	by pionier
//	http://www7b.biglobe.ne.jp/~fdw
//==================================================================================

//============================================================
//	OnLoad
//============================================================

function phoenixGr(){
	"use strict";
	var cnvs = document.getElementById('canvas'),
		cntrls = {},
		gl = {},
		views = {},
		light00 = {},
		triangleShader = {},
		TriBuffer = {},
		TRI_BUFFER_SIZE = 4096,
		PhoenixHead_SCALE = 0.05,
		PhoenixBody_SCALE = 0.2,
		PhoenixFoot_SCALE = 0.2,
		Phoenix_OffsY = 0,
		Phoenix_OffsH = 3,
		EquinoxFloor = {},
		PhoenixHead = {},
		PhoenixBody = {},
		PhoenixFoot = [],
		PhoenixRotate = [ 0,0,0,0,0,Math.PI ],
		keyStatus = [ false, false, false, false, false, false ],
		SIGHT_LENGTH = 3,
		SIGHT_HEIGHT = 2,
		ROT_RATE = 0.02,
		VELOCITY = 0.05,
		Roller = {},
		modelMatrix		= mat4.identity(mat4.create()),
		viewMatrix		= mat4.identity(mat4.create()),
		eyeMatrix		= mat4.identity(mat4.create()),
		projMatrix		= mat4.identity(mat4.create()),
		vepMatrix		= mat4.identity(mat4.create()),
		mvpMatrix		= mat4.identity(mat4.create()),
		invMatrix		= mat4.identity(mat4.create()),
		texMatrix		= mat4.identity(mat4.create()),
		lgtMatrix		= mat4.identity(mat4.create()),
		dvMatrix		= mat4.identity(mat4.create()),
		dpMatrix		= mat4.identity(mat4.create()),
		dvpMatrix		= mat4.identity(mat4.create());
	
	var Detector = {

		canvas: !! window.CanvasRenderingContext2D,
		webgl: ( function () {

			try {

				var canvas = document.getElementById( 'canvas_' );
				//return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
				var renderContext = window.WebGLRenderingContext;
				var newGl = canvas.getContext( 'webgl' );
				var oldGl = canvas.getContext( 'experimental-webgl' );
				if( !renderContext ){
					return false;
				}
				if( newGl ){
					return true;
				}
				if( oldGl ){
					return true;
				}
				return false;

			} catch ( e ) {

				return false;

			}

		} )(),
		workers: !! window.Worker,
		fileapi: window.File && window.FileReader && window.FileList && window.Blob,

		getWebGLErrorMessage: function () {

			var element = document.createElement( 'div' );
			element.id = 'webgl-error-message';
			element.style.fontFamily = 'monospace';
			element.style.fontSize = '13px';
			element.style.fontWeight = 'normal';
			element.style.textAlign = 'center';
			element.style.background = '#fff';
			element.style.color = '#000';
			element.style.padding = '1.5em';
			element.style.width = '400px';
			element.style.margin = '5em auto 0';

			if ( ! this.webgl ) {

				element.innerHTML = window.WebGLRenderingContext ? [
					'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
					'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
				].join( '\n' ) : [
					'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
					'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
				].join( '\n' );
			}
			return element;
		},

		addGetWebGLMessage: function ( parameters ) {
			var parent, id, element;
			parameters = parameters || {};
			parent = parameters.parent !== undefined ? parameters.parent : document.body;
			id = parameters.id !== undefined ? parameters.id : 'oldie';
			element = Detector.getWebGLErrorMessage();
			element.id = id;
			parent.appendChild( element );
		}
	};	
	
	if( !Detector.webgl ){
		var warning = Detector.getWebGLErrorMessage();
  		  document.getElementById('container').appendChild(warning);
		return;
	}
	
	try{
		if( !window.WebGLRenderingContext ){
			alert("No GL context.");
			return;
		}
//		cnvs = document.createElement('canvas');
		cnvs = document.getElementById('canvas_');
		gl = cnvs.getContext('webgl') || cnvs.getContext('experimental-webgl');
		if( !gl ){
			alert("Fail to create GL.\r\nPlease use Chrome or FireFox.");
			return;
		}
	}catch( e ){
		alert("Catch: Fail to create GL.\r\nPlease use Chrome or FireFox.");
		return;
	}
	// ブラウザごとのキーイベント名称を取得
	var keyEventNames = getKeyEventNames( fDWL.getBrowserInfo( gl ) );
	
	cnvs.width  = 512;
	cnvs.height = 384;
	cnvs.whickSelected = 0;
	cnvs.isGouraud = false;
	cnvs.shaderChanged = false;
	
/*
		var info = {
			up:		"ArrowUp",
			down:	"ArrowDown",
			left:	"ArrowLeft",
			right:	"ArrowRight",
			shift:	"Shift",
			keyB:	"b",
			keyF:	"f",
			keyG:	"g",
		};
*/
	// キーイベント
	if( window.addEventListener ){
		function KeyDownFunc( evt ){
			"use strict";
			const keyname = evt.key;
			if( keyname === keyEventNames.up ){
				keyStatus[0] = true;
			}
			if( keyname === keyEventNames.down ){
				keyStatus[1] = true;
			}
			if( keyname === keyEventNames.left ){
				keyStatus[2] = true;
			}
			if( keyname === keyEventNames.right ){
				keyStatus[3] = true;
			}
			if( keyname === keyEventNames.shift ){
				keyStatus[4] = true;
			}
			if( keyname === keyEventNames.keyB ){
				keyStatus[5] = true;
			}
/*
			if( keyname === 'ArrowUp' ){
				keyStatus[0] = true;
			}
			if( keyname === 'ArrowDown' ){
				keyStatus[1] = true;
			}
			if( keyname === 'ArrowLeft' ){
				keyStatus[2] = true;
			}
			if( keyname === 'ArrowRight' ){
				keyStatus[3] = true;
			}
			if( keyname === 'Shift' ){
				keyStatus[4] = true;
			}
			if( keyname === 'b' ){
				keyStatus[5] = true;
			}
*/
		}
		
		function KeyUpFunc( evt ){
			"use strict";
			const keyname = evt.key;
			if( keyname === keyEventNames.up ){
				keyStatus[0] = false;
			}
			if( keyname === keyEventNames.down ){
				keyStatus[1] = false;
			}
			if( keyname === keyEventNames.left ){
				keyStatus[2] = false;
			}
			if( keyname === keyEventNames.right ){
				keyStatus[3] = false;
			}
			if( keyname === keyEventNames.shift ){
				keyStatus[4] = false;
			}
			if( keyname === keyEventNames.keyB ){
				keyStatus[5] = false;
			}
			if( keyname === keyEventNames.keyF ){
				cntrls.isGouraud = false;
				cntrls.shaderChanged = true;
			}
			if( keyname === keyEventNames.keyG ){
				cntrls.isGouraud = true;
				cntrls.shaderChanged = true;
			}
/*
			if( keyname === 'ArrowUp' ){
				keyStatus[0] = false;
			}
			if( keyname === 'ArrowDown' ){
				keyStatus[1] = false;
			}
			if( keyname === 'ArrowLeft' ){
				keyStatus[2] = false;
			}
			if( keyname === 'ArrowRight' ){
				keyStatus[3] = false;
			}
			if( keyname === 'Shift' ){
				keyStatus[4] = false;
			}
			if( keyname === 'b' ){
				keyStatus[5] = false;
			}
			if( keyname === 'g' ){
				cntrls.isGouraud = true;
				cntrls.shaderChanged = true;
			}
			if( keyname === 'f' ){
				cntrls.isGouraud = false;
				cntrls.shaderChanged = true;
			}
*/
		}
		// ドキュメントにリスナーを登録
		document.addEventListener( "keydown", KeyDownFunc, false );
		document.addEventListener( "keyup", KeyUpFunc, false );
		
	}
	
	// 移動方向
	let moveXZ = {
		rot:	0,					// 移動方向
		vel:	0.0,				// 移動量
		dif:	[ 0.0, 0.0 ]		// 実移動量(偏差)
	};
	
	// 視線ベクトル
	views = {
		eyePosition:	[ 0,  SIGHT_HEIGHT, SIGHT_LENGTH ],
		lookAt:			[   0, 0, -8 ],
		height:			1
	};
	
	// 光源・環境光関連
	light00 = {
		position:	 [ -1.0, 20.0, 0.0 ],
		upDirection: [ 0.0, 0.0, 1.0 ],
		ambient:	 [ 0.3, 0.3, 0.3, 1.0 ]
	};
	
	// 三角バッファ用シェーダ作成
	triangleShader.prg = createShaderProgram( gl, 'triangle_vs', 'triangle_fs' );
	triangleShader.attrLoc = [
		gl.getAttribLocation( triangleShader.prg, 'aVertexPosition' ),
		gl.getAttribLocation( triangleShader.prg, 'aVertexNormal' ),
		gl.getAttribLocation( triangleShader.prg, 'aVertexColor' )
	];
	triangleShader.attrStride = [ 3, 3, 4 ];
	triangleShader.uniLoc = [
		gl.getUniformLocation( triangleShader.prg, 'mvpMatrix' ),
		gl.getUniformLocation( triangleShader.prg, 'invMatrix' ),
		gl.getUniformLocation( triangleShader.prg, 'lightPosition' ),
		gl.getUniformLocation( triangleShader.prg, 'eyeDirection' ),
		gl.getUniformLocation( triangleShader.prg, 'ambientColor' )
	];
	gl.enableVertexAttribArray( triangleShader.attrLoc[0] );
	gl.enableVertexAttribArray( triangleShader.attrLoc[1] );
	gl.enableVertexAttribArray( triangleShader.attrLoc[2] );
	
	triangleShader.setUniLoc = function( mvpMtx, invMtx, lgtPos, viewDir, color ){
		"use strict";
		var uniLoc = this.uniLoc;
		gl.uniformMatrix4fv( uniLoc[0], false, mvpMtx );
		gl.uniformMatrix4fv( uniLoc[1], false, invMtx );
		gl.uniform3fv( uniLoc[2], light00.position );
		gl.uniform3fv( uniLoc[3], views.eyePosition );
		gl.uniform4fv( uniLoc[4], light00.ambient );
	};
	triangleShader.setProgram = function( param ){
		"use strict";
		var uniLoc = this.uniLoc;
		gl.useProgram( this.prg );
		gl.uniformMatrix4fv( uniLoc[0], false, param[1] );
		gl.uniformMatrix4fv( uniLoc[1], false, param[2] );
		gl.uniform3fv( uniLoc[2], param[3] );
		gl.uniform3fv( uniLoc[3], param[4] );
		gl.uniform4fv( uniLoc[4], param[5] );
	};
	TriBuffer = new fDWL.R4D.TriangleBuffer( gl, TRI_BUFFER_SIZE );
	
/**/
	// 彫像頭部の生成
	PhoenixHead = new fDWL.R4D.Pylams4D(
		gl,
		triangleShader.prg,
		[ 0,Phoenix_OffsY,-5,Phoenix_OffsH ],							// pos
		PhoenixRotate,										// rotate
		[ PhoenixHead_SCALE, PhoenixHead_SCALE, PhoenixHead_SCALE, PhoenixHead_SCALE ],
		[	// vertex
			0, 1,16,  0,   0, 3,17,0,  0,7.7,10,0,  4.6,7.7,10,0,  0,7.7,10,4.6,	// 0-4
			0, 9,15.5,0,   0, 9, 8,0,  6,9, 8,0,  0,9,8,6,							// 5-8
			0,13,15,  0,   0,17, 9,0,  0,5,13,0,  0,6,8,0,							// 9-12
			0,13, 0,  0,   0,11, 2,0,  5,11,2,0,  0,11,2,5,  0,4,2,0,				// 13-17
			0,21, 2,  0,   0,15, 7,0,  1,15,7,0,  0,15,7,1,							// 18-21
			-6,9, 8,  0,   0, 9, 8,-6, -5,11,2,0,  0,11,2,-5,						// 22-25
			-4.6,7.7,10,0, 0,7.7,10,-4.6, -1,15,7,0,  0,15,7,-1						// 26-29
		],
		[	// color
			255,255,255,255, 255, 64, 64,255, 255,127,127,255, 255,191,191,255,		// 白、紅、赤、桃
			127,255,255,255, 255,127,255,255, 255,255,127,255, 255,127,64,255, 		// C, M, Y, 朱
		],
		[	// center
			0,9,8,0, 0,1,7,0, 0,11,2,0, 0,13,19,0, 
		],
		[	// index of pylamids
			// part A
			0,1,26,3, 0,1,3,4, 0,1,26,4, 0,26,3,4, 1,26,3,4,
			1,5,22,7, 1,5,22,8, 1,5,7,8, 1,22,7,8, 5,22,7,8,
			5,9,22,7, 5,9,22,8, 5,9,7,8, 5,22,7,8, 9,22,7,8,
			9,10,22,7, 9,10,22,8, 9,10,7,8, 9,22,7,8, 10,22,7,8,
			11,12,22,7, 11,12,22,8, 11,12,7,8, 11,22,7,8, 12,22,7,8,
			10,13,24,15, 10,13,24,16, 10,13,15,16, 10,24,15,16, 13,24,15,16,
			12,17,24,15, 12,17,24,16, 12,17,15,16, 12,24,15,16, 17,24,15,16,
			10,18,28,20, 10,18,28,21, 10,18,20,21, 10,28,20,21, 18,28,20,21,
			10,15,16,7, 10,15,16,8, 10,15,7,8, 10,16,7,8, 15,16,7,8,
			12,15,16,7, 12,15,16,8, 12,15,7,8, 12,16,7,8, 15,16,7,8,
			// part B
			10,24,25,22, 10,24,25,23, 10,24,22,23, 10,25,22,23, 24,25,22,23,
			12,24,25,22, 12,24,25,23, 12,24,22,23, 12,25,22,23, 24,25,22,23,
			// part C
			0,1,26,3, 0,1,26,27, 0,1,3,27, 0,26,3,27, 1,26,3,27,
			1,5,22,7, 1,5,22,23, 1,5,7,23, 1,22,7,23, 5,22,7,23,
			5,9,22,7, 5,9,22,23, 5,9,7,23, 5,22,7,23, 9,22,7,23,
			9,10,22,7, 9,10,22,23, 9,10,7,23, 9,22,7,23, 10,22,7,23,
			11,12,22,7, 11,12,22,23, 11,12,7,23, 11,22,7,23, 12,22,7,23,
			10,13,24,15, 10,13,24,25, 10,13,15,25, 10,24,15,25, 13,24,15,25,
			12,17,24,15, 12,17,24,25, 12,17,15,25, 12,24,15,25, 17,24,15,25,
			10,18,28,20, 10,18,28,29, 10,18,20,29, 10,28,20,29, 18,28,20,29,
			10,15,25, 7, 10,15,25,23, 10,15, 7,23, 10,25, 7,23, 15,25, 7,23,
			12,15,25, 7, 12,15,25,23, 12,15, 7,23, 12,25, 7,23, 15,25, 7,23,
			// part D
			10,24,16,22, 10,24,16, 8, 10,24,22, 8, 10,16,22, 8, 24,16,22, 8,
			12,24,16,22, 12,24,16, 8, 12,24,22, 8, 12,16,22, 8, 24,16,22, 8
		],
		[	// chrnIdx: 各五胞体の構成頂点index
			// part A
			0,1,26,3,4, 1,5,22,7,8, 5,9,22,7,8, 9,10,22,7,8, 11,12,22,7,8,
			10,13,24,15,16, 12,17,24,15,16, 10,18,28,20,21,
			10,15,16,7,8, 12,15,16,7,8,
			// part B
			10,24,25,22,23, 12,24,25,22,23,
			// part C
			0,1,26,3,27, 1,5,22,7,23, 5,9,22,7,23, 9,10,22,7,23, 11,12,22,7,23,
			10,13,24,15,25, 12,17,24,15,25, 10,18,28,20,29,
			10,15,25,7,23, 12,15,25,7,23,
			// part D
 			10,24,16,22,8, 12,24,16,22,8
		],
		[	// centIdx
			1,1,1,3,1, 1,1,1,3,1, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			2,2,2,2,2, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			1,1,1,3,1, 1,1,1,3,1, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			2,2,2,2,2, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
		],
		[	// color index of pylamid
			6,6,6,6,6, 6,6,6,6,6,
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			7,7,7,7,7, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			6,6,6,6,6, 6,6,6,6,6,
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			7,7,7,7,7, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
		],
		[ 0,2.2,0.9,0 ],							// offs: vertex生成時位置オフセット
		[ 0.0, -Math.PI/4, 0.0, 0.0, 0.0, 0.0 ]		// rot:  vertex生成時回転
	);
	// シェーディングルーチン選択
	PhoenixHead.setTriangle = PhoenixHead.setTriangleFlat;
//	PhoenixHead.setTriangle = PhoenixHead.setTriangleGouraud;
	PhoenixHead.getNormal = PhoenixHead.getNormalVertex;
	PhoenixHead.getColor = PhoenixHead.getColorPlane;
	// 初期化変換
	PhoenixHead.transform();
	PhoenixHead.setTriBuffer( TriBuffer );
/**/
	
	// 彫像胴部の生成
	PhoenixBody = new fDWL.R4D.Pylams4D(
		gl,
		triangleShader.prg,
		[ 0,Phoenix_OffsY,-5,Phoenix_OffsH ],							// pos
		PhoenixRotate,										// rotate
		[ PhoenixBody_SCALE, PhoenixBody_SCALE, PhoenixBody_SCALE, PhoenixBody_SCALE ],
		[	// vertex
			0,14,22,0,  0,12,14,0,  0,8,13,0,  4,8,13,0,  0,8,13,4, 			// 0-4
			0,5,15,0,   3,5,15,0,   0,5,15,3,  0,4,16,0,  0,2,6,0,				// 5-9
			0,1.6,4,0,  0,1.2,4,0,  2,0,0,0,   -4,8,13,0, 0,8,13,-4, 			// 10-14
			-3,5,15,0,  0,5,15,-3,  0,0,0,2,   -2,0,0,0,  0,0,0,-2,				// 15-19
			0,10,16,0,  0,10,14,0,  											// 20-21
			0,9,14,2,   2,9,14,0,   0,9,14,-2,  -2,9,14,0,						// 22-25
			12,15,16,0, 0,15,16,12, -12,15,16,0, 0,15,16,-12,					// 26-29:wingtop
			0,2.2,7,0,															// 30:tail
			0,6,14,0,   1,6,16,0,   2,6,14,0,   0,6,16,2,   2,2,13,0,			// 31-35:legL
			0,6,14,0,  -1,6,16,0,  -2,6,14,0,   0,6,16,-2, -2,2,13,0,			// 36-40:legR
			0,6,14,0,   0,6,16,1,   0,6,14,2,   2,6,16,0,   0,2,13,2,			// 41-45:legHL
			0,6,14,0,   0,6,16,-1,  0,6,14,-2, -2,6,16,0,   0,2,13,-2,			// 46-50:legHR
			9.6,14,15.6,0, 9.6,13.6,15.3,0, 9.6,13.8,15.2,0.4, 16,13,6,0, 		// 51-54:1st featherL
			-9.6,14,15.6,0, -9.6,13.6,15.3,0, -9.6,13.8,15.2,0.4, -16,13,6,0, 	// 55-58:1st featherR
			0,14,15.6,9.6, 0,13.6,15.3,9.6, 0.4,13.8,15.2,9.6, 0,13,6,16, 		// 59-62:1st featherHL
			0,14,15.6,-9.6, 0,13.6,15.3,-9.6, 0.4,13.8,15.2,-9.6, 0,13,6,-16, 	// 63-66:1st featherHR
			13,9,2,0, 9.6,14,15.6,0, 7.2,13,15.2,0, 7.2,12.2,14.8,0, 7.2,12.6,15.2,0.8, 		// 67-71:2nd ftrL
			-13,9,2,0, -9.6,14,15.6,0, -7.2,13,15.2,0, -7.2,12.2,14.8,0, -7.2,12.6,15.2,0.8, 	// 72-76:2nd ftrR
			0,9,2, 13, 0,14,15.6, 9.6, 0,13,15.2, 7.2, 0,12.2,14.8, 7.2, 0.8,12.6,15.2,7.2, 	// 77-81:2nd ftrHL
			0,9,2,-13, 0,14,15.6,-9.6, 0,13,15.2,-7.2, 0,12.2,14.8,-7.2, 0.8,12.6,15.2,-7.2, 	// 82-86:2nd ftrHR
			10,7,5,0, 7.2,13,15.2,0, 5.0,12,14.8,0, 5.0,10.8,14.2,0, 5.0,11.4,14.8,1.2, 		// 87-91:3rd ftrL
			-10,7,5,0, -7.2,13,15.2,0, -5.0,12,14.8,0, -5.0,10.8,14.2,0, -5.0,11.4,14.8,1.2, 	// 92-96:3rd ftrR
			0,7,5,10, 0,13,15.2,7.2, 0,12,14.8,5.0, 0,10.8,14.2,5.0, 1.2,11.4,14.8,5.0, 		// 97-101:3rd ftrHL
			0,7,5,-10, 0,13,15.2,-7.2, 0,12,14.8,-5.0, 0,10.8,14.2,-5.0, -1.2,11.4,14.8,-5.0, 	// 102-106:3rd ftrHL
			 7,4,8,0,  5.0,12,14.8,0,  3.0,11,14.2,0,  3.0,10,14,0,  3.0,10.2,14.2,1.6, 		// 107-111:4th ftrL
			-7,4,8,0, -5.0,12,14.8,0, -3.0,11,14.2,0, -3.0,10,14,0, -3.0,10.2,14.2,1.6, 		// 112-116:4th ftrR
			0,4,8, 7, 0,12,14.8, 5.0, 0,11,14.2, 3.0, 0,10,14, 3.0,  1.6,10.2,14.2, 3.0, 		// 117-121:4th ftrHL
			0,4,8,-7, 0,12,14.8,-5.0, 0,11,14.2,-3.0, 0,10,14,-3.0, -1.6,10.2,14.2,-3.0, 		// 122-126:4th ftrHR
		],
		[	// color
			255,255,255,255, 255, 64, 64,255, 255,127,127,255, 255,191,191,255,		// 白、紅、赤、桃
			127,255,255,255, 255,127,255,255, 255,255,127,255, 255,127,64,255, 		// C, M, Y, 朱
		],
		[	// center
			0,8,14,0, 11.36,13.88,13.62,0.08, -11.36,13.88,13.62,0.08, 				// main,fthr1L, fthr1R
		],
		[	// index of pylamids
			0, 1, 3,13, 0, 1, 3, 4, 0, 1,13, 4, 0, 3,13, 4,  1, 3,13, 4, 
			0, 1, 3,13, 0, 1, 3,14, 0, 1,13,14, 0, 3,13,14,  1, 3,13,14, 
			0, 3, 4, 6, 0, 3, 4, 7, 0, 3, 6, 7, 0, 4, 6, 7,  3, 4, 6, 7, 
			0, 3,14, 6, 0, 3,14,16, 0, 3, 6,16, 0,14, 6,16,  3,14, 6,16, 
			0,13, 4,15, 0,13, 4, 7, 0,13,15, 7, 0, 4,15, 7, 13, 4,15, 7, 
			0,13,14,15, 0,13,14,16, 0,13,15,16, 0,14,15,16, 13,14,15,16, 
			0, 8, 6,15, 0, 8, 6, 7, 0, 8,15, 7, 0, 6,15, 7,  8, 6,15, 7, 
			0, 8, 6,15, 0, 8, 6,16, 0, 8,15,16, 0, 6,15,16,  8, 6,15,16, 
			9, 1, 3,13, 9, 1, 3, 4, 9, 1,13, 4, 9, 3,13, 4,  1, 3,13, 4, 
			9, 1, 3,13, 9, 1, 3,14, 9, 1,13,14, 9, 3,13,14,  1, 3,13,14, 
			9, 3, 4, 6, 9, 3, 4, 7, 9, 3, 6, 7, 9, 4, 6, 7,  3, 4, 6, 7, 
			9, 3,14, 6, 9, 3,14,16, 9, 3, 6,16, 9,14, 6,16,  3,14, 6,16, 
			9,13, 4,15, 9,13, 4, 7, 9,13,15, 7, 9, 4,15, 7, 13, 4,15, 7, 
			9,13,14,15, 9,13,14,16, 9,13,15,16, 9,14,15,16, 13,14,15,16, 
			9, 8, 6,15, 9, 8, 6, 7, 9, 8,15, 7, 9, 6,15, 7,  8, 6,15, 7, 
			9, 8, 6,15, 9, 8, 6,16, 9, 8,15,16, 9, 6,15,16,  8, 6,15,16,
			30,10,11,12, 30,10,11,17, 30,10,12,17, 30,11,12,17, 10,11,12,17, 
			30,10,11,18, 30,10,11,17, 30,10,18,17, 30,11,18,17, 10,11,18,17, 
			30,10,11,12, 30,10,11,19, 30,10,12,19, 30,11,12,19, 10,11,12,19, 
			30,10,11,18, 30,10,11,19, 30,10,18,19, 30,11,18,19, 10,11,18,19, 
			20,21,2,22, 20,21,2,26, 20,21,22,26, 20,2,22,26, 21,2,22,26, 		// wing
			20,21,2,23, 20,21,2,27, 20,21,23,27, 20,2,23,27, 21,2,23,27, 
			20,21,2,24, 20,21,2,28, 20,21,24,28, 20,2,24,28, 21,2,24,28, 
			20,21,2,25, 20,21,2,29, 20,21,25,29, 20,2,25,29, 21,2,25,29, 
			31,32,33,34, 31,32,33,35, 31,32,34,35, 31,33,34,35, 32,33,34,35, 	// leg
			36,37,38,39, 36,37,38,40, 36,37,39,40, 36,38,39,40, 37,38,39,40, 
			41,42,43,44, 41,42,43,45, 41,42,44,45, 41,43,44,45, 42,43,44,45, 
			46,47,48,49, 46,47,48,50, 46,47,49,50, 46,48,49,50, 47,48,49,50, 
			26,51,52,53, 26,51,52,54, 26,51,53,54, 26,52,53,54, 51,52,53,54, 	// feather 1st
			28,55,56,57, 28,55,56,58, 28,55,57,58, 28,56,57,58, 55,56,57,58, 
			27,59,60,61, 27,59,60,62, 27,59,61,62, 27,60,61,62, 59,60,61,62, 
			29,63,64,65, 29,63,64,66, 29,63,65,66, 29,64,65,66, 63,64,65,66, 
			67,68,69,70, 67,68,69,71, 67,68,70,71, 67,69,70,71, 68,69,70,71, 	// feather 2nd
			72,73,74,75, 72,73,74,76, 72,73,75,76, 72,74,75,76, 73,74,75,76, 
			77,78,79,80, 77,78,79,81, 77,78,80,81, 77,79,80,81, 78,79,80,81, 
			82,83,84,85, 82,83,84,86, 82,83,85,86, 82,84,85,86, 83,84,85,86, 
			87,88,89,90, 87,88,89,91, 87,88,90,91, 87,89,90,91, 88,89,90,91, 	// feather 3rd
			92,93,94,95, 92,93,94,96, 92,93,95,96, 92,94,95,96, 93,94,95,96, 
			97,98,99,100, 97,98,99,101, 97,98,100,101, 97,99,100,101, 98,99,100,101, 
			102,103,104,105, 102,103,104,106, 102,103,105,106, 102,104,105,106, 103,104,105,106, 
			107,108,109,110, 107,108,109,111, 107,108,110,111, 107,109,110,111, 108,109,110,111,  	// feather 4th
			112,113,114,115, 112,113,114,116, 112,113,115,116, 112,114,115,116, 113,114,115,116, 
			117,118,119,120, 117,118,119,121, 117,118,120,121, 117,119,120,121, 118,119,120,121, 
			122,123,124,125, 122,123,124,126, 122,123,125,126, 122,124,125,126, 123,124,125,126, 
		],
		[	// chrnIdx: 各五胞体の構成頂点index
			0,1,3,13,4, 0,1,3,13,14, 0,3,4,6,7, 0,3,14,6,16, 0,13,4,15,7, 0,13,14,15,16, 0,8,6,15,7, 0,8,6,15,16, 
			9,1,3,13,4, 9,1,3,13,14, 9,3,4,6,7, 9,3,14,6,16, 9,13,4,15,7, 9,13,14,15,16, 9,8,6,15,7, 9,8,6,15,16, 
			30,10,11,12,17, 30,10,11,18,17, 30,10,11,12,19, 30,10,11,18,19,
			20,21,2,22,26,  20,21,2,23,27,  20,21,2,24,28,  20,21, 2,25,29, 			// WingLhLRhR
			31,32,33,34,35, 36,37,38,39,40, 41,42,43,44,45, 46,47,48,49,50, 			// legLRhLhR
			26,51,52,53,54, 28,55,56,57,58, 27,59,60,61,62, 29,63,64,65,66, 			// feather
			67,68,69,70,71, 72,73,74,75,76, 77,78,79,80,81, 82,83,84,85,86, 
			87,88,89,90,91, 92,93,94,95,96, 97,98,99,100,101, 102,103,104,105,106, 
			107,108,109,110,111, 112,113,114,115,116, 117,118,119,120,121, 122,123,124,125,126, 
		],
		[	// centIdx
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0,
			1,1,1,1,1, 2,2,2,2,2,
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
			0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
		],
		[	// color index of pylamid
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 
			1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 7,7,7,7,7, 7,7,7,7,7, 
			7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 
			7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 
			7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 7,7,7,7,7, 
		],
		[ 0,0.05,-3.4,0 ],							// offs: vertex生成時位置オフセット
		[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]		// rot:  vertex生成時回転
	);
	// シェーディングルーチン選択
	PhoenixBody.setTriangle = PhoenixBody.setTriangleFlat;
//	PhoenixBody.setTriangle = PhoenixHead.setTriangleGouraud;
	PhoenixBody.getNormal = PhoenixBody.getNormalVertex;
	PhoenixBody.getColor = PhoenixBody.getColorPlane;
	// 初期化変換
	PhoenixBody.transform();
	PhoenixBody.setTriBuffer( TriBuffer );
	
/**/	// 彫像脚部の生成
	(function(){
		"use strict";
		var idx = 0,
			pos = [ 0,Phoenix_OffsY,-5,Phoenix_OffsH ],
			//rot = [ 0,0,0,0,0,Math.PI ]
			locZ = -0.8,
			colors = [
				255,255,255,255, 255, 64, 64,255, 255,127,127,255, 80,20,0,255,			// 白、紅、赤、赤茶
				127,255,255,255, 255,127,255,255, 255,255,127,255, 255,127,64,255, 		// C, M, Y, 朱
			],
			centers = [
				0,1,2,0, 0,-1,1,0, 0,-0.5,7,0
			],
			pylamIdx = [
				0,1,2,3, 0,1,2,4, 0,1,3,4, 0,2,3,4, 1,2,3,4, 
				0,1,2,3, 0,1,2,5, 0,1,3,5, 0,2,3,5, 1,2,3,5, 
				6,7,8,9, 6,7,8,10, 6,7,9,10, 6,8,9,10, 7,8,9,10, 
				6,7,8,9, 6,7,8,11, 6,7,9,11, 6,8,9,11, 7,8,9,11, 
				12,13,14,15, 12,13,14,16, 12,13,15,16, 12,14,15,16, 13,14,15,16, 
				12,13,14,15, 12,13,14,17, 12,13,15,17, 12,14,15,17, 13,14,15,17, 
				18,19,20,21, 18,19,20,22, 18,19,21,22, 18,20,21,22, 19,20,21,22, 
				18,19,20,21, 18,19,20,23, 18,19,21,23, 18,20,21,23, 19,20,21,23, 
				24,25,26,27, 24,25,26,28, 24,25,27,28, 24,26,27,28, 25,26,27,28, 
				24,25,26,27, 24,25,26,29, 24,25,27,29, 24,26,27,29, 25,26,27,29, 
				30,31,32,33, 30,31,32,34, 30,31,33,34, 30,32,33,34, 31,32,33,34, 
				30,31,32,33, 30,31,32,35, 30,31,33,35, 30,32,33,35, 31,32,33,35, 
				36,37,38,39, 36,37,38,40, 36,37,39,40, 36,38,39,40, 37,38,39,40, 
				36,37,38,39, 36,37,38,41, 36,37,39,41, 36,38,39,41, 37,38,39,41, 
				42,43,44,45, 42,43,44,46, 42,43,45,46, 42,44,45,46, 43,44,45,46, 
				42,43,44,45, 42,43,44,47, 42,43,45,47, 42,44,45,47, 43,44,45,47, 
				48,49,50,51, 48,49,50,52, 48,49,51,52, 48,50,51,52, 49,50,51,52, 
				48,49,50,51, 48,49,50,53, 48,49,51,53, 48,50,51,53, 49,50,51,53, 
				54,55,56,57, 54,55,56,58, 54,55,57,58, 54,56,57,58, 55,56,57,58, 
				54,55,56,57, 54,55,56,59, 54,55,57,59, 54,56,57,59, 55,56,57,59, 
			],
			chrnIdx = [
				0,1,2,3,4, 0,1,2,3,5, 6,7,8,9,10, 6,7,8,9,11, 
				12,13,14,15,16, 12,13,14,15,17, 18,19,20,21,22, 18,19,20,21,23, 
				24,25,26,27,28, 24,25,26,27,29, 30,31,32,33,34, 30,31,32,33,35, 
				36,37,38,39,40, 36,37,38,39,41, 42,43,44,45,46, 42,43,44,45,47, 
				48,49,50,51,52, 48,49,50,51,53, 54,55,56,57,58, 54,55,56,57,59, 
			],
			centIdx = [
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 1,1,1,1,1, 
				1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 2,2,2,2,2, 2,2,2,2,2, 
				2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 
				2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 
			],
			colorIdx = [
				3,3,3,3,3, 3,3,3,3,3, 3,3,3,3,3, 3,3,3,3,3, 3,3,3,3,3, 
				3,3,3,3,3, 6,6,6,6,6, 6,6,6,6,6, 3,3,3,3,3, 3,3,3,3,3, 
				6,6,6,6,6, 6,6,6,6,6, 3,3,3,3,3, 3,3,3,3,3, 6,6,6,6,6, 
				6,6,6,6,6, 3,3,3,3,3, 3,3,3,3,3, 6,6,6,6,6, 6,6,6,6,6, 
			];
		
		PhoenixFoot[0] = new fDWL.R4D.Pylams4D(
			gl,
			triangleShader.prg,
			pos,		// pos
			PhoenixRotate,		// rotate
			[ PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE ],
			[	// vertex
				0,2,0,0, 0,0,3,0, 0.5,3,0,0, -0.5,3,0,0, 0,3,0,0.5, 0,3,0,-0.5,				// 0-5
				0,0,4,0, 0,3,0,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 6-11
				0,1,2,0, 0,0,1,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 12-17
				0,0,0,0, 0,0.5,2.5,0, 0.5,0,3,0, -0.5,0,3,0, 0,0,3,0.5, 0,0,3,-0.5,			// 18-23
				0,0,3,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 24-29
				0,0,7,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 30-35
				0.6,0,3,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,	// 36-41
				1,0,7,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,		// 42-47
				-0.6,0,3,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 48-53
				-1,0,7,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 54-59
			],
			colors,
			centers,
			pylamIdx,
			chrnIdx,
			centIdx,
			colorIdx,
			[ 0.38,0,locZ,0 ],							// offs: vertex生成時位置オフセット
			[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]		// rot:  vertex生成時回転
		);
		PhoenixFoot[1] = new fDWL.R4D.Pylams4D(
			gl,
			triangleShader.prg,
			pos,		// pos
			PhoenixRotate,		// rotate
			[ PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE ],
			[	// vertex
				0,2,0,0, 0,0,3,0, 0.5,3,0,0, -0.5,3,0,0, 0,3,0,0.5, 0,3,0,-0.5,				// 0-5
				0,0,4,0, 0,3,0,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 6-11
				0,1,2,0, 0,0,1,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 12-17
				0,0,0,0, 0,0.5,2.5,0, 0.5,0,3,0, -0.5,0,3,0, 0,0,3,0.5, 0,0,3,-0.5,			// 18-23
				0,0,3,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 24-29
				0,0,7,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 30-35
				0.6,0,3,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,	// 36-41
				1,0,7,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,		// 42-47
				-0.6,0,3,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 48-53
				-1,0,7,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 54-59
			],
			colors,
			centers,
			pylamIdx,
			chrnIdx,
			centIdx,
			colorIdx,
			[ -0.38,0,locZ,0 ],							// offs: vertex生成時位置オフセット
			[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]		// rot:  vertex生成時回転
		);
		PhoenixFoot[2] = new fDWL.R4D.Pylams4D(
			gl,
			triangleShader.prg,
			pos,		// pos
			PhoenixRotate,		// rotate
			[ PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE ],
			[	// vertex
				0,2,0,0, 0,0,3,0, 0.5,3,0,0, -0.5,3,0,0, 0,3,0,0.5, 0,3,0,-0.5,				// 0-5
				0,0,4,0, 0,3,0,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 6-11
				0,1,2,0, 0,0,1,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 12-17
				0,0,0,0, 0,0.5,2.5,0, 0.5,0,3,0, -0.5,0,3,0, 0,0,3,0.5, 0,0,3,-0.5,			// 18-23
				0,0,3,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 24-29
				0,0,7,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 30-35
				0.6,0,3,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,	// 36-41
				1,0,7,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,		// 42-47
				-0.6,0,3,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 48-53
				-1,0,7,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 54-59
			],
			colors,
			centers,
			pylamIdx,
			chrnIdx,
			centIdx,
			colorIdx,
			[ 0,0,locZ,0.35 ],							// offs: vertex生成時位置オフセット
			[ 0.0, 0.0, 0.0, 0.0, Math.PI/2, 0.0 ]		// rot:  vertex生成時回転
		);
		PhoenixFoot[3] = new fDWL.R4D.Pylams4D(
			gl,
			triangleShader.prg,
			pos,		// pos
			PhoenixRotate,		// rotate
			[ PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE, PhoenixFoot_SCALE ],
			[	// vertex
				0,2,0,0, 0,0,3,0, 0.5,3,0,0, -0.5,3,0,0, 0,3,0,0.5, 0,3,0,-0.5,				// 0-5
				0,0,4,0, 0,3,0,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 6-11
				0,1,2,0, 0,0,1,0,   1,0,3,0,   -1,0,3,0, 0,0,3,1,   0,0,3,-1,				// 12-17
				0,0,0,0, 0,0.5,2.5,0, 0.5,0,3,0, -0.5,0,3,0, 0,0,3,0.5, 0,0,3,-0.5,			// 18-23
				0,0,3,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 24-29
				0,0,7,0, 0,1,5,0, 0.4,0.2,5,0, -0.4,0.2,5,0, 0,0.2,5,0.4, 0,0.2,5,-0.4,		// 30-35
				0.6,0,3,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,	// 36-41
				1,0,7,0, 1,1,5,0, 1.4,0.2,5,0, 0.6,0.2,5,0, 1,0.2,5,0.4, 1,0.2,5,-0.4,		// 42-47
				-0.6,0,3,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 48-53
				-1,0,7,0, -1,1,5,0, -1.4,0.2,5,0, -0.6,0.2,5,0, -1,0.2,5,0.4, -1,0.2,5,-0.4,	// 54-59
			],
			colors,
			centers,
			pylamIdx,
			chrnIdx,
			centIdx,
			colorIdx,
			[ 0,0,locZ,-0.35 ],							// offs: vertex生成時位置オフセット
			[ 0.0, 0.0, 0.0, 0.0, -Math.PI/2, 0.0 ]		// rot:  vertex生成時回転
		);
		// シェーディングルーチン選択
//		PhoenixFoot[0].setTriangle = PhoenixFoot[0].setTriangleGouraud;
		PhoenixFoot[0].setTriangle = PhoenixFoot[0].setTriangleFlat;
		PhoenixFoot[0].getNormal = PhoenixFoot[0].getNormalVertex;
		PhoenixFoot[0].getColor = PhoenixFoot[0].getColorPlane;
//		PhoenixFoot[1].setTriangle = PhoenixFoot[1].setTriangleGouraud;
		PhoenixFoot[1].setTriangle = PhoenixFoot[1].setTriangleFlat;
		PhoenixFoot[1].getNormal = PhoenixFoot[1].getNormalVertex;
		PhoenixFoot[1].getColor = PhoenixFoot[1].getColorPlane;
//		PhoenixFoot[2].setTriangle = PhoenixFoot[2].setTriangleGouraud;
		PhoenixFoot[2].setTriangle = PhoenixFoot[2].setTriangleFlat;
		PhoenixFoot[2].getNormal = PhoenixFoot[2].getNormalVertex;
		PhoenixFoot[2].getColor = PhoenixFoot[2].getColorPlane;
//		PhoenixFoot[3].setTriangle = PhoenixFoot[3].setTriangleGouraud;
		PhoenixFoot[3].setTriangle = PhoenixFoot[3].setTriangleFlat;
		PhoenixFoot[3].getNormal = PhoenixFoot[3].getNormalVertex;
		PhoenixFoot[3].getColor = PhoenixFoot[3].getColorPlane;
		// 初期化変換
		PhoenixFoot[0].transform();
		PhoenixFoot[0].setTriBuffer( TriBuffer );
		PhoenixFoot[1].transform();
		PhoenixFoot[1].setTriBuffer( TriBuffer );
		PhoenixFoot[2].transform();
		PhoenixFoot[2].setTriBuffer( TriBuffer );
		PhoenixFoot[3].transform();
		PhoenixFoot[3].setTriBuffer( TriBuffer );
	}());
/**/

	
	// テクスチャ無し地面
	EquinoxFloor.Data = fDWL.tiledFloor( 1.0, 16, [0.1, 0.1, 0.1, 1.0], [1.0, 1.0, 1.0, 1.0 ] );
	EquinoxFloor.VboList = [
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.p ),
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.n ),
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.c )
	];
	EquinoxFloor.Ibo = fDWL.WGL.createIbo( gl, EquinoxFloor.Data.i );
	
	// 注視点表示
	(function(){
		"use strict";
		var data = [],
			dataType = [ gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN, gl.TRIANGLE_FAN ],
			idx = 0,
			id2 = 0,
			offsY = 0;
		data[0] = fDWL.cylinder( 8, 0.2, 0.5, [ 1.0, 1.0, 1.0, 1.0],  [ 0, 0, 0 ], [ 0, 0, Math.PI/2 ] );
		data[1] = fDWL.corn( 8, 0.2, 0.5, [ 1.0, 1.0, 1.0, 1.0], 1.0, [ 0,  0.1, 0 ], [ 0, 0, Math.PI/2 ] );
		data[2] = fDWL.corn( 8, 0.2, 0.5, [ 1.0, 1.0, 1.0, 1.0], 1.0, [ 0,  0.1, 0 ], [ 0, 0, Math.PI*3/2 ] );
		Roller = new fDWL.Objs3D( gl, [ 0, 0, 0 ], [ 0, 0, 0 ], [ 1, 1, 1 ], data, dataType );
		Roller.height = 0.5;
	}());
	
	// ビューxプロジェクション座標変換行列
	mat4.lookAt( views.eyePosition, views.lookAt, [0, 1, 0], viewMatrix);
	mat4.perspective(45, cnvs.width / cnvs.height, 0.1, 100, projMatrix);
	mat4.multiply(projMatrix, viewMatrix, vepMatrix);
    
	// Depth Test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// cntrls
	cntrls.nbrOfFramesForFps = 0;
	cntrls.prevFrameTimeStamp = Date.now();
	cntrls.fpsCounter = document.getElementById("fps");

	cntrls.eHPos = document.getElementById('H_Pos');
	cntrls.eHPosBox = document.getElementById('H_PosTxt');
	
	cntrls.RotXY = document.getElementById('RotXY');
	cntrls.RotYZ = document.getElementById('RotYZ');
	cntrls.RotYH = document.getElementById('RotYH');
	cntrls.RotZH = document.getElementById('RotZH');
	cntrls.RotXH = document.getElementById('RotXH');
	cntrls.RotXZ = document.getElementById('RotXZ');
	
	cntrls.RotXYTxt = document.getElementById('RotXYTxt');
	cntrls.RotYZTxt = document.getElementById('RotYZTxt');
	cntrls.RotYHTxt = document.getElementById('RotYHTxt');
	cntrls.RotZHTxt = document.getElementById('RotZHTxt');
	cntrls.RotXHTxt = document.getElementById('RotXHTxt');
	cntrls.RotXZTxt = document.getElementById('RotXZTxt');
	
	cntrls.oldHPos = (-100);
	cntrls.oldHPosBox = cntrls.eHPos.value;
	
	cntrls.RotXY.old = cntrls.RotXY.value;
	cntrls.RotYZ.old = cntrls.RotYZ.value;
	cntrls.RotYH.old = cntrls.RotYH.value;
	cntrls.RotZH.old = cntrls.RotZH.value;
	cntrls.RotXH.old = cntrls.RotXH.value;
	cntrls.RotXZ.old = cntrls.RotXZ.value;
	
	cntrls.RotXYTxt.old = cntrls.RotXY.value;
	cntrls.RotYZTxt.old = cntrls.RotYZ.value;
	cntrls.RotYHTxt.old = cntrls.RotYH.value;
	cntrls.RotZHTxt.old = cntrls.RotZH.value;
	cntrls.RotXHTxt.old = cntrls.RotXH.value;
	cntrls.RotXZTxt.old = cntrls.RotXZ.value;
	
	cntrls.radioList = document.getElementsByName("shadeType");
	
	draw();
	
	// 恒常ループ
	function draw(){
		"use strict";
		var	texAndRate = [],
			hPos = 0,
			eyeRad = 0,
			currentTime = 0,
			fldPos = [],
			fldAng = [],
			collisionId = 0;
		
		// 現在のフレーム数を表示
		cntrls.requestId = requestAnimationFrame( draw );
		currentTime = Date.now();
		if( currentTime - cntrls.prevFrameTimeStamp >= 1000 ){
			cntrls.fpsCounter.innerHTML = cntrls.nbrOfFramesForFps;
			cntrls.nbrOfFramesForFps = 0;
			cntrls.prevFrameTimeStamp = currentTime;
		}
		
		// キー入力から移動速度・進行方向・視点位置を修正
		(function(){
			var speed = VELOCITY;
			if( keyStatus[5] ){
				speed *= 2;
			}
			moveXZ.vel = 0.0;
			if( keyStatus[0] ){
				if( keyStatus[4] ){	// shift
					views.height = ( views.height > 3.9 )?4:(views.height+0.1);
				}else{
					moveXZ.vel = speed;
				}
			}
			if( keyStatus[1] ){
				if( keyStatus[4] ){	// shift
					views.height = ( views.height < 0.1 )?0:(views.height-0.1);
				}else{
					moveXZ.vel = -speed;
				}
			}
			if( keyStatus[2] ){
				moveXZ.rot -= ROT_RATE;
				if( moveXZ.rot > Math.PI*2 ){
					moveXZ.rot -= Math.PI*2;
				}
			}
			if( keyStatus[3] ){
				moveXZ.rot += ROT_RATE;
				if( moveXZ.rot < 0 ){
					moveXZ.rot += Math.PI*2;
				}
			}
			// 移動偏差
			var sinRot = Math.sin( moveXZ.rot ),
				cosRot = Math.cos( moveXZ.rot );
			moveXZ.dif[0] = -sinRot*moveXZ.vel;
			moveXZ.dif[1] =  cosRot*moveXZ.vel;
			// 衝突判定による位置調整を行う
			checkCollision( views.lookAt, moveXZ );
			views.lookAt[0] += moveXZ.dif[0];
			views.lookAt[1] = views.height;
			views.lookAt[2] += moveXZ.dif[1];
			// 視点位置
			views.eyePosition[0] = views.lookAt[0] + sinRot*SIGHT_LENGTH;
			views.eyePosition[1] = views.lookAt[1] +        SIGHT_HEIGHT - views.height;
			views.eyePosition[2] = views.lookAt[2] - cosRot*SIGHT_LENGTH;
			
			// 視点行列を算出
			mat4.lookAt( views.eyePosition, views.lookAt, [0, 1, 0], viewMatrix);
			mat4.multiply( projMatrix, viewMatrix, vepMatrix );
		}());
		
		// 入力ボックス：変更適用
		if( cntrls.eHPos.value !== cntrls.oldHPos ){
			cntrls.eHPosBox.value = cntrls.eHPos.value;
		}else
		if( cntrls.eHPosBox.value !== cntrls.oldHPosBox ){
			cntrls.eHPos.value = cntrls.eHPosBox.value;
		}
		if( cntrls.RotXY.old !== cntrls.RotXY.value ){
			cntrls.RotXYTxt.value = cntrls.RotXY.value;
		}else
		if( cntrls.RotXYTxt.old !== cntrls.RotXYTxt.value ){
			cntrls.RotXY.value = cntrls.RotXYTxt.value;
		}
		if( cntrls.RotYZ.old !== cntrls.RotYZ.value ){
			cntrls.RotYZTxt.value = cntrls.RotYZ.value;
		}else
		if( cntrls.RotYZTxt.old !== cntrls.RotYZTxt.value ){
			cntrls.RotYZ.value = cntrls.RotYZTxt.value;
		}
		if( cntrls.RotYH.old !== cntrls.RotYH.value ){
			cntrls.RotYHTxt.value = cntrls.RotYH.value;
		}else
		if( cntrls.RotYHTxt.old !== cntrls.RotYHTxt.value ){
			cntrls.RotYH.value = cntrls.RotYHTxt.value;
		}
		if( cntrls.RotZH.old !== cntrls.RotZH.value ){
			cntrls.RotZHTxt.value = cntrls.RotZH.value;
		}else
		if( cntrls.RotZHTxt.old !== cntrls.RotZHTxt.value ){
			cntrls.RotZH.value = cntrls.RotZHTxt.value;
		}
		if( cntrls.RotXH.old !== cntrls.RotXH.value ){
			cntrls.RotXHTxt.value = cntrls.RotXH.value;
		}else
		if( cntrls.RotXHTxt.old !== cntrls.RotXHTxt.value ){
			cntrls.RotXH.value = cntrls.RotXHTxt.value;
		}
		if( cntrls.RotXZ.old !== cntrls.RotXZ.value ){
			cntrls.RotXZTxt.value = cntrls.RotXZ.value;
		}else
		if( cntrls.RotXZTxt.old !== cntrls.RotXZTxt.value ){
			cntrls.RotXZ.value = cntrls.RotXZTxt.value;
		}
		// ラジオボタン
		if( cntrls.shaderChanged ){
			if( cntrls.isGouraud ){
				cntrls.radioList[0].checked = false;
				cntrls.radioList[1].checked = true;
			}else{
				cntrls.radioList[0].checked = true;
				cntrls.radioList[1].checked = false;
			}
		}else
		if (cntrls.radioList[0].checked) {
			if( cntrls.isGouraud ){
				cntrls.isGouraud = false;
				cntrls.shaderChanged = true;
			}
		}else
		if (cntrls.radioList[1].checked) {
			if( !cntrls.isGouraud ){
				cntrls.isGouraud = true;
				cntrls.shaderChanged = true;
			}
		}
		
		// H軸位置設定
		hPos = cntrls.eHPos.value*(0.01);
		
		// 真４Ｄオブジェクトの更新：非移動時のみ
		if( ( cntrls.RotXY.old !== cntrls.RotXY.value )||
			( cntrls.RotYZ.old !== cntrls.RotYZ.value )||
			( cntrls.RotYH.old !== cntrls.RotYH.value )||
			( cntrls.RotZH.old !== cntrls.RotZH.value )||
			( cntrls.RotXH.old !== cntrls.RotXH.value )||
			( cntrls.RotXZ.old !== cntrls.RotXZ.value )||
			( cntrls.shaderChanged === true )
		){
			cntrls.oldHPos = (-100);
		}
		// 現在値記録
		cntrls.oldHPosBox = cntrls.eHPosBox.value;
		cntrls.RotXY.old = cntrls.RotXY.value;
		cntrls.RotYZ.old = cntrls.RotYZ.value;
		cntrls.RotYH.old = cntrls.RotYH.value;
		cntrls.RotZH.old = cntrls.RotZH.value;
		cntrls.RotXH.old = cntrls.RotXH.value;
		cntrls.RotXZ.old = cntrls.RotXZ.value;
		cntrls.RotXYTxt.old = cntrls.RotXYTxt.value;
		cntrls.RotYZTxt.old = cntrls.RotYZTxt.value;
		cntrls.RotYHTxt.old = cntrls.RotYHTxt.value;
		cntrls.RotZHTxt.old = cntrls.RotZHTxt.value;
		cntrls.RotXHTxt.old = cntrls.RotXHTxt.value;
		cntrls.RotXZTxt.old = cntrls.RotXZTxt.value;
		if(( moveXZ.vel != 0 )||( cntrls.oldHPos != cntrls.eHPos.value )){
			
			// 八胞体切断体の作成
			TriBuffer.initialize( triangleShader );
			
			if( cntrls.shaderChanged ){
				cntrls.shaderChanged = false;
				if( cntrls.isGouraud ){
					PhoenixHead.setTriangle = PhoenixHead.setTriangleGouraud;
					PhoenixBody.setTriangle = PhoenixBody.setTriangleGouraud;
					PhoenixFoot[0].setTriangle = PhoenixFoot[0].setTriangleGouraud;
					PhoenixFoot[1].setTriangle = PhoenixFoot[1].setTriangleGouraud;
					PhoenixFoot[2].setTriangle = PhoenixFoot[2].setTriangleGouraud;
					PhoenixFoot[3].setTriangle = PhoenixFoot[3].setTriangleGouraud;
				}else{
					PhoenixHead.setTriangle = PhoenixHead.setTriangleFlat;
					PhoenixBody.setTriangle = PhoenixBody.setTriangleFlat;
					PhoenixFoot[0].setTriangle = PhoenixFoot[0].setTriangleFlat;
					PhoenixFoot[1].setTriangle = PhoenixFoot[1].setTriangleFlat;
					PhoenixFoot[2].setTriangle = PhoenixFoot[2].setTriangleFlat;
					PhoenixFoot[3].setTriangle = PhoenixFoot[3].setTriangleFlat;
				}
			}
			
/**/			// 彫像：頭部
			PhoenixHead.setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixHead.transform();
			PhoenixHead.dividePylams( hPos );
/**/
			
/**/			// 彫像：胴部
			PhoenixBody.setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixBody.transform();
			PhoenixBody.dividePylams( hPos );
			
/**/			// 彫像：脚部
			PhoenixFoot[0].setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixFoot[0].transform();
			PhoenixFoot[0].dividePylams( hPos );
			PhoenixFoot[1].setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixFoot[1].transform();
			PhoenixFoot[1].dividePylams( hPos );
			PhoenixFoot[2].setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixFoot[2].transform();
			PhoenixFoot[2].dividePylams( hPos );
			PhoenixFoot[3].setRotate( [ cntrls.RotXY.value*(0.02), cntrls.RotYZ.value*(0.02), cntrls.RotYH.value*(0.02), cntrls.RotZH.value*(0.02), cntrls.RotXH.value*(0.02), cntrls.RotXZ.value*(0.02) ] );
			PhoenixFoot[3].transform();
			PhoenixFoot[3].dividePylams( hPos );
/**/
		}
		// 現hPos値の記録
		cntrls.oldHPos = cntrls.eHPos.value;
		
		// canvasを初期化
		gl.clearColor(0.8, 0.8, 1.0, 1.0);
		gl.clearDepth( 1.0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		
		// ビューポート調整
		gl.viewport( 0.0, 0.0, cnvs.width, cnvs.height );
		
		gl.enable(gl.CULL_FACE);
		
		// 地面
		(function(){
			"use strict";
			var vbo = [],
				attL = [],
				attS = [];
			mat4.identity( modelMatrix );
			mat4.translate( modelMatrix, [0.0, 0.0, -5.0], modelMatrix );
			mat4.multiply( vepMatrix, modelMatrix, mvpMatrix );
			mat4.inverse( modelMatrix, invMatrix);
			triangleShader.setProgram( [ modelMatrix, mvpMatrix, invMatrix, light00.position, views.eyePosition, light00.ambient ] );
			
			vbo = EquinoxFloor.VboList;
			attL = triangleShader.attrLoc;
			attS = triangleShader.attrStride;
			for( var idx in vbo ){
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo[idx]);
				gl.enableVertexAttribArray(attL[idx]);
				gl.vertexAttribPointer(attL[idx], attS[idx], gl.FLOAT, false, 0, 0);
			}
		}());
		
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, EquinoxFloor.Ibo );
		gl.drawElements( gl.TRIANGLES, EquinoxFloor.Data.i.length, gl.UNSIGNED_SHORT, 0 );
		
		// 注視点位置表示
		(function(){
			"use strict";
			var rotate = [];
			Roller.setPos( [ views.lookAt[0], views.lookAt[1]+Roller.height-views.height, views.lookAt[2] ] );
			rotate = Roller.getRotate();
			// Rollerの回転
			rotate[0] += moveXZ.vel;
			if( rotate[0] >= Math.PI*2 ){
				rotate[0] -= Math.PI*2;
			}
			// Roller方向変更の遅延反映
			rotate[1] = ( rotate[1]*7 + Math.PI*2 - moveXZ.rot )/8;
			Roller.setRotate( rotate );
			Roller.prepDraw( triangleShader, vepMatrix, [ 0, 0, 0, light00.position, views.eyePosition, light00.ambient ] );
			Roller.draw( triangleShader );
		}());
		
		// 三角バッファの描画
		gl.disable(gl.CULL_FACE);
		TriBuffer.useProgram( triangleShader );
		mat4.identity( modelMatrix );
		mat4.inverse( modelMatrix, invMatrix);
		mat4.multiply( vepMatrix, modelMatrix, mvpMatrix );
		triangleShader.setUniLoc(
			mvpMatrix, invMatrix, light00.position, views.eyePosition, light00.ambient
		);
		TriBuffer.draw();
		
		// コンテキストの再描画
		gl.flush();
		
		cntrls.nbrOfFramesForFps++;
	}
	
	// 衝突判定による位置調整を行う
	function checkCollision( viewPos, moveXZ ){
		"use strict";
		var pos = [];
		
		pos[0] = viewPos[0]+moveXZ.dif[0];	// 
		pos[2] = viewPos[2]+moveXZ.dif[1];	// 移動先で判定
		
		if(( pos[0] < -8 )||( 8 < pos[0] )){
			moveXZ.dif[0] = 0;
		}
		if(( pos[2] < -13 )||( 3 < pos[2] )){
			moveXZ.dif[1] = 0;
		}
	};
	
	// プログラムオブジェクトとシェーダを生成しリンクする関数
	function createShaderProgram( gl, vsId, fsId ){
		"use strict";
		var shader = [],
			cnt = 0,
			scriptElement = [ document.getElementById(vsId), document.getElementById(fsId) ],
			program;
		
		if(( !scriptElement[0] )||( !scriptElement[1] )){
			return;
		}
		if(( scriptElement[0].type === 'x-shader/x-vertex' )&&( scriptElement[1].type === 'x-shader/x-fragment' )){
			shader[0] = gl.createShader(gl.VERTEX_SHADER);
			shader[1] = gl.createShader(gl.FRAGMENT_SHADER);
		}else{
			return;
		}
		for( cnt = 0; cnt < 2; ++cnt ){
			gl.shaderSource(shader[cnt], scriptElement[cnt].text);
			gl.compileShader(shader[cnt]);
			if( !gl.getShaderParameter(shader[cnt], gl.COMPILE_STATUS) ){
				alert(gl.getShaderInfoLog(shader[cnt]));
				return;
			}
		}
		
		program = gl.createProgram();
		gl.attachShader(program, shader[0]);
		gl.attachShader(program, shader[1]);
		gl.linkProgram(program);
		if( gl.getProgramParameter( program, gl.LINK_STATUS ) ){
			gl.useProgram(program);
			return program;
		}else{
			alert(gl.getProgramInfoLog(program));
			return;
		}
	};
	
	
	// ブラウザごとのキーイベント名称を取得
	function getKeyEventNames( browserInfo ){
		"use strict";
		let info = {
			up:		"ArrowUp",
			down:	"ArrowDown",
			left:	"ArrowLeft",
			right:	"ArrowRight",
			shift:	"Shift",
			space:	" ",
			keyB:	"b",
			keyF:	"f",
			keyG:	"g",
			keyP:	"p",
			keyR:	"r",
		};
		
		if( browserInfo[0] === "Microsoft Edge" ){
			info.up = "Up";
			info.down = "Down";
			info.left = "Left";
			info.right = "Right";
		}
		
		return info;
	};
};




