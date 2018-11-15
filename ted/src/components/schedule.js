import React, { Component } from 'react';
import '../App.css';
import './schedule.css';
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
    let allEvents = this.state.allEvents;
    let newList = [];
    this.state.allEvents.forEach(event => {
        let name = event[0];
        let time = moment().format(event[1]);

        newList.push (
            <li key={name}><span><strong>{name}</strong></span> — <span>{time}</span></li>
          ) 
        console.log(newList.length)
    })

    function orderByDate(arr, dateProp) {
      return arr.slice().sort(function (a, b) {
        return a[dateProp] < b[dateProp] ? -1 : 1;
      });
    }

    return (
      <div className="schedule">
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
            const entries = Object.entries(doc.data())
            wholeData = (entries)
        }
    );
      this.setState({allEvents: wholeData})
    })
    .catch(error => {
      console.log('Error!', error);
    })
  }
}

export default Schedule;