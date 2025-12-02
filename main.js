import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';

// ============================================================================
// 定数定義
// ============================================================================

// 色の定数（宇宙とグローブのテーマ）
const COLORS = {
  space: '#0a0a14',
  ocean: '#1a3a5c',
  land: '#ededed',
  border: '#4d4d4d'
};

// 境界線レイヤーの共通設定
const BOUNDARY_LAYER_BASE = {
  source: 'cartoball',
  'source-layer': 'bndl',
  maxzoom: 4,
  minzoom: 0
};

// 境界線の共通ペイント設定
const BOUNDARY_PAINT_BASE = {
  'line-color': ['rgb', 77, 77, 77],
  'line-width': 0.8
};

// ============================================================================
// マップスタイル定義
// ============================================================================

const mapStyle = {
  version: 8,
  sources: {
    cartoball: {
      type: 'vector',
      tiles: ['https://k96mz.github.io/20240818CartoTileStylized/Data/VTstylized/{z}/{x}/{y}.pbf'],
      minzoom: 0,
      maxzoom: 2,
      attribution: '<div style="font-size: 7pt; line-height: 100%">The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.​ Final boundary between the Republic of Sudan and the Republic of South Sudan has not yet been determined.​<br>* Non-Self Governing Territories<br>** Dotted line represents approximately the Line of Control in Jammu and Kashmir agreed upon by India and Pakistan. The final status of Jammu and Kashmir has not yet been agreed upon by the parties.​<br>*** A dispute exists between the Governments of Argentina and the United Kingdom of Great Britain and Northern Ireland concerning sovereignty over the Falkland Islands (Malvinas).</div><div style="font-size: 5pt; color: #009EDB" valign="bottom">Powered by<br><img src="https://unopengis.github.io/watermark/watermark.png" alt="UN OpenGIS logo" width="50" height="50"></div><div style="font-size: 7pt; margin-top: 5px;">Based on <a href="https://github.com/UN-Geospatial/cartotile-plain-design" target="_blank">UN Geospatial cartotile-plain-design</a></div>'
    }
  },
  glyphs: 'https://UN-Geospatial.github.io/cartotile-plain-design/font/{fontstack}/{range}.pbf',
  transition: { duration: 0, delay: 0 },
  layers: [
    {
      id: 'background',
      type: 'background',
      layout: { visibility: 'visible' },
      paint: { 'background-color': COLORS.ocean }
    },
    {
      id: 'bnda',
      type: 'fill',
      source: 'cartoball',
      'source-layer': 'bnda',
      maxzoom: 4,
      minzoom: 0,
      filter: ['none', ['==', 'ISO3CD', 'ATA']],
      paint: { 'fill-color': ['rgb', 237, 237, 237] }
    },
    {
      id: 'bndl_solid',
      type: 'line',
      ...BOUNDARY_LAYER_BASE,
      filter: ['any', ['==', 'bdytyp', 1], ['==', 'bdytyp', 0], ['==', 'bdytyp', 2]],
      paint: BOUNDARY_PAINT_BASE
    },
    {
      id: 'bndl_dashed',
      type: 'line',
      ...BOUNDARY_LAYER_BASE,
      filter: ['all', ['==', 'bdytyp', 3]],
      paint: { ...BOUNDARY_PAINT_BASE, 'line-dasharray': [3, 2] }
    },
    {
      id: 'bndl_dotted',
      type: 'line',
      ...BOUNDARY_LAYER_BASE,
      filter: ['all', ['==', 'bdytyp', 4]],
      paint: { ...BOUNDARY_PAINT_BASE, 'line-dasharray': [1, 2] }
    }
  ]
};

// スカイ設定（宇宙背景効果）
const skyConfig = {
  'sky-color': COLORS.space,
  'sky-horizon-blend': 0.5,
  'horizon-color': COLORS.ocean,
  'horizon-fog-blend': 0.8,
  'fog-color': COLORS.space,
  'fog-ground-blend': 0.9
};

// ============================================================================
// ヘルパー関数
// ============================================================================

/**
 * ステータスコードに基づいてポップアップHTMLを生成
 * @param {number} stscod - ステータスコード
 * @param {string} lbl_en - 英語ラベル
 * @returns {string|null} HTML文字列、または表示しない場合はnull
 */
function generatePopupHtml(stscod, lbl_en) {
  const upperCaseCodes = [1, 2];
  const normalCodes = [3, 4, 5, 6];
  
  if (upperCaseCodes.includes(stscod)) {
    return `<p class="stscod${stscod}">${lbl_en.toUpperCase()}</p>`;
  }
  
  if (normalCodes.includes(stscod)) {
    return `<p class="stscod${stscod}">${lbl_en}</p>`;
  }
  
  if (stscod === 99 && lbl_en === 'Jammu and Kashmir') {
    return `<p class="stscod6">${lbl_en}​</p>`;
  }
  
  return null;
}

// ============================================================================
// マップ初期化
// ============================================================================

// PMTilesプロトコルを登録
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// マップを初期化
const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle,
  center: [0, 20],
  zoom: 0.8,
  maxZoom: 2,
  hash: true,
  attributionControl: true,
  renderWorldCopies: false
});

// ポップアップインスタンス
const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false
});

// ============================================================================
// イベントハンドラ
// ============================================================================

// スタイルロード時にグローブビューを確実に設定
// style.load イベントを使用することで、マップが完全に初期化された後に
// グローブプロジェクションを設定し、確実にグローブビューで表示される
map.on('style.load', () => {
  map.setProjection({ type: 'globe' });
  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.GlobeControl());
  map.setSky(skyConfig);
});

// ホバー時のポップアップ表示
map.on('mousemove', 'bnda', (e) => {
  map.getCanvas().style.cursor = 'pointer';
  
  const { stscod, lbl_en } = e.features[0].properties;
  const html = generatePopupHtml(stscod, lbl_en);
  
  if (html) {
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
  } else {
    popup.remove();
  }
});

// ホバー離脱時のポップアップ削除
map.on('mouseleave', 'bnda', () => {
  map.getCanvas().style.cursor = '';
  popup.remove();
});
