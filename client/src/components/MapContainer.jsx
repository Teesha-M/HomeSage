import 'mapbox-gl/dist/mapbox-gl.css'; 
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsb21pa2kiLCJhIjoiY20yN2FndGhtMWFpdjJpc2dicnkxZjlpYiJ9.xEUjg1FueJBs9v4KvE0DwA'; 

const ListingMap = ({ coordinates,listings }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    
    if (coordinates && !listings) {
      if (!map.current) {
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: coordinates,
          zoom: 12,
        });

        
        new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
      } else {
        map.current.setCenter(coordinates);
        new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
      }
    }

    
    if (listings && listings.length > 0) {
      const firstCoordinates = listings[0]?.coordinates;

      if (!map.current) {
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: firstCoordinates, 
          zoom: 10,
        });

        
        listings.forEach((listing) => {
          if (listing.coordinates) {
            new mapboxgl.Marker()
              .setLngLat(listing.coordinates) 
              .addTo(map.current);
          }
        });
      }
    }
  }, [coordinates, listings]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
};

export default ListingMap;
