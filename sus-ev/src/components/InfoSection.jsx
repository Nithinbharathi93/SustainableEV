export const InfoSection = ({ title, content }) => {
    return (
      <div className="info-section">
        <h2 className="info-title">{title}</h2>
        <p className="info-text">{content}</p>
      </div>
    );
  };

export default InfoSection