import { Link } from 'react-router-dom';
import LegalPageLayout from '../components/layout/LegalPageLayout';

export default function TermsAndConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="November 6, 2026">
      <section>
        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing or using Gold Tracker (“the Service”), you agree to these Terms &amp;
          Conditions. If you do not agree, do not use the Service. The Service is a personal gold
          portfolio tracker operated as a software project; continued use after updates to these
          terms constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>2. Description of the Service</h2>
        <p>Gold Tracker lets signed-in users:</p>
        <ul>
          <li>
            Sign in with Google on a single authentication flow (sign-in and sign-up are the same)
          </li>
          <li>Record gold purchases with a date, weight in milligrams, and amount invested</li>
          <li>Mark a holding as sold at a selling price</li>
          <li>View invested amount, weight, current value, and profit or loss on the dashboard</li>
          <li>Chart cumulative invested value against current value over time</li>
          <li>
            Save a custom selling price, optionally use it for valuations, and view selling-price
            history charts (including an optional AI-assisted chart configuration)
          </li>
        </ul>
        <p>
          Portfolio values use a live XAU/INR gold quote converted to INR per milligram, with fixed
          premium, GST, and sell-spread adjustments applied by the Service. Those figures are
          estimates for personal tracking only.
        </p>
      </section>

      <section>
        <h2>3. Accounts and eligibility</h2>
        <p>
          You must sign in with a Google account that has a verified email address. You are
          responsible for activity under your account and for keeping access to your Google account
          secure. You may end your session at any time with Logout, which clears the authentication
          cookie.
        </p>
      </section>

      <section>
        <h2>4. Your content and data</h2>
        <p>
          You retain ownership of the investment and selling-price data you enter. You grant the
          Service permission to store and process that data solely to provide the features described
          above. You agree not to submit inaccurate entries for the purpose of misleading others,
          and not to attempt to access another user’s portfolio data.
        </p>
        <p>
          How personal information is handled is described in the{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>5. Not financial advice</h2>
        <p>
          Gold Tracker is a tracking and visualization tool. It does not provide investment advice,
          brokerage services, tax advice, or a recommendation to buy or sell gold. Live prices,
          custom selling prices, profit and loss figures, and AI-generated chart configurations are
          informational only. Decisions you make based on the Service are solely your
          responsibility.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Attempt to bypass authentication or access another user’s data</li>
          <li>Interfere with or disrupt the API, database, or frontend</li>
          <li>Use the Service for unlawful purposes</li>
          <li>Misrepresent the Service as a licensed financial product or exchange</li>
        </ul>
      </section>

      <section>
        <h2>7. Third-party services</h2>
        <p>
          Sign-in depends on Google Identity Services. Valuations depend on a third-party gold price
          feed. The optional AI selling-price chart depends on Google Gemini. Availability,
          accuracy, and outages of those providers are outside the Service’s control. Your use of
          Google features is also subject to Google’s terms.
        </p>
      </section>

      <section>
        <h2>8. Availability and changes</h2>
        <p>
          The Service is provided as-is and may be modified, suspended, or discontinued at any time
          without notice. Features such as live pricing or AI chart generation may be unavailable
          when upstream APIs fail or are not configured.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer of warranties</h2>
        <p>
          To the fullest extent permitted by law, the Service is provided without warranties of any
          kind, express or implied, including merchantability, fitness for a particular purpose, and
          non-infringement. The Service does not warrant that gold prices, portfolio calculations,
          or charts will be uninterrupted, error-free, or suitable for trading decisions.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the operator of Gold Tracker is not liable for any
          indirect, incidental, special, consequential, or exemplary damages, or for any loss of
          profits, data, or portfolio value arising from your use of or inability to use the
          Service, including reliance on displayed prices or profit and loss figures.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these Terms &amp; Conditions can be sent to{' '}
          <a href="mailto:kaushikverma321@gmail.com">kaushikverma321@gmail.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
