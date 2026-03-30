import mapboxgl from 'mapbox-gl';

// Mock data for crowd density in Kota Kinabalu, Penampang, and Putatan
const CROWD_DATA: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        // Kota Kinabalu City Centre
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0732, 5.9784] }, properties: { intensity: 0.9 } }, // Gaya Street
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0715, 5.9820] }, properties: { intensity: 0.8 } }, // Suria Sabah
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0660, 5.9720] }, properties: { intensity: 0.85 } }, // Imago
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0750, 5.9750] }, properties: { intensity: 0.7 } }, // KK Waterfront

        // Penampang
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0900, 5.9300] }, properties: { intensity: 0.75 } }, // Donggongon
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0850, 5.9250] }, properties: { intensity: 0.6 } }, // ITCC

        // Putatan
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0550, 5.9000] }, properties: { intensity: 0.7 } }, // Putatan Town
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0500, 5.8950] }, properties: { intensity: 0.65 } }, // One Place Mall area

        // Scattered points to create a more natural heatmap
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0740, 5.9790] }, properties: { intensity: 0.6 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0720, 5.9810] }, properties: { intensity: 0.5 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0670, 5.9730] }, properties: { intensity: 0.6 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0910, 5.9310] }, properties: { intensity: 0.5 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [116.0560, 5.9010] }, properties: { intensity: 0.5 } },
    ]
};

export class CrowdDensityLayer {
    private map: mapboxgl.Map;
    private sourceId = 'crowd-density';
    private layerId = 'crowd-heatmap';

    constructor(map: mapboxgl.Map) {
        this.map = map;
    }

    initialize() {
        if (this.map.getSource(this.sourceId)) return;

        this.map.addSource(this.sourceId, {
            type: 'geojson',
            data: CROWD_DATA
        });

        this.map.addLayer({
            id: this.layerId,
            type: 'heatmap',
            source: this.sourceId,
            paint: {
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'intensity'],
                    0, 0,
                    1, 1
                ],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 1,
                    15, 3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33,102,172,0)',
                    0.2, 'rgb(103,169,207)',
                    0.4, 'rgb(209,229,240)',
                    0.6, 'rgb(253,219,199)',
                    0.8, 'rgb(239,138,98)',
                    1, 'rgb(178,24,43)'
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 2,
                    9, 20
                ],
                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7, 1,
                    15, 0.5
                ],
            }
        });
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
