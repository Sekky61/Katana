import { useEffect, useState } from "react";
import QRCode from 'qrcode';

// TODO: styled QR: https://github.com/kozakdenys/qr-code-styling

export const QR_CODE_WIDTH_PX = 176;

// A QR code component
//
// It generates a QR code from the given link
// The width is calculated as 11rem == 176px
export function QrCode({ link }: { link: string | null }) {

  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    async function generateQr() {
      if (!link) return;
      const r = await QRCode.toDataURL(link, { margin: 2, width: QR_CODE_WIDTH_PX });
      setQr(r);
    }

    generateQr();
  }, [link]);

  if (!qr) return null;

  return (
    <img className="w-[176px] h-[176px]" src={qr} alt="QR code" />
  );
}