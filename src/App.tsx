import React, { Component } from "react";

import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

import { SourceItems } from "./editors/types";
import { CSVEditor } from "./editors/CSVEditor";
import { JSONEditor } from "./editors/JSONEditor";
import { DataGridEditor } from "./editors/DataGridEditor";

import "./App.css";

export enum EditorMode {
  CSV = "CSV",
  GRID = "GRID",
  JSON = "JSON"
}

interface AppProps { }

interface AppState {
  mode: EditorMode;
  source: SourceItems;
}

const modeToComponentMap = Object.freeze({
  [EditorMode.CSV]: CSVEditor,
  [EditorMode.JSON]: JSONEditor,
  [EditorMode.GRID]: DataGridEditor,
})

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      mode: EditorMode.CSV,
      source: []
    }
  }

  handleModeChange = (mode: EditorMode) => this.setState({ mode })

  handleSourceChange = (source: SourceItems) => this.setState({ source })

  render() {
    const EditorComponent = modeToComponentMap[this.state.mode] || <div>Error</div>;

    return (
      <div>
        <Navigation
          mode={this.state.mode}
          onModeChange={this.handleModeChange}
        />
        <main className="Editor" >
          <EditorComponent
            onSourceChange={this.handleSourceChange}
            source={this.state.source}
          />
        </main>
        <Footer />
      </div>
    )
  }
}