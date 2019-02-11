import React, { Component } from 'react';
import './map.css';
// import map from'./mcconomy.jpg';

export class Map extends Component {
    state = {
      showContent: false
    }
  
      render() {
        // var content = null;
        // if (this.state.showContent) {
        //     content = (
        //         <div className="content">
        //             <p>{this.props.children}</p>
        //         </div>
        //     );
        // }

        return (
        <div className="mainPage">
            <h5 className="sectionTitle">Getting to CMU</h5>
            <iframe name="map" className="map" src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJwTuY5SHyNIgROLIDNCm3XbE&key=AIzaSyDcMQLOO-WbqT-IopP9CmBzkmCBzoG67fQ" title="map" allowFullScreen
            ></iframe>
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