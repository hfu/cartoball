# cartoball

Carto Tile in PMTiles, on MapLibre GL globe

## 概要

このプロジェクトは、[UN Geospatial の cartotile-plain-design](https://github.com/UN-Geospatial/cartotile-plain-design) のベクトルタイルを PMTiles 形式で保存し、MapLibre GL JS の Globe モードで表示する地球儀ビューアです。

## 特徴

- 🌍 MapLibre GL JS の Globe モードによる地球儀表示
- 📦 PMTiles フォーマットによる効率的なベクトルタイル配信
- 🎨 UN Geospatial cartotile-plain-design のスタイルを踏襲
- ⚡ Vite による高速な開発とビルド
- 📄 GitHub Pages でホスティング可能な静的サイト生成

## 必要な環境

- Node.js (v20以上推奨)
- Go (go-pmtiles のインストールに必要)
- Python 3 (mbutil のインストールに必要)
- Just (タスクランナー)

## セットアップ

### 1. ツールのインストール

```bash
# go-pmtiles のインストール
go install github.com/protomaps/go-pmtiles@latest

# mbutil のインストール
pip3 install mbutil

# just のインストール (cargo が必要)
cargo install just
```

### 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/hfu/cartoball.git
cd cartoball

# 依存関係のインストール
just install

# ベクトルタイルのダウンロードと変換
just convert
```

## 使い方

### 開発サーバーの起動

```bash
just dev
```

ブラウザで http://localhost:5173 を開くと、地球儀ビューアが表示されます。

### 本番用ビルド

```bash
just build
```

`docs/` ディレクトリに静的サイトが生成されます。ファイル名にハッシュは含まれません。

### その他のコマンド

```bash
# すべてのタスクを表示
just

# ツールの確認
just check

# クリーンアップ
just clean
```

## Justfile のタスク

| タスク | 説明 |
|--------|------|
| `just` | タスク一覧を表示 |
| `just check` | 必要なツールの確認 |
| `just download` | cartotile-plain-design からベクトルタイルをダウンロード |
| `just convert` | ベクトルタイルを PMTiles 形式に変換 |
| `just install` | npm 依存関係のインストール |
| `just dev` | 開発サーバーを起動 |
| `just build` | 本番用ビルド (docs/ に出力) |
| `just clean` | ビルド成果物をクリーンアップ |
| `just all` | すべてのタスクを実行 (初回セットアップ用) |

## 技術スタック

- **MapLibre GL JS**: オープンソースの地図ライブラリ
- **PMTiles**: 効率的なベクトルタイル配信フォーマット
- **Vite**: 高速なビルドツール
- **go-pmtiles**: PMTiles 変換ツール
- **Just**: タスクランナー

## ライセンスと出所明示

このプロジェクトは以下のオープンソースプロジェクトを使用しています：

- **cartotile-plain-design**: [UN Geospatial](https://github.com/UN-Geospatial/cartotile-plain-design) により提供されているベクトルタイルとスタイルを使用しています。国連の地理空間情報への貢献に感謝いたします。
- **MapLibre GL JS**: 3-Clause BSD ライセンス
- **PMTiles**: Apache 2.0 ライセンス

### 重要な注意事項

この地図に示されている境界、名称、および指定は、国際連合による公式な支持または承認を意味するものではありません。詳細な免責事項はアプリケーション内の属性表示に含まれています。

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 作者

[hfu](https://github.com/hfu)

## 謝辞

UN Geospatial の cartotile-plain-design プロジェクトに感謝いたします。このプロジェクトは、同プロジェクトのベクトルタイルとスタイルデザインを基に構築されています。
