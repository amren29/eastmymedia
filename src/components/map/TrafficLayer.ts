import mapboxgl from 'mapbox-gl';

export class TrafficLayer {
  private map: mapboxgl.Map;
  private sourceId = 'mapbox-traffic';
  private layerId = 'traffic-layer';

  constructor(map: mapboxgl.Map) {
    this.map = map;
  }

  initialize() {
    // Add source if it doesn't exist
    if (!this.map.getSource(this.sourceId)) {
      this.map.addSource(this.sourceId, {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
      });
    }

    // Add layer if it doesn't exist
    if (!this.map.getLayer(this.layerId)) {
      this.map.addLayer({
        id: this.layerId,
        type: 'line',
        source: this.sourceId,
        'source-layer': 'traffic',
        paint: {
          'line-width': 3,
          'line-color': [
            'case',
            ['==', ['get', 'congestion'], 'low'], '#4ade80', // Green
            ['==', ['get', 'congestion'], 'moderate'], '#facc15', // Yellow
            ['==', ['get', 'congestion'], 'heavy'], '#f87171', // Red
            ['==', ['get', 'congestion'], 'severe'], '#ef4444', // Dark Red
            '#000000' // Default
          ]
        }
      });
    }
  }

  remove() {
    if (this.map.getLayer(this.layerId)) {
      this.map.removeLayer(this.layerId);
    }
    if (this.map.getSource(this.sourceId)) {
      this.map.removeSource(this.sourceId);
    }
  }
}
