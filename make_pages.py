#!/usr/bin/env python3
"""Generate the remaining DWJBA pages."""

HEADER = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Detroit-Wayne Joint Building Authority</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="style.css">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
<script src="main.js" defer></script>
{extra_head}
</head>
<body>

<!-- ALERT BAR -->
<div class="alert-bar" id="alertBar">
  <div class="alert-bar-inner">
    <div class="alert-bar-dot"></div>
    <span class="alert-bar-text"><strong>Notice:</strong> DWJBA Board of Commissioners Meeting — April 24, 2026 at 10:00 AM, 13th Floor Auditorium. Open to the public.</span>
    <button class="alert-bar-close" onclick="document.getElementById(\'alertBar\').style.display=\'none\'" aria-label="Close">&times;</button>
  </div>
</div>

<!-- HEADER -->
<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="index.html" class="site-logo" aria-label="DWJBA Home">
      <svg class="site-logo-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="23" fill="#2a1a0e" stroke="#b08858" stroke-width="1.5"/>
        <circle cx="24" cy="24" r="18" fill="none" stroke="#b08858" stroke-width="0.6" stroke-dasharray="2.5 2"/>
        <path d="M24 9l2.8 8.5h9l-7.3 5.3 2.8 8.5L24 26l-7.3 5.3 2.8-8.5-7.3-5.3h9z" fill="#b08858"/>
        <rect x="12" y="31" width="24" height="8" rx="1" fill="none" stroke="#b08858" stroke-width="0.7"/>
        <line x1="12" y1="34.5" x2="36" y2="34.5" stroke="#b08858" stroke-width="0.5"/>
        <text x="24" y="38.5" text-anchor="middle" fill="#b08858" font-size="3.5" font-family="serif" letter-spacing="0.5">DWJBA</text>
      </svg>
      <div class="site-logo-text">
        <span class="site-logo-name">Detroit-Wayne</span>
        <span class="site-logo-sub">Joint Building Authority</span>
      </div>
    </a>
    <nav class="primary-nav" aria-label="Main">
      <div class="nav-item has-dropdown">
        <button class="nav-trigger">About <svg data-lucide="chevron-down" class="nav-caret"></svg></button>
        <div class="nav-dropdown">
          <a href="about.html" class="nav-dropdown-item"><svg data-lucide="landmark"></svg>Overview &amp; Mission</a>
          <a href="about.html#leadership" class="nav-dropdown-item"><svg data-lucide="users"></svg>Leadership</a>
          <a href="about.html#governance" class="nav-dropdown-item"><svg data-lucide="shield"></svg>Governance</a>
          <a href="about.html#services" class="nav-dropdown-item"><svg data-lucide="settings"></svg>Services &amp; Operations</a>
        </div>
      </div>
      <div class="nav-item has-dropdown">
        <button class="nav-trigger">CAYMC <svg data-lucide="chevron-down" class="nav-caret"></svg></button>
        <div class="nav-dropdown">
          <a href="directory.html" class="nav-dropdown-item"><svg data-lucide="building-2"></svg>Department Directory</a>
          <a href="contact.html#visitor" class="nav-dropdown-item"><svg data-lucide="map-pin"></svg>Visitor Information</a>
          <a href="spirit.html" class="nav-dropdown-item"><svg data-lucide="star"></svg>Spirit of Detroit</a>
        </div>
      </div>
      <a href="procurement.html" class="nav-link">Procurement</a>
      <a href="capital-projects.html" class="nav-link">Projects</a>
      <a href="contact.html" class="nav-link">Contact</a>
    </nav>
    <div class="header-actions">
      <a href="ai-demo.html" class="header-ai-btn">
        <div class="header-ai-btn-dot"></div>
        <svg data-lucide="bot"></svg>
        Ask CAYMC
      </a>
      <button class="menu-btn" id="menuBtn" aria-label="Open menu"><svg data-lucide="menu"></svg></button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav-head">
    <strong>Menu</strong>
    <button class="mobile-nav-close" id="mobileNavClose"><svg data-lucide="x"></svg></button>
  </div>
  <div class="mobile-nav-body">
    <a href="about.html" class="mobile-nav-link">About DWJBA <svg data-lucide="chevron-right"></svg></a>
    <a href="about.html#leadership" class="mobile-nav-link">Leadership <svg data-lucide="chevron-right"></svg></a>
    <a href="directory.html" class="mobile-nav-link">Department Directory <svg data-lucide="chevron-right"></svg></a>
    <a href="spirit.html" class="mobile-nav-link">Spirit of Detroit <svg data-lucide="chevron-right"></svg></a>
    <div class="mobile-nav-divider"></div>
    <a href="procurement.html" class="mobile-nav-link">Procurement <svg data-lucide="chevron-right"></svg></a>
    <a href="capital-projects.html" class="mobile-nav-link">Capital Projects <svg data-lucide="chevron-right"></svg></a>
    <a href="contact.html" class="mobile-nav-link">Contact <svg data-lucide="chevron-right"></svg></a>
  </div>
  <a href="ai-demo.html" class="mobile-nav-cta">Ask CAYMC AI Assistant</a>
