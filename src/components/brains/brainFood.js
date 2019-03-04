import React, { Component } from 'react';
import '../../App.css';
import './brainFood.css';
import RippleMap from './subComponents/rippleMap.js';
import QANDA from './subComponents/qAndA.js';
import fire from '../../fire.js';
import Autocomplete from 'react-google-autocomplete';

export class BrainFood extends Component {
  constructor() {
    super();
    this.state = {
        page: 0,
        name: '',
        email: '',
        city: '',
        fingerprint: localStorage.getItem('fingerprint'),
        inDatabase: false
    }
  }



  render () {
    console.log(this.state.page)
    return (
        <div>
            <div className="pageSelect">
                <button id="left" className={this.state.page === 0 ? "selected" : "unselected"} onClick={e => this.switchPage(e, 0)}>Interact</button>
                <button id="right" className={this.state.page === 1 ? "selected" : "unselected"} onClick={e => this.switchPage(e, 1)}>Q & A</button>
            </div>
            {this.state.page === 0 ? 
            <div className="mapPage">
                <h1>Where is everyone from?</h1>
                {this.state.inDatabase ?
                <div></div>
                :
                <div>
                    <Autocomplete
                        style={{width: '90%'}}
                        onPlaceSelected={(place) => {
                        this.setState({city: place});
                        }}
                    />
                    <button>Submit</button>
                </div>
                }
                
                <RippleMap/>
            </div>
            :
            <QANDA
            handleScroll={this.props.handleScroll}
            />
            }
        </div>

    )
  }

  switchPage = (e, num) => {
    console.log("switching!")
    this.setState({
        page: num
    })
  }

  componentDidMount = () => {
    console.log("hello! we logged BrainFood");
    this.props.isLoaded();
    let db = fire.firestore();
    // db.collection(maps)
  }

}
  
export default BrainFood;