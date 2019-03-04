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

const MarkerPosed = posed(forwardRef((props, innerRef) => <Marker {...props} ref={innerRef} />))({
// const MarkerPosed = createAnimatedComponent(Marker)({
  enter: { y: 0, x: 0, opacity: 1, 
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 15 },
      y: { type: 'spring', stiffness: 300, damping: 15 },
      default: { duration: 300 }
    } 
  },
  exit: { y: 20, opacity: 0, transition: { duration: 150 } }
});

const MarkersPosed = posed(forwardRef((props, innerRef) => <Markers {...props} ref={innerRef} />))({
// const MarkersPosed = createAnimatedComponent(Markers)({
  enter: {
    x: 0,
    delayChildren: 1100,
    staggerChildren: 50,
    transition: {
      x: { type: 'spring', stiffness: 100, damping: 15 },
      y: { type: 'spring', stiffness: 100, damping: 15 },
    }
  },
  exit: { x: '-100%', delay: 0, transition: { duration: 0 }}
});





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
        <button onClick={this.handleZoomIn}>
          { "Zoom in" }
        </button>
        <button onClick={this.handleZoomOut}>
          { "Zoom out" }
        </button>
        <button onClick={this.handleReset}>
          { "Reset" }
        </button>
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
                          r={6}
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
        console.log(doc.data().newuser)
        let data = doc.data().newuser;
        let newUser = {
          name: data.name,
          coordinates: [data.longitude, data.latitude]
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




// import React, { Component } from 'react';
// import '../../App.css';
// import './brains.css';
// import fire from '../../fire.js';

// //import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
// //import { GoogleAutoComplete } from 'react-native-google-autocomplete'
// import { GoogleComponent } from 'react-google-location'
// import L from 'leaflet';
// import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';
// const API_KEY =  "AIzaSyBYx6l-f2nChXxFUqLXZHe19bmgixFomq0"

// //Illustrates the location marker icon on the map
// var messageIcon = L.icon({
// //   iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
// //   iconSize: [25, 41],
// //   iconAnchor: [12.5, 41],
// //   popupAnchor: [0, -41]
// });


// export class BrainFood extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       center: [43.00, -79.00],
//       zoom: 13,
//       userMessage: {
//         name: '',
//         message: ''
//       },
//       place: null,
//       users: [],
//       newList: []
//     };
//   }

//    formSubmitted = (event) => {
//     event.preventDefault();

//     const newuser = {
//       name: this.state.userMessage.name,
//       message: this.state.userMessage.message,
//       latitude: this.state.place.coordinates.lat,
//       longitude: this.state.place.coordinates.lng,
//     };
//     console.log(newuser);

//     this.setState(prevState => ({
//       users: [...prevState.users, newuser]
//     }))

//     let db = fire.firestore();
//     db.collection("map").add({newuser})
//     .then(function() {
//       console.log("Document successfully updated!");
//     })
//   }

//   valueChanged = (event) => {
//     const { name, value } = event.target;
//     this.setState((prevState) => ({
//       userMessage: {
//         ...prevState.userMessage,
//         [name]: value
//       }
//     }));
//   }

//   render () { 
//     console.warn("result return here", this.state.place)
//     return (
//       <div className="map">
        
//         <Map className="map" center={this.state.center} zoom={this.state.zoom}>
//           <TileLayer
//             attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {this.state.users.map(user => (
//             <Marker
//               key={user}
//               position={[user.latitude, user.longitude]}
//               icon={messageIcon}>
//               <Popup>
//                 {user.name}: <br /> {user.message}
//               </Popup>
//             </Marker>
//           ))}     
//         </Map>

//         <Card body className="message-form">
//           <CardTitle>Welcome to Tedx CMU!</CardTitle>
//           <CardText>Leave a message and enter where you are from!</CardText>
//           <CardText>Thank you for stopping by!</CardText>
//           <Form onSubmit={this.formSubmitted}>
//             <FormGroup>
//               <Label for="name">Name</Label>
//               <Input 
//                 onChange={this.valueChanged}
//                 type="text" 
//                 name="name" 
//                 id="name" 
//                 placeholder="Enter your name" />
//             </FormGroup>

//             <FormGroup>
//               <Label for="home">Where are you from?</Label>
//               <GoogleComponent 
//                 apiKey={API_KEY} 
//                 language={'en'} 
//                 country={'country:us'} 
//                 coordinates={true}
//                 onChange={(e) => { this.setState({ place: e }) }} 
//                 />       
//             </FormGroup>

//             <FormGroup>
//               <Label for="message">Message</Label>
//               <Input 
//                 onChange={this.valueChanged}
//                 type="textarea" 
//                 name="message" 
//                 id="message" 
//                 placeholder="Enter a message" />
//             </FormGroup>
//             <Button type="submit" color="info">Submit</Button>
//           </Form>
//         </Card>

//       </div>
//     );
//   }

//   componentDidMount() {
//     const db = fire.firestore();
//     var wholeData = []
//     db.collection('map').
//     get().then(snapshot => {
//       snapshot.forEach(doc => {
//         let id = doc.id;
//         db.collection('map').doc(id).onSnapshot(docSnapshot => {
//           let dataCopy = docSnapshot.data()
//           wholeData.push(dataCopy);
//         })
//       })
//       this.setState({users: wholeData})
//     })
//   }
// }

// export default BrainFood;