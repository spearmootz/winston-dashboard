import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import Dropdown from './components/Dropdown';
import './index.scss';
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table
} from 'reactstrap';

const levels = {
  silly: { class: 'text-success', label: 'Silly', value: 5 },
  debug: { class: 'text-muted', label: 'Debug', value: 4 },
  verbose: { class: 'text-primary', label: 'Verbose', value: 3 },
  info: { class: 'text-info', label: 'Info', value: 2 },
  warn: { class: 'text-warning', label: 'Warn', value: 1 },
  error: { class: 'text-danger', label: 'Error', value: 0 }
};

const levelNames = Object.keys(levels);

const rowOptions = [20, 50, 100, 250, 500, 1000];

class App extends Component {
  state = {
    rows: 100,
    page: 1,
    source: null,
    sources: [],
    logs: [],
    levelFilter: 'silly',
    inputFilter: ''
  };

  componentWillMount() {
    this.getSources();
    setInterval(this.getSources, 60 * 1000);
  }

  getSources = () => {
    fetch('/api/sources')
      .then(response => response.json())
      .then(sources =>
        this.setState(prevState => {
          const { source } = this.state;
          const selectNewSource = source == null;
          if (selectNewSource) {
            setTimeout(this.runQuery, 200);
          }
          return { sources, source: selectNewSource ? sources[0] : source };
        })
      );
  };

  updateState = state => {
    this.setState(() => state, this.runQuery);
  };

  runQuery = () => {
    const { source, page, rows } = this.state;

    const query = {
      rows,
      start: (page - 1) * rows
    };

    fetch(`/api/query?source=${source}&query=${JSON.stringify(query)}`)
      .then(response => response.json())
      .then(logs => {
        this.setState(() => ({
          logs: logs.map(log => ({
            ...log,
            levelRank: levels[log.level].level
          }))
        }));
      });
  };

  selectLevelFilter = level => {
    this.setState(() => ({
      levelFilter: level.toLowerCase()
    }));
  };

  get sourceSelector() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Select Log</InputGroupText>
        </InputGroupAddon>
        <Dropdown
          onChange={source => this.updateState({ source, page: 1 })}
          value={this.state.source}
          options={this.state.sources}
          label="Select Log File"
        />
      </InputGroup>
    );
  }

  get rowsSelector() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Rows</InputGroupText>
        </InputGroupAddon>
        <Dropdown
          onChange={rows => this.updateState({ rows, page: 1 })}
          value={this.state.rows}
          options={rowOptions}
          label="Select Log File"
        />
      </InputGroup>
    );
  }

  get levelSelector() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Maximum Level</InputGroupText>
        </InputGroupAddon>
        <Dropdown
          onChange={this.selectLevelFilter}
          value={this.getLevel(this.state.levelFilter).label}
          options={levelNames.map(level => levels[level].label)}
          label="Select Minimum Filter Level"
        />
      </InputGroup>
    );
  }

  getLevel = level => {
    return levels[level] ? levels[level] : {};
  };

  get logs() {
    const { levelFilter, inputFilter } = this.state;
    const levelFilterValue = this.getLevel(levelFilter).value;
    const textFilter = inputFilter.toLowerCase();
    const logs =
      levelFilter === 'silly'
        ? this.state.logs
        : this.state.logs.filter(
            ({ level }) => this.getLevel(level).value <= levelFilterValue
          );

    return inputFilter == ''
      ? logs
      : logs.filter(log => log.message.toLowerCase().includes(textFilter));
  }

  get table() {
    return (
      <div>
        <div style={{ height: '800px', overflowY: 'scroll' }}>
          <Table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Message</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {this.logs.map(({ level, message, timestamp }) => (
                <tr>
                  <td
                    className={
                      this.getLevel(level).class + ' font-weight-bold '
                    }
                  >
                    {level}
                  </td>
                  <td>{message}</td>
                  <td>{moment(timestamp).format('LLLL')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {this.pagination}
      </div>
    );
  }

  previousPage = () => {
    this.setState(
      prevState => ({
        logs: [],
        page: prevState.page - 1
      }),
      this.runQuery
    );
  };

  nextPage = () => {
    this.setState(
      prevState => ({
        logs: [],
        page: prevState.page + 1
      }),
      this.runQuery
    );
  };

  changeInputFilter = event => {
    const { value } = event.target;
    this.setState(prevState => ({
      inputFilter: value
    }));
  };

  get pagination() {
    return (
      <Row className="justify-content-center">
        <Col md="6">
          <Pagination className="justify-content-center">
            {this.state.page > 1 && (
              <PaginationItem onClick={this.previousPage}>
                <PaginationLink previous href="#" />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink>Page {this.state.page}</PaginationLink>
            </PaginationItem>
            {this.state.logs.length >= this.state.rows && (
              <PaginationItem onClick={this.nextPage}>
                <PaginationLink next href="#" />
              </PaginationItem>
            )}
          </Pagination>
        </Col>
      </Row>
    );
  }

  get inputFilter() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Text Search</InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder="Search"
          value={this.state.inputFilter}
          onChange={this.changeInputFilter}
        />
      </InputGroup>
    );
  }

  render() {
    return (
      <Container style={{ marginTop: '3rem' }}>
        <Row>
          <Col className="text-center">
            <h1>Winston Dashboard</h1>
          </Col>
        </Row>
        <Row fluid className="justify-content-sm-center&quot;">
          <Col sm="auto">
            {this.sourceSelector}
            {this.inputFilter}
          </Col>
          <Col sm="auto">
            {this.levelSelector}
            {this.rowsSelector}
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="11">{this.table}</Col>
        </Row>
      </Container>
    );
  }
}

render(<App />, document.getElementById('app'));
