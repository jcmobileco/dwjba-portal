#!/usr/bin/env python3
"""Rebuild ai-demo.html with the homepage nav/footer shell."""

# Read both files
with open('index.html', 'r') as f:
    homepage = f.read()
    homepage_lines = homepage.split('\n')

with open('ai-demo.html', 'r') as f:
    aidemo = f.read()
    aidemo_lines = aidemo.split('\n')

# === EXTRACT FROM HOMEPAGE ===

# 1. Nav/Header CSS: lines 12-249 (0-indexed: 11-248) -- tokens through scrim styles
# Actually we need lines 12-957 (all CSS before the Authority band) which includes
# tokens, topbar, header, nav, mobile nav, scrim, and footer styles
# But we DON'T need: hero, qa-section, about-section, fac-section, proc-section,
# spirit-section, news-section, authority, cta -- those are homepage-specific

# Let's extract specific CSS ranges we need:
# Lines 12-249: reset, tokens, wrap, eyebrow, topbar, header, nav, search, mobile nav, scrim
# Lines 894-956: footer styles
# Lines 957-1073: authority-section and cta-section (not needed for AI demo)

# 2. Nav/Header HTML: lines 1080-1237
# 3. Footer HTML: lines 1785-1897
# 4. Footer script: lines 1899-1918

# Extract CSS for nav shell (lines 12-249 in 1-indexed = indices 11-248)
nav_css_lines = homepage_lines[11:249]  # lines 12-249
nav_css = '\n'.join(nav_css_lines)

# Extract footer CSS (lines 894-956 in 1-indexed = indices 893-955)
footer_css_lines = homepage_lines[893:956]
footer_css = '\n'.join(footer_css_lines)

# Extract topbar HTML (lines 1080-1103)
topbar_html_lines = homepage_lines[1079:1103]
topbar_html = '\n'.join(topbar_html_lines)

# Extract header HTML (lines 1108-1219)
header_html_lines = homepage_lines[1107:1219]
header_html = '\n'.join(header_html_lines)

# Extract mobile nav drawer (lines 1221-1237)
mobnav_html_lines = homepage_lines[1220:1237]
mobnav_html = '\n'.join(mobnav_html_lines)

# Extract footer HTML (lines 1785-1897)
footer_html_lines = homepage_lines[1784:1897]
footer_html = '\n'.join(footer_html_lines)

# Extract footer script (lines 1899-1918)
footer_script_lines = homepage_lines[1898:1918]
footer_script = '\n'.join(footer_script_lines)

# === EXTRACT AI CONTENT FROM AI-DEMO ===

# AI-specific CSS: lines 14-845 (indices 13-844)
ai_css_lines = aidemo_lines[13:845]
ai_css = '\n'.join(ai_css_lines)

# AI content HTML: from hero section (line 918) to end of CTA section (line 1270)
ai_content_lines = aidemo_lines[917:1270]
ai_content = '\n'.join(ai_content_lines)

# === ASSEMBLE NEW FILE ===
output = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ask CAYMC — AI Demo | DWJBA</title>
  <meta name="description" content="Experience Ask CAYMC — the AI-powered building companion and 3D Interactive Floor Navigator for the Coleman A. Young Municipal Center." />
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
  <script src="main.js" defer></script>
  <style>
    /* ── Page-level overrides ──────────────────────── */
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    html {{ scroll-behavior: smooth; }}
    body {{ font-family: 'Inter', sans-serif; background: #f9f7f4; color: #1a0d06; -webkit-font-smoothing: antialiased; }}
    img {{ display: block; max-width: 100%; }}
    a {{ text-decoration: none; color: inherit; }}

{nav_css}

{footer_css}

    /* ── AI DEMO CTA Button Styles ─────────────────── */
    .btn-primary {{
      display: inline-flex; align-items: center; gap: .45rem;
      padding: .875rem 2rem;
      background: var(--brown); color: white;
      font-size: .875rem; font-weight: 700;
      border-radius: .5rem; transition: opacity .2s;
      font-family: inherit; border: none; cursor: pointer;
    }}
    .btn-primary:hover {{ opacity: .88; }}
    .btn-outline {{
      display: inline-flex; align-items: center;
      padding: .875rem 2rem;
      background: transparent; color: #fff;
      font-size: .875rem; font-weight: 600;
      border: 1.5px solid rgba(255,255,255,.3);
      border-radius: .5rem; transition: border-color .2s, color .2s;
      font-family: inherit; cursor: pointer;
    }}
    .btn-outline:hover {{ border-color: rgba(255,255,255,.6); color: #fff; }}

    /* ── Reveal animation ──────────────────────────── */
    .reveal {{
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }}
    .reveal.visible {{
      opacity: 1;
      transform: translateY(0);
    }}
    .reveal-delay-1 {{ transition-delay: 0.1s; }}
    .reveal-delay-2 {{ transition-delay: 0.2s; }}
    .reveal-delay-3 {{ transition-delay: 0.3s; }}

    /* ── AI-specific .section class ────────────────── */
    .section {{ }}
    .section-alt {{ background: var(--section-alt); }}

    /* ── .page-hero-inner wrap ─────────────────────── */
    .page-hero-inner {{
      max-width: 1280px;
      margin: 0 auto;
      padding: 6rem 2rem 5rem;
    }}

{ai_css}
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════
     TOP BAR
════════════════════════════════════════════════════ -->
{topbar_html}

<!-- ═══════════════════════════════════════════════════
     HEADER
════════════════════════════════════════════════════ -->
{header_html}

<!-- Mobile nav drawer -->
{mobnav_html}

<!-- ═══════════════════════════════════════════════════
     AI DEMO CONTENT
════════════════════════════════════════════════════ -->
{ai_content}

<!-- ═══════════════════════════════════════════════════
     FOOTER
════════════════════════════════════════════════════ -->
{footer_html}

<script>
{footer_script}
</script>
</body>
</html>
'''

with open('ai-demo.html', 'w') as f:
    f.write(output)

print(f"Written ai-demo.html: {len(output)} chars")
print(f"Nav CSS: {len(nav_css)} chars")
print(f"Footer CSS: {len(footer_css)} chars")  
print(f"AI CSS: {len(ai_css)} chars")
print(f"AI content HTML: {len(ai_content)} chars")
