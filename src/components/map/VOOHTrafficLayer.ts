import mapboxgl from 'mapbox-gl';

export class VOOHTrafficLayer {
    private map: mapboxgl.Map;
    private sourceId = 'vooh-traffic-source';
    private lineLayerId = 'vooh-traffic-line-layer';
    private flowLayerId = 'vooh-traffic-flow-layer';
    private animationFrameId: number | null = null;
    private popup: mapboxgl.Popup | null = null;

    constructor(map: mapboxgl.Map) {
        this.map = map;
    }

    initialize() {
        // 1. Add Mapbox Traffic Source
        if (!this.map.getSource(this.sourceId)) {
            this.map.addSource(this.sourceId, {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-traffic-v1'
            });
        }

        // 2. Add Base Line Layer (Colored by traffic congestion)
        if (!this.map.getLayer(this.lineLayerId)) {
            this.map.addLayer({
                id: this.lineLayerId,
                type: 'line',
                source: this.sourceId,
                'source-layer': 'traffic',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-width': 6,
                    'line-color': [
                        'case',
                        ['==', ['get', 'congestion'], 'low'], '#6BB6FF',      // Soft Blue - Low Traffic
                        ['==', ['get', 'congestion'], 'moderate'], '#FFD700',  // Yellow - Moderate Traffic
                        ['==', ['get', 'congestion'], 'heavy'], '#FF6B6B',     // Soft Red - High Traffic
                        ['==', ['get', 'congestion'], 'severe'], '#FF0000',    // Red - Very High Traffic
                        '#6BB6FF' // Default to soft blue
                    ],
                    'line-opacity': 0.8
                }
            });
        }

        // 3. Add Flow Animation Layer (Single layer with shifting pattern)
        if (!this.map.getLayer(this.flowLayerId)) {
            this.map.addLayer({
                id: this.flowLayerId,
                type: 'line',
                source: this.sourceId,
                'source-layer': 'traffic',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-width': 4,
                    'line-color': '#FFFFFF',
                    'line-dasharray': [2, 3], // Initial pattern: Dash 2, Gap 3
                    'line-opacity': 0.6
                }
            });
        }

        // 4. Start Animation
        this.startAnimation();

        // 5. Add Interactions
        this.addInteractions();
    }

    private startAnimation() {
        const dashLength = 2;
        const gapLength = 3;
        const totalLength = dashLength + gapLength;
        let offset = 0;

        const animateDashArray = () => {
            if (this.map.getLayer(this.flowLayerId)) {
                // Increment offset to move the pattern (speed = 0.05)
                // We move backwards (negative offset) to make it flow forward along the line direction usually
                // But let's try positive first.
                offset = (offset + 0.05) % totalLength;

                // Calculate the phase within the pattern
                // We want to shift the pattern "right" by offset.
                // This effectively means we start 'offset' into the pattern.

                let newDashArray;

                // Logic:
                // Pattern is [Dash, Gap]
                // If we are at 'offset', are we in Dash or Gap?

                if (offset < dashLength) {
                    // We are inside the Dash part.
                    // The pattern starts with the *remainder* of the dash.
                    // Then the full Gap.
                    // Then the *consumed* part of the dash (to complete the cycle).
                    // Array: [RemainderDash, Gap, ConsumedDash, 0]
                    // ConsumedDash + RemainderDash = DashLength.
                    // ConsumedDash = offset.
                    // RemainderDash = dashLength - offset.
                    newDashArray = [dashLength - offset, gapLength, offset, 0];
                } else {
                    // We are inside the Gap part.
                    const gapOffset = offset - dashLength;
                    // We start with 0 Dash (to start with Gap).
                    // Then the *remainder* of the Gap.
                    // Then the full Dash.
                    // Then the *consumed* part of the Gap.
                    // Array: [0, RemainderGap, Dash, ConsumedGap]
                    newDashArray = [0, gapLength - gapOffset, dashLength, gapOffset];
                }

                this.map.setPaintProperty(this.flowLayerId, 'line-dasharray', newDashArray);
            }

            this.animationFrameId = requestAnimationFrame(animateDashArray);
        };

        this.animationFrameId = requestAnimationFrame(animateDashArray);
    }

    private addInteractions() {
        // Hover effect
        this.map.on('mouseenter', this.lineLayerId, () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', this.lineLayerId, () => {
            this.map.getCanvas().style.cursor = '';
        });

        // Click popup
        this.map.on('click', this.lineLayerId, (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const props = feature.properties;

                if (props) {
                    const congestion = props.congestion || 'low';

                    // Map congestion to color and percentage
                    let color = '#6BB6FF';
                    let percentage = 25;
                    let statusText = 'Low Traffic';

                    if (congestion === 'severe') {
                        color = '#FF0000';
                        percentage = 95;
                        statusText = 'Very High Traffic';
                    } else if (congestion === 'heavy') {
                        color = '#FF6B6B';
                        percentage = 70;
                        statusText = 'High Traffic';
                    } else if (congestion === 'moderate') {
                        color = '#FFD700';
                        percentage = 50;
                        statusText = 'Moderate Traffic';
                    }

                    const roadName = props.name || 'Road Segment';

                    const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${roadName}</h3>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color};"></div>
                <span style="font-weight: 600; font-size: 13px;">${statusText} (${percentage}%)</span>
              </div>
              <p style="font-size: 11px; color: #666; line-height: 1.4;">
                Higher traffic = higher visibility for mobile ads.
              </p>
            </div>
          `;

                    if (this.popup) this.popup.remove();

                    this.popup = new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(this.map);
                }
            }
        });
    }

    remove() {
        // Stop animation
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Remove popup
        if (this.popup) {
            this.popup.remove();
            this.popup = null;
        }

        // Remove layers and source
        if (this.map.getLayer(this.flowLayerId)) {
            this.map.removeLayer(this.flowLayerId);
        }
        // Also check for any old multi-layers just in case
        const flowLayers = ['flow-1', 'flow-2', 'flow-3', 'flow-4'];
        flowLayers.forEach((layerId) => {
            const fullLayerId = `${this.flowLayerId}-${layerId}`;
            if (this.map.getLayer(fullLayerId)) {
                this.map.removeLayer(fullLayerId);
            }
        });

        if (this.map.getLayer(this.lineLayerId)) {
            this.map.removeLayer(this.lineLayerId);
        }
        if (this.map.getSource(this.sourceId)) {
            this.map.removeSource(this.sourceId);
        }

        // Remove event listeners
        this.map.off('click', this.lineLayerId, () => { });
        this.map.off('mouseenter', this.lineLayerId, () => { });
        this.map.off('mouseleave', this.lineLayerId, () => { });
    }
}
