# serviceworker_sample


## Overview

PWA のための ServiceWorker 実験用サンプルアプリ


## Memo

- キャッシュの様子を確認する方法
  - Chrome の Developer Console で **アプリケーション** タブを開き、 **キャッシュストレージ** 内の指定（最新）バージョンを確認
  - GitHub Pages の場合は `/serviceworker_sample/` 以下のコンテンツが正しくキャッシュされている、はず


## References

- ServiceWorker について
  - https://qiita.com/hrkt/items/71c951082c6d90c7cd78

- ServiceWorker のライフサイクル（イベント）
  - https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154

- URLPattern が生まれた背景
  - https://webfrontend.ninja/js-urlpattern/

- URLPatternList でワイルドカードを含む複数の URL パターンに対応できそう？
  - https://github.com/WICG/urlpattern/blob/main/explainer.md
  - でも URLPatternList は未実装っぽい・・


## Licensing

This code is licensed under MIT.


## Copyright

2020-2023 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
