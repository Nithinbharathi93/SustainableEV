export const ChargeRecommendation = ({
    title = "CHARGE RECOMMENDATION",
    recommendationText = "Consider charging upon arrival at your destination or during your stay to ensure adequate range for your return journey or further travel.",
    mapUrl,
    duration,
    routeName,
    distance,
  }) => {
    return (
      <div className="recommendation-section">
        <h2 className="recommendation-title">{title}</h2>
        <p className="recommendation-text">{recommendationText}</p>
        <div className="route-info">
          <div className="map-frame">
            <iframe
              src={"https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=10.7698255%2C77.5107993%3B10.8509242%2C77.4465535"}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps Route"
            ></iframe>
          </div>
          <div className=".route-details-center">
            <a href={mapUrl} target="_blank">Alternate Link</a>
          </div>
          <div className="route-details">
            <p className="route-duration">{duration}</p>
            <p className="route-name">{routeName}</p>
            <p className="route-distance">{distance}</p>
          </div>
        </div>
      </div>
    );
  };

export default ChargeRecommendation