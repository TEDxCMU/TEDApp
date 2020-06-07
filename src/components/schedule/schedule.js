import React, { Component } from 'react';
import Link from 'next/link';
import { Box } from 'rebass';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
import TimePicker from 'rc-time-picker';
import Popup from 'reactjs-popup';
import posed from 'react-pose';
import classNames from 'classnames';

const styles = {};

const Item = posed.li({
    enter: { y: 0, x: 0, opacity: 1,
        transition: {
            x: { type: 'spring', stiffness: 300, damping: 15 },
            y: { type: 'spring', stiffness: 300, damping: 15 },
            default: { duration: 300 },
        },
    },
    exit: { y: 20, opacity: 0, transition: { duration: 150 } },
});

const Sidebar = posed.ul({
    enter: {
        x: 0,
        delayChildren: 1100,
        staggerChildren: 50,
        transition: {
            x: { type: 'spring', stiffness: 100, damping: 15 },
            y: { type: 'spring', stiffness: 100, damping: 15 },
        },
    },
    exit: { x: '-100%', delay: 0, transition: { duration: 0 } },
});

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
                <Box
                    sx={{
                        display: 'flex',
                        height: '100vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100vw',
                    }}>
                    <BounceLoader
                        sizeUnit={'px'}
                        size={150}
                        color={'#e62b1e'}
                        loading={this.state.loading}
                    />
                </Box>
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

        const newList = [];
        let notification = this.state.announcement;
        this.state.allEvents.forEach(event => {
            let className = styles['bullet__upcoming'];
            if (moment().isBetween(moment(event.start, 'hh:mm A'), moment(event.end, 'hh:mm A'))) {
                className = styles['bullet__now'];
                notification = event.announcement;
            } else if (eventDate < moment().format('L') && (moment() > moment(this.state.allEvents[0].end, 'hh:mm A'))) {
                notification = this.state.eventEndedAnnouncement;
            }

            if (moment().isAfter(moment(event.end, 'hh:mm A'))) {
                className = styles['bullet__past'];
            }

            const infoTalkStyle = classNames(styles['event-card'], styles['event-card--clickable']);
            if (event.type !== 'static') {
                newList.push(
                    <Item className={styles['event']} key={event.id} id={className === styles['bullet__now'] ? styles['eventNow'] : null}>
                        {this.props.isAdmin ?
                            <div>
                                <span className={className}></span>
                                <span className={styles['bullet__bg']}></span>
                                <div className={infoTalkStyle}>
                                    <div>
                                        <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                                        <h4 className={styles['event__title']}>{event.title}</h4>
                                        <p className={styles['event__desc']}>{event.blurb}</p>
                                        <br />
                                        {this.props.isAdmin && (
                                            <div>
                                                <button className="btn btn--primary" onClick={() => { this.openDelayModal(allEvents.indexOf(event)); }}>End</button>
                                            </div>
                                        )}
                                    </div>
                                    <img src="../../../public/vectors/smallArrow.svg" className={styles['event-card__arrow']} alt="information arrow" />
                                </div>
                            </div>
                            :
                            <div>
                                <Link href={'talks/' + event.id}>
                                    <a>
                                        <span className={className}></span>
                                        <span className={styles['bullet__bg']}></span>
                                        <div className={classNames(styles['event-card'], styles['event-card--clickable'])}>
                                            <div className={styles['event-card__content']}>
                                                <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                                                <h4 className={styles['event__title']}>{event.blurb}</h4>
                                                <img src={event.image !== undefined ? event.image : '../../../public/vectors/placeholder.svg'} className={styles['event-card__img']} alt="speaker" />
                                                <p className={styles['event__desc']}>{event.title}</p>
                                            </div>
                                            <img src="../../../public/vectors/smallArrow.svg" className={styles['event-card__arrow']} alt="information arrow" />
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        }
                    </Item>,
                );
            } else {
                newList.push(
                    <Item className={styles['event']} key={event.id} id={className === styles['bullet__now'] ? styles['eventNow'] : null}>
                        <span className={className}></span>
                        <span className={styles['bullet__bg']}></span>
                        <div className={classNames(styles['event-card'], styles['event-card--static'])}>
                            <p className={styles['event__time']}><strong>{event.start}</strong> — {event.end}</p>
                            <h5 className={styles['event__title']}>{event.title}</h5>
                            <small>{event.blurb}</small>
                            {this.props.isAdmin && (
                                <div>
                                    <button
                                        className="btn btn--primary"
                                        onClick={() => {
                                            this.openDelayModal(allEvents.indexOf(event));
                                        }}
                                    >
                                        End
                                    </button>
                                </div>
                            )}
                        </div>
                    </Item>,
                );
            }
        });
        const allEvents = this.state.allEvents;
        const index = this.state.eventNum;
        if (newList.length > 0) {
            return (
                <div className={styles['schedule-container']}>
                    {this.globalTimeChangePopup(style)}
                    {this.singleEventTimeChangePopup(style, index, allEvents)}
                    <div>
                        <Header
                            link={this.state.headerLink}
                            title={this.state.headerTitle}
                            description={notification}
                            db={this.props.db}
                            isAdmin={this.props.isAdmin}
                            headerStyle="fixed"
                        />
                    </div>
                    {localStorage.getItem('canShiftGlobalStartTime') === null && this.props.isAdmin ? (
                        <div>
                            <div className={styles['timeline__timepicker']}>
                                <TimePicker
                                    defaultValue={this.state.date}
                                    onChange={this.handleValueChange} />
                                <button className="btn btn--primary" onClick={e => this.openGlobalChangeModal(e)}>New Conference Start Time</button>
                            </div>
                            <div className={classNames(styles['timeline-container'], styles['timeline-container--admin'])}> {/* admin timeline */}
                                {this.sideBar(newList)}
                            </div>
                        </div>
                    ) : (
                        <div className={styles['timeline-container']}>
                            {this.sideBar(newList)}
                        </div>
                    )}
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

    sideBar = (newList) => {
        return (
            <Sidebar id="itinerary" className={styles['timeline']} pose={this.state.isOpen ? 'enter' : 'exit'}>
                {newList}
            </Sidebar>
        );
    }
}

export default Schedule;
