import React, { Component } from 'react';
import styles from './map.module.scss';
import map from'./cuc.png';

export class Map extends Component {
    state = { }

    render() {
        return (
            <div className={styles['map-container']}>
                <h5>Getting to CMU</h5>
                <iframe name="map" className={styles['map']} src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJwTuY5SHyNIgROLIDNCm3XbE&key=AIzaSyCTunhepxOuJE0aJPNWRhtbxCmCPIj29rI" title="map" allowFullScreen></iframe>
                <h5>Getting to the Event</h5>
                <img name="mcconomy" className={styles['map__indoor-img']} alt="Indoor map of McConomy Auditorium" src={map}></img>
            </div>
        );
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);
        this.props.isLoaded();
    }
}

export default Map;