import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Recording from './Recording';
import Button from '@material-ui/core/Button';
// import IconButton from '@mui/material/IconButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';

const App = () => {
  const [chunks, setChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [recordButtonText, setRecordButtonText] = useState('Start Recording');
  const [recordingState, setRecordingState] = useState('inactive');
  const [accessGranted, setAccessGranted] = useState(false);
  const [stream, setStream] = useState(new MediaStream());

  const recorder = useRef(null);
  const mimeType = 'audio/ogg';

  // make get request on page load
  useEffect(() => {
    axios
      .get('/api')
      .then((res) => {
        console.log('res', res);

        const { data } = res;
        console.log('data', data.id);
        for (const item of data) {
          const raw = window.atob(item.url);
          const binaryData = new Uint8Array(new ArrayBuffer(raw.length));
          for (let i = 0; i < raw.length; i++) {
            binaryData[i] = raw.charCodeAt(i);
          }

          const blob = new Blob([binaryData], {
            type: 'audio/ogg; codecs=opus',
          });
          console.log(blob);
          setRecordings((prev) => [
            ...prev,
            {
              id: item.id,
              url: URL.createObjectURL(blob),
              name: item.name,
              timeStamp: Date.now(),
            },
          ]);
        }
      })
      .catch((err) => console.log('error getting recording', err));
  }, []);

  // access user's microphone stream
  const accessStream = async (event) => {
    if ('MediaRecorder' in window) {
      try {
        const data = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setAccessGranted(true);
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

        console.log('recordings', recordings);

        setRecordings((prevUrls) => [
          ...prevUrls,
          {
            id: crypto.randomUUID(),
            url: audioUrl,
            name: '',
            timeStamp: Date.now(),
          },
        ]);

        fetch('/api', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(recordings),
        })
          .then((res) => res.json())
          .then((result) => console.log(result))
          .catch((err) => console.log('error saving recording', err));

        setChunks([]);
      };
    }
  };

  const renderButton = () => {
    if (recordingState == 'inactive') {
      return (
        <FiberManualRecordIcon
          fontSize="large"
          type="button"
          id="record"
          onClick={handleRecord}
        >
          {recordButtonText}
        </FiberManualRecordIcon>
      );
    } else {
      return (
        <StopIcon
          fontSize="large"
          type="button"
          id="record"
          onClick={handleRecord}
        >
          {recordButtonText}
        </StopIcon>
      );
    }
  };

  const recordButton = renderButton();

  const renderError = (message) => `<div class="error"><p>${message}</p></div>`;
  const errorMessage = renderError();

  const audioElements = recordings
    ? recordings.map((el) => {
        return (
          <Recording
            key={el.id}
            recording={el}
            allRecordings={recordings}
            setRecordings={setRecordings}
          />
        );
      })
    : 'No recordings';

  return (
    <>
      <main>
        <h1>Voice Recordings</h1>
        <div className="controls">
          <Button
            variant="contained"
            color="success"
            className="mic-access"
            type="button"
            id="mic"
            onClick={accessStream}
          >
            Allow Microphone Access
          </Button>
          {accessGranted ? (
            <button className="record-button">{recordButton}</button>
          ) : null}
        </div>
        {audioElements ? (
          <ul id="recordings" className="audio-list">
            {audioElements}
          </ul>
        ) : (
          errorMessage
        )}
      </main>
    </>
  );
};

export default App;
