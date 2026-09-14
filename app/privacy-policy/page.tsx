import SiteNav from '../../components/SiteNav';
import Footer from '../../components/Footer';

const BODY = { color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.75, marginBottom: '16px' };
const H2 = { fontSize: '20px', fontWeight: 700, marginTop: '40px', marginBottom: '12px', color: '#fff' };

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      <SiteNav />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px 80px', flex: 1 }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
          Last updated: 14 September 2026
        </p>

        <p style={BODY}>
          yourpeople.football (&quot;we&quot;, &quot;us&quot;, &quot;the site&quot;) is operated by Richard Manville,
          trading as yourpeople.football. This policy explains what data we collect, why, and how it&apos;s handled.
        </p>

        <h2 style={H2}>What we collect</h2>
        <p style={BODY}>
          <strong style={{ color: '#fff' }}>Contact enquiries</strong> — if you email us, we receive whatever you
          include in that email (name, email address, message content). This goes directly to our inbox; we don&apos;t
          run a contact form that stores data separately.
        </p>
        <p style={BODY}>
          <strong style={{ color: '#fff' }}>Fan group / sports bar submissions</strong> — details you voluntarily
          submit via our &quot;Add your group&quot; or similar public forms (e.g. group name, club, location, links),
          which are reviewed before publishing.
        </p>
        <p style={BODY}>
          <strong style={{ color: '#fff' }}>Usage data</strong> — standard technical data collected automatically by
          our hosting and analytics providers (e.g. pages visited, browser type, approximate location from IP), used
          to understand how the site is used and to keep it running reliably.
        </p>
        <p style={BODY}>
          <strong style={{ color: '#fff' }}>Cookies</strong> — see the Cookies section below.
        </p>
        <p style={BODY}>
          We do not require account registration, and we do not collect passwords or payment details.
        </p>

        <h2 style={H2}>Third parties we use</h2>
        <p style={BODY}>
          <strong style={{ color: '#fff' }}>Supabase</strong> — database hosting for site content and submissions.
          <br />
          <strong style={{ color: '#fff' }}>Vercel</strong> — website hosting and analytics.
          <br />
          <strong style={{ color: '#fff' }}>Mapbox</strong> — powers the interactive club map; loading a map may
          involve Mapbox receiving your approximate location and browser data under its own privacy policy.
          <br />
          <strong style={{ color: '#fff' }}>Awin, Impact.com, CJ Affiliate</strong> — affiliate networks that track
          clicks on affiliate banners/links via cookies, so purchases can be attributed correctly. See our{' '}
          <a href="/terms#affiliate-disclosure" style={{ color: '#EF4444' }}>Affiliate Disclosure</a>.
        </p>

        <h2 style={H2}>Cookies</h2>
        <p style={BODY}>
          We use a small number of cookies: essential cookies to run the site, affiliate tracking cookies (set when
          you click an affiliate banner, typically lasting up to 30 days), and map cookies set by Mapbox when a map
          loads. We don&apos;t run third-party advertising or cross-site tracking cookies beyond affiliate
          attribution.
        </p>

        <h2 style={H2}>Your rights (UK GDPR)</h2>
        <p style={BODY}>
          You can ask us to access, correct, or delete personal data we hold about you, or ask us to stop processing
          it. Email <a href="mailto:yourpeople.football@gmail.com" style={{ color: '#EF4444' }}>yourpeople.football@gmail.com</a>.
          You also have the right to complain to the UK Information Commissioner&apos;s Office (ico.org.uk).
        </p>

        <h2 style={H2}>Changes</h2>
        <p style={BODY}>
          We may update this policy occasionally; the date above reflects the latest version.
        </p>
      </div>
      <Footer stat="Privacy Policy" />
    </main>
  );
}