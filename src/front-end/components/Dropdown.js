import React, { Component } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap';

export default class CustomDropdown extends Component {
  state = { open: false, textFilter: '' };

  static defaultProps = {
    options: [],
    onChange: () => null,
    textFilter: false
  };

  toggle = () => {
    this.setState(
      prevState => ({
        textFilter: '',
        open: !prevState.open
      }),
      () => {
        if (this.state.open && this.props.textFilter) {
          this.input.focus();
        }
      }
    );
  };

  get options() {
    const { textFilter } = this.state;
    if (this.props.textFilter === false || this.state.textFilter == '') {
      return this.props.options;
    }
    const searchValue = textFilter.toLowerCase();
    return this.props.options.filter(option =>
      option.toLowerCase().includes(searchValue)
    );
  }

  onTextChange = event => {
    const { value } = event.target;

    this.setState(() => ({
      textFilter: value
    }));
  };

  render() {
    const { open } = this.state;
    const label = this.props.value || this.props.label;

    return (
      <Dropdown
        className={this.props.className}
        isOpen={open}
        toggle={this.toggle}
      >
        <DropdownToggle caret>{label}</DropdownToggle>
        <DropdownMenu>
          {this.props.textFilter && (
            <Input
              innerRef={input => (this.input = input)}
              placeholder="Log Search Filter"
              onChange={this.onTextChange}
              value={this.state.textFilter}
            />
          )}
          {this.options.map((value, index) => (
            <DropdownItem
              key={index * 10}
              onClick={() => this.props.onChange(value)}
            >
              {value}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}
