/**
 * @fileoverview Raspberry Piに接続したリレータッチボードでリレーをループする（定期的にOn/Offする。）
 * @description Raspberry Piにリレータッチボードとタクトスイッチを接続しておき、その状態でタクトスイッチを押下すると
 *     リレータッチボードのリレーをループする（定期的にOn/Offする。）
 *     リレーループ中に再度タクトスイッチを押下すると、リレーループを停止する。
 *     また、ついでにRaspberry Piをシャットダウンできるボタンにも対応する。
 * @todo Raspberry Piにリレータッチボードとタクトスイッチを接続すること。
 * @see なし。
 * @example なし。
 * @license WTFPL-2.0
 */
const gpio = require('rpi-gpio');
const { exec } = require('child_process');

//========================================================
// 各種データを定義する。
//========================================================
/**
 * シャットダウン実行用タクトスイッチに関する情報定義オブジェクト。
 * @property {Number}  pin       シャットダウン実行用のタクトスイッチを接続するピン番号。
 * @property {Boolean} state.on  タクトスイッチが押下されていることを示すブール値。
 * @property {Boolean} state.off タクトスイッチが離上されている（押下されていない）ことを示すブール値。
 */
 const Data_ShutdownControlSwitch = {
  pin: 22,
  state: { on: true, off: false },
};

/**
 * リレーループ制御用タクトスイッチに関する情報定義オブジェクト。
 * @property {Number}  pin                 リレーループ制御用のタクトスイッチを接続するピン番号。
 * @property {Boolean} state.on            タクトスイッチが押下されていることを示すブール値。
 * @property {Boolean} state.off           タクトスイッチが押下されていないことを示すブール値。
 * @property {Boolean} relayLoopState.run  リレーループを実行していることを示すブール値。
 * @property {Boolean} relayLoopState.stop リレーループを実行していないことを示すブール値。
 */
const Data_RelayLoopControlSwitch = {
  pin: 18,
  state: { on: true, off: false },
  relayLoopState: { run: true, stop: false }
};

/**
 * リレータッチボードに関する情報定義オブジェクト。
 * @property {Number}  pin            リレータッチボードを接続するピン番号。
 * @property {Boolean} state.on       リレーが有効である、つまりタッチオンであることを示すブール値。
 * @property {Boolean} state.off      リレーが無効である、つまりタッチオフであることを示すブール値。
 * @property {Number}  timePeriod.on  リレーが有効である、つまりタッチオンである期間を示す数値。単位はミリ秒。
 * @property {Number}  timePeriod.off リレーが無効である、つまりタッチオフである期間を示す数値。単位はミリ秒。
 */
const Data_RelayTouchBoard = {
  pin: 16,
  state: { on: true, off: false },
  timePeriod: { on: 100, off: 5000 }
};

/**
 * リレーループを実行するクラス。
 * @class
 */
class RelayLooper {
  /**
   * @constructor
   * @param {Number} aRelayTimePeriod              リレー期間を示すData_RelayTouchBoard.timePeriodの値。デフォルト値はoff。
   * @param {Boolean} aRelayTouchBoardState        リレーの有効/無効を示すData_RelayTouchBoard.stateの値。デフォルト値はoff。
   * @param {Boolean} aRelayLoopControlSwitchState リレー制御用タクトスイッチの押下/離上を示すData_RelayLoopControlSwitch.stateの値。デフォルト値はoff。
   * @param {Boolean} aRelayLoopState              Data_RelayLoopControlSwitch.relayLoopStateの値。デフォルト値はstop。
   */
  constructor(
    aRelayTimePeriod = Data_RelayTouchBoard.timePeriod.off,
    aRelayTouchBoardState = Data_RelayTouchBoard.state.off,
    aRelayLoopControlSwitchState = Data_RelayLoopControlSwitch.state.off,
    aRelayLoopState = Data_RelayLoopControlSwitch.relayLoopState.stop) {
   /**
    * リレーを実行するタイマーを割り当てるプロパティ。
    * @type {Object}
    */
    this.relayTimer;

    /**
     * リレー有効時間、またはリレー無効時間を割り当てるプロパティ。
     * @type {Object}
     */
    this.relayTimePeriod = aRelayTimePeriod;

    /**
     * リレーが有効/無効であるかを割り当てるプロパティ。
     * @type {Boolean}
     */
    this.relayTouchBoardState = aRelayTouchBoardState;

    /**
     * リレー制御用タクトスイッチが押下されているかを示すプロパティ。
     * @type {Boolean}
     */
    this.relayLoopControlSwitchState = aRelayLoopControlSwitchState;

    /**
     * リレーループが有効/無効であるかを割り当てるプロパティ。
     * @type {Boolean}
     */
    this.relayLoopState = aRelayLoopState;

    /**
     * リレーループを実行する関数。
     * @returns なし。
     */
    this.runRelayLoop = () => {
      // リレーループが停止中であれば何もしない。
      if (this.relayLoopState === Data_RelayLoopControlSwitch.relayLoopState.stop) {
        return ;
      }

      // リレーオフであればリレーオンにして、リレー有効時間経過後に再度runRelayLoop()を呼び出すようにタイマーを設定する。
      // リレーオンであればリレーオフにして、リレー無効時間経過後に再度runRelayLoop()を呼び出すようにタイマーを設定する。
      if (this.relayTouchBoardState === Data_RelayTouchBoard.state.off) {
        this.relayTouchBoardState = Data_RelayTouchBoard.state.on;
        this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.on;
      } else {
        this.relayTouchBoardState = Data_RelayTouchBoard.state.off;
        this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.off;
      }

      gpio.write(Data_RelayTouchBoard.pin, this.relayTouchBoardState);
      this.relayTimer = setTimeout(this.runRelayLoop, this.relayTimePeriod);
    };

    /**
     * リレーループを停止する関数。
     * @returns なし。
     */
    this.stopRelayLoop = () => {
      // リレーオフにし、リレーループ用のタイマーをクリアする。
      this.relayTouchBoardState = Data_RelayTouchBoard.state.off;
      this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.off;

      gpio.write(Data_RelayTouchBoard.pin, this.relayTouchBoardState);
      clearTimeout(this.relayTimer);
    };
  }
}

