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
		SIGHT_LENGTH = 3*2,
		SIGHT_HEIGHT = 2,
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
	
	const	ROT_RATE = 0.003;
	
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
	let keyEventNames = getKeyEventNames( fDWL.getBrowserInfo( gl ) );
	
	cnvs.width  = 512;
	cnvs.height = 384;
	
	// キーイベント
	let keyStatus = [ false, false, false, false, false, false, false, false, false ];
	let keyBackup = [ false, false, false, false, false, false, false, false, false ];
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
			if( keyname === keyEventNames.space ){
				keyStatus[7] = true;
			}
			if( keyname === keyEventNames.keyB ){
				keyStatus[8] = true;
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
			if( keyname === keyEventNames.space ){
				keyStatus[7] = false;
			}
			if( keyname === keyEventNames.keyP ){
				keyStatus[8] = false;
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
//		eyePosition:	[ 0,  SIGHT_HEIGHT, -SIGHT_LENGTH*2 ],
//		eyePosition:	[ SIGHT_LENGTH*2,  SIGHT_HEIGHT, 0 ],
		eyePosition:	[ 0,  SIGHT_HEIGHT, SIGHT_LENGTH*2 ],
		lookAt:			[ 0, 0, -4 ],
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
	// 足の移動目標座標
	const LgMvTargPos0 = 0;
	const LgMvTargPosW = 1;
	const LgMvTargPosF = 2;
	const LgMvTargPosB = 3;
	const LgMvTargPosR = 4;
	const LgMvTargPosL = 5;
	const LgMvStride = 2;
	const LgMvStrideH = LgMvStride/2;
	// 回転移動用移動開始・終了点算出用
	const stdLegPosLen = Math.sqrt( 5.21 );
	const stdLPX = -1.1/stdLegPosLen;
	const stdLPZ = 2/stdLegPosLen;
	// 移動コマンド
	const CmdNop = 0;					// 教養コマンド：動作なし
	const CmdMvStop = CmdNop+1;			// 停止
	const CmdMvFwd = CmdMvStop+1;		// 前進
	const CmdMvBack = CmdMvFwd+1;		// 後進
	const CmdMvPw2Pb2 = CmdMvBack+1;	// 停止準備から停止作業へ
	const CmdMvTurnR = CmdMvPw2Pb2+1;	// 右回転
	const CmdMvTurnL = CmdMvTurnR+1;	// 左回転
	const CmdMvMax = CmdMvTurnL+1;
	// 足へ／からのコマンド
	const CmdLgF = CmdMvMax+1;			// 脚かき動作
	const CmdLgB = CmdLgF+1;			// 脚上げ復帰動作
	const CmdLgW = CmdLgB+1;			// その場で待機
	const CmdLgEnd = CmdLgW+1;			// 動作終了(目標地点到達)
	// 足のState
	const StateW  = 0;				// 待機中
	const StateNf = StateW+1;		// 通常移動中
	const StateNb = StateNf+1;		// 通常復帰中
	const StatePw = StateNb+1;		// 停止準備待機中
	const StatePb = StatePw+1;		// 停止準備移動中(陽)
	const StatePb2 = StatePb+1;		// 停止準備移動中(陰)
	// コマンドリストID(=LegID)
	const CmdListLg = 0;
	const CmdListLg0 = CmdListLg;
	const CmdListLg1 = CmdListLg0+1;
	const CmdListLg2 = CmdListLg1+1;
	const CmdListLg3 = CmdListLg2+1;
	const CmdListLg4 = CmdListLg3+1;
	const CmdListLg5 = CmdListLg4+1;
	const CmdListLg6 = CmdListLg5+1;
	const CmdListLg7 = CmdListLg6+1;
	const CmdListOut = CmdListLg7+1;
	const CmdListMax = CmdListOut+1;
	
	
	// 足の動作コントローラ
	let LegBrain = {
		
		// 現状の全体コマンド
		MainCmd:	CmdNop,
		// 保存中の次回コマンド
		NextCmd:	CmdNop,
		// 各脚
		LegObj:		[ null, null, null, null, null, null, null, null ],
		// 脚のステート
		LegState:	[ StateW, StateW, StateW, StateW, StateW, StateW, StateW, StateW ],
		// 足のモード(Master/Slave)
		LegMode:	[ false, true, true, false, true, false, false, true ],
		// コマンドリスト：コマンドの郵便受け
		CmdList:	[ CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop ],
		// 足の基準位置
		StdLegPos:	[
			[ 2, -0.5, 1.1, 0 ], [ -2, -0.5, 1.1, 0 ], [ 2, -0.5, -1.1, 0 ], [ -2, -0.5, -1.1, 0 ],
			[ 2, -0.5, 1.1, 0 ], [ -2, -0.5, 1.1, 0 ], [ 2, -0.5, -1.1, 0 ], [ -2, -0.5, -1.1, 0 ]
		],
		// 前進時の目標地点
		FwdLegPos:	[
			[ 2, -0.5, 0.1, 0 ], [ -2, -0.5, 0.1, 0 ], [ 2, -0.5, -2.1, 0 ], [ -2, -0.5, -2.1, 0 ], 
			[ 2, -0.5, 0.1, 0 ], [ -2, -0.5, 0.1, 0 ], [ 2, -0.5, -2.1, 0 ], [ -2, -0.5, -2.1, 0 ]
		],
		// 後退時の目標地点
		BckLegPos:	[
			[ 2, -0.5, 2.1, 0 ], [ -2, -0.5, 2.1, 0 ], [ 2, -0.5, -0.1, 0 ], [ -2, -0.5, -0.1, 0 ],
			[ 2, -0.5, 2.1, 0 ], [ -2, -0.5, 2.1, 0 ], [ 2, -0.5, -0.1, 0 ], [ -2, -0.5, -0.1, 0 ]
		],
		// 右回転時の目標地点
		RitLegPos:	[
			[ 2+stdLPX, -0.5, 1.1+stdLPZ, 0 ], [ -2+stdLPX, -0.5, 1.1-stdLPZ, 0 ], [ 2-stdLPX, -0.5, -1.1+stdLPZ, 0 ], [ -2-stdLPX, -0.5, -1.1-stdLPZ, 0 ],
			[ 2+stdLPX, -0.5, 1.1+stdLPZ, 0 ], [ -2+stdLPX, -0.5, 1.1-stdLPZ, 0 ], [ 2-stdLPX, -0.5, -1.1+stdLPZ, 0 ], [ -2-stdLPX, -0.5, -1.1-stdLPZ, 0 ]
		],
		// 左回転時の目標地点
		LftLegPos:	[
			[ 2-stdLPX, -0.5, 1.1-stdLPZ, 0 ], [ -2-stdLPX, -0.5, 1.1+stdLPZ, 0 ], [ 2+stdLPX, -0.5, -1.1-stdLPZ, 0 ], [ -2+stdLPX, -0.5, -1.1+stdLPZ, 0 ],
			[ 2-stdLPX, -0.5, 1.1-stdLPZ, 0 ], [ -2-stdLPX, -0.5, 1.1+stdLPZ, 0 ], [ 2+stdLPX, -0.5, -1.1-stdLPZ, 0 ], [ -2+stdLPX, -0.5, -1.1+stdLPZ, 0 ]
		],
		
		// 各脚へのコマンド発行
		// outerCmd: 受け取ったコマンド(動作終了通知も含む)
		// lgNo: 脚の番号
		sndCmd: function( outerCmd, lgNo ){
			let cmd = [ CmdNop, 0, 0, 0, 0 ];	// CmdID, TargetPos
			let trgPos = LgMvTargPos0;
			
			if( outerCmd === this.MainCmd ){
				return;
			}
			
			switch( outerCmd ){
			case CmdMvStop:
				// Stop命令が動作するのは移動(Nf/Nb)時のみ
				if( this.LegState[lgNo] === StateNf ){
					// その場で待機
					this.LegState[lgNo] = StatePw;
					cmd[0] = CmdLgW;
				}else
				if( this.LegState[lgNo] === StateNb ){
					// 標準位置への復帰作業
					this.LegState[lgNo] = StatePb;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
				}
				break;
			case CmdMvFwd:
				// 前進命令
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosB;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvBack ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvBack ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosB;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvBack:
				// 後退命令
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosF;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosB;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvFwd ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosB;
					}else
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvFwd ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosF;
					}else
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosB;
					}
					break;
				default:
					break;
				}
				break;
			case CmdLgEnd:
				// 動作終了通知
				switch( this.LegState[lgNo] ){
				case StateNf:
					this.LegState[lgNo] = StateNb;
					cmd[0] = CmdLgB;
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosF;
					}else
					if( this.MainCmd === CmdMvTurnR ){
						trgPos = LgMvTargPosR;
					}else
					if( this.MainCmd === CmdMvTurnL ){
						trgPos = LgMvTargPosL;
					}else{
						trgPos = LgMvTargPosB;
					}
					break;
				case StateNb:
					this.LegState[lgNo] = StateNf;
					cmd[0] = CmdLgF;
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosB;
					}else
					if( this.MainCmd === CmdMvTurnR ){
						trgPos = LgMvTargPosL;
					}else
					if( this.MainCmd === CmdMvTurnL ){
						trgPos = LgMvTargPosR;
					}else{
						trgPos = LgMvTargPosF;
					}
					break;
				case StatePw:
					this.LegState[lgNo] = StatePb2;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
					break;
				case StatePb:
				case StatePb2:
					this.LegState[lgNo] = StateW;
					trgPos = LgMvTargPosW;
					break;
				default:
					break;
				}
				break;
			case CmdMvTurnR:
				// 右回転
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosR;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosL;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvTurnL ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosL;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvTurnL ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosR;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvTurnL:
				// 左回転
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosL;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosR;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvTurnR ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosR;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvTurnR ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosL;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvPw2Pb2:
				// デバグ用：終了待機から終了動作へ
				if( this.LegState[lgNo] === StatePw ){
					this.LegState[lgNo] = StatePb2;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
				}
				break;
			default:
				break;
			}
			if( trgPos !== LgMvTargPos0 ){
				if( trgPos === LgMvTargPosF ){
					cmd[1] = this.FwdLegPos[lgNo][0], cmd[2] = this.FwdLegPos[lgNo][1], cmd[3] = this.FwdLegPos[lgNo][2], cmd[4] = this.FwdLegPos[lgNo][3];
				}else
				if( trgPos === LgMvTargPosB ){
					cmd[1] = this.BckLegPos[lgNo][0], cmd[2] = this.BckLegPos[lgNo][1], cmd[3] = this.BckLegPos[lgNo][2], cmd[4] = this.BckLegPos[lgNo][3];
				}else
				if( trgPos === LgMvTargPosR ){
					cmd[1] = this.RitLegPos[lgNo][0], cmd[2] = this.RitLegPos[lgNo][1], cmd[3] = this.RitLegPos[lgNo][2], cmd[4] = this.RitLegPos[lgNo][3];
				}else
				if( trgPos === LgMvTargPosL ){
					cmd[1] = this.LftLegPos[lgNo][0], cmd[2] = this.LftLegPos[lgNo][1], cmd[3] = this.LftLegPos[lgNo][2], cmd[4] = this.LftLegPos[lgNo][3];
				}else{		// LgMvTargPosW
					cmd[1] = this.StdLegPos[lgNo][0], cmd[2] = this.StdLegPos[lgNo][1], cmd[3] = this.StdLegPos[lgNo][2], cmd[4] = this.StdLegPos[lgNo][3];
				}
			}
			if( this.LegObj[ lgNo ] ){
				this.LegObj[lgNo].rcvCmd( cmd );
			}
			//return cmd;
		},
		
		// コマンド受信：コマンド受信リストに登録
		rcvCmd: function( outerCmd, lgNo ){
			if(( CmdListLg0 <= lgNo )&&( lgNo < CmdListMax )){
				
				// 動作中ならStopに差し替え
				if( ( lgNo === CmdListOut )&&
					((( outerCmd === CmdMvFwd )||( outerCmd === CmdMvBack ))&&(( this.MainCmd === CmdMvTurnR )||( this.MainCmd === CmdMvTurnL )))||
					((( outerCmd === CmdMvTurnR )||( outerCmd === CmdMvTurnL ))&&(( this.MainCmd === CmdMvFwd )||( this.MainCmd === CmdMvBack )))
				){
					this.NextCmd = outerCmd;	// 入力を保存
					outerCmd = CmdMvStop;		// 動作停止を実行
				}
				// コマンドリストに登録
				this.CmdList[lgNo] = outerCmd;
			}
		},
		// コマンド受信：コマンド受信リストをチェック
		checkCmdList: function(){
			let cmd = CmdNop;
			// 各脚からのコマンドをチェック：CmdLgEnd でなければNop
			for( let lgNo = CmdListLg0; lgNo < CmdListMax; lgNo++ ){
				cmd = this.CmdList[lgNo];
				if( cmd === CmdNop ){
					continue;
				}
				if( lgNo !== CmdListOut ){
					// 脚からの終了通知：自身に通知
					this.sndCmd( cmd, lgNo );
					// 終了動作待機中ならペアの片割れにも通知
					let pairNo = this.getPairNo( lgNo );
					if( this.LegState[pairNo] === StatePw ){
						this.sndCmd( cmd, pairNo );
					}
					// 全動作終了なら、次回コマンドを発行
					if( this.CmdList[CmdListOut] === CmdNop ){
						for( let idx = 0; idx < this.LegState.length; ++idx ){
							if( this.LegState[idx] !== StateW ){
								break;
							}
							this.CmdList[CmdListOut] = this.NextCmd;
							this.NextCmd = CmdNop;
						}
					}
				}else{
					// 各脚に通達
					for( let idx = CmdListLg0; idx < CmdListOut; idx++ ){
						this.sndCmd( cmd, idx );
					}
					this.MainCmd = cmd;
				}
				this.CmdList[lgNo] = CmdNop;
			}
		},
		// 脚のペアの相手を返す
		getPairNo: function( lgNo ){
			let pairNo = 0;
			switch( lgNo ){
			case 0:
			case 2:
			case 4:
			case 6:
				pairNo = lgNo+1;
				break;
			case 1:
			case 3:
			case 5:
			case 7:
				pairNo = lgNo-1;
				break;
			default :
				pairNo = 0;
				break;
			}
			return pairNo;
		}
	};
	
	const LegBaseHeight = -0.5;
