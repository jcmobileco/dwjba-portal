/**
 * DWJBA Ask CAYMC — Floating Chat Widget
 * Self-contained floating chat widget for the DWJBA website
 * Include with: <script src="chat-widget.js" defer></script>
 *
 * Config:
 *   window.CAYMC_TTS_ENDPOINT = '/api/tts'  (optional, default: /api/tts)
 */
(function () {
  'use strict';

  /* ─── Configuration ─────────────────────────────────────────── */
  const TTS_ENDPOINT =
    (typeof window !== 'undefined' && window.CAYMC_TTS_ENDPOINT) || '/api/tts';

  /* ─── Knowledge Base ─────────────────────────────────────────── */
  const KB_TOPICS = {
    hours: ['hour','open','close','closing','schedule','time','when','open until'],
    parking: ['park','garage','lot','car','vehicle','drive','valet'],
    security: ['security','guard','id','identification','checkpoint','enter','access','badge'],
    accessibility: ['ada','accessibility','accessible','wheelchair','disability','elevator'],
    mayor: ['mayor','duggan','mayor\'s office','city executive','11th floor','room 1100'],
    taxes: ['tax','taxes','property tax','pay tax','treasurer','revenue','delinquent'],
    courts: ['court','courtroom','hearing','judge','docket','circuit','probate','district'],
    parking_ticket: ['parking ticket','ticket','citation','fine','violation','dismiss','appeal'],
    birth: ['birth','certificate','vital','record','born','death record','marriage record'],
    business: ['business','license','permit','zoning','bseed','building permit','contractor'],
    voter: ['vote','voter','registration','election','ballot','clerk','absentee'],
    procurement: ['procurement','bid','rfp','vendor','contract','rfq','solicitation'],
    spirit: ['spirit','statue','bronze','fredericks','plaza','sculpture'],
    dwjba: ['dwjba','authority','building authority','who runs','management'],
    transit: ['bus','people mover','transit','ddot','smart bus','directions','get here'],
    caymc: ['caymc','municipal center','city county','coleman','young','building facts'],
    departments: ['department','office','where is','find','locate','directory'],
    contact: ['contact','phone','email','call','reach','number','address'],
    food: ['food','eat','cafeteria','lunch','coffee','restaurant'],
    emergency: ['emergency','fire','medical','911','help','urgent'],
    marriage: ['marriage','marry','wedding','license','spouse'],
    passport: ['passport','international','travel','id','federal id'],
    child_support: ['child support','custody','parenting','support order','foc','friend of court'],
    snap: ['snap','food stamps','ebt','welfare','dhs','benefit','assistance'],
    housing: ['housing','homeless','shelter','hud','section 8','voucher'],
    deed: ['deed','property record','land record','recording','register of deeds'],
    name_change: ['name change','legal name','gender marker','court order'],
    notary: ['notary','notarize','witness','seal','authenticate'],
  };

  const KB_RESPONSES = {
    hours: {
      text: "The Coleman A. Young Municipal Center (CAYMC) is open **Monday–Friday, 7:00 AM – 6:00 PM**. The building is closed on weekends and all City of Detroit official holidays.\n\nThe Courts Tower hours may vary — individual courtrooms often operate 8:00 AM – 4:00 PM. Always confirm with your specific court.\n\nThe **Spirit of Detroit Plaza** on the north side is accessible **24 hours a day, 7 days a week**.",
      topic: 'Building Hours'
    },
    parking: {
      text: "Parking options near CAYMC:\n\n• **CAYMC Parking Structure** — Enter from Randolph St. Discounted validation available from most offices.\n• **Street Parking** — Metered spaces on Woodward Ave, Jefferson Ave, and surrounding blocks.\n• **Detroit People Mover** — Cadillac Center Station is directly adjacent to CAYMC — the most convenient option.\n• **DDOT / SMART Bus** — Multiple routes stop on Woodward Ave at the main entrance.\n• **ADA Parking** — Accessible spaces available in the CAYMC parking structure.",
      topic: 'Parking & Transit',
      location: { floor: 'G', dept: 'Parking Structure / People Mover', room: 'Enter from Randolph St', phone: '(313) 224-3540', hours: 'Mon–Fri 7 AM – 6 PM' }
    },
    security: {
      text: "All visitors to CAYMC must:\n\n• Present a **valid government-issued photo ID** at security checkpoints\n• Pass through **metal detectors** at building entrances\n• Submit bags for X-ray screening\n\nThe main accessible entrance is at **ground level on Woodward Ave**. An additional entrance is on Jefferson Ave.\n\nProhibited items include weapons, hazardous materials, and unauthorized recording equipment.\n\n📞 Security Desk: **(313) 309-2300 ext. 100** — available 24/7",
      topic: 'Building Security',
      location: { floor: '1', dept: 'Security / Main Lobby', room: 'Ground Floor — Woodward Ave Entrance', phone: '(313) 309-2300 x100', hours: '24/7' }
    },
    taxes: {
      text: "For property tax payments and inquiries:\n\n**Wayne County Treasurer's Office**\n📍 3rd Floor, Room 300 — Administration Tower\n📞 (313) 224-5990\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nServices: property tax payments, tax certificates, payment plans, and delinquent tax information. Online payments available at waynecounty.com.\n\nFor **City of Detroit** tax matters, visit the **Detroit Finance Department** on the **5th Floor** — (313) 224-3263.",
      topic: 'Property Taxes',
      location: { floor: '3', dept: 'Wayne County Treasurer — Room 300', room: 'Room 300, Administration Tower', phone: '(313) 224-5990', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    courts: {
      text: "CAYMC's Courts Tower (20 floors) houses multiple court systems:\n\n• **Wayne County Circuit Court** — Floors 4–20, (313) 224-5261\n• **36th District Court** — Lower Level, (313) 965-8720\n• **Wayne County Probate Court** — 2nd Floor, (313) 224-5706\n• **Friend of the Court** — 3rd Floor, (313) 224-2390\n• **Court Clerk's Office** — 2nd Floor, (313) 224-5261\n\nAll courts generally open **Monday–Friday 8:00 AM – 4:00 PM**.",
      topic: 'Courts & Hearings',
      location: { floor: '4', dept: 'Wayne County Circuit Court', room: 'Floors 4–20, Courts Tower', phone: '(313) 224-5261', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    mayor: {
      text: "The **Mayor's Office** is located on the **11th Floor, Room 1100** of the Administration Tower.\n\n📞 Phone: (313) 224-3400\n🕒 Hours: Monday–Friday, 8:00 AM – 5:00 PM",
      topic: "Mayor's Office",
      location: { floor: '11', dept: "Mayor's Office", room: 'Room 1100 — Administration Tower', phone: '(313) 224-3400', hours: 'Mon–Fri 8 AM – 5 PM' }
    },
    birth: {
      text: "For birth certificates and vital records:\n\n**City of Detroit Vital Records**\n📍 Ground Floor, Room 101 — Administration Tower\n📞 (313) 876-4800\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\n**Bring:** valid photo ID, completed request form, and the required fee ($15 for a standard certificate).",
      topic: 'Vital Records',
      location: { floor: '1', dept: 'Vital Records — Room 101', room: 'Room 101, Administration Tower', phone: '(313) 876-4800', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    marriage: {
      text: "To obtain a **Marriage License**:\n\n**Wayne County Clerk's Office**\n📞 (313) 224-5540\n🕒 Monday–Friday, 8:00 AM – 4:00 PM\n\nBoth parties must appear in person with valid ID. $20 fee. 3-day waiting period.",
      topic: 'Marriage License',
      location: { floor: '2', dept: 'County Clerk — Marriage Licenses', phone: '(313) 224-5540', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    passport: {
      text: "**Passport Services** at CAYMC:\n\n📍 Ground Floor, Administration Tower\n📞 (313) 224-3260\n🕒 Monday–Friday, 8:00 AM – 4:00 PM (by appointment)",
      topic: 'Passport Services',
      location: { floor: '1', dept: 'Passport Acceptance Facility', phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    parking_ticket: {
      text: "To dispute or pay a parking citation:\n\n**Detroit Parking Violations Bureau**\n📍 Ground Floor, Administration Tower\n📞 (313) 224-2130\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nYou can also pay online. Appeals must be filed within 30 days.",
      topic: 'Parking Violations',
      location: { floor: '1', dept: 'Parking Violations Bureau', phone: '(313) 224-2130', hours: 'Mon–Fri 8 AM – 4:30 PM' }
    },
    business: {
      text: "For business licenses and building permits:\n\n**Detroit BSEED**\n📍 4th Floor — Administration Tower\n📞 (313) 224-3158\n🕒 Monday–Friday, 8:00 AM – 5:00 PM",
      topic: 'Business & Permits',
      location: { floor: '4', dept: 'BSEED / Building Permits', phone: '(313) 224-3158', hours: 'Mon–Fri 8 AM – 5 PM' }
    },
    voter: {
      text: "**Detroit City Clerk's Office**\n📍 Ground Floor, Room 200\n📞 (313) 224-3260\n🕒 Monday–Friday, 8:00 AM – 4:30 PM\n\nRegister online at Michigan.gov/vote",
      topic: 'Voter Registration',
      location: { floor: '1', dept: "City Clerk — Room 200", phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4:30 PM' }
    },
    child_support: {
      text: "**Friend of the Court (FOC)**\n📍 3rd Floor — Courts Tower\n📞 (313) 224-2390\n🕒 Monday–Friday, 8:00 AM – 4:30 PM",
      topic: 'Child Support / FOC',
      location: { floor: '3', dept: 'Friend of the Court', phone: '(313) 224-2390', hours: 'Mon–Fri 8 AM – 4:30 PM' }
    },
    contact: {
      text: "DWJBA Contact:\n📍 2 Woodward Ave, Suite 1314, Detroit, MI 48226\n📞 (313) 309-2300\n📧 info@dwjba.com\n\nBuilding Hours: Monday–Friday 7:00 AM – 6:00 PM",
      topic: 'Contact Info'
    },
    dwjba: {
      text: "The **Detroit-Wayne Joint Building Authority (DWJBA)** manages CAYMC.\n\n• Established: 1955\n• CEO: Clarinda Barnett-Harrison\n📍 Suite 1314, 13th Floor\n📞 (313) 309-2300",
      topic: 'About DWJBA',
      location: { floor: '13', dept: 'DWJBA Suite 1314', phone: '(313) 309-2300', hours: 'Mon–Fri 8 AM – 5 PM' }
    },
    departments: {
      text: "CAYMC departments across two towers:\n\n**Admin Tower (14F):** Mayor (11), Council (13), Clerk (G), Finance (5), Law (9–10), HR (5), Budget (9), Planning (7), BSEED/Permits (4), DWJBA (13), Treasurer (3)\n\n**Courts Tower (20F):** Circuit Court (4–20), 36th District (Lower), Probate (2), FOC (3)",
      topic: 'Department Directory'
    },
    transit: {
      text: "Transportation to CAYMC:\n• **People Mover** — Cadillac Center Station (adjacent)\n• **DDOT / SMART Bus** — Multiple routes on Woodward",
      topic: 'Transit & Directions'
    },
    food: {
      text: "**Building Cafeteria** — Ground Floor, Mon–Fri 7 AM – 3 PM",
      topic: 'Food & Dining'
    },
    emergency: {
      text: "**Call 911 for emergencies.** Security Desk: (313) 309-2300 ext. 100 — 24/7",
      topic: 'Emergency'
    },
    snap: {
      text: "Michigan DHHS: (855) 275-6424. Apply online at mi.gov/MIBridges",
      topic: 'SNAP / Benefits'
    },
    housing: {
      text: "Wayne County Community Development: (313) 224-0263\nDetroit Housing: (313) 628-2500",
      topic: 'Housing Assistance'
    },
    deed: {
      text: "Wayne County Register of Deeds: 400 Monroe St\n(313) 224-5854 — Mon–Fri 8 AM – 4 PM",
      topic: 'Deed Recording'
    },
    name_change: {
      text: "Wayne County Probate Court — 2nd Floor Courts Tower\n(313) 224-5706 — Filing fee ~$175",
      topic: 'Name Change',
      location: { floor: '2', dept: 'Probate Court — Name Change', phone: '(313) 224-5706', hours: 'Mon–Fri 8 AM – 4 PM' }
    },
    notary: {
      text: "Notary at City Clerk's Office — Ground Floor, Room 200\n(313) 224-3260",
      topic: 'Notary Services',
      location: { floor: '1', dept: "City Clerk — Notary", phone: '(313) 224-3260', hours: 'Mon–Fri 8 AM – 4:30 PM' }
    },
    spirit: {
      text: "The **Spirit of Detroit** — 26-foot bronze by Marshall Fredericks, 1958. Open 24/7.",
      topic: 'Spirit of Detroit'
    },
    accessibility: {
      text: "CAYMC is fully ADA-compliant with accessible entrances, elevators, ADA parking, and assistive services. ADA Coordinator: (313) 224-6740",
      topic: 'Accessibility'
    },
    procurement: {
      text: "DWJBA Procurement — Suite 1314, 13th Floor\n(313) 309-2300 — info@dwjba.com",
      topic: 'Procurement',
      location: { floor: '13', dept: 'DWJBA Suite 1314', phone: '(313) 309-2300', hours: 'Mon–Fri 8 AM – 5 PM' }
    },
    caymc: {
      text: "CAYMC — Detroit's landmark government complex.\nDesigned by Harley, Ellington & Day, completed 1955.\n780,000 sq. ft., Admin Tower (14F, 197ft), Courts Tower (20F, 318ft).\n70+ departments. Named after Mayor Coleman A. Young in 1976.",
      topic: 'About CAYMC'
    },
    default: {
      text: "I can help with anything at CAYMC. Ask about office locations, building hours, taxes, permits, courts, vital records, and more.",
      topic: 'General'
    }
  };

  /* ─── Styles ─────────────────────────────────────────────────── */
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

    /* Widget root variables */
    :root {
      --cw-brown: #3d1a08;
      --cw-brown-hover: #5a2810;
      --cw-green: #3d6b52;
      --cw-green-hover: #2e5440;
      --cw-tan: #c4956a;
      --cw-cream: #f5ede0;
      --cw-bg: #f9f7f4;
      --cw-fg: #1a0d06;
      --cw-muted: #6b5a4a;
      --cw-border: #e2d9cc;
      --cw-radius: 20px;
      --cw-shadow: 0 20px 60px rgba(0,0,0,.2), 0 4px 16px rgba(0,0,0,.1);
      --cw-transition: 180ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ── Floating Button ─────────────────────────────────────── */
    #caymc-chat-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--cw-green);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      box-shadow: 0 4px 20px rgba(61,107,82,.45);
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.22s ease,
                  background 0.18s ease;
      animation: caymcPulse 3s ease-in-out infinite;
    }
    #caymc-chat-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 28px rgba(61,107,82,.55);
      background: var(--cw-green-hover);
      animation: none;
    }
    #caymc-chat-fab.open {
      background: var(--cw-brown);
      box-shadow: 0 4px 20px rgba(61,26,8,.4);
      animation: none;
    }
    #caymc-chat-fab.open:hover {
      background: var(--cw-brown-hover);
    }
    #caymc-chat-fab svg {
      width: 26px;
      height: 26px;
      color: #fff;
      transition: opacity 0.15s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
    }
    #caymc-chat-fab .fab-chat-icon,
    #caymc-chat-fab .fab-close-icon {
      position: absolute;
    }
    #caymc-chat-fab .fab-close-icon {
      opacity: 0;
      transform: rotate(-90deg) scale(0.6);
    }
    #caymc-chat-fab.open .fab-chat-icon {
      opacity: 0;
      transform: rotate(90deg) scale(0.6);
    }
    #caymc-chat-fab.open .fab-close-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    @keyframes caymcPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(61,107,82,.45), 0 0 0 0 rgba(61,107,82,.35); }
      50% { box-shadow: 0 4px 20px rgba(61,107,82,.45), 0 0 0 10px rgba(61,107,82,0); }
    }
    @media (max-width: 480px) {
      #caymc-chat-fab { width: 52px; height: 52px; bottom: 16px; right: 16px; }
      #caymc-chat-fab svg { width: 22px; height: 22px; }
    }

    /* ── Chat Panel ──────────────────────────────────────────── */
    #caymc-chat-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 400px;
      height: 580px;
      border-radius: var(--cw-radius);
      background: var(--cw-bg);
      box-shadow: var(--cw-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 99998;
      font-family: 'Inter', -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      transform-origin: bottom right;
      /* Hidden state */
      opacity: 0;
      transform: scale(0.88) translateY(16px);
      pointer-events: none;
      transition: opacity 0.28s cubic-bezier(0.16,1,0.3,1),
                  transform 0.28s cubic-bezier(0.16,1,0.3,1);
    }
    #caymc-chat-panel.open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: all;
    }
    @media (max-width: 480px) {
      #caymc-chat-panel {
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        transform-origin: bottom center;
      }
    }

    /* ── Panel Header ────────────────────────────────────────── */
    .cw-header {
      background: var(--cw-brown);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .cw-header-avatar {
      position: relative;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
    }
    .cw-header-avatar img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.25);
      display: block;
    }
    .cw-status-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid var(--cw-brown);
      box-shadow: 0 0 6px rgba(34,197,94,.7);
    }
    .cw-header-info { flex: 1; min-width: 0; }
    .cw-header-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.01em;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cw-header-subtitle {
      font-size: 11px;
      color: rgba(255,255,255,0.55);
      margin-top: 1px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .cw-header-subtitle span.dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      display: inline-block;
      box-shadow: 0 0 5px rgba(34,197,94,.7);
      flex-shrink: 0;
    }
    .cw-header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .cw-hdr-btn {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.12);
      background: transparent;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .cw-hdr-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .cw-hdr-btn svg { width: 14px; height: 14px; }
    .cw-hdr-btn.muted { color: var(--cw-tan); border-color: rgba(196,149,106,0.35); }
    .cw-hdr-btn.muted:hover { background: rgba(196,149,106,0.1); color: var(--cw-tan); }

    /* ── Messages Area ───────────────────────────────────────── */
    .cw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #fafaf8;
      scroll-behavior: smooth;
    }
    .cw-messages::-webkit-scrollbar { width: 3px; }
    .cw-messages::-webkit-scrollbar-track { background: transparent; }
    .cw-messages::-webkit-scrollbar-thumb { background: rgba(61,26,8,.15); border-radius: 3px; }

    /* Message row */
    .cw-msg-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .cw-msg-row.user { flex-direction: row-reverse; }

    /* Avatars */
    .cw-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex-shrink: 0;
      overflow: hidden;
      border: 1.5px solid var(--cw-border);
    }
    .cw-msg-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cw-msg-avatar-user {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--cw-brown);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* Bot bubble */
    .cw-bubble-bot {
      background: #fff;
      border: 1px solid var(--cw-border);
      border-left: 3px solid var(--cw-brown);
      border-radius: 4px 14px 14px 14px;
      padding: 10px 12px;
      max-width: 82%;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .cw-bubble-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 5px;
    }
    .cw-bubble-sender {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--cw-brown);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cw-bubble-content {
      font-size: 13px;
      color: var(--cw-fg);
      line-height: 1.7;
    }
    .cw-bubble-content strong { color: var(--cw-brown); font-weight: 600; }
    .cw-bubble-content ul { margin: 5px 0; padding-left: 16px; }
    .cw-bubble-content li { margin: 2px 0; }
    .cw-bubble-content p { margin: 5px 0; }
    .cw-bubble-content p:first-child { margin-top: 0; }
    .cw-bubble-content p:last-child { margin-bottom: 0; }

    /* Typing cursor */
    .cw-cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: var(--cw-brown);
      vertical-align: middle;
      margin-left: 2px;
      animation: cwBlink 0.7s steps(1) infinite;
      border-radius: 1px;
    }
    @keyframes cwBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    /* Audio indicator */
    .cw-audio-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      padding: 3px 8px;
      border-radius: 100px;
      border: 1px solid var(--cw-border);
      background: rgba(61,107,82,0.06);
      color: var(--cw-green);
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }
    .cw-audio-btn:hover { background: rgba(61,107,82,0.12); }
    .cw-audio-btn svg { width: 11px; height: 11px; }
    .cw-bubble-time {
      font-size: 9.5px;
      color: var(--cw-muted);
      margin-top: 5px;
      opacity: 0.55;
    }

    /* User bubble */
    .cw-bubble-user {
      background: var(--cw-brown);
      color: #fff;
      border-radius: 14px 4px 14px 14px;
      padding: 9px 12px;
      max-width: 80%;
      font-size: 13px;
      line-height: 1.65;
    }
    .cw-bubble-user-time {
      font-size: 9.5px;
      color: rgba(255,255,255,0.45);
      margin-top: 3px;
      text-align: right;
    }

    /* Typing indicator */
    .cw-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 0;
      height: 18px;
    }
    .cw-typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--cw-brown);
      opacity: 0.45;
      animation: cwTypeBounce 1.4s infinite ease-in-out;
    }
    .cw-typing-dot:nth-child(2) { animation-delay: 0.18s; }
    .cw-typing-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes cwTypeBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* Location card */
    .cw-location-card {
      background: linear-gradient(135deg, rgba(61,26,8,0.05), rgba(61,107,82,0.035));
      border: 1px solid var(--cw-border);
      border-radius: 12px;
      padding: 10px 12px;
      margin-top: 10px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .cw-loc-floor {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: var(--cw-brown);
      line-height: 1;
      flex-shrink: 0;
      min-width: 42px;
      text-align: center;
    }
    .cw-loc-info { flex: 1; min-width: 0; }
    .cw-loc-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--cw-muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .cw-loc-dept { font-size: 12px; font-weight: 600; color: var(--cw-fg); margin-bottom: 5px; }
    .cw-loc-pills { display: flex; flex-wrap: wrap; gap: 4px; }
    .cw-loc-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 500;
      padding: 2px 7px;
      border-radius: 100px;
      background: rgba(61,26,8,.05);
      border: 1px solid var(--cw-border);
      color: var(--cw-muted);
    }
    .cw-loc-pill svg { width: 9px; height: 9px; }

    /* Welcome message */
    .cw-welcome {
      text-align: center;
      padding: 16px 12px 8px;
    }
    .cw-welcome-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--cw-brown), var(--cw-green));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
    }
    .cw-welcome-icon svg { width: 22px; height: 22px; color: #fff; }
    .cw-welcome-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px;
      font-weight: 700;
      color: var(--cw-brown);
      margin-bottom: 4px;
    }
    .cw-welcome-sub {
      font-size: 12px;
      color: var(--cw-muted);
      line-height: 1.5;
      max-width: 280px;
      margin: 0 auto;
    }

    /* ── Quick Chips ─────────────────────────────────────────── */
    .cw-chips-wrap {
      padding: 8px 14px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      border-top: 1px solid var(--cw-border);
      background: #fafaf8;
      flex-shrink: 0;
      scrollbar-width: none;
    }
    .cw-chips-wrap::-webkit-scrollbar { display: none; }
    .cw-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      border-radius: 100px;
      border: 1px solid var(--cw-border);
      background: #fff;
      color: var(--cw-muted);
      font-family: 'Inter', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      flex-shrink: 0;
    }
    .cw-chip:hover {
      background: var(--cw-cream);
      color: var(--cw-brown);
      border-color: rgba(61,26,8,.22);
    }

    /* ── Input Area ──────────────────────────────────────────── */
    .cw-input-area {
      border-top: 1px solid var(--cw-border);
      padding: 10px 12px;
      background: #fff;
      flex-shrink: 0;
    }
    .cw-input-row {
      display: flex;
      align-items: flex-end;
      gap: 7px;
    }
    .cw-voice-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: 1px solid var(--cw-border);
      background: #fff;
      color: var(--cw-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.18s;
    }
    .cw-voice-btn:hover { background: var(--cw-cream); border-color: rgba(61,26,8,.18); color: var(--cw-brown); }
    .cw-voice-btn.listening {
      background: rgba(220,38,38,.08);
      border-color: rgba(220,38,38,.3);
      color: #dc2626;
      animation: cwVoicePulse 1s infinite;
    }
    .cw-voice-btn svg { width: 16px; height: 16px; }
    @keyframes cwVoicePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,.3); }
      50% { box-shadow: 0 0 0 7px rgba(220,38,38,0); }
    }
    .cw-input {
      flex: 1;
      background: #f9f7f4;
      border: 1px solid var(--cw-border);
      border-radius: 10px;
      padding: 8px 12px;
      color: var(--cw-fg);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      outline: none;
      line-height: 1.5;
      transition: border-color 0.18s;
      resize: none;
      min-height: 38px;
      max-height: 100px;
      overflow-y: auto;
    }
    .cw-input::placeholder { color: var(--cw-muted); opacity: 0.55; }
    .cw-input:focus { border-color: var(--cw-brown); }
    .cw-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: none;
      background: var(--cw-brown);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.18s, transform 0.15s;
    }
    .cw-send-btn:hover { background: var(--cw-brown-hover); }
    .cw-send-btn:active { transform: scale(0.92); }
    .cw-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .cw-send-btn svg { width: 15px; height: 15px; }
    .cw-input-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 5px;
    }
    .cw-disclaimer {
      font-size: 10px;
      color: var(--cw-muted);
      opacity: 0.5;
      line-height: 1.3;
      max-width: 260px;
    }
    .cw-char-counter {
      font-size: 10px;
      color: var(--cw-muted);
      opacity: 0.5;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  `;

  /* ─── SVG Icons ──────────────────────────────────────────────── */
  const ICONS = {
    chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    volumeOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    volumeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
    speaker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    newChat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
  };

  /* ─── Helpers ────────────────────────────────────────────────── */
  function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function markdownToHtml(text) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet lists
    const lines = text.split('\n');
    const out = [];
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^[•\-\*] /.test(line)) {
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push('<li>' + line.replace(/^[•\-\*] /, '') + '</li>');
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        if (line.trim()) out.push('<p>' + line + '</p>');
      }
    }
    if (inList) out.push('</ul>');
    return out.join('');
  }

  function stripMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/📍|📞|🕒|📧/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  /* ─── Knowledge Base Matching ────────────────────────────────── */
  function matchQuery(query) {
    const q = query.toLowerCase();
    const scores = {};

    for (const [topic, keywords] of Object.entries(KB_TOPICS)) {
      let score = 0;
      for (const kw of keywords) {
        if (q.includes(kw)) score += kw.length > 5 ? 3 : 2;
      }
      if (score > 0) scores[topic] = score;
    }

    if (Object.keys(scores).length === 0) return 'default';

    // Return topic with highest score
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }

  function getResponse(query) {
    const topic = matchQuery(query);
    return KB_RESPONSES[topic] || KB_RESPONSES['default'];
  }

  /* ─── TTS ────────────────────────────────────────────────────── */
  let audioCtx = null;
  let voiceMuted = false;

  function getAudioContext() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    return audioCtx;
  }

  async function speakText(text) {
    if (voiceMuted) return;
    const clean = stripMarkdown(text);
    if (!clean || clean.length < 3) return;

    try {
      const res = await fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean.slice(0, 500), voice: 'rachel' }),
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      // Graceful fallback — no error shown
    }
  }

  /* ─── Streaming Text Effect ─────────────────────────────────── */
  function streamText(container, htmlContent, onDone) {
    // Parse into word tokens (preserving tags)
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    const fullText = temp.innerHTML;

    // We'll stream by characters for richer feel
    container.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'cw-cursor';
    container.appendChild(cursor);

    let i = 0;
    const chars = fullText.split('');
    let insideTag = false;
    let buffer = '';

    const INTERVAL = 12; // ms per character
    const timer = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(timer);
        cursor.remove();
        if (onDone) onDone();
        return;
      }

      // Batch tag characters instantly
      if (chars[i] === '<') insideTag = true;
      if (insideTag) {
        buffer += chars[i];
        if (chars[i] === '>') {
          insideTag = false;
          container.innerHTML = fullText.slice(0, fullText.indexOf(buffer, i - buffer.length + 1) + buffer.length);
          container.appendChild(cursor);
          buffer = '';
        }
        i++;
        return;
      }

      i++;
      container.innerHTML = fullText.slice(0, i);
      container.appendChild(cursor);
    }, INTERVAL);

    return timer;
  }

  /* ─── Location Card HTML ─────────────────────────────────────── */
  function buildLocationCard(loc) {
    const pills = [];
    if (loc.room) pills.push(`<span class="cw-loc-pill">${ICONS.mapPin} ${escapeHtml(loc.room)}</span>`);
    if (loc.phone) pills.push(`<span class="cw-loc-pill">${ICONS.phone} ${escapeHtml(loc.phone)}</span>`);
    if (loc.hours) pills.push(`<span class="cw-loc-pill">${ICONS.clock} ${escapeHtml(loc.hours)}</span>`);

    return `
      <div class="cw-location-card">
        <div class="cw-loc-floor">${escapeHtml(String(loc.floor))}</div>
        <div class="cw-loc-info">
          <div class="cw-loc-label">Floor</div>
          <div class="cw-loc-dept">${escapeHtml(loc.dept)}</div>
          ${pills.length ? `<div class="cw-loc-pills">${pills.join('')}</div>` : ''}
        </div>
      </div>
    `;
  }

  /* ─── Widget State ───────────────────────────────────────────── */
  let isOpen = false;
  let isThinking = false;
  let hasShownWelcome = false;
  let recognition = null;
  let isListening = false;

  /* ─── DOM References ─────────────────────────────────────────── */
  let fab, panel, messagesEl, inputEl, sendBtn, voiceBtn, charCounter, muteBtn;

  /* ─── Build DOM ──────────────────────────────────────────────── */
  function buildWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    // FAB
    fab = document.createElement('button');
    fab.id = 'caymc-chat-fab';
    fab.setAttribute('aria-label', 'Open Ask CAYMC chat assistant');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `
      <span class="fab-chat-icon">${ICONS.chat}</span>
      <span class="fab-close-icon">${ICONS.close}</span>
    `;
    document.body.appendChild(fab);

    // Panel
    panel = document.createElement('div');
    panel.id = 'caymc-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Ask CAYMC Chat');
    panel.setAttribute('aria-modal', 'false');

    // Determine logo path relative to current page
    const logoSrc = resolveAssetPath('images/dwjba-logo.jpg');

    panel.innerHTML = `
      <!-- Header -->
      <div class="cw-header">
        <div class="cw-header-avatar">
          <img src="${logoSrc}" alt="DWJBA Logo" onerror="this.style.display='none'">
          <span class="cw-status-dot" aria-hidden="true"></span>
        </div>
        <div class="cw-header-info">
          <div class="cw-header-title">Ask CAYMC</div>
          <div class="cw-header-subtitle">
            <span class="dot" aria-hidden="true"></span>
            AI Building Companion &middot; Online
          </div>
        </div>
        <div class="cw-header-actions">
          <button class="cw-hdr-btn" id="cw-mute-btn" title="Toggle voice output" aria-label="Mute voice output">
            ${ICONS.volumeOn}
          </button>
          <button class="cw-hdr-btn" id="cw-new-chat-btn" title="Start new conversation" aria-label="Start new conversation">
            ${ICONS.newChat}
          </button>
          <button class="cw-hdr-btn" id="cw-close-btn" title="Close chat" aria-label="Close chat">
            ${ICONS.close}
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="cw-messages" id="cw-messages" aria-live="polite" aria-atomic="false"></div>

      <!-- Quick Chips -->
      <div class="cw-chips-wrap" id="cw-chips" aria-label="Quick questions">
        <button class="cw-chip" data-q="What are the building hours?">🕒 Building hours</button>
        <button class="cw-chip" data-q="How do I get here?">🚌 Getting here</button>
        <button class="cw-chip" data-q="Where is parking?">🅿️ Parking</button>
        <button class="cw-chip" data-q="Where is the Mayor's office?">🏛️ Mayor's office</button>
        <button class="cw-chip" data-q="How do I get a birth certificate?">📋 Vital records</button>
        <button class="cw-chip" data-q="Where do I pay property taxes?">💳 Property taxes</button>
      </div>

      <!-- Input -->
      <div class="cw-input-area">
        <div class="cw-input-row">
          <button class="cw-voice-btn" id="cw-voice-btn" aria-label="Voice input" title="Speak your question">
            ${ICONS.mic}
          </button>
          <textarea
            class="cw-input"
            id="cw-input"
            placeholder="Ask anything about CAYMC…"
            rows="1"
            maxlength="500"
            aria-label="Chat message"
          ></textarea>
          <button class="cw-send-btn" id="cw-send-btn" aria-label="Send message" disabled>
            ${ICONS.send}
          </button>
        </div>
        <div class="cw-input-footer">
          <span class="cw-disclaimer">Ask CAYMC is an AI demo. Always confirm with the department directly.</span>
          <span class="cw-char-counter" id="cw-char-counter">0/500</span>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Cache refs
    messagesEl = panel.querySelector('#cw-messages');
    inputEl = panel.querySelector('#cw-input');
    sendBtn = panel.querySelector('#cw-send-btn');
    voiceBtn = panel.querySelector('#cw-voice-btn');
    charCounter = panel.querySelector('#cw-char-counter');
    muteBtn = panel.querySelector('#cw-mute-btn');

    // Bind events
    fab.addEventListener('click', togglePanel);
    panel.querySelector('#cw-close-btn').addEventListener('click', closePanel);
    panel.querySelector('#cw-new-chat-btn').addEventListener('click', newChat);
    muteBtn.addEventListener('click', toggleMute);
    sendBtn.addEventListener('click', handleSend);
    voiceBtn.addEventListener('click', handleVoice);

    inputEl.addEventListener('input', onInputChange);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Chip clicks
    panel.querySelectorAll('.cw-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        if (q) sendMessage(q);
      });
    });

    // Close on backdrop click (outside panel)
    document.addEventListener('click', (e) => {
      if (isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
        closePanel();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closePanel();
    });
  }

  /* ─── Asset Path Resolution ──────────────────────────────────── */
  function resolveAssetPath(relative) {
    // Try to find the script tag to determine base path
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      const src = s.getAttribute('src');
      if (src && src.includes('chat-widget')) {
        const base = src.substring(0, src.lastIndexOf('/') + 1);
        return base + relative;
      }
    }
    return relative;
  }

  /* ─── Panel Open/Close ───────────────────────────────────────── */
  function togglePanel() {
    if (isOpen) closePanel();
    else openPanel();
  }

  function openPanel() {
    isOpen = true;
    fab.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Close Ask CAYMC chat assistant');
    panel.classList.add('open');

    if (!hasShownWelcome) {
      showWelcome();
      hasShownWelcome = true;
    }

    // Focus input after animation
    setTimeout(() => inputEl.focus(), 280);
  }

  function closePanel() {
    isOpen = false;
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Open Ask CAYMC chat assistant');
    panel.classList.remove('open');
    if (isListening) stopListening();
  }

  function newChat() {
    messagesEl.innerHTML = '';
    hasShownWelcome = false;
    showWelcome();
    hasShownWelcome = true;
    inputEl.value = '';
    onInputChange();
  }

  function toggleMute() {
    voiceMuted = !voiceMuted;
    muteBtn.innerHTML = voiceMuted ? ICONS.volumeOff : ICONS.volumeOn;
    muteBtn.setAttribute('aria-label', voiceMuted ? 'Unmute voice output' : 'Mute voice output');
    muteBtn.title = voiceMuted ? 'Unmute voice' : 'Mute voice';
    if (voiceMuted) {
      muteBtn.classList.add('muted');
    } else {
      muteBtn.classList.remove('muted');
    }
  }

  /* ─── Welcome Message ────────────────────────────────────────── */
  function showWelcome() {
    const welcomeRow = document.createElement('div');
    welcomeRow.innerHTML = `
      <div class="cw-welcome">
        <div class="cw-welcome-icon">${ICONS.building}</div>
        <div class="cw-welcome-title">Welcome to Ask CAYMC</div>
        <div class="cw-welcome-sub">I can help you find offices, hours, services, and more at the Coleman A. Young Municipal Center.</div>
      </div>
    `;
    messagesEl.appendChild(welcomeRow);

    // Then auto-bot greeting
    setTimeout(() => {
      appendBotMessage(
        "Hello! I'm your AI guide for the Coleman A. Young Municipal Center (CAYMC). Ask me about **office locations**, **building hours**, **parking**, **courts**, **vital records**, and any city service. How can I help you today?",
        'General',
        null,
        true
      );
    }, 400);
  }

  /* ─── Message Helpers ────────────────────────────────────────── */
  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'cw-msg-row user';
    row.innerHTML = `
      <div class="cw-msg-avatar-user" aria-hidden="true">YOU</div>
      <div>
        <div class="cw-bubble-user">${escapeHtml(text)}</div>
        <div class="cw-bubble-user-time">${getTime()}</div>
      </div>
    `;
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function appendBotMessage(markdownText, topic, location, animate) {
    const logoSrc = resolveAssetPath('images/dwjba-logo.jpg');
    const row = document.createElement('div');
    row.className = 'cw-msg-row';

    const locationHtml = location ? buildLocationCard(location) : '';
    const htmlContent = markdownToHtml(markdownText);

    row.innerHTML = `
      <div class="cw-msg-avatar" aria-hidden="true">
        <img src="${logoSrc}" alt="" onerror="this.parentElement.innerHTML='<div style=\\'width:28px;height:28px;border-radius:50%;background:var(--cw-brown);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;\\'>AI</div>'">
      </div>
      <div style="max-width:82%">
        <div class="cw-bubble-bot">
          <div class="cw-bubble-meta">
            <span class="cw-bubble-sender">CAYMC AI</span>
          </div>
          <div class="cw-bubble-content" id="cw-bc-${Date.now()}"></div>
          ${locationHtml}
        </div>
        <div class="cw-bubble-time">${getTime()}</div>
      </div>
    `;

    messagesEl.appendChild(row);

    const contentEl = row.querySelector('[id^="cw-bc-"]');

    if (animate) {
      streamText(contentEl, htmlContent, () => {
        // After streaming, speak text
        speakText(markdownText).then(() => {
          // Add audio indicator if TTS might be available
          if (!voiceMuted) {
            const audioIndicator = document.createElement('button');
            audioIndicator.className = 'cw-audio-btn';
            audioIndicator.innerHTML = `${ICONS.speaker} Replay audio`;
            audioIndicator.title = 'Replay spoken response';
            audioIndicator.addEventListener('click', () => speakText(markdownText));
            const bubble = row.querySelector('.cw-bubble-bot');
            bubble.appendChild(audioIndicator);
          }
        });
      });
    } else {
      contentEl.innerHTML = htmlContent;
    }

    scrollToBottom();
    return row;
  }

  function appendThinking() {
    const logoSrc = resolveAssetPath('images/dwjba-logo.jpg');
    const row = document.createElement('div');
    row.className = 'cw-msg-row';
    row.innerHTML = `
      <div class="cw-msg-avatar" aria-hidden="true">
        <img src="${logoSrc}" alt="" onerror="this.parentElement.innerHTML='<div style=\\'width:28px;height:28px;border-radius:50%;background:var(--cw-brown);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;\\'>AI</div>'">
      </div>
      <div>
        <div class="cw-bubble-bot" style="padding:12px 14px;">
          <div class="cw-typing">
            <div class="cw-typing-dot"></div>
            <div class="cw-typing-dot"></div>
            <div class="cw-typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* ─── Send Logic ─────────────────────────────────────────────── */
  function onInputChange() {
    const val = inputEl.value;
    const len = val.length;
    charCounter.textContent = `${len}/500`;
    sendBtn.disabled = len === 0 || isThinking;

    // Auto-resize textarea
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text || isThinking) return;
    sendMessage(text);
  }

  function sendMessage(text) {
    inputEl.value = '';
    onInputChange();
    isThinking = true;
    sendBtn.disabled = true;

    appendUserMessage(text);

    // Simulate thinking delay (200-600ms)
    const delay = 200 + Math.random() * 400;
    const thinkRow = appendThinking();

    setTimeout(() => {
      thinkRow.remove();
      const resp = getResponse(text);
      appendBotMessage(resp.text, resp.topic, resp.location || null, true);
      isThinking = false;
      onInputChange();
      inputEl.focus();
    }, delay);
  }

  /* ─── Voice Input ────────────────────────────────────────────── */
  function handleVoice() {
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Graceful degradation
      inputEl.placeholder = 'Voice not supported in this browser';
      setTimeout(() => { inputEl.placeholder = 'Ask anything about CAYMC…'; }, 2500);
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.setAttribute('aria-label', 'Stop listening');
      inputEl.placeholder = 'Listening…';
    };

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      inputEl.value = transcript;
      onInputChange();
    };

    recognition.onend = () => {
      stopListening();
      const text = inputEl.value.trim();
      if (text) {
        setTimeout(() => sendMessage(text), 300);
      }
    };

    recognition.onerror = () => {
      stopListening();
    };

    recognition.start();
  }

  function stopListening() {
    isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.setAttribute('aria-label', 'Voice input');
    inputEl.placeholder = 'Ask anything about CAYMC…';
    if (recognition) {
      try { recognition.stop(); } catch(e) {}
      recognition = null;
    }
  }

  /* ─── Initialize ─────────────────────────────────────────────── */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
      buildWidget();
    }
  }

  init();

})();
