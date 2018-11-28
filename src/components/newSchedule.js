import React, { Component } from 'react';
import '../App.css';
import './schedule.css';
import { BrowserRouter as Router} from 'react-router-dom';
import moment from 'moment';
import Route from 'react-router-dom/Route';
import fire from '../fire.js';

export class NewSchedule extends Component {
  constructor() {
    super();
    this.addCount = this.addCount.bind(this);
    this.state = {
      allEvents: [],
      updateCount: 0
    }
  }

  deleteEvent = (index, e) => {
    const newList = Object.assign([],this.newList);
    newList.splice(index, 1);
    this.setState({newList:newList});
  }

  render() {
    console.log(this.state.allEvents)  
    let newList = [];

    // this.state.allEvents.forEach(event => {
    //    let j_time = moment(event[1],"h:mm a");
    //    let f_time = j_time.format("h:mm a");
    //    event[1] = f_time; 
    // })
    
    console.log(this.state.allEvents) 

    this.state.allEvents.forEach(event => {
        //let name = event[0];
        console.log("event start is: ", event.start)
        let a = event.start;
        let b = event.end;
        let index = this.state.allEvents.indexOf(event);
        console.log(index)

        newList.push (
          <li >
            <span><strong>{a}</strong></span> — <span>{b}</span>
            <button onClick={() => { this.shiftEndTime(index, moment().format('hh:mm A')) }}>Event Ended</button> 
          </li>
        ) 
    })

    return (
      <div className="schedule">      
        <ul>
          {newList} 
        </ul>
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
    let duration = moment.duration(justEnded.diff(immediateNextEvent));
    this.updateFireTimes(allElements[index].start, allElements[index].start, justEnded.format('hh:mm A'));
    // go through all events after the one that just ended
    for (let i = eventNum + 1; i < allElements.length; i++) {
      console.log("starting updated count is: ", this.state.updateCount)
      //add the calculated duration between the original end and the new end
      var start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
      var end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
      var shiftedStart = start.format('hh:mm A');
      // console.log(shiftedStart)
      var shiftedEnd = end.format('hh:mm A');
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i)
      console.log("intermediate updated count: ", this.state.updateCount);
    }

    console.log("the final update count is: ", this.state.updateCount)
    //reload the page if all elements have been updated
    if (this.state.updateCount === allElements.length-index-1){
      console.log("HELLO!")
      this.componentWillMount();
      window.location.reload();
    }

  }

  updateFireTimes = (start, newStart, newEnd, index) => {
    console.log("SHALOM")
    let newCount = this.state.updateCount + 1
    // console.log(newCount)
    let that = this;
    let i = index;
    console.log("index is: ", i)
    const db = fire.firestore();
    var eventRef = db.collection("detailed itinerary").where("start", "==", start);
    console.log(eventRef);
    eventRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            // console.log("the state is: ", this);
            // Build doc ref from doc.id
            var timeRef = db.collection('detailed itinerary').doc(doc.id);
            timeRef.update({
              start: newStart,
              end: newEnd
            }).then(console.log("hello", i))
            .catch(console.log("ERROR", i));
        });
    })
  }

  addCount = (count) => {
    console.log("ADDING SHIT NOW")
    this.setState({
      updateCount: count
    });
  }

  componentWillMount = () => {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('detailed itinerary').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            wholeData.push(doc.data())
        }
    );

      wholeData.forEach(event => {
        let j_time = moment(event.start, "HH:mm").format("hh:mm A");
        let k_time = moment(event.end, "HH:mm").format("hh:mm A");
        event.start = j_time; 
        event.end = k_time; 
      })

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

      wholeData.forEach(event => {
        let f_time = moment(event.start, "HH:mm").format("hh:mm A");
        let g_time = moment(event.end, "HH:mm").format("hh:mm A");
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