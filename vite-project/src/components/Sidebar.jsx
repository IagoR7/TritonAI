import React from 'react';
import './Sidebar.css';


export const Sidebar = ({ onSearch }) => {

  
  const handleSubmit = (event) => {
    event.preventDefault(); 
    const locationText = event.target.elements.location.value;
    onSearch(locationText); 
  };

  return (
    <div className="sidebar-container">
      <h1>Projeto Sharknado</h1>
      <p>Previsão de Hotspots de Tubarões</p>
      
      <div className="filters">
        <h2>Filtros</h2>
        <label htmlFor="date-picker">Selecione a Data:</label>
        <input type="date" id="date-picker" />
        
        <label htmlFor="species-select">Selecione a Espécie:</label>
        <select id="species-select">
          <option>Tubarão-Branco</option>
          <option>Tubarão-Tigre</option>
          <option>Tubarão-Martelo</option>
          <option>Tubarão-Cabeça-Chata</option>
          <option>Tubarão-Limão</option>
          <option>Tubarão-Âncora</option>
          <option>Tubarão-Mako</option>
        </select>
      </div>

      
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="location-search">Buscar Localização:</label>
        <input 
          type="text" 
          id="location-search" 
          name="location"
          placeholder="Ex: Cidade do Cabo, África do Sul" 
        />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
};