import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PMTiles, Protocol } from 'pmtiles';

// PMTilesプロトコルを登録
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// マップを初期化
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      cartoball: {
        type: 'vector',
        url: 'pmtiles://./cartoball.pmtiles',
        attribution: '<div style="font-size: 7pt; line-height: 100%">The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.​ Final boundary between the Republic of Sudan and the Republic of South Sudan has not yet been determined.​<br>* Non-Self Governing Territories<br>** Dotted line represents approximately the Line of Control in Jammu and Kashmir agreed upon by India and Pakistan. The final status of Jammu and Kashmir has not yet been agreed upon by the parties.​<br>*** A dispute exists between the Governments of Argentina and the United Kingdom of Great Britain and Northern Ireland concerning sovereignty over the Falkland Islands (Malvinas).</div><div style="font-size: 5pt; color: #009EDB" valign="bottom">Powered by<br><img src="https://unopengis.github.io/watermark/watermark.png" alt="UN OpenGIS logo" width="50" height="50"></div><div style="font-size: 7pt; margin-top: 5px;">Based on <a href="https://github.com/UN-Geospatial/cartotile-plain-design" target="_blank">UN Geospatial cartotile-plain-design</a></div>'
      }
    },
    glyphs: 'https://UN-Geospatial.github.io/cartotile-plain-design/font/{fontstack}/{range}.pbf',
    transition: {
      duration: 0,
      delay: 0
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: { 'visibility': 'visible' },
        paint: {
          'background-color': ['rgb', 255, 255, 255]
        }
      },
      {
        id: 'bnda',
        type: 'fill',
        source: 'cartoball',
        'source-layer': 'bnda',
        maxzoom: 4,
        minzoom: 0,
        filter: [
          'none',
          ['==', 'ISO3CD', 'ATA']
        ],
        paint: {
          'fill-color': ['rgb', 237, 237, 237]
        }
      },
      {
        id: 'bndl_solid',
        type: 'line',
        source: 'cartoball',
        'source-layer': 'bndl',
        maxzoom: 4,
        minzoom: 0,
        filter: [
          'any',
          ['==', 'bdytyp', 1],
          ['==', 'bdytyp', 0],
          ['==', 'bdytyp', 2]
        ],
        paint: {
          'line-color': ['rgb', 77, 77, 77],
          'line-width': 0.8
        }
      },
      {
        id: 'bndl_dashed',
        type: 'line',
        source: 'cartoball',
        'source-layer': 'bndl',
        maxzoom: 4,
        minzoom: 0,
        filter: [
          'all',
          ['==', 'bdytyp', 3]
        ],
        paint: {
          'line-color': ['rgb', 77, 77, 77],
          'line-dasharray': [3, 2],
          'line-width': 0.8
        }
      },
      {
        id: 'bndl_dotted',
        type: 'line',
        source: 'cartoball',
        'source-layer': 'bndl',
        maxzoom: 4,
        minzoom: 0,
        filter: [
          'all',
          ['==', 'bdytyp', 4]
        ],
        paint: {
          'line-color': ['rgb', 77, 77, 77],
          'line-dasharray': [1, 2],
          'line-width': 0.8
        }
      }
    ]
  },
  center: [0, 20],
  zoom: 0.8,
  maxZoom: 2,
  projection: 'globe', // Globe mode!
  hash: true,
  attributionControl: true,
  renderWorldCopies: false
});

// ナビゲーションコントロールとグローブコントロールを追加
map.on('load', () => {
  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.GlobeControl());
});

// ポップアップの設定
const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false
});

// ホバー時のポップアップ表示
map.on('mousemove', 'bnda', (e) => {
  map.getCanvas().style.cursor = 'pointer';

  const feature = e.features[0];
  const stscod = feature.properties.stscod;
  const lbl_en = feature.properties.lbl_en;

  let html = '';
  
  if (stscod == 1) {
    html = `<p class="stscod1">${lbl_en.toUpperCase()}</p>`;
  } else if (stscod == 2) {
    html = `<p class="stscod2">${lbl_en.toUpperCase()}</p>`;
  } else if (stscod == 3) {
    html = `<p class="stscod3">${lbl_en}</p>`;
  } else if (stscod == 4) {
    html = `<p class="stscod4">${lbl_en}</p>`;
  } else if (stscod == 5) {
    html = `<p class="stscod5">${lbl_en}</p>`;
  } else if (stscod == 6) {
    html = `<p class="stscod6">${lbl_en}</p>`;
  } else if (stscod == 99) {
    if (lbl_en == "Jammu and Kashmir") {
      html = `<p class="stscod6">${lbl_en}​</p>`;
      popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
    } else {
      popup.remove();
      return;
    }
  }

  if (html) {
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
  }
});

// ホバー離脱時のポップアップ削除
map.on('mouseleave', 'bnda', () => {
  map.getCanvas().style.cursor = '';
  popup.remove();
});
