import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [chunks, setChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [recordButtonText, setRecordButtonText] = useState('Start Recording');
  const [recordingState, setRecordingState] = useState('inactive');
  const [stream, setStream] = useState(new MediaStream());

  const recorder = useRef(null);
  const mimeType = 'audio/webm';

  // access user's microphone stream
  const accessStream = async (event) => {
    if ('MediaRecorder' in window) {
      try {
        const data = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setStream(data);

        console.log('Access granted');
      } catch {
        renderError(
          'You denied access to the microphone. Please allow if you would like to continue.'
        );
      }
    }
    renderError("Sorry, your browser doesn't support the MediaRecorder API.");
  };

  const handleRecord = async () => {
    if (recordingState === 'inactive') {
      setRecordingState('recording');
      console.log('recording');
      setRecordButtonText('Stop Recording');

      const media = new MediaRecorder(stream, { type: mimeType });

      recorder.current = media;

      recorder.current.start();

      let audioChunks = [];

      recorder.current.ondataavailable = (e) => {
        if (typeof e.data === 'undefined') return;
        if (e.data.size === 0) return;
        audioChunks.push(e.data);
      };

      setChunks(audioChunks);
    } else {
      setRecordingState('inactive');
      console.log('recording stopped');
      setRecordButtonText('Start Recording');

      recorder.current.stop();

      recorder.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setRecordings((prevUrls) => [...prevUrls, audioUrl]);

        setChunks([]);
      };
    }
  };

  const renderError = (message) => `<div class="error"><p>${message}</p></div>`;
  const errorMessage = renderError();

  const audioElements = recordings.map((el) => {
    return (
      <li key={el}>
        <audio src={el} controls />
      </li>
    );
  });

  return (
    <>
      <h1>Voice Recordings</h1>
      <main>
        <div className="controls">
          <button type="button" id="mic" onClick={accessStream}>
            Get Microphone
          </button>
          <button type="button" id="record" onClick={handleRecord}>
            {recordButtonText}
          </button>
        </div>

        {audioElements ? (
          <ul id="recordings">{audioElements}</ul>
        ) : (
          errorMessage
        )}
      </main>
    </>
  );
};

export default App;
