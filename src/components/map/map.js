import React, { Component } from 'react';
import './map.css';
// import map from'./mcconomy.jpg';

export class Map extends Component {
    state = {
      showContent: false
    }
  
      render() {
        return (
        <div className="mainPage">
            <h5 className="sectionTitle">Getting to CMU</h5>
            <iframe name="map" className="map" src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJwTuY5SHyNIgROLIDNCm3XbE&key=AIzaSyCTunhepxOuJE0aJPNWRhtbxCmCPIj29rI" title="map" allowFullScreen
            ></iframe>
        </div>
        );
      }

    componentDidMount = () => {
        this.props.isLoaded()
    }
  }

  export default Map;