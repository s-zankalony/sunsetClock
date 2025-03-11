import { useEffect, useRef } from 'react';

export default function AdSense() {
  const adContainerRef = useRef(null);
  const adLoaded = useRef(false);

  useEffect(() => {
    if (adLoaded.current) return;

    // Load AdSense script
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5452104495187360';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      // Initialize ads after script loads
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    };

    document.head.appendChild(script);
    adLoaded.current = true;
  }, []);

  return (
    <div ref={adContainerRef} className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5452104495187360"
        data-ad-slot="YOUR_AD_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
