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

/**
 * シャットダウン実行用スイッチに関する情報定義オブジェクト。
 * @property {Number}  pin       シャットダウン実行用のタクトスイッチを接続するピン番号。
 * @property {Boolean} state.on  タクトスイッチが押下されていることを示すブール値。
 * @property {Boolean} state.off タクトスイッチが押下されていないことを示すブール値。
 */
 const Data_ShutdownControlSwitch = {
  pin: 36,
  state: { on: true, off: false },
};

/**
 * リレーループ制御用スイッチに関する情報定義オブジェクト。
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
  constructor(aRelayTimePeriod, aRelayTouchBoardState, aRelayLoopState) {
   /**
    * リレーを実行するタイマーを割り当てる一次変数。
    * @type {Object}
    */
    this.relayTimer;

    /**
     * リレー有効時間、またはリレー無効時間を割り当てる一次変数。
     * @type {Object}
     */
    this.relayTimePeriod = aRelayTimePeriod;

    /**
     * リレーが有効/無効であるかを割り当てる一次変数。
     * @type {Boolean}
     */
    this.relayTouchBoardState = aRelayTouchBoardState;

    /**
     * リレーループが有効/無効であるかを割り当てる一次変数。
     * @type {Boolean}
     */
    this.relayLoopState = aRelayLoopState;

    /**
     * リレーループを実行する関数。
     * @returns なし。
     */
    this.runRelayLoop = () => {
      console.log(`runRelayLoop()`);
      // リレーループが停止中であれば何もしない。
      // if (this.relayLoopState === Data_RelayLoopControlSwitch.relayLoopState.stop) {
      //   return ;
      // }

      // // リレーオフであればリレーオンにして、リレー有効時間経過後に再度runRelayLoop()を呼び出すようにタイマーを設定する。
      // // リレーオンであればリレーオフにして、リレー無効時間経過後に再度runRelayLoop()を呼び出すようにタイマーを設定する。
      // if (this.relayTouchBoardState === Data_RelayTouchBoard.state.off) {
      //   this.relayTouchBoardState = Data_RelayTouchBoard.state.on;
      //   this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.on;
      // } else {
      //   this.relayTouchBoardState = Data_RelayTouchBoard.state.off;
      //   this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.off;
      // }

      // gpio.write(Data_RelayTouchBoard.pin, this.relayTouchBoardState);
      // this.relayTimer = setTimeout(this.runRelayLoop, this.relayTimePeriod);
    };

    /**
     * リレーループを停止する関数。
     * @returns なし。
     */
    this.stopRelayLoop = () => {
      console.log(`stopRelayLoop()`);
      // this.relayTouchBoardState = Data_RelayTouchBoard.state.off;
      // this.relayTimePeriod = Data_RelayTouchBoard.timePeriod.off;

      // gpio.write(Data_RelayTouchBoard.pin, this.relayTouchBoardState);
      // clearTimeout(this.relayTimer);
    };
  }
}

// setTimeoutでループし、ONを検出すると状態を反転させる。動いているなら止め、止まっているなら動かす。
gpio.setup(Data_RelayTouchBoard.pin, gpio.DIR_OUT, () => {
  console.log(`PIN${Data_RelayTouchBoard.pin}: OUT start.`);
});

gpio.setup(Data_RelayLoopControlSwitch.pin, gpio.DIR_IN, () => {
  console.log(`PIN${Data_RelayLoopControlSwitch.pin}: IN start.`);
  gpio.read(Data_RelayLoopControlSwitch.pin, (err, value) => {
    console.log(`PIN${Data_RelayLoopControlSwitch.pin} value: ${value}`);
  })
  // RunRelayLoop();
});
