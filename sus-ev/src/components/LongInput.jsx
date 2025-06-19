import { MdMyLocation } from "react-icons/md";

export const LongInput = ({ label, id, value, onChange, placeholder, innerButtonState, innerButtonFunction }) => {
    return (
     <div className="form-group">
      <label htmlFor={id} className="form-label"> {label} </label>
      {!innerButtonState ? (
          <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="form-input" />
        ) : (
        <>
        <div className="input-wrapper">
            <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="form-input" />
            <button type="button" onClick={innerButtonFunction}><MdMyLocation /></button>
        </div>
        </>
      )}
     </div>
    );
   };

export default LongInput