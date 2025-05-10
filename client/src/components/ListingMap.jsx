import 'mapbox-gl/dist/mapbox-gl.css'; 
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsb21pa2UiLCJhIjoiY20yN2Ftd3I2MWVmeDJxcXcybWdqZjh2aSJ9.ZoSkhzqeXXmJp4MYYjNuDg';

const ListingMap = ({ coordinates, listings }) => {
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

        
        const marker = new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(map.current);

        
        marker.getElement().style.cursor = 'pointer';

        
        marker.getElement().addEventListener('click', () => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`, '_blank');
        });
      } else {
        map.current.setCenter(coordinates);
        new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(map.current);
      }
    }

    


    if (listings && listings.length > 0) {
      const firstCoordinates = listings[0]?.geolocation;

      if (!map.current) {
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [firstCoordinates.lng, firstCoordinates.lat], 
          zoom: 10,
        });

        
        listings.forEach((listing) => {
          const listingCoords = listing.geolocation; 

          if (listingCoords) {
            const marker = new mapboxgl.Marker()
              .setLngLat([listingCoords.lng, listingCoords.lat]) 
              .addTo(map.current);

            
            marker.getElement().style.cursor = 'pointer';

            
            marker.getElement().addEventListener('click', () => {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${listingCoords.lat},${listingCoords.lng}`, '_blank');
            });
          }
        });
      }
    }
  }, [coordinates, listings]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
};

export default ListingMap;
