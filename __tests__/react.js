import React from 'React';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import App from '../client/components/App';

describe('Unit testing React components', () => {
  describe('App', () => {
    let app;

    beforeAll(() => {
      app = render(<App />);
    });

    // FIGURE OUT HOW TO WRITE
    xtest('Get Microphone button triggers alert on click', async () => {
      const alertMock = jest
        .spyOn(navigator.mediaDevices, 'getUserMedia')
        .mockImplementation();
      userEvent.click(getByText('Get Microphone'));
      expect(alertMock).toHaveBeenCalledTimes(1);
    });
    xtest('Alert renders on microphone access denial', async () => {});
    xtest('Alert renders on browser not supporting MediaStream', async () => {});
  });
});
