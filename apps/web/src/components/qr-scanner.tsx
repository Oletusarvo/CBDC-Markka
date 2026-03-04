import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from './button';

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [started, setStarted] = useState(false);

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
  }, [onScan, videoRef.current, scannerRef.current]);

  return (
    <video
      autoPlay
      playsInline
      muted
      ref={videoRef}
      style={{ width: '100%', borderRadius: 12 }}
    />
  );
}
