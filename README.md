# TapTap

スマホ自動タップ装置。

スイッチを押すとtaptapするようにしたい。
また、シャットダウンするスイッチもあると楽。

## Depencency

- [Node.js](https://nodejs.org/en/) 任意のバージョン
- [rpi-gpio](https://www.npmjs.com/package/rpi-gpio) v2.1.7 以上（このリポジトリのnode_module配下に配置済み）

ハード要件が必要。

## Setup

（記載中）

```latex{cmd=true, hide=false}
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


```latex{cmd=true hide=false}
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

## Usage

（記載中）

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
1. サンダー, ブレッドボードの使い方【ブレッドボードでLEDを光らせてみよう】, THUNDER BLOG, 2020/05/28, <https://thunderblog.org/2019/03/bread_board.html>
1. からあげ (id:karaage) , READMEの良さそうな書き方・テンプレート【GitHub/Bitbucket】, からあげ, 2018/01/19, <https://karaage.hatenadiary.jp/entry/2018/01/19/073000>
1. matiassingers, Awesome README, github.com, 2020/02/28, <https://github.com/matiassingers/awesome-readme>
