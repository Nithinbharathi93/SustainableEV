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

export const OptimizationAssistant = ({ title = "", dateTime = "", batteryPercentage = 0, estRange = 0, rangeStatus = "", recommendation = "", piePercentage = 0, pieWidth = 0, pieGradient = ["", ""], pieTextColor = "", distance=0 , suffeciency=""}) => {
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

export default OptimizationAssistant