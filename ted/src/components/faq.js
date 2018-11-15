import React from 'react';
import './faq.css';
import Dropdown from './dropdown';

const Faq = () => {
    return (
        <div className="faq">
            <h1>General FAQ</h1>
            <Dropdown title="Hello!">
                Hey there friend whats poppin
                <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div>
                {/* <div className="video">
                    <iframe src="https://embed.ted.com/talks/dawn_wacek_a_librarian_s_case_against_overdue_book_fines" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </div> */}
            </Dropdown>
            <Dropdown title="Hello!">What a wonderful world...</Dropdown>
            <Dropdown title="Hello!">"What a wonderful world...</Dropdown>
            <div>
                <h6>I’d like to know about upcoming TEDxCMU events?</h6>
                <p>Subscribe <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb" target="_blank">here</a> to get on our mailing list to receive information about the conference theme, Mini-Events, Main Event details, ticket sales, and other news about TEDxCMU!</p>
            </div>
            <div>
                <h6>When and where is this year’s TEDxCMU event?</h6>
                <p>The full-day event of curated speakers, entertainment, food and audience experiences will held Saturday, March 30th at the Jared L. Cohon University Center at Carnegie Mellon University. The Jared L. Cohon University center is located in the middle of campus and can be seen from Forbes Avenue. More information about its location and directions can be found <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb" target="_blank">here</a>.</p>
            </div>
            <div>
                <h6>Will there be food? What are the lunch options?</h6>
                <p>We will provide some light breakfast in the morning during registration.There will be a lunch break with food and beverages (including vegetarian and gluten free options).</p>
            </div>

            <br />
            <h2>Tickets</h2>
            <div>
                <h6>How much are tickets?</h6>
                <p>The 2019 prices will come out soon and are set for general admission and VIP admission. TEDxCMU relies on tickets and support  to cover all our costs per TED rules for independently organized TEDx events.</p>
            </div>
            <div>
                <h6>Can I return my tickets? Can I exchange my tickets?</h6>
                <p>Tickets are non-refundable.Tickets can be transferred, however, we cannot make the transfer for you.</p>
            </div>
            <div>
                <h6>When do tickets go on sale?</h6>
                <p>ur tickets traditionally go on sale in early March. We may have events that raffle off special discounts or give free tickets. To learn more about those events, <a href="http://tedxcmu.us3.list-manage.com/subscribe/post?u=eb8a63a687a4d582ce3b6b515&id=ce11cda9eb" target="_blank">subscribe</a> to our newsletter and follow us on <a href="http://facebook.com/tedxcmu" target="_blank">social media</a>.</p>
            </div>
            <div>
                <h6>Are kids allowed? Are there age minimums? Will teenagers like TEDxCMU?</h6>
                <p>We work to keep the day engaging for all attendees, with experiences designed  “for your seat” and “for your feet” in the auditorium and the lobby. Older teenagers will likely get the most out of the event, but you know your kids best. Will they enjoy it?</p>
            </div>
            <div>
                <h6>Is there assigned seating or is it first come, first served? We bought different tiers of tickets, can we sit together? What about accessibility?</h6>
                <p>VIP ticket holders and special guests are allowed early access to seating on the day of the event. Rows are reserved for each ticket tier and is on a first come, first served basis for seating within the respective ticket tier.</p>
            </div>

            <br />
            <h2>Volunteers</h2>
            <div>
                <h6></h6>
                <p>Thank you for your interest in joining the team! TEDxCMU wouldn’t exist without the contributions volunteers make at our events. We select our day-of-event volunteers a month to two in advance of the event.</p>
                <p>You can also scroll to the bottom of the page to subscribe to our newsletter and receive all the announcements about future ticket sales, adventures, salons and more. We look forward to seeing you!</p>
            </div>

            <div>
                <h6>Still have questions?</h6>
                <p>Please check out our <a href="https://www.tedxcmu.org/speaker-faq" target="_blank">Speaker FAQ</a> and <a href="https://www.tedxcmu.org/sponsors-media-faq" target="_blank">Sponsor &amp; Media FAQ</a> for more information about those areas. If you can’t find your answer on those pages, please don’t hesitate to <a href="https://www.tedxcmu.org/contact" target="_blank">contact us</a> about any further questions you may have!</p>
            </div>
        </div>
    );
}

export default Faq;