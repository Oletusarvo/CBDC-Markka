import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    scannerRef.current = new QrScanner(
      videoRef.current,
      result => {
        onScan?.(result.data);
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
      },
    );

    scannerRef.current.start();

    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, [onScan]);

  return (
    <video
      ref={videoRef}
      style={{ width: '100%', borderRadius: 12 }}
    />
  );
}
