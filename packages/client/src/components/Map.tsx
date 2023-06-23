import React, { useEffect, useRef } from 'react'

const Map: React.FC = () => {
    const mapSeed = 123
    const componentStyle = {
        width: '768px',
        height: '768px',
    };
    const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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

    const sendMessageToIframe = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            if (iframeWindow) {
                // Call the JavaScript function within the iframe
                iframeWindow.postMessage('Hello from parent', '*');
            }
        }
    };
    const callFunctionInIframe = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            if (iframeWindow) {
                // Call the JavaScript function within the iframe
                iframeWindow.helloFromParent()
            }
        }
    };
    return (
        <div style={componentStyle}>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
            <button onClick={sendMessageToIframe}>Send Message to Iframe</button>
            <button onClick={callFunctionInIframe}>Call Function in Iframe</button>
            <iframe
                ref={iframeRef}
                width="768"
                height="768"
                src={`http://localhost:4000/map/index.html?maplink=http://localhost:3000/mapdata?seed=${mapSeed}`}
                title="Map"
            />
        </div>
    );
};

export default Map;
