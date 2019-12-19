import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import styles from "./draw.module.scss";
import { List, Map } from "immutable";
import fire from "../../fire";
import moment from "moment";
import ReactGA from "react-ga";
import { HuePicker } from "react-color";
import cn from "classnames";
import Popup from "reactjs-popup";
import bottle from "../../questionbottle.svg";

// preliminary code thanks to: https://codepen.io/philipp-spiess/pen/WpQpGr
class Draw extends React.Component {
  constructor() {
    super();
    this.state = {
      lines: new List(),
      undoList: new List(),
      colors: new List(),
      undoColors: new List(),
      widths: new List(),
      undoWidths: new List(),
      isDrawing: false,
      targetBoard: null,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      strokeWidth: 5,
      drawColor: "#000000",
      top_left_color: null,
      top_right_color: null,
      bottom_right_color: null,
      bottom_left_color: null,
      targetBoardMap: {
        "0": this.updateTopLeft,
        "1": this.updateTopRight,
        "2": this.updateBottomRight,
        "3": this.updateBottomLeft
      },
      drawingSentToDb: false,
      submitModalOpen: false,
      name: ""
    };
  }

  handleTouchStart = (touchEvent) => {
    const point = this.relativeCoordinatesForEvent(touchEvent.touches[0]);
    this.setState(prevState => ({
      lines: prevState.lines.push(new List([point])),
      isDrawing: true,
      colors: this.state.colors.push(this.state.drawColor),
      widths: this.state.widths.push(this.state.strokeWidth)
    }));
  }

