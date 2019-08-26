import React, { Component } from "react";
import AceEditor from "react-ace";
import { Radio } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
// @ts-ignore
import * as csvString from "csv-string";
import brace from "brace"; // eslint-disable-line @typescript-eslint/no-unused-vars

import "brace/theme/github";
import "brace/mode/json";

import { EditorProps } from "./types";
import { NAVIGATION_HEIGHT, CONFIG_BAR_HEIGHT } from "../components/Navigation";

enum CSVDelimeter {
  SEMICOLON = ";",
  COMMA = ",",
  VARTICAL_BAR = "|"
}

interface Props extends EditorProps { }

interface State {
  csv: string;
  delimeter: CSVDelimeter;
  editorHeight: number;
}

const defaultState: State = {
  csv: "",
  editorHeight: 0,
  delimeter: CSVDelimeter.SEMICOLON
}

export class CSVEditor extends Component<Props, State> {
  state = {
    ...defaultState,
    delimeter: 'localStorage' in window
      ? window.localStorage.getItem('delimeter') as CSVDelimeter || CSVDelimeter.SEMICOLON
      : CSVDelimeter.SEMICOLON
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
    editorHeight: window.innerHeight - NAVIGATION_HEIGHT - CONFIG_BAR_HEIGHT
  })

  parseSourceItemsToCsv = () => this.setState({
    csv: csvString.stringify(this.props.source, this.state.delimeter)
  });

  updateSourceItemsByCsvString = () => {
    const sourceItems = csvString.parse(this.state.csv);

    this.props.onSourceChange(sourceItems);
  }

  handleChange = (csv: string) => this.setState({
    csv
  }, () => this.updateSourceItemsByCsvString());

  handleDelimeterChange = (e: RadioChangeEvent) => {
    const { value } = e.target;

    this.setState({
      delimeter: value
    });

    if ('localStorage' in window) {
      window.localStorage.setItem('delimeter', value);
    }
  }

  renderConfigBar = () => (
    <div className="ConfigBar">
      <div className="ConfigBarWidget">
        <span className="ConfigBarWidgetLabel">CSV Delimeter:</span>
        <span className="ConfigBarWidgetContent">
          <Radio.Group
            onChange={this.handleDelimeterChange}
            value={this.state.delimeter}
            size="small"
          >
            {[
              CSVDelimeter.SEMICOLON,
              CSVDelimeter.COMMA,
              CSVDelimeter.VARTICAL_BAR
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