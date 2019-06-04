import { openSnackbar } from '../components/Notifier';

const notify = (obj) => {
  openSnackbar({ message: obj.message || obj.toString() });
};

export default notify;
