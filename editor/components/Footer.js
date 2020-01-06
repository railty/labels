import React from 'react';
import { Container } from "reactstrap";
import { initCenteringGuidelines } from './Helpers'

class Footer extends React.Component {
  state = {
    savestateaction: true,
    canvasScale: 1,
    SCALE_FACTOR: 1.2,
  };

  render() {
    let options = []
    for (let i = 1; i < 17; i ++) {
     options.push(<option key={i} value={i * 25}>{i * 25}%</option>)
    }

    return (
      <Container className="footer">
      </Container>
    );
  }
}

export default Footer;