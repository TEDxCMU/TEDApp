import React, {useState, useEffect, useRef} from 'react';
import '../../App.css';
import './draw.scss';
import {List, Map} from 'immutable'

// const Draw = (props) => {
//     const [renderedCards, setRenderedCards] = useState([])
//     const [isDrawing, setIsDrawing] = useState(false)
//     const [lines, setLines] = useState([])
//     const drawRef = useRef("drawArea");

//     useEffect(() => {
//         // preliminary code thanks to: https://codepen.io/philipp-spiess/pen/WpQpGr
//         document.addEventListener("mouseup", handleMouseUp);
//     }, [])

//     const handleMouseDown = (mouseEvent) => {
//         if (mouseEvent.button != 0) {
//           return;
//         }
    
//         const point = relativeCoordinatesForEvent(mouseEvent);
    
//         let oldLines = lines;
//         oldLines.push(point)
//         setLines(oldLines)
//         setIsDrawing(true)
//     }

//     const handleMouseMove = (mouseEvent) => {
//         if (isDrawing) {
//           return;
//         }
    
//         const point = relativeCoordinatesForEvent(mouseEvent);
        
//         let oldLines = lines;
//         oldLines[-1].push(point)
//         setLines(oldLines)

//         // this.setState(prevState =>  ({
//         //   lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
//         // }));
//       }

//     const handleMouseUp = () => {
//         setIsDrawing(false);
//     }
    
//     const relativeCoordinatesForEvent = (mouseEvent) => {
//         const boundingRect = this.refs.drawArea.getBoundingClientRect();
//         return new Map({
//           x: mouseEvent.clientX - boundingRect.left,
//           y: mouseEvent.clientY - boundingRect.top,
//         });
//     }

//     const Drawing = ({ lines }) => {
//         return (
//           <svg className="drawing">
//             {lines.map((line, index) => (
//               <DrawingLine key={index} line={line} />
//             ))}
//           </svg>
//         );
//     }
      
//     const DrawingLine = ({ line }) => {
//         const pathData = "M " +
//           line
//             .map(p => {
//               return `${p.get('x')} ${p.get('y')}`;
//             })
//             .join(" L ");
      
//         return <path className="path" d={pathData} />;
//     }

//     return(
//         <div
//             className="drawArea"
//             ref={drawRef}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//         >
//             <Drawing lines={lines} />
//         </div>
//         // <div>Hello</div>
//     )
// }

class Draw extends React.Component {
    constructor() {
      super();
  
      this.state = {
        lines: new List(),
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
      if (mouseEvent.button != 0) {
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
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
      }), () => this.state.lines && console.log(this.state.lines.get(0).get(0)));
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
  
    render() {
      return (
        <div
          className="drawArea"
          ref="drawArea"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
        >
          <Drawing lines={this.state.lines} />
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