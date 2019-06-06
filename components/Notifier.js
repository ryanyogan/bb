import { Snackbar } from '@material-ui/core';
import React from 'react';

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
  };

  constructor(props) {
    super(props);
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
    const message = (
      // eslint-disable-next-line
      <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: this.state.message }} />
    );
    const { open } = this.state;
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={message}
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

export const openSnackbar = ({ message }) => {
  openSnackbarFn({ message });
};

export default Notifier;
