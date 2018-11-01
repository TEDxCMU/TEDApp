import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import fire from '../fire.js';

export class Schedule extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: []
    }
    //pass THIS to global navigation hamburger menu so people can login and logout everywhere
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

  }
  render() {

    var listOfData = this.state.allData.map((val, i)=>{
      var name = val.name
      var age = val.age
      return (
        <li key={i}>{name} ({age})</li>
      ) 
    })

    return (
      <div>
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
    db.collection('member').orderBy('name', 'asc').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        // console.log(doc.data().name + doc.data().age);
        console.log(doc.data());
        wholeData.push(doc.data())
      });
      console.log(wholeData)
      this.setState({allData: wholeData})
      console.log(this.state.allData)
    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

}

export default Schedule;