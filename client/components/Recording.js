import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HighlightOffIcon from '@material-ui/icons//HighlightOff';

const Recording = ({ recording, allRecordings, setRecordings }) => {
  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setRecordings((prev) =>
      prev.map((el) => (el.id === name ? { ...el, name: value } : el))
    );
  };

  const handleDiscardRecording = (e) => {
    const { id } = e.currentTarget;
    setRecordings((prev) => prev.filter((current) => current.id !== id));
  };

  console.log('allRecordings', allRecordings);

  return (
    <li key={recording.id}>
      <div className="recording-element">
        <div className="title-time">
          <TextField
            id="outlined-basic"
            name={recording.id}
            label="Recording Title"
            variant="outlined"
            onChange={handleChangeName}
            value={recording.name}
          />
          <p className="timestamp">
            {new Date(recording.timeStamp).toLocaleString().split(',')[0]}
          </p>
        </div>

        <div className="audio-bar">
          <audio src={recording.url} type="audio/webm" controls />

          <HighlightOffIcon
            variant="contained"
            color="secondary"
            id={recording.id}
            onClick={handleDiscardRecording}
          >
            Discard
          </HighlightOffIcon>
        </div>
      </div>
    </li>
  );
};

export default Recording;
