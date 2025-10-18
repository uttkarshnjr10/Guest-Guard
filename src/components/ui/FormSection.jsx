// src/components/ui/FormSection.jsx
const FormSection = ({ title, children }) => {
  return (
    <fieldset className="border border-gray-300 p-6 rounded-lg">
      <legend className="text-lg font-semibold text-gray-800 px-2">
        {title}
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </fieldset>
  );
};

export default FormSection;