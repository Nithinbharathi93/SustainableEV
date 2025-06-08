const ShortInput = ({ label, id, value, onChange, placeholder, type = "text", className = "form-input", min=0, max }) => {
    return (
     <div className="form-col">
      <label htmlFor={id} className="form-label"> {label} </label>
      <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className={className} min={min} max={max}/>
     </div>
    );
   };

export default ShortInput