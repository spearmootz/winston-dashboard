import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class CustomDropdown extends Component {
  state = {
    open: false
  }

  static defaultProps = {
    options: [],
    onChange: () => null
  }

  toggle = () => {
    this.setState((prevState) => ({ open: !prevState.open }))
  }

  render() {
    const { open } = this.state;
    const label = this.props.value || this.props.label;

    return (
      <Dropdown className={this.props.className} isOpen={open} toggle={this.toggle}>
        <DropdownToggle caret>
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {this.props.options.map((value, index) => (
            <DropdownItem key={index * 10} onClick={() => this.props.onChange(value)}>{value}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}