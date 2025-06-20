import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGeolocated } from "react-geolocated";
import LongInput from './LongInput';
import ShortInput from './ShortInput';
import InfoSection from './InfoSection';
import OptimizationAssistant from './OptimizationAssistant';
import ChargeRecommendation from './ChargeRecommendation'

const MainForm = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('');
  const [estRange, setEstRange] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [webResponse, setwebResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (useCurrentLoc && coords) {
      setLocation(`${coords.latitude}, ${coords.longitude}`);
    } else {
      setLocation("");
    }
  }, [useCurrentLoc, coords]);


  const SERV_URL = import.meta.env.VITE_SERVER_URL;

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

    console.log(requestData);
  
    // const prompt = requestData;
  
    try {
      const response = await axios.post(SERV_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setwebResponse(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error sending data to Gemini server:', error);
      setError('Failed to generate response. Please try again.');
      setLoading(false);
      setwebResponse(null);
    }
  };
  
  

  return (
    <>
    <form onSubmit={handleSubmit} className="main-form">
     <LongInput label="Location" id="location" value={location} placeholder="Your current location" innerButtonState={true} innerButtonFunction={() => setUseCurrentLoc((prev) => !prev)} 
        onChange={(e) => {
          setUseCurrentLoc(false);
          setLocation(e.target.value);
        }}
      />
      {!isGeolocationAvailable && useCurrentLoc && (
        <div>Your browser does not support Geolocation</div>
      )}
      {!isGeolocationEnabled && useCurrentLoc && (
        <div>Geolocation is not enabled</div>
      )}
      {useCurrentLoc && !coords && (
        <div>Getting the location data&hellip;</div>
      )}
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
    {webResponse && (
        <InfoSection title="INFO" content={webResponse.contextual_driving_advice} />
      )}
      {webResponse && (
        <OptimizationAssistant
          title="Sustainable EV Assistant" 
          dateTime={`${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`} 
          batteryPercentage={parseInt(batteryLevel, 10)}
          estRange={parseFloat(estRange)}
          rangeStatus={webResponse.performance_state || "Unknown"}
          recommendation="Find the nearest fast charger" 
          piePercentage={parseInt(batteryLevel, 10)} 
          pieWidth={120} pieGradient={["#ff9966", "#ff5e62"]} pieTextColor="#ffffff" 
          distance={webResponse.distance} />
        )}
      {webResponse && (
        <ChargeRecommendation
         title="CHARGE RECOMMENDATION"
         recommendationText={webResponse.suggested_route_info.next_charge_recommendation || ""}
         mapUrl={webResponse.suggested_route_info.map_url}
         duration={webResponse.suggested_route_info.duration || ""}
         routeName={webResponse.suggested_route_info.summary || ""}
         distance={webResponse.suggested_route_info.distance || ""}
        />
      )
    }
    </>
  );
};

export default MainForm;
