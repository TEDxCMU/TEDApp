import React, { Component } from 'react';
import '../../App.css';
import './faq.css';
import Dropdown from '../dropdown/dropdown';
import Parser from 'html-react-parser';

export class Faq extends Component {

    state = {
        questions: [
            {
                question: 'Where can I learn more about upcoming TEDxCMU events?',
                answer: '<p>Subscribe <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb">here</a> to get on our mailing list to receive information about the conference theme, Mini-Events, Main Event details, ticket sales, and other news about TEDxCMU!<p>',
                category: 'general'
            },
            {
                question: 'When and where is this year\'s Spring Mini-Event?',
                answer: '<p>This year\'s Spring Mini-Event will be held on February 14th, 2019 at Hamerschlag B 103 at 6:30 PM - 7:30 PM.</p>',
                category: 'general'
            },
            {
                question: 'Will there be food? What are the lunch options?',
                answer: '<p>Yes! We will provide free donuts and coffee.</p>',
                category: 'general'
            },
            {
                question: 'How much are Spring Mini-Event tickets?',
                answer: '<p>The Spring Mini-Event is free!</p>',
                category: 'tickets'
            },
            {
                question: 'Can I return main event tickets? Can I exchange my tickets?',
                answer: '<p>For our main event, tickets are non-refundable. Tickets can be transferred, but we cannot make the transfer for you.</p>',
                category: 'tickets'
            
            },
            {
                question: 'When do main event tickets go on sale?',
                answer: '<p>Our tickets traditionally go on sale in early March. We may have events that raffle off special discounts or give free tickets. To learn more about those events, <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb">subscribe</a> to our newsletter and follow us on <a href="http://facebook.com/tedxcmu">social media</a>.</p>',
                category: 'tickets'
            },
            {
                question: 'Are kids allowed? Are there age minimums? Will teenagers like TEDxCMU?',
                answer: '<p>We work to keep the day engaging for all attendees, with experiences designed  "for your seat" and "for your feet" in the auditorium and the lobby. Older teenagers will likely get the most out of the event, but you know your kids best. Will they enjoy it?</p>',
                category: 'tickets'
            },
            {
                question: 'Is there assigned seating or is it first come, first served? We bought different tiers of tickets, can we sit together? What about accessibility?',
                answer: '<p>Seating is based on first come, first serve for mini events.</p><p>For the main event, VIP ticket holders and special guests are allowed early access to seating on the day of the event. Rows are reserved for each ticket tier and is on a first come, first served basis for seating within the respective ticket tier.</p>',
                category: 'tickets'
            },
            {
                question: 'I\'d like to volunteer.',
                answer: '<p>Thank you for your interest in joining the team! TEDxCMU wouldn\'t exist without the contributions volunteers make at our events. We select our day-of-event volunteers a month to two in advance of the event. You can also <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb">subscribe</a> to our newsletter and receive all the announcements about future ticket sales, adventures, salons and more. We look forward to seeing you!</p>',
                category: 'volunteer'
            },
            {
                question: 'Still have questions?',
                answer: '<p>Please check out our <a href="https://www.tedxcmu.org/speaker-faq">Speaker FAQ</a> and <a href="https://www.tedxcmu.org/contact">contact us</a> about any further questions you may have!</p>',
                category: 'volunteer'
            }
        ],
        displayItems: [0, 3]
    }

    toggleGeneral = () => {
        this.setState({ displayItems: [0, 3]});
    }

    toggleTickets = () => {
        this.setState({ displayItems: [3, 8]});
    }

    toggleVolunteer = () => {
        this.setState({ displayItems: [8, 10]});
    }

    render() {
        let content = null;
        content = (
            <div>
                {this.state.questions.slice(this.state.displayItems[0], this.state.displayItems[1]).map((q, index) => {
                    const parsedAnswer = Parser(q.answer);
                    return <Dropdown key={index} question={q.question}>
                        {parsedAnswer}
                    </Dropdown>
                })}
            </div>
        );

        let generalClasses = "button-primary medium blank";
        let ticketsClasses = "button-primary medium blank";
        let volunteerClasses = "button-primary medium blank";

        if (this.state.displayItems[0] === 0) {
            generalClasses = "button-primary medium";
        } else {
            generalClasses += "button-primary medium blank";
        }

        if (this.state.displayItems[0] === 3) {
            ticketsClasses = "button-primary medium";
        } else {
            ticketsClasses += "button-primary medium blank";
        }

        if (this.state.displayItems[0] === 8) {
            volunteerClasses = "button-primary medium";
        } else {
            volunteerClasses = "button-primary medium blank";
        }



        return (
            <div className="faq">
                <div className="justified">
                    <button onClick={this.toggleGeneral} style={{boxShadow: 'none'}} className={generalClasses}>General</button>
                    <button onClick={this.toggleTickets} style={{boxShadow: 'none'}} className={ticketsClasses}>Tickets</button>
                    <button onClick={this.toggleVolunteer} style={{boxShadow: 'none'}} className={volunteerClasses}>Volunteers</button>
                </div>

                {content}
            </div>
        );
    }

    componentDidMount = () => {
        this.props.isLoaded();
    }
}

export default Faq;