// src/components/ui/FormField.jsx
import Input from './Input';

const FormField = ({ label, name, value, onChange, error, ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <Input id={name} name={name} value={value} onChange={onChange} {...props} />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;