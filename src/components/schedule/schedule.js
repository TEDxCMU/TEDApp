import React, { Component } from 'react';
import '../../App.css';
import './schedule.css';
import EventDetails from '../event/eventDetails.js'
import {Link} from 'react-router-dom';
import moment from 'moment';
import Route from 'react-router-dom/Route';
import fire from '../../fire.js';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

export class Schedule extends Component {
  constructor() {
    super();
    this.state = {
      value: moment(),
      canShiftAll: true,
      allEvents: [],
      updateCount: 0,
      watchingForChanges: false
    }
  }

  deleteEvent = (index, e) => {
    const newList = Object.assign([],this.newList);
    newList.splice(index, 1);
    this.setState({newList:newList});
  }

  EventComponent = ({ match }) => {
    const event = this.state.allEvents.find(({ id }) => id === match.params.eventId)
    console.log(event)
    return (
      <div>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
      </div>
    )
  }

  render = () => {
    if (this.state.allEvents.length === 0) {
      return (
        <div>Loading</div>
      )
    }
    console.log(this.state.allEvents)
    let newList = [];

    this.state.allEvents.forEach(event => {
        if (event.type !== "static") {
          newList.push(
            <li key={event.id}>
            <Link key={event.id} to={{
              pathname: '/events/'+event.id,
              state: {  
                  id: event.id,
                  title: event.title,
                  start: event.start,
                  end: event.end,
                  description: event.description,
                  blurb: event.blurb,
                  speaker: event.speaker.id,
                  related: event.related
              }
            }}>
            {/* Change bullet color here, time, and the info in a timeline event */}
              <div className="bullet bullet-red"></div>
              <div className="time"><strong>{event.start}</strong> — {event.end}</div>
              <br />
              <div className="info">
                <h2>{event.title}</h2>
                <p>{event.blurb}</p>
              </div>
            </Link>
          {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
              <button onClick={() => { this.shiftEndTime(allEvents.indexOf(event), moment().format('hh:mm A')) }}>Event Ended</button> 
            :
              <div></div>
          }
          </li>
        )
      }
      else {
      newList.push(
        <li key={event.id}>
            {/* Change bullet color here, time, and the info in a timeline event */}
              <div className="bullet bullet-red"></div>
              <div className="time"><strong>{event.start}</strong> — {event.end}</div>
              <br />
              <div className="info">
                <h2>{event.title}</h2>
                <p>{event.blurb}</p>
              </div>
          {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
              <button onClick={() => { this.shiftEndTime(allEvents.indexOf(event), moment().format('hh:mm A')) }}>Event Ended</button> 
            :
              <div></div>
          }
      </li>
      )}
    })
    let allEvents = this.state.allEvents;
    if (newList.length > 0) {
    return (
          <div>
            {localStorage.getItem("canShiftGlobalStartTime") === null && localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
            <div>
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '275px'}}>
                <TimePicker style={{align: 'center'}}
                  defaultValue={this.state.value}
                  onChange={this.handleValueChange}
                />
              </div>
              <button style={{color: 'white', background: 'red'}} onClick={() => { this.shiftAll(this.state.value) }}>New Event Start Time</button> 
              <div className="timelineAdmin">      
                <ul>
                  {newList} 
                </ul>
              </div>
            </div>
            :
            <div className="timeline">      
              <ul>
                {newList} 
              </ul>
            </div>
            }
          </div>
    );
  }
}

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleValueChange = (value) => {
    console.log(value && value.format('HH:mm:ss'));
    this.setState({ value });
  }

  clear = () => {
    this.setState({
      value: undefined,
    });
  }

  shiftAll = (newStart) => {
    let allElements = this.state.allEvents;
    let immediateNextEvent= moment(allElements[0].start, 'hh:mm A'); 
    let conferenceStart = newStart;
    console.log("the new conference start time is: ", conferenceStart.format('hh:mm A'))
    let duration = moment.duration(conferenceStart.diff(immediateNextEvent));
    // go through all events after the one that just ended
    localStorage.setItem("updateCount", 0)
    for (let i = 0; i < allElements.length; i++) {
      console.log("starting updated count is: ", this.state.updateCount)
      //add the calculated duration between the original end and the new end
      var start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
      var end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
      var shiftedStart = start.format('hh:mm A');
      // console.log(shiftedStart)
      var shiftedEnd = end.format('hh:mm A');
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i, allElements.length, 0)
    }
  }

  shiftEndTime = (index, endTime) => {
    // return early if this is the last event
    console.log(index)
    if (this.state.allEvents.length === index + 1) return;
    let eventNum = index;
    let newEnd = endTime;
    let nextEvent = index + 1;
    let allElements = this.state.allEvents;
    let immediateNextEvent= moment(allElements[nextEvent].start, 'hh:mm A'); 
    let justEnded = moment(newEnd, 'hh:mm A');
    console.log("the just ended is: ", justEnded.format('hh:mm A'))
    let duration = moment.duration(justEnded.diff(immediateNextEvent));
    this.updateFireTimes(allElements[index].start, allElements[index].start, justEnded.format('hh:mm A'));
    localStorage.setItem("canShiftGlobalStartTime", false);
    localStorage.setItem("updateCount", 0)
    // go through all events after the one that just ended
    for (let i = eventNum + 1; i < allElements.length; i++) {
      console.log("starting updated count is: ", this.state.updateCount)
      //add the calculated duration between the original end and the new end
      var start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
      var end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
      var shiftedStart = start.format('hh:mm A');
      // console.log(shiftedStart)
      var shiftedEnd = end.format('hh:mm A');
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i, allElements.length, index)
    }
  }

  updateFireTimes = (start, newStart, newEnd, index, allElementsLength, allElementsIndex) => {
    let that = this;
    let i = index;
    console.log("index is: ", i)
    const db = fire.firestore();
    var eventRef = db.collection("detailed itinerary").where("start", "==", start);
    eventRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let count = localStorage.getItem("updateCount");
            let convertCount = parseInt(count)
            localStorage.setItem("updateCount", convertCount+1)
            var timeRef = db.collection('detailed itinerary').doc(doc.id);
            timeRef.update({
              start: newStart,
              end: newEnd
            })
            .then(that.reloadPage(allElementsLength, allElementsIndex))
        });
    })
  }

  reloadPage = (length, index) => {
    if (parseInt(localStorage.getItem("updateCount")) === length-index) {
      localStorage.removeItem("updateCount")
      window.location.reload();
    }
  }

  watchForChanges = () => {
    let that = this;
    const db = fire.firestore();
    for (let i in this.state.allEvents) {
      db.collection('detailed itinerary')
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
          }
          if (change.type === 'modified') {
            console.log('An event snapshot was modified', change.doc.data());
            that.componentDidMount();
          }
          if (change.type === 'removed') {
          }
        });
      });
    }
  }

  componentDidMount = () => {
    const db = fire.firestore();
    var wholeData = []
    let that = this;
    db.collection('detailed itinerary').
    get().then(snapshot => {
        snapshot.forEach(doc => {
            let id = doc.id;
            db.collection('detailed itinerary').doc(id).onSnapshot(docSnapshot => {
              let id = docSnapshot.id;
              let dataCopy = docSnapshot.data()
              let trimmed = id.replace(/ +/g, "");
              dataCopy.id = trimmed;
              // need to trim it for the browser router
              dataCopy.reference = id;
              // still want to hold on to the id for further references to firestore
              wholeData.push(dataCopy);
              that.addEventsToState(snapshot, wholeData)
            })
            //removing blank spaces from talk names to use as router IDs

        });
    })
  }

  addEventsToState = (snapshot, wholeData) => {
    if (wholeData.length === snapshot.size) {
      wholeData.forEach(event => {
        let j_time = moment(event.start, "hh:mm A")
        let k_time = moment(event.end, "hh:mm A")
        event.start = j_time; 
        event.end = k_time; 
      })
      let sortedData = wholeData.sort(function (a, b) {return a.start - b.start});
      sortedData.forEach(event => {
        //reformating start and end times
        let j_time = moment(event.start, "hh:mm A").format('hh:mm A')
        let k_time = moment(event.end, "hh:mm A").format('hh:mm A')
        event.start = j_time; 
        event.end = k_time; 
      })
      // we've been here before, don't need to instantiate the snapshot listener
      if (this.state.watchingForChanges) {
        this.setState({allEvents: sortedData})
      }
      // first pass - let's call watchForChanges to start listening for changes to each document
      else {
        this.setState({allEvents: sortedData, watchingForChanges: true}, () => this.watchForChanges())
      }
    }
  }

}

export default Schedule;