//	const LEG_NUM = 8;				// 脚の本数
	const LEG_NUM = 2;				// 脚の本数
	// Leg of Walkers
	let LegSet = function( legNo, pos, rotate, shader, brain ){
		this.id = legNo;
		this.pos = pos.concat();						// LegSet全体の4次元座標
		this.brain = brain;
		this.rot = rotate;
		this.basePos = [ 0,0,0,0 ];							// 常に0
		this.anklePos = [ brain.StdLegPos[legNo].concat() ];	// basePosからの相対位置
		this.kneePos = [ 0,0,0,0 ];							// basePosからの相対位置
		this.rotate = [ 0,0,0,0,0,0 ];						// LegSet全体の回転角
		this.scale = [ 1,1,1,0 ];
		this.shader = shader;
		this.State = StateW;								// 脚の移動モード(State)
		this.targetPos = [ 0,0,0,0 ];
		this.srcPos = [ 0,0,0, ];
		
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
			//  初期位置設定
			this.targetPos = this.brain.StdLegPos[this.id];
			this.srcPos = this.brain.StdLegPos[this.id];
			this.anklePos = this.targetPos.concat();
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
		
		// 本体からのコマンド受信
		rcvCmd: function( cmd ){
			switch( cmd[0] ){
			case CmdLgF:	// 脚かき動作
				this.targetPos = [ cmd[1],cmd[2],cmd[3],cmd[4] ];
				if(( this.State === StateW )||( this.State === StateNb )){
					this.State = StateNf;
				}
				break;
			case CmdLgB:	// 脚上げ復帰動作
				this.targetPos = [ cmd[1],cmd[2],cmd[3],cmd[4] ];
				if(( this.State === StateW )||( this.State === StateNf )){
					this.State = StateNb;
				}
				break;
			case CmdLgW:	// その場で待機
				this.State = StateW;
				break;
			case CmdNop:
			default:
				break;
			}
		},
		
		// 関節位置変更実験
		walk: function( pos, wkrMtx, wkrPos, wkrRot, dist ){
			
			// 基点と上腿
			//this.basePos = [ 0,0,0,0 ];
			// 足と下腿
			this.anklePos = this.calcAnklePos( dist );
			// 膝位置
			this.kneePos  = this.calcKneePos();
			
			let rotUpper = this.calcRotate( this.basePos,  this.anklePos, wkrRot );
			let rotLower = rotUpper.concat();
/**
			rotLower[3] = -rotLower[3];
			rotLower[5] = -rotLower[5];
/**/
			rotUpper[1] =  this.calcRotateYZ( this.basePos,  this.kneePos, this.UpperLeg.legLen );
//			rotLower[1] =  this.calcRotateYZ( this.anklePos, this.kneePos, this.LowerLeg.legLen );
			rotLower[1] = -this.calcRotateYZ( this.anklePos, this.kneePos, this.LowerLeg.legLen );
/**/
			this.UpperLeg.setRotate( rotUpper );
			this.LowerLeg.setRotate( rotLower );
			
			// 各パーツに座標・角度を設定
			// LegPos( = base )
			this.pos = fDWL.add4D( wkrMtx.mulVec( pos[0], pos[1], pos[2], pos[3] ), wkrPos );
			// base
			let basePos = this.pos.concat();
			this.Base.setPos( basePos );
			this.UpperLeg.setPos( basePos );
			// ankle
			let anklePos = fDWL.add4D( wkrMtx.mulVec( this.anklePos[0], this.anklePos[1], this.anklePos[2], this.anklePos[3] ), basePos );
			this.Ankle.setPos( anklePos );
			this.Foot.setPos( anklePos );
			this.LowerLeg.setPos( anklePos );
			// knee
			let kneePos = fDWL.add4D( wkrMtx.mulVec( this.kneePos[0], this.kneePos[1], this.kneePos[2], this.kneePos[3] ), basePos );
			this.Knee.setPos( kneePos );
			
			// 移動終了チェック
			if(( this.anklePos[0] === this.targetPos[0] )&&( this.anklePos[1] === this.targetPos[1] )&&( this.anklePos[2] === this.targetPos[2] )&&( this.anklePos[3] === this.targetPos[3] )){
				// 終了通知を発信
				this.brain.rcvCmd( CmdLgEnd, this.id );
			}
		},
		
		// 踝の位置を算出：仮
		calcAnklePos: function( speed ){
			let anklePos = this.anklePos.concat();
			
			if( ( this.State === StateNf )||
				( this.State === StateNb )||
				( this.State === StatePb )||
				( this.State === StatePb2 )
			){
				const difH = 0.1;
				let movDir = [ this.targetPos[0]-anklePos[0], 0, this.targetPos[2]-anklePos[2], this.targetPos[3]-anklePos[3] ];
				const mvSize = Math.sqrt( fDWL.inProd4D( movDir, movDir ) );
				if( mvSize < speed ){
					// 移動先に元々近ければ移動先を直接指定
					anklePos[0] = this.targetPos[0];
					anklePos[2] = this.targetPos[2];
					anklePos[3] = this.targetPos[3];
					
					// 高さの差が大きい場合は修正限界を考慮する
					if( anklePos[1] > (this.targetPos[1]+difH) ){
						anklePos[1] -= difH;
					}else
					if( anklePos[1] < (this.targetPos[1]-difH) ){
						anklePos[1] += difH;
					}else{
						anklePos[1] = this.targetPos[1];
					}
				}else{
					// 移動先から遠ければ、方向づけして移動量を付加
					movDir[0] /= mvSize, movDir[1] /= mvSize, movDir[2] /= mvSize, movDir[3] /= mvSize;
					anklePos[0] += movDir[0]*speed;
					anklePos[1] = -0.5;
					anklePos[2] += movDir[2]*speed;
					anklePos[3] += movDir[3]*speed;
					
					// 脚上げ移動なら脚高度を計算
					if( this.State !== StateNf ){
						const leng = Math.sqrt(
							(this.targetPos[0]-anklePos[0])*(this.targetPos[0]-anklePos[0])+
							(this.targetPos[2]-anklePos[2])*(this.targetPos[2]-anklePos[2])+
							(this.targetPos[3]-anklePos[3])*(this.targetPos[3]-anklePos[3]) );
						const hight = LgMvStrideH - (LgMvStrideH-leng)*(LgMvStrideH-leng)/LgMvStrideH;
						anklePos[1] = this.targetPos[1] + hight;
					}
				}
			}
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
				dist = newDist;
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
			return ang;
		},
		// 横方向への回転角を求める
		calcRotate: function( srcPos, dstPos, wkrRot ){
			//let rotate = wkrRot.concat();
			let rotate = [ 0,0,0,0,0,0 ];
			// 確実の偏差
			const difX = dstPos[0]-srcPos[0];
			const difZ = dstPos[2]-srcPos[2];
			const difH = dstPos[3]-srcPos[3];
			// xz平面の回転を求める
			let xz = Math.atan2( difZ, difX );
			// 方向調整
			xz += Math.PI*3/2;
			rotate[5] += xz;
			if( rotate[5] > Math.PI*2 ){
				rotate[5] -= Math.PI*2;
			}
			// xh平面
			
			
/**/
			// zh平面
//			let zh = Math.atan2( difZ, difH );
			let zh = Math.atan2( difH, difZ );
			rotate[3] += zh;
/**/
			
			return rotate;			// [ xy, yz, yh, zh, xh, xz ]
		},
		
		// 描画
		draw:	function( isRedraw, hPos, wkrMtx, viewProjMtx, shaderParam ){
			
			// 描画
			if( isRedraw ){
				
/**
				let mx4RotLeg = new fDWL.R4D.Matrix4();
				let rot = this.UpperLeg.getRotate();
				mx4RotLeg.makeRot( 1, rot[1] );
				rot[1] = 0;
				this.UpperLeg.setRotate( rot );
				this.UpperLeg.transform( mx4RotLeg );
/**/
				this.UpperLeg.transform( wkrMtx );
/**
				this.UpperLeg.transform();
/**/
				this.UpperLeg.dividePylams( hPos );
/**/
				this.LowerLeg.transform( wkrMtx );
/**
				this.LowerLeg.transform();
/**/
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
	
	// 
	let WalkerOne = function( gl, pos, rotate, shader, brain ){
		this.pos = pos;
		this.rot = rotate;
		this.scale = [ 1,1,1,1 ];
		this.shader = shader;
		this.localMtx = new fDWL.R4D.Matrix4();
		this.brain = brain;
		
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
		this.Body.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		this.BodyPlace = [ 0,0,0,0 ];	// 基準位置
		this.BodyPos = [ 0,0,0,0 ];		// ローカル座標変換結果
		
		// 頭部＆顔
		this.Head = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ], 16, 16, 0.5, [ 0.7, 0.7, 0.7, 1.0 ], shader );
		this.Face = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ],  8,  8, 0.3, [ 1.0, 0.7, 0.7, 1.0 ], shader );
		this.HeadPlace = [ 0, 0.8,  0.0, 0 ];	// 基準位置
		this.HeadPos = [ 0,0,0,0 ];				// ローカル座標変換結果
		this.Head.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		this.FacePlace = [ 0, 0.8, 0.5, 0 ];	// 基準位置
		this.FacePos = [ 0,0,0,0 ];				// ローカル座標変換結果
		this.Face.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		
		// 脚部
		this.Legs = [];
		this.LegPlace = [
			[ 0.5,LegBaseHeight, 0.5, 0 ], [ -0.5,LegBaseHeight, 0.5, 0 ],
			[ 0.5,LegBaseHeight,-0.5, 0 ], [ -0.5,LegBaseHeight,-0.5, 0 ],
//			[ 0.5,LegBaseHeight, 0.5, 0.5 ], [ -0.5,LegBaseHeight, 0.5, 0.5 ],
//			[ 0.5,LegBaseHeight,-0.5, 0.5 ], [ -0.5,LegBaseHeight,-0.5, 0.5 ],
			[ 0.5,LegBaseHeight, 0.5,-0.5 ], [ -0.5,LegBaseHeight, 0.5,-0.5 ],
			[ 0.5,LegBaseHeight,-0.5,-0.5 ], [ -0.5,LegBaseHeight,-0.5,-0.5 ]
		];
		this.LegPos = [];
		for( let idx = 0; idx < LEG_NUM; ++idx ){
			
			this.Legs[idx] = new LegSet( idx, this.LegPlace[idx], [ 0,0,0,0,0,0 ], triangleShader, this.brain );
			this.brain.LegObj[idx] = this.Legs[idx];
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
		getPos:	function(){
			return this.pos.concat();
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
		
		walk:	function( speed ){
			
			// 変換行列作成
			this.calcRotMtx();
			
			// 各ローカル基準点の変換
			this.BodyPos = this.localMtx.mulVec( this.BodyPlace[0], this.BodyPlace[1], this.BodyPlace[2], this.BodyPlace[3] );
			this.HeadPos = this.localMtx.mulVec( this.HeadPlace[0], this.HeadPlace[1], this.HeadPlace[2], this.HeadPlace[3] );
			this.FacePos = this.localMtx.mulVec( this.FacePlace[0], this.FacePlace[1], this.FacePlace[2], this.FacePlace[3] );
			
			// 歩行
			if(( this.brain.MainCmd === CmdMvFwd )||( this.brain.MainCmd === CmdMvBack )){
				const vel = ( this.brain.MainCmd === CmdMvBack )?(-speed):speed;
				this.pos = fDWL.add4D( this.pos, this.localMtx.mulVec( 0, 0, vel, 0 ) );
			}
			// 回転移動
			let rotAng = 0;
			if( this.brain.MainCmd === CmdMvTurnR ){
				rotAng = ROT_RATE;
				this.rot[5] += ROT_RATE;
				if( this.rot[5] < 0 ){
					this.rot[5] += Math.PI*2;
				}
			}else
			if( this.brain.MainCmd === CmdMvTurnL ){
				this.rot[5] -= ROT_RATE;
				if( this.rot[5] > Math.PI*2 ){
					this.rot[5] -= Math.PI*2;
				}
				rotAng = -ROT_RATE;
			}
			this.Body.walk( fDWL.add4D( this.pos, this.BodyPos ), this.rot );
			this.Head.walk( fDWL.add4D( this.pos, this.HeadPos ), this.rot );
			this.Face.walk( fDWL.add4D( this.pos, this.FacePos ), this.rot );
			
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].walk( this.LegPlace[idx], this.localMtx, this.pos, this.rot.concat(), speed );
			}
		},
		
		draw:	function( isRedraw, hPos, viewProjMtx, shaderParam ){
			if( isRedraw ){
				this.Body.transform();
				this.Body.dividePylams( hPos );
			}
			this.Head.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Head.draw( this.shader );
			this.Face.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Face.draw( this.shader );
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].draw( isRedraw, hPos, this.localMtx, viewProjMtx, shaderParam );
			}
		}
	}
	
	let Walker = new WalkerOne( gl, [ 0,1.2,0,Phoenix_OffsH ], [ 0,0,0,0,0,0 ], triangleShader, LegBrain );
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
		
