import React, { Component } from "react";
import AceEditor from "react-ace";
import brace from "brace"; // eslint-disable-line @typescript-eslint/no-unused-vars

import "brace/theme/github";
import "brace/mode/json";

import { EditorProps } from "./types";
import { NAVIGATION_HEIGHT } from "../components/Navigation";
import { FOOTER_HEIGHT } from "../components/Footer";

interface Props extends EditorProps { }

interface State {
  json: string;
  editorHeight: number;
}

const defaultState: State = {
  json: "[]",
  editorHeight: 0
}

export class JSONEditor extends Component<Props, State> {
  state = defaultState;

  componentDidMount() {
    this.updateEditorHeight();
    this.parseSourceItemsToJson();

    window.addEventListener('resize', () => this.updateEditorHeight());
  }

  componentWillUnmount() {
    this.setState(defaultState);

    window.removeEventListener('resize', () => this.updateEditorHeight());
  }

  updateEditorHeight = () => this.setState({
    editorHeight: window.innerHeight - FOOTER_HEIGHT - NAVIGATION_HEIGHT
  })

  parseSourceItemsToJson = () => this.setState({
    json: JSON.stringify(this.props.source, null, 2)
  });

  handleChange = (json: string) => this.setState({
    json
  }, () => this.updateSourceItemsByCsvString());

  updateSourceItemsByCsvString = () => {
    try {
      const sourceItems = JSON.parse(this.state.json);
      this.props.onSourceChange(sourceItems);
    } catch (e) { }
  }

  render() {
    return (
      <AceEditor
        mode="json"
        theme="github"
        onChange={this.handleChange}
        value={this.state.json}
        name="csv_editor"
        width="100%"
        height={`${this.state.editorHeight}px`}
        editorProps={{ $blockScrolling: true }}
      />
    )
  }
}