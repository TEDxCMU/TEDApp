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

export class NewSchedule extends Component {
  constructor() {
    super();
    this.addCount = this.addCount.bind(this);
    this.state = {
      value: moment(),
      canShiftAll: true,
      allEvents: [],
      updateCount: 0
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

  render() {
    console.log(this.state.allEvents)
    let newList = [];
    console.log(this.state.allEvents) 

    this.state.allEvents.forEach(event => {
        //let name = event[0];
        console.log("event start is: ", event.start)
        let a = event.start;
        let b = event.end;
        let index = this.state.allEvents.indexOf(event);
        console.log(index)

        newList.push(
          <li>
          <Link key={event.id} to={{
            pathname: '/events/'+event.id,
            state: {  
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                description: event.description,
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
              <p>A card with more information to do stuff will go here.</p>
            </div>
          </Link>
          {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
              <button onClick={() => { this.shiftEndTime(allEvents.indexOf(event), moment().format('hh:mm A')) }}>Event Ended</button> 
            :
              <div></div>
          }
          </li>
        )

        // newList.push (
        //   <li key={index}>
        //     <span><strong>{a}</strong></span> — <span>{b}</span>
        //     {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
        //     <button onClick={() => { this.shiftEndTime(index, moment().format('hh:mm A')) }}>Event Ended</button> 
        //     :
        //     <div></div>
        //     }

        //   </li>
        // ) 
    })

    let allEvents = this.state.allEvents;
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
    console.log(eventRef);
    eventRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            let count = localStorage.getItem("updateCount");
            let convertCount = parseInt(count)
            localStorage.setItem("updateCount", convertCount+1)
            console.log("intermediate updated count: ", localStorage.getItem("updateCount"));
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
    console.log(length)
    console.log(index)
    console.log(length-index)
    console.log("update count is: ", localStorage.getItem("updateCount"))
    if (parseInt(localStorage.getItem("updateCount")) === length-index) {
      console.log("HELLO!")
      localStorage.removeItem("updateCount")
      window.location.reload();
    }
  }

  addCount = (count) => {
    console.log("ADDING SHIT NOW")
    this.setState({
      updateCount: count
    });
  }

  componentWillMount = () => {
    const db = fire.firestore();
    var wholeData = []
    db.collection('detailed itinerary').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            let dataCopy = doc.data()
            let id = doc.id;
            //removing blank spaces from talk names to use as router IDs
            let trimmed = id.replace(/ +/g, "");
            dataCopy.id = trimmed;
            wholeData.push(dataCopy);
        }
    );
      wholeData.forEach(event => {
        //reformating start and end times
        let j_time = moment(event.start, "hh:mm A").format("hh:mm A");
        let k_time = moment(event.end, "hh:mm A").format("hh:mm A");
        event.start = j_time; 
        event.end = k_time; 
      })

      //sorting times based on when they end
      for(var i = 0; i < wholeData.length; i++) {
        let min = wholeData[i].end;
        let min_idx = i;
        for(var j = i+1; j < wholeData.length; j++) {
          let next = wholeData[j].end;
          if(moment(next).isBefore(min)) {
            min = wholeData[j].end;
            min_idx = j;
          }             
        }
        let temp = wholeData[min_idx];
        wholeData[min_idx] = wholeData[i];
        wholeData[i] = temp;       
      }
      //reformating again
      wholeData.forEach(event => {
        let f_time = moment(event.start, "hh:mm A").format("hh:mm A");
        let g_time = moment(event.end, "hh:mm A").format("hh:mm A");
        event.start = f_time;
        event.end = g_time; 
      })

      this.setState({allEvents: wholeData})

    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

}

export default NewSchedule;