import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Detail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`);
        const data = await response.json();
        setItem(data.result);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [type, id]);

  const handleToggleFavorite = () => {
    if (!item || !item.properties) return;
    const favoriteItem = { uid: item.uid, name: item.properties.name, type };
    const isFavorite = store.favorites.some(
      (fav) => fav.uid === item.uid && fav.type === type
    );
    if (isFavorite) {
      dispatch({ type: "remove_favorite", payload: favoriteItem });
    } else {
      dispatch({ type: "add_favorite", payload: favoriteItem });
    }
  };

  const getImageUrl = (uid, type) => {
    const baseUrl = "https://starwars-visualguide.com/assets/img";
    if (type === "people") return `${baseUrl}/characters/${uid}.jpg`;
    if (type === "vehicles") return `${baseUrl}/vehicles/${uid}.jpg`;
    if (type === "planets") return `${baseUrl}/planets/${uid}.jpg`;
    return "";
  };

  const renderProperties = (properties) => {
    const excludeKeys = ["created", "edited", "url"];
    return Object.entries(properties)
      .filter(([key]) => !excludeKeys.includes(key))
      .map(([key, value]) => (
        <div key={key} className="row mb-2">
          <div className="col-md-4">
            <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>
          </div>
          <div className="col-md-8">{value || "N/A"}</div>
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!item || !item.properties) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Item not found
        </div>
      </div>
    );
  }

  const isFavorite = store.favorites.some(
    (fav) => fav.uid === item.uid && fav.type === type
  );

  const getTypeTitle = (type) => {
    if (type === "people") return "Character";
    if (type === "vehicles") return "Vehicle";
    if (type === "planets") return "Planet";
    return type;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={getImageUrl(item.uid, type)}
            className="img-fluid rounded"
            alt={item.properties?.name || "Unknown"}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/600x400/333/fff?text=${item.properties?.name || "Unknown"}`;
            }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="display-4">{item.properties.name}</h1>
              <h5 className="text-muted">{getTypeTitle(type)}</h5>
            </div>
            <button
              className={`btn btn-lg ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
              onClick={handleToggleFavorite}
            >
              <i className={`fas fa-heart ${isFavorite ? "" : "far"}`}></i>
            </button>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Details</h5>
              {renderProperties(item.properties)}
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
