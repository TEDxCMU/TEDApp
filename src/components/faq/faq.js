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
                question: 'When and where is this year\'s event?',
                answer: '<p>This year\'s TEDxCMU conference, "Ripple Effet", will be held on Saturday, 03/30/2019, in the Jared L. Cohon University Center, from 9:00 AM - 3:00 PM.</p>',
                category: 'general'
            },
            {
                question: 'Will there be food?',
                answer: '<p>We will provide some light breakfast in the morning during registration. There will be a lunch break with catering from Chipotle (including vegetarian and gluten free options).</p>',
                category: 'general'
            },
            {
                question: 'How much are tickets?',
                answer: '<p>General admission tickets are $15 and VIP admission is $30 per ticket. Ticket  purchases include access to both speaker sessions and performances, our Innovation Expo, free breakfast and a Chipotle lunch, as well as an appreciation bag with a water bottle and other goodies. VIP purchases will have more benefits and will receive more items. TEDxCMU relies on tickets and support to cover all costs per TED rules for independently organized TEDx events.</p>',
                category: 'tickets'
            },
            {
                question: 'Can I return event tickets? Can I exchange my tickets?',
                answer: '<p>Tickets are non-refundable. Tickets can be transferred to another person, but we cannot make that transfer for you.</p>',
                category: 'tickets'
            
            },
            {
                question: 'When do event tickets go on sale?',
                answer: '<p>Tickets are on sale now! Find more information about purchasing <a href="http://carnegiemellontickets.universitytickets.com/w/event.aspx?id=1830&p=1&fbclid=IwAR1qGp31E_oTd6kL-_IHp0JvN4RCXnckFvsvEmLzRY1XnXh_E4EWs2u8kcg">here</a>. We also may have events that raffle off special discounts or give free tickets. To learn more about those events, <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb">subscribe</a>to our newsletter and follow us on <a href="http://facebook.com/tedxcmu">social media</a>.</p>',
                category: 'tickets'
            },
            {
                question: 'Are kids allowed? Are there age minimums? Will teenagers like TEDxCMU?',
                answer: '<p>We work to keep the day engaging for all attendees, with experiences designed  "for your seat" and "for your feet" in the auditorium and the lobby. Older teenagers will likely get the most out of the event, but you know your kids best. Will they enjoy it?</p>',
                category: 'tickets'
            },
            {
                question: 'Is there assigned seating?',
                answer: 'VIP ticket holders and special guests are allowed early access to seating on the day of the event.</p>',
                category: 'tickets'
            },
            {
                question: 'We bought different tiers of tickets, can we sit together?',
                answer: '<p>Rows are reserved for each ticket tier and are on a first come, first served basis for seating within each respective ticket tier.</p>',
                category: 'tickets'
            },            
            {
                question: 'What about accessibility?',
                answer: '<p>McConomy auditorium is wheelchair accessible!</p>',
                category: 'tickets'
            },
            {
                question: 'I\'d like to volunteer!',
                answer: '<p>Thank you for your interest in joining the team! TEDxCMU wouldn\'t exist without the contributions volunteers make at our events. We select our day-of-event volunteers a month to two in advance of the event. You can also <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb">subscribe</a> to our newsletter and receive all the announcements about future ticket sales, adventures, salons and more. We look forward to seeing you!</p>',
                category: 'volunteer'
            },
            {
                question: 'Still have questions?',
                answer: '<p>Please check out our <a href="https://www.tedxcmu.org/speaker-faq">Speaker FAQ</a> and <a href="https://www.tedxcmu.org/sponsors-media-faq>Sponsor & Media FAQ</a> for more information. If you can\'t find your answer, on those pages, don\'t hesitate to <a href="https://www.tedxcmu.org/contact">contact us</a> about any further questions you may have!</p>',
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

        let generalClasses = "btn btn--tertiary";
        let ticketsClasses = "btn btn--tertiary";
        let volunteerClasses = "btn btn--tertiary";

        if (this.state.displayItems[0] === 0) {
            generalClasses = "btn btn--primary";
        } else {
            generalClasses += "btn btn--tertiary";
        }

        if (this.state.displayItems[0] === 3) {
            ticketsClasses = "btn btn--primary";
        } else {
            ticketsClasses += "btn btn--tertiary";
        }

        if (this.state.displayItems[0] === 8) {
            volunteerClasses = "btn btn--primary";
        } else {
            volunteerClasses = "btn btn--tertiary";
        }



        return (
            <div className="faq">
                <div className="faq__btn-group">
                    <button className="btn btn--primary" onClick={this.toggleGeneral} className={generalClasses}>General</button>
                    <button className="btn btn--primary" onClick={this.toggleTickets} className={ticketsClasses}>Tickets</button>
                    <button className="btn btn--primary" onClick={this.toggleVolunteer} className={volunteerClasses}>Volunteers</button>
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