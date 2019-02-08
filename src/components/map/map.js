import React, { Component } from 'react';
import './map.css';
import map from'./mcconomy.jpg';

export class Map extends Component {
    state = {
      showContent: false
    }
  
      render() {
        let content = null;
        if (this.state.showContent) {
            content = (
                <div className="content">
                    <p>{this.props.children}</p>
                </div>
            );
        }

        return (
        <div class="mainPage">
            <h5 class="sectionTitle">Getting to CMU</h5>
            <iframe class="map" src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJwTuY5SHyNIgROLIDNCm3XbE&key=AIzaSyDcMQLOO-WbqT-IopP9CmBzkmCBzoG67fQ" allowfullscreen></iframe>
            {/* <h5 class="sectionTitle">Getting around CMU</h5>
            <img src={map} alt="map"></img> */}
        </div>

        );
      }

    componentDidMount = () => {
        this.props.isLoaded()
    }
  }

  export default Map;