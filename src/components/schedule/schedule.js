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
import Header from '../header/header';
import { BounceLoader } from 'react-spinners';
import Popup from "reactjs-popup";


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
    console.log(this.props.scroll)
    console.log(this.state.allEvents)
    if (this.state.allEvents.length === 0) {
      return (
        <div>
          <BounceLoader
            sizeUnit={"px"}
            size={150}
            color={'#e62b1e'}
            loading={this.state.loading}
          />
        </div> 
      )
    }
    console.log(localStorage.getItem("canShiftGlobalStartTime"))

    const style = {
      display: 'flex',
      justifyText: 'center',
      flexDirection: 'column',
      alignItems: 'space-between',
      padding: '30px 40px',
      width: '70%',
      border: 'none',
      borderRadius: '10px'
    }
    let newList = [];
    let notification = "The conference is currently not in progress. Please check back at another time."
    this.state.allEvents.forEach(event => {
        //mark event as either being in the past, happening right now, or being in the future if it is just static
        let className = "bullet-static";
        if (moment().isBetween(moment(event.start, "hh:mm A"), moment(event.end, "hh:mm A"))) {
          className = "now";
          notification = event.announcement;
        }
        if (moment().isAfter(moment(event.end, "hh:mm A"))) {
          className = "past";
        }
        if (event.type !== "static") {
          newList.push(
            <li key={event.id}>
              {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
              <div>
                <span className="event"></span>
                <span className={className}></span>
                  <div className="info-talk">
                    <p className="time"><strong>{event.start}</strong> — {event.end}</p>
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-description">{event.blurb}</p>
                    {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
                      <button className="button-primary"
                      onClick={() => { this.openModal(allEvents.indexOf(event)) }}>Event Ended</button> 
                    :
                      <div></div>
                    }
                  </div>
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
                      related: event.related,
                      announcement: event.announcement,
                  }
                }}/>
              </div>
              :
              <div>
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
                      related: event.related,
                      announcement: event.announcement,
                  }
                }}>
                  <span className="event"></span>
                  <span className={className}></span>
                    <div className="info-talk">
                      <p className="time"><strong>{event.start}</strong> — {event.end}</p>
                      <h4 className="event-title">{event.title}</h4>
                      <p className="event-description">{event.blurb}</p>
                    </div>
                </Link>
              </div>
              }
          </li>
        )
      }
      else {
      
      newList.push(
        <li key={event.id}>
            {/* Change bullet color here, time, and the info in a timeline event */}
            <span className="event-static"></span>
            <span className="bullet-static"></span>
            <div className="info-static">
              <p className="time"><strong>{event.start}</strong> — {event.end}</p>
              <h5 className="event-title">{event.title}</h5>
              <small>{event.blurb}</small>
              {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
                <div>
                  <button className="button-primary" style={{marginTop: '10px'}} 
                  onClick={() => { this.openModal(allEvents.indexOf(event)) }}
                  >Event Ended</button> 
                </div>
              :
                <div></div>
              }
            </div>
      </li>
      )}
    })
    let allEvents = this.state.allEvents;
    let index = this.state.eventNum
    let now = console.log(index)
    if (newList.length > 0) {
    return (
          
          <div style={{height: '100%', width: '100%'}}>
            <Popup
            open={this.state.open}
            closeOnDocumentClick
            onClose={this.closeModal}
            contentStyle={style}
            >
            <div className="modal">
                <div>
                    { this.state.shiftingGlobal !== null && this.state.shiftingGlobal === true ? 
                    <div>
                      <h4>Are you sure you want to change the conference start time to {this.state.value.format('hh:mm A')}?</h4>
                      <div className="popup-btns">
                        <button className="popup-btn-cancel" onClick={this.closeModal}>Cancel</button>
                        <button className="popup-btn-success button-primary" onClick={e => this.confirmShiftAll(e)}>Confirm</button>
                      </div>
                    </div>
                    :
                    <div>
                      <h4>Are you sure you want to change the end time of "{index === undefined ? "Event Name" : allEvents[index].title}" to {moment().format('hh:mm A')}?</h4>
                      <div className="popup-btns">
                          <button className="popup-btn-cancel" onClick={this.closeModal}>Cancel</button>
                          <button className="popup-btn-success button-primary" onClick={e => this.shiftEndTime(e, index, moment().format('hh:mm A'))}>Confirm</button>
                      </div>                      
                    </div>
                    }

                </div>
            </div>
            </Popup>
            { this.props.scroll === undefined || this.props.scroll < 50 ?
            <div>
            {console.log("regular schedule")}
            <Header
            link={true}
            title="Live Schedule" 
            description={notification}
            headerStyle="fixed" />
            </div>
            :
            <div>
              {console.log("the new schedule is because:", this.props.scroll)}
              <Header
              link={false}
              description={notification}
              headerStyle="fixed" />              
            </div>
            }
            {localStorage.getItem("canShiftGlobalStartTime") === null && localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
            <div>
            <div className="new-event-time">
                <TimePicker
                  defaultValue={this.state.value}
                  onChange={this.handleValueChange}
                />
                <button className="button-primary" style={{marginTop: '10px'}} onClick={e => this.openGlobalChangeModal(e)}>New Event Start Time</button>
              </div> 
              <div className="timeline-admin">      
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

  closeConfirmation = () => {
    // this.setState({confirmationOpen: false}, () => this.props.askQuestion())
    this.props.askQuestion();
  }

  openConfirmation = (e) => {
    e.preventDefault()
    this.setState({confirmationOpen: true})
  }

  openModal = (index) => {
    this.setState({ open: true,
                    eventNum: index
      
    })
  }

  openGlobalChangeModal = (e) => {
    console.log("SHIFTING ALL EVENT TIMES MODAL IS OPEN NOW")
    e.preventDefault();
    this.setState({
      open: true,
      shiftingGlobal: true
    })
  }

  closeModal = () => {
    this.setState({ 
      open: false,
      shiftingGlobal: false
     })
  }

  closeModalandOpenConfirmation = () => {
    console.log("closing modal and opening confirmation")
    this.setState({
        confirmationOpen: true,
        open: false
    })
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

  confirmShiftAll = (e) => {
    e.preventDefault();
    this.setState({
      shiftingGlobal: null,
      open: false
    }, () => this.shiftAll(this.state.value))
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

  shiftEndTime = (e, index, endTime) => {
    // return early if this is the last event
    e.preventDefault();
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
    var eventRef = db.collection("mini").where("start", "==", start);
    eventRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let count = localStorage.getItem("updateCount");
            let convertCount = parseInt(count)
            localStorage.setItem("updateCount", convertCount+1)
            var timeRef = db.collection('mini').doc(doc.id);
            timeRef.update({
              start: newStart,
              end: newEnd
            })
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
    this.props.isLoaded()
    let that = this;
    const db = fire.firestore();
    db.collection('mini')
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

  componentDidMount = () => {
    const db = fire.firestore();
    var wholeData = []
    let that = this;
    db.collection('mini').
    get().then(snapshot => {
        snapshot.forEach(doc => {
            let id = doc.id;
            db.collection('mini').doc(id).onSnapshot(docSnapshot => {
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