/* =============================================================
   DWJBA — Coleman A. Young Municipal Center
   main.js — Complete Site JS
   ============================================================= */

'use strict';

/* ── UTILITIES ──────────────────────────────────────────────── */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );
  const go = () => $$('.reveal').forEach(el => observer.observe(el));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();

/* ── STICKY NAV ─────────────────────────────────────────────── */
(function initNav() {
  const navBar = document.getElementById('navBar');
  if (!navBar) return;
  function onScroll() { navBar.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE NAV ─────────────────────────────────────────────── */
(function initMobileNav() {
  const menuBtn  = document.getElementById('menuBtn');
  const mobileNav= document.getElementById('mobileNav');
  const closeBtn = document.getElementById('mobileNavClose');
  const scrim    = document.getElementById('scrim');
  if (!menuBtn || !mobileNav) return;
  const open  = () => { mobileNav.classList.add('open'); scrim&&scrim.classList.add('visible'); menuBtn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
  const close = () => { mobileNav.classList.remove('open'); scrim&&scrim.classList.remove('visible'); menuBtn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  menuBtn.addEventListener('click', open);
  closeBtn&&closeBtn.addEventListener('click', close);
  scrim&&scrim.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key==='Escape') close(); });
})();

/* ── LUCIDE ICONS ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* ── DIRECTORY SEARCH ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const dirSearch   = document.getElementById('dirSearch');
  const dirTabs     = $$('.dir-tab');
  const dirCards    = $$('.dir-card');
  const dirSections = $$('.dir-section');
  function filterDir() {
    const query = dirSearch ? dirSearch.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.dir-tab.active');
    const activeCat = activeTab ? activeTab.dataset.cat : 'all';
    dirCards.forEach(card => {
      const catMatch  = activeCat === 'all' || card.dataset.cat === activeCat;
      const textMatch = !query || card.textContent.toLowerCase().includes(query);
      card.style.display = catMatch && textMatch ? '' : 'none';
    });
    dirSections.forEach(section => {
      const catMatch = activeCat === 'all' || section.dataset.cat === activeCat;
      const hasVis   = $$('.dir-card', section).some(c => c.style.display !== 'none');
      section.style.display = catMatch && hasVis ? '' : 'none';
    });
  }
  if (dirSearch) dirSearch.addEventListener('input', filterDir);
  dirTabs.forEach(tab => tab.addEventListener('click', () => {
    dirTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active'); filterDir();
  }));
});

/* ── CONTACT FORM ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});

/* ── NAV DROPDOWN ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  $$('.nav-has-drop').forEach(item => {
    const drop = item.querySelector('.nav-dropdown');
    if (!drop) return;
    item.addEventListener('mouseenter', () => drop.style.display = 'block');
    item.addEventListener('mouseleave', () => drop.style.display = '');
  });
});

/* ── AI TABS ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = $$('.ai-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.panel;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.ai-panel').forEach(p => { p.style.display = p.id === panelId ? '' : 'none'; });
      if (panelId === 'floor-panel' && !isoBuilt) buildIsoTower('admin');
    });
  });
});


/* =============================================================
   ASK CAYMC — SOPHISTICATED CHATBOT
   ============================================================= */

/* ── KNOWLEDGE BASE ─────────────────────────────────────────── */
const KB_TOPICS = {
  hours:           ['hour','open','close','closing','schedule','time','when','open until'],
  parking:         ['park','garage','lot','car','vehicle','drive','valet'],
  security:        ['security','guard','id','identification','checkpoint','enter','access','badge','scan','metal detector'],
  accessibility:   ['ada','accessibility','accessible','wheelchair','disability','disabled','elevator','lift','impair'],
  mayor:           ['mayor','duggan','mayor\'s office','city executive','11th floor','room 1100'],
  taxes:           ['tax','taxes','property tax','pay tax','treasurer','revenue','delinquent'],
  courts:          ['court','courtroom','hearing','judge','docket','circuit','probate','district','lawsuit','case','trial','arraign'],
  parking_ticket:  ['parking ticket','ticket','citation','fine','violation','dismiss','appeal','bureau'],
  birth:           ['birth','certificate','vital','record','born','death record','marriage record','certified copy'],
  business:        ['business','license','permit','zoning','bseed','building permit','dba','register','contractor','certificate of occupancy'],
  voter:           ['vote','voter','registration','election','ballot','clerk','absentee','primary'],
  procurement:     ['procurement','bid','rfp','vendor','contract','rfq','solicitation','proposal'],
  spirit:          ['spirit','statue','bronze','fredericks','plaza','sculpture','kneeling'],
  dwjba:           ['dwjba','authority','building authority','who runs','management','hines','barnett'],
  transit:         ['bus','people mover','transit','ddot','smart bus','train','transportation','get here','directions','cadillac center'],
  caymc:           ['caymc','municipal center','city county','coleman','young','building facts'],
  departments:     ['department','office','where is','find','locate','directory','all offices'],
  contact:         ['contact','phone','email','call','reach','number','address'],
  food:            ['food','eat','cafeteria','lunch','coffee','restaurant','cafe','vending'],
  emergency:       ['emergency','fire','medical','911','help','urgent','evacuate'],
  marriage:        ['marriage','marry','wedding','license','spouse','officiant','ceremony'],
  passport:        ['passport','international','travel','id','federal id','real id','photo id'],
  utility_shutoff: ['utility','shutoff','shut off','water','electric','disconnect','dpw','dwsd','water bill'],
  demolition:      ['demolition','demo permit','tear down','raze','structure removal'],
  small_claims:    ['small claims','sue','lawsuit','civil','magistrate','filing fee','judgment'],
  eviction:        ['evict','eviction','landlord','tenant','lease','unlawful detainer','housing court'],
  child_support:   ['child support','custody','parenting','support order','foc','friend of court','paternity'],
  snap:            ['snap','food stamps','ebt','welfare','dhs','benefit','assistance','food assistance'],
  mental_health:   ['mental health','crisis','counseling','behavioral','psychiatric','cob','community mental'],
  housing:         ['housing','homeless','shelter','hud','section 8','voucher','affordable','dwelling'],
  deed:            ['deed','property record','land record','recording','register of deeds','transfer'],
  name_change:     ['name change','legal name','gender marker','court order','petition','probate court'],
  juror:           ['jury','juror','jury duty','summons','reporting','deliberation','grand jury'],
  notary:          ['notary','notarize','witness','seal','authenticate','sworn statement'],
  languages:       ['language','translate','translation','interpreter','spanish','arabic','arabic','bengali','multilingual','spanish speaking'],
};

const RESPONSES = {
  hours: {
    text: `The Coleman A. Young Municipal Center (CAYMC) is open **Monday–Friday, 7:00 AM – 6:00 PM**. The building is closed on weekends and all City of Detroit official holidays.\n\nThe Courts Tower hours may vary — individual courtrooms often operate 8:00 AM – 4:00 PM. Always confirm with your specific court.\n\nThe **Spirit of Detroit Plaza** on the north side is accessible **24 hours a day, 7 days a week**.`,
    topic: 'Building Hours', confidence: 'high'
  },
  parking: {
    text: `Parking options near CAYMC:\n\n• **CAYMC Parking Structure** — Enter from Randolph St. Discounted validation available from most offices.\n• **Street Parking** — Metered spaces on Woodward Ave, Jefferson Ave, and surrounding blocks.\n• **Detroit People Mover** — Cadillac Center Station is directly adjacent to CAYMC — the most convenient option.\n• **DDOT / SMART Bus** — Multiple routes stop on Woodward Ave at the main entrance.\n• **ADA Parking** — Accessible spaces available in the CAYMC parking structure.`,
    topic: 'Parking & Transit', confidence: 'high',
    location: { floor: 'G', dept: 'Parking Structure / People Mover', room: 'Enter from Randolph St', phone: '(313) 224-3540', hours: 'Mon–Fri 7 AM – 6 PM' }
  },
  security: {
    text: `All visitors to CAYMC must:\n\n• Present a **valid government-issued photo ID** at security checkpoints\n• Pass through **metal detectors** at building entrances\n• Submit bags for X-ray screening\n\nThe main accessible entrance is at **ground level on Woodward Ave**. An additional entrance is on Jefferson Ave.\n\nProhibited items include weapons, hazardous materials, and unauthorized recording equipment.\n\n📞 Security Desk: **(313) 309-2300 ext. 100** — available 24/7`,
    topic: 'Building Security', confidence: 'high',
    location: { floor: '1', dept: 'Security / Main Lobby', room: 'Ground Floor — Woodward Ave Entrance', phone: '(313) 309-2300 x100', hours: '24/7' }
  },
  accessibility: {
    text: `CAYMC is committed to full **ADA compliance**:\n\n• **Accessible Entrance** — Ground level on Woodward Ave, fully accessible\n• **Elevators** — Available in both towers to all floors\n• **ADA Parking** — Accessible spaces in the parking structure\n• **Assistive Listening** — Available on request\n• **Large Print Materials** — Available on request\n• **Sign Language** — Request 48 hours in advance: (313) 224-6740\n• **Service Animals** — Welcome throughout the building\n\nFor ADA accommodation requests, contact the **ADA Coordinator** at **(313) 224-6740**.`,
    topic: 'Accessibility', confidence: 'high'
  },
  mayor: {
    text: `The **Mayor's Office** is located on the **11th Floor, Room 1100** of the Administration Tower.\n\n📞 Phone: (313) 224-3400\n🕒 Hours: Monday–Friday, 8:00 AM – 5:00 PM\n\nFor appointments with the Mayor's staff or general city executive inquiries, call the main line or visit the 11th floor directly. The office oversees all major city departments and policy initiatives.`,
    topic: "Mayor's Office", confidence: 'high',
    location: { floor: '11', dept: "Mayor's Office", room: 'Room 1100 — Administration Tower', phone: '(313) 224-3400', hours: 'Mon–Fri 8 AM – 5 PM' }
  },
  taxes: {
    text: `For property tax payments and inquiries:\n\n**Wayne County Treasurer's Office**\n📍 3rd Floor, Room 300 — Administration Tower\n📞 (313) 224-5990\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nServices: property tax payments, tax certificates, payment plans, and delinquent tax information. Online payments available at waynecounty.com.\n\nFor **City of Detroit** tax matters, visit the **Detroit Finance Department** on the **5th Floor** — (313) 224-3263.`,
    topic: 'Property Taxes', confidence: 'high',
    location: { floor: '3', dept: 'Wayne County Treasurer — Room 300', room: 'Room 300, Administration Tower', phone: '(313) 224-5990', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  courts: {
    text: `CAYMC's Courts Tower (20 floors) houses multiple court systems:\n\n• **Wayne County Circuit Court** — Floors 4–20, (313) 224-5261\n• **36th District Court** — Lower Level, (313) 965-8720\n• **Wayne County Probate Court** — 2nd Floor, (313) 224-5706\n• **Friend of the Court** — 3rd Floor, (313) 224-2390\n• **Court Clerk's Office** — 2nd Floor, (313) 224-5261\n\nAll courts generally open **Monday–Friday 8:00 AM – 4:00 PM**. Confirm your specific court for current hearing times.`,
    topic: 'Courts & Hearings', confidence: 'high',
    location: { floor: '4', dept: 'Wayne County Circuit Court', room: 'Floors 4–20, Courts Tower', phone: '(313) 224-5261', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  parking_ticket: {
    text: `To dispute or pay a parking citation in Detroit:\n\n**Detroit Parking Violations Bureau**\n📍 Ground Floor, Administration Tower\n📞 (313) 224-2130\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nYou can also **pay online** at the City of Detroit's official website. For in-person hearings, bring your citation notice and any supporting evidence. Appeals must typically be filed within **30 days** of the citation date.`,
    topic: 'Parking Violations', confidence: 'high',
    location: { floor: '1', dept: 'Parking Violations Bureau', room: 'Ground Floor — Administration Tower', phone: '(313) 224-2130', hours: 'Mon–Fri 8 AM – 4:30 PM' }
  },
  birth: {
    text: `For birth certificates and vital records:\n\n**City of Detroit Vital Records**\n📍 Ground Floor, Room 101 — Administration Tower\n📞 (313) 876-4800\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\n**Bring:** valid photo ID, completed request form, and the required fee ($15 for a standard certificate). Certified copies may have additional fees.\n\n**Same-day processing** available for in-person requests. Death certificates, marriage records, and divorce decrees are also available here.`,
    topic: 'Vital Records', confidence: 'high',
    location: { floor: '1', dept: 'Vital Records — Room 101', room: 'Room 101, Administration Tower', phone: '(313) 876-4800', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  business: {
    text: `For business licenses and building permits:\n\n**Detroit BSEED** (Building, Safety Engineering & Environmental Dept.)\n📍 4th Floor — Administration Tower\n📞 (313) 224-3158\n🕒 Monday–Friday, 8:00 AM – 5:00 PM\n\nServices: building permits, certificates of occupancy, zoning variances, business license applications, and contractor licensing.\n\n**Detroit Finance Department** (5th Floor, (313) 224-3263) handles DBA registrations and business tax compliance.`,
    topic: 'Business & Permits', confidence: 'high',
    location: { floor: '4', dept: 'BSEED / Building Permits', room: '4th Floor, Administration Tower', phone: '(313) 224-3158', hours: 'Mon–Fri 8 AM – 5 PM' }
  },
  voter: {
    text: `For voter registration and election services:\n\n**Detroit City Clerk's Office**\n📍 Ground Floor, Room 200 — Administration Tower\n📞 (313) 224-3260\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nServices: voter registration, absentee ballot requests, election records, and city records.\n\nYou can also register online at **Michigan.gov/vote**. Bring a valid Michigan ID or driver's license for in-person registration.`,
    topic: 'Voter Registration', confidence: 'high',
    location: { floor: '1', dept: 'City Clerk — Room 200', room: 'Room 200, Administration Tower', phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4:30 PM' }
  },
  procurement: {
    text: `DWJBA Procurement opportunities:\n\n**DWJBA Administrative Office — Procurement**\n📍 Suite 1314, 13th Floor — Administration Tower\n📞 (313) 309-2300\n📧 info@dwjba.com\n\nCurrent active RFPs, RFQs, and IFBs are posted on the DWJBA Procurement page. For vendor registration, visit procurement.html.\n\nFor **Wayne County** procurement, contact the Wayne County Procurement office on the 4th Floor of the Courts Tower — (313) 224-5804.`,
    topic: 'Procurement', confidence: 'high',
    location: { floor: '13', dept: 'DWJBA Suite 1314', room: 'Suite 1314, Administration Tower', phone: '(313) 309-2300', hours: 'Mon–Fri 8 AM – 5 PM' }
  },
  spirit: {
    text: `The **Spirit of Detroit** is a 26-foot cast bronze sculpture by **Marshall Fredericks**, dedicated July 26, 1958, on the north facade of CAYMC.\n\n• Weight: approximately 16 tons\n• Material: Cast bronze (foundry in Berlin, Germany)\n• The kneeling figure holds a gilded sphere (representing God) and a family grouping\n• One of the largest cast bronze statues in the world\n\nThe **Spirit of Detroit Plaza** is open 24/7. For events or plaza rental, contact DWJBA at (313) 309-2300.`,
    topic: 'Spirit of Detroit', confidence: 'high'
  },
  dwjba: {
    text: `The **Detroit-Wayne Joint Building Authority (DWJBA)** manages and maintains the Coleman A. Young Municipal Center.\n\n• **Established:** 1955\n• **CEO:** Clarinda Barnett-Harrison (first woman in the role, 21+ years experience)\n• **Property Manager:** Hines (since 2005)\n• **Awards:** 3× EPA Energy Star | BOMA TOBY Award\n\n📍 Suite 1314, 13th Floor — Administration Tower\n📞 (313) 309-2300\n📧 info@dwjba.com\n\nThe Board of Commissioners includes appointees from both the City of Detroit and Wayne County.`,
    topic: 'About DWJBA', confidence: 'high',
    location: { floor: '13', dept: 'DWJBA Suite 1314', room: 'Suite 1314, Administration Tower', phone: '(313) 309-2300', hours: 'Mon–Fri 8 AM – 5 PM' }
  },
  transit: {
    text: `Transportation to reach CAYMC (2 Woodward Ave):\n\n**Detroit People Mover**\n• **Cadillac Center Station** — directly adjacent to CAYMC (recommended)\n\n**DDOT / SMART Bus**\n• Multiple routes stop on Woodward Ave directly outside\n\n**By Car**\n• From I-75 North: Exit 50B toward Gratiot, follow signs to Woodward\n• From I-96: Exit 53A (Lodge Freeway South), follow Jefferson to Woodward\n\n**Parking:** CAYMC structure (enter from Randolph St) or metered street parking.`,
    topic: 'Transit & Directions', confidence: 'high'
  },
  caymc: {
    text: `The **Coleman A. Young Municipal Center (CAYMC)** is Detroit's landmark seat of city and county government.\n\n• **Designed by:** Harley, Ellington & Day\n• **Completed:** 1955\n• **Total area:** 780,000 sq. ft.\n• **Administration Tower:** 14 floors, 197 ft.\n• **Courts Tower:** 20 floors, 318 ft.\n• **70+ city and county departments**\n\n📍 2 Woodward Ave, Detroit, MI 48226\n📞 Main: (313) 224-3540\n\nNamed after Detroit's first African American mayor, **Coleman A. Young**, in 1976.`,
    topic: 'About CAYMC', confidence: 'high'
  },
  departments: {
    text: `CAYMC houses departments across two towers:\n\n**Administration Tower (14 floors):**\nMayor's Office (11), City Council (13), City Clerk (G), Finance (5), Law (9–10), Human Resources (5), Budget (9), Planning (7), BSEED/Permits (4), DWJBA (13), Treasurer (3)\n\n**Courts Tower (20 floors):**\nWayne County Circuit Court (4–20), 36th District Court (Lower), Probate Court (2), Friend of the Court (3)\n\nAsk me about any specific department for detailed floor, room, phone, and hours.`,
    topic: 'Department Directory', confidence: 'high'
  },
  contact: {
    text: `DWJBA Contact Information:\n\n📍 2 Woodward Ave, Suite 1314, Detroit, MI 48226\n📞 DWJBA Main: (313) 309-2300\n📞 Building Info: (313) 224-3540\n📧 General: info@dwjba.com\n📧 Commissioners: commissioners@dwjba.com\n\n**Building Hours:** Monday–Friday 7:00 AM – 6:00 PM\n\nFor specific departments, ask me or visit the Department Directory.`,
    topic: 'Contact Info', confidence: 'high'
  },
  food: {
    text: `Dining options at CAYMC:\n\n**Building Cafeteria**\n📍 Ground Floor — Administration Tower\n🕒 Monday–Friday, 7:00 AM – 3:00 PM\nHot breakfast, lunch, sandwiches, salads, and daily specials.\n\n**Nearby Options**\nCampus Martius Park (2 blocks) and Greektown (5 minutes) offer numerous dining choices within walking distance.\n\nFor food truck schedules and special events at the Spirit of Detroit Plaza, contact DWJBA at (313) 309-2300.`,
    topic: 'Food & Dining', confidence: 'high'
  },
  emergency: {
    text: `**In any emergency, call 911 first.**\n\nFor building security emergencies:\n📞 Security Desk: **(313) 309-2300 ext. 100** — 24/7\n\nEmergency exits are clearly marked on all floors. Assembly points are designated on surrounding sidewalks.\n\nFor non-emergency security concerns, contact the Security Desk in the main lobby (1st Floor) or call (313) 309-2300.`,
    topic: 'Emergency', confidence: 'high'
  },
  marriage: {
    text: `To obtain a **Marriage License** in Detroit / Wayne County:\n\n**Wayne County Clerk's Office**\n📍 201 Coleman A. Young Municipal Center (internal reference)\n📞 (313) 224-5540\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\n**Requirements:**\n• Both parties must appear in person with valid government-issued photo ID\n• $20 fee (cash or money order)\n• 3-day waiting period before the license is valid\n• License is valid for 33 days\n\nFor ceremony officiant information, contact the Wayne County Clerk at the number above.`,
    topic: 'Marriage License', confidence: 'high',
    location: { floor: '2', dept: 'County Clerk — Marriage Licenses', room: 'Administration Tower, Ground / 2nd Floor', phone: '(313) 224-5540', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  passport: {
    text: `**Passport Services** at CAYMC:\n\n**Detroit Passport Acceptance Facility**\n📍 Ground Floor, Administration Tower\n📞 (313) 224-3260\n🕒 Monday–Friday, 8:00 AM – 4:00 PM (by appointment)\n\n**Bring:**\n• Completed DS-11 form (first-time) or DS-82 (renewal)\n• Original proof of citizenship (birth certificate or current passport)\n• Valid government photo ID + photocopy\n• Passport photo (2" × 2")\n• Application fees ($130 application + $35 acceptance)\n\nExpedited processing is available for urgent travel. Call ahead to confirm availability.`,
    topic: 'Passport Services', confidence: 'high',
    location: { floor: '1', dept: 'Passport Acceptance Facility', room: 'Ground Floor, Administration Tower', phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  utility_shutoff: {
    text: `For utility disconnection and water shutoff concerns:\n\n**Detroit Water & Sewerage Department (DWSD)**\n📞 (313) 267-8000\n🕒 Monday–Friday, 8:00 AM – 5:00 PM\n\n**Detroit Public Works (DPW)**\n📞 (313) 224-4946\n\nFor **water shutoff assistance** or payment plans, contact DWSD directly. The Wayne County Treasurer's office (3rd Floor, Room 300) may also assist with delinquency assistance programs.\n\nEmergency utility issues after hours: call **311** (Detroit non-emergency line).`,
    topic: 'Utility Services', confidence: 'suggested'
  },
  demolition: {
    text: `For demolition permits in the City of Detroit:\n\n**BSEED — Building Safety Engineering & Environmental Dept.**\n📍 4th Floor — Administration Tower\n📞 (313) 224-3158\n🕒 Monday–Friday, 8:00 AM – 5:00 PM\n\nDemolition permits are required for any structure removal. You will need:\n• Completed permit application\n• Site plan / drawings\n• Contractor licensing documentation\n• Asbestos survey (for structures built before 1985)\n\nFor **city-owned property demolition** programs, contact Detroit Land Bank Authority.`,
    topic: 'Demolition Permits', confidence: 'high',
    location: { floor: '4', dept: 'BSEED / Demolition Permits', room: '4th Floor, Administration Tower', phone: '(313) 224-3158', hours: 'Mon–Fri 8 AM – 5 PM' }
  },
  small_claims: {
    text: `For **Small Claims Court** (disputes up to $6,500) in Detroit:\n\n**36th District Court — Small Claims Division**\n📍 Courts Tower, Lower Level\n📞 (313) 965-8720\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nFiling fees range from $30–$70 depending on the claim amount. You can file without an attorney. Bring all documentation, contracts, receipts, and correspondence related to your dispute.\n\nFor claims above $6,500, you will need **Wayne County Circuit Court** (Floors 4–20, Courts Tower).`,
    topic: 'Small Claims Court', confidence: 'high',
    location: { floor: 'B', dept: '36th District Court — Small Claims', room: 'Lower Level, Courts Tower', phone: '(313) 965-8720', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  eviction: {
    text: `For eviction proceedings (unlawful detainer / summary proceedings):\n\n**36th District Court — Civil Division**\n📍 Courts Tower, Lower Level\n📞 (313) 965-8720\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\n**Landlords:** File a Notice to Quit, then a Summary Proceeding if the tenant does not vacate. Court fees apply.\n\n**Tenants:** You have the right to contest an eviction. Legal aid resources are available:\n• **Michigan Legal Help:** michiganlegalhelp.org\n• **Wayne Metro Legal Services:** (313) 964-4130\n\nFor **housing assistance** to avoid eviction, contact Wayne County's Housing & Community Services.`,
    topic: 'Eviction / Housing', confidence: 'high',
    location: { floor: 'B', dept: '36th District Court — Civil / Eviction', room: 'Lower Level, Courts Tower', phone: '(313) 965-8720', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  child_support: {
    text: `For child support services and enforcement:\n\n**Friend of the Court (FOC)**\n📍 3rd Floor — Courts Tower\n📞 (313) 224-2390\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nServices: child support orders, modifications, enforcement, paternity establishment, parenting time schedules, and custody record access.\n\nFor **new support orders**, contact the Friend of the Court or visit the Wayne County Prosecutor's Family Support Division at (313) 224-5430.\n\nPay support online or by phone at: **1-877-543-2660**`,
    topic: 'Child Support / FOC', confidence: 'high',
    location: { floor: '3', dept: 'Friend of the Court', room: '3rd Floor, Courts Tower', phone: '(313) 224-2390', hours: 'Mon–Fri 8 AM – 4:30 PM' }
  },
  snap: {
    text: `For SNAP (Food Stamps) and public assistance benefits:\n\n**Michigan Department of Health & Human Services (MDHHS)**\n📞 (855) 275-6424\n🌐 michigan.gov/mdhhs\n\nThe **Detroit MDHHS office** nearest to CAYMC is at:\n📍 5057 Woodward Ave, Detroit MI 48202\n🕒 Monday–Friday, 8:00 AM – 5:00 PM\n\nYou can also apply online at **mi.gov/MIBridges**. Applications can be submitted online, by phone, or in person. Bring proof of income, ID, and residency.\n\nFor emergency food assistance, contact **Gleaners Food Bank:** (866) 453-2637`,
    topic: 'SNAP / Benefits', confidence: 'suggested'
  },
  mental_health: {
    text: `For mental health and behavioral health services in Detroit:\n\n**Detroit Wayne Integrated Health Network (DWIHN)**\n📞 (800) 241-4949 — 24/7 Crisis Line\n🌐 dwihn.com\n\n**Community Mental Health (CMH) Crisis Services:**\n• Crisis line: **(313) 224-7000** (Wayne County)\n• Walk-in crisis center: 1 Atwater St, Detroit 48226\n\nFor immediate psychiatric emergencies, call **911** or go to the nearest emergency room. Mental health services are not located within CAYMC, but staff at the building can connect you with the right resources.`,
    topic: 'Mental Health', confidence: 'suggested'
  },
  housing: {
    text: `For housing assistance programs in Detroit / Wayne County:\n\n**Wayne County Community & Economic Development**\n📍 500 Griswold St, Detroit (Wayne County Building)\n📞 (313) 224-0263\n\n**Detroit Housing & Revitalization Department**\n📞 (313) 628-2500\n🌐 detroitmi.gov/housing\n\nPrograms available: Section 8 / Housing Choice Vouchers, emergency rental assistance, homebuyer programs, and rehabilitation loans.\n\n**Michigan State Housing Development Authority (MSHDA):** (800) 327-9158\n\nFor CAYMC-specific housing court matters, see the 36th District Court (Lower Level, Courts Tower).`,
    topic: 'Housing Assistance', confidence: 'suggested'
  },
  deed: {
    text: `For deed recording and property records:\n\n**Wayne County Register of Deeds**\n📍 400 Monroe St, Detroit MI 48226 (Wayne County Bldg)\n📞 (313) 224-5854\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nServices: recording deeds, mortgages, liens, land contracts, and plat maps. Certified copies available in person or by mail.\n\nRecording fees vary by document type. Bring the original document plus two legible copies. **Notarization is required** for most recorded documents.\n\nNote: The Register of Deeds is located at the Wayne County Building on Monroe St, not within CAYMC.`,
    topic: 'Deed Recording', confidence: 'high'
  },
  name_change: {
    text: `For a legal **name change** in Michigan:\n\n**Wayne County Probate Court**\n📍 2nd Floor — Courts Tower (CAYMC)\n📞 (313) 224-5706\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\n**Process:**\n1. File a Petition for Name Change (PC51) with the Probate Court\n2. Pay filing fee (~$175)\n3. Attend a hearing (typically 3–4 weeks after filing)\n4. Update your records after the order is granted (SSA, DMV, passport, etc.)\n\nFor **gender marker changes** on Michigan documents, name change orders from the court are typically sufficient for state ID updates.`,
    topic: 'Name Change', confidence: 'high',
    location: { floor: '2', dept: 'Probate Court — Name Change Division', room: '2nd Floor, Courts Tower', phone: '(313) 224-5706', hours: 'Mon–Fri 8 AM – 4 PM' }
  },
  juror: {
    text: `For **jury duty** and juror services in Wayne County:\n\n**Wayne County Circuit Court — Jury Services**\n📍 Courts Tower — Check your summons for specific floor assignment\n📞 (313) 224-0025\n🌐 waynecounty.com/elected/clerk/jury-services\n\n**When to arrive:** Per your summons. Check the automated system after 5 PM the evening before your reporting date to confirm.\n\n**What to bring:** Your jury summons, valid photo ID, and patience — bring a book or earbuds. Jurors receive $12.50/day + mileage reimbursement.\n\nTo **request postponement or excuse**, call the Jury Services line before your reporting date.`,
    topic: 'Jury Duty', confidence: 'high',
    location: { floor: '4', dept: 'Circuit Court — Jury Services', room: 'Courts Tower — see your summons', phone: '(313) 224-0025', hours: 'Per summons' }
  },
  notary: {
    text: `**Notary services** are available at several locations within CAYMC:\n\n• **City Clerk's Office** — Ground Floor, Room 200, Administration Tower — (313) 224-3260\n• **DWJBA Office** — Suite 1314, 13th Floor — (313) 309-2300 (call ahead)\n• **Various department offices** — Many city department offices have staff notaries on-site\n\nBring: the document to be notarized (unsigned), valid government-issued photo ID, and any required witnesses.\n\nFees are typically $10 per signature for government offices. Private notaries are also available downtown via Detroit Public Library and UPS stores nearby.`,
    topic: 'Notary Services', confidence: 'high',
    location: { floor: '1', dept: 'City Clerk — Notary Services', room: 'Room 200, Administration Tower', phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4:30 PM' }
  },
  languages: {
    text: `CAYMC and its agencies provide **language access services**:\n\n• **Interpretation:** Available in Spanish, Arabic, Bengali, Chaldean, and 200+ languages via telephonic interpretation services\n• **Sign Language:** Request 48 hours in advance at (313) 224-6740\n• **Spanish:** Many departments have bilingual staff — call ahead to confirm availability\n• **Document Translation:** Key forms available in multiple languages; request from the specific department\n\nFor **ADA & language accommodation** requests:\n📞 ADA Coordinator: (313) 224-6740\n\nAll residents have a legal right to language access in city government services.`,
    topic: 'Language Services', confidence: 'high'
  },
  default: {
    text: `I can help with anything related to the Coleman A. Young Municipal Center. Some things I know well:\n\n• **Office locations** — any department, floor, and room number\n• **Building hours** and visitor information\n• **Payment services** — taxes, tickets, fees\n• **Permits & licenses** — business, building, demolition\n• **Courts** — circuit, probate, small claims, eviction\n• **Vital records** — birth, marriage, passport, name change\n• **Social services** — SNAP, housing, mental health referrals\n• **DWJBA** — building authority, procurement, history\n\nCould you tell me a bit more about what you're looking for? I'll find the right information.`,
    topic: 'General', confidence: 'suggested'
  }
};

/* ── QUICK REPLY CHIP SETS (topic-based rotation) ─────────────── */
const CHIP_SETS = {
  taxes:       ['Where is the Treasurer office?','Can I pay online?','What if I can\'t pay?'],
  mayor:       ['What are the Mayor\'s hours?','How do I contact the Mayor?','What floor is City Council?'],
  courts:      ['Where is Friend of the Court?','I need small claims info','Where is Probate Court?'],
  parking_ticket: ['How do I appeal a ticket?','Can I pay online?','Where is Parking Violations?'],
  birth:       ['What ID do I need?','How much does it cost?','Can I get a death certificate?'],
  marriage:    ['How long does it take?','What\'s the waiting period?','Can I get married same day?'],
  passport:    ['Do I need an appointment?','How long does processing take?','What photos are required?'],
  child_support:['How do I modify a support order?','Where is Friend of the Court?','How do I pay child support?'],
  default:     ['What are the building hours?','How do I get here?','Where is parking?']
};

/* ── ENTITY EXTRACTION ──────────────────────────────────────── */
function extractEntities(text) {
  const entities = {};
  // Floor numbers
  const floorMatch = text.match(/(\d{1,2})(st|nd|rd|th)?\s*floor/i);
  if (floorMatch) entities.floor = parseInt(floorMatch[1]);
  // Room numbers
  const roomMatch = text.match(/room\s*(\d{3,4})/i);
  if (roomMatch) entities.room = roomMatch[1];
  // Tower
  if (/court\s*tower|courts\s*tower/i.test(text)) entities.tower = 'courts';
  if (/admin\s*tower|administration\s*tower/i.test(text)) entities.tower = 'admin';
  return entities;
}

/* ── RESPONSE MATCHING ──────────────────────────────────────── */
function matchResponse(input, context) {
  const text = input.toLowerCase();

  // Priority phrase matches
  const phrases = [
    [['parking ticket','citation','pay a ticket','dismiss a ticket','parking fine'], 'parking_ticket'],
    [['birth cert','vital record','born','death certificate','death record'], 'birth'],
    [['marriage license','get married','marry','wedding license'], 'marriage'],
    [['passport','real id','travel document'], 'passport'],
    [['business license','building permit','bseed','certificate of occupancy','zoning variance','demolition permit'], 'business'],
    [['demolition','demo permit','tear down','raze'], 'demolition'],
    [['property tax','pay tax','treasurer','delinquent tax'], 'taxes'],
    [['voter reg','city clerk','absentee ballot','election'], 'voter'],
    [['people mover','how do i get','directions to','take the bus','how to get there'], 'transit'],
    [['child support','friend of the court','foc','custody order','paternity'], 'child_support'],
    [['small claims','sue someone','civil dispute'], 'small_claims'],
    [['evict','eviction','landlord','tenant dispute','unlawful detainer'], 'eviction'],
    [['snap','food stamp','ebt','welfare benefit','food assistance'], 'snap'],
    [['mental health','crisis line','psychiatric','counseling referral'], 'mental_health'],
    [['housing assistance','section 8','voucher','affordable housing','homeless'], 'housing'],
    [['deed record','register of deeds','land record','property recording'], 'deed'],
    [['name change','legal name','gender marker'], 'name_change'],
    [['jury','juror','jury duty','summons'], 'juror'],
    [['notary','notarize','sworn statement','authenticate'], 'notary'],
    [['language','translate','interpreter','spanish','arabic'], 'languages'],
    [['spirit of detroit','marshall fredericks','bronze statue'], 'spirit'],
    [['utility','water shutoff','shut off','water bill','dwsd'], 'utility_shutoff'],
  ];

  for (const [keys, topic] of phrases) {
    if (keys.some(k => text.includes(k))) return topic;
  }

  // Context follow-up detection
  if (context && context.lastTopic && (text.includes(' and ') || text.startsWith('what about') || text.startsWith('also'))) {
    return context.lastTopic; // return same topic for follow-up detail
  }

  // Keyword scoring
  const scores = {};
  for (const [key, words] of Object.entries(KB_TOPICS)) {
    scores[key] = 0;
    for (const word of words) {
      if (text.includes(word)) scores[key] += word.split(' ').length;
    }
  }
  const best = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
  if (best[1] > 0 && RESPONSES[best[0]]) return best[0];
  return 'default';
}

/* ── RESPONSE FORMATTER ─────────────────────────────────────── */
function formatResponse(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const lines = text.split('\n');
  let html = '', inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${trimmed.slice(1).trim()}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (trimmed === '') html += '<br>';
      else html += `<span>${trimmed}</span><br>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

/* ── LOCATION CARD HTML ─────────────────────────────────────── */
function buildLocationCard(loc) {
  if (!loc) return '';
  return `
    <div class="location-card">
      <div class="location-card-floor">${loc.floor}</div>
      <div class="location-card-info">
        <div class="location-card-flabel">Floor ${loc.floor} · Administration Tower</div>
        <div class="location-card-dept">${loc.dept}</div>
        <div class="location-pills">
          <span class="location-pill"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13 19.79 19.79 0 0 1 1.72 4.4 2 2 0 0 1 3.69 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${loc.phone}</span>
          <span class="location-pill"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${loc.hours}</span>
          ${loc.room ? `<span class="location-pill"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>${loc.room}</span>` : ''}
        </div>
      </div>
    </div>`;
}

/* ── CHAT STATE ─────────────────────────────────────────────── */
let chatContext = { lastTopic: null, history: [], messageCount: 0, topicsSet: new Set() };

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/* ── APPEND MESSAGES ────────────────────────────────────────── */
function appendUserMsg(text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  chatContext.messageCount++;
  document.getElementById('statMessages') && (document.getElementById('statMessages').textContent = chatContext.messageCount);

  const row = document.createElement('div');
  row.className = 'chat-msg-row user-row';
  row.innerHTML = `
    <div class="msg-avatar-user">YOU</div>
    <div>
      <div class="chat-bubble-user">${escapeHTML(text)}</div>
      <div class="user-time">${getTime()}</div>
    </div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHTML(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showTypingIndicator() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return null;
  const row = document.createElement('div');
  row.className = 'chat-msg-row';
  row.id = 'typingRow';
  row.innerHTML = `
    <div class="msg-avatar"><img src="images/dwjba-logo.jpg" alt="CAYMC"></div>
    <div class="chat-bubble-bot" style="padding:0.85rem 1.1rem;">
      <div class="bubble-meta"><span class="bubble-sender">Ask CAYMC</span></div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  return row;
}

function appendBotMsg(topicKey, followUp) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const indicator = document.getElementById('typingRow');
  if (indicator) indicator.remove();

  const resp = RESPONSES[topicKey] || RESPONSES.default;
  const isFollowUp = followUp && chatContext.lastTopic === topicKey;

  // Update sidebar stats
  chatContext.lastTopic = topicKey;
  chatContext.topicsSet.add(topicKey);
  document.getElementById('statTopics') && (document.getElementById('statTopics').textContent = chatContext.topicsSet.size);

  // Update topic badge
  const badge = document.getElementById('currentTopicBadge');
  if (badge) badge.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${resp.topic}`;

  // Build the bubble row
  const row = document.createElement('div');
  row.className = 'chat-msg-row';
  const confClass = resp.confidence === 'high' ? 'confidence-high' : 'confidence-suggested';
  const confLabel = resp.confidence === 'high' ? 'High Confidence' : 'Suggested';

  const prefixNote = isFollowUp
    ? '<em style="color:rgba(196,149,106,0.7);font-size:0.8rem;display:block;margin-bottom:0.5rem;">Based on your earlier question…</em>'
    : '';

  row.innerHTML = `
    <div class="msg-avatar"><img src="images/dwjba-logo.jpg" alt="CAYMC AI"></div>
    <div class="chat-bubble-bot">
      <div class="bubble-meta">
        <span class="bubble-sender">Ask CAYMC</span>
        <span class="confidence-badge ${confClass}">${confLabel}</span>
      </div>
      ${prefixNote}
      <div class="bubble-content" id="streamTarget_${chatContext.messageCount}"></div>
      <div class="bubble-time">${getTime()}</div>
    </div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;

  // Stream text word-by-word
  const target = document.getElementById(`streamTarget_${chatContext.messageCount}`);
  const fullHTML = formatResponse(resp.text) + buildLocationCard(resp.location);
  streamContent(target, resp.text, resp.location, messages);

  // Update quick chips after response
  setTimeout(() => {
    renderQuickChips(topicKey);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 400);
}

function streamContent(target, rawText, location, container) {
  const words = rawText.split(' ');
  let i = 0;
  let accumulated = '';

  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      // Append location card after streaming
      if (location) {
        target.innerHTML = formatResponse(rawText) + buildLocationCard(location);
      } else {
        target.innerHTML = formatResponse(rawText);
      }
      container.scrollTop = container.scrollHeight;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }
    accumulated += (i === 0 ? '' : ' ') + words[i];
    target.innerHTML = formatResponse(accumulated) + '▌';
    container.scrollTop = container.scrollHeight;
    i++;
  }, 28);
}

/* ── RENDER QUICK CHIPS ─────────────────────────────────────── */
function renderQuickChips(topicKey) {
  const wrap = document.getElementById('quickChips');
  if (!wrap) return;
  const chips = CHIP_SETS[topicKey] || CHIP_SETS.default;
  wrap.innerHTML = '';
  chips.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'quick-chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const input = document.getElementById('chatInput');
      if (input) { input.value = label; handleChatInput(); }
    });
    wrap.appendChild(btn);
  });
}

/* ── WELCOME MESSAGE ────────────────────────────────────────── */
function showWelcomeMessage() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const row = document.createElement('div');
  row.className = 'chat-msg-row';
  row.innerHTML = `
    <div class="msg-avatar"><img src="images/dwjba-logo.jpg" alt="CAYMC AI"></div>
    <div class="chat-bubble-bot">
      <div class="bubble-meta">
        <span class="bubble-sender">Ask CAYMC</span>
        <span class="confidence-badge confidence-high">AI Active</span>
      </div>
      <div class="bubble-content">
        <strong>Hello, and welcome to the Coleman A. Young Municipal Center.</strong><br><br>
        I'm <strong>Ask CAYMC</strong> — your intelligent building companion. I can help you:
        <ul>
          <li>Find any office or department (floor, room number, phone)</li>
          <li>Answer questions about permits, court services, and vital records</li>
          <li>Guide you through marriage licenses, name changes, and passport services</li>
          <li>Connect you with housing, SNAP, and social service referrals</li>
        </ul>
        <br>What brings you to CAYMC today?
      </div>
      <div class="bubble-time">${getTime()}</div>
    </div>`;
  messages.appendChild(row);

  // Initial chips
  renderQuickChips('default');
}

/* ── HANDLE CHAT INPUT ──────────────────────────────────────── */
function handleChatInput() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  document.getElementById('charCounter') && (document.getElementById('charCounter').textContent = '0/500');

  appendUserMsg(text);

  const typingEl = showTypingIndicator();
  const topic = matchResponse(text, chatContext);
  const delay = 700 + Math.random() * 600;

  setTimeout(() => appendBotMsg(topic, true), delay);
}

/* ── VOICE INPUT ────────────────────────────────────────────── */
function initVoiceInput() {
  const btn = document.getElementById('voiceBtn');
  if (!btn) return;

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    btn.title = 'Voice input not supported in this browser';
    btn.style.opacity = '0.4';
    return;
  }

  const rec = new SpeechRec();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  let listening = false;

  btn.addEventListener('click', () => {
    if (listening) { rec.stop(); return; }
    listening = true;
    btn.classList.add('listening');
    btn.title = 'Listening…';
    rec.start();
  });

  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const input = document.getElementById('chatInput');
    if (input) {
      input.value = transcript;
      input.focus();
    }
  };

  rec.onend = () => {
    listening = false;
    btn.classList.remove('listening');
    btn.title = 'Voice input';
    if (document.getElementById('chatInput')?.value.trim()) handleChatInput();
  };

  rec.onerror = () => {
    listening = false;
    btn.classList.remove('listening');
    btn.title = 'Voice input';
  };
}

/* ── INIT CHATBOT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showWelcomeMessage();

  const sendBtn = document.getElementById('chatSend');
  const input   = document.getElementById('chatInput');
  const counter = document.getElementById('charCounter');

  if (sendBtn) sendBtn.addEventListener('click', handleChatInput);
  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleChatInput(); });
    input.addEventListener('input', () => {
      if (counter) counter.textContent = `${input.value.length}/500`;
    });
  }

  // Clear / new chat
  ['clearChatBtn','newChatBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => {
      const msgs = document.getElementById('chatMessages');
      if (msgs) msgs.innerHTML = '';
      chatContext = { lastTopic: null, history: [], messageCount: 0, topicsSet: new Set() };
      document.getElementById('statMessages') && (document.getElementById('statMessages').textContent = '0');
      document.getElementById('statTopics')   && (document.getElementById('statTopics').textContent = '0');
      const badge = document.getElementById('currentTopicBadge');
      if (badge) badge.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>General Inquiry`;
      showWelcomeMessage();
    });
  });

  initVoiceInput();
});


/* =============================================================
   3D ISOMETRIC FLOOR NAVIGATOR
   ============================================================= */

/* ── FLOOR DATA ─────────────────────────────────────────────── */
const FLOOR_DATA = {
  admin: {
    1:  { label:'Lobby / Security / Information', dept:'Security, Vital Records, Parking Violations, City Clerk, Info Desk', room:'Ground Floor — Woodward Ave', phone:'(313) 224-3540', hours:'Mon–Fri 7 AM – 6 PM', type:'lobby' },
    2:  { label:'Public Services', dept:'HR Services, City Services, Public Assistance', room:'2nd Floor', phone:'(313) 224-3540', hours:'Mon–Fri 8 AM – 5 PM', type:'public' },
    3:  { label:'Wayne County Treasurer', dept:'Property Tax Payments, Tax Certificates, Delinquent Taxes', room:'Room 300', phone:'(313) 224-5990', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    4:  { label:'BSEED / Building Permits', dept:'Building Permits, Safety Engineering, Zoning, Certificates of Occupancy', room:'4th Floor', phone:'(313) 224-3158', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    5:  { label:'Finance / Human Resources', dept:'Finance Dept, Human Resources, Payroll, Budget Support', room:'5th Floor', phone:'(313) 224-3263', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    6:  { label:'City Departments', dept:'General Administration Offices', room:'6th Floor', phone:'(313) 224-3540', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    7:  { label:'Planning & Development', dept:'City Planning, Neighborhood Development, Land Use', room:'7th Floor', phone:'(313) 224-6225', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    8:  { label:'City Departments', dept:'General Administration Offices', room:'8th Floor', phone:'(313) 224-3540', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    9:  { label:'Budget / Law Department', dept:'Budget Office, Corporation Counsel, City Attorneys', room:'9th Floor', phone:'(313) 224-4550', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    10: { label:'Law Department', dept:'Corporation Counsel, Legal Services, City Attorneys', room:'10th Floor', phone:'(313) 224-4550', hours:'Mon–Fri 8 AM – 5 PM', type:'standard' },
    11: { label:"Mayor's Office", dept:"Mayor's Office, Executive Staff, Policy Initiatives", room:'Room 1100', phone:'(313) 224-3400', hours:'Mon–Fri 8 AM – 5 PM', type:'executive' },
    12: { label:'City Administration', dept:'Administrative Offices, Executive Support', room:'12th Floor', phone:'(313) 224-3540', hours:'Mon–Fri 8 AM – 5 PM', type:'executive' },
    13: { label:'City Council / DWJBA', dept:'City Council Chambers, DWJBA Suite 1314, Council Offices', room:'Suite 1314', phone:'(313) 309-2300', hours:'Mon–Fri 8 AM – 5 PM', type:'executive' },
    14: { label:'Executive / Commissioners', dept:'Executive Offices, City Commissioners, Controller', room:'14th Floor', phone:'(313) 224-3540', hours:'Mon–Fri 8 AM – 5 PM', type:'executive' },
  },
  courts: {
    1:  { label:'Courts Lobby / Security', dept:'Courts Entrance, Security Checkpoint, Information', room:'Ground Floor', phone:'(313) 224-5261', hours:'Mon–Fri 7 AM – 6 PM', type:'lobby' },
    2:  { label:'Probate Court / Clerk', dept:'Probate Court, Court Clerk, Filing Window, Name Change', room:'2nd Floor', phone:'(313) 224-5706', hours:'Mon–Fri 8 AM – 4 PM', type:'public' },
    3:  { label:'Friend of the Court', dept:'Child Support, Custody Orders, Parenting Time, FOC', room:'3rd Floor', phone:'(313) 224-2390', hours:'Mon–Fri 8 AM – 4:30 PM', type:'public' },
    4:  { label:'Circuit Court', dept:'Wayne County Circuit Court, Civil Division, Filing', room:'4th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    5:  { label:'Circuit Court', dept:'Civil Cases, Courtrooms 500–599', room:'5th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    6:  { label:'Circuit Court', dept:'Courtrooms 600–699, Case Management', room:'6th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    7:  { label:'Circuit Court / County Exec', dept:'Circuit Court, Wayne County Executive Offices', room:'7th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    8:  { label:'Circuit Court', dept:'Courtrooms, Hearings, Case Management', room:'8th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    9:  { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'9th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    10: { label:'Circuit Court', dept:'Civil Courtrooms, Motions Division', room:'10th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    11: { label:'Circuit Court', dept:'Criminal Division Courtrooms', room:'11th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    12: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'12th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    13: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'13th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    14: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'14th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    15: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'15th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    16: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'16th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    17: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'17th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    18: { label:'Circuit Court', dept:'Circuit Court Courtrooms', room:'18th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    19: { label:'Circuit Court — Upper', dept:'Felony Cases, Upper Division', room:'19th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'standard' },
    20: { label:'Chief Judges / Administration', dept:'Chief Judges Office, Court Administration, Judicial Council', room:'20th Floor', phone:'(313) 224-5261', hours:'Mon–Fri 8 AM – 4 PM', type:'executive' },
  }
};

/* ── NEEDS MAP ──────────────────────────────────────────────── */
const NEEDS_MAP = {
  'property tax': { tower:'admin', floor:3 }, 'property taxes': { tower:'admin', floor:3 },
  'pay tax': { tower:'admin', floor:3 }, 'treasurer': { tower:'admin', floor:3 },
  'parking ticket': { tower:'admin', floor:1 }, 'citation': { tower:'admin', floor:1 },
  'parking violation': { tower:'admin', floor:1 },
  'birth certificate': { tower:'admin', floor:1 }, 'vital records': { tower:'admin', floor:1 },
  'death certificate': { tower:'admin', floor:1 }, 'certified copy': { tower:'admin', floor:1 },
  'marriage license': { tower:'admin', floor:2 }, 'marriage': { tower:'admin', floor:2 },
  'passport': { tower:'admin', floor:1 },
  'court hearing': { tower:'courts', floor:4 }, 'court': { tower:'courts', floor:4 },
  'circuit court': { tower:'courts', floor:4 }, 'jury duty': { tower:'courts', floor:4 },
  'juror': { tower:'courts', floor:4 }, 'small claims': { tower:'courts', floor:2 },
  'eviction': { tower:'courts', floor:2 }, 'landlord': { tower:'courts', floor:2 },
  'business license': { tower:'admin', floor:4 }, 'building permit': { tower:'admin', floor:4 },
  'permit': { tower:'admin', floor:4 }, 'bseed': { tower:'admin', floor:4 },
  'demolition': { tower:'admin', floor:4 }, 'zoning': { tower:'admin', floor:7 },
  'planning': { tower:'admin', floor:7 }, 'development': { tower:'admin', floor:7 },
  'mayor office': { tower:'admin', floor:11 }, 'mayor': { tower:'admin', floor:11 },
  "mayor's office": { tower:'admin', floor:11 }, 'room 1100': { tower:'admin', floor:11 },
  'city council': { tower:'admin', floor:13 }, 'council': { tower:'admin', floor:13 },
  'dwjba': { tower:'admin', floor:13 }, 'suite 1314': { tower:'admin', floor:13 },
  'voter registration': { tower:'admin', floor:1 }, 'city clerk': { tower:'admin', floor:1 },
  'vote': { tower:'admin', floor:1 }, 'election': { tower:'admin', floor:1 },
  'child support': { tower:'courts', floor:3 }, 'friend of the court': { tower:'courts', floor:3 },
  'foc': { tower:'courts', floor:3 }, 'custody': { tower:'courts', floor:3 },
  'probate': { tower:'courts', floor:2 }, 'probate court': { tower:'courts', floor:2 },
  'name change': { tower:'courts', floor:2 }, 'legal name': { tower:'courts', floor:2 },
  'human resources': { tower:'admin', floor:5 }, 'hr': { tower:'admin', floor:5 },
  'finance': { tower:'admin', floor:5 }, 'payroll': { tower:'admin', floor:5 },
  'law': { tower:'admin', floor:9 }, 'legal': { tower:'admin', floor:9 },
  'attorney': { tower:'admin', floor:9 }, 'budget': { tower:'admin', floor:9 },
  'security': { tower:'admin', floor:1 }, 'lobby': { tower:'admin', floor:1 },
  'information desk': { tower:'admin', floor:1 }, 'entrance': { tower:'admin', floor:1 },
  'snap': { tower:'admin', floor:1 }, 'food stamps': { tower:'admin', floor:1 },
  'deed recording': { tower:'admin', floor:1 }, 'deed': { tower:'admin', floor:1 },
  'notary': { tower:'admin', floor:1 },
};

/* ── 3D ISO TOWER STATE ─────────────────────────────────────── */
let isoBuilt     = false;
let isoTower     = 'admin';
let isoActiveFloor = null;

/* ── BUILD ISO TOWER ────────────────────────────────────────── */
function buildIsoTower(tower) {
  const building = document.getElementById('isoBuilding');
  const tooltip  = document.getElementById('isoTooltip');
  if (!building) return;

  building.innerHTML = '';
  isoBuilt   = true;
  isoTower   = tower;
  isoActiveFloor = null;

  const data = FLOOR_DATA[tower];
  const totalFloors = Object.keys(data).length;
  const floorNums = Object.keys(data).map(Number).sort((a,b) => b-a); // top to bottom

  // Tower name label
  const nameEl = document.getElementById('isoTowerName');
  if (nameEl) nameEl.textContent = tower === 'admin' ? 'ADMINISTRATION TOWER' : 'COURTS TOWER';

  // Build slabs top→bottom (visually bottom=floor1 since CSS stacks down)
  floorNums.forEach((floorNum, idx) => {
    const floorInfo = data[floorNum];
    const slab = document.createElement('div');
    slab.className = 'floor-slab';
    slab.dataset.floor = floorNum;
    slab.dataset.tower = tower;

    // Slab CSS depth vars — executive floors slightly taller
    const isExec = floorInfo.type === 'executive';
    slab.style.cssText = `
      --depth: ${isExec ? 11 : 9}px;
      --side-w: ${isExec ? 11 : 9}px;
      animation: slabBreathe ${2.2 + idx * 0.12}s ease-in-out ${idx * 0.06}s infinite;
    `;

    // Color variant for lobby / executive floors
    let topBg = 'linear-gradient(135deg, #2a1a10 0%, #221409 100%)';
    if (floorInfo.type === 'lobby')     topBg = 'linear-gradient(135deg, #1a2e1a 0%, #152415 100%)';
    if (floorInfo.type === 'executive') topBg = 'linear-gradient(135deg, #3a1e0c 0%, #2a1608 100%)';

    // Short label for the slab face
    const shortLabel = floorInfo.label.length > 24 ? floorInfo.label.substring(0,22)+'…' : floorInfo.label;

    slab.innerHTML = `
      <div class="slab-top" style="background:${topBg}">
        <div class="slab-floor-num">F${floorNum}</div>
        <div class="slab-dept-name">${shortLabel}</div>
      </div>
      <div class="slab-front"></div>
      <div class="slab-side"></div>
      <div class="slab-float-label">${shortLabel}</div>`;

    // Hover tooltip
    slab.addEventListener('mouseenter', (e) => {
      if (tooltip) {
        document.getElementById('isoTooltipFloor').textContent = `Floor ${floorNum} · ${tower === 'admin' ? 'Administration' : 'Courts'} Tower`;
        document.getElementById('isoTooltipDept').textContent  = floorInfo.dept.split(',')[0].trim();
        tooltip.classList.add('visible');
      }
    });
    slab.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.remove('visible');
    });

    // Click to select
    slab.addEventListener('click', () => {
      selectIsoFloor(floorNum, tower);
    });

    building.appendChild(slab);
  });

  // Ground plate
  const ground = document.createElement('div');
  ground.className = 'iso-ground';
  ground.innerHTML = `<div class="iso-ground-label">WOODWARD AVE · GROUND LEVEL</div>`;
  building.appendChild(ground);

  // Re-select if there was an active floor
  if (isoActiveFloor && data[isoActiveFloor]) {
    setTimeout(() => selectIsoFloor(isoActiveFloor, tower, false), 100);
  }
}

/* ── SELECT ISO FLOOR ───────────────────────────────────────── */
function selectIsoFloor(floorNum, tower, showCard = true) {
  isoActiveFloor = floorNum;

  // Clear all active states
  $$('.floor-slab').forEach(s => s.classList.remove('active'));

  // Activate the slab
  const target = $(`.floor-slab[data-floor="${floorNum}"][data-tower="${tower}"]`);
  if (target) target.classList.add('active');

  // Show navigation result card
  if (showCard) showNavResult(floorNum, tower);

  // Hide tooltip
  const tooltip = document.getElementById('isoTooltip');
  if (tooltip) tooltip.classList.remove('visible');
}

/* ── SHOW NAV RESULT CARD ───────────────────────────────────── */
function showNavResult(floorNum, tower) {
  const card    = document.getElementById('navResultCard');
  const numEl   = document.getElementById('navFloorNum');
  const lbl     = document.getElementById('navFloorLabel');
  const dept    = document.getElementById('navDeptName');
  const room    = document.getElementById('navRoomLabel');
  const details = document.getElementById('navDetails');

  if (!card) return;

  const info = FLOOR_DATA[tower][floorNum];
  if (!info) return;

  numEl.textContent  = floorNum;
  lbl.textContent    = `${tower === 'admin' ? 'Administration' : 'Courts'} Tower`;
  dept.textContent   = info.label;
  room.textContent   = `${info.room} · ${tower === 'admin' ? 'Admin' : 'Courts'} Tower`;

  details.innerHTML = `
    <div class="nav-detail-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13 19.79 19.79 0 0 1 1.72 4.4 2 2 0 0 1 3.69 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${info.phone}</div>
    <div class="nav-detail-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${info.hours}</div>
    <div class="nav-detail-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>${info.dept}</div>`;

  card.classList.add('visible');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ── NEEDS MATCH ────────────────────────────────────────────── */
function matchFloor(query) {
  const text = query.toLowerCase().trim();
  let found = null;

  for (const [key, val] of Object.entries(NEEDS_MAP)) {
    if (text.includes(key)) { found = val; break; }
  }

  if (!found) {
    if (text.includes('tax') || text.includes('treasurer'))        found = NEEDS_MAP['property tax'];
    else if (text.includes('permit') || text.includes('building')) found = NEEDS_MAP['building permit'];
    else if (text.includes('court') || text.includes('hearing'))   found = NEEDS_MAP['court hearing'];
    else if (text.includes('ticket'))                              found = NEEDS_MAP['parking ticket'];
    else if (text.includes('birth') || text.includes('vital'))     found = NEEDS_MAP['birth certificate'];
    else if (text.includes('marriage') || text.includes('marry'))  found = NEEDS_MAP['marriage license'];
    else if (text.includes('passport'))                            found = NEEDS_MAP['passport'];
    else if (text.includes('vote') || text.includes('election'))   found = NEEDS_MAP['voter registration'];
    else if (text.includes('child support') || text.includes('custody')) found = NEEDS_MAP['child support'];
    else if (text.includes('small claim'))                         found = NEEDS_MAP['small claims'];
    else if (text.includes('evict') || text.includes('landlord'))  found = NEEDS_MAP['eviction'];
    else if (text.includes('name change') || text.includes('legal name')) found = NEEDS_MAP['name change'];
    else if (text.includes('probate'))                             found = NEEDS_MAP['probate court'];
    else if (text.includes('mayor'))                               found = NEEDS_MAP['mayor'];
    else if (text.includes('council'))                             found = NEEDS_MAP['city council'];
    else if (text.includes('plan') || text.includes('zoning'))     found = NEEDS_MAP['planning'];
    else if (text.includes('law') || text.includes('legal') || text.includes('attorney')) found = NEEDS_MAP['law'];
    else if (text.includes('hr') || text.includes('human resource')) found = NEEDS_MAP['human resources'];
    else if (text.includes('dwjba') || text.includes('authority')) found = NEEDS_MAP['dwjba'];
    else if (text.includes('security') || text.includes('lobby'))  found = NEEDS_MAP['security'];
    else if (text.includes('snap') || text.includes('food stamp')) found = NEEDS_MAP['snap'];
    else if (text.includes('deed') || text.includes('recording'))  found = NEEDS_MAP['deed recording'];
    else if (text.includes('notary'))                              found = NEEDS_MAP['notary'];
    else if (text.includes('juror') || text.includes('jury'))      found = NEEDS_MAP['juror'];
  }

  if (found) {
    // Switch tower if needed
    if (found.tower !== isoTower) {
      isoTower = found.tower;
      // Update tower tab UI
      $$('.tower-tab').forEach(t => t.classList.toggle('active', t.dataset.tower === found.tower));
      document.getElementById('isoTowerName') && (document.getElementById('isoTowerName').textContent = found.tower === 'admin' ? 'ADMINISTRATION TOWER' : 'COURTS TOWER');
      buildIsoTower(found.tower);
      setTimeout(() => selectIsoFloor(found.floor, found.tower), 350);
    } else {
      selectIsoFloor(found.floor, found.tower);
    }

    // Deactivate all need chips, activate the matched one
    $$('.need-chip').forEach(c => c.classList.remove('active'));
  } else {
    // Show fallback in result card
    const card = document.getElementById('navResultCard');
    const dept = document.getElementById('navDeptName');
    const details = document.getElementById('navDetails');
    if (card && dept) {
      card.classList.add('visible');
      document.getElementById('navFloorNum').textContent = '?';
      document.getElementById('navFloorLabel').textContent = 'No match found';
      dept.textContent = 'Try a different search term';
      details.innerHTML = `<div class="nav-detail-row" style="color:rgba(255,255,255,0.5);">Try: "property taxes", "parking ticket", "court hearing", "mayor's office", or "child support"</div>`;
    }
  }
}

/* ── INIT FLOOR NAVIGATOR ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Floor search
  const floorSearch = document.getElementById('floorSearch');
  if (floorSearch) {
    floorSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') matchFloor(floorSearch.value);
    });
  }

  // Need chips
  $$('.need-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.need-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const need = chip.dataset.need;
      if (floorSearch) floorSearch.value = need;
      if (!isoBuilt) buildIsoTower('admin');
      matchFloor(need);
    });
  });

  // Tower tabs
  const adminTab  = document.getElementById('adminTowerTab');
  const courtsTab = document.getElementById('courtsTowerTab');

  if (adminTab) {
    adminTab.addEventListener('click', () => {
      isoTower = 'admin';
      isoActiveFloor = null;
      adminTab.classList.add('active');
      courtsTab && courtsTab.classList.remove('active');
      document.getElementById('navResultCard')?.classList.remove('visible');

      // Transition
      const building = document.getElementById('isoBuilding');
      if (building) {
        building.classList.add('transitioning');
        setTimeout(() => {
          buildIsoTower('admin');
          building.classList.remove('transitioning');
        }, 350);
      }
    });
  }

  if (courtsTab) {
    courtsTab.addEventListener('click', () => {
      isoTower = 'courts';
      isoActiveFloor = null;
      courtsTab.classList.add('active');
      adminTab && adminTab.classList.remove('active');
      document.getElementById('navResultCard')?.classList.remove('visible');

      const building = document.getElementById('isoBuilding');
      if (building) {
        building.classList.add('transitioning');
        setTimeout(() => {
          buildIsoTower('courts');
          building.classList.remove('transitioning');
        }, 350);
      }
    });
  }

  // Auto-build when floor panel tab is clicked (handled in tab init above via isoBuilt flag)
  // Also build on load if floor panel is visible
  if (document.getElementById('floor-panel') && document.getElementById('floor-panel').style.display !== 'none') {
    buildIsoTower('admin');
  }
});
