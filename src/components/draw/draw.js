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
        isDrawing: false,
        targetBoard: null,
        targetBoardMap: {
          '0': this.updateTopLeft,
          '1': this.updateTopRight,
          '2': this.updateBottomRight,
          '3': this.updateBottomLeft
        } 
      };
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("touchend", this.handleMouseUp);
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.removeEventListener("touchend", this.handleMouseUp);
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

    updateTopLeft = (db, lines, that) => {
      db.collection(this.props.db)
      .doc('draw').update({
        'top_left': lines
      }).then(
        db.collection(this.props.db).doc('draw').update({
          'top_left_time': moment().format('MMMM DD YYYY, h:mm:ss a')
        }).then(that.cleanUp())
      )
    }

    updateTopRight = (db, lines, that) => {
      db.collection(this.props.db)
      .doc('draw').update({
        'top_right': lines
      }).then(
        db.collection(this.props.db).doc('draw').update({
          'top_right_time': moment().format('MMMM DD YYYY, h:mm:ss a')
        }).then(that.cleanUp())
      )
    }

    updateBottomRight = (db, lines, that) => {
      db.collection(this.props.db)
      .doc('draw').update({
        'bottom_right': lines
      }).then(
        db.collection(this.props.db).doc('draw').update({
          'bottom_right_time': moment().format('MMMM DD YYYY, h:mm:ss a')
        }).then(that.cleanUp())
      )
    }

    updateBottomLeft = (db, lines, that) => {
      db.collection(this.props.db)
      .doc('draw').update({
        'bottom_left': lines
      }).then(
        db.collection(this.props.db).doc('draw').update({
          'bottom_left_time': moment().format('MMMM DD YYYY, h:mm:ss a')
        }).then(that.cleanUp())
      )
    }

    submit = () => {
        if (this.state.lines.size === 0 || this.state.targetBoard === null) {
            return
        }
        let lines = this.state.lines;
        lines = lines.toJS().flat()
        let that = this;
        console.log(lines)
        const target = this.state.targetBoard

        let db = fire.firestore();

        target(db, lines, that)
    }

    cleanUp = () => {
      this.setState({
          lines: new List(),
          undoList: new List(),
          isDrawing: false,
          targetBoard: null,
          submitted: true
      }, () =>                 
      ReactGA.event({
          category: 'User',
          action: 'Upload drawing without Fingerprint on Draw Page'
      }, () => this.componentDidMount()))
    }

    loadBoardTimes = () => {
      let db = fire.firestore();
      let that = this;
      db.collection(this.props.db)
      .doc('draw')
      .onSnapshot(function(doc) {
          that.setState({
          bottom_left_time: moment(doc.data().bottom_left_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().bottom_left_time) : moment(),
          bottom_right_time: moment(doc.data().bottom_right_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().bottom_right_time) : moment(),
          top_left_time: moment(doc.data().top_left_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().top_left_time) : moment(),
          top_right_time: moment(doc.data().top_right_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().top_right_time) : moment()
        }, () => that.setLatestBoard());
      });
    }

    setLatestBoard = () => {
      let times = [this.state.top_left_time, this.state.top_right_time, this.state.bottom_right_time, this.state.bottom_left_time]

      console.log(times)

      let minDate = moment.min(times)

      let minDateIndex = times.indexOf(minDate).toString()

      this.setState({
        targetBoard: this.state.targetBoardMap[minDateIndex]
      }, () => console.log(minDateIndex))
    }

    componentDidMount = () => {
      this.loadBoardTimes();
    }

    render() {
        return (
            <div>
                <div
                    className="drawArea"
                    ref="drawArea"
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onTouchMove={this.handleMouseMove}
                >
                    <Drawing lines={this.state.lines} />
                    <button className={styles.button} onClick={e => this.undo(e)}>Undo</button>
                    <button className={styles.button} onClick={e => this.redo(e)}>Redo</button>
                    <button className={styles.button} onClick={e => this.clear(e)}>Clear</button>
                </div>
                <button onClick={e => this.submit(e)}>Submit</button>
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