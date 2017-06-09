//==================================================================================
//	WalkerOne	--- Realtime 4D CG
//	2017/05/24	by pionier
//	http://www7b.biglobe.ne.jp/~fdw
//==================================================================================

//============================================================
//	OnLoad
//============================================================

function WalkerOne(){
	"use strict";
	var cnvs = document.getElementById('canvas'),
		cntrls = {},
		gl = {},
		views = {},
		light00 = {},
		triangleShader = {},
		TriBuffer = {},
		TRI_BUFFER_SIZE = 4096,
		WalkerBody_SCALE = 1,
		Phoenix_OffsY = 0,
		Phoenix_OffsH = 3,
		EquinoxFloor = {},
		keyStatus = [ false, false, false, false, false, false, false ],
		SIGHT_LENGTH = 3*2,
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
	
	try{
		if( !window.WebGLRenderingContext ){
			alert("No GL context.");
			return;
		}
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
			if( keyname === keyEventNames.ctrl ){
				keyStatus[6] = true;
			}
			
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
			if( keyname === keyEventNames.ctrl ){
				keyStatus[6] = false;
			}
		}
		// ドキュメントにリスナーを登録
		document.addEventListener( "keydown", KeyDownFunc, false );
		document.addEventListener( "keyup", KeyUpFunc, false );
		
	}
	
	// 移動方向
	let moveXZ = {
		rot:	Math.PI/2,					// 移動方向
		vel:	0.0,				// 移動量
		dif:	[ 0.0, 0.0 ]		// 実移動量(偏差)
	};
	
	// 視線ベクトル
	views = {
		eyePosition:	[ 0,  SIGHT_HEIGHT, SIGHT_LENGTH ],
		lookAt:			[ 4, 0, 0 ],
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
	const LegBaseHeight = -0.5;
	const LEG_NUM = 1;				// 脚の本数
	// Leg of Walkers
	let LegSet = function( legNo, pos, rotate, shader, brain ){
		this.id = legNo;
		this.pos = pos.concat();						// LegSet全体の4次元座標
		this.rot = rotate;
		this.basePos = [ 0,0,0,0 ];							// 常に0
		//this.anklePos = [ brain.StdLegPos[legNo].concat() ];	// basePosからの相対位置
		this.anklePos = [ 0,0,0,0 ];						// basePosからの相対位置
		this.kneePos = [ 0,0,0,0 ];							// basePosからの相対位置
		this.rotate = [ 0,0,0,0,0,0 ];						// LegSet全体の回転角
		this.scale = [ 1,1,1,0 ];
		this.shader = shader;
		//this.State = StateW;								// 市の移動モード(State)
		
		this.Base  = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
		this.Knee  = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
		this.Ankle = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
/**/
		this.UpperLeg = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0,0,0,0 ],									// pos
			[ 0,0,0,0,0,0 ],								// rotate
			[ 1,1,1,1 ],
			[ // Vertice
				-0.1,  1, 0.1,  0.1,   0.1,  1, 0.1,  0.1,   -0.1,  1, -0.1,  0.1,    0.1,  1, -0.1,  0.1,
				 0.1, -1, 0.1,  0.1,  -0.1, -1, 0.1,  0.1,    0.1, -1, -0.1,  0.1,   -0.1, -1, -0.1,  0.1,
				-0.1,  1, 0.1, -0.1,   0.1,  1, 0.1, -0.1,   -0.1,  1, -0.1, -0.1,    0.1,  1, -0.1, -0.1,
				 0.1, -1, 0.1, -0.1,  -0.1, -1, 0.1, -0.1,    0.1, -1, -0.1, -0.1,   -0.1, -1, -0.1, -0.1
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);
/**/
		this.LowerLeg = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],								// pos
			[ 0,0,0,0,0,0 ],							// rotate
			[ 1, 1, 1, 1 ],
			[ // Vertice
				-0.1,  1, 0.1,  0.1,   0.1,  1, 0.1,  0.1,   -0.1,  1, -0.1,  0.1,    0.1,  1, -0.1,  0.1,
				 0.1, -1, 0.1,  0.1,  -0.1, -1, 0.1,  0.1,    0.1, -1, -0.1,  0.1,   -0.1, -1, -0.1,  0.1,
				-0.1,  1, 0.1, -0.1,   0.1,  1, 0.1, -0.1,   -0.1,  1, -0.1, -0.1,    0.1,  1, -0.1, -0.1,
				 0.1, -1, 0.1, -0.1,  -0.1, -1, 0.1, -0.1,    0.1, -1, -0.1, -0.1,   -0.1, -1, -0.1, -0.1
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);		
		this.Foot = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],								// pos
			[ 0,0,0,0,0,0 ],							// rotate
			[ 1, 1, 1, 1 ],
			[ // Vertice
				-0.3, 0.1,  0.3,  0.3,   0.3, 0.1,  0.3,  0.3,   -0.3, -0.1,  0.3,  0.3,    0.3, -0.1,  0.3,  0.3,
				 0.3, 0.1, -0.3,  0.3,  -0.3, 0.1, -0.3,  0.3,    0.3, -0.1, -0.3,  0.3,   -0.3, -0.1, -0.3,  0.3,
				-0.3, 0.1,  0.3, -0.3,   0.3, 0.1,  0.3, -0.3,   -0.3, -0.1,  0.3, -0.3,    0.3, -0.1,  0.3, -0.3,
				 0.3, 0.1, -0.3, -0.3,  -0.3, 0.1, -0.3, -0.3,    0.3, -0.1, -0.3, -0.3,   -0.3, -0.1, -0.3, -0.3
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
				 0, 1, 2, 8,  1, 2, 3,11,   8, 9,11, 1,   8,11,10, 2,   1, 2, 8,11,		// 手前(Z=+1)
				13,12,15, 5, 12,15,14, 6,   5, 4, 6,12,   5, 6, 7,15,  12,15, 5, 6		// 奥(Z=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, -0.1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);		
/**/
		// 足の長さを指定
		this.UpperLeg.legLen = 2.0;
		this.LowerLeg.legLen = 2.0;
		
	}
	LegSet.prototype = {
		
		initParts:	function( primBuffer ){
			// シェーディングルーチン選択
			this.UpperLeg.setTriangle = this.UpperLeg.setTriangleFlat;
			this.UpperLeg.getNormal = this.UpperLeg.getNormalPlane;
			this.UpperLeg.getColor = this.UpperLeg.getColorPlane;
			this.LowerLeg.setTriangle = this.UpperLeg.setTriangleFlat;
			this.LowerLeg.getNormal = this.UpperLeg.getNormalPlane;
			this.LowerLeg.getColor = this.UpperLeg.getColorPlane;
			this.Foot.setTriangle = this.UpperLeg.setTriangleFlat;
			this.Foot.getNormal = this.UpperLeg.getNormalPlane;
			this.Foot.getColor = this.UpperLeg.getColorPlane;
			// 初期化変換
			this.UpperLeg.transform();
			this.UpperLeg.setTriBuffer( primBuffer );
			this.LowerLeg.transform();
			this.LowerLeg.setTriBuffer( primBuffer );
			this.Foot.transform();
			this.Foot.setTriBuffer( primBuffer );
			
			
		},
		
		setPos: function( pos ){
			this.pos = pos;
		},
		
		// 関節位置変更実験
		walk: function( pos, wkrRot, dist ){
			
			// 基点と上腿
			//this.basePos = [ 0,0,0,0 ];
			// 足と下腿
			this.anklePos = this.calcAnklePos( dist );
			// 膝位置
			this.kneePos  = this.calcKneePos();
			
			
			let rotUpper = this.calcRotate( this.basePos,  this.anklePos, wkrRot );
			let rotLower = rotUpper.concat();
/*
			for( let idx = 0; idx < rotLower.length; ++idx ){
				rotLower[idx] += Math.PI;
				if( rotLower[idx] > Math.PI*2 ){
					rotLower[idx] -= Math.PI*2;
				}
			}
*/
			rotUpper[1] = this.calcRotateYZ( this.basePos,  this.kneePos, this.UpperLeg.legLen );
			rotLower[1] = this.calcRotateYZ( this.anklePos, this.kneePos, this.LowerLeg.legLen );
			
			// 本体の位置と角度を反映
			this.pos = pos;
			
//			let rotUpr = this.UpperLeg.getRotate();
//			rotUpr[1] = rotUpper;
//			this.UpperLeg.setRotate( rotUpr );
			this.UpperLeg.setRotate( rotUpper );
			
//			let rotLwr = this.LowerLeg.getRotate();
//			rotLwr[1] = rotLower;
//			this.LowerLeg.setRotate( rotLwr );
			this.LowerLeg.setRotate( rotLower );
		},
		
		// 踝の位置を算出：仮
		calcAnklePos: function( var0 ){
			
			
			
//			let anklePos = [ 0,-0.5,var0,0 ];
			let anklePos = [ var0/2,-0.5,2,0 ];
			
			
			return anklePos;
		},
		
		// 膝の座標と足の傾きを計算
		calcKneePos: function(){
			// まずはbasePos[1]=anklePos[1]の場合を算出
			const L02 = this.UpperLeg.legLen*this.UpperLeg.legLen;
			const L12 = this.LowerLeg.legLen*this.LowerLeg.legLen;
			// 距離計算は手抜きできない
			const anklePos = this.anklePos;
			const basePos = this.basePos;
			const difV = [ anklePos[0]-basePos[0], anklePos[1]-basePos[1], anklePos[2]-basePos[2], anklePos[3]-basePos[3] ];
			const D2 = 	difV[0]*difV[0]+difV[1]*difV[1]+difV[2]*difV[2]+difV[3]*difV[3];
			const Dst = Math.sqrt( D2 );
			const DD = Math.sqrt( D2-difV[1]*difV[1] );
			let dist = (D2+L02-L12)/(2*Dst);
			let height = Math.sqrt( L02 - dist*dist );
			const MINIMUM_Y = 0.01;
			if(( difV[1] < -MINIMUM_Y )||( MINIMUM_Y < difV[1] )){
				// 付け根と踝の高度差が大きければ調整
				const sinYZ = -difV[1]/Dst;
				const cosYZ = DD/Dst;
				const newDist   =  dist*cosYZ+height*sinYZ;
				const newHeight = -dist*sinYZ+height*cosYZ;
				dist =  newDist;
				height = newHeight;
			}
			let kneePos = basePos.concat();
			const rate = dist/Dst;
			kneePos[0] += rate*difV[0];
			kneePos[1] += height;
			kneePos[2] += rate*difV[2];
			kneePos[3] += rate*difV[3];
			
			return kneePos;
		},
		
		// 基準点２つから傾きを算出：脚の伸び縮み方向
		calcRotateYZ: function( srcPos, dstPos, legLen ){
			const height = dstPos[1]-srcPos[1];
			const ang = Math.PI/2 -Math.asin( height/legLen );
			return ( dstPos[2] > srcPos[2] )?ang:-ang;
		},
		// 横方向への回転角を求める
		calcRotate: function( srcPos, dstPos, wkrRot ){
			let rotate = wkrRot.concat();
			// xz平面の回転を求める
			const difX = dstPos[0]-srcPos[0];
			const difZ = dstPos[2]-srcPos[2];
			let xz = Math.atan2( difZ, difX );
			// 方向調整
			xz += Math.PI*3/2;
			rotate[5] += xz;
			if( rotate[5] > Math.PI*2 ){
				rotate[5] -= Math.PI*2;
			}
			// xh平面
			
			
			// zh平面
			
			
			return rotate;			// [ xy, yz, yh, zh, xh, xz ]
		},
		
		// 描画
		draw:	function( isRedraw, hPos, viewProjMtx, shaderParam ){
			// 各パーツに座標・角度を設定
			let basePos = this.basePos.concat();
			basePos[0] += this.pos[0], basePos[1] += this.pos[1], basePos[2] += this.pos[2], basePos[3] += this.pos[3];
			this.Base.setPos( basePos );
			this.UpperLeg.setPos( basePos );
			let anklePos = this.anklePos.concat();
			anklePos[0] += this.pos[0], anklePos[1] += this.pos[1], anklePos[2] += this.pos[2], anklePos[3] += this.pos[3];
			this.Ankle.setPos( anklePos );
			this.Foot.setPos( anklePos );
			this.LowerLeg.setPos( anklePos );
			let kneePos = this.kneePos.concat();
			kneePos[0] += this.pos[0], kneePos[1] += this.pos[1], kneePos[2] += this.pos[2], kneePos[3] += this.pos[3];
			this.Knee.setPos( kneePos );
			
			// 描画
			if( isRedraw ){
				this.UpperLeg.transform();
				this.UpperLeg.dividePylams( hPos );
				this.LowerLeg.transform();
				this.LowerLeg.dividePylams( hPos );
				this.Foot.transform();
				this.Foot.dividePylams( hPos );
				
			}
/**/
			this.Base.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Base.draw( this.shader );
			this.Knee.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Knee.draw( this.shader );
			this.Ankle.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Ankle.draw( this.shader );
/**/
		},
	}
	