/**
		// キー入力から移動速度・進行方向・視点位置を修正
		(function(){
			var speed = VELOCITY;
			if( keyStatus[5] ){
				speed *= 2;
			}
			moveXZ.vel = 0.0;
			
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
/**/
		// 視点調整：Walkerの方を向く
		(function(){
			const posW = Walker.getPos();
			views.lookAt[0] = posW[0];
			views.lookAt[1] = views.height;
			views.lookAt[2] = posW[2];
			// 視点調整：Walkerとの距離を話されない
			let distV = Math.sqrt(
						(posW[0]-views.eyePosition[0])*(posW[0]-views.eyePosition[0])+
						(posW[2]-views.eyePosition[2])*(posW[2]-views.eyePosition[2])
			);
			const stdDist = 10;	// 基準距離
			if( distV > stdDist ){
				let rate = 1-stdDist/distV;
				views.eyePosition[0] += (posW[0]-views.eyePosition[0])*rate;
				views.eyePosition[2] += (posW[2]-views.eyePosition[2])*rate;
			}
			
			// 視点行列を算出
			mat4.lookAt( views.eyePosition, views.lookAt, [0, 1, 0], viewMatrix);
			mat4.multiply( projMatrix, viewMatrix, vepMatrix );
		}());
/**/
		
		// 入力ボックス：変更適用
