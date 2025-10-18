// src/components/ui/PhotoUpload.jsx
import Button from './Button';

const PhotoUpload = ({ label, onCaptureClick, imageSrc, error }) => {
  return (
    <div className="flex flex-col items-start p-4 bg-gray-50 border border-gray-200 rounded-lg h-full">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Button
        onClick={onCaptureClick}
        variant="secondary"
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1"
      >
        Capture
      </Button>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Preview"
          className="mt-3 w-36 h-36 object-cover rounded-md border border-gray-300 shadow-sm"
        />
      )}
      {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default PhotoUpload;