</div>
<div class="scrim" id="scrim"></div>
'''

FOOTER = '''
<!-- FOOTER -->
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand-col">
        <div class="footer-logo-row">
          <svg viewBox="0 0 40 40" fill="none" width="36" height="36" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="#3d2512" stroke="#b08858" stroke-width="1"/>
            <path d="M20 7l2.3 7h7.5l-6.1 4.4 2.3 7L20 21l-6 4.4 2.3-7-6.1-4.4h7.5z" fill="#b08858"/>
          </svg>
          <span class="footer-logo-name">Detroit-Wayne Joint Building Authority</span>
        </div>
        <p class="footer-brand-desc">Responsible Stewardship. Trusted Leadership. Serving the people of Detroit and Wayne County since 1948.</p>
        <p class="footer-brand-addr">2 Woodward Ave, Suite 1314<br>Detroit, Michigan 48226<br>313-309-2300</p>
      </div>
      <div class="footer-nav-col">
        <h4>About</h4>
        <a href="about.html">Mission &amp; Overview</a>
        <a href="about.html#leadership">Leadership</a>
        <a href="about.html#governance">Governance</a>
        <a href="about.html#services">Services</a>
      </div>
      <div class="footer-nav-col">
        <h4>CAYMC</h4>
        <a href="directory.html">Department Directory</a>
        <a href="spirit.html">Spirit of Detroit</a>
        <a href="contact.html#visitor">Visitor Information</a>
        <a href="capital-projects.html">Capital Projects</a>
      </div>
      <div class="footer-nav-col">
        <h4>Procurement</h4>
        <a href="procurement.html">How to Do Business</a>
        <a href="procurement.html#bids">Bid Opportunities</a>
        <a href="procurement.html#vendors">Vendor Resources</a>
        <a href="#">BidNet / MITN</a>
      </div>
      <div class="footer-nav-col">
        <h4>Connect</h4>
        <a href="contact.html">Contact Us</a>
        <a href="ai-demo.html">Ask CAYMC AI</a>
        <a href="#">Document Center</a>
        <a href="#">Accessibility</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Detroit-Wayne Joint Building Authority. All rights reserved.</span>
      <div class="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Accessibility</a>
        <a href="#">Terms of Use</a>
      </div>
    </div>
  </div>
</footer>
</body>
</html>
'''

# ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
about = HEADER.format(
    title="About",
    desc="Learn about the Detroit-Wayne Joint Building Authority — our mission, leadership, governance, and services.",
    extra_head=""
) + '''
<section class="page-hero">
  <div class="page-hero-bg-pattern" aria-hidden="true"></div>
  <div class="page-hero-accent" aria-hidden="true"></div>
  <div class="wrap">
    <div class="breadcrumb"><a href="index.html">Home</a><svg data-lucide="chevron-right"></svg><span>About</span></div>
    <div class="eyebrow eyebrow-light">Detroit-Wayne Joint Building Authority</div>
    <h1>About the Authority</h1>
    <p class="page-hero-sub">Established in 1948 by the Michigan Legislature, DWJBA is the intergovernmental authority that owns, manages, and stewards the Coleman A. Young Municipal Center and its surrounding civic assets.</p>
  </div>
</section>

<section class="section bg-white">
  <div class="wrap">
    <div class="overview-grid">
      <div class="overview-text reveal">
        <div class="eyebrow">Our Story</div>
        <h2 class="section-title">Who We Are</h2>
        <p class="section-body">The Detroit-Wayne Joint Building Authority is an intergovernmental entity created by the Michigan Legislature in 1948 to jointly serve the City of Detroit and the County of Wayne. We own and operate the Coleman A. Young Municipal Center — one of the most significant civic buildings in Michigan.</p>
        <p class="section-body">The Municipal Center serves as the operational headquarters for the executive and legislative branches of Detroit city government, the Wayne County Third Judicial Circuit and Probate Courts, and the Clerks for both jurisdictions. Every day, thousands of residents, employees, and visitors pass through our doors to access essential government services.</p>
        <p class="section-body">Our mission is grounded in a simple but profound responsibility: to maintain a safe, secure, and efficiently operated environment where elected officials, tenants, employees, and the public can do the critical work of government. We do this with a deep commitment to transparency, operational excellence, and respect for the communities we serve.</p>
        <p class="section-body">In 2026, the Authority entered a new chapter under the leadership of CEO Clarinda Barnett-Harrison — the first woman to hold this position in DWJBA's 78-year history — whose appointment signals a bold, forward-looking vision for the building's next era.</p>
        <a href="contact.html" class="btn btn-primary" style="margin-top:1rem;">Contact the Authority</a>
      </div>
      <aside class="overview-sidebar reveal reveal-delay-2">
        <div class="sidebar-header">Key Facts</div>
        <div class="sidebar-fact"><svg data-lucide="calendar" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Established</span><span class="sidebar-fact-val">1948 — Michigan Legislature</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="building-2" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Primary Facility</span><span class="sidebar-fact-val">Coleman A. Young Municipal Center</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="maximize-2" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Total Square Footage</span><span class="sidebar-fact-val">780,000 sq ft</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="layers" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Floors</span><span class="sidebar-fact-val">20 (Courts Tower) + 14 (Admin Tower)</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="shield-check" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Certifications</span><span class="sidebar-fact-val">3× Energy Star · BOMA TOBY Award</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="map-pin" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Address</span><span class="sidebar-fact-val">2 Woodward Ave, Detroit, MI 48226</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="phone" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Main Phone</span><span class="sidebar-fact-val">313-309-2300</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="users" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Managed By</span><span class="sidebar-fact-val">Hines (since 2005)</span></div></div>
      </aside>
    </div>
  </div>
