# TapTap

スマホ自動タップ装置。

スイッチを押すとtaptapするようにしたい。
また、シャットダウンするスイッチもあると楽。

## Depencency

- [Node.js](https://nodejs.org/en/) 任意のバージョン
- [rpi-gpio](https://www.npmjs.com/package/rpi-gpio) v2.1.7 以上（このリポジトリのnode_module配下に配置済み）

ハード要件が必要。

## Setup

（記載中。ハードのセットアップを記載する。）

```latex{cmd=true, hide=true}
\documentclass{standalone}
\usepackage[siunitx,american]{circuitikz}
\begin{document}
\begin{circuitikz}
  \draw (0,0) to[R=2<\ohm>, i=?, v=84<\volt>]
        (2,0) -- (2,2) to[V<=84<\volt>]
        (0,2) -- (0,0);
\end{circuitikz}
\end{document}
```

```latex{cmd=true hide=true}
\documentclass{standalone}
\usepackage[siunitx, RPvoltages]{circuitikz}
\begin{document}
\begin{circuitikz}
  \ctikzset{multipoles/thickness=4}
  \ctikzset{multipoles/external pins thickness=2}
  \draw (0,0) node [dipchip,
    num pins=12,
    hide numbers,
    external pins width=0.3,
    external pad fraction=4](C){IC1};
  \draw (C.pin 1) -- ++(-0.5,0) to[R] ++(0,-3)
    node[ground]{};
  \node[right, font=\tiny] at (C.bpin 1){RST};
\end{circuitikz}
\end{document}
```

続いて、本リポジトリのファイルを任意の場所に配置する（例：/home/user01/TapTapに配置。）

次に、起動時にスクリプトを実行させるため、/etc/rc.localを編集する。

```cmd
sudo vi /etc/rc.local
```

/etc/rc.localを変更していない場合、以下のように記述されている。

```shell
# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

exit 0
```

/etc/rc.localへ以下のように追記する。

```shell
# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

cd /home/user01/TapTap
nohup node taptap.js &

exit 0
```

修正後、以下のコマンドでrc.localのエラーをチェックする。

```cmd
sudo /etc/rc.local
```

## Usage

（記載中。タクトスイッチ押下で動かす旨を記載する。）

## License

- [TapTap](https://github.com/DNV825/TapTap), [WTFPL-2.0](http://www.wtfpl.net/)

```text
        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                    Version 2, December 2004 

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

- [rpi-gpio](https://www.npmjs.com/package/rpi-gpio), [MIT Lisence](https://github.com/JamesBarwell/rpi-gpio.js/blob/master/MIT-LICENSE.txt)

## Authors

- [TapTap](https://github.com/DNV825/tTpTap), DNV825
- [rpi-gpio](https://www.npmjs.com/package/rpi-gpio),JamesBarwell / julienvincent / thecodershome / aslafy-z / pimterry / aztecrex / aleksipirttimaa / dawn-minion / andrewdotn / robertkowalski

## References

1. @Gadgetoid, Raspberry Pi Pinout, Pinout.xyz, -, <https://pinout.xyz/>
1. shuichi, ラズパイ：タクトスイッチでPythonプログラムを動作させる, 人生は読めないブログ, 2020/08/16, <https://torisky.com/%E3%83%A9%E3%82%BA%E3%83%91%E3%82%A4%EF%BC%9A%E3%82%BF%E3%82%AF%E3%83%88%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E3%81%A7python%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0%E3%82%92%E5%8B%95%E4%BD%9C/>
1. @K-Ponta, Raspberry Pi 3 B+に シャットダウンスイッチを付ける, Qiita, 2019/04/14, <https://qiita.com/K-Ponta/items/12127d7077d69a82693c>
1. 文系の伊藤さん, タクトスイッチは向きに注意, 文系の伊藤さんと電気の話, 2017/03/25, <https://ameblo.jp/bun-ito/entry-12259611903.html>
1. サンダー, ブレッドボードの使い方【ブレッドボードでLEDを光らせてみよう】, THUNDER BLOG, 2020/05/28, <https://thunderblog.org/2019/03/bread_board.html>
1. しなぷす, 【初心者向け】ブレッドボードとタクトスイッチで論理回路を作る(5), 京都しなぷすのハード制作日誌, 2020/05/14, <https://synapse.kyoto/hard/switch-logic/page005.html>
1. furoblog, 【JavaScript】日付処理で意識するべきこと, furoblog’s blog, 2019/04/25, <https://furoblog.hatenablog.com/entry/js-datediff>
1. Carlos Delgado, How to shutdown and reboot Linux with Node.js, OUR CODE WORLD, 2017/03/14, <https://ourcodeworld.com/articles/read/411/how-to-shutdown-and-reboot-linux-with-node-js>
1. からあげ (id:karaage) , READMEの良さそうな書き方・テンプレート【GitHub/Bitbucket】, からあげ, 2018/01/19, <https://karaage.hatenadiary.jp/entry/2018/01/19/073000>
1. matiassingers, Awesome README, github.com, 2020/02/28, <https://github.com/matiassingers/awesome-readme>
