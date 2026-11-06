import { Link } from 'react-router-dom';
import LegalPageLayout from '../components/layout/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="November 6, 2026">
      <section>
        <h2>1. Overview</h2>
        <p>
          Gold Tracker (“the Service”) is a personal gold portfolio tool. You sign in with Google,
          record purchases and sales, and view portfolio values against a live INR gold price. This
          Privacy Policy explains what information the Service collects, how it is used, and the
          choices you have.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <p>When you continue with Google, the Service receives and stores:</p>
        <ul>
          <li>Your Google account ID</li>
          <li>Your verified email address</li>
          <li>Your name (first and last name derived from your Google profile name)</li>
          <li>Your Google profile avatar URL, when available</li>
        </ul>
        <p>
          When you use the portfolio features, the Service stores the data you enter, including:
        </p>
        <ul>
          <li>Purchase date, gold weight in milligrams, and amount invested</li>
          <li>Sale status and selling amount for holdings you mark as sold</li>
          <li>Custom selling prices and the dates you save them</li>
        </ul>
        <p>
          The Service also sets an httpOnly authentication cookie named <code>authToken</code> that
          contains a signed JWT identifying your account. The cookie lasts one day and is used to
          keep you signed in across page refreshes.
        </p>
      </section>

      <section>
        <h2>3. How we use your information</h2>
        <p>Your information is used only to:</p>
        <ul>
          <li>Create and restore your signed-in session</li>
          <li>Show your name, email, and avatar in the app sidebar</li>
          <li>Store and display your investment history, totals, and profit or loss</li>
          <li>
            Calculate current portfolio values using a live XAU/INR gold quote converted to INR per
            milligram
          </li>
          <li>
            Optionally generate a selling-price performance chart configuration with Google Gemini
            when you request the AI chart view
          </li>
        </ul>
        <p>The Service does not sell your personal information or use it for advertising.</p>
      </section>

      <section>
        <h2>4. Third-party services</h2>
        <p>The Service relies on the following external services:</p>
        <ul>
          <li>
            <strong className="font-medium text-slate-200">Google Sign-In</strong> — verifies your
            Google ID token so you can create or access an account
          </li>
          <li>
            <strong className="font-medium text-slate-200">MongoDB</strong> — stores your account
            and portfolio records
          </li>
          <li>
            <strong className="font-medium text-slate-200">Gold price API (gold-api.com)</strong> —
            supplies the live XAU/INR quote used for valuations; no personal data is sent with this
            request
          </li>
          <li>
            <strong className="font-medium text-slate-200">Google Gemini</strong> — when you use the
            AI selling-price chart, only your custom selling-price dates and values are sent to
            generate a chart configuration; your name, email, and Google ID are not included
          </li>
        </ul>
        <p>
          Those providers process data under their own privacy policies. Google’s Sign-In and Gemini
          services are governed by Google’s policies.
        </p>
      </section>

      <section>
        <h2>5. Cookies and local session data</h2>
        <p>
          Authentication uses the <code>authToken</code> httpOnly cookie described above. The
          frontend may also keep short-lived session state in memory (for example, whether you are
          signed in and whether the custom selling-price override is enabled) while the app is open.
          Clearing the cookie by logging out ends the server session for that browser.
        </p>
      </section>

      <section>
        <h2>6. Data access and retention</h2>
        <p>
          Investment and custom selling-price records are scoped to your user account and are only
          available through authenticated API routes. Data remains stored until you request deletion
          or the Service is discontinued. To ask about access to or deletion of your account data,
          contact <a href="mailto:kaushikverma321@gmail.com">kaushikverma321@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          The Service uses Google token verification, an httpOnly JWT cookie, and CORS limited to
          the configured frontend origin. No method of transmission or storage is completely secure,
          and you should protect access to your Google account.
        </p>
      </section>

      <section>
        <h2>8. Children’s privacy</h2>
        <p>
          Gold Tracker is not directed at children under 13, and the Service does not knowingly
          collect personal information from children under 13.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          This Privacy Policy may be updated when the Service’s data practices change. The “Last
          updated” date at the top of this page will be revised when that happens. Continued use of
          the Service after an update means you accept the revised policy.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions about this Privacy Policy can be sent to{' '}
          <a href="mailto:kaushikverma321@gmail.com">kaushikverma321@gmail.com</a>. Related terms of
          use are in the <Link to="/terms">Terms &amp; Conditions</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