</section>

<section class="section bg-cream" id="leadership">
  <div class="wrap">
    <div class="reveal" style="max-width:640px;margin-bottom:3rem;">
      <div class="eyebrow">The People Behind the Building</div>
      <h2 class="section-title">Leadership</h2>
      <p class="section-body">The Authority is guided by a Board of Commissioners and led by an executive team committed to operational excellence, community service, and responsible stewardship of one of Detroit's most important civic institutions.</p>
    </div>
    <div class="leadership-grid">
      <div class="leader-card reveal">
        <div class="leader-initial">CB</div>
        <div class="leader-name">Clarinda Barnett-Harrison</div>
        <div class="leader-title">Chief Executive Officer</div>
        <p class="leader-bio">The first woman to serve as CEO of the Detroit-Wayne Joint Building Authority, Barnett-Harrison is a Detroit native with more than 21 years of experience in urban planning, design, and economic development. She calls CAYMC "the civic heart of our region" and is leading its capital transformation with rigor and operational excellence.</p>
      </div>
      <div class="leader-card reveal reveal-delay-1">
        <div class="leader-initial">SM</div>
        <div class="leader-name">Sharon Madison</div>
        <div class="leader-title">Board Chair, Commissioner</div>
        <p class="leader-bio">Chair of the DWJBA Board of Commissioners and founder of Madison Madison International — the first program management firm headquartered in Detroit. Under her leadership, the firm has overseen more than $5 billion in major design and construction programs across the US and internationally. She brings strategic vision and deep community roots to the Authority.</p>
      </div>
      <div class="leader-card reveal reveal-delay-2">
        <div class="leader-initial">PC</div>
        <div class="leader-name">Patricia Cole</div>
        <div class="leader-title">Commissioner Emeritus</div>
        <p class="leader-bio">Commissioner Cole served on the DWJBA Board for 25 years, providing steady leadership and fiscal oversight while guiding key operational improvements to the Municipal Center. She championed policies that strengthened the Detroit-Wayne County partnership and is the founder of the Women's Informal Network (WIN) and the Women's Veteran's Resource Center.</p>
      </div>
    </div>
  </div>
</section>

<section class="section bg-white" id="governance">
  <div class="wrap">
    <div class="overview-grid">
      <div class="overview-text reveal">
        <div class="eyebrow">Structure & Oversight</div>
        <h2 class="section-title">Governance</h2>
        <p class="section-body">The Detroit-Wayne Joint Building Authority was created by Act of the Michigan Legislature as an intergovernmental body with joint oversight from the City of Detroit and Wayne County. This bi-jurisdictional structure reflects the shared civic purpose of the Coleman A. Young Municipal Center — a building that serves both governments under one roof.</p>
        <p class="section-body">The Authority is governed by a Board of Commissioners appointed jointly by the City and County. The Board provides policy direction and financial oversight, while the executive team manages day-to-day operations, capital programs, and tenant relationships.</p>
        <p class="section-body">All Board meetings are open to the public in accordance with Michigan's Open Meetings Act. Meeting agendas, minutes, and relevant documents are made available to the public, reflecting the Authority's commitment to transparency and accountability.</p>
        <p class="section-body">Property management services are provided by Hines, one of the world's most respected real estate firms, engaged by DWJBA since 2005. Together, the Authority and Hines have driven significant operational improvements — including a 50% reduction in utility costs and three consecutive Energy Star designations.</p>
      </div>
      <aside class="overview-sidebar reveal reveal-delay-2">
        <div class="sidebar-header">Governance Structure</div>
        <div class="sidebar-fact"><svg data-lucide="landmark" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Created By</span><span class="sidebar-fact-val">Michigan Legislature (1948)</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="users" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Board</span><span class="sidebar-fact-val">Board of Commissioners</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="git-merge" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Jurisdiction</span><span class="sidebar-fact-val">City of Detroit &amp; Wayne County</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="eye" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Meetings</span><span class="sidebar-fact-val">Open to public — Open Meetings Act</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="building" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Property Manager</span><span class="sidebar-fact-val">Hines (since 2005)</span></div></div>
        <div class="sidebar-fact"><svg data-lucide="mail" class="sidebar-fact-icon"></svg><div><span class="sidebar-fact-label">Commissioners Email</span><span class="sidebar-fact-val">commissioners@dwjba.com</span></div></div>
      </aside>
    </div>
  </div>
</section>

