// src/components/ui/WebcamModal.jsx
import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Button from './Button';

const WebcamModal = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{ facingMode: 'user' }}
          className="rounded-md"
        />
        <div className="mt-4 flex justify-center gap-4">
          <Button onClick={capture}>Capture Photo</Button>
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebcamModal;