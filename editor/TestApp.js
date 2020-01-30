import React, { Component } from 'react';
import Split from 'react-split';

class TestApp extends Component {
  constructor(props) {
    super(props);
    this.oid = 1;

    this.state = {
      gridsize: 30,
    };
  }


  componentDidMount() {
  }


  render() {
    const sidebarWidth = 200;

    return (
      <Split sizes={[25, 75]}>
      <div>
        aaaaaaaaaa
      </div>
      <div>
        bbbbbbaaaaaaaaaa
      </div>
    </Split>
    
  
    );
  }
}

export default TestApp;