<section class="section bg-cream" id="services">
  <div class="wrap">
    <div class="reveal" style="max-width:640px;margin-bottom:3rem;">
      <div class="eyebrow">What We Do</div>
      <h2 class="section-title">Services & Operations</h2>
    </div>
    <div class="services-grid">
      <div class="service-card reveal"><div class="service-icon"><svg data-lucide="building-2"></svg></div><h3>Facility Management</h3><p>Day-to-day management of 780,000 sq ft across two towers, ensuring operational continuity, cleanliness, maintenance, and a welcoming environment for all building occupants and visitors.</p></div>
      <div class="service-card reveal reveal-delay-1"><div class="service-icon"><svg data-lucide="hard-hat"></svg></div><h3>Capital Improvements</h3><p>Planning and executing capital improvement programs including HVAC upgrades, security modernization, elevator replacement, and the current comprehensive facility master plan.</p></div>
      <div class="service-card reveal reveal-delay-2"><div class="service-icon"><svg data-lucide="shield"></svg></div><h3>Security & Safety</h3><p>Maintaining a safe and secure environment for elected officials, tenants, employees, and the more than 5,000 daily visitors who access government services at CAYMC.</p></div>
      <div class="service-card reveal"><div class="service-icon"><svg data-lucide="file-text"></svg></div><h3>Procurement</h3><p>Managing a transparent, competitive procurement process for all building services and capital projects, with a priority on Detroit and Wayne County-based businesses and MBE/WBE participation.</p></div>
      <div class="service-card reveal reveal-delay-1"><div class="service-icon"><svg data-lucide="calendar"></svg></div><h3>Event Management</h3><p>Coordinating use of CAYMC's 553-seat auditorium and other spaces for public meetings, civic events, and official functions in accordance with our mission of public service.</p></div>
      <div class="service-card reveal reveal-delay-2"><div class="service-icon"><svg data-lucide="leaf"></svg></div><h3>Environmental Stewardship</h3><p>Operating with environmental responsibility through energy efficiency programs that have reduced utility costs by 50%, earned three Energy Star designations, and established a model for sustainable civic building management.</p></div>
    </div>
  </div>
</section>
''' + FOOTER

# ─── SPIRIT OF DETROIT PAGE ───────────────────────────────────────────────────
spirit = HEADER.format(
    title="Spirit of Detroit",
    desc="The Spirit of Detroit — Detroit's beloved 26-foot bronze sculpture by Marshall Fredericks, dedicated in 1958. Managed by the DWJBA.",
    extra_head=""
) + '''
<section class="spirit-hero">
  <img src="images/spirit-of-detroit.jpg" alt="Spirit of Detroit statue by Marshall Fredericks" class="spirit-hero-img">
  <div class="spirit-hero-gradient" aria-hidden="true"></div>
  <div class="spirit-hero-content">
    <div class="breadcrumb"><a href="index.html">Home</a><svg data-lucide="chevron-right"></svg><span>Spirit of Detroit</span></div>
    <div class="eyebrow eyebrow-light">Landmark · Cultural Icon · 1958</div>
    <h1 class="section-title section-title-light" style="font-size:var(--text-2xl);margin-bottom:var(--sp-5);">The Spirit of Detroit</h1>
    <p class="page-hero-sub" style="max-width:60ch;">Detroit's most beloved landmark — a 26-foot bronze masterwork by sculptor Marshall Fredericks, standing vigil at the Woodward Avenue entrance of the Coleman A. Young Municipal Center since 1958.</p>
    <div class="spirit-facts-band">
      <div class="spirit-fact"><span class="spirit-fact-val">26 ft</span><span class="spirit-fact-label">Height</span></div>
      <div class="spirit-fact"><span class="spirit-fact-val">1958</span><span class="spirit-fact-label">Dedicated</span></div>
      <div class="spirit-fact"><span class="spirit-fact-val">Bronze</span><span class="spirit-fact-label">Material</span></div>
      <div class="spirit-fact"><span class="spirit-fact-val">66 yrs</span><span class="spirit-fact-label">Standing</span></div>
    </div>
  </div>
</section>

