// src/components/ui/Card.jsx
const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    >
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;