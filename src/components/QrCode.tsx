import { useEffect, useState } from "react";
import QRCode from 'qrcode';

// A QR code component
//
// It generates a QR code from the given link
export function QrCode({ link }: { link: string }) {

  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    async function generateQr() {
      const r = await QRCode.toDataURL(link, { margin: 2 });
      setQr(r);
    }

    generateQr();
  }, [link]);

  if (!qr) return (<div>Loading...</div>);

  return (
    <img src={qr} alt="QR code" />
  );
}