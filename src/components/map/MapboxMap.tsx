"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Billboard } from '@/lib/data';

import { TrafficLayer } from './TrafficLayer';
import { VOOHTrafficLayer } from './VOOHTrafficLayer';
import { CrowdDensityLayer } from './CrowdDensityLayer';

// Map styles for day and night
const DAY_STYLE = 'mapbox://styles/mapbox/streets-v12';
const NIGHT_STYLE = 'mapbox://styles/mapbox/navigation-night-v1';

// Helper function to check if it's night time (7 PM to 6 AM)
function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6;
}

// Get current map style based on time
function getMapStyle(): string {
  return isNightTime() ? NIGHT_STYLE : DAY_STYLE;
}

interface MapboxMapProps {
  billboards?: Billboard[];
  onBillboardSelect?: (billboard: Billboard) => void;

  showBillboards?: boolean;
  showDigitalBillboards?: boolean;
  showTraffic?: boolean;
  showVOOHTraffic?: boolean;
  showCrowdDensity?: boolean;
  showRoadsideBunting?: boolean;
}

export function MapboxMap({
  billboards = [],
  onBillboardSelect,

  showBillboards = true,
  showDigitalBillboards = true,
  showTraffic = false,
  showVOOHTraffic = false,
  showCrowdDensity = false,
  showRoadsideBunting = false,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const trafficLayer = useRef<TrafficLayer | null>(null);
  const voohTrafficLayer = useRef<VOOHTrafficLayer | null>(null);
  const crowdDensityLayer = useRef<CrowdDensityLayer | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; billboard: Billboard }>>(new Map());

  // Calculate initial center from billboards or use default
  const getInitialCenter = () => {
    if (billboards.length > 0 && billboards[0].latitude && billboards[0].longitude) {
      return {
        lng: billboards[0].longitude,
        lat: billboards[0].latitude,
        zoom: billboards.length === 1 ? 14 : 11 // Closer zoom for single billboard
      };
    }
    // Focus East Malaysia if no billboards
    return { lng: 113.5, lat: 3.5, zoom: 6 };
  };

  const initialCenter = getInitialCenter();
  const [lng, setLng] = useState(initialCenter.lng);
  const [lat, setLat] = useState(initialCenter.lat);
  const [zoom, setZoom] = useState(initialCenter.zoom);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(getMapStyle());

  // Keep the ref updated with the latest callback


  // Check and update map style based on time (every minute)
  useEffect(() => {
    const checkTimeAndUpdateStyle = () => {
      const newStyle = getMapStyle();
      if (newStyle !== currentStyle && map.current) {
        setCurrentStyle(newStyle);

        // Store current center and zoom
        const center = map.current.getCenter();
        const currentZoom = map.current.getZoom();

        // Set new style
        map.current.setStyle(newStyle);

        // Re-add layers after style loads
        map.current.once('style.load', () => {
          // Restore position
          map.current?.setCenter(center);
          map.current?.setZoom(currentZoom);

          // Re-initialize bunting layers if active


          // Re-initialize Traffic Layer
          if (showTraffic && trafficLayer.current) {
            trafficLayer.current.initialize();
          }

          // Re-initialize VOOH Traffic Layer
          if (showVOOHTraffic && voohTrafficLayer.current) {
            voohTrafficLayer.current.initialize();
          }

          // Re-initialize Crowd Density Layer
          if (showCrowdDensity && crowdDensityLayer.current) {
            crowdDensityLayer.current.initialize();
          }
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeAndUpdateStyle, 60000);

    return () => clearInterval(interval);
  }, [currentStyle]);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      // Token not found - UI will show error message
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    setMapLoaded(true);

  }, [lng, lat, zoom]);

  // Add/update markers when billboards change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current.clear();

    // Add markers
    billboards.forEach((billboard) => {
      // Skip billboards with missing coordinates
      if (!billboard.latitude || !billboard.longitude) {
        return;
      }

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = billboard.type === 'Digital' ? '#0066FF' :
        (billboard.type === 'LED' || billboard.type === 'LED Screen') ? '#0066FF' :
          billboard.type === 'Roadside Bunting' ? '#f97316' :
            '#10B981';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%'; // Circle marker
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Add click event to marker to filter the list
      el.addEventListener('click', () => {
        if (onBillboardSelect) {
          onBillboardSelect(billboard);
        }
      });

      // Create popup content with card design
      const popupContent = `
        <div class="billboard-popup" style="width: 280px; padding: 0; margin: 0;">
          <div style="position: relative; width: 100%; height: 160px; overflow: hidden; border-radius: 0;">
            <img 
              src="${billboard.image}" 
              alt="${billboard.name}"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <div style="position: absolute; top: 8px; right: 8px;">
              <span style="background: rgba(255,255,255,0.95); padding: 4px 8px; border-radius: 0; font-size: 11px; font-weight: 600; color: #1e293b;">
                ${billboard.type}
              </span>
            </div>
          </div>
          <div style="padding: 12px;">
            <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3; color: #0f172a;">
              ${billboard.name}
            </h3>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; display: flex; align-items: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${billboard.location}
            </p>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 12px 0;">
              <strong style="color: #0f172a;">Size:</strong> ${billboard.size}
            </p>
            <div style="display: flex; gap: 8px;">
            <button
              id="view-details-${billboard.id}"
              style="
                flex: 1;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              "
              onmouseover="this.style.background='#2563eb'"
              onmouseout="this.style.background='#3b82f6'"
            >
              View Details
            </button>
            <button
              id="street-view-${billboard.id}"
              style="
                flex: 1;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              "
              onmouseover="this.style.background='#2563eb'"
              onmouseout="this.style.background='#3b82f6'"
            >
              Street View
            </button>
            </div>
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([billboard.longitude, billboard.latitude])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: true,  // Close popup when clicking elsewhere on map
            maxWidth: '280px',
            className: 'billboard-popup-container'
          })
            .setHTML(popupContent)
        )
        .addTo(map.current!);

      // Store marker reference
      markersRef.current.set(billboard.id, { marker, billboard });

      // Add event listener for the popup open event to attach click handler to button
      const popup = marker.getPopup();
      if (popup) {
        popup.on('open', () => {
          const btn = document.getElementById(`view-details-${billboard.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              // Navigate to billboard detail page
              window.location.href = `/billboard/${billboard.id}`;
            });
          }

          const svBtn = document.getElementById(`street-view-${billboard.id}`);
          if (svBtn) {
            svBtn.addEventListener('click', () => {
              // For Roadside Bunting, use startPoint; otherwise use regular coordinates
              let svLat = billboard.latitude;
              let svLng = billboard.longitude;

              if (billboard.type === 'Roadside Bunting' && billboard.startPoint) {
                const parts = billboard.startPoint.split(',').map(p => p.trim());
                if (parts.length === 2) {
                  svLat = parseFloat(parts[0]);
                  svLng = parseFloat(parts[1]);
                }
              }

              // Open Street View
              window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${svLat},${svLng}`, '_blank');
            });
          }
        });
      }
    });

  }, [billboards, mapLoaded, onBillboardSelect]);

  // Update map center when billboards change
  useEffect(() => {
    if (!map.current || !mapLoaded || billboards.length === 0) return;

    // If single billboard, center on it
    if (billboards.length === 1 && billboards[0].latitude && billboards[0].longitude) {
      map.current.flyTo({
        center: [billboards[0].longitude, billboards[0].latitude],
        zoom: 14,
        duration: 1000
      });
    }
  }, [billboards, mapLoaded]);

  // Handle marker visibility based on filters
  useEffect(() => {
    if (!mapLoaded) return;

    markersRef.current.forEach(({ marker, billboard }) => {
      const isDigital = billboard.type === 'Digital' || billboard.type === 'LED' || billboard.type === 'LED Screen';
      const isBunting = billboard.type === 'Roadside Bunting';

      // Determine if marker should be visible
      let shouldShow = false;

      if (isBunting) {
        shouldShow = showRoadsideBunting;
      } else if (isDigital) {
        shouldShow = showDigitalBillboards;
      } else {
        // Default to static billboard for other types
        shouldShow = showBillboards;
      }

      // Get marker element and toggle visibility
      const el = marker.getElement();
      if (el) {
        el.style.display = shouldShow ? 'flex' : 'none';
      }
    });
  }, [showBillboards, showDigitalBillboards, showRoadsideBunting, mapLoaded]);

  // Handle bunting polyline rendering with road-following routes and animation
  const buntingLinesRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Helper to parse GPS string to coordinates
    const parseGPS = (gps: string): [number, number] | null => {
      if (!gps) return null;
      const parts = gps.split(',').map(p => p.trim());
      if (parts.length !== 2) return null;
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (isNaN(lat) || isNaN(lng)) return null;
      return [lng, lat]; // Mapbox uses [lng, lat] order
    };

    // Clean up existing bunting lines and animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    buntingLinesRef.current.forEach(id => {
      if (map.current?.getLayer(id)) {
        map.current.removeLayer(id);
      }
      if (map.current?.getSource(id)) {
        map.current.removeSource(id);
      }
    });
    buntingLinesRef.current.clear();

    // Only render if bunting filter is active
    if (!showRoadsideBunting) return;

    // Fetch road route from Mapbox Directions API
    const fetchRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${token}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes[0]?.geometry?.coordinates) {
          return data.routes[0].geometry.coordinates;
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
      // Fallback to straight line if API fails
      return [start, end];
    };

    // Process all bunting billboards
    const processBuntings = async () => {
      const layerIds: string[] = [];

      for (const billboard of billboards) {
        if (billboard.type !== 'Roadside Bunting') continue;

        const startCoord = parseGPS(billboard.startPoint || '');
        const endCoord = parseGPS(billboard.endPoint || '');

        if (!startCoord || !endCoord) continue;

        const sourceId = `bunting-line-${billboard.id}`;
        const layerId = `bunting-line-layer-${billboard.id}`;
        const bgLayerId = `bunting-line-bg-${billboard.id}`;

        // Fetch road-following route
        const routeCoordinates = await fetchRoute(startCoord, endCoord);

        // Check if source already exists (from style reload)
        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }

        // Add source with route coordinates
        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              name: billboard.name,
              id: billboard.id
            },
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates
            }
          }
        });

        // Add background line layer (solid orange)
        map.current!.addLayer({
          id: bgLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#f97316',
            'line-width': 6,
            'line-opacity': 0.4
          }
        });

        // Add animated dashed line layer
        map.current!.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 3,
            'line-dasharray': [0, 2, 1]
          }
        });

        buntingLinesRef.current.add(sourceId);
        buntingLinesRef.current.add(layerId);
        buntingLinesRef.current.add(bgLayerId);
        layerIds.push(layerId);
      }

      // Animate the dashed lines
      if (layerIds.length > 0) {
        let dashOffset = 0;
        const animateDash = () => {
          dashOffset = (dashOffset + 0.1) % 3;
          const dashArray = [0, dashOffset, 1, 3 - dashOffset - 1];

          layerIds.forEach(layerId => {
            if (map.current?.getLayer(layerId)) {
              map.current.setPaintProperty(layerId, 'line-dasharray', dashArray);
            }
          });

          animationRef.current = requestAnimationFrame(animateDash);
        };
        animateDash();
      }
    };

    processBuntings();

    return () => {
      // Cleanup on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      buntingLinesRef.current.forEach(id => {
        if (map.current?.getLayer(id)) {
          map.current.removeLayer(id);
        }
        if (map.current?.getSource(id)) {
          map.current.removeSource(id);
        }
      });
    };
  }, [billboards, showRoadsideBunting, mapLoaded]);



  // Handle traffic layer visibility
  useEffect(() => {
    if (!map.current) return;

    const initTrafficLayer = async () => {
      if (showTraffic) {
        const { TrafficLayer } = await import('./TrafficLayer');
        if (!trafficLayer.current) {
          trafficLayer.current = new TrafficLayer(map.current!);
          trafficLayer.current.initialize();
        }
      } else {
        if (trafficLayer.current) {
          trafficLayer.current.remove();
          trafficLayer.current = null;
        }
      }
    };

    if (map.current.loaded()) {
      initTrafficLayer();
    } else {
      map.current.on('load', initTrafficLayer);
    }

    return () => {
      if (trafficLayer.current) {
        trafficLayer.current.remove();
        trafficLayer.current = null;
      }
    };
  }, [showTraffic]);

  // Handle VOOH traffic layer visibility
  useEffect(() => {
    if (!map.current) return;

    const initVOOHTrafficLayer = async () => {
      if (showVOOHTraffic) {
        const { VOOHTrafficLayer } = await import('./VOOHTrafficLayer');
        if (!voohTrafficLayer.current) {
          voohTrafficLayer.current = new VOOHTrafficLayer(map.current!);
          voohTrafficLayer.current.initialize();
        }
      } else {
        if (voohTrafficLayer.current) {
          voohTrafficLayer.current.remove();
          voohTrafficLayer.current = null;
        }
      }
    };

    if (map.current.loaded()) {
      initVOOHTrafficLayer();
    } else {
      map.current.on('load', initVOOHTrafficLayer);
    }

    return () => {
      if (voohTrafficLayer.current) {
        voohTrafficLayer.current.remove();
        voohTrafficLayer.current = null;
      }
    };
  }, [showVOOHTraffic]);

  // Handle crowd density layer visibility
  useEffect(() => {
    if (!map.current) return;

    const initCrowdLayer = async () => {
      if (showCrowdDensity) {
        const { CrowdDensityLayer } = await import('./CrowdDensityLayer');
        if (!crowdDensityLayer.current) {
          crowdDensityLayer.current = new CrowdDensityLayer(map.current!);
          crowdDensityLayer.current.initialize();
        }
      } else {
        if (crowdDensityLayer.current) {
          crowdDensityLayer.current.remove();
          crowdDensityLayer.current = null;
        }
      }
    };

    if (map.current.loaded()) {
      initCrowdLayer();
    } else {
      map.current.on('load', initCrowdLayer);
    }

    return () => {
      if (crowdDensityLayer.current) {
        crowdDensityLayer.current.remove();
        crowdDensityLayer.current = null;
      }
    };
  }, [showCrowdDensity]);

  return (
    <div className="relative h-full w-full bg-slate-100">
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10 p-4">
          <div className="text-center max-w-md bg-white p-6 rounded-lg shadow-lg border border-red-100">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">Map Configuration Missing</h3>
            <p className="mt-2 text-sm text-slate-500">
              The Mapbox access token is missing. Please add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code>.env.local</code> file.
            </p>
            <div className="mt-4 rounded-md bg-slate-50 p-3 text-left text-xs font-mono text-slate-600 border">
              NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
            </div>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="h-full w-full" />
      )}

      <style jsx global>{`
        .billboard-popup-container .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 0 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .billboard-popup-container .mapboxgl-popup-close-button {
          font-size: 20px;
          padding: 8px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 8px;
          top: 8px;
        }
        .billboard-popup-container .mapboxgl-popup-close-button:hover {
          background: rgba(0, 0, 0, 0.7);
        }

      `}</style>
    </div>
  );
}