/*	// 仮の脚
	let LegZero = new LegSet( 0, [ 0,0,0,Phoenix_OffsH ], [ 0,0,0,0,0,0 ], triangleShader, 0 );
	LegZero.initParts( TriBuffer );
/**/
	
	
	// 
	let WalkerOne = function( gl, pos, rotate, shader ){
		this.pos = pos;
		this.rot = rotate;
		this.scale = [ 1,1,1,1 ];
		this.shader = shader;
		this.localMtx = new fDWL.R4D.Matrix4();
		
		// 胴体部分
		this.Body = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],			// pos
			this.rot.concat(),									// rotate
			[ WalkerBody_SCALE, WalkerBody_SCALE, WalkerBody_SCALE, WalkerBody_SCALE ],
			[ // Vertice
				-0.5, 0.5,  0.5,  0.5,   0.5, 0.5,  0.5,  0.5,   -0.5, -0.5,  0.5,  0.5,    0.5, -0.5,  0.5,  0.5,
				 0.5, 0.5, -0.5,  0.5,  -0.5, 0.5, -0.5,  0.5,    0.5, -0.5, -0.5,  0.5,   -0.5, -0.5, -0.5,  0.5,
				-0.5, 0.5,  0.5, -0.5,   0.5, 0.5,  0.5, -0.5,   -0.5, -0.5,  0.5, -0.5,    0.5, -0.5,  0.5, -0.5,
				 0.5, 0.5, -0.5, -0.5,  -0.5, 0.5, -0.5, -0.5,    0.5, -0.5, -0.5, -0.5,   -0.5, -0.5, -0.5, -0.5
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
				 0, 1, 2, 8,  1, 2, 3,11,   8, 9,11, 1,   8,11,10, 2,   1, 2, 8,11,		// 手前(Z=+1)
				13,12,15, 5, 12,15,14, 6,   5, 4, 6,12,   5, 6, 7,15,  12,15, 5, 6		// 奥(Z=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 0, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);
		this.BodyPlace = [ 0,0,0,0 ];	// 基準位置
		this.BodyPos = [ 0,0,0,0 ];		// ローカル座標変換結果
		
		// 頭部＆顔
		this.Head = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ], 16, 16, 0.5, [ 0.7, 0.7, 0.7, 1.0 ], shader );
		this.Face = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ],  8,  8, 0.3, [ 1.0, 0.7, 0.7, 1.0 ], shader );
		this.HeadPlace = [ 0, 0.8,  0.0, 0 ];	// 基準位置
		this.HeadPos = [ 0,0,0,0 ];				// ローカル座標変換結果
		this.FacePlace = [ 0, 0.8, -0.5, 0 ];	// 基準位置
		this.FacePos = [ 0,0,0,0 ];				// ローカル座標変換結果
		
		// 脚部
		this.Legs = [];
		this.LegPlace = [
			[ 0.5,LegBaseHeight,0.5,0 ], [ 0,0,0,0 ], [ 0,0,0,0 ], [ 0,0,0,0 ],
			[ 0,0,0,0 ], [ 0,0,0,0 ], [ 0,0,0,0 ], [ 0,0,0,0 ]
		];
		this.LegPos = [];
		for( let idx = 0; idx < LEG_NUM; ++idx ){
			
			this.Legs[idx] = new LegSet( idx, this.LegPlace[idx], [ 0,0,0,0,0,0 ], triangleShader, 0 );
		}
		
	}
	
	WalkerOne.prototype = {
		initParts:	function( primBuffer ){
			// シェーディングルーチン選択
			this.Body.setTriangle = this.Body.setTriangleFlat;
			this.Body.getNormal = this.Body.getNormalPlane;
			this.Body.getColor = this.Body.getColorPlane;
			// 初期化変換
			this.Body.transform();
			this.Body.setTriBuffer( primBuffer );
			
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].initParts( primBuffer );
			}
		},
		
		setRotate:	function( rotate ){
			this.rot = rotate;
		},
		getRotate: function(){
			return this.rot.concat();
		},
		
		calcRotMtx:	function(){
			// ローカル変換行列の作成
			let mx4Rots = [
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4()
				];
			for( let idx = 0; idx < 6; ++idx ){
				mx4Rots[idx].makeRot( idx, this.rot[idx] );
			}
			let mx4Scale = new fDWL.R4D.Matrix4();
			mx4Scale.makeScale( this.scale );
			// 各Matrixの合成
			this.localMtx = mx4Scale.
					mul( mx4Rots[5] ).
					mul( mx4Rots[4] ).
					mul( mx4Rots[3] ).
					mul( mx4Rots[2] ).
					mul( mx4Rots[1] ).
					mul( mx4Rots[0] );
		},
		
		walk:	function( var0 ){
			
			// 変換行列作成
			this.calcRotMtx();
			
			// 各ローカル基準点の変換
			this.BodyPos = this.localMtx.mulVec( this.BodyPlace[0], this.BodyPlace[1], this.BodyPlace[2], this.BodyPlace[3] );
			this.HeadPos = this.localMtx.mulVec( this.HeadPlace[0], this.HeadPlace[1], this.HeadPlace[2], this.HeadPlace[3] );
			this.FacePos = this.localMtx.mulVec( this.FacePlace[0], this.FacePlace[1], this.FacePlace[2], this.FacePlace[3] );
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.LegPos[idx] = this.localMtx.mulVec( this.LegPlace[idx][0], this.LegPlace[idx][1], this.LegPlace[idx][2], this.LegPlace[idx][3] );
				this.LegPos[idx][0] += this.pos[0];
				this.LegPos[idx][1] += this.pos[1];
				this.LegPos[idx][2] += this.pos[2];
				this.LegPos[idx][3] += this.pos[3];
				this.Legs[idx].walk( this.LegPos[idx], this.rot.concat(), var0 );
			}
		},
		
		draw:	function( isRedraw, hPos, viewProjMtx, shaderParam ){
			if( isRedraw ){
				let bodyPos = [ this.pos[0]+this.BodyPos[0], this.pos[1]+this.BodyPos[1], this.pos[2]+this.BodyPos[2], this.pos[3]+this.BodyPos[3] ];
				this.Body.setPos( bodyPos );
				this.Body.setRotate( this.rot.concat() );
				this.Body.transform();
				this.Body.dividePylams( hPos );
			}
			let headPos = [ this.pos[0]+this.HeadPos[0], this.pos[1]+this.HeadPos[1], this.pos[2]+this.HeadPos[2], this.pos[3]+this.HeadPos[3] ];
			this.Head.setPos( headPos );
			this.Head.setRotate( this.rot );
			this.Head.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Head.draw( this.shader );
			let facePos = [ this.pos[0]+this.FacePos[0], this.pos[1]+this.FacePos[1], this.pos[2]+this.FacePos[2], this.pos[3]+this.FacePos[3] ];
			this.Face.setPos( facePos );
			this.Face.setRotate( this.rot );
			this.Face.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Face.draw( this.shader );
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].draw( isRedraw, hPos, viewProjMtx, shaderParam );
			}
		}
	}
	
	let Walker = new WalkerOne( gl, [ 0,1.2,0,Phoenix_OffsH ], [ 0,0,0,0,0,0 ], triangleShader );
	Walker.initParts( TriBuffer );
	
	
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
	cntrls.Dist = document.getElementById('Dist');
	
	cntrls.RotXYTxt = document.getElementById('RotXYTxt');
	cntrls.RotYZTxt = document.getElementById('RotYZTxt');
	cntrls.RotYHTxt = document.getElementById('RotYHTxt');
	cntrls.RotZHTxt = document.getElementById('RotZHTxt');
	cntrls.RotXHTxt = document.getElementById('RotXHTxt');
	cntrls.RotXZTxt = document.getElementById('RotXZTxt');
	cntrls.DistTxt = document.getElementById('DistTxt');
	
	cntrls.oldHPos = (-100);
	cntrls.oldHPosBox = cntrls.eHPos.value;
	
	cntrls.RotXY.old = cntrls.RotXY.value;
	cntrls.RotYZ.old = cntrls.RotYZ.value;
	cntrls.RotYH.old = cntrls.RotYH.value;
	cntrls.RotZH.old = cntrls.RotZH.value;
	cntrls.RotXH.old = cntrls.RotXH.value;
	cntrls.RotXZ.old = cntrls.RotXZ.value;
	cntrls.Dist.old = cntrls.Dist.value;
	
	cntrls.RotXYTxt.old = cntrls.RotXY.value;
	cntrls.RotYZTxt.old = cntrls.RotYZ.value;
	cntrls.RotYHTxt.old = cntrls.RotYH.value;
	cntrls.RotZHTxt.old = cntrls.RotZH.value;
	cntrls.RotXHTxt.old = cntrls.RotXH.value;
	cntrls.RotXZTxt.old = cntrls.RotXZ.value;
	cntrls.DistTxt.old = cntrls.DistTxt.value;
	
	cntrls.wkrPos = [ 0,0,0,0 ];
	
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
			if( !keyStatus[6] ){
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
		let isRedraw = false;
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
		}else
		if( cntrls.Dist.old !== cntrls.Dist.value ){
			isRedraw = true;
			cntrls.DistTxt.value = cntrls.Dist.value;
		}else
		if( cntrls.DistTxt.old !== cntrls.DistTxt.value ){
			isRedraw = true;
			cntrls.Dist.value = cntrls.DistTxt.value;
		}
		
		// H軸位置設定
		hPos = cntrls.eHPos.value*(0.01);
		
		// 真４Ｄオブジェクトの更新：非移動時のみ
		if( ( cntrls.RotXY.old !== cntrls.RotXY.value )||
			( cntrls.RotYZ.old !== cntrls.RotYZ.value )||
			( cntrls.RotYH.old !== cntrls.RotYH.value )||
			( cntrls.RotZH.old !== cntrls.RotZH.value )||
			( cntrls.RotXH.old !== cntrls.RotXH.value )||
			( cntrls.RotXZ.old !== cntrls.RotXZ.value )
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
		cntrls.Dist.old = cntrls.Dist.value;
		cntrls.RotXYTxt.old = cntrls.RotXYTxt.value;
		cntrls.RotYZTxt.old = cntrls.RotYZTxt.value;
		cntrls.RotYHTxt.old = cntrls.RotYHTxt.value;
		cntrls.RotZHTxt.old = cntrls.RotZHTxt.value;
		cntrls.RotXHTxt.old = cntrls.RotXHTxt.value;
		cntrls.RotXZTxt.old = cntrls.RotXZTxt.value;
		cntrls.DistTxt.old = cntrls.DistTxt.value;
		if(( moveXZ.vel != 0 )||( cntrls.oldHPos != cntrls.eHPos.value )){
			isRedraw = true;
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
		
/**/
		// 地面
		(function(){
			"use strict";
			var vbo = [],
				attL = [],
				attS = [];
			mat4.identity( modelMatrix );
			mat4.translate( modelMatrix, [0.0, 0.0, 0.0], modelMatrix );
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
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, EquinoxFloor.Ibo );
			gl.drawElements( gl.TRIANGLES, EquinoxFloor.Data.i.length, gl.UNSIGNED_SHORT, 0 );
		}());
/**/
		
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
		
/**/
		// Walker
		if( keyStatus[6] ){
			if( keyStatus[0] ){	// up
				Walker.pos[0] += 0.1;
			}
			if( keyStatus[1] ){	// down
				Walker.pos[0] -= 0.1;
			}
			if( keyStatus[2] ){	// left
				Walker.pos[2] += 0.1;
			}
			if( keyStatus[3] ){	// right
				Walker.pos[2] -= 0.1;
			}
			
		}
		const rotWalker = [
			cntrls.RotXY.value/50,
			cntrls.RotYZ.value/50,
			cntrls.RotYH.value/50,
			cntrls.RotZH.value/50,
			cntrls.RotXH.value/50,
			cntrls.RotXZ.value/50
		];
		Walker.setRotate( rotWalker );
		if(( cntrls.wkrPos[0] !== Walker.pos[0] )||( cntrls.wkrPos[1] !== Walker.pos[1] )||( cntrls.wkrPos[2] !== Walker.pos[2] )||( cntrls.wkrPos[3] !== Walker.pos[3] )){
			isRedraw = true;
			cntrls.wkrPos = Walker.pos.concat();
		}
		Walker.walk( cntrls.Dist.value/100 );	// APIは仮
		if( isRedraw ){
			// 八胞体切断体の作成
			TriBuffer.initialize( triangleShader );
		}
		Walker.draw( isRedraw, hPos, vepMatrix, [ 0, 0, 0, light00.position, views.eyePosition, light00.ambient ] );
		
/*		// Leg Test
		LegZero.walk( cntrls.Dist.value/100 );
		LegZero.draw( isRedraw, hPos, vepMatrix, [ 0, 0, 0, light00.position, views.eyePosition, light00.ambient ] );
/**/
		
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
		let shader = [],
			scriptElement = [ document.getElementById(vsId), document.getElementById(fsId) ];
		
		if(( !scriptElement[0] )||( !scriptElement[1] )){
			return;
		}
		if(( scriptElement[0].type === 'x-shader/x-vertex' )&&( scriptElement[1].type === 'x-shader/x-fragment' )){
			shader[0] = gl.createShader(gl.VERTEX_SHADER);
			shader[1] = gl.createShader(gl.FRAGMENT_SHADER);
		}else{
			return;
		}
		for( let cnt = 0; cnt < 2; ++cnt ){
			gl.shaderSource(shader[cnt], scriptElement[cnt].text);
			gl.compileShader(shader[cnt]);
			if( !gl.getShaderParameter(shader[cnt], gl.COMPILE_STATUS) ){
				alert(gl.getShaderInfoLog(shader[cnt]));
				return;
			}
		}
		
		let program = gl.createProgram();
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
			ctrl:	"Control",
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