<section class="section bg-white">
  <div class="wrap">
    <div class="spirit-content-grid">
      <div class="reveal">
        <div class="eyebrow">The Landmark</div>
        <h2 class="section-title">An Icon of Detroit</h2>
        <p class="section-body">The Spirit of Detroit is one of the most recognizable public sculptures in the United States — a towering bronze figure that has become synonymous with the city itself. Created by world-renowned sculptor Marshall Fredericks and dedicated on September 24, 1958, the statue stands at the Woodward Avenue entrance of the Coleman A. Young Municipal Center.</p>
        <p class="section-body">The sculpture depicts a monumental kneeling figure — a symbol of humanity — holding a golden sphere representing God in one hand and a small bronze family group in the other, symbolizing the relationships among all people. The Latin inscription from II Corinthians 3:17 — <em>"Now the Lord is that Spirit: and where the Spirit of the Lord is, there is liberty"</em> — appears on the base.</p>
        <p class="section-body">Since its dedication, the Spirit has been the backdrop for Detroit's greatest civic moments — championship celebrations, public memorials, community gatherings, and daily rituals of a city that keeps pushing forward. She gets dressed for every occasion — sporting team jerseys, holiday themes, and civic recognitions — a tradition managed by the DWJBA's Spirit of Detroit program.</p>
        <p class="section-body">Spirit Plaza, the public square surrounding the statue, was pedestrianized in 2017 from the former section of Woodward Avenue, creating an open civic gathering space that brings residents, visitors, and government together in the heart of downtown Detroit.</p>
      </div>
      <div class="reveal reveal-delay-2">
        <div class="eyebrow">About the Artist</div>
        <h2 class="section-title">Marshall Fredericks</h2>
        <p class="section-body">Marshall Fredericks (1908–1998) was one of America's most celebrated sculptors, known for his monumental public works that combine classical beauty with modern vision. Born in Rock Island, Illinois, Fredericks spent much of his career in Michigan, where his works can be found throughout the state and beyond.</p>
        <p class="section-body">His approach to sculpture was humanistic and spiritual — he believed public art should uplift and inspire, and should be accessible to everyone. The Spirit of Detroit is widely considered his masterwork — a piece that has grown to become not just public art, but civic identity.</p>
        <p class="section-body">Fredericks' other notable works include the "Freedom of the Human Spirit" at the North American headquarters of Volkswagen and sculptures at the Cleveland Museum of Natural History. The Marshall Fredericks Sculpture Museum at Saginaw Valley State University houses the largest collection of his work.</p>
        <div class="spirit-program-card" style="margin-top:2rem;">
          <h3>The Spirit of Detroit Program</h3>
          <p>The DWJBA manages the Spirit of Detroit jersey and apparel placement program. Organizations — sports teams, civic groups, community organizations — can apply to have the Spirit dressed to celebrate occasions of significance to Detroit and Wayne County.</p>
          <table class="spirit-fee-table">
            <thead><tr><th>Duration</th><th>Fee</th></tr></thead>
            <tbody>
              <tr><td>1 day</td><td>Contact DWJBA</td></tr>
              <tr><td>Multi-day event</td><td>Contact DWJBA</td></tr>
              <tr><td>Civic / nonprofit</td><td>Considered case by case</td></tr>
            </tbody>
          </table>
          <p style="margin-top:1rem;">All requests are subject to DWJBA review and approval. Contact <strong>313-309-2300</strong> or <strong>info@dwjba.com</strong> to begin the application process.</p>
          <a href="contact.html" class="btn btn-gold" style="margin-top:1.5rem;">Request Jersey Placement</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section-sm bg-brown">
  <div class="wrap" style="text-align:center;">
    <div class="eyebrow eyebrow-light">Visit Us</div>
    <h2 class="section-title section-title-light">Experience the Spirit in Person</h2>
    <p style="color:var(--tan-200);margin:1rem auto 2rem;max-width:56ch;">The Spirit of Detroit and Spirit Plaza are open to the public year-round. Located at 2 Woodward Avenue, Detroit — the Woodward Avenue entrance of the Coleman A. Young Municipal Center.</p>
    <a href="contact.html#visitor" class="btn btn-gold btn-lg">Visitor Information</a>
  </div>
</section>
''' + FOOTER

# ─── DIRECTORY PAGE ────────────────────────────────────────────────────────────
directory = HEADER.format(
    title="Department Directory",
    desc="Find any department, office, or service in the Coleman A. Young Municipal Center. Searchable directory for all 20 floors.",
    extra_head=""
) + '''
<section class="page-hero">
  <div class="page-hero-bg-pattern" aria-hidden="true"></div>
  <div class="page-hero-accent" aria-hidden="true"></div>
  <div class="wrap">
    <div class="breadcrumb"><a href="index.html">Home</a><svg data-lucide="chevron-right"></svg><a href="#">CAYMC</a><svg data-lucide="chevron-right"></svg><span>Department Directory</span></div>
    <div class="eyebrow eyebrow-light">Coleman A. Young Municipal Center</div>
    <h1>Department Directory</h1>
    <p class="page-hero-sub">Search for any office, department, or service across all 20 floors of the Coleman A. Young Municipal Center. Or try the <a href="ai-demo.html" style="color:var(--tan-200);text-decoration:underline;text-underline-offset:3px;">AI Floor Navigator</a> for guided assistance.</p>
  </div>
</section>

