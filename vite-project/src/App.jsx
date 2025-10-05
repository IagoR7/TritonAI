import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';
import './App.css';


const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  
  const [viewport, setViewport] = useState({
    longitude: -120,
    latitude: 35,
    zoom: 5.5,
  });

  
  const handleSearch = async (locationText) => {
    if (!locationText) return; 

    try {
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationText)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        
        setViewport({
          longitude,
          latitude,
          zoom: 8, 
        });
      } else {
        alert("Localização não encontrada. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      alert("Ocorreu um erro ao buscar a localização.");
    }
  };

  return (
    <div className="app-container">
     
      <Sidebar onSearch={handleSearch} />
      
      
      <Map viewport={viewport} />
    </div>
  )
}

export default App;
