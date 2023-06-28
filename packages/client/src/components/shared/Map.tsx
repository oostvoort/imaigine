import React, { useEffect, useRef } from 'react'

type PropType = {
  className?: string
}

const Map: React.FC<PropType> = ({ className }) => {
    const mapSeed = 123
    const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleMessage = (event) => {
      // Check the origin if necessary
      // if (event.origin !== 'http://example.com') return;

      // Access the message data
      const message = event.data;

      // Handle the message received from the iframe
      console.log('Message received from iframe:', message);
    };

    // Add event listener for the 'message' event
    window.addEventListener('message', handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

    // const sendMessageToIframe = () => {
    //     if (iframeRef.current) {
    //         const iframeWindow = iframeRef.current.contentWindow;
    //         if (iframeWindow) {
    //             // Call the JavaScript function within the iframe
    //             iframeWindow.postMessage('Hello from parent', '*');
    //         }
    //     }
    // };
    const callFunctionInIframe = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            if (iframeWindow) {
                // Call the JavaScript function within the iframe

              iframeWindow.helloFromParent()
            }
        }
    };
    const reloadIframe = () => {
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src
        }
    };
    return (
      <div className={'w-full h-full'}>
        <button onClick={callFunctionInIframe}>Call Function in Iframe</button> |
        <button onClick={reloadIframe}>Reload Iframe</button>
        <iframe
          ref={iframeRef}
          width={'w-[inherit]'}
          className={className}
          src={`${document.baseURI}map/index.html?burg=75&scale=12&maplink=http://localhost:3000/mapdata?seed=${mapSeed}`}
          title="Map"
        />
      </div>
    );
};

export default Map;
