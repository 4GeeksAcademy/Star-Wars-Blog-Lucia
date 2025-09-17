import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const [store, dispatch] = useGlobalReducer();
  const [people, setPeople] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch people
        const peopleResponse = await fetch('https://www.swapi.tech/api/people/');
        const peopleData = await peopleResponse.json();
        setPeople(peopleData.results);

        // Fetch vehicles
        const vehiclesResponse = await fetch('https://www.swapi.tech/api/vehicles/');
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData.results);

        // Fetch planets
        const planetsResponse = await fetch('https://www.swapi.tech/api/planets/');
        const planetsData = await planetsResponse.json();
        setPlanets(planetsData.results);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleFavorite = (item, type) => {
    const favoriteItem = { ...item, type };
    const isFavorite = store.favorites.some(
      fav => fav.uid === item.uid && fav.type === type
    );

    if (isFavorite) {
      dispatch({ type: 'remove_favorite', payload: favoriteItem });
    } else {
      dispatch({ type: 'add_favorite', payload: favoriteItem });
    }
  };

  const getImageUrl = (uid, type) => {
    const baseUrl = 'https://starwars-visualguide.com/assets/img';
    if (type === 'people') return `${baseUrl}/characters/${uid}.jpg`;
    if (type === 'vehicles') return `${baseUrl}/vehicles/${uid}.jpg`;
    if (type === 'planets') return `${baseUrl}/planets/${uid}.jpg`;
    return '';
  };

  const renderCard = (item, type, title) => {
    const isFavorite = store.favorites.some(
      fav => fav.uid === item.uid && fav.type === type
    );

    return (
      <div key={`${type}-${item.uid}`} className="col-md-4 mb-4">
        <div className="card h-100">
          <img 
            src={getImageUrl(item.uid, type)} 
            className="card-img-top" 
            alt={item.name}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x200/333/fff?text=${item.name}`;
            }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{item.name}</h5>
            <div className="mt-auto d-flex justify-content-between">
              <Link 
                to={`/${type}/${item.uid}`} 
                className="btn btn-outline-primary"
              >
                Learn more!
              </Link>
              <button 
                className={`btn ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => handleToggleFavorite(item, type)}
              >
                <i className={`fas fa-heart ${isFavorite ? '' : 'far'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Star Wars data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4 text-warning">Star Wars</h1>
        <p className="lead">Characters</p>
      </div>

      {/* People Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-danger me-3">Characters</h2>
          <div style={{ height: '2px', backgroundColor: '#dc3545', flex: 1 }}></div>
        </div>
        <div className="row">
          {people.slice(0, 6).map(person => renderCard(person, 'people', 'Character'))}
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-danger me-3">Vehicles</h2>
          <div style={{ height: '2px', backgroundColor: '#dc3545', flex: 1 }}></div>
        </div>
        <div className="row">
          {vehicles.slice(0, 6).map(vehicle => renderCard(vehicle, 'vehicles', 'Vehicle'))}
        </div>
      </section>

      {/* Planets Section */}
      <section className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-danger me-3">Planets</h2>
          <div style={{ height: '2px', backgroundColor: '#dc3545', flex: 1 }}></div>
        </div>
        <div className="row">
          {planets.slice(0, 6).map(planet => renderCard(planet, 'planets', 'Planet'))}
        </div>
      </section>
    </div>
  );
};