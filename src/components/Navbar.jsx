import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showDropdown, setShowDropdown] = useState(false);

  const removeFavorite = (favorite) => {
    dispatch({ type: 'remove_favorite', payload: favorite });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/200px-Star_Wars_Logo.svg.png" 
            alt="Star Wars" 
            height="30"
          />
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>
          
          <div className="dropdown">
            <button 
              className="btn btn-warning dropdown-toggle"
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            >
              Favorites ({store.favorites.length})
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '300px' }}>
                <h6 className="dropdown-header">Your Favorites</h6>
                {store.favorites.length === 0 ? (
                  <div className="dropdown-item-text text-muted">
                    No favorites yet
                  </div>
                ) : (
                  store.favorites.map((favorite, index) => (
                    <div key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                      <Link 
                        to={`/${favorite.type}/${favorite.uid}`}
                        className="text-decoration-none flex-grow-1"
                      >
                        <strong>{favorite.name}</strong>
                        <br />
                        <small className="text-muted">
                          {favorite.type === 'people' ? 'Character' : 
                           favorite.type === 'vehicles' ? 'Vehicle' : 'Planet'}
                        </small>
                      </Link>
                      <button 
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFavorite(favorite);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))
                )}
                {store.favorites.length > 0 && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item-text">
                      <small className="text-muted">
                        Total: {store.favorites.length} favorites
                      </small>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };