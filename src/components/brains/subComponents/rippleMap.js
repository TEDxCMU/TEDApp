import React, { Component, forwardRef } from "react";
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
import '../../../App.css';
import './rippleMap.css';
import fire from '../../../fire.js';
import posed from 'react-pose';

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

export class RippleMap extends Component {
  constructor() {
    super()
    this.state = {
      center: [0,20],
      zoom: 1,
      users: []
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
      return (
        <div></div>
      )
    } 
    return (
      <div style={wrapperStyles}>
        {/* <button onClick={this.handleZoomIn}>
          { "Zoom in" }
        </button>
        <button onClick={this.handleZoomOut}>
          { "Zoom out" }
        </button>
        <button onClick={this.handleReset}>
          { "Reset" }
        </button> */}
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
                scale: 205
              }}
                width={980}
                height={551}
                style={{
                  width: "100%",
                  height: "auto",
                }}
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
                              fill: "#CFD8DC",
                              stroke: "#607D8B",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#FF5722",
                              stroke: "#607D8B",
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
                        <circle
                          cx={0}
                          cy={0}
                          r={9}
                          fill="#FF5722"
                          stroke="#DF3702"
                        />
                      </Marker>
                    ))}
                  </Markers>
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>
        </div>
      </div>
    )
  }

  componentDidMount() {
    const db = fire.firestore();
    var wholeData = []
    db.collection('maps').
    get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data())
        let data = doc.data();
        let newUser = {
          name: data.name,
          coordinates: [data.lng, data.lat]
        };
        wholeData.push(newUser)
      })
      this.setState({users: wholeData}, () => console.log(this.state.users[0]))
    })
  }

  touchWarning = (e) => {
    if (e.touches.length === 1) {
      console.log("nooooooooo")
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