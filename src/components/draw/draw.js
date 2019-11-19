import React, {useState, useEffect, useRef} from 'react';
import '../../App.css';
import styles from './draw.scss';
import {List, Map} from 'immutable';
import fire from '../../fire';
import moment from 'moment';
import ReactGA from 'react-ga';

// preliminary code thanks to: https://codepen.io/philipp-spiess/pen/WpQpGr
class Draw extends React.Component {
    constructor() {
      super();
  
      this.state = {
        lines: new List(),
        undoList: new List(),
        isDrawing: false
      };
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
  
    handleMouseDown(mouseEvent) {
      if (mouseEvent.button !== 0) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
  
      this.setState(prevState => ({
        lines: prevState.lines.push(new List([point])),
        isDrawing: true
      }));
    }
  
    handleMouseMove(mouseEvent) {
      if (!this.state.isDrawing) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      
      this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size-1], line => line.push(point))
      }), () => this.state.lines && console.log(this.state.lines.get(0).get(0).get('x')));
    }
  
    handleMouseUp() {
      this.setState({ isDrawing: false });
    }
  
    relativeCoordinatesForEvent(mouseEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
      });
    }

    undo = () => {
        if (this.state.lines.size === 0) {
            return
        }
        this.setState(prevState => ({
            undoList: this.state.undoList.push(this.state.lines.last()),
            lines: this.state.lines.slice(0, this.state.lines.size-2)
          }), () => console.log(this.state.lines, this.state.undoList));
    }

    redo = () => {
        if (this.state.undoList.size === 0) {
            return
        }
        this.setState(prevState => ({
            lines: this.state.lines.push(this.state.undoList.pop()),
            undoList: this.state.undoList.slice(0, this.state.size-2)
          }), () => console.log(this.state.lines, this.state.undoList));
    }

    clear = () => {
        if (this.state.lines.size === 0) {
            return
        }
        this.setState(prevState => ({
            undoList: this.state.lines,
            lines: new List()
          }), () => console.log(this.state.lines, this.state.undoList));
    }

    submit = () => {
        if (this.state.lines.size === 0) {
            return
        }
        const lines = this.state.lines;
        var name = this.state.name;
        if (name === "")  {
            name = "anonymous"
        }
        let now = moment().format('MMMM Do YYYY, h:mm:ss a');
        let db = fire.firestore();
        let that = this;
        if (localStorage.getItem('fingerprint') === null) {
            db.collection(this.props.db)
            .doc('speakers')
            .collection('speakers')
            .doc(this.state.speakers[this.state.selectedSpeaker].email)
            .collection("questions").add({
                question: this.state.question,
                name: name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                that.setState({
                    lines: new List(),
                    undoList: new List(),
                    isDrawing: false
                }, () =>                 
                ReactGA.event({
                    category: 'User',
                    action: 'Upload drawing without Fingerprint on Draw Page'
                }, () => this.componentDidMount()))
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            db.collection(this.props.db)
            .doc('speakers')
            .collection('speakers')
            .doc(this.state.speakers[this.state.selectedSpeaker].email)
            .collection("questions")
            .doc(localStorage.getItem('fingerprint')).set({
                question: this.state.question,
                name: name,
                answer: "",
                timeAsked: now
            })
            .then(function() {
                that.setState({
                    name: '',
                }, () =>                 
                ReactGA.event({
                    category: 'User',
                    action: 'Upload drawing without Fingerprint on Draw Page'
                }, () => this.componentDidMount()))
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    }

    render() {
        return (
            <div>
                <div
                    className="drawArea"
                    ref="drawArea"
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                >
                    <Drawing lines={this.state.lines} />
                    <button className={styles.button} onClick={e => this.undo(e)}>Undo</button>
                    <button className={styles.button} onClick={e => this.redo(e)}>Redo</button>
                    <button className={styles.button} onClick={e => this.clear(e)}>Clear</button>
                </div>
                <button>Submit</button>
            </div>
        );
    }
  }
  
  function Drawing({ lines }) {
    return (
      <svg className="drawing">
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  }
  
  function DrawingLine({ line }) {
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
  
    return <path className="path" d={pathData} />;
  }
    
export default Draw;