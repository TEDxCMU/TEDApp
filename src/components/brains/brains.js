import React, { Component } from 'react';
//import '../../App.css';
import './brains.css';
import '../questions/myQuestions.css';
import QuestionComponent from '../questions/questionComponent.js'
import fire from '../../fire.js';
import Dropdown from '../dropdown/dropdown';

import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';

//Illustrates the location marker icon on the map
// var myIcon = L.icon({
//   iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
//   iconSize: [25, 41],
//   iconAnchor: [12.5, 41],
//   popupAnchor: [0, -41]
// });


export class BrainFood extends Component {
  // state = {
  //   location: {
  //     lat: 51.505,
  //     lng: -0.09
  //   },
  //   zoom: 2,
  //   userMessage: {
  //     name: '',
  //     message: ''
  //   }
  // }

  constructor() {
    super();
    this.state = {
      questions: null,
      speaker: 'rscarano@cmu.edu'
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  toggleRoma = () => {
      this.setState({ speaker: 'rscarano@cmu.edu'});
  }

  toggleSecond = () => {
      this.setState({ speaker: 'second@lastname.com'});
  }

  toggleQuinn = () => {
      this.setState({ speaker: 'quinn@lastname.com'});
  }

  render () {
    let romaClasses = "button-primary medium blank";
    let secondClasses = "button-primary medium blank";
    let quinnClasses = "button-primary medium blank";
    let newList = [];
    if (this.state.questions !== null) {
      this.state.questions.forEach(question => {  
        if (question.answer !== "") {
          let index = this.state.questions.indexOf(question);
          newList.push (
            <div className="speaker">
              <Dropdown question={question.question}>
                  <form className="questions-form">
                      <label style={{marginTop: '0'}}>Question:</label>
                      <p>"{question.question}"</p>
                      <p>FROM: {question.name}</p>
                      <p>Answer: </p>
                      <p>"{question.answer}"</p>
                  </form>
              </Dropdown>
            </div>
          )
        }  
 
    })
    if (this.state.speaker === 'rscarano@cmu.edu') {
        romaClasses = "button-primary medium";
    } else {
        romaClasses += "button-primary medium blank";
    }

    if (this.state.speaker === 'second') {
        secondClasses = "button-primary medium";
    } else {
        secondClasses += "button-primary medium blank";
    }

    if (this.state.speaker === 'quinn@lastname.com') {
        quinnClasses = "button-primary medium";
    } else {
        quinnClasses = "button-primary medium blank";
    }
    }
    return (
      <div className="faq">
          <div className="justified">
              <button onClick={this.toggleRoma} style={{boxShadow: 'none'}} className={romaClasses}>Roma</button>
              <button onClick={this.toggleSecond} style={{boxShadow: 'none'}} className={secondClasses}>Second</button>
              <button onClick={this.toggleQuinn} style={{boxShadow: 'none'}} className={quinnClasses}>Quinn</button>
          </div>
          {this.state.questions !== null ?
          <div className="speakers">
            {newList}
          </div>
          :
          <div className="speakers">
            <h1>No questions answered yet!</h1>
          </div>
          }

      </div>
    )
  }

  componentDidMount = () => {
    // if (fire.auth().currentUser === null || localStorage.getItem('userEmail') === null) {
    //   this.setState({
    //     redirectHome: true
    //   })
    //   return;
    // }
    // let userEmail = localStorage.getItem('userEmail');
    const db = fire.firestore();
    // db.settings({
    //   timestampsInSnapshots: true
    // });
    var wholeData = [];
    let speakerRef = db.collection('speakers').where('email', '==', this.state.speaker);
    db.collection('speakers').doc(this.state.speaker).collection("questions").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let docCopy = doc.data();
            docCopy.id = doc.id;
            docCopy.answered = false;
            wholeData.push(docCopy)
        });
        // let questions = Array(wholeData.length)
      console.log(wholeData)
      this.setState(
        {questions: wholeData}, () => this.props.isLoaded()
      )
    })
  }


  //  //Function called when the submit button is pressed to submit user name and message to server
  //  formSubmitted = (event) => {
  //   event.preventDefault();
  //   console.log(this.state.userMessage);
  // }

  // //Function called user resubmits a message or submits a new message
  // //Updates the string in the name and message field
  // valueChanged = (event) => {
  //   const { name, value } = event.target;
  //   this.setState((prevState) => ({
  //     userMessage: {
  //       ...prevState.userMessage,
  //       [name]: value
  //     }
  //   }));
  // }

  // render () {
  //   const position = [this.state.location.lat, this.state.location.lng];
  //   const position2 = [45, 9]
  //   return (
  //     <div className="map">
  //       <Map className="map" center={position} zoom={this.state.zoom}>
  //         <TileLayer
  //           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //         />
  //         <Marker 
  //           position={position}
  //           icon={myIcon}>
  //           <Popup>
  //             A pretty CSS3 popup. <br /> Easily customizable.
  //           </Popup>
  //         </Marker>
  //         <Marker 
  //           position={position2}
  //           icon={myIcon}>
  //           <Popup>
  //             A pretty CSS3 popup. <br /> Easily customizable.
  //           </Popup>
  //         </Marker>
  //       </Map>
  //       {/* Shows a permanent immobile card in the upper right hand corner of the screen that enables
  //       user to enter in a name and message with a submit button. Need to integrate a loading icon and
  //       a success message to show that the message has been successfully submitted to the server. */}
  //       <Card body className="message-form">
  //         <CardTitle>Welcome to Tedx CMU!</CardTitle>
  //         <CardText>Leave a message and enter where you are from!</CardText>
  //         <CardText>Thank you for stopping by!</CardText>
  //         <Form onSubmit={this.formSubmitted}>
  //           <FormGroup>
  //             <Label for="name">Name</Label>
  //             <Input 
  //               onChange={this.valueChanged}
  //               type="text" 
  //               name="name" 
  //               id="name" 
  //               placeholder="Enter your name" />
  //           </FormGroup>
  //           <FormGroup>
  //             <Label for="message">Message</Label>
  //             <Input 
  //               onChange={this.valueChanged}
  //               type="textarea" 
  //               name="message" 
  //               id="message" 
  //               placeholder="Enter a message" />
  //           </FormGroup>
  //           <Button type="submit" color="info">Submit</Button>
  //         </Form>
  //       </Card>
  //     </div>
  //   );
  // }
}
  
export default BrainFood;