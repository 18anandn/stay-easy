import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledTerms = styled.div`
  padding: 2rem 8rem;

  ul {
    padding-left: 1rem;
  }

  h1 {
    margin-bottom: 1rem;
  }

  h2 {
    margin: 1.5rem 0 0.5rem 0;
  }

  a {
    color: black;
  }
`;

const Terms: React.FC = () => {
  return (
    <StyledTerms>
      <h1>Terms and Conditions</h1>

      <p>Last Updated: 7, Dec 2023</p>

      <ol>
        <li>
          <h2>Booking and Reservation Policies:</h2>
          <ul>
            <li>
              By making a reservation through our platform, you agree to the
              booking process and confirm that you have read and understood our
              reservation confirmation procedures.
            </li>
            <li>
              <b>This is a sample website so there is no payment involved.</b>
            </li>
          </ul>
        </li>

        <li>
          <h2>Cancellation Policies:</h2>
          <ul>
            <li>Cancellations is not possible.</li>
          </ul>
        </li>

        <li>
          <h2>Check-In and Check-Out Procedures:</h2>
          <ul>
            <li>
              Check-in time is generally by night, and check-out time is before
              noon.
            </li>
            <li>
              Late check-in and early check-out may be accommodated with prior
              notice.
            </li>
            <li>
              Key exchange instructions will be provided upon confirmation of
              your reservation.
            </li>
          </ul>
        </li>

        <li>
          <h2>House Rules:</h2>
          <ul>
            <li>
              Guests are expected to adhere to our house rules provided by the
              hosts.
            </li>
          </ul>
        </li>

        <li>
          <h2>Accommodation Details:</h2>
          <ul>
            <li>
              Please review the property description for specific details.
            </li>
          </ul>
        </li>

        <li>
          <h2>Liability and Insurance:</h2>
          <ul>
            <li>
              Guests are responsible for any damages caused during their stay.
            </li>
            <li>
              We recommend obtaining travel insurance to cover unforeseen
              circumstances.
            </li>
          </ul>
        </li>

        <li>
          <h2>Guest Responsibilities:</h2>
          <ul>
            <li>
              Guests are expected to maintain cleanliness and follow waste
              disposal guidelines.
            </li>
            <li>Failure to do so may result in additional charges.</li>
          </ul>
        </li>

        <li>
          <h2>Privacy Policy:</h2>
          <ul>
            <li>We take the privacy of your personal information seriously.</li>
            <li>
              Please review our <Link to="/privacy">Privacy Policy</Link> for
              details on how we handle your data.
            </li>
          </ul>
        </li>

        <li>
          <h2>Contact Information:</h2>
          <ul>
            <li>For emergencies, contact 9067438236.</li>
            <li>For customer support, reach us at 18anandn@gmail.com.</li>
          </ul>
        </li>

        <li>
          <h2>Local Regulations:</h2>
          <ul>
            <li>Guests must comply with local laws and regulations.</li>
            <li>
              Specific rules related to home stays in the area are outlined in
              our house rules.
            </li>
          </ul>
        </li>

        <li>
          <h2>Changes to Terms:</h2>
          <ul>
            <li>We reserve the right to update these terms.</li>
            <li>
              Any changes will be communicated to users, and continued use of
              our platform constitutes acceptance of the modified terms.
            </li>
          </ul>
        </li>

        <li>
          <h2>Feedback and Reviews:</h2>
          <ul>
            <li>Guests are encouraged to leave reviews.</li>
            <li>Please follow our guidelines for constructive feedback.</li>
            <li>
              Disputes or concerns can be addressed through our customer
              support.
            </li>
          </ul>
        </li>

        <li>
          <h2>Dispute Resolution:</h2>
          <ul>
            <li>In the event of disputes, we encourage open communication.</li>
            <li>
              If resolution cannot be reached, we may initiate arbitration or
              mediation.
            </li>
          </ul>
        </li>
      </ol>

      <p>
        By using our platform, you agree to these terms and conditions. Please
        read them carefully before making a reservation. If you have any
        questions, contact our customer support.
      </p>
    </StyledTerms>
  );
};

export default Terms;
