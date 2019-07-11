import { Avatar, Menu } from '@material-ui/core';
import Link from 'next/link';
import { arrayOf, string } from 'prop-types';
import React from 'react';

class MenuDrop extends React.Component {
  static propTypes = {
    src: string.isRequired,
    alt: string.isRequired,
    options: arrayOf(String).isRequired,
  };

  state = {
    open: false,
    anchorEl: undefined,
  };

  button = undefined;

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { options, src, alt } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <div>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: '0px 20px 0px auto', cursor: 'pointer' }}
        />
        <Menu id="simple-menu" anchorEl={anchorEl} open={open} onClose={this.handleClose}>
          <p />
          {options.map((option) => (
            <div id="wrappingLink" key={option.text}>
              <Link prefetch href={options.href} as={option.as || option.href}>
                <a style={{ padding: '0px 20px' }}>{option.text}</a>
              </Link>
              <p />
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

export default MenuDrop;
