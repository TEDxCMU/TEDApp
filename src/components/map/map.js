import React, { Component } from 'react';
import './map.css';
import map from'./cuc.png';

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
            <h5 className="sectionTitle">Getting to the Event</h5>
            <img name="mcconomy" className="indoor-map" alt="indoor-map" src={map}></img>
        </div>
        );
      }

    componentDidMount = () => {
        this.props.isLoaded()
    }
  }

  export default Map;