//		let isRedraw = false;
		let isRedraw = true;
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
/**
		
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
		
		// LegBrain
		// 移動テスト用キー入力判定 5b,6f,7_,8p,9r
		const cmd = LegBrain.MainCmd;
		if(( keyStatus[0] )&&( !keyBackup[0] )){	// forward
			LegBrain.rcvCmd( CmdMvFwd, CmdListOut );
		}
		if(( keyStatus[1] )&&( !keyBackup[1] )){	// back
			LegBrain.rcvCmd( CmdMvBack, CmdListOut );
		}
		if(( keyStatus[7] )&&( !keyBackup[7] )){	// ' '
			LegBrain.rcvCmd( CmdMvStop, CmdListOut );
		}
		if(( keyStatus[8] )&&( !keyBackup[8] )){	// 'p'
			LegBrain.rcvCmd( CmdMvPw2Pb2, CmdListOut );
		}
		if(( keyStatus[2] )&&( !keyBackup[2] )){	// rotate
			LegBrain.rcvCmd( CmdMvTurnL, CmdListOut );
		}
		if(( keyStatus[3] )&&( !keyBackup[3] )){	// rotate
			LegBrain.rcvCmd( CmdMvTurnR, CmdListOut );
		}
		keyBackup = keyStatus.concat();
		LegBrain.checkCmdList();
		
		let rotWalker = [
			cntrls.RotXY.value/100,
			cntrls.RotYZ.value/100,
			cntrls.RotYH.value/100,
			cntrls.RotZH.value/100,
			cntrls.RotXH.value/100,
			cntrls.RotXZ.value/100
		];
		//rotWalker[5] = Walker.getRotate()[5];		// XZ回転の制御
		Walker.setRotate( rotWalker );
		if(( cntrls.wkrPos[0] !== Walker.pos[0] )||( cntrls.wkrPos[1] !== Walker.pos[1] )||( cntrls.wkrPos[2] !== Walker.pos[2] )||( cntrls.wkrPos[3] !== Walker.pos[3] )){
			isRedraw = true;
			cntrls.wkrPos = Walker.pos.concat();
		}
//		Walker.walk( cntrls.Dist.value/100 );	// APIは仮
		Walker.walk( 0.01 );	// APIは仮
		if( isRedraw ){
			// 八胞体切断体の作成
			TriBuffer.initialize( triangleShader );
		}
		Walker.draw( isRedraw, hPos, vepMatrix, [ 0, 0, 0, light00.position, views.eyePosition, light00.ambient ] );
		
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
		if(( pos[2] < -8 )||( 8 < pos[2] )){
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