//========================================================
// リレータッチボードの出力を有効化する。
//========================================================
gpio.setup(Data_RelayTouchBoard.pin, gpio.DIR_OUT, () => {
  // console.log(`PIN${Data_RelayTouchBoard.pin}: OUT start.`);
});

//========================================================
// リレーループ制御用タクトスイッチの入力を有効化する。
//========================================================
/**
 * リレーループ実行クラスをインスタンス化。
 * @type {Object}
 */
let relayLooper = new RelayLooper();

/**
 * リレーループを実行するためのタイマー。
 * @type {Object}
 */
let relayLooperTimer;

gpio.setup(Data_RelayLoopControlSwitch.pin, gpio.DIR_IN, () => {
  const switchStateChecker = () => {
    gpio.read(Data_RelayLoopControlSwitch.pin, (err, value) => {
      // タクトスイッチが押下されると、リレーループ実行/停止をトグルする。
      if (value === Data_RelayLoopControlSwitch.state.on) {

        // すでにスイッチが押下中である場合、押しっぱなしとみなして無視する（スイッチがオフの場合に処理を実行する。）
        if (relayLooper.relayLoopControlSwitchState === Data_RelayLoopControlSwitch.state.off) {
          // リレーループ実行/停止をトグルする。
          if (relayLooper.relayLoopState === Data_RelayLoopControlSwitch.relayLoopState.run) {
            relayLooper.relayLoopState = Data_RelayLoopControlSwitch.relayLoopState.stop;
            relayLooper.stopRelayLoop();
          } else {
            relayLooper.relayLoopState = Data_RelayLoopControlSwitch.relayLoopState.run;
            relayLooper.runRelayLoop();
          }
        }

        // タクトスイッチが押下された旨をプロパティへ反映する。
        relayLooper.relayLoopControlSwitchState = Data_RelayLoopControlSwitch.state.on;
      } else {
        // タクトスイッチが離上された旨をプロパティへ反映する。
        relayLooper.relayLoopControlSwitchState = Data_RelayLoopControlSwitch.state.off
      }
    });
    relayLooperTimer = setTimeout(switchStateChecker, 100);
  };
  relayLooperTimer = setTimeout(switchStateChecker, 100);
});

//========================================================
// シャットダウン実行用タクトスイッチの入力を有効化する。
//========================================================
/**
 * シャットダウン用タクトスイッチが押下された時点の日付。
 * @type {Date}
 */
let pushedDate = null;

/**
 * シャットダウンを開始しているかを示すブール値。trueならシャットダウンを開始しており、falseなら開始していない。
 * @type {Boolean}
 */
let isShutdownStart = false;

/**
 * シャットダウンを実行するためのタイマー。
 * @type {Object}
 */
let shutdownTimer;

gpio.setup(Data_ShutdownControlSwitch.pin, gpio.DIR_IN, () => {
  const switchStateChecker = () => {
    gpio.read(Data_ShutdownControlSwitch.pin, (err, value) => {
      // タクトスイッチが5秒間連続で押下されると、シャットダウンを実行する。
      if (isShutdownStart === false) {
        if (value === Data_ShutdownControlSwitch.state.on) {
          // スイッチを押下した時点の日時を保存する。
          if (pushedDate === null) {
            pushedDate = new Date();
          }
          const currentDate = new Date();
          const pushedPeriod = currentDate.getTime() - pushedDate.getTime();

          if (pushedPeriod > 5000) {
            isShutdownStart = true;
            const poweroff = exec('sudo /usr/sbin/poweroff');

            poweroff.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });

            poweroff.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });
          }
        } else {
          // 5秒経過せずにスイッチを離上すると、スイッチを押下した時点の日時をリセットする。
          pushedDate = null;
        }
      }
    });
    shutdownTimer = setTimeout(switchStateChecker, 100);
  };

  shutdownTimer = setTimeout(switchStateChecker, 100);
});
