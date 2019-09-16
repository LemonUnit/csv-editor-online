import React, { Component } from "react";
import { Icon, Row, Col } from "antd";

interface Props { }
interface State { }

export const FOOTER_HEIGHT = 30;

export class Footer extends Component<Props, State> {
  renderGithubLink = () => {
    return (
      <a
        href="https://github.com/LemonUnit/csv-editor-online"
        target="_blank"
        className="GitHubIcon"
        title="Go to CSV Editor Online page on GitHub"
      >
        <Icon type="github" />
      </a>

    );
  }

  renderLemonUnitLink = () => {
    return (
      <a
        href="https://lemonunit.com/"
        target="_blank"
        className="LemonUnitIcon"
        title="Go to LemonUnit home page"
      >
        <img src="lemonunit-logo.png" alt="LemonUnit logo" />
      </a>
    );
  }

  render() {
    return (
      <footer className="Footer">
        <Row>
          <Col span={12}>
            {this.renderLemonUnitLink()}
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {this.renderGithubLink()}
          </Col>
        </Row>
      </footer>
    )
  }
}