  // start drawing
  handleMouseDown = mouseEvent => {
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState => ({
      lines: prevState.lines.push(new List([point])),
      isDrawing: true,
      colors: this.state.colors.push(this.state.drawColor),
      widths: this.state.widths.push(this.state.strokeWidth)
    }));
  };

  handleTouchMove = touchEvent => {
    if (!this.state.isDrawing) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(touchEvent.touches[0]);
    this.setState(
      prevState => ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line =>
          line.push(point)
        )
      }));
  }

  // keep building up line points
  handleMouseMove = mouseEvent => {
    if (!this.state.isDrawing) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(
      prevState => ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line =>
          line.push(point)
        )
      }));
  };

  // end drawing
  handleMouseUp = () => {
    this.setState({
      isDrawing: false
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // convert mouse into relative coordinates for the canvas
  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top
    });
  }

  undo = () => {
    if (this.state.lines.size === 0) {
      return;
    }
    this.setState(
      prevState => ({
        undoList: prevState.undoList.push(prevState.lines.last()),
        lines: prevState.lines.delete(-1),
        undoColors: prevState.undoColors.push(prevState.colors.last()),
        colors: prevState.colors.delete(-1),
        undoWidths: prevState.undoWidths.push(prevState.widths.last()),
        widths: prevState.widths.delete(-1)
      })
    );
  };

  redo = () => {
    if (this.state.undoList.size === 0) {
      return;
    }
    this.setState(prevState => ({
      lines: prevState.lines.push(prevState.undoList.last()),
      undoList: prevState.undoList.delete(-1),
      colors: prevState.colors.push(prevState.undoColors.last()),
      undoColors: prevState.undoColors.delete(-1),
      widths: prevState.widths.push(prevState.undoWidths.last()),
      undoWidths: prevState.undoWidths.delete(-1)
    }));
  };

  clear = () => {
    if (this.state.lines.size === 0) {
      return;
    }
    this.setState(
      prevState => ({
        undoList: this.state.lines,
        lines: new List()
      })
    );
  };

  updateTopLeft = (db, lines, that) => {
    db.collection(this.props.db)
      .doc("draw")
      .update({
        top_left: lines
      })
      .then(
        db
          .collection(this.props.db)
          .doc("draw")
          .update({
            top_left_time: moment().format("MMMM DD YYYY, h:mm:ss a")
          })
          .then(that.cleanUp())
      );
  };

  updateTopRight = (db, lines, that) => {
    db.collection(this.props.db)
      .doc("draw")
      .update({
        top_right: lines
      })
      .then(
        db
          .collection(this.props.db)
          .doc("draw")
          .update({
            top_right_time: moment().format("MMMM DD YYYY, h:mm:ss a")
          })
          .then(that.cleanUp())
      );
  };

  updateBottomRight = (db, lines, that) => {
    db.collection(this.props.db)
      .doc("draw")
      .update({
        bottom_right: lines
      })
      .then(
        db
          .collection(this.props.db)
          .doc("draw")
          .update({
            bottom_right_time: moment().format("MMMM DD YYYY, h:mm:ss a")
          })
          .then(that.cleanUp())
      );
  };

  updateBottomLeft = (db, lines, that) => {
    db.collection(this.props.db)
      .doc("draw")
      .update({
        bottom_left: lines
      })
      .then(
        db
          .collection(this.props.db)
          .doc("draw")
          .update({
            bottom_left_time: moment().format("MMMM DD YYYY, h:mm:ss a")
          })
          .then(that.cleanUp())
      );
  };

  toggleSubmitModal = () => {
    this.setState(
      {
        submitModalOpen: !this.state.submitModalOpen
      }
    );
  };

  submit = () => {
    if (this.state.lines.size === 0 || this.state.targetBoard === null) {
      return;
    }
    let allLines = this.state.lines;
    // convert to object with nested arrays so firebase can store it properly
    allLines = allLines.toJS();

    let lineContainers = [];
    for (let line in allLines) {
      let container = {
        lines: allLines[line],
        color: this.state.colors.get(line),
        strokeWidth: this.state.widths.get(line),
        windowWidth: this.state.windowWidth,
        windowHeight: this.state.windowHeight
      };
      lineContainers.push(container);
    }
    let that = this;
    const target = this.state.targetBoard;
    let db = fire.firestore();
    target(db, lineContainers, that);
  };

  // reset state values and send a Google Analytics update
  cleanUp = () => {
    this.setState(
      {
        lines: new List(),
        undoList: new List(),
        colors: new List(),
        undoColors: new List(),
        widths: new List(),
        undoWidths: new List(),
        isDrawing: false,
        targetBoard: null,
        submitted: true,
        submitModalOpen: false,
        drawingSentToDb: true
      },
      () =>
        ReactGA.event(
          {
            category: "User",
            action: "Upload drawing on Draw Page"
          },
          () => this.componentDidMount()
        )
    );
  };

  // load the oldest board from the database and figure out which one to update
  loadBoardTimes = () => {
    let db = fire.firestore();
    let that = this;
    db.collection(this.props.db)
      .doc("draw")
      .onSnapshot(function(doc) {
        //combine coordinate data from all 4 boards into 1
        let topDisplay = doc.data().top_left;
        let bottomDisplay = doc.data().bottom_left;
        Array.prototype.push.apply(topDisplay, doc.data().top_right);
        Array.prototype.push.apply(bottomDisplay, doc.data().bottom_right);
        Array.prototype.push.apply(topDisplay, bottomDisplay);

        //update local state with DB counterparts
        that.setState(
          {
            total_board: topDisplay,
            bottom_left_time: moment(doc.data().bottom_left_time).format(
              "MMMM DD YYYY, h:mm:ss a"
            )._isValid
              ? moment(doc.data().bottom_left_time)
              : moment(),
            bottom_right_time: moment(doc.data().bottom_right_time).format(
              "MMMM DD YYYY, h:mm:ss a"
            )._isValid
              ? moment(doc.data().bottom_right_time)
              : moment(),
            top_left_time: moment(doc.data().top_left_time).format(
              "MMMM DD YYYY, h:mm:ss a"
            )._isValid
              ? moment(doc.data().top_left_time)
              : moment(),
            top_right_time: moment(doc.data().top_right_time).format(
              "MMMM DD YYYY, h:mm:ss a"
            )._isValid
              ? moment(doc.data().top_right_time)
              : moment()
          },
          () => that.setLatestBoard()
        );
      });
  };

  setLatestBoard = () => {
    let times = [
      this.state.top_left_time,
      this.state.top_right_time,
      this.state.bottom_right_time,
      this.state.bottom_left_time
    ];
    let minDate = moment.min(times);
    let minDateIndex = times.indexOf(minDate).toString();
    this.setState({
      targetBoard: this.state.targetBoardMap[minDateIndex]
    });
  };

  SubmitModal = style => {
    return (
      <Popup
        open={this.state.submitModalOpen}
        closeOnDocumentClick
        onClose={e => this.toggleSubmitModal(e)}
        contentStyle={style}
      >
        <div className="modal">
          <div>
            <h2>And what is your name, old chap?</h2>
            <input
              type="text"
              style={{ height: "20px" }}
              className="popup-input-small"
              required
              minLength="4"
              siz="10"
              name="name"
              value={this.state.name}
              placeholder={"Please add your name."}
              onChange={e => {
                this.handleChange(e);
              }}
            />
            <small className="small-red">
              {this.state.lines === new List() &&
                `Please draw something before submitting.`}
            </small>
            <div className="popup-btns">
              <button
                className="popup-btn-cancel"
                onClick={e => this.toggleSubmitModal(e)}
              >
                Cancel
              </button>
              <button
                className={`popup-btn-success ${
                  this.state.lines === new List()
                    ? " button-disabled"
                    : " button-primary"
                }`}
                onClick={e => this.submit(e)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Popup>
    );
  };

  handleColorPick = color => {
    this.setState({ drawColor: color.hex });
  };

  handleStrokeChange = event => {
    this.setState({ strokeWidth: event.target.value });
  };

  // need this to accurately report dimensions
  reportWindowSize = () => {
    this.setState(
      {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      }
    );
  };

  componentDidMount = () => {
    this.loadBoardTimes();
    let drawArea = document.getElementById("drawArea");
    if (drawArea) {
      drawArea.addEventListener("mouseup", this.handleMouseUp);
      drawArea.addEventListener("touchend", this.handleMouseUp);
      window.addEventListener("resize", this.reportWindowSize);
    }
  };

  componentWillUnmount() {
    let drawArea = document.getElementById("drawArea");
    if (drawArea) {
      drawArea.removeEventListener("mouseup", this.handleMouseUp);
      drawArea.removeEventListener("touchend", this.handleMouseUp);
      window.removeEventListener("resize", this.reportWindowSize);
    }
  }

  render() {
    const style = {
      display: "flex",
      justifyText: "center",
      flexDirection: "column",
      alignItems: "space-between",
      padding: "40px 40px",
      width: "70%",
      border: "none",
      borderRadius: "10px"
    };
    return (
      <div>
        {!this.state.drawingSentToDb ? (
          <div className={styles.pageContainer}>
            {this.state.submitModalOpen && this.SubmitModal(style)}
            <h3 className={styles.title}>Draw something and send it to the LED display!</h3>
            <div className={styles.buttonBox}>
              <button className={styles.button} onClick={e => this.undo(e)}>
                Undo
              </button>
              <button className={styles.button} onClick={e => this.redo(e)}>
                Redo
              </button>
              <button className={styles.button} onClick={e => this.clear(e)}>
                Clear
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={e => this.toggleSubmitModal(e)}
              >
                Submit
              </button>
            </div>
            <div
              className={styles.drawArea}
              id="drawArea"
              ref="drawArea"
              onMouseDown={this.handleMouseDown}
              onTouchStart={this.handleTouchStart}
              onMouseMove={this.handleMouseMove}
              onTouchMove={this.handleTouchMove}
            >
              <Drawing
                lines={this.state.lines}
                colors={this.state.colors}
                widths={this.state.widths}
              />
            </div>
            <div className={styles.effectContainerBox}>
              <div>
                <label>Stroke Color</label>
                <HuePicker
                  color={this.state.drawColor}
                  onChange={this.handleColorPick}
                />
              </div>
              <div className={styles.slidecontainer}>
                <label>Stroke Thickness</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  onChange={this.handleStrokeChange}
                  value={this.state.strokeWidth}
                  className={styles.slider}
                  id="myRange"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.pageContainer}>
            <h1>Here's everyone's drawings, thrown together!</h1>
            <div className={styles.drawArea} ref="drawSum">
              <TotalDrawing lines={this.state.total_board} />
            </div>
            <iframe
              src={"https://www.youtube.com/embed/gWxY58PMVUM"}
              title={"LED Wall Live Feed"}
              style={{
                position: "relative",
                left: "0",
                top: "0",
                width: "100%",
                height: "100vh"
              }}
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
            ></iframe>
          </div>
        )}
      </div>
    );
  }
}

