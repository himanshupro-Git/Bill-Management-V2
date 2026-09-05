import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const stoppedRef = useRef(false);
  const scannedRef = useRef(false);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let scanner = null;
    let mounted = true;

    async function startScanner() {
      try {
        scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

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
            if (!mounted || scannedRef.current) return;

            scannedRef.current = true;
            onScanRef.current(decodedText);
          },
          () => {
            // Ignore failed scan attempts
          }
        );

        // If React already unmounted while camera was starting,
        // immediately stop this scanner.
        if (!mounted) {
          await scanner.stop();
          await scanner.clear();
          return;
        }

        stoppedRef.current = false;

      } catch (error) {
        if (mounted) {
          console.error("Scanner error:", error);
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;

      const currentScanner = scanner;

      if (currentScanner) {
        currentScanner
          .stop()
          .catch(() => {})
          .finally(() => {
            currentScanner.clear().catch(() => {});
          });
      }
    };
  }, []);

  async function handleClose() {
    const scanner = scannerRef.current;

    try {
      if (scanner && !stoppedRef.current) {
        stoppedRef.current = true;
        await scanner.stop();
        await scanner.clear();
      }
    } catch (error) {
      console.error("Error closing scanner:", error);
    }

    onClose();
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