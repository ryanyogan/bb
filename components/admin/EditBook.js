import { Button, Input, MenuItem, Select, TextField } from '@material-ui/core';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { getGithubRepos } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import logger from '../../server/logs';
import { styleTextField } from '../SharedStyles';

class EditBook extends React.Component {
  static propTypes = {
    book: shape({
      _id: string.isRequired,
    }),
    onSave: func.isRequired,
  };

  static defaultProps = {
    book: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      book: props.book || {},
      repos: [],
    };
  }

  async componentDidMount() {
    try {
      const { repos } = await getGithubRepos();
      this.setState({ repos });
    } catch (error) {
      logger.error(error);
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      book: { name, price, githubRepo },
      ...book
    } = this.state;
    const { onSave } = this.props;

    if (!name) {
      notify('Name is required');
      return;
    }

    if (!price) {
      notify('Price is required');
      return;
    }

    if (!githubRepo) {
      notify('Github repo is required');
      return;
    }

    onSave(book);
  };

  onChange = (event) => {
    this.setState((state) => ({
      book: Object.assign({}, state.book, { name: event.target.value }),
    }));
  };

  render() {
    const { book, repos } = this.state;
    return (
      <div style={{ padding: '10px 45px' }}>
        <form onSubmit={this.onSubmit}>
          <br />
          <div>
            <TextField
              onChange={this.onChange}
              value={book.name}
              type="text"
              label="Book's title"
              labelClassName="textFieldLabel"
              style={styleTextField}
              required
            />
          </div>
          <br />
          <br />
          <TextField
            onChange={(event) => {
              this.setState((state) => ({
                book: Object.assign({}, state.book, { price: Number(event.target.value) }),
              }));
            }}
            value={book.price}
            type="number"
            label="Book's price"
            className="textFieldInput"
            style={styleTextField}
            step="1"
            required
          />
          <br />
          <br />
          <div>
            <span>Github repo: </span>
            <Select
              value={book.githubRepo || ''}
              input={<Input />}
              onChange={(event) => {
                this.setState((state) => ({
                  book: Object.assign({}, state.book, { githubRepo: event.target.value }),
                }));
              }}
            >
              <MenuItem value="">
                <em>-- choose github repo --</em>
              </MenuItem>
              {repos.map((r) => (
                <MenuItem value={r.full_name} key={r.id}>
                  {r.full_name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <br />
          <br />
          <Button raised type="submit">
            Save
          </Button>
        </form>
      </div>
    );
  }
}

export default EditBook;
