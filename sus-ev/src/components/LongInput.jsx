export const LongInput = ({ label, id, value, onChange, placeholder }) => {
    return (
     <div className="form-group">
      <label htmlFor={id} className="form-label"> {label} </label>
      <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="form-input" />
     </div>
    );
   };

export default LongInput