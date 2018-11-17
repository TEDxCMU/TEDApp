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

        newList.push (
          <li ><span><strong>{event[0]}</strong></span> — <span>{event[1]}</span></li>
        ) 

        //console.log(newList.length)
    })
  
    //function handleClick() {
    //  if(this.state !== undefined && this.state.allEvents !== undefined && this.state.allEvents.length != 0) { 
    //    this.state.allEvents.shift(); 
    //    console.log(this.state.allEvents);
    //    this.setState(this.state.allEvents);
    //  }
    //}
    
    //<ul>{newList}</ul>
    //<button onClick={handleClick}>main</button>
    //<button class="Hello" onClick={handleClick}>test</button>
    //{console.log(newList === undefined)}

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

  componentDidMount() {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('itinerarytest').get()
    .then(snapshot => {
      //console.log("the snapshot is: ", snapshot)
        snapshot.forEach(doc => {
            //console.log("the document is: ", doc.data())
            const entries = Object.entries(doc.data())
            //console.log(entries)
            //console.log(typeof entries === "array")
            wholeData = (entries)
        }
    );
      
      this.setState({allEvents: wholeData})

      this.state.allEvents.forEach(event => {
        let j_time = moment(event[1],"h:mm a");
        //console.log(typeof j_time);
        event[1] = j_time; 
      })

      for(var i = 0; i < this.state.allEvents.length; i++) {
        let min = this.state.allEvents[i][1];
        let min_idx = i;
        for(var j = i+1; j < this.state.allEvents.length; j++) {
          let next = this.state.allEvents[j][1];
          //console.log(j);
          //console.log(moment(next).isBefore(min));
          if(moment(next).isBefore(min)) {
            min = this.state.allEvents[j][1];
            min_idx = j;
          }             
        }
        //console.log(min_idx);
        let temp = this.state.allEvents[min_idx];
        this.state.allEvents[min_idx] = this.state.allEvents[i];
        this.state.allEvents[i] = temp;       
      }

      this.state.allEvents.forEach(event => {
        let f_time = event[1].format("h:mm a");
        event[1] = f_time; 
        //console.log(typeof event[1]);
      })

    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

}

export default Schedule;