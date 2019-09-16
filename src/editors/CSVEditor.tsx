import React, { Component } from "react";
import AceEditor from "react-ace";
import { Radio, Modal } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
// @ts-ignore
import * as csvString from "csv-string";
import brace from "brace"; // eslint-disable-line @typescript-eslint/no-unused-vars

import "brace/theme/github";
import "brace/mode/json";

import { EditorProps } from "./types";
import { NAVIGATION_HEIGHT, CONFIG_BAR_HEIGHT } from "../components/Navigation";
import { FOOTER_HEIGHT } from "../components/Footer";

enum CSVDelimiter {
  SEMICOLON = ";",
  COMMA = ",",
  VARTICAL_BAR = "|"
}

interface Props extends EditorProps { }

interface State {
  csv: string;
  delimiter: CSVDelimiter;
  editorHeight: number;
}

const defaultState: State = {
  csv: "",
  editorHeight: 0,
  delimiter: CSVDelimiter.SEMICOLON
}

export class CSVEditor extends Component<Props, State> {
  state = {
    ...defaultState,
    delimiter: 'localStorage' in window
      ? window.localStorage.getItem('delimiter') as CSVDelimiter || CSVDelimiter.SEMICOLON
      : CSVDelimiter.SEMICOLON
  };

  componentDidMount() {
    window.addEventListener('resize', () => this.updateEditorHeight())

    this.updateEditorHeight()
    this.parseSourceItemsToCsv();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateEditorHeight())

    this.setState(defaultState);
  }

  updateEditorHeight = () => this.setState({
    editorHeight: window.innerHeight - NAVIGATION_HEIGHT - FOOTER_HEIGHT - CONFIG_BAR_HEIGHT
  })

  parseSourceItemsToCsv = () => this.setState({
    csv: csvString.stringify(this.props.source, this.state.delimiter)
  });

  updateSourceItemsByCsvString = () => {
    const sourceItems = csvString.parse(this.state.csv, this.state.delimiter);

    this.props.onSourceChange(sourceItems);
  }

  handleChange = (csv: string) => this.setState({
    csv
  }, () => this.updateSourceItemsByCsvString());

  handleDelimiterChange = (e: RadioChangeEvent) => {
    const { value } = e.target;

    if (!this.state.csv.trim()) {
      return this.updateDelimiter(value);
    }

    Modal.confirm({
      title: 'Do you want to update CSV string to new delimiter?',
      content: '',
      onOk: () => this.updateCSVStringDelimiter(value),
      onCancel: () => this.updateDelimiter(value)
    });
  }

  updateCSVStringDelimiter = (delimiter: CSVDelimiter) => this.setState({
    csv: csvString.stringify(csvString.parse(this.state.csv, this.state.delimiter), delimiter)
  }, () => this.updateDelimiter(delimiter));

  updateDelimiter = (delimiter: CSVDelimiter) => this.setState({
    delimiter
  }, () => {
    if ('localStorage' in window) {
      window.localStorage.setItem('delimiter', delimiter);
    }
  });

  renderConfigBar = () => (
    <div className="ConfigBar">
      <div className="ConfigBarWidget">
        <span className="ConfigBarWidgetLabel">CSV Delimeter:</span>
        <span className="ConfigBarWidgetContent">
          <Radio.Group
            onChange={this.handleDelimiterChange}
            value={this.state.delimiter}
            size="small"
          >
            {[
              CSVDelimiter.SEMICOLON,
              CSVDelimiter.COMMA,
              CSVDelimiter.VARTICAL_BAR
            ].map((item, index) => (
              <Radio
                key={`item_${index}`}
                value={item}
              >
                <small>{item}</small>
              </Radio>
            ))}
          </Radio.Group>
        </span>
      </div>
    </div>
  )

  render() {
    return (
      <>
        {this.renderConfigBar()}
        <AceEditor
          mode="text"
          theme="github"
          onChange={this.handleChange}
          value={this.state.csv}
          name="csv_editor"
          width="100%"
          height={`${this.state.editorHeight}px`}
          editorProps={{ $blockScrolling: true }}
        />
      </>
    )
  }
}