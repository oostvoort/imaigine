import React, { useEffect, useRef } from 'react'

const Map: React.FC = () => {
    const mapSeed = 123
    const componentStyle = {
        width: '768px',
        height: '768px',
    };
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const players = [
      {
        name: "Edward",
        cell: 4871,
        x: 710,
        y: 525,
        legend: 'A brave and honorable knight known for his swordsmanship.'
      },
      {
        name: "Arthur",
        cell: 4100,
        x: 85,
        y: 397,
        legend: 'A skilled rogue and master of stealth and thievery.'
      },
      {
        name: "Emily",
        cell: 4345,
        x: 107,
        y: 427,
        legend: 'A talented wizard specializing in elemental magic.'
      },
      {
        name: "Sophia",
        cell: 4655,
        x: 713,
        y: 470,
        legend: 'A nimble archer with exceptional accuracy and keen eyesight.'
      }
    ]

  useEffect(() => {
    const handleMessage = (event) => {
      // Check the origin if necessary
      // if (event.origin !== 'http://example.com') return;

      // Access the message data
      const message = event.data;

      if(message=="FinishedLoadingMap"){
        addPlayersMarker()
      }

      // Handle the message received from the iframe
      console.log('Message received from iframe:', message);


    };
    // Add event listener for the 'message' event
    window.addEventListener('message', handleMessage);

    const handleIframeLoad = () => {
      console.log('call the function')
      addPlayersMarker()
    }
    if (iframeRef.current) {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        iframeWindow.addEventListener("load", handleIframeLoad);
      }
    }

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [])

    const sendMessageToIframe = () => {
        if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            if (iframeWindow) {
                // Call the JavaScript function within the iframe
                iframeWindow.postMessage('Hello from parent', '*');
            }
        }
    };
    // function addPlayersMarker() {
    //     if (iframeRef.current) {
    //         const iframeWindow = iframeRef.current.contentWindow;
    //         if (iframeWindow) {
    //             // Call the JavaScript function within the iframe
    //             iframeWindow.addPlayerMarker(players)
    //         }
    //     }
    // }

    return (
        <div style={componentStyle}>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
            <button onClick={sendMessageToIframe}>Send Message to Iframe</button>
            {/*<button onClick={addPlayersMarker}>Call Function in Iframe</button>*/}
            <iframe
              id="map"
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
