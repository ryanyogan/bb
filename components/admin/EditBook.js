import { Button, Input, MenuItem, Select, TextField } from '@material-ui/core';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { getGithubRepos } from '../../lib/api/admin';
import notify from '../../lib/notifier';
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
      // logger.error(error);
      console.log(error);
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { book } = this.state;
    const { name, price, githubRepo } = book;

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

  render() {
    const { book, repos } = this.state;
    return (
      <div style={{ padding: '10px 45px' }}>
        <form onSubmit={this.onSubmit}>
          <br />
          <div>
            <TextField
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, book, { name: event.target.value }),
                });
              }}
              value={book.name}
              type="text"
              label="Books title"
              labelClassName="textFieldLabel"
              style={styleTextField}
              required
            />
          </div>
          <br />
          <br />
          <div>
            <TextField
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, book, { price: Number(event.target.value) }),
                });
              }}
              value={book.price}
              type="number"
              label="Books price"
              labelClassName="textFieldLabel"
              style={styleTextField}
              step="1"
              required
            />
          </div>
          <br />
          <br />
          <div>
            <span>Github repo: </span>
            <Select
              value={book.githubRepo || ''}
              input={<Input />}
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, book, { githubRepo: event.target.value }),
                });
              }}
            >
              <MenuItem value="">
                <em>-- choose github repo --</em>
              </MenuItem>
              {repos.map((repo) => (
                <MenuItem value={repo.full_name} key={repo.id}>
                  {repo.full_name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <br />
          <br />
          <Button raised variant="contained" type="submit">
            Save
          </Button>
        </form>
      </div>
    );
  }
}

export default EditBook;
