import React, { Component } from 'react';
import './faq.css';
import FaqQuestion from './faqquestion';

export class Faq extends Component {

    state = {
        questions: [
            {
                question: "I’d like to know about upcoming TEDxCMU events?",
                answer: "Subscribe here. to get on our mailing list to receive information about the conference theme, Mini-Events, Main Event details, ticket sales, and other news about TEDxCMU!",
                category: "general"
            },
            {
                question: "When and where is this year’s TEDxCMU event?",
                answer: "The full-day event of curated speakers, entertainment, food and audience experiences will held Saturday, March 30th at the Jared L. Cohon University Center at Carnegie Mellon University. The Jared L. Cohon University center is located in the middle of campus and can be seen from Forbes Avenue. More information about its location and directions can be found here.",
                category: "general"
            },
            {
                question: "Will there be food? What are the lunch options?",
                answer: "We will provide some light breakfast in the morning during registration.There will be a lunch break with food and beverages (including vegetarian and gluten free options).",
                category: "general"
            },
            {
                question: "How much are tickets?",
                answer: "The 2019 prices will come out soon and are set for general admission and VIP admission. TEDxCMU relies on tickets and support  to cover all our costs per TED rules for independently organized TEDx events.",
                category: "tickets"
            },
            {
                question: "Can I return my tickets? Can I exchange my tickets?",
                answer: "Tickets are non-refundable.Tickets can be transferred, however, we cannot make the transfer for you.",
                category: "tickets"
            
            },
            {
                question: "When do tickets go on sale?",
                answer: "ur tickets traditionally go on sale in early March. We may have events that raffle off special discounts or give free tickets. To learn more about those events, subscribe to our newsletter and follow us on social media.",
                category: "tickets"
            },
            {
                question: "Are kids allowed? Are there age minimums? Will teenagers like TEDxCMU?",
                answer: "We work to keep the day engaging for all attendees, with experiences designed  “for your seat” and “for your feet” in the auditorium and the lobby. Older teenagers will likely get the most out of the event, but you know your kids best. Will they enjoy it?",
                category: "tickets"
            },
            {
                question: "Is there assigned seating or is it first come, first served? We bought different tiers of tickets, can we sit together? What about accessibility?",
                answer: "VIP ticket holders and special guests are allowed early access to seating on the day of the event. Rows are reserved for each ticket tier and is on a first come, first served basis for seating within the respective ticket tier.",
                category: "tickets"
            },
            {
                question: "I’d like to volunteer.",
                answer: "Thank you for your interest in joining the team! TEDxCMU wouldn’t exist without the contributions volunteers make at our events. We select our day-of-event volunteers a month to two in advance of the event. You can also scroll to the bottom of the page to subscribe to our newsletter and receive all the announcements about future ticket sales, adventures, salons and more. We look forward to seeing you!",
                category: "volunteer"
            },
            {
                question: "Still have questions?",
                answer: "Please check out our Speaker FAQ and contact us about any further questions you may have!",
                category: "volunteer"
            }
        ],
        displayItems: [0, 10]
    }

    toggleAll = () => {
        this.setState({ displayItems: [0, 10]});
    };

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
                    return <FaqQuestion key={index} question={q.question}>
                        {q.answer}
                    </FaqQuestion>
                })}
            </div>
        );

        return (
            <div className="faq">
                <h1>FAQ</h1>
                <div className="justified">
                    <button onClick={this.toggleAll} className="button-primary">All</button>
                    <button onClick={this.toggleGeneral} className="button-primary">General</button>
                    <button onClick={this.toggleTickets} className="button-primary">Tickets</button>
                    <button onClick={this.toggleVolunteer} className="button-primary">Volunteers</button>
                </div>
                {content}
            </div>
        );
    }
}

export default Faq;