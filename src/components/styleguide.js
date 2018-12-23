import React from 'react';

const StyleGuide = () => {
    return (
        <div>
            <div>
                <div>
                    <p><a href="http://google.com/">link</a></p>
                    <p><abbr title="this isn't a very good description">abbreviation</abbr></p>
                    <p><strong>strong text</strong></p>
                    <p><em>em text</em></p>
                    <p><del>deleted text</del></p>
                    <p><mark>this is a mark text.</mark></p>
                    <p><code>.code</code></p>
                    <p><small>(While supplies last. Offer expires on the vernal equinox. Not valid in Ohio.)</small></p>
                </div>
                <br />
                <div>
                    <h3>Headers</h3>
                    <h1>H1 Heading</h1>
                    <h2>H2 Heading</h2>
                    <h3>H3 Heading</h3>
                    <h4>H4 Heading</h4>
                    <h5>H5 Heading</h5>
                    <h6>H6 Heading</h6>
                </div>
            </div>
            <div>
                <h3>Quotes</h3>
                <blockquote>
                    <p>Your work is going to fill a large part of your life, and the only way to be truly satisfied is
                    to do what you believe is great work. And the only way to do great work is to love what you do.
                    If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.
                    </p>
                    <br />
                    <cite>Steve Jobs</cite>
                </blockquote>
            </div>
            <div>
            <h3>Example Lists</h3>
                <ol>
                    <li>Here is an example</li>
                    <li>of an ordered list.</li>
                    <li>A parent list item.
                        <ul>
                            <li>one</li>
                            <li>two</li>
                            <li>three</li>
                        </ul>
                    </li>
                    <li>A list item.</li>
                </ol>

                <ul className="disc">
                    <li>Here is an example</li>
                    <li>of an unordered list.</li>
                </ul>	

                <h3>Definition Lists</h3>	            

                <h5>a) Multi-line Definitions (default)</h5>

                <dl>
                    <dt><strong>This is a term</strong></dt>
                        <dd>this is the definition of that term, which both live in a <code>dl</code>.</dd>
                    <dt><strong>Another Term</strong></dt>
                        <dd>And it gets a definition too, which is this line</dd>
                        <dd>This is a 2<sup>nd</sup> definition for a single term. A <code>dt</code> may be followed by multiple <code>dd</code>s.</dd>
                </dl>
            </div>
                <h3>Buttons</h3>
                <div>
                    <button className="large button-primary" href="#">Primary Button</button>
                    <button className="large" href="#">Default Button</button>
                    <button className="stroke large" href="#">Stroke Button</button>
                </div>
            <div>
                <h3>Form Styles</h3>
                <form>
                    <div>
                        <label for="sampleInput">Your email</label>
                        <input type="email" placeholder="test@mailbox.com" id="sampleInput" />
                    </div>
                    <div>
                        <label for="sampleRecipientInput">Reason for contacting</label>
                        <div>
                            <select id="sampleRecipientInput">
                                <option value="Option 1">Questions</option>
                                <option value="Option 2">Report</option>
                                <option value="Option 3">Others</option>
                            </select>
                        </div>			         	
                    </div>

                    <label for="exampleMessage">Message</label>
                    <textarea placeholder="Your message" id="exampleMessage"></textarea>
                    
                    <label>
                    <input type="checkbox" />			            
                    <span className="label-text">Send a copy to yourself</span>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div>
                <h3>Tables</h3>
                <p>Be sure to use properly formed table markup with <code>&lt;thead&gt;</code> and <code>&lt;tbody&gt;</code> when building a <code>table</code>.</p>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Sex</th>
                            <th>Location</th>					    
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>Naruto Uzumaki</td>
                            <td>16</td>
                            <td>Male</td>
                            <td>Konoha</td>					    
                            </tr>
                            <tr>
                            <td>Sakura Haruno</td>
                            <td>16</td>
                            <td>Female</td>
                            <td>Konoha</td>			    
                            </tr>
                        </tbody>
                    </table>
                </div>    
            </div>
        </div>
    );
}

export default StyleGuide;