<section class="section bg-white">
  <div class="wrap">
    <div class="dir-search-bar">
      <svg data-lucide="search"></svg>
      <input type="text" id="dirSearch" class="dir-search-input" placeholder="Search departments, offices, services..." autocomplete="off">
    </div>
    <div class="dir-filter-tabs">
      <button class="dir-tab active" data-cat="all">All Departments</button>
      <button class="dir-tab" data-cat="city">City of Detroit</button>
      <button class="dir-tab" data-cat="county">Wayne County</button>
      <button class="dir-tab" data-cat="courts">Courts</button>
      <button class="dir-tab" data-cat="authority">Authority & Management</button>
    </div>

    <div class="dir-section" data-cat="authority">
      <div class="dir-section-title">Ground Level & Building Services</div>
      <div class="dir-grid">
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">L1</div><div><div class="dir-card-name">Main Lobby & Reception</div><div class="dir-card-floor-label">Floor 1 — Both Towers</div><div class="dir-card-contact">Building entry · Security screening<br>Hours: Mon–Fri 7:00 AM – 6:00 PM</div></div></div>
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">L1</div><div><div class="dir-card-name">Building Security</div><div class="dir-card-floor-label">Floor 1 — Main Lobby</div><div class="dir-card-contact">Non-emergency: 313-224-3015<br>Hours: All building hours</div></div></div>
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">L1</div><div><div class="dir-card-name">Café / Food Services</div><div class="dir-card-floor-label">Floor 1 — Lobby Level</div><div class="dir-card-contact">Open during building hours<br>Mon–Fri</div></div></div>
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">13</div><div><div class="dir-card-name">DWJBA — Suite 1314</div><div class="dir-card-floor-label">Floor 13 — Admin Tower</div><div class="dir-card-contact">313-309-2300 · info@dwjba.com<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">13</div><div><div class="dir-card-name">City Auditorium</div><div class="dir-card-floor-label">Floor 13 — Admin Tower</div><div class="dir-card-contact">553-seat capacity · Renovated<br>Managed by DWJBA</div></div></div>
        <div class="dir-card" data-cat="authority"><div class="dir-card-floor">13</div><div><div class="dir-card-name">Property Management (Hines)</div><div class="dir-card-floor-label">Floor 13 — Admin Tower</div><div class="dir-card-contact">313-309-2314<br>Tenant services & maintenance</div></div></div>
      </div>
    </div>

    <div class="dir-section" data-cat="city">
      <div class="dir-section-title">City of Detroit — Clerk & Records</div>
      <div class="dir-grid">
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">2</div><div><div class="dir-card-name">City Clerk's Office</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">313-224-3260<br>Business licenses · Vital records · FOIA<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">2</div><div><div class="dir-card-name">Business License Division</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">New &amp; renewal business licenses<br>DBA registrations · Mon–Fri 8:00–4:30</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">2</div><div><div class="dir-card-name">Vital Records Bureau</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">Birth &amp; death certificates<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">2</div><div><div class="dir-card-name">FOIA / Public Records</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">Freedom of Information requests<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">3</div><div><div class="dir-card-name">Office of the Assessor</div><div class="dir-card-floor-label">Floor 3 — Admin Tower</div><div class="dir-card-contact">Property assessments<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">3</div><div><div class="dir-card-name">City Treasury</div><div class="dir-card-floor-label">Floor 3 — Admin Tower</div><div class="dir-card-contact">Property tax payments<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
      </div>
    </div>

    <div class="dir-section" data-cat="city">
      <div class="dir-section-title">City of Detroit — Administration</div>
      <div class="dir-grid">
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">7</div><div><div class="dir-card-name">Human Resources Department</div><div class="dir-card-floor-label">Floor 7 — Admin Tower</div><div class="dir-card-contact">313-628-0800<br>Employment · Civil service<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">7</div><div><div class="dir-card-name">Civil Service Commission</div><div class="dir-card-floor-label">Floor 7 — Admin Tower</div><div class="dir-card-contact">Exams &amp; civil service matters<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">8</div><div><div class="dir-card-name">Planning &amp; Development</div><div class="dir-card-floor-label">Floor 8 — Admin Tower</div><div class="dir-card-contact">Building permits · Zoning · Land use<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">9</div><div><div class="dir-card-name">Finance Department</div><div class="dir-card-floor-label">Floor 9 — Admin Tower</div><div class="dir-card-contact">Budget · Accounting · Controller<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">10</div><div><div class="dir-card-name">Law Department</div><div class="dir-card-floor-label">Floor 10 — Admin Tower</div><div class="dir-card-contact">Corporation Counsel<br>City legal services</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">11</div><div><div class="dir-card-name">Mayor's Office</div><div class="dir-card-floor-label">Floor 11 — Admin Tower</div><div class="dir-card-contact">313-224-3400 · By appointment<br>Executive Branch — City of Detroit</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">12</div><div><div class="dir-card-name">Budget &amp; Management</div><div class="dir-card-floor-label">Floor 12 — Admin Tower</div><div class="dir-card-contact">Internal audit · Budget management<br>Mon–Fri 8:00 AM – 5:00 PM</div></div></div>
        <div class="dir-card" data-cat="city"><div class="dir-card-floor">13</div><div><div class="dir-card-name">Detroit City Council</div><div class="dir-card-floor-label">Floor 13 — Admin Tower</div><div class="dir-card-contact">Council chambers &amp; offices<br>Public meetings: Tuesdays 10:00 AM</div></div></div>
      </div>
    </div>

    <div class="dir-section" data-cat="county">
      <div class="dir-section-title">Wayne County</div>
      <div class="dir-grid">
        <div class="dir-card" data-cat="county"><div class="dir-card-floor">2</div><div><div class="dir-card-name">Wayne County Clerk</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">Vital records · Assumed names · Notary<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="county"><div class="dir-card-floor">2</div><div><div class="dir-card-name">County Vital Records</div><div class="dir-card-floor-label">Floor 2 — Admin Tower</div><div class="dir-card-contact">Marriage licenses · County records<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="county"><div class="dir-card-floor">2</div><div><div class="dir-card-name">Notary Public Services</div><div class="dir-card-floor-label">Floor 2 — Admin Tower (County Clerk)</div><div class="dir-card-contact">Notarization of documents<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
      </div>
    </div>

    <div class="dir-section" data-cat="courts">
      <div class="dir-section-title">Courts — Third Judicial Circuit &amp; Probate</div>
      <div class="dir-grid">
        <div class="dir-card" data-cat="courts"><div class="dir-card-floor">1–8</div><div><div class="dir-card-name">Court Administrative Offices</div><div class="dir-card-floor-label">Floors 1–8 — Courts Tower</div><div class="dir-card-contact">Filing center · Clerk support<br>Court scheduling · Records</div></div></div>
        <div class="dir-card" data-cat="courts"><div class="dir-card-floor">9–19</div><div><div class="dir-card-name">Third Circuit Court — Courtrooms</div><div class="dir-card-floor-label">Floors 9–19 — Courts Tower</div><div class="dir-card-contact">313-224-5210<br>Judges' chambers · Jury rooms<br>Per hearing schedule</div></div></div>
        <div class="dir-card" data-cat="courts"><div class="dir-card-floor">9</div><div><div class="dir-card-name">Jury Assembly Room</div><div class="dir-card-floor-label">Floor 9 — Courts Tower</div><div class="dir-card-contact">Jury duty reporting<br>Arrive per jury summons instructions</div></div></div>
        <div class="dir-card" data-cat="courts"><div class="dir-card-floor">13–14</div><div><div class="dir-card-name">Wayne County Probate Court</div><div class="dir-card-floor-label">Floors 13–14 — Courts Tower</div><div class="dir-card-contact">313-224-5706<br>Wills · Estates · Guardianship · Trusts<br>Mon–Fri 8:00 AM – 4:30 PM</div></div></div>
        <div class="dir-card" data-cat="courts"><div class="dir-card-floor">20</div><div><div class="dir-card-name">Mechanical Level</div><div class="dir-card-floor-label">Floor 20 — Courts Tower</div><div class="dir-card-contact">Building mechanical systems<br>Restricted — staff only</div></div></div>
      </div>
    </div>

    <div class="reveal" style="background:var(--tan-100);border-radius:var(--r-xl);padding:2rem 2.5rem;margin-top:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;">
      <div>
        <div class="eyebrow">Can't Find What You're Looking For?</div>
        <p style="font-size:var(--text-base);color:var(--color-text-muted);margin:0;max-width:52ch;">Try our AI Floor Navigator — describe what you need in plain language and it will guide you to the right office.</p>
      </div>
      <a href="ai-demo.html" class="btn btn-primary btn-lg">Try the AI Navigator</a>
    </div>
  </div>
