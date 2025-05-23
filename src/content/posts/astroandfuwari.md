---
title: Astro と Fuwari の組み合わせ、すごく良い感じです！
published: 2025-05-13
updated: 2025-05-14
description: "新しいブログを立ち上げるにあたって、Astro と Fuwari を使ってみた感想など。"
image: ""
tags: [Astro, Fuwari, Cursor, Windsurf, AI]
category: "日記"
draft: false
---

最近、ルイボスティーを飲みながら  
「AI 関連の情報がどんどん流れていくなぁ。どこかにメモしておきたいな……」  
と考えることが増えました。

Qiita・Zenn・X（旧 Twitter）を眺めながら “良いブログツールはないかな？” と探していたところ、  
- **[Astro](https://astro.build)** というフレームワーク  
- **[Fuwari](https://astro.build/themes/details/fuwari)** というシンプルで美しいテーマ  

に出会ったんです。デモサイトを見た瞬間 “これだ！” と直感し、その勢いでブログづくりをスタートしました。ここでは、そのときのことを少し記録しておこうと思います。

::github{repo="withastro/astro"}

::github{repo="saicaca/fuwari"}

---

## なぜブログを始めようと思ったのか

AI の世界は本当に流れが速く、毎日新しい情報が生まれます。  
面白い記事やツールを見つけても、読んで「ふむふむ」で終わり、気づけば埋もれてしまう──そんな経験、ありませんか？

> **「これはもったいない！ あとで見返せるよう、ちゃんとまとめよう」**

そう感じたことが、このブログを始めた一番の動機です。インプットを整理し、自分なりの考えを添えて残しておく場所にしたい――そんな思いからスタートしました。

---

## Fuwari テーマを選んだ理由

いくつか Astro のテーマを試した中で、Fuwari に決めたポイントは大きく 4 つあります。

1. **すっきりしたレイアウトで読みやすい**  
   - 装飾よりもコンテンツにフォーカスしたい私の理想どおりでした。  
2. **[Tailwind CSS](https://tailwindcss.com) ベースでカスタマイズが楽**  
   - “ちょっと色を変えたい” ときにも即調整できます。  
3. **ライト／ダークモードを自動切り替え**  
   - 読者の環境に合わせた表示は、ちょっとした気配り。  
4. **[Pagefind](https://pagefind.app) によるサイト内検索**  
   - 記事が増えても「どこだっけ？」をすばやく解決できます。

さらに、[Admonition](https://astro-cactus.chriswilliams.dev/posts/markdown-elements/admonistions/)（注釈）や GitHub リポジトリカードなど、Markdown だけでリッチな表現ができる点も魅力でした。  
「このテーマなら楽しく続けられそう！」と確信し、Fuwari を相棒に決定。

---

## ちょっとだけ加えたカスタマイズ

Fuwari はデフォルトでも素晴らしいのですが、より個性を出すために次の 2 点を追加しました。

| カスタマイズ                              | ねらい／効果 |
|-------------------------------------------|--------------|
| **記事ごとに生成される OG 画像**            | SNS シェア時に目を引くビジュアルを自動作成 |
| **ワンクリックでシェアできるボタン**         | 読者が “これイイ！” を気軽に拡散できる |

---

## 開発には [Cursor](https://www.cursor.com) × [Windsurf](https://windsurf.com/editor) を活用

「ほぼ自分でコードを書いていない」と言っても過言ではなく、体感 **7〜8 割を AI エージェントにお任せ**。  
- 環境構築 → リポジトリ URL と「環境構築お願いします」で完了  
- カスタマイズ → チャット相談で即時反映  
- 新機能追加 → 要望を伝えるだけで実装  

結果、人間が書いたコード行数は少なくても、リリースまでのリードタイムは大幅短縮。  
> **AI ≒ 開発パートナー**  
と捉えることで、プロジェクトの回し方そのものが変わる――そんな体験でした。

---