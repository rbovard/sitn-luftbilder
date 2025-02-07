import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import Projection from 'ol/proj/Projection';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import { optionsFromCapabilities } from 'ol/source/WMTS';

const params = new URLSearchParams(document.location.search);
const url = params.get('url');
const east = parseFloat(params.get('east'));
const north = parseFloat(params.get('north'));
const img_type = params.get('type');

const img_type_tag = document.getElementById('image_type');
img_type === 'ortho'
  ? img_type_tag.innerText = 'Type d\'image: Orthophoto'
  : img_type_tag.innerText = 'Type d\'image: Image aérienne';

const img = url.split('/').slice(-1);
const h5 = document.getElementById('image_id');
const aTag = document.createElement('a');
aTag.href = url;
aTag.innerHTML = img;
aTag.setAttribute('target', '_blank');
h5.appendChild(aTag);

const crs = 'EPSG:2056';
const matrixSet = import.meta.env.VITE_WMTS_MATRIXSET;
const capabilitiesUrl = import.meta.env.VITE_WMTS_CAPABILITIES_URL;
const backgroundLayerName = import.meta.env.VITE_WMTS_BACKGROUND_LAYER_NAME;

let imgLayer;

proj4.defs(crs,
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333'
  + ' +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel '
  + '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs');

register(proj4);
const projection = new Projection({
  code: crs,
});

fetch(capabilitiesUrl)
  .then(response => response.text())
  .then(text => {
    const parser = new WMTSCapabilities();
    const result = parser.read(text);

    const options = optionsFromCapabilities(result, {
      layer: backgroundLayerName,
      matrixSet: matrixSet,
    });

    const wmtsSource = new WMTS(options);
    const extent = wmtsSource.getTileGrid().getExtent();
    projection.setExtent(extent);
    const resolutions = wmtsSource.getResolutions();
    const matrixIds = resolutions.map((_, index) => index);
    const tileGrid = new WMTSTileGrid({
        origin: [extent[0], extent[3]],
        resolutions,
        matrixIds,
    });

    wmtsSource.tileGrid = tileGrid;
    wmtsSource.projection = projection;

    const backgroundLayer = new TileLayer({
      source: wmtsSource
    });

    imgLayer = new WebGLTileLayer({
      style: {
        color: [
          'case',
          ['<', ['*', ['band', 1], 255], 10],
          ['color', 255, 0, 0, 0],
          ['color', ['*', ['band', 1], 255], 1]
        ],
      },
      source: new GeoTIFF({
        sources: [{ url: url, nodata: NaN }]
      }),
    });

    const view = new View({
      projection,
      resolutions,
      resolution: 10,
      constrainResolution: true,
      center: [east, north],
    });

    new Map({
      layers: [backgroundLayer, imgLayer],
      target: 'sitn-map',
      view,
    });
  });

const opacityInput = document.getElementById('opacity-input');
const opacityOutput = document.getElementById('opacity-output');

function update() {
  const opacity = parseFloat(opacityInput.value);
  imgLayer.setOpacity(opacity);
  opacityOutput.innerText = opacity.toFixed(2);
}
opacityInput.addEventListener('input', update);
