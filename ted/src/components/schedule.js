import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import moment from 'moment';
import Route from 'react-router-dom/Route';
import fire from '../fire.js';

export class Schedule extends Component {
  constructor() {
    super();
    this.state = {
      allEvents: []
    }


  }
  render() {
    console.log(this.state.allEvents)
    var newList = this.state.allEvents.forEach(event => {
        console.log(event)
        console.log(event[0])
        return (<li>Name: {event[0]}, Time: {moment(event[1])}</li>)
    })

    return (
      <div>
          <ul>{newList}</ul>
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentDidMount() {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('itinerary').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
        console.log(doc.data)
        // console.log(doc.id, '=>', doc.data());
        // console.log(doc.data().name + doc.data().age);
        const keys = Object.keys(doc.data())
        const entries = Object.entries(doc.data())
        wholeData = (entries)
      });
      this.setState({allEvents: wholeData})
      console.log(this.state.allEvents)
    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

}

export default Schedule;