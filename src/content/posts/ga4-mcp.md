---
title: "GA4 MCPサーバーのローカル構築手順 - Windows対応かんたんガイド（Windsurf/Claude Desktop使用）"
published: 2025-07-29
updated: 2025-07-29
description: "WindowsでGA4 MCPサーバーをローカル構築し、AIに日本語でGA4データを質問できる環境を構築する手順を詳しく解説します。"
image: ""
tags: [GA4, MCP, Windows, AI, Windsurf, Claude, Analytics]
category: "AI"
draft: false
---

## はじめに

Google Analytics 4 (GA4) のデータを、AIに日本語で質問して分析結果を得られたら便利だと思いませんか。

今回は、WindowsでGA4 MCPサーバーをローカル構築し、WindsurfやClaude DesktopなどのMCP対応エディターでGA4データをAIに質問できる環境を作る方法をご紹介します。手順通りに進めれば、コードを書かなくてもGA4データをAIに質問できる環境が完成します！

:::message
**Windows環境での注意点**  
MacやLinux環境では比較的スムーズに設定できるMCPサーバーですが、Windowsでは**パスの区切り文字**や**環境変数の設定方法**が異なるため、そのままの設定では動作しないことがあります。本記事ではWindows特有の設定方法を詳しく解説します。
:::。

### 想定読者
- GA4を使っているWebサイト運営者・マーケター
- データ分析をもっと効率化したい方
- AIツールに興味がある方
- Windows環境で作業している方

## 前提知識 / 必要環境

### システム要件
- OS: Windows 11（Windows 10でも動作可能）
- Python: 3.10以上
- MCP対応エディター: Windsurf、Claude Desktop、VS Codeなど
- GA4プロパティ: データが蓄積されているGA4プロパティ

### 事前準備が必要なもの
- Google Cloudプロジェクト
- GA4プロパティへのアクセス権限
- MCP対応エディターのインストール

## 構成概要とメリット

### システム構成
```
MCP対応エディター（Windsurf/Claude Desktop）
    ↕ (MCPプロトコル)
ローカルGA4 MCPサーバー
    ↕ (GA4 Data API)
Google Analytics 4
```

## 実装手順

### Step 1: Google Cloud環境の準備

#### 1-1. Google Cloudプロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新規プロジェクトを作成（例：「GA4-MCPテスト」）
3. 作成したプロジェクトを選択

#### 1-2. GA4 Data APIの有効化
1. Cloud Consoleで「APIとサービス > ライブラリ」を選択
2. 「Google Analytics Data API」を検索
3. APIを有効化

#### 1-3. サービスアカウントの作成
1. 「APIとサービス > 認証情報」を選択
2. 「認証情報を作成 > サービス アカウント」をクリック
3. 適当な名前（例：「ga4-mcp-server」）で作成
4. ロール選択はスキップして完了

#### 1-4. サービスアカウントキーの生成
1. 作成したサービスアカウントの詳細画面を開く
2. 「キー」タブから「鍵を追加 > 新しい鍵を作成」
3. キータイプは「JSON」を選択
4. ダウンロードしたJSONファイルを安全な場所に保存
   ```
   例: C:\Users\<ユーザー名>\ga4-mcp-key.json
   ```

