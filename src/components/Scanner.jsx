import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

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
        console.log("Scanner started");
      } catch (error) {
        console.error("Scanner start error:", error);
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
      <div id="reader"></div>

      <button onClick={handleClose}>
        Close Scanner
      </button>
    </div>
  );
}