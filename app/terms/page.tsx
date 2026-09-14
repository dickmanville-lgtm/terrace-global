import SiteNav from '../../components/SiteNav';
import Footer from '../../components/Footer';

const BODY = { color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.75, marginBottom: '16px' };
const H2 = { fontSize: '20px', fontWeight: 700, marginTop: '40px', marginBottom: '12px', color: '#fff' };

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      <SiteNav />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px 80px', flex: 1 }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
          Last updated: 14 September 2026
        </p>

        <p style={BODY}>By using yourpeople.football, you agree to these terms.</p>

        <h2 style={H2}>About the site</h2>
        <p style={BODY}>
          yourpeople.football is run by Richard Manville, trading as yourpeople.football, as an informational
          resource for football fans — covering fan groups, grounds and clubs, and sports bars worldwide. Content is
          curated by us; there is no user account system.
        </p>

        <h2 style={H2}>Acceptable use</h2>
        <p style={BODY}>
          You agree not to misuse the site — including attempting to disrupt its operation, scrape it at scale
          without permission, or submit false, misleading, or offensive content via our submission forms.
        </p>

        <h2 style={H2}>Submitted content</h2>
        <p style={BODY}>
          If you submit information (e.g. a fan group or sports bar), you confirm it&apos;s accurate to the best of
          your knowledge and that you have the right to share it. We review submissions before publishing and may
          edit, decline, or remove any submission at our discretion.
        </p>

        <h2 style={H2}>Third-party links and information</h2>
        <p style={BODY}>
          The site links to third-party websites, businesses, and organisations. We do our best to keep this
          information accurate, but we don&apos;t control these third parties and can&apos;t guarantee their
          accuracy, availability, or conduct. Use of any linked site is at your own risk.
        </p>

        <h2 id="affiliate-disclosure" style={H2}>Affiliate Disclosure</h2>
        <p style={BODY}>
          yourpeople.football participates in affiliate programmes, including via Awin, Impact.com, and CJ
          Affiliate. This means some links and banners on this site are affiliate links. If you click one and go on
          to make a purchase, we may earn a small commission — at no extra cost to you. We only link to products and
          services relevant to football fans, and our recommendations aren&apos;t influenced by commission rates.
        </p>

        <h2 style={H2}>Intellectual property</h2>
        <p style={BODY}>
          Site design, original text, and compiled data are owned by us unless otherwise credited. Club names,
          badges, and trademarks referenced belong to their respective owners and are used for identification
          purposes only.
        </p>

        <h2 style={H2}>Limitation of liability</h2>
        <p style={BODY}>
          The site is provided &quot;as is.&quot; We aren&apos;t liable for losses arising from your use of the
          site, reliance on its content, or your dealings with any linked third party, to the fullest extent
          permitted by law.
        </p>

        <h2 style={H2}>Governing law</h2>
        <p style={BODY}>These terms are governed by the laws of England and Wales.</p>

        <h2 style={H2}>Contact</h2>
        <p style={BODY}>
          <a href="mailto:yourpeople.football@gmail.com" style={{ color: '#EF4444' }}>yourpeople.football@gmail.com</a>
        </p>
      </div>
      <Footer stat="Terms of Service" />
    </main>
  );
}