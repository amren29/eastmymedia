# VOOH (Mobile Ads) Feature Integration Guide

I have added the "Mobile Ads" (VOOH) feature to your Mapbox map. Here is the summary of changes and how to use it.

## 1. New Layer Component (`src/components/map/VOOHLayer.ts`)
I created a new class `VOOHLayer` that handles:
-   **District Polygons**: Displays Kota Kinabalu, Penampang, and Putatan with color-coded fills.
-   **Interactions**: Handles hover effects (opacity change) and click events (zoom + popup).
-   **Suggested Route**: Draws a blue line representing a mobile ad route.
-   **Popups**: Shows detailed information (Traffic, Reach, Price, Routes) when a district is clicked.

## 2. MapboxMap Updates (`src/components/map/MapboxMap.tsx`)
I updated the `MapboxMap` component to integrate the new layer:
-   **Import**: Added `import { VOOHLayer } from './VOOHLayer';`
-   **Prop**: Added `showVOOH` to `MapboxMapProps`.
-   **Ref**: Added `const voohLayer = useRef<VOOHLayer | null>(null);`
-   **Effect**: Added a `useEffect` hook to initialize/remove the layer based on the `showVOOH` prop.

## 3. Explore Page Updates (`src/app/[locale]/explore/page.tsx`)
I updated the Explore page to control the feature:
-   **State**: Added `const [showVOOH, setShowVOOH] = useState(false);`
-   **Button**: Added a "Mobile Ads" toggle button in the filter section.
-   **Prop Passing**: Passed `showVOOH={showVOOH}` to the `MapboxMap` component.

## How to Test
1.  Go to the **Explore** page.
2.  Click the **Mobile Ads** button in the filter bar.
3.  **Observe**:
    -   Colored polygons appear for KK, Penampang, and Putatan.
    -   A blue route line appears.
4.  **Interact**:
    -   **Hover** over a district to see it highlight.
    -   **Click** a district to zoom in and see the detailed popup with "View Ad Plan" CTA.

## Customization
-   **Data**: Update `DISTRICTS_GEOJSON` in `src/components/map/VOOHLayer.ts` with real coordinates and data from your API.
-   **Styling**: Modify the `paint` properties in `VOOHLayer.ts` to match your brand colors exactly.