#### 1-5. GA4プロパティへの権限付与
1. ダウンロードしたJSONファイルを開き、`client_email`をコピー
2. [GA4管理画面](https://analytics.google.com/)で対象プロパティを選択
3. 「管理 > プロパティのアクセス管理」を選択
4. 「＋（ユーザーを追加）」からサービスアカウントのメールアドレスを「閲覧者」権限で追加

#### 1-6. GA4プロパティIDの確認
GA4管理画面の「プロパティの詳細」から数字のプロパティID（例：123456789）をメモしておきます。

:::message
**重要**: 「G-XXXX...」で始まる測定IDではなく、数字のプロパティIDを使用してください。
:::。

### Step 2: MCPサーバーのインストール

```bash
pip install google-analytics-mcp
```

### Step 3: 環境変数の設定

#### 方法A: 一時的な設定（コマンドプロンプト）
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\<ユーザー名>\ga4-mcp-key.json
set GA4_PROPERTY_ID=123456789
```

#### 方法B: MCPクライアント設定ファイル（推奨）

**Windsurfの場合**
`C:\Users\<ユーザー名>\.codeium\windsurf\mcp_config.json`を作成します。

```json
{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python",
      "args": ["-m", "ga4_mcp_server"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\<ユーザー名>\\ga4-mcp-key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}
```

**Claude Desktopの場合**
`%APPDATA%\Claude\claude_desktop_config.json`を編集します。

```json
{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python",
      "args": ["-m", "ga4_mcp_server"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\<ユーザー名>\\ga4-mcp-key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}
```

:::message alert
**注意**: Windowsではバックスラッシュをエスケープしてください。
:::。

### Step 4: MCPクライアントのセットアップ

#### 4-1. Windsurfの場合
1. Windsurfを再起動して設定を読み込み
2. チャットウィンドウで「@ga4-analytics」と入力してMCPサーバーが認識されるか確認
3. 認識されていれば設定完了

#### 4-2. Claude Desktopの場合
1. Claude Desktopを再起動
2. 設定メニューからMCPサーバーが認識されているか確認
3. チャットでGA4関連の質問をして動作確認

#### 4-3. VS Codeの場合
1. ワークスペースルートに`.vscode/mcp.json`を作成
2. 上記と同様のMCPサーバー設定を追加
3. Copilot ChatでGA4データについて質問

## GA4データを日本語で問い合わせる

### 基本的な使い方

MCP対応エディターのチャット機能を使って日本語で質問するだけです！

**Windsurfの場合**
```
昨日のユーザー数はどれくらいですか？ @ga4-analytics
```

**Claude Desktopの場合**
```
GA4の昨日のユーザー数を教えてください
```

初回実行時はMCPサーバーとの接続確認の画面が表示される場合があります。

### 質問例

**基本的な指標**
```
> 昨日のユーザー数は何人ですか？
> 直近7日間のページビュー数を教えて
> 今月の新規ユーザー数は先月と比べて増えましたか？
```

**詳細分析**
```
> ユーザーの国別セッション数を教えてください
> 直近30日間の人気ページトップ5は？
> モバイルとデスクトップのユーザー数の比較を見せて
```

**期間指定**
```
> 2025年7月1日から7月31日までの売上を教えて
> 先週と今週でコンバージョン数に差はありますか？
```

### 質問を成功させるコツ

**具体的に質問する**  
「ユーザー数を教えて」より「昨日のユーザー数は何人ですか？」の方が効果的です。

**期間を明示する**  
「昨日」「先週」「直近30日」など期間を指定しましょう。

**段階的に質問する**  
一度に複数のことを聞くより、1つずつ順に質問します。

**専門用語も使える**  
「直帰率」「セッション」「コンバージョン」など日本語でOKです。

## ポイント & 注意

### ハマりどころと対処法

#### よくあるエラー

**「No module named ga4_mcp_server」**
```bash
# ユーザーモードで再インストール
pip install --user google-analytics-mcp
```

**「executable file not found」**
- 設定JSONの`"command"`を`"python3"`から`"python"`に変更
- またはPython実行ファイルのフルパスを指定

**認証エラー**
- JSONキーのパスを再確認
- サービスアカウントの権限を再確認
- プロパティIDが数字のみか確認

**「MCPサーバーが認識されない」**
- 設定ファイルのパスを再確認
- エディターを再起動して設定を読み込み直し
- JSONファイルの構文エラーがないか確認

### ベストプラクティス

**セキュリティ**
- サービスアカウントJSONファイルは安全な場所に保存
- 不要になったキーは削除

**パフォーマンス**
- 大量データの取得時は期間を区切る
- API制限に注意（1日1000リクエスト）

**運用**
- 定期的にGemini CLIとMCPサーバーを更新
- エラーログを確認して問題を早期発見

## まとめ

今回は、WindowsでGA4 MCPサーバーをローカル構築し、GA4データをAIに日本語で質問できる環境を構築しました。

### 学んだこと
- MCPプロトコルを使ったAIとデータソースの連携
- Google Cloud APIの認証設定
- ローカル環境でのセキュアなデータ分析環境構築

### 構築できた環境の価値
- 効率化: 複雑なGA4画面を操作せずに日本語で質問
- 安全性: データが外部に送信されないローカル環境
- コスト: 基本無料で運用可能
- 拡張性: 他のMCPサーバーとの組み合わせも可能

## 次のステップ

ぜひ実際にGA4データをAIに質問してみてください。

**試してみたいこと**
- 定期レポートの自動化
- 他のMCPサーバー（GitHub、Slack等）との組み合わせ
- カスタムダッシュボードの作成

**参考リンク**
- [Google Analytics MCP公式リポジトリ](https://github.com/googleanalytics/google-analytics-mcp)
- [MCP Protocol仕様](https://modelcontextprotocol.io/)
- [Gemini CLI公式ドキュメント](https://www.npmjs.com/package/@google/gemini-cli)