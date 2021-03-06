import React, { Component } from 'react';
import styles from './schedule.module.scss';
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
import { networkOnly } from 'sw-toolbox';
import classNames from 'classnames';

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
      // boolean that triggers firebase listeners after component mounts
      watchingForChanges: false,
      // default announcement that appears before conference is in session
      announcement: "The conference is currently not in progress. Please check back at another time.",
      // default announcement that appears after conference is over
      eventEndedAnnouncement: 'The conference is now over, thanks for coming! Please leave your feedback at <a class="link-white" href="http://bit.ly/tedxsurvey">bit.ly/tedxsurvey</a>',
      isOpen: false,
      scroll: 0,
      // boolean - if Header should be normal height (true) or collapsed (false)
      headerLink: true,
      headerTitle: "Live Schedule",
      nowDist: 0
    }
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
    let eventDate = moment(this.props.eventDate).format('L')
    if (this.state.allEvents.length === 0) {
      return (
        <div className={styles['loader']}>
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
        let className = styles['bullet__upcoming'];
        if (this.state.altAnnouncement) {
          notification = this.state.announcement;
        }
        else if (moment().isBetween(moment(event.start, "hh:mm A"), moment(event.end, "hh:mm A"))) {
          className = styles['bullet__now'];
          notification = event.announcement;
        }
        // when the app is LIVE, uncomment the 2nd line to ensure  
        else if (eventDate < moment().format('L') && (moment() > moment(this.state.allEvents[0].end, "hh:mm A"))) {
          notification = this.state.eventEndedAnnouncement;
        }
        if (moment().isAfter(moment(event.end, "hh:mm A"))) {
          className = styles['bullet__past'];
        }

        const infoTalkStyle = classNames(styles['event-card'], styles['event-card--clickable']);
        if (event.type !== "static") {
          newList.push(
            <Item className={styles['event']} key={event.id} id={className === styles['bullet__now'] ? styles['eventNow'] : null}>
              {this.props.isAdmin ? 
              <div>
                <span className={className}></span>
                <span className={styles['bullet__bg']}></span>
                <div className={infoTalkStyle}>
                  <div>
                      <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                      <h4 className={styles['event__title']}>{event.title}</h4>
                      <p className={styles['event__desc']}>{event.blurb}</p>
                      <br />
                      { this.props.isAdmin && 
                      (<div>
                        <button className="btn btn--primary" onClick={() => { this.openDelayModal(allEvents.indexOf(event)) }}>End</button>
                      </div>)
                      }
                  </div>
                  <img src={arrow} className={styles['event-card__arrow']} alt="information arrow" />
                </div>
              </div>
              :
              <div>
                <Link key={event.id} to={{
                  pathname: "talks/"+event.id,
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
                      db: this.props.db,
                      isAdmin: this.props.isAdmin
                  }
                }}>
                {/* THIS IS WHAT PEOPLE SEE FOR SPEAKERS:  */}
                  <span className={className}></span>
                  <span className={styles['bullet__bg']}></span>
                    <div className={classNames(styles['event-card'], styles['event-card--clickable'])}>
                      <div className={styles['event-card__content']}>
                        <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                        <h4 className={styles['event__title']}>{event.blurb}</h4>
                        <img src={event.image !== undefined || networkOnly ? event.image : placeholder} className={styles['event-card__img']} alt="speaker" />
                        <p className={styles['event__desc']}>{event.title}</p>
                      </div>
                      <img src={arrow} className={styles['event-card__arrow']} alt="information arrow" />
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
          <Item className={styles['event']} key={event.id} id={className === styles['bullet__now'] ? styles['eventNow'] : null}>
              <span className={className}></span>
              <span className={styles['bullet__bg']}></span>
              <div className={classNames(styles['event-card'], styles['event-card--static'])}>
                <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                <h5 className={styles['event__title']}>{event.title}</h5>
                <small>{event.blurb}</small>
                {this.props.isAdmin && 
                  (<div>
                    <button className="btn btn--primary"
                    onClick={() => { this.openDelayModal(allEvents.indexOf(event)) }}>End</button>
                  </div>)
                }
              </div>
          </Item>
        )
      }
    })
    let allEvents = this.state.allEvents;
    let index = this.state.eventNum;
    if (newList.length > 0) {
    return (
        <div className={styles['schedule-container']}>
          {this.globalTimeChangePopup(style)}
          {this.singleEventTimeChangePopup(style, index, allEvents)}
          <div>
            <Header
            link={this.state.headerLink}
            title={this.state.headerTitle}
            description={notification}
            db={this.props.db}
            isAdmin={this.props.isAdmin}
            headerStyle="fixed" />
          </div>
          { localStorage.getItem("canShiftGlobalStartTime") === null && this.props.isAdmin  ? 
            <div>
              <div className={styles['timeline__timepicker']}>
                <TimePicker
                  defaultValue={this.state.value}
                  onChange={this.handleValueChange} />
                <button className="btn btn--primary" onClick={e => this.openGlobalChangeModal(e)}>New Conference Start Time</button>
              </div> 
              <div className={classNames(styles['timeline-container'], styles['timeline-container--admin'])}> {/* admin timeline */}   
                {this.sideBar(newList)}
              </div>
            </div>
          :
            <div className={styles['timeline-container']}> {/* user timeline */}
              {this.sideBar(newList)}
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

  // opens popup for shifting entire conference
  openGlobalChangeModal = (e) => {
    e.preventDefault();
    this.setState({
      endAllOpen: true,
      shiftingGlobal: true
    })
  }

  closeGlobalChangeModal = () => {
    this.setState({ 
      endAllOpen: false,
      shiftingGlobal: false,
      eventNum: undefined
     })
  }

  //opens popup for shifting one event
  openDelayModal = (index) => {
    this.setState({ 
      endEventLaterOpen: true,
      eventNum: index
    })
  }

  closeDelayModal = () => {
    this.setState({ 
      endEventLaterOpen: false,
      eventNum: undefined
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
      endAllOpen: false
    }, () => this.shiftAll(this.state.value))
  }

  confirmShiftOne = (e, index) => {
    e.preventDefault();
    this.setState({
      shiftingGlobal: null,
      endAllOpen: false
    }, () => this.shiftEndTime(index, moment().format('hh:mm A')))
  }

  confirmShiftOneWithDelay = (e, index, time) => {
    e.preventDefault();
    this.setState({
      shiftingGlobal: null,
      endEventLaterOpen: false
    }, () => this.shiftEndTime(index, time))
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
    // first delete any alternate announcements from the database
    let db = fire.firestore();
    db.collection(this.props.db).doc('announcement').delete().then()
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
  
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
      this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd)
    }
  }

  updateFireTimes = (start, newStart, newEnd) => {
    let that = this;
    const db = fire.firestore();
    var eventRef = db.collection(this.props.db).doc('itinerary').collection('itinerary').where("start", "==", start);
    eventRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          let count = localStorage.getItem("updateCount");
          let convertCount = parseInt(count)
          localStorage.setItem("updateCount", convertCount+1)
          var timeRef = db.collection(that.props.db).doc('itinerary').collection('itinerary').doc(doc.id);
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
    db.collection(this.props.db).doc('itinerary').collection('itinerary')
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
    db.collection(this.props.db).doc('itinerary').collection('itinerary').get().then(snapshot => {
        snapshot.forEach(doc => {
            let id = doc.id;
            db.collection(this.props.db).doc('itinerary').collection('itinerary').doc(id).onSnapshot(docSnapshot => {
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


  globalTimeChangePopup= (style) => {
    return (
      <Popup open={this.state.endAllOpen} closeOnDocumentClick onClose={this.closeGlobalChangeModal} contentStyle={style}>
        <div className={styles['popup']}>
          {this.state.shiftingGlobal !== null && this.state.shiftingGlobal === true ?
            <div>
              <h4>Are you sure you want to change the conference start time to {this.state.value.format('hh:mm A')}?</h4>
              <div className={styles['popup__btn-group']}>
                <button className="btn btn-full btn--cancel" onClick={this.closeGlobalChangeModal}>Cancel</button>
                <button className="btn btn-full btn--primary" onClick={e => this.confirmShiftAll(e)}>Confirm</button>
              </div>
            </div>
            :
            null}
        </div>
      </Popup>
    )
  }

  singleEventTimeChangePopup = (style, index, allEvents) => {
    return (
      <Popup
        open={this.state.endEventLaterOpen}
        closeOnDocumentClick
        onClose={this.closeDelayModal}
        contentStyle={style}
        >
        <div className={styles['popup']}>
          <div> New End Time:
            <TimePicker
              defaultValue={this.state.value}
              onChange={this.handleValueChange}
            />
            <h4>Are you sure you want to change the end time of "{index === undefined ? "Event Name" : allEvents[index].title}" to {this.state.value === null ? moment().format('hh:mm A') : moment(this.state.value).format('hh:mm A')}?</h4>
            <div className={styles['popup__btn-group']}>
                <button className="btn btn-full btn--cancel" onClick={this.closeDelayModal}>Cancel</button>
                <button className="btn btn-full btn--primary" onClick={e => this.confirmShiftOneWithDelay(e, index, this.state.value)}>Confirm</button>
            </div>                      
          </div>
        </div>
      </Popup>
    )

  }


  sideBar = (newList) => {
    return (
      <Sidebar id="itinerary" className={styles['timeline']} pose={this.state.isOpen ? 'enter' : 'exit'}>
        {newList}
      </Sidebar>
    )
  }
}

export default Schedule;