import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const Recording = ({ recording, allRecordings, setRecordings }) => {
  const handleSaveRecording = () => {
    // make post request on save

    // let file = new File([recording.url], 'recording.we');
    // const formData = new FormData();

    // console.log('recording.url', recording.blob);

    // formData.append('size', recording.blob);

    // console.log(formData);

    fetch('/api', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(recording),
    })
      .then((res) => res.json())
      .then((result) => console.log(result))
      .catch((err) => console.log('error saving recording', err));
  };

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

  return (
    <li key={recording.id}>
      <div className="recording-element">
        <TextField
          id="outlined-basic"
          name={recording.id}
          label="Recording Title"
          variant="outlined"
          onChange={handleChangeName}
        />
        <audio src={recording.url} type="audio/webm" controls />
        <div className="download-save">
          {/* <Button variant="contained" className="download-button">
            <a download href={recording.url}>
              Download
            </a>
          </Button> */}
          <form
            encType="multipart/form-data"
            action="http://localhost:8080/api"
            method="POST"
          >
            <label htmlFor="file-upload"></label>
            <input id="file-upload" type="file" name="file" />
            <input type="submit" value="POST to server"></input>
          </form>
          <Button
            variant="contained"
            color="secondary"
            id={recording.id}
            onClick={handleDiscardRecording}
          >
            Discard
          </Button>
        </div>
      </div>
    </li>
  );
};

export default Recording;
