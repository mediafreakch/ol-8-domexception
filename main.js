import './style.css';

import OlMap from 'ol/Map.js';
import Static from 'ol/source/ImageStatic.js';
import View from 'ol/View.js';
import { Image as ImageLayer } from 'ol/layer.js';
import Projection from 'ol/proj/Projection';
import { getCenter } from 'ol/extent.js';
import axios from 'axios';

const imageExtent = [0, 0, 7907, 4466];
const imageLayer = new ImageLayer();
const projection = new Projection({
  code: 'image',
  units: 'pixels',
  extent: imageExtent,
});

const map = new OlMap({
  layers: [imageLayer],
  target: 'map',
  view: new View({
    center: getCenter(imageExtent),
    zoom: 1,
    projection,
  }),
});

function setSource() {
  const source = new Static({
    url: 'foto2.jpg',
    projection,
    imageExtent: imageExtent,
    imageLoadFunction: async (image, src) => {
      let blobOptions = {};

      try {
        const { data: buffer, headers } = await axios.get(src, {
          responseType: 'arraybuffer',
          onDownloadProgress: (progress) => {
            console.log(
              'Download progress:',
              Math.floor((progress.loaded / progress.total) * 100)
            );
          },
        });

        const mimeType = headers['content-type'];
        blobOptions.type = mimeType && mimeType;

        const blob = new Blob([buffer], blobOptions);
        image.getImage().src = URL.createObjectURL(blob);
      } catch (e) {}
    },
  });

  imageLayer.setSource(source);
}
setSource();
