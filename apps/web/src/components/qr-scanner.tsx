import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button, LoaderButton } from './button';

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const startScan = async () => {
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

    try {
      setScannerLoading(true);
      await scannerRef.current.start();
      console.log('Scanner started.');
    } catch (err) {
      console.log(err.message);
    } finally {
      setScannerLoading(false);
    }

    setStarted(true);
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, [onScan]);

  return (
    <div className='flex w-full relative flex-col justify-center'>
      {!started && (
        <div className='absolute w-full z-20'>
          <LoaderButton
            loading={scannerLoading}
            disabled={scannerLoading}
            type='button'
            rounded
            onClick={startScan}
            fullWidth>
            Avaa Kamera
          </LoaderButton>
        </div>
      )}

      <video
        playsInline
        muted
        ref={videoRef}
        style={{ width: '100%', borderRadius: 12 }}
      />
    </div>
  );
}
