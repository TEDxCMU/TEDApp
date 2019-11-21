import React, {useState, useEffect, useRef} from 'react';
import '../../App.css';
import styles from './draw.module.scss';
import {List, Map} from 'immutable';
import fire from '../../fire';
import moment from 'moment';
import ReactGA from 'react-ga';
import { HuePicker } from 'react-color'

// preliminary code thanks to: https://codepen.io/philipp-spiess/pen/WpQpGr
class Draw extends React.Component {
    constructor() {
      super();
  
      this.state = {
        lines: new List(),
        undoList: new List(),
        isDrawing: false,
        targetBoard: null,
        draw_color: '#000000',
        top_left_color: null,
        top_right_color: null,
        bottom_right_color: null,
        bottom_left_color: null,
        targetBoardMap: {
          '0': this.updateTopLeft,
          '1': this.updateTopRight,
          '2': this.updateBottomRight,
          '3': this.updateBottomLeft
        } 
      };
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
      // document.removeEventListener("touchend", this.handleMouseUp);
    }
  
    handleMouseDown = (mouseEvent) => {
      console.log('mouse down')
      if (mouseEvent.button !== 0) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
  
      this.setState(prevState => ({
        lines: prevState.lines.push(new List([point])),
        isDrawing: true
      }));
    }
  
    handleMouseMove = (mouseEvent) => {
      console.log('mouse moved')

      if (!this.state.isDrawing) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      
      this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size-1], line => line.push(point))
      }), () => this.state.lines && console.log(this.state.lines.get(0).get(0).get('x')));
    }
  
    handleMouseUp = () => {
      console.log("mouse up")
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
        let allLines = this.state.lines;
        // convert to object with nested arrays so firebase can store it properly
        allLines = allLines.toJS()

        let lineContainers = []
        for (let line in allLines) {
          let container = {
            lines: allLines[line]
          }
          lineContainers.push(container)
          // container.color = allLines[line][0][2] //get color of first SVG path
          // container.
        }
        // lines = lines.toJS().flat()
        let that = this;

        const target = this.state.targetBoard

        let db = fire.firestore();

        console.log(lineContainers)

        target(db, lineContainers, that)
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
          //combine coordinate data from all 4 boards into 1
          console.log(doc.data().top_left)
          let topDisplay = doc.data().top_left;
          let bottomDisplay = doc.data().bottom_left;
          Array.prototype.push.apply(topDisplay, doc.data().top_right)
          Array.prototype.push.apply(bottomDisplay, doc.data().bottom_right)
          Array.prototype.push.apply(topDisplay, bottomDisplay)

          console.log(topDisplay)
          //update local state with DB counterparts
          that.setState({
            total_board: topDisplay,
            bottom_left_time: moment(doc.data().bottom_left_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().bottom_left_time) : moment(),
            bottom_right_time: moment(doc.data().bottom_right_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().bottom_right_time) : moment(),
            top_left_time: moment(doc.data().top_left_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().top_left_time) : moment(),
            top_right_time: moment(doc.data().top_right_time).format('MMMM DD YYYY, h:mm:ss a')._isValid ? moment(doc.data().top_right_time) : moment()
          }, () => that.setLatestBoard());
      });
    }

    setLatestBoard = () => {
      let times = [this.state.top_left_time, this.state.top_right_time, this.state.bottom_right_time, this.state.bottom_left_time]
      let minDate = moment.min(times)
      let minDateIndex = times.indexOf(minDate).toString()

      console.log('the next board to update is: ', minDateIndex)
      console.log('the total board is: ', this.state.total_board)

      this.setState({
        targetBoard: this.state.targetBoardMap[minDateIndex]
      })
    }

    handleColorPick = (color) => {
      this.setState({ draw_color: color.hex });
    };

    componentDidMount = () => {
      this.loadBoardTimes();
      document.addEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        return (
            <div>
                <div
                    className={styles.drawArea}
                    ref="drawArea"
                    onMouseDown={this.handleMouseDown}
                    // onTouchStart={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    // onTouchMove={this.handleMouseMove}
                >
                    <Drawing lines={this.state.lines} color={this.state.draw_color}>
                      <button className={styles.button} onClick={e => this.undo(e)}>Undo</button>
                      <button className={styles.button} onClick={e => this.redo(e)}>Redo</button>
                      <button className={styles.button} onClick={e => this.clear(e)}>Clear</button>
                    </Drawing>
                </div>
                <button onClick={e => this.submit(e)}>Submit</button>
                <HuePicker color={this.state.draw_color} onChange={this.handleColorPick}/>
                <div className={styles.drawArea} ref="drawSum">
                  <TotalDrawing lines={this.state.total_board}/>
                </div>
            </div>
        );
    }
  }
  
  function Drawing({ lines, color } ) {
    return (
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} color={color}/>
        ))}
      </svg>
    );
  }

  function TotalDrawing({ lines }) {
    if (!lines) {
      return <div>Nothing to see here folks!</div>
    }

    console.log(lines)
    return (
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <StoredDrawingLine key={index} line={line}/>
        ))}
      </svg>
    );


    let pathData = 'M ';
    for (let i in lines) {
      if (i !== lines.length -1 && lines[i]['x'] && lines[i]['y']) {
        pathData += `${lines[i]['x']} ${lines[i]['y']} L `;
      }
      else if (i === lines.length - 1) {
        pathData += `${lines[i]['x']} ${lines[i]['y']}`;
        break;
      }
    }
    return (
      <svg className={styles.drawing}>
        <path className={styles.path} d={pathData}/>;
      </svg>
    )
  }
  
  function DrawingLine({ line, color}) {
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");

    return <path className={styles.path} d={pathData} style={{'stroke': `${color}`}}/>;
  }

  function StoredDrawingLine({ line, color}) {
    if (!line.lines) {
      return <path/>
    }
    const pathData = "M " +
      line.lines
        .map(p => {
          console.log(p)
          return `${p['x']} ${p['y']}`;
        })
        .join(" L ");

    return <path className={styles.path} d={pathData} style={{'stroke': `${color}`}}/>;
  }
    
export default Draw;