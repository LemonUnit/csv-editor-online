import React, { Component } from "react";
import { Layout, Menu } from "antd";

import { EditorMode } from "../App";

interface Props {
  onModeChange: (mode: EditorMode) => void;
  mode: EditorMode;
}

interface State { }

export const NAVIGATION_HEIGHT = 64;
export const CONFIG_BAR_HEIGHT = 40;

export class Navigation extends Component<Props, State> {
  renderLogo = () => {
    return (
      <div className="logo">
        CSV Editor
      </div>
    );
  }

  renderButtons = () => {
    const buttons = [
      EditorMode.CSV,
      EditorMode.GRID,
      EditorMode.JSON
    ].map(mode => (
      <Menu.Item
        key={mode}
        onClick={() => this.props.onModeChange(mode)}
      >
        {mode}
      </Menu.Item>
    ));

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[EditorMode.CSV]}
        style={{ lineHeight: `${NAVIGATION_HEIGHT}px` }}
      >
        {buttons}
      </Menu>
    );
  }

  render() {
    return (
      <Layout.Header>
        {this.renderLogo()}
        {this.renderButtons()}
      </Layout.Header>
    )
  }
}