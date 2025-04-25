import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import axios from 'axios';

const LongInput = ({ label, id, value, onChange, placeholder }) => {
  return (
   <div className="form-group">
    <label htmlFor={id} className="form-label"> {label} </label>
    <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="form-input" />
   </div>
  );
 };

 const ShortInput = ({ label, id, value, onChange, placeholder, type = "text", className = "form-input", min=0, max }) => {
  return (
   <div className="form-col">
    <label htmlFor={id} className="form-label"> {label} </label>
    <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className={className} min={min} max={max}/>
   </div>
  );
 };

const InfoSection = ({ title, content }) => {
  return (
    <div className="info-section">
      <h2 className="info-title">{title}</h2>
      <p className="info-text">{content}</p>
    </div>
  );
};

const infoText = ``;

const OptimizationAssistant = ({ title = "", dateTime = "", batteryPercentage = 0, estRange = 0, rangeStatus = "", recommendation = "", piePercentage = 0, pieWidth = 0, pieGradient = ["", ""], pieTextColor = "", distance=0 , suffeciency=""}) => {
  if ((estRange/batteryPercentage*100) < distance) {
    suffeciency = "Insufficient";
  } else {
    suffeciency = "Sufficient";
  }
  return (
    <div className="optimization-section">
      <h2 className="section-title">{title}</h2>
      <p className="date-time">{dateTime}</p>
      <div className="range-info">
        <Pie percentage={piePercentage} width={pieWidth} gradientColors={pieGradient} textColor={pieTextColor} />
        <div className="text-info">
          <p className="range-status">{rangeStatus}</p>
          <p className="range-value">{estRange} km</p>
          <p className="charge-recommendation">
            <span className="warning-icon">⚠</span> CHARGE RECOMMENDATION <br/>
            {recommendation}
          </p>
        </div>
      </div>
      <p className="summary"> Your battery is at {batteryPercentage}% with an estimated range of {estRange} km. This should be {suffeciency} for the planned trip. </p>
    </div>
  );
};

const cleanPercentage = (percentage) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0;
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = ({ stroke, percentage, radius = 70 }) => {
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circ) / 100;
  return (
    <circle r={radius} cx="50%" cy="50%" fill="transparent" stroke={strokePct !== circ ? stroke : ""} strokeWidth="2rem" strokeDasharray={circ} strokeDashoffset={percentage ? strokePct : 0} />
  );
};

const Text = ({ percentage, textColor }) => (
  <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="1.5em" fill={textColor} >
    {percentage.toFixed(0)}%
  </text>
);

const Pie = ({ percentage, width = 200, gradientColors = ["#00c6ff", "#0072ff"], textColor = "#000000", }) => {
  const pct = cleanPercentage(percentage);
  const radius = 70;
  const viewBoxSize = 200;
  const gradientId = "pieGradient";

  return (
    <svg width={width} height={width} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientColors[0]} />
          <stop offset="100%" stopColor={gradientColors[1]} />
        </linearGradient>
      </defs>

      <g transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`}>
        <Circle stroke="lightgrey" radius={radius} percentage={100} />
        <Circle stroke={`url(#${gradientId})`} radius={radius} percentage={pct} />
      </g>
      <Text percentage={pct} textColor={textColor} />
    </svg>
  );
};

const destination = "";
  const mapUrl = ``;  
  const ChargeRecommendation = ({
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
              src={mapUrl}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps Route"
            ></iframe>
          </div>
          <div className=".route-details-center">
            <a href={mapUrl}>Alternate Link</a>
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
  

const MainForm = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('');
  const [estRange, setEstRange] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [n8nResponse, setN8nResponse] = useState(null); // State to store the response
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(''); // State to track errors

  const N8N_URL = import.meta.env.VITE_N8N_URL; // Replace with your actual n8n webhook URL

  const handleSubmit = async (event) => {
   event.preventDefault();
   setLoading(true);
   setError('');

   const requestData = {
    location,
    destination,
    battery_level_percent: parseInt(batteryLevel, 10),
    estimated_range_km: parseInt(estRange, 10),
    current_time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    current_day: new Date().toLocaleDateString('en-IN', { weekday: 'long' }),
    vehicle_model: vehicle,
   };

   try {
    const response = await axios.post(N8N_URL, requestData);
    setN8nResponse(response.data);
    setLoading(false);
   } catch (error) {
    console.error('Error sending data to n8n:', error);
    setError('Failed to send data. Please try again.');
    setLoading(false);
    setN8nResponse(null); // Clear any previous response on error
   }
  };
  

  return (
    <>
    <form onSubmit={handleSubmit} className="main-form">
     <LongInput label="Location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your current location" />
     <LongInput label="Destination" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Your destination" />
     <LongInput label="Vehicle" id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Your Vehicle Model" />

     <div className="form-row">
      <ShortInput label="Battery level (%)" id="batteryLevel" value={batteryLevel} placeholder="Battery level" type="number" min={0} max={100}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (value >= 0 && value <= 100) {
            setBatteryLevel(value);
          } else if (e.target.value === "") {
            setBatteryLevel("");
          }
        }} />
      <ShortInput label="Est_Range (km)" id="estRange" value={estRange} placeholder="Range in kilometers" type="number" min={0}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (value >= 0) {
            setEstRange(value);
          } else if (e.target.value === "") {
            setEstRange("");
          }
        }} />
     </div>

     <button
      type="submit" className={`submit-button ${loading ? 'loading-animation' : ''}`} disabled={loading} >
      {loading ? 'Loading...' : 'SUBMIT'}
    </button>
     {error && <p className="error-message">{error}</p>}
    </form>
    {n8nResponse && (
        <InfoSection title="INFO" content={n8nResponse.contextual_driving_advice} />
      )}
      {n8nResponse && (
        <OptimizationAssistant
          title="Sustainable EV Assistant" 
          dateTime={`${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`} 
          batteryPercentage={parseInt(batteryLevel, 10)}
          estRange={parseFloat(estRange)}
          rangeStatus={n8nResponse.performance_state || "Unknown"}
          recommendation="Find the nearest fast charger" 
          piePercentage={parseInt(batteryLevel, 10)} 
          pieWidth={120} pieGradient={["#ff9966", "#ff5e62"]} pieTextColor="#ffffff" 
          distance={n8nResponse.suggested_route_info.distance} />
        )}
      {n8nResponse && (
        <ChargeRecommendation
         title="CHARGE RECOMMENDATION"
         recommendationText={n8nResponse.next_charge_recommendation || ""}
         mapUrl={n8nResponse.suggested_route_info.map_url}
         duration={n8nResponse.suggested_route_info.duration || ""}
         routeName={n8nResponse.suggested_route_info.summary || ""}
         distance={n8nResponse.suggested_route_info.distance || ""}
        />
      )
    }
    </>
  );
};

export default MainForm;
