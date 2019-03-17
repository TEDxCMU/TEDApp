import React, { Component } from 'react';
import '../../App.css';
import './schedule.css';
import {Link} from 'react-router-dom';
import moment from 'moment';
import fire from '../../fire.js';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import Header from '../header/header';
import arrow from '../../mini-arrow.svg';
import placeholder from '../../placeholder.svg'
import { BounceLoader } from 'react-spinners';
import Popup from "reactjs-popup";
import posed from 'react-pose';


const Item = posed.li({
  enter: { y: 0, x: 0, opacity: 1, 
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 15 },
      y: { type: 'spring', stiffness: 300, damping: 15 },
      default: { duration: 300 }
    } 
  },
  exit: { y: 20, opacity: 0, transition: { duration: 150 } }
});

const Sidebar = posed.ul({
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

export class Schedule extends Component {
  constructor() {
    super();
    this.myRef = React.createRef()   // Create a ref object 
    this.state = {
      value: moment(),
      canShiftAll: true,
      allEvents: [],
      updateCount: 0,
      watchingForChanges: false,
      announcement: "The conference is currently not in progress. Please check back at another time.",
      isOpen: false,
      scroll: 0,
      headerLink: true,
      headerTitle: "Live Schedule",
      nowDist: 0
    }
  }

  deleteEvent = (index, e) => {
    const newList = Object.assign([],this.newList);
    newList.splice(index, 1);
    this.setState({newList:newList});
  }

  EventComponent = ({ match }) => {
    const event = this.state.allEvents.find(({ id }) => id === match.params.eventId)
    return (
      <div>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
      </div>
    )
  }

  render = () => {
    console.log("rendering")
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
    let notification = this.state.announcement;
    this.state.allEvents.forEach(event => {
        //mark event as either being in the past, happening right now, or being in the future if it is just static
        let className = "bullet-static";
        if (this.state.altAnnouncement) {
          notification = this.state.announcement;
        }
        else if (moment().isBetween(moment(event.start, "hh:mm A"), moment(event.end, "hh:mm A"))) {
          className = "now";
          notification = event.announcement;
        }
        if (moment().isAfter(moment(event.end, "hh:mm A"))) {
          className = "past";
        }
        if (event.type !== "static") {
          newList.push(
            <Item key={event.id} id={className === "now" ? "eventNow" : null}>
              {localStorage.getItem("userEmail") === "dijour@cmu.edu" ? 
              <div>
                <span className="event"></span>
                <span className={className}></span>
                <span className="bullet-bg"></span>
                  <div className="info-talk">
                    <small className="card-arrow">MORE</small>
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
                {/* THIS IS WHAT PEOPLE SEE FOR SPEAKERS:  */}
                  <span className="event"></span>
                  <span className={className}></span>
                  <span className="bullet-bg"></span>
                    <div className="info-talk">
                      <div>
                        <p className="time"><strong>{event.start}</strong> — {event.end}</p>
                        <h4 className="event-title">{event.blurb}</h4>
                        <img src={event.image !== undefined ? event.image : placeholder} className="speakerPicture" alt="speaker picture" />
                        <p className="event-description">{event.title}</p>
                      </div>
                      <img src={arrow} className="info-arrow" alt="information arrow" />
                    </div>
                </Link>
              </div>
              }
          </Item>
        )
      }
      else {
      // Change bullet color here, time, and the info in a timeline event
      newList.push(
        <Item key={event.id} id={className === "now" ? "eventNow" : null}>
            <span className="event-static"></span>
            <span className={className}></span>
            <span className="bullet-bg"></span>
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
        </Item>
      )}
    })
    let allEvents = this.state.allEvents;
    let index = this.state.eventNum;
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
                          <button className="popup-btn-success button-primary" onClick={
                            e => this.confirmShiftOne(e, index)
                              // , () => this.shiftEndTime(e, index, moment().format('hh:mm A')))
                            }>Confirm</button>
                      </div>                      
                    </div>
                    }
                </div>
            </div>
            </Popup>
            <div>
              <Header
              link={this.state.headerLink}
              title={this.state.headerTitle}
              description={notification}
              altAnnouncement={this.state.altAnnouncement}
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
                <Sidebar id="itinerary" pose={this.state.isOpen ? 'enter' : 'exit'}>
                  {newList} 
                </Sidebar>
              </div>
            </div>
            :
            <div className="timeline">      
                <Sidebar id="itinerary" pose={this.state.isOpen ? 'enter' : 'exit'}>
                  {newList} 
                </Sidebar>
            </div>
            }
          </div>
    );
    }
  }

  updateListSelection = () => {
    //prevent the page from forcing a scroll after user moves around
    if (this.state.alreadyScrolled === null) {
      return
    }
    else if (document.getElementById("eventNow") === null ) {
      return
    }
    else {
      let targetLi = document.getElementById("eventNow"); // id tag of the current <li> element
      window.scrollTo(0, (targetLi.offsetTop - 50));
      this.setState({
        alreadyScrolled: true
      })
    }

  }

  // toggles the animations to begin loading all UL and LI elements for the itinerary
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
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
    this.setState(
      { open: true,
        eventNum: index
    })
  }

  openGlobalChangeModal = (e) => {
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
    this.setState({ value });
  }

  confirmShiftAll = (e) => {
    e.preventDefault();
    this.setState({
      shiftingGlobal: null,
      open: false
    }, () => this.shiftAll(this.state.value))
  }

  confirmShiftOne = (e, index) => {
    e.preventDefault();
    this.setState({
      shiftingGlobal: null,
      open: false
    }, () => this.shiftEndTime(index, moment().format('hh:mm A')))
  }

  shiftAll = (newStart) => {
    let allElements = this.state.allEvents;
    let immediateNextEvent= moment(allElements[0].start, 'hh:mm A'); 
    let conferenceStart = newStart;
    let duration = moment.duration(conferenceStart.diff(immediateNextEvent));
    // go through all events after the one that just ended
    localStorage.setItem("updateCount", 0)
    for (let i = 0; i < allElements.length; i++) {
      //add the calculated duration between the original end and the new end
      let start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
      let end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
      let shiftedStart = start.format('hh:mm A');
      let shiftedEnd = end.format('hh:mm A');
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i, allElements.length, 0)
    }
  }

  shiftEndTime = (index, endTime) => {
    if (this.state.allEvents.length === index + 1) return;
    let eventNum = index;
    let newEnd = endTime;
    let nextEvent = index + 1;
    let allElements = this.state.allEvents;
    let immediateNextEvent= moment(allElements[nextEvent].start, 'hh:mm A'); 
    let justEnded = moment(newEnd, 'hh:mm A');
    let duration = moment.duration(justEnded.diff(immediateNextEvent));
    this.updateFireTimes(allElements[index].start, allElements[index].start, justEnded.format('hh:mm A'));
    localStorage.setItem("canShiftGlobalStartTime", false);
    localStorage.setItem("updateCount", 0)
    // go through all events after the one that just ended
    for (let i = eventNum + 1; i < allElements.length; i++) {
      //add the calculated duration between the original end and the new end
      let start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
      let end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
      let shiftedStart = start.format('hh:mm A');
      let shiftedEnd = end.format('hh:mm A');
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i, allElements.length, index)
    }
  }

  updateFireTimes = (start, newStart, newEnd, index, allElementsLength, allElementsIndex) => {
    const db = fire.firestore();
    var eventRef = db.collection('detailed itinerary').where("start", "==", start);
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
    this.props.isLoaded();
    this.toggle();
    this.updateListSelection();
    let that = this;
    const db = fire.firestore();
    db.collection('detailed itinerary')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
        }
        if (change.type === 'modified') {
          that.componentDidMount();
        }
        if (change.type === 'removed') {
        }
      });
    });    
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    // Adjust header based on scroll height
    if (window.scrollY < 50 && this.state.headerLink === false) {
      this.setState({
          headerLink: true,
          headerTitle: "Live Schedule"
      });
    } else if (window.scrollY >= 50 && this.state.headerLink === true) {
      this.setState({
        headerLink: false,
        headerTitle: undefined
      });
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
    const db = fire.firestore();
    var wholeData = []
    let that = this;
    db.collection('announcements').doc('announcement').onSnapshot((docSnapshot) => {
      if (docSnapshot.exists) {
        this.setState({
          announcement: docSnapshot.data().text,
          altAnnouncement: true
        })
      }
      else {
        this.setState({
          announcement: "The conference is currently not in progress. Please check back at another time.",
          altAnnouncement: false
        })
      }
    });
    db.collection('detailed itinerary').get().then(snapshot => {
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
    });
  }

  //re-orders every event into chronological order
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
        this.setState({
          allEvents: sortedData,
          isOpen: true
        })
      }
      // first pass - let's call watch for changes
      else {
        this.setState({allEvents: sortedData, watchingForChanges: true}, () => this.watchForChanges())
      }
    }
  }

}

export default Schedule;