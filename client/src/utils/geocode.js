

export const geocodeAddress = async (address) => {
    const MAPBOX_API_KEY = 'pk.eyJ1Ijoia2lsb21pa2UiLCJhIjoiY20yN2FndGhtMWFpdjJpc2dicnkxZjlpYiJ9.xEUjg1FueJBs9v4KvE0DwA';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Geocoded coordinates:', data); 
      if (data.features && data.features.length > 0) {
        const { center } = data.features[0]; 
        return center;
      }
      return null;
    } catch (error) {
      console.error('Error fetching geocode data:', error);
      return null;
    }
  };
  