import React, { Component } from 'react';

import styles from './dropdown.module.scss';
import check from '../../check.svg'

export class Dropdown extends Component {
  state = {
    showContent: false
  }

  toggleShow = () => {
    const doesShow = this.state.showContent;
    this.setState({
      showContent: !doesShow
    });
  };

    render() {
      let content = null;
      if (this.state.showContent ) {
        content = (
          <div className={styles['dropdown-container']}>
            {this.props.children}
          </div>
        );
      }
      
      return (
        <div className={styles['dropdown']}>
            <div onClick={this.toggleShow} className={styles['dropdown__label']}>
                <h6 className={this.state.showContent ? styles['dropdown__text--open'] : styles['dropdown__text']}>{this.props.question}</h6>
                {this.props.check && <img className={styles['dropdown__checkmark']} src={check} alt="checkmark"></img> }
                <h4 className={styles['dropdown__toggle']}>{this.state.showContent ? "-" : "+"}</h4>
            </div>
            {content}
        </div>
      );
    }

    componentWillReceiveProps = (props) => {
      if (this.props.answered) {
        this.setState({
          showContent: false
        })
      }
    }

}

export default Dropdown;