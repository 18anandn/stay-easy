import styled from 'styled-components';
import { useTitle } from '../hooks/useTitle';

const StyledPrivacy = styled.div`
  padding: 2rem 8%;

  h1 {
    margin-bottom: 1rem;
  }

  h2 {
    margin: 1.5rem 0 0.5rem 0;
  }

  ol {
    /* list-style-position: inside; */

    /* li {
      display: flex;
      flex-direction: column;
    } */
    li {
      margin-bottom: 1rem;
    }
  }
`;

const Privacy: React.FC = () => {

  useTitle('StayEasy | Privacy');

  return (
    <StyledPrivacy>
      <h1>Privacy Policy</h1>

      <p>Last updated: 7, Dec 2023</p>

      <p>
        Thank you for choosing StayEasy for your vacation accommodation needs.
        Your privacy is important to us, and we are committed to protecting the
        personal information that you share with us. This Privacy Policy
        outlines how we collect, use, disclose, and protect your information
        when you use our website.
      </p>

      <p>
        By using StayEasy, you agree to the terms outlined in this Privacy
        Policy.
      </p>

      <h2>Information We Collect</h2>

      <ol>
        <li>
          <h3>Personal Information:</h3>
          <p>
            When you create an account, make a reservation, or communicate with
            us, we may collect personal information such as your name, contact
            details, and payment information.
          </p>
        </li>
        <li>
          <h3>Booking Information:</h3>
          <p>
            We collect information related to your bookings, including dates of
            stay, accommodation preferences, and special requests.
          </p>
        </li>
        <li>
          <h3>Device and Usage Information:</h3>
          <p>
            We may collect information about the device you use to access our
            website, as well as information about your usage patterns.
          </p>
        </li>
      </ol>

      <h2>How We Use Your Information</h2>

      <ol>
        <li>
          <h3>Providing Services:</h3>
          <p>
            We use your information to facilitate and manage your bookings,
            provide customer support, and enhance your overall experience with
            our website.
          </p>
        </li>
        <li>
          <h3>Communication:</h3>
          <p>
            We may use your contact information to send you important updates,
            promotional offers, and newsletters. You can opt-out of promotional
            emails at any time.
          </p>
        </li>
        <li>
          <h3>Improving Our Services:</h3>
          <p>
            We analyze data to improve our website, services, and user
            experience.
          </p>
        </li>
      </ol>

      <h2>Information Sharing and Disclosure</h2>

      <ol>
        <li>
          <h3>Service Providers:</h3>
          <p>
            We may share your information with third-party service providers who
            help us operate our website and deliver services.
          </p>
        </li>
        <li>
          <h3>Legal Compliance:</h3>
          <p>
            We may disclose your information if required by law or in response
            to a legal request.
          </p>
        </li>
      </ol>

      <h2>Data Security</h2>

      <ol>
        <li>
          <h3>Security Measures:</h3>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, disclosure, alteration, and destruction.
          </p>
        </li>
        <li>
          <h3>Payment Information:</h3>
          <p>
            We use secure payment processing services, and we do not store your
            payment information on our servers.
          </p>
        </li>
      </ol>

      <h2>Your Choices</h2>

      <ol>
        <li>
          <h3>Account Information:</h3>
          <p>
            You can review and update your account information by logging into
            your account.
          </p>
        </li>
        <li>
          <h3>Opt-out:</h3>
          <p>
            You can opt-out of receiving promotional communications from us.
          </p>
        </li>
      </ol>

      <h2>Changes to this Privacy Policy</h2>

      <p>
        We may update this Privacy Policy to reflect changes in our practices.
        We encourage you to review this page periodically.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have any questions about this Privacy Policy, please contact us
        at <a href="18anandn@gmail.com">18anandn@gmail.com</a>.
      </p>

      <p>Thank you for trusting YStayEasy with your accommodation needs.</p>
    </StyledPrivacy>
  );
};

export default Privacy;
