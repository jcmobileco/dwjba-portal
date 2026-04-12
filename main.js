/* =============================================================
   DWJBA — Coleman A. Young Municipal Center
   main.js — Complete JS for site interactions
   ============================================================= */

'use strict';

/* ── UTILITIES ──────────────────────────────────────────────── */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );
  const startObserving = () => {
    $$('.reveal').forEach(el => observer.observe(el));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
})();

/* ── STICKY NAV + SCROLL SHADOW ────────────────────────────── */
(function initNav() {
  const navBar = document.getElementById('navBar');
  if (!navBar) return;
  function onScroll() {
    navBar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE NAV ─────────────────────────────────────────────── */
(function initMobileNav() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('mobileNavClose');
  const scrim = document.getElementById('scrim');
  if (!menuBtn || !mobileNav) return;

  function open() {
    mobileNav.classList.add('open');
    scrim && scrim.classList.add('visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    mobileNav.classList.remove('open');
    scrim && scrim.classList.remove('visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  scrim && scrim.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ── LUCIDE ICONS ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/* =============================================================
   ASK CAYMC — CHATBOT
   ============================================================= */

const KB = {
  hours: ['hour', 'open', 'close', 'closing', 'schedule', 'time', 'when'],
  parking: ['park', 'garage', 'lot', 'car', 'vehicle', 'drive'],
  security: ['security', 'guard', 'id', 'identification', 'checkpoint', 'enter', 'access', 'badge', 'scan'],
  accessibility: ['ada', 'accessibility', 'accessible', 'wheelchair', 'disability', 'disabled', 'elevator', 'lift'],
  mayor: ['mayor', 'duggan', 'mayor\'s office', 'city executive'],
  taxes: ['tax', 'taxes', 'property tax', 'pay tax', 'treasurer', 'revenue'],
  courts: ['court', 'courtroom', 'hearing', 'judge', 'docket', 'circuit', 'probate', 'district', 'lawsuit', 'case'],
  parking_ticket: ['parking ticket', 'ticket', 'citation', 'fine', 'violation'],
  birth: ['birth', 'certificate', 'vital', 'record', 'born'],
  business: ['business', 'license', 'permit', 'zoning', 'bseed', 'building permit', 'dba', 'register'],
  voter: ['vote', 'voter', 'registration', 'election', 'ballot', 'clerk'],
  procurement: ['procurement', 'bid', 'rfp', 'vendor', 'contract', 'rfq', 'solicitation'],
  spirit: ['spirit', 'statue', 'bronze', 'fredericks', 'plaza', 'sculpture'],
  dwjba: ['dwjba', 'authority', 'building authority', 'who runs', 'management', 'hines'],
  transit: ['bus', 'people mover', 'transit', 'ddot', 'smart bus', 'train', 'transportation', 'get here', 'directions'],
  caymc: ['caymc', 'municipal center', 'city county', 'coleman', 'young'],
  departments: ['department', 'office', 'where is', 'find', 'locate', 'directory'],
  contact: ['contact', 'phone', 'email', 'call', 'reach', 'number', 'address'],
  food: ['food', 'eat', 'cafeteria', 'lunch', 'coffee', 'restaurant', 'cafe'],
  emergency: ['emergency', 'fire', 'medical', '911', 'help', 'urgent'],
};

const RESPONSES = {
  hours: `The Coleman A. Young Municipal Center (CAYMC) is open Monday–Friday from 7:00 AM to 6:00 PM. The building is closed on weekends and all City of Detroit official holidays.\n\nThe Courts Tower hours may vary by individual courtroom — please check with your specific court for exact times.\n\nThe Spirit of Detroit Plaza on the north side of the building is accessible 24 hours a day, 7 days a week.`,

  parking: `Parking options near CAYMC:\n\n• **CAYMC Parking Structure** — Enter from Randolph St. Discounted rates available with building validation from most offices.\n• **Street Parking** — Metered parking is available on Woodward Ave, Jefferson Ave, and surrounding streets.\n• **Detroit People Mover** — The Cadillac Center station is directly adjacent to the building — the most convenient option.\n• **DDOT/SMART Bus** — Multiple routes stop on Woodward Ave, just outside the main entrance.\n\nFor accessibility parking, marked ADA spaces are available in the CAYMC parking structure.`,

  security: `All visitors to CAYMC must:\n\n• Present a valid government-issued photo ID at security checkpoints\n• Pass through metal detectors at building entrances\n• Submit bags for screening\n\nThe main accessible entrance is at ground level on Woodward Ave. Additional entrances are located on Jefferson Ave.\n\nProhibited items include weapons, hazardous materials, and unauthorized recording equipment. For security emergencies, call (313) 309-2300.`,

  accessibility: `CAYMC is committed to full ADA compliance:\n\n• **Accessible Entrance** — Ground level on Woodward Ave, fully accessible\n• **Elevators** — Available in both towers to all floors\n• **Accessible Parking** — ADA spaces in the CAYMC parking structure\n• **Assistive Listening** — Available; contact building management\n• **Large Print Materials** — Available upon request\n• **Sign Language Interpretation** — Request 48 hours in advance: (313) 224-6740\n• **Service Animals** — Welcome\n\nFor ADA accommodation requests, contact the ADA Coordinator at (313) 224-6740.`,

  mayor: `The **Mayor's Office** is located on the **11th Floor, Room 1100** of the Administration Tower.\n\n📞 Phone: (313) 224-3400\n🕒 Hours: Monday–Friday, 8:00 AM – 5:00 PM\n\nFor appointments or general city executive inquiries, call the main number or visit the 11th floor directly.`,

  taxes: `For property tax payments and inquiries:\n\n**Wayne County Treasurer's Office**\n📍 3rd Floor, Room 300 — Administration Tower\n📞 (313) 224-5990\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nServices include: property tax payments, tax certificates, payment plans, and delinquent tax information.\n\nOnline payments are also available at waynecounty.com. For City of Detroit tax matters, the Detroit Finance Department is on the 5th Floor, (313) 224-3263.`,

  courts: `CAYMC's Courts Tower (20 floors) houses multiple court systems:\n\n• **Wayne County Circuit Court** — Floors 4–20, (313) 224-5261\n• **36th District Court** — Lower Level, (313) 965-8720\n• **Wayne County Probate Court** — 2nd Floor, (313) 224-5706\n• **Friend of the Court** — 3rd Floor, (313) 224-2390\n• **Court Clerk's Office** — 2nd Floor, (313) 224-5261\n\nAll courts are generally open Monday–Friday 8:00 AM – 4:00 PM. Check with your specific court for current hearing schedules.`,

  parking_ticket: `To dispute or pay a parking citation:\n\n**Detroit Parking Violations Bureau**\n📍 Ground Floor, Administration Tower\n📞 (313) 224-2130\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nYou can also pay parking tickets online at the City of Detroit's official website. For in-person hearings, bring your citation notice and any evidence to support your appeal.`,

  birth: `For birth certificates and vital records:\n\n**City of Detroit Vital Records**\n📍 Ground Floor, Room 101, Administration Tower\n📞 (313) 876-4800\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nBring: valid photo ID, completed request form, and required fee ($15 for standard certificate).\n\nProcessing time: same-day for in-person requests. For certified copies, additional fees may apply.`,

  business: `For business licenses and permits:\n\n**Detroit Building, Safety Engineering & Environmental Department (BSEED)**\n📍 4th Floor, Administration Tower\n📞 (313) 224-3158\n🕒 Monday–Friday, 8:00 AM – 5:00 PM\n\nServices: building permits, certificates of occupancy, zoning variances, business license applications, and contractor licensing.\n\nThe Detroit Finance Department (5th Floor, (313) 224-3263) handles DBA registrations and business tax compliance.`,

  voter: `For voter registration and election services:\n\n**Detroit City Clerk's Office**\n📍 Ground Floor, Room 200, Administration Tower\n📞 (313) 224-3260\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nServices: voter registration, absentee ballots, election records, and city records.\n\nYou can also register online at Michigan.gov/vote. Bring a valid Michigan ID or driver's license for in-person registration.`,

  procurement: `DWJBA Procurement opportunities:\n\n**DWJBA Administrative Office — Procurement**\n📍 Suite 1314, Administration Tower\n📞 (313) 309-2300\n📧 info@dwjba.com\n\nCurrent active RFPs, RFQs, and IFBs are posted on the DWJBA Procurement page. For vendor registration, visit procurement.html.\n\nFor Wayne County procurement opportunities, contact the Wayne County Procurement office on the 4th Floor of the Courts Tower, (313) 224-5804.`,

  spirit: `The **Spirit of Detroit** is a 26-foot cast bronze sculpture by Marshall Fredericks, dedicated July 26, 1958. It stands on the north facade of CAYMC at Woodward Ave & Jefferson Ave.\n\n• Weight: ~16 tons\n• Material: Cast bronze (foundry in Berlin, Germany)\n• The kneeling figure holds a gilded sphere (representing God) and a family grouping\n• The Spirit is one of the largest cast bronze statues in the world\n\nThe Spirit of Detroit Plaza is open 24/7. For events or plaza rental inquiries, contact DWJBA at (313) 309-2300.`,

  dwjba: `The **Detroit-Wayne Joint Building Authority (DWJBA)** is the bi-governmental authority responsible for managing and maintaining the Coleman A. Young Municipal Center.\n\n• Established: 1955\n• CEO: Clarinda Barnett-Harrison (first woman in the role, 21+ years experience)\n• Property Manager: Hines (since 2005)\n• Awards: 3× EPA Energy Star | BOMA TOBY Award\n\n📍 Suite 1314, Administration Tower\n📞 (313) 309-2300\n📧 info@dwjba.com\n\nThe Board of Commissioners includes appointees from both the City of Detroit and Wayne County.`,

  transit: `Transportation options to reach CAYMC (2 Woodward Ave):\n\n**Detroit People Mover**\n• Cadillac Center Station — directly adjacent to CAYMC (recommended)\n\n**DDOT/SMART Bus**\n• Multiple routes stop on Woodward Ave directly outside the building\n\n**By Car**\n• From I-75 North: Exit 50B toward Gratiot, follow signs to Woodward\n• From I-96: Exit 53A (Lodge Freeway South), follow Jefferson to Woodward\n\n**Parking**\n• CAYMC Parking Structure (enter from Randolph St)\n• Metered street parking on surrounding streets`,

  caymc: `The **Coleman A. Young Municipal Center (CAYMC)** is Detroit's landmark seat of city and county government, managed by DWJBA.\n\n**Facts:**\n• Designed by Harley, Ellington & Day\n• Completed: 1955\n• Total: 780,000 sq. ft.\n• Administration Tower: 14 floors, 197 ft.\n• Courts Tower: 20 floors, 318 ft.\n• 70+ city and county departments\n\n📍 2 Woodward Ave, Detroit, MI 48226\n📞 Main: (313) 224-3540\n📞 DWJBA: (313) 309-2300\n\nNamed after Detroit's first African American mayor, Coleman A. Young, in 1976.`,

  departments: `The Coleman A. Young Municipal Center houses departments across two towers:\n\n**Administration Tower (14 floors):**\nMayor's Office (11), City Council (13), City Clerk (G), Finance (5), Law (9-10), Human Resources (5), Budget (9), Planning (7), BSEED/Permits (4)\n\n**Courts Tower (20 floors):**\nWayne County Circuit Court (4-20), 36th District Court (Lower), Probate Court (2), Friend of the Court (3)\n\nFor the full directory with room numbers and phone numbers, visit the Department Directory page, or ask me about any specific department!`,

  contact: `DWJBA Contact Information:\n\n📍 **Address:** 2 Woodward Ave, Suite 1314, Detroit, MI 48226\n📞 **Main Line:** (313) 309-2300\n📞 **Building Info:** (313) 224-3540\n📧 **General:** info@dwjba.com\n📧 **Commissioners:** commissioners@dwjba.com\n\n**Building Hours:** Monday–Friday 7:00 AM – 6:00 PM\n\nFor specific department contacts, visit the Department Directory or ask me about the department you need to reach.`,

  food: `Dining options at CAYMC:\n\n**Building Cafeteria**\n📍 Ground Floor, Administration Tower\n🕒 Monday–Friday, 7:00 AM – 3:00 PM\nOffers hot breakfast, lunch, sandwiches, salads, and daily specials.\n\n**Nearby Options**\nDowntown Detroit has many dining options within walking distance, including Campus Martius Park (2 blocks) and Greektown (5 minutes away).\n\nFor food truck schedules and special events in the plaza, contact DWJBA at (313) 309-2300.`,

  emergency: `**In an emergency, always call 911 first.**\n\nFor building security emergencies at CAYMC:\n📞 Security Desk: (313) 309-2300 ext. 100 (available 24/7)\n\nEmergency exits are clearly marked on all floors. Assembly points are designated on the surrounding sidewalks.\n\nFor non-emergency security concerns, contact the Security Desk in the main lobby (1st Floor) or call (313) 309-2300.`,

  default: `I'm here to help with anything related to the Coleman A. Young Municipal Center. I can tell you:\n\n• Where any department or office is located\n• Building hours and visitor information\n• Parking and transportation options\n• Payment and permit services\n• Court information\n• Spirit of Detroit and DWJBA history\n\nCould you tell me more about what you're looking for? I'll find the right information for you.`,
};

function matchResponse(input) {
  const text = input.toLowerCase();
  // Check combined phrases first (highest priority)
  if (text.includes('parking ticket') || text.includes('citation') || text.includes('pay a ticket') || text.includes('dismiss')) return RESPONSES.parking_ticket;
  if (text.includes('birth cert') || text.includes('vital record') || text.includes('born')) return RESPONSES.birth;
  if (text.includes('business license') || text.includes('building permit') || text.includes('bseed') || text.includes('zoning')) return RESPONSES.business;
  if (text.includes('property tax') || text.includes('pay tax') || text.includes('treasurer')) return RESPONSES.taxes;
  if (text.includes('voter reg') || text.includes('city clerk') || text.includes('absentee')) return RESPONSES.voter;
  if (text.includes('people mover') || text.includes('how do i get') || text.includes('directions') || text.includes('take the bus')) return RESPONSES.transit;

  // Keyword scoring
  const scores = {};
  for (const [key, words] of Object.entries(KB)) {
    scores[key] = 0;
    for (const word of words) {
      if (text.includes(word)) scores[key] += word.split(' ').length; // multi-word phrases score higher
    }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best[1] > 0 && RESPONSES[best[0]]) return RESPONSES[best[0]];
  return RESPONSES.default;
}

function formatResponse(text) {
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Convert • bullet lists to <ul>
  const lines = text.split('\n');
  let html = '';
  let inList = false;
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

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function appendMsg(text, role) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const wrap = document.createElement('div');
  wrap.className = `chat-msg-wrap ${role === 'bot' ? 'bot-wrap' : 'user-wrap'}`;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;

  if (role === 'bot') {
    const label = document.createElement('span');
    label.className = 'chat-msg-bot-label';
    label.textContent = 'Ask CAYMC';
    bubble.appendChild(label);
    const content = document.createElement('div');
    content.className = 'chat-bubble-content';
    content.innerHTML = formatResponse(text);
    bubble.appendChild(content);
  } else {
    bubble.textContent = text;
  }

  const time = document.createElement('span');
  time.className = 'chat-time';
  time.textContent = getTime();
  bubble.appendChild(time);

  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;

  // Re-init Lucide icons for any new icons in message
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showTyping() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return null;

  const wrap = document.createElement('div');
  wrap.className = 'chat-msg-wrap bot-wrap';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `<div class="chat-bubble bot"><span class="chat-msg-bot-label">Ask CAYMC</span><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
  return wrap;
}

function handleChatInput() {
  const input = document.getElementById('chatInput');
  const suggestions = document.getElementById('chatSuggestions');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  if (suggestions) suggestions.style.display = 'none';

  appendMsg(text, 'user');

  const typing = showTyping();
  const delay = 600 + Math.random() * 800;

  setTimeout(() => {
    if (typing) typing.remove();
    const response = matchResponse(text);
    appendMsg(response, 'bot');
  }, delay);
}

// Init chatbot
document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const suggestions = document.getElementById('chatSuggestions');

  if (sendBtn) sendBtn.addEventListener('click', handleChatInput);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleChatInput();
    });
  }

  // Suggestion chips
  if (suggestions) {
    $$('.suggestion-btn', suggestions).forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        if (input) input.value = q;
        handleChatInput();
      });
    });
  }
});

/* =============================================================
   AI TABS (caymc-panel / floor-panel)
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = $$('.ai-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.panel;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.ai-panel').forEach(p => {
        p.style.display = p.id === panelId ? '' : 'none';
      });
    });
  });
});

/* =============================================================
   INTERACTIVE FLOOR NAVIGATOR
   ============================================================= */

const FLOORS = {
  admin: {
    1:  { label: 'Lobby / Information / Security', depts: ['security', 'info desk', 'building management', 'atm', 'main entrance'] },
    2:  { label: 'Public Services', depts: ['vital records alternative access', 'general services'] },
    3:  { label: 'Wayne County Treasurer / CRIO', depts: ['wayne county treasurer', 'property taxes', 'tax payments', 'crio'] },
    4:  { label: 'BSEED / Building Permits', depts: ['building permits', 'bseed', 'safety engineering', 'zoning', 'certificates of occupancy'] },
    5:  { label: 'Finance / Human Resources', depts: ['finance', 'human resources', 'hr', 'payroll', 'budget support'] },
    6:  { label: 'City Departments', depts: ['general city offices', 'administration'] },
    7:  { label: 'Planning & Development', depts: ['planning', 'development', 'neighborhood', 'city planning'] },
    8:  { label: 'City Departments', depts: ['city departments', 'general administration'] },
    9:  { label: 'Budget / Law Department', depts: ['budget', 'law department', 'city attorneys', 'legal'] },
    10: { label: 'Law Department', depts: ['law', 'corporation counsel', 'legal services'] },
    11: { label: 'Mayor\'s Office', depts: ["mayor's office", 'mayor', 'city executive', 'executive office'] },
    12: { label: 'City Administration', depts: ['city administration', 'administrative offices'] },
    13: { label: 'City Council / DWJBA', depts: ['city council', 'dwjba', 'building authority', 'council chambers'] },
    14: { label: 'Executive / Commissioners', depts: ['executive', 'commissioners', 'city controller'] },
  },
  courts: {
    1:  { label: 'Courts Lobby / Security', depts: ['courts entrance', 'security', 'information'] },
    2:  { label: 'Probate Court / Clerk', depts: ['probate', 'probate court', 'court clerk', 'filing'] },
    3:  { label: 'Friend of the Court', depts: ['friend of the court', 'child support', 'custody', 'parenting time'] },
    4:  { label: 'Circuit Court', depts: ['circuit court', 'civil', 'filing'] },
    5:  { label: 'Circuit Court', depts: ['circuit court', 'civil cases'] },
    6:  { label: 'Circuit Court', depts: ['circuit court', 'courtrooms'] },
    7:  { label: 'Circuit Court / County Exec', depts: ['circuit court', 'wayne county executive', 'county government'] },
    8:  { label: 'Circuit Court', depts: ['circuit court', 'hearings'] },
    9:  { label: 'Circuit Court', depts: ['circuit court'] },
    10: { label: 'Circuit Court', depts: ['circuit court', 'civil courtrooms'] },
    11: { label: 'Circuit Court', depts: ['circuit court', 'criminal division'] },
    12: { label: 'Circuit Court', depts: ['circuit court'] },
    13: { label: 'Circuit Court', depts: ['circuit court'] },
    14: { label: 'Circuit Court', depts: ['circuit court'] },
    15: { label: 'Circuit Court', depts: ['circuit court'] },
    16: { label: 'Circuit Court', depts: ['circuit court'] },
    17: { label: 'Circuit Court', depts: ['circuit court'] },
    18: { label: 'Circuit Court', depts: ['circuit court'] },
    19: { label: 'Circuit Court — Upper Floors', depts: ['circuit court', 'felony cases'] },
    20: { label: 'Chief Judges / Administration', depts: ['chief judge', 'court administration', 'judicial council'] },
  }
};

const NEEDS_MAP = {
  'property tax': { tower: 'admin', floor: 3 },
  'property taxes': { tower: 'admin', floor: 3 },
  'pay tax': { tower: 'admin', floor: 3 },
  'tax payment': { tower: 'admin', floor: 3 },
  'parking ticket': { tower: 'admin', floor: 1 },
  'parking citation': { tower: 'admin', floor: 1 },
  'birth certificate': { tower: 'admin', floor: 2 },
  'vital records': { tower: 'admin', floor: 2 },
  'court hearing': { tower: 'courts', floor: 4 },
  'court': { tower: 'courts', floor: 4 },
  'jury duty': { tower: 'courts', floor: 4 },
  'business license': { tower: 'admin', floor: 4 },
  'building permit': { tower: 'admin', floor: 4 },
  'permit': { tower: 'admin', floor: 4 },
  'zoning': { tower: 'admin', floor: 7 },
  'mayor': { tower: 'admin', floor: 11 },
  "mayor's office": { tower: 'admin', floor: 11 },
  'mayor office': { tower: 'admin', floor: 11 },
  'city council': { tower: 'admin', floor: 13 },
  'voter registration': { tower: 'admin', floor: 1 },
  'vote': { tower: 'admin', floor: 1 },
  'child support': { tower: 'courts', floor: 3 },
  'probate': { tower: 'courts', floor: 2 },
  'human resources': { tower: 'admin', floor: 5 },
  'planning': { tower: 'admin', floor: 7 },
  'law': { tower: 'admin', floor: 9 },
  'legal': { tower: 'admin', floor: 9 },
  'budget': { tower: 'admin', floor: 9 },
  'treasurer': { tower: 'admin', floor: 3 },
  'dwjba': { tower: 'admin', floor: 13 },
  'security': { tower: 'admin', floor: 1 },
  'lobby': { tower: 'admin', floor: 1 },
};

let activeTower = 'admin';
let activeFloor = null;

function selectFloor(tower, floor) {
  activeTower = tower;
  activeFloor = floor;
  const floorData = FLOORS[tower][floor];
  if (!floorData) return;

  // Update SVG highlights
  $$('.floor-rect').forEach(rect => {
    rect.style.fill = rect.dataset.defaultFill;
    rect.style.stroke = 'none';
  });

  // Highlight selected
  const target = $(`.floor-rect[data-floor="${floor}"][data-tower="${tower}"]`);
  if (target) {
    target.style.fill = '#2b5228';
    target.style.stroke = '#1e3c1c';
    target.style.strokeWidth = '2';
  }

  // Update tower tabs
  $$('.floor-tower-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tower === tower);
  });

  // Update detail panel
  const numEl = document.getElementById('floorDetailNum');
  const towerEl = document.getElementById('floorDetailTower');
  const bodyEl = document.getElementById('floorDetailBody');

  if (numEl) numEl.textContent = `Floor ${floor}`;
  if (towerEl) towerEl.textContent = `${tower === 'admin' ? 'Administration' : 'Courts'} Tower — ${floorData.label}`;
  if (bodyEl) {
    const depts = floorData.depts.join(', ');
    bodyEl.innerHTML = `<p><strong>Floor ${floor}</strong> — ${floorData.label}</p><p class="floor-detail-depts">Offices include: ${depts}</p>`;
  }
}

function showAdminTower() {
  $$('.floor-rect[data-tower="courts"]').forEach(r => r.closest('text') ? null : r.parentElement.style.display = 'none');
  const svg = document.getElementById('floorMapSvg');
  if (!svg) return;
  // Just re-render admin — the SVG only shows admin by default
}

function renderCourtsTower() {
  const svg = document.getElementById('floorMapSvg');
  if (!svg) return;

  // Clear
  svg.innerHTML = '';

  // Render 20 courts floors
  const totalFloors = 20;
  const floorH = 22;
  const gap = 2;
  const svgH = totalFloors * (floorH + gap) + 60;
  svg.setAttribute('viewBox', `0 0 260 ${svgH}`);

  for (let f = totalFloors; f >= 1; f--) {
    const y = (totalFloors - f) * (floorH + gap) + 10;
    const floorData = FLOORS.courts[f];
    const label = floorData ? floorData.label : `Floor ${f}`;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'floor-rect');
    rect.setAttribute('data-floor', f);
    rect.setAttribute('data-tower', 'courts');
    rect.setAttribute('data-default-fill', f === 1 ? '#d0e8cc' : '#e8cdb8');
    rect.setAttribute('x', '30');
    rect.setAttribute('y', y);
    rect.setAttribute('width', '200');
    rect.setAttribute('height', floorH);
    rect.setAttribute('rx', '3');
    rect.style.fill = f === 1 ? '#d0e8cc' : '#e8cdb8';
    rect.style.cursor = 'pointer';
    rect.style.transition = 'fill 0.25s';
    svg.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '130');
    text.setAttribute('y', y + floorH - 7);
    text.setAttribute('class', 'floor-label');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = `${f} — ${label.substring(0, 28)}`;
    svg.appendChild(text);
  }

  const groundY = totalFloors * (floorH + gap) + 10;
  const gr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  gr.setAttribute('x', '30'); gr.setAttribute('y', groundY);
  gr.setAttribute('width', '200'); gr.setAttribute('height', '4');
  gr.setAttribute('fill', '#3d1a0a'); gr.setAttribute('rx', '1');
  svg.appendChild(gr);

  const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  lbl.setAttribute('x', '130'); lbl.setAttribute('y', groundY + 20);
  lbl.setAttribute('class', 'floor-label floor-tower-label');
  lbl.setAttribute('text-anchor', 'middle');
  lbl.textContent = 'COURTS TOWER (20 Floors)';
  svg.appendChild(lbl);

  bindFloorClicks();
  if (activeFloor && activeTower === 'courts') {
    selectFloor('courts', activeFloor);
  }
}

function renderAdminTower() {
  const svg = document.getElementById('floorMapSvg');
  if (!svg) return;

  svg.innerHTML = '';
  const totalFloors = 14;
  const floorH = 28;
  const gap = 4;
  const svgH = totalFloors * (floorH + gap) + 60;
  svg.setAttribute('viewBox', `0 0 260 ${svgH}`);

  for (let f = totalFloors; f >= 1; f--) {
    const y = (totalFloors - f) * (floorH + gap) + 10;
    const floorData = FLOORS.admin[f];
    const label = floorData ? floorData.label : `Floor ${f}`;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'floor-rect');
    rect.setAttribute('data-floor', f);
    rect.setAttribute('data-tower', 'admin');
    rect.setAttribute('data-default-fill', f === 1 ? '#d0e8cc' : '#e8cdb8');
    rect.setAttribute('x', '30'); rect.setAttribute('y', y);
    rect.setAttribute('width', '200'); rect.setAttribute('height', floorH);
    rect.setAttribute('rx', '3');
    rect.style.fill = f === 1 ? '#d0e8cc' : '#e8cdb8';
    rect.style.cursor = 'pointer';
    rect.style.transition = 'fill 0.25s';
    svg.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '130');
    text.setAttribute('y', y + floorH - 8);
    text.setAttribute('class', 'floor-label');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = `${f} — ${label.substring(0, 28)}`;
    svg.appendChild(text);
  }

  const groundY = totalFloors * (floorH + gap) + 10;
  const gr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  gr.setAttribute('x', '30'); gr.setAttribute('y', groundY);
  gr.setAttribute('width', '200'); gr.setAttribute('height', '4');
  gr.setAttribute('fill', '#3d1a0a'); gr.setAttribute('rx', '1');
  svg.appendChild(gr);

  const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  lbl.setAttribute('x', '130'); lbl.setAttribute('y', groundY + 20);
  lbl.setAttribute('class', 'floor-label floor-tower-label');
  lbl.setAttribute('text-anchor', 'middle');
  lbl.textContent = 'ADMINISTRATION TOWER (14 Floors)';
  svg.appendChild(lbl);

  const groundLbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  groundLbl.setAttribute('x', '130'); groundLbl.setAttribute('y', groundY + 40);
  groundLbl.setAttribute('class', 'floor-label floor-label-ground');
  groundLbl.setAttribute('text-anchor', 'middle');
  groundLbl.textContent = 'GROUND LEVEL — WOODWARD AVE';
  svg.appendChild(groundLbl);

  bindFloorClicks();
  if (activeFloor && activeTower === 'admin') {
    selectFloor('admin', activeFloor);
  }
}

function bindFloorClicks() {
  $$('.floor-rect').forEach(rect => {
    rect.addEventListener('click', () => {
      const floor = parseInt(rect.dataset.floor);
      const tower = rect.dataset.tower;
      selectFloor(tower, floor);
    });
    rect.style.cursor = 'pointer';
  });
}

function handleNeedInput(query) {
  const text = query.toLowerCase().trim();
  let found = null;

  // Direct match
  for (const [key, val] of Object.entries(NEEDS_MAP)) {
    if (text.includes(key)) {
      found = val;
      break;
    }
  }

  if (!found) {
    // Keyword fallback
    if (text.includes('tax') || text.includes('treasurer')) found = NEEDS_MAP['property tax'];
    else if (text.includes('permit') || text.includes('building')) found = NEEDS_MAP['building permit'];
    else if (text.includes('court') || text.includes('judge') || text.includes('hearing')) found = NEEDS_MAP['court hearing'];
    else if (text.includes('ticket') || text.includes('citation')) found = NEEDS_MAP['parking ticket'];
    else if (text.includes('birth') || text.includes('vital')) found = NEEDS_MAP['birth certificate'];
    else if (text.includes('vote') || text.includes('voter') || text.includes('election')) found = NEEDS_MAP['voter registration'];
    else if (text.includes('child support') || text.includes('custody')) found = NEEDS_MAP['child support'];
    else if (text.includes('mayor')) found = NEEDS_MAP['mayor'];
    else if (text.includes('council')) found = NEEDS_MAP['city council'];
    else if (text.includes('plan') || text.includes('zoning') || text.includes('develop')) found = NEEDS_MAP['zoning'];
    else if (text.includes('law') || text.includes('legal') || text.includes('attorney')) found = NEEDS_MAP['law'];
    else if (text.includes('hr') || text.includes('human resource') || text.includes('employment')) found = NEEDS_MAP['human resources'];
    else if (text.includes('dwjba') || text.includes('authority')) found = NEEDS_MAP['dwjba'];
    else if (text.includes('security') || text.includes('lobby') || text.includes('entrance')) found = NEEDS_MAP['security'];
  }

  if (found) {
    // Switch to right tower if needed
    if (found.tower !== activeTower) {
      activeTower = found.tower;
      if (found.tower === 'admin') renderAdminTower();
      else renderCourtsTower();
    }
    selectFloor(found.tower, found.floor);
  } else {
    const bodyEl = document.getElementById('floorDetailBody');
    if (bodyEl) {
      bodyEl.innerHTML = '<p>I\'m not sure which floor handles that. Try searching for specific services like "property taxes", "parking ticket", "court hearing", or "mayor\'s office". You can also use the <a href="directory.html">Department Directory</a> for a full listing.</p>';
    }
  }
}

// Init Floor Navigator
document.addEventListener('DOMContentLoaded', () => {
  // Floor search
  const floorSearch = document.getElementById('floorSearch');
  if (floorSearch) {
    floorSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleNeedInput(floorSearch.value);
    });
  }

  // Need chips
  $$('.floor-need-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const need = chip.dataset.need;
      if (floorSearch) floorSearch.value = need;
      handleNeedInput(need);
    });
  });

  // Tower tabs
  const adminTab = document.getElementById('adminTowerTab');
  const courtsTab = document.getElementById('courtsTowerTab');

  if (adminTab) {
    adminTab.addEventListener('click', () => {
      activeTower = 'admin';
      activeFloor = null;
      renderAdminTower();
      adminTab.classList.add('active');
      courtsTab && courtsTab.classList.remove('active');
    });
  }
  if (courtsTab) {
    courtsTab.addEventListener('click', () => {
      activeTower = 'courts';
      activeFloor = null;
      renderCourtsTower();
      courtsTab.classList.add('active');
      adminTab && adminTab.classList.remove('active');
    });
  }

  // Initial floor click binding
  bindFloorClicks();

  // Render admin tower on load (replace static SVG with dynamic)
  if (document.getElementById('floorMapSvg')) {
    renderAdminTower();
  }
});

/* =============================================================
   DIRECTORY SEARCH & FILTER
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const dirSearch = document.getElementById('dirSearch');
  const dirTabs = $$('.dir-tab');
  const dirCards = $$('.dir-card');
  const dirSections = $$('.dir-section');

  function filterDir() {
    const query = dirSearch ? dirSearch.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.dir-tab.active');
    const activeCat = activeTab ? activeTab.dataset.cat : 'all';

    dirCards.forEach(card => {
      const cat = card.dataset.cat;
      const text = card.textContent.toLowerCase();
      const catMatch = activeCat === 'all' || cat === activeCat;
      const textMatch = !query || text.includes(query);
      card.style.display = catMatch && textMatch ? '' : 'none';
    });

    // Show/hide sections
    dirSections.forEach(section => {
      const cat = section.dataset.cat;
      const sectionMatch = activeCat === 'all' || cat === activeCat;
      const hasVisible = $$('.dir-card', section).some(c => c.style.display !== 'none');
      section.style.display = sectionMatch && hasVisible ? '' : 'none';
    });
  }

  if (dirSearch) dirSearch.addEventListener('input', filterDir);

  dirTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dirTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterDir();
    });
  });
});

/* =============================================================
   CONTACT FORM
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
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

/* =============================================================
   NAV DROPDOWN HOVER
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  $$('.nav-has-drop').forEach(item => {
    const drop = item.querySelector('.nav-dropdown');
    if (!drop) return;
    item.addEventListener('mouseenter', () => drop.style.display = 'block');
    item.addEventListener('mouseleave', () => drop.style.display = '');
  });
});
