import React, { Component } from 'react';
import './App.scss';
import Button from './elements/button/button.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: [],
      iosPopUp: false,
      chromePopUp: false,
      loaded: false
    }
  }

  render() {
    return (
      <div>
        <Button variant="rounded" modifier="primary">Hello</Button>
      </div>
    );
  }
}

export default App;