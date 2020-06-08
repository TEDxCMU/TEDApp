import React, { Component } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';

import * as Styled from '../styles/Schedule';

class Schedule extends Component {
    state = {
        allEvents: [],
        isOpen: false,
        scroll: 0,
        headerLink: true,
        headerTitle: 'Live Schedule',
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

        const list = [];
        this.state.allEvents.forEach(event => {
            let ActiveBullet = <Styled.Bullet />;
            if (moment().isBetween(moment(event.start, 'hh:mm A'), moment(event.end, 'hh:mm A'))) {
                ActiveBullet = <Styled.Bullet_Now />;
            } else if (moment().isAfter(moment(event.end, 'hh:mm A'))) {
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

        if (list.length > 0) {
            return (
                <Styled.Timeline_Container>
                    <Styled.Timeline
                        id="itinerary"
                        pose={this.state.isOpen ? 'enter' : 'exit'}
                    >
                        {list}
                    </Styled.Timeline>
                </Styled.Timeline_Container>
            );
        }
    }
}

export default Schedule;
