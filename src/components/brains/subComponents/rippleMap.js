import React, { Component } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps";
import { Motion, spring } from "react-motion";
import map from '../static/world-110m.json';
import '../../../App.scss';
import './rippleMap.scss';
import fire from '../../../fire.js';

export class RippleMap extends Component {
  constructor() {
    super()
    this.state = {
      center: [0,20],
      zoom: 1,
      users: [],
      isOpen: false,
      touchError: false
    }
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
    this.handleCityClick = this.handleCityClick.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }
  handleZoomIn() {
    this.setState({
      zoom: this.state.zoom * 2,
    })
  }
  handleZoomOut() {
    this.setState({
      zoom: this.state.zoom / 2,
    })
  }
  handleCityClick(city) {
    this.setState({
      center: city.coordinates,
      cityClicked: city.name
    })
  }
  handleReset() {
    this.setState({
      center: [0,20],
      zoom: 1,
    })
  }
  render() {
    if (this.state.users === undefined) {
      return (<div></div>)
    } 
    return (
      <div className="map">
        <h5>{this.state.cityClicked === undefined ? "Click on the dots!" : ("Rippler: " + this.state.cityClicked)}</h5>
        <div onTouchStart={e => this.touchWarning(e)}>
          <Motion
            defaultStyle={{
              zoom: 1,
              x: 0,
              y: 20,
            }}
            style={{
              zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
              x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
              y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
            }}
          >
            {({zoom,x,y}) => (
              <ComposableMap
              projectionConfig={{
                scale: 250
              }}
                width={980}
                height={551}
                className="map__composable-map"
                >
                <ZoomableGroup center={[x,y]} zoom={zoom}>
                  <Geographies geography={map}>
                    {(geographies, projection) =>
                      geographies.map((geography, i) => geography.id !== "010" && (
                        <Geography
                          key={i}
                          geography={geography}
                          projection={projection}
                          style={{
                            default: {
                              fill: "#ECEFF1",
                              stroke: "#607D8B",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            hover: {
                              fill: "#f07f78",
                              stroke: "#e62b1e",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#f07f78",
                              stroke: "#e62b1e",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                          }}
                        />
                    ))}
                  </Geographies>
                  <Markers>
                    {this.state.users.map((city, i) => (
                      <Marker
                        key={i}
                        marker={city}
                        onClick={this.handleCityClick}
                        >
                          <circle className="map__marker" cx = {0} cy = {0} r = {8}></circle>
                          <circle className = "map__marker map__marker--ripple" cx = {0} cy = {0} r = {11}></circle>
                      </Marker>
                    ))}
                  </Markers>
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>
        </div>
        <div className="map__btn-group">
          <button className="btn btn--primary" onClick={this.handleZoomIn}>
            { "Zoom in" }
          </button>
          <button className="btn btn--primary" onClick={this.handleZoomOut}>
            { "Zoom out" }
          </button>
          <button className="btn btn--primary" onClick={this.handleReset}>
            { "Reset" }
          </button>
        </div>
      </div>
    )
  }

  componentDidMount() {
    const db = fire.firestore();
    var wholeData = []
    db.collection(this.props.db).doc('rippleMap').collection('rippleMap').onSnapshot( (snapshot) => {
      snapshot.forEach(doc => {
        let data = doc.data();
        let newUser = {
          name: data.name,
          coordinates: [data.lng, data.lat]
        };
        wholeData.push(newUser);
      });
      this.setState({
          users: wholeData,
          isOpen: true
      });
    })
  }

  touchWarning = (e) => {
    if (e.touches.length === 1) {
      this.setState({
        touchError: true
      });
      setTimeout(() => {
        this.setState({
          touchError: false
        });
      }, 2000);
    }
  }
}

export default RippleMap;