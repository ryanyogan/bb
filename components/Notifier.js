/* eslint-disable react/no-danger */
import { Snackbar } from '@material-ui/core';
import React from 'react';

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  };

  openSnackbar = ({ message }) => {
    this.setState({ open: true, message });
  };

  render() {
    const { open, message } = this.state;

    const messageSpan = (
      <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: message }} />
    );

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={messageSpan}
        autoHideDuration={5000}
        onClose={this.handleSnackbarRequestClose}
        open={open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
      />
    );
  }
}

export function openSnackbar({ message }) {
  openSnackbarFn({ message });
}

export default Notifier;
