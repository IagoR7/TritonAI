import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
// ESTE É UM TESTE PARA O COMMIT
import mockHotspots from '../data/mockHotspots.json';

mapboxgl.accessToken = "pk.eyJ1IjoiZXN0ZXJzenkiLCJhIjoiY21mMXZxdWN3MTMweDJpcHpvdGhlMngyNSJ9.c0ejHv0aJlpe03h4acYJgw"

export const Map = ({ viewport }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      pitchWithRotate: false, 
      dragRotate: false,      
    });

    map.current.on('load', () => {
      
      const geojsonData = {
        type: 'FeatureCollection',
        features: mockHotspots.map(hotspot => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [hotspot.lng, hotspot.lat]
          },
          properties: {
            id: hotspot.id,
            especie: hotspot.especie
          }
        }))
      };

      
      map.current.addSource('hotspots-source', {
        type: 'geojson',
        data: geojsonData
      });

      
      map.current.addLayer({
        id: 'hotspots-layer',
        type: 'circle', 
        source: 'hotspots-source',
        paint: {
          'circle-radius': 8,
          'circle-color': '#646cff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    map.current.flyTo({
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      essential: true,
    });
  }, [viewport]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};