// src/components/ui/Input.jsx
const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
}) => {
  const baseStyles =
    'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    />
  );
};

export default Input;