</section>
''' + FOOTER

# ─── CONTACT PAGE ──────────────────────────────────────────────────────────────
contact = HEADER.format(
    title="Contact & Visitor Information",
    desc="Contact the Detroit-Wayne Joint Building Authority and get visitor information for the Coleman A. Young Municipal Center.",
    extra_head=""
) + '''
<section class="page-hero">
  <div class="page-hero-bg-pattern" aria-hidden="true"></div>
  <div class="page-hero-accent" aria-hidden="true"></div>
  <div class="wrap">
    <div class="breadcrumb"><a href="index.html">Home</a><svg data-lucide="chevron-right"></svg><span>Contact</span></div>
    <div class="eyebrow eyebrow-light">We're Here to Help</div>
    <h1>Contact Us</h1>
    <p class="page-hero-sub">Whether you're a tenant, vendor, member of the public, or member of the press — our team is available Monday through Friday to assist you.</p>
  </div>
</section>

<section class="section bg-white">
  <div class="wrap">
    <div class="contact-grid">
      <div>
        <div class="eyebrow">Send a Message</div>
        <h2 class="section-title" style="margin-bottom:2rem;">Get in Touch</h2>
        <form class="contact-form" id="contactForm" novalidate>
          <div class="form-row">
            <div class="form-group"><label class="form-label" for="fname">First Name *</label><input class="form-input" type="text" id="fname" required placeholder="First name"></div>
            <div class="form-group"><label class="form-label" for="lname">Last Name *</label><input class="form-input" type="text" id="lname" required placeholder="Last name"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label" for="email">Email Address *</label><input class="form-input" type="email" id="email" required placeholder="you@example.com"></div>
            <div class="form-group"><label class="form-label" for="phone">Phone (optional)</label><input class="form-input" type="tel" id="phone" placeholder="(313) 000-0000"></div>
          </div>
          <div class="form-group"><label class="form-label" for="subject">Subject *</label>
            <select class="form-select" id="subject" required>
              <option value="">Select a subject...</option>
              <option>General Inquiry</option>
              <option>Tenant Services</option>
              <option>Procurement / Vendors</option>
              <option>Building Access & Security</option>
              <option>Capital Projects</option>
              <option>Spirit of Detroit Program</option>
              <option>Media / Press Inquiry</option>
              <option>Public Records / FOIA</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label" for="message">Message *</label><textarea class="form-textarea" id="message" required placeholder="How can we help you?"></textarea></div>
          <button type="submit" class="btn btn-primary btn-lg">Send Message <svg data-lucide="send"></svg></button>
        </form>
        <div class="form-success" id="formSuccess" style="display:none;padding:1.5rem;background:rgba(30,77,53,0.08);border:1px solid rgba(30,77,53,0.2);border-radius:var(--r-lg);margin-top:1rem;">
          <strong style="color:var(--civic-green);">Message Received</strong><br>
          <span style="font-size:var(--text-sm);color:var(--color-text-muted);">Thank you for reaching out. A member of our team will respond within 2 business days.</span>
        </div>
      </div>
      <div class="contact-sidebar">
        <div class="contact-info-card">
          <div class="contact-info-header">Contact Information</div>
          <div class="contact-info-item"><svg data-lucide="map-pin"></svg><div><strong>Main Office</strong><span>2 Woodward Ave, Suite 1314<br>Detroit, Michigan 48226</span></div></div>
          <div class="contact-info-item"><svg data-lucide="phone"></svg><div><strong>Main Phone</strong><span>313-309-2300</span></div></div>
          <div class="contact-info-item"><svg data-lucide="mail"></svg><div><strong>General Inquiries</strong><span>info@dwjba.com</span></div></div>
          <div class="contact-info-item"><svg data-lucide="users"></svg><div><strong>Board of Commissioners</strong><span>commissioners@dwjba.com</span></div></div>
          <div class="contact-info-item"><svg data-lucide="phone"></svg><div><strong>Property Management (Hines)</strong><span>313-309-2314</span></div></div>
          <div class="contact-info-item"><svg data-lucide="shield"></svg><div><strong>Building Security</strong><span>313-224-3015</span></div></div>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-header">Hours</div>
          <div class="contact-info-item"><svg data-lucide="clock"></svg><div><strong>DWJBA Office</strong><span>Monday – Friday<br>8:00 AM – 5:00 PM</span></div></div>
          <div class="contact-info-item"><svg data-lucide="building-2"></svg><div><strong>Building Access</strong><span>Monday – Friday<br>7:00 AM – 6:00 PM</span></div></div>
        </div>
        <div class="map-card">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2949.5!2d-83.0458!3d42.3293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d3154b07ed7%3A0x411fd82d5a6e13ba!2s2+Woodward+Ave%2C+Detroit%2C+MI+48226!5e0!3m2!1sen!2sus!4v1681000000000!5m2!1sen!2sus" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="CAYMC Location Map"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section bg-cream" id="visitor">
  <div class="wrap">
    <div class="reveal" style="max-width:640px;margin-bottom:1rem;">
      <div class="eyebrow">Plan Your Visit</div>
      <h2 class="section-title">Visitor Information</h2>
      <p class="section-body">Everything you need to know before visiting the Coleman A. Young Municipal Center — from security to parking to accessibility.</p>
    </div>
    <div class="visitor-grid">
      <div class="visitor-card reveal">
        <div class="visitor-card-icon"><svg data-lucide="clock"></svg></div>
        <h3>Building Hours</h3>
        <ul>
          <li>Mon–Fri: 7:00 AM – 6:00 PM (building access)</li>
          <li>Office hours: 8:00 AM – 5:00 PM (most departments)</li>
          <li>City Clerk: 8:00 AM – 4:30 PM</li>
          <li>Closed weekends and federal holidays</li>
        </ul>
      </div>
      <div class="visitor-card reveal reveal-delay-1">
        <div class="visitor-card-icon"><svg data-lucide="shield"></svg></div>
        <h3>Security & Entry</h3>
        <ul>
          <li>Valid photo ID required for all visitors</li>
          <li>All bags go through X-ray screening</li>
          <li>Metal detectors at all public entrances</li>
          <li>Allow 5–10 minutes for screening</li>
          <li>No weapons or prohibited items permitted</li>
        </ul>
      </div>
      <div class="visitor-card reveal reveal-delay-2">
        <div class="visitor-card-icon"><svg data-lucide="car"></svg></div>
        <h3>Parking & Transit</h3>
        <ul>
          <li>Millender Center Garage (Jefferson Ave)</li>
          <li>Surface lots on Woodward, Larned, &amp; nearby streets</li>
          <li>People Mover: Times Square station (steps away)</li>
          <li>DDOT &amp; SMART bus routes on Woodward Ave</li>
          <li>Rideshare dropoff: Woodward Avenue</li>
        </ul>
      </div>
      <div class="visitor-card reveal">
        <div class="visitor-card-icon"><svg data-lucide="accessibility"></svg></div>
        <h3>Accessibility</h3>
        <ul>
          <li>ADA-accessible entrances on Woodward &amp; Jefferson</li>
          <li>Elevators in both the Admin and Courts Towers</li>
          <li>Accessible restrooms on every floor</li>
          <li>Hearing loop in the 13th Floor Auditorium</li>
          <li>Call ahead for special accommodations: 313-309-2300</li>
        </ul>
      </div>
      <div class="visitor-card reveal reveal-delay-1">
        <div class="visitor-card-icon"><svg data-lucide="map-pin"></svg></div>
        <h3>Getting Here</h3>
        <p><strong>Address:</strong> 2 Woodward Avenue, Detroit, MI 48226</p>
        <p>Located between Jefferson Avenue and Larned Street in downtown Detroit. From I-375, take Jefferson Ave west to Woodward — we'll be on your left.</p>
        <p>An enclosed skybridge connects to the Millender Center (employee access only; garage is public).</p>
      </div>
      <div class="visitor-card reveal reveal-delay-2">
        <div class="visitor-card-icon"><svg data-lucide="bot"></svg></div>
        <h3>AI Visitor Assistant</h3>
        <p>Need to find a specific office or service? Our AI building companion can guide you floor by floor — just describe what you need in plain language.</p>
        <a href="ai-demo.html" class="btn btn-primary" style="margin-top:1rem;">Try Ask CAYMC</a>
      </div>
    </div>
  </div>
</section>
''' + FOOTER

# ─── WRITE ALL FILES ─────────────────────────────────────────────────────────
files = {
    '/home/user/workspace/dwjba/about.html': about,
    '/home/user/workspace/dwjba/spirit.html': spirit,
    '/home/user/workspace/dwjba/directory.html': directory,
    '/home/user/workspace/dwjba/contact.html': contact,
}
for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
    print(f"Wrote {path} ({len(content):,} bytes)")

print("Done.")
