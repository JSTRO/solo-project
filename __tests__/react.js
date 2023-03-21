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

    xtest('Get Microphone button triggers alert on click', async () => {
      const alertMock = jest
        .spyOn(navigator.mediaDevices, 'getUserMedia')
        .mockImplementation();
      userEvent.click(getByText('Get Microphone'));
      expect(alertMock).toHaveBeenCalledTimes(1);
    });
  });
});