function Drawing({ lines, colors, widths }) {
  return (
    <svg className={styles.drawing}>
      {lines.map((line, index) => (
        <DrawingLine
          key={index}
          line={line}
          color={colors.get(index)}
          strokeWidth={widths.get(index)}
        />
      ))}
    </svg>
  );
}

function TotalDrawing({ lines }) {
  if (!lines) {
    return <div>Nothing to see here folks!</div>;
  }
  return (
    <svg className={styles.drawing}>
      {lines.map((line, index) => (
        <StoredDrawingLine
          key={index}
          line={line}
          color={line.color}
          strokeWidth={line.strokeWidth}
        />
      ))}
    </svg>
  );
}

function DrawingLine({ line, color, strokeWidth }) {
  const pathData =
    "M " +
    line
      .map(p => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");

  return (
    <path
      className={styles.path}
      d={pathData}
      style={{ stroke: `${color}`, strokeWidth: `${strokeWidth}` }}
    />
  );
}

function StoredDrawingLine({ line, color, strokeWidth }) {
  if (!line.lines) {
    return <path />;
  }
  const pathData =
    "M " +
    line.lines
      .map(p => {
        return `${p["x"]} ${p["y"]}`;
      })
      .join(" L ");

  return (
    <path
      className={styles.path}
      d={pathData}
      style={{ stroke: `${color}`, strokeWidth: `${strokeWidth}` }}
    />
  );
}

export default Draw;
