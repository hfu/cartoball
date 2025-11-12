# cartoball Justfile
# タスクランナー for PMTiles変換とサイトビルド

# デフォルトのタスク一覧を表示
default:
    @just --list

# 必要なツールがインストールされているか確認
check:
    @echo "=== ツールの確認 ==="
    @which go-pmtiles || echo "❌ go-pmtiles がインストールされていません"
    @which mb-util || echo "❌ mb-util (mbutil) がインストールされていません"
    @which node || echo "❌ Node.js がインストールされていません"
    @which npm || echo "❌ npm がインストールされていません"
    @echo "✅ チェック完了"

# ベクトルタイルをダウンロード
download:
    @echo "=== cartotile-plain-design からベクトルタイルをダウンロード ==="
    @mkdir -p data
    @if [ ! -d "data/cartotile-plain-design" ]; then \
        git clone --depth 1 https://github.com/UN-Geospatial/cartotile-plain-design.git data/cartotile-plain-design; \
    else \
        echo "既にダウンロード済みです"; \
    fi

# ベクトルタイルをPMTiles形式に変換
convert: download
    @echo "=== ベクトルタイルを PMTiles に変換 ==="
    @export PATH="$$PATH:$$(go env GOPATH)/bin" && \
    if [ ! -f "cartoball.pmtiles" ]; then \
        echo "Step 1: ディレクトリ構造から MBTiles に変換..."; \
        mb-util --image_format=pbf data/cartotile-plain-design/data/cartotile_v01.1 cartoball.mbtiles; \
        echo "Step 2: MBTiles から PMTiles に変換..."; \
        go-pmtiles convert cartoball.mbtiles cartoball.pmtiles; \
        echo "Step 3: public ディレクトリにコピー..."; \
        mkdir -p public; \
        cp cartoball.pmtiles public/; \
        echo "✅ cartoball.pmtiles を作成しました"; \
    else \
        echo "cartoball.pmtiles は既に存在します"; \
        if [ ! -f "public/cartoball.pmtiles" ]; then \
            mkdir -p public; \
            cp cartoball.pmtiles public/; \
        fi; \
    fi

# 依存関係をインストール
install:
    @echo "=== npm 依存関係のインストール ==="
    @npm install

# 開発サーバーを起動
dev: install
    @echo "=== 開発サーバーを起動 ==="
    @npm run dev

# 本番用ビルド (docs/ ディレクトリにハッシュなしで出力)
build: install
    @echo "=== 本番用ビルドを実行 ==="
    @npm run build

# docsディレクトリをクリーンアップ
clean-docs:
    @echo "=== docs ディレクトリをクリーンアップ ==="
    @rm -rf docs

# すべてをクリーンアップ
clean: clean-docs
    @echo "=== すべてのビルド成果物をクリーンアップ ==="
    @rm -rf node_modules dist data cartoball.pmtiles

# すべてのタスクを実行 (初回セットアップ用)
all: convert build
    @echo "✅ すべてのタスクが完了しました"
