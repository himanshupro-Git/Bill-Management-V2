import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './Scanner.css';
// Converts camera errors into user-friendly messages
function getCameraErrorMessage(error) {
  const name = error?.name || "";
  const text = String(error?.message || error || "");

  if (name === "NotAllowedError" || /permission|denied/i.test(text)) {
    return "Camera permission was denied. Please allow camera access in your browser settings and try again.";
  }

  if (name === "NotFoundError" || /not found|no camera/i.test(text)) {
    return "No camera was found on this device.";
  }

  if (name === "NotReadableError" || /in use|could not start/i.test(text)) {
    return "The camera is being used by another app. Close it and try again.";
  }

  return "Could not start the camera. Please check your camera and try again.";
}

export default function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

  const [status, setStatus] = useState("starting");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    async function startScanner() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 150
            }
          },
          (decodedText) => {
            if (hasScannedRef.current) return;

            hasScannedRef.current = true;
            onScan(decodedText);
          },
          () => {
            // Ignore failed scan attempts
          }
        );

        isRunningRef.current = true;
        setStatus("running");

        console.log("Scanner started");
      } catch (error) {
        console.error("Scanner start error:", error);

        setErrorMessage(getCameraErrorMessage(error));
        setStatus("error");
      }
    }

    startScanner();

    return () => {
      const currentScanner = scannerRef.current;

      if (!currentScanner) return;

      if (isRunningRef.current) {
        currentScanner
          .stop()
          .then(() => {
            isRunningRef.current = false;
            return currentScanner.clear();
          })
          .catch((error) => {
            console.error("Scanner cleanup error:", error);
          });
      }
    };
  }, []);

  async function handleClose() {
    const scanner = scannerRef.current;

    if (!scanner) {
      onClose();
      return;
    }

    try {
      if (isRunningRef.current) {
        await scanner.stop();
        isRunningRef.current = false;
      }

      await scanner.clear();

      // Prevent cleanup from using this scanner again
      scannerRef.current = null;

      onClose();
    } catch (error) {
      console.error("Close scanner error:", error);

      scannerRef.current = null;
      isRunningRef.current = false;

      onClose();
    }
  }

  return (
    <div className="scannerBox">
      {status === "starting" && (
        <p className="scannerStatus">
          Starting camera...
        </p>
      )}

      {status === "running" && (
        <p className="scannerStatus scannerStatusRunning">
          Scanning... point the camera at a barcode
        </p>
      )}

      {status === "error" && (
        <div className="scannerError" role="alert">
          {errorMessage}
        </div>
      )}

      <div id="reader"></div>

      <button onClick={handleClose}>
        Close Scanner
      </button>
    </div>
  );
}