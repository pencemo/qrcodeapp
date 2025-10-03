import QRCodeStyling from 'qr-code-styling';
import React, { useEffect, useRef, useState } from 'react'

function ModeQr({setOptions, options}) {
  const [qrCode, setQrCode] = useState();
  const ref = useRef(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, [])

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);
  return (
    <div onClick={()=>setOptions(options)} className='cursor-pointer' >
      <div
       className="w-full aspect-square border flex items-center justify-center overflow-hidden relative"  >
        <div
        className='rounded-md overflow-hidden'
        ref={ref}></div>
      </div>
    </div>
  )
}

export default ModeQr