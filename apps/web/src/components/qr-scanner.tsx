import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from './button';

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [started, setStarted] = useState(false);

  const startScan = () => {
    setStarted(() => true);
    //if (!videoRef.current) return;

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
        <div className='absolute w-full'>
          <Button
            disabled={started}
            type='button'
            rounded
            onClick={startScan}
            fullWidth>
            Avaa Kamera
          </Button>
        </div>
      )}

      <video
        autoPlay={false}
        playsInline
        muted
        ref={videoRef}
        style={{ width: '100%', borderRadius: 12 }}
      />
    </div>
  );
}
