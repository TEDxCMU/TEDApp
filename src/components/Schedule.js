import React, { Component } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
import TimePicker from 'rc-time-picker';
import Popup from 'reactjs-popup';

import * as Styled from '../styles/Schedule';

class Schedule extends Component {
    state = {
        date: moment(),
        canShiftAll: true,
        allEvents: [],
        updateCount: 0,
        watchingForChanges: false,
        announcement: 'The conference is currently not in progress. Please check back at another time.',
        eventEndedAnnouncement: 'The conference is now over, thanks for coming! Please leave your feedback at <a class="link-white" href="http://bit.ly/tedxsurvey">bit.ly/tedxsurvey</a>',
        isOpen: false,
        scroll: 0,
        headerLink: true,
        headerTitle: 'Live Schedule',
        nowDist: 0,
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY < 50 && this.state.headerLink === false) {
            this.setState({ headerLink: true, headerTitle: 'Live Schedule' });
        } else if (window.scrollY >= 50 && this.state.headerLink === true) {
            this.setState({ headerLink: false, headerTitle: undefined });
        }
    }

    render() {
        const eventDate = moment(this.props.eventDate).format('L');
        if (this.state.allEvents.length === 0) {
            return (
                <Styled.Loader>
                    <BounceLoader
                        sizeUnit={'px'}
                        size={150}
                        color={'#e62b1e'}
                        loading={this.state.loading}
                    />
                </Styled.Loader>
            );
        }

        const style = {
            display: 'flex',
            justifyText: 'center',
            flexDirection: 'column',
            alignItems: 'space-between',
            padding: '30px 40px',
            width: '70%',
            border: 'none',
            borderRadius: '10px',
        };

        const list = [];
        let notification = this.state.announcement;
        this.state.allEvents.forEach(event => {
            let ActiveBullet = <Styled.Bullet />;
            if (moment().isBetween(moment(event.start, 'hh:mm A'), moment(event.end, 'hh:mm A'))) {
                ActiveBullet = <Styled.Bullet_Now />;
                notification = event.announcement;
            } else if (eventDate < moment().format('L') && (moment() > moment(this.state.allEvents[0].end, 'hh:mm A'))) {
                notification = this.state.eventEndedAnnouncement;
            }

            if (moment().isAfter(moment(event.end, 'hh:mm A'))) {
                ActiveBullet = <Styled.Bullet_Past />;
            }

            if (event.type !== 'static') {
                list.push(
                    <Styled.Event key={event.id}>
                        <Link href={'talks/' + event.id}>
                            <a>
                                {ActiveBullet}
                                <Styled.Bullet_BG />
                                <Styled.Event_Card_Clickable>
                                    <Styled.Event_Card_Content>
                                        <Styled.Event_Time>
                                            <strong>{event.start}</strong> — {event.end}
                                        </Styled.Event_Time>
                                        <Styled.Event_Title>
                                            {event.blurb}
                                        </Styled.Event_Title>
                                        <Styled.Event_Card_Img
                                            src={event.image !== undefined ? event.image : '../../../public/vectors/placeholder.svg'}
                                            alt="Speaker"
                                        />
                                        <Styled.Event_Desc>
                                            {event.title}
                                        </Styled.Event_Desc>
                                    </Styled.Event_Card_Content>
                                    <Styled.Event_Card_Arrow
                                        src="../../../public/vectors/smallArrow.svg"
                                        alt="Information Arrow"
                                    />
                                </Styled.Event_Card_Clickable>
                            </a>
                        </Link>
                    </Styled.Event>,
                );
            } else {
                list.push(
                    <Styled.Event key={event.id}>
                        {ActiveBullet}
                        <Styled.Bullet_BG />
                        <Styled.Event_Card_Static>
                            <Styled.Event_Time>
                                <strong>{event.start}</strong> — {event.end}
                            </Styled.Event_Time>
                            <Styled.Event_Title>
                                {event.title}
                            </Styled.Event_Title>
                            <small>
                                {event.blurb}
                            </small>
                        </Styled.Event_Card_Static>
                    </Styled.Event>,
                );
            }
        });

        const allEvents = this.state.allEvents;
        const index = this.state.eventNum;
        if (list.length > 0) {
            return (
                <div className={styles['schedule-container']}>
                    {this.globalTimeChangePopup(style)}
                    {this.singleEventTimeChangePopup(style, index, allEvents)}
                    <Header
                        link={this.state.headerLink}
                        title={this.state.headerTitle}
                        description={notification}
                        db={this.props.db}
                        isAdmin={this.props.isAdmin}
                        headerStyle="fixed"
                    />
                    <div className={styles['timeline-container']}>
                        {this.sideBar(list)}
                    </div>
                </div>
            );
        }
    }

    updateListSelection = () => {
        if (this.state.alreadyScrolled === null) {
            return;
        } else if (document.getElementById('eventNow') === null) {
            return;
        } else {
            const targetLi = document.getElementById('eventNow');
            window.scrollTo(0, (targetLi.offsetTop - 50));
            this.setState({
                alreadyScrolled: true,
            });
        }
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    openGlobalChangeModal = (e) => {
        e.preventDefault();
        this.setState({
            endAllOpen: true,
            shiftingGlobal: true,
        });
    }

    closeGlobalChangeModal = () => {
        this.setState({
            endAllOpen: false,
            shiftingGlobal: false,
            eventNum: undefined,
        });
    }

    openDelayModal = (index) => {
        this.setState({
            endEventLaterOpen: true,
            eventNum: index,
        });
    }

    closeDelayModal = () => {
        this.setState({
            endEventLaterOpen: false,
            eventNum: undefined,
        });
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleValueChange(date) {
        this.setState({ date });
    }

    confirmShiftAll = (e) => {
        e.preventDefault();
        this.setState({
            shiftingGlobal: null,
            endAllOpen: false,
        }, () => this.shiftAll(this.state.value));
    }

    confirmShiftOne = (e, index) => {
        e.preventDefault();
        this.setState({
            shiftingGlobal: null,
            endAllOpen: false,
        }, () => this.shiftEndTime(index, moment().format('hh:mm A')));
    }

    confirmShiftOneWithDelay = (e, index, time) => {
        e.preventDefault();
        this.setState({
            shiftingGlobal: null,
            endEventLaterOpen: false,
        }, () => this.shiftEndTime(index, time));
    }

    shiftAll = (newStart) => {
        const allElements = this.state.allEvents;
        const immediateNextEvent = moment(allElements[0].start, 'hh:mm A');
        const conferenceStart = newStart;
        const duration = moment.duration(conferenceStart.diff(immediateNextEvent));
        localStorage.setItem('updateCount', 0);
        for (let i = 0; i < allElements.length; i++) {
            const start = moment(allElements[i].start, 'hh:mm A').add(duration, 'minutes');
            const end = moment(allElements[i].end, 'hh:mm A').add(duration, 'minutes');
            const shiftedStart = start.format('hh:mm A');
            const shiftedEnd = end.format('hh:mm A');
            this.updateFireTimes(allElements[i].start, shiftedStart, shiftedEnd, i, allElements.length, 0);
        }
    }

    reloadPage = (length, index) => {
        if (parseInt(localStorage.getItem('updateCount')) === length - index) {
            localStorage.removeItem('updateCount');
            window.location.reload();
        }
    }

    // re-orders every event into chronological order
    addEventsToState = (snapshot, wholeData) => {
        if (wholeData.length === snapshot.size) {
            wholeData.forEach(event => {
                const j_time = moment(event.start, 'hh:mm A');
                const k_time = moment(event.end, 'hh:mm A');
                event.start = j_time;
                event.end = k_time;
            });
            const sortedData = wholeData.sort(function(a, b) { return a.start - b.start; });
            sortedData.forEach(event => {
                // reformating start and end times
                const j_time = moment(event.start, 'hh:mm A').format('hh:mm A');
                const k_time = moment(event.end, 'hh:mm A').format('hh:mm A');
                event.start = j_time;
                event.end = k_time;
            });
            // we've been here before, don't need to instantiate the snapshot listener
            if (this.state.watchingForChanges) {
                this.setState({
                    allEvents: sortedData,
                    isOpen: true,
                });
            } else {
                this.setState({ allEvents: sortedData, watchingForChanges: true }, () => this.watchForChanges());
            }
        }
    }

    globalTimeChangePopup= (style) => {
        return (
            <Popup open={this.state.endAllOpen} closeOnDocumentClick onClose={this.closeGlobalChangeModal} contentStyle={style}>
                <div className={styles['popup']}>
                    {this.state.shiftingGlobal !== null && this.state.shiftingGlobal === true ?
                        <div>
                            <h4>Are you sure you want to change the conference start time to {this.state.date.format('hh:mm A')}?</h4>
                            <div className={styles['popup__btn-group']}>
                                <button className="btn btn-full btn--cancel" onClick={this.closeGlobalChangeModal}>Cancel</button>
                                <button className="btn btn-full btn--primary" onClick={e => this.confirmShiftAll(e)}>Confirm</button>
                            </div>
                        </div>
                        :
                        null}
                </div>
            </Popup>
        );
    }

    singleEventTimeChangePopup = (style, index, allEvents) => {
        return (
            <Popup
                open={this.state.endEventLaterOpen}
                closeOnDocumentClick
                onClose={this.closeDelayModal}
                contentStyle={style}
            >
                <div className={styles['popup']}>
                    <div> New End Time:
                        <TimePicker
                            defaultValue={this.state.date}
                            onChange={this.handleValueChange}
                        />
                        <h4>Are you sure you want to change the end time of "{index === undefined ? 'Event Name' : allEvents[index].title}" to {this.state.value === null ? moment().format('hh:mm A') : moment(this.state.date).format('hh:mm A')}?</h4>
                        <div className={styles['popup__btn-group']}>
                            <button className="btn btn-full btn--cancel" onClick={this.closeDelayModal}>Cancel</button>
                            <button className="btn btn-full btn--primary" onClick={e => this.confirmShiftOneWithDelay(e, index, this.state.date)}>Confirm</button>
                        </div>
                    </div>
                </div>
            </Popup>
        );
    }

    sideBar = (list) => {
        return (
            <Sidebar id="itinerary" className={styles['timeline']} pose={this.state.isOpen ? 'enter' : 'exit'}>
                {list}
            </Sidebar>
        );
    }
}

export default Schedule;
