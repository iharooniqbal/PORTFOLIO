/* =====================================================================
   Portfolio assistant — answers questions about Abdullah.
   Runs entirely in the browser (no server, no API key). It matches the
   visitor's question against a hand-written knowledge base taken from
   this portfolio and CV, so it never invents facts.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. KNOWLEDGE BASE  (edit the text here to change what it says)
     ------------------------------------------------------------------ */
  var L = {
    about: { t: "About me", h: "about.html" },
    exp: { t: "Experience", h: "experience.html" },
    proj: { t: "See projects", h: "projects.html" },
    skills: { t: "Skills page", h: "skills.html" },
    certs: { t: "Certificates", h: "certificates.html" },
    contact: { t: "Contact page", h: "contact.html" },
    cv: { t: "Download CV", h: "cv.pdf", dl: true },
    github: { t: "GitHub", h: "https://github.com/iharooniqbal", ext: true, alt: true },
    linkedin: { t: "LinkedIn", h: "https://linkedin.com/in/harooniqbal-b4414334a", ext: true, alt: true },
    insta: { t: "Instagram", h: "https://www.instagram.com/iharoon_iqbal", ext: true, alt: true },
    wa: { t: "WhatsApp", h: "https://wa.me/923156664014", ext: true },
    mail: { t: "Email him", h: "mailto:harooniqbal.ahi@gmail.com" },
    stockLive: { t: "StockWise live demo", h: "https://direct-execute-app.lovable.app", ext: true },
    stockDeck: { t: "Pitch deck", h: "demos/stockwise-pitch-deck.html", ext: true, alt: true },
    simplexLive: { t: "Try the solver", h: "demos/simplex-solver.html", ext: true }
  };

  var MAIN_CHIPS = ["Who is Abdullah?", "Projects", "Skills", "Experience", "Education", "Certificates", "Contact", "Download CV"];

  var INTENTS = [
    {
      id: "greet",
      keys: [["hi", 2], ["hello", 2], ["hey", 2], ["salam", 2], ["assalam", 2], ["assalamualaikum", 3], ["good morning", 3], ["good evening", 3], ["good afternoon", 3], ["hola", 2]],
      html: "<p>Hi there! 👋 I'm Abdullah's portfolio assistant. Ask me about his <b>projects</b>, <b>skills</b>, <b>experience</b>, <b>education</b> or how to <b>contact</b> him.</p>",
      chips: MAIN_CHIPS
    },
    {
      id: "thanks",
      keys: [["thanks", 3], ["thank you", 3], ["thankyou", 3], ["thx", 2], ["shukriya", 3], ["great", 1], ["awesome", 1], ["nice", 1], ["cool", 1]],
      html: "<p>You're welcome! 😊 Anything else you'd like to know about Abdullah?</p>",
      chips: ["Projects", "Skills", "Contact"]
    },
    {
      id: "bye",
      keys: [["bye", 3], ["goodbye", 3], ["see you", 3], ["allah hafiz", 3], ["khuda hafiz", 3]],
      html: "<p>Goodbye! Thanks for visiting Abdullah's portfolio. 👋</p>",
      chips: ["Contact", "Download CV"]
    },
    {
      id: "bot",
      keys: [["who are you", 4], ["are you ai", 4], ["are you a bot", 4], ["are you real", 4], ["are you human", 4], ["your name", 3], ["chatgpt", 3], ["how do you work", 4], ["what are you", 3], ["what can you do", 3], ["what can you tell", 3], ["help", 1], ["assistant", 2], ["yourself", 2]],
      html: "<p>I'm a virtual assistant built into this portfolio. I answer questions using the information on this site and Abdullah's CV — projects, skills, education, experience, certificates and contact details.</p><p>I'm <b>not</b> a general-purpose AI, so for anything beyond that it's best to message Abdullah directly.</p>",
      links: [L.contact],
      chips: MAIN_CHIPS
    },
    {
      id: "about",
      keys: [["who is abdullah", 5], ["who is he", 4], ["about abdullah", 5], ["about him", 4], ["tell me about", 3], ["introduce", 3], ["introduction", 3], ["summary", 2], ["overview", 2], ["abdullah", 2], ["haroon", 2], ["iqbal", 2], ["profile", 2], ["background", 2], ["bio", 2], ["describe", 2]],
      html: "<p><b>Abdullah Iqbal</b> (his CV and certificates use <b>Muhammad Abdullah Haroon</b>) is a BS Mathematics student at Bahauddin Zakariya University, Multan.</p><p>He builds web apps, intelligent systems and data-driven tools with <b>Python, Flask, FastAPI and SQL</b>. Recent work includes <b>HARNECT</b>, <b>Infinity-X</b>, <b>StockWise</b> and a <b>Simplex Solver</b>, and he recently finished a <b>Branch Service Internship at Meezan Bank</b>.</p><p>He's exploring opportunities in tech, AI and finance.</p>",
      links: [L.about, L.proj],
      chips: ["Projects", "Experience", "Skills", "Contact"]
    },
    {
      id: "education",
      keys: [["education", 4], ["study", 3], ["studies", 3], ["studying", 3], ["university", 3], ["degree", 3], ["bzu", 4], ["bahauddin", 4], ["zakariya", 3], ["college", 3], ["fsc", 4], ["intermediate", 3], ["semester", 3], ["mathematics", 3], ["maths", 3], ["math", 2], ["qualification", 3], ["student", 2], ["school", 2], ["graduate", 2], ["graduation", 2]],
      html: "<p><b>B.S. Mathematics</b> (currently 7th semester), 2023 – 2027, at Bahauddin Zakariya University (BZU), Multan. Core subjects: Calculus, Data Analysis and MATLAB.</p><p><b>Intermediate (FSc Pre-Engineering)</b>, 2021 – 2023, at Government Post Graduate College, Khanewal (Mathematics, Physics, Chemistry).</p>",
      links: [L.about],
      chips: ["Experience", "Skills", "Projects"]
    },
    {
      id: "experience",
      keys: [["experience", 4], ["work", 2], ["job", 3], ["internship", 4], ["intern", 4], ["meezan", 5], ["bank", 3], ["banking", 3], ["branch", 3], ["account opening", 4], ["career", 3], ["employment", 3], ["worked", 3], ["jahanian", 4], ["professional", 2]],
      html: "<p><b>Branch Service Intern — Meezan Bank</b> (Jahanian Branch, 4 Jul – 16 Aug 2026).</p><ul><li>Handled account opening for new customers and checked forms and documents for accuracy and compliance.</li><li>Worked with the Account Opening Form for individual, joint and sole-proprietorship accounts (CNIC, NTN, FATCA fields).</li><li>Used the bank's internal software to enter and process customer account records.</li><li>Dealt directly with customers, guiding them through account opening steps.</li></ul>",
      links: [L.exp, L.certs],
      chips: ["Leadership", "Projects", "Education"]
    },
    {
      id: "leadership",
      keys: [["leadership", 4], ["colt", 5], ["caspam", 5], ["executive", 3], ["volunteer", 4], ["volunteering", 4], ["job fair", 4], ["society", 2], ["activities", 3], ["outreach", 3], ["team", 1], ["extracurricular", 3]],
      html: "<ul><li><b>Executive Member — CASPAM COLT</b> (2024 – 2025): appointed to the CASPAM Outreach and Leadership Team at the Centre for Advanced Studies in Pure &amp; Applied Mathematics, BZU Multan.</li><li><b>Volunteer — Job Fair Event</b> (17 Apr 2025): helped coordinate the event and connect students with participating organizations.</li></ul>",
      links: [L.exp],
      chips: ["Experience", "Certificates", "Projects"]
    },
    {
      id: "projects",
      keys: [["projects", 4], ["project", 4], ["built", 3], ["build", 2], ["made", 2], ["created", 2], ["apps", 2], ["applications", 2], ["work samples", 3], ["portfolio work", 3], ["github", 1], ["demo", 2], ["showcase", 2]],
      html: "<p>Abdullah's main projects:</p><ul><li><b>HARNECT</b> — Instagram-style social media web app (Flask)</li><li><b>Infinity-X</b> — self-learning AI chatbot with LLM failover</li><li><b>StockWise</b> — inventory &amp; expiry alerts with ML forecasting</li><li><b>Simplex Solver</b> — step-by-step linear programming tool</li><li><b>Employee Payroll System</b> — MySQL database project</li><li><b>Social Links Hub</b> — one link for all his profiles</li></ul><p>Ask about any of them for details.</p>",
      links: [L.proj, L.github],
      chips: ["HARNECT", "Infinity-X", "StockWise", "Simplex Solver"]
    },
    {
      id: "harnect",
      keys: [["harnect", 6], ["social media app", 4], ["instagram like", 4], ["instagram-like", 4], ["social app", 3], ["stories", 2]],
      html: "<p><b>HARNECT</b> is a full-stack, Instagram-inspired social platform built with <b>Python, Flask, SQLAlchemy, HTML/CSS and JavaScript</b>.</p><ul><li>User authentication, profiles, posts, stories, likes, comments and a follow system</li><li>PWA support so it can be installed on a phone</li><li>He designed the database models and built the backend routes and frontend pages himself</li></ul>",
      links: [L.proj],
      chips: ["Infinity-X", "StockWise", "Skills"]
    },
    {
      id: "infinity",
      keys: [["infinity", 6], ["infinity-x", 6], ["infinityx", 6], ["chatbot", 4], ["chat bot", 4], ["self learning", 4], ["self-learning", 4], ["learning bot", 4], ["llm", 3], ["failover", 3]],
      html: "<p><b>Infinity-X</b> is a self-learning AI assistant. Users upload PDFs, DOCX files, images or websites and get summaries, notes, quizzes and MCQs.</p><ul><li>Three-mode architecture (General, Private, Customer) with isolated database tables</li><li>Rotates between multiple LLM providers with automatic failover for reliable uptime</li><li>TF-IDF and semantic search, plus upload validation, rate limiting and secure sessions</li></ul><p>Stack: Python, Flask, SQLAlchemy, Alembic, scikit-learn.</p>",
      links: [L.proj],
      chips: ["HARNECT", "StockWise", "Skills"]
    },
    {
      id: "stockwise",
      keys: [["stockwise", 6], ["stock wise", 6], ["inventory", 4], ["expiry", 4], ["retailer", 3], ["retailers", 3], ["reorder", 3], ["lovable", 3], ["pos", 1]],
      html: "<p><b>StockWise</b> is an inventory platform for small retailers. It tells shop owners what to <b>reorder</b> and what to <b>discount before it expires</b>.</p><ul><li>Decision Tree risk model for stock-out and expiry risk (81.5% test accuracy)</li><li>FEFO expiry-batch tracking, purchase orders, POS checkout and an audit log</li><li>Authenticated multi-tenant API with role-based access and 93 automated tests</li></ul><p>Stack: Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic, scikit-learn, Docker.</p>",
      links: [L.stockLive, L.stockDeck],
      chips: ["Simplex Solver", "HARNECT", "Skills"]
    },
    {
      id: "simplex",
      keys: [["simplex", 6], ["linear programming", 5], ["solver", 4], ["optimization", 3], ["optimisation", 3], ["big m", 4], ["big-m", 4], ["two phase", 4], ["two-phase", 4], ["tableau", 3], ["operations research", 3]],
      html: "<p>The <b>Simplex Algorithm Solver</b> is an interactive linear-programming tool that teaches as it solves.</p><ul><li>Step-by-step tableaus that explain the reason for every pivot</li><li>Two-Phase and Big-M methods</li><li>Detects unbounded, infeasible, degenerate and alternate-optima cases</li><li>Sensitivity analysis, a graphical 2-variable view and CSV / PDF export</li></ul><p>Built with JavaScript, HTML, CSS and Canvas.</p>",
      links: [L.simplexLive],
      chips: ["StockWise", "HARNECT", "Skills"]
    },
    {
      id: "payroll",
      keys: [["payroll", 6], ["employee", 3], ["salary system", 3], ["mysql project", 4], ["database project", 4]],
      html: "<p>The <b>Employee Payroll System</b> is a MySQL database project for managing employee records and salary processing, showing relational schema design and secure transaction handling.</p>",
      links: [L.proj],
      chips: ["Projects", "Skills"]
    },
    {
      id: "hub",
      keys: [["links hub", 5], ["social links", 4], ["link hub", 5], ["linktree", 3], ["social hub", 4], ["portfolio hub", 4]],
      html: "<p>The <b>Social &amp; Portfolio Hub</b> is a clean, mobile-friendly page that connects all his social profiles, GitHub projects and personal sites behind one link. Built with HTML, CSS and GitHub Pages.</p>",
      links: [L.proj],
      chips: ["Projects", "Contact"]
    },
    {
      id: "skills",
      keys: [["skills", 4], ["skill", 4], ["technologies", 4], ["technology", 3], ["tech stack", 4], ["stack", 3], ["tools", 3], ["expertise", 3], ["what can he do", 4], ["good at", 3], ["strengths", 3], ["languages", 2], ["programming", 3], ["know", 1], ["capable", 2], ["strongest", 3]],
      html: "<p>Abdullah's skills:</p><ul><li><b>Languages &amp; frameworks:</b> Python, Flask, FastAPI, JavaScript, HTML &amp; CSS, SQL</li><li><b>Data &amp; analysis:</b> Data Analysis, Excel, MATLAB, MySQL / SQLite / PostgreSQL, scikit-learn, Linear Programming</li><li><b>Web:</b> Full-stack web apps, responsive design, PWA, Git &amp; GitHub</li><li><b>Other:</b> Canva design, freelancing</li></ul><p>His skills page rates Excel, Data Analysis and Python as his strongest.</p>",
      links: [L.skills, L.proj],
      chips: ["Projects", "Certificates", "Experience"]
    },
    {
      id: "certs",
      keys: [["certificates", 5], ["certificate", 5], ["certification", 4], ["certifications", 4], ["certified", 3], ["courses", 3], ["course", 3], ["training", 3], ["achievements", 3], ["awards", 3], ["digiskills", 4], ["simplilearn", 4], ["red crescent", 4], ["yabc", 4], ["code meet", 4], ["codemeet", 4], ["seminar", 3], ["payam", 3]],
      html: "<p>Abdullah has 12 certificates and achievements, including:</p><ul><li><b>Data Analytics &amp; Business Intelligence</b> and <b>Freelancing</b> — DigiSkills.pk (Dec 2025)</li><li><b>Web Development</b>, <b>SEO</b> and <b>Affiliate Marketing</b> — Simplilearn SkillUP (2025)</li><li><b>Youth as Agents of Behavioural Change</b> — Pakistan Red Crescent Society, Punjab (Sep 2026)</li><li><b>Meezan Bank Internship Certificate</b> (2026)</li><li><b>CODE MEET 2025 (Agentic AI)</b>, an investment &amp; stock-trading seminar, the Payam-e-Iqbal speech competition, CASPAM COLT and more</li></ul>",
      links: [L.certs, L.cv],
      chips: ["Experience", "Skills", "Contact"]
    },
    {
      id: "contact",
      keys: [["contact", 5], ["email", 4], ["e-mail", 4], ["mail", 3], ["reach", 3], ["get in touch", 5], ["whatsapp", 4], ["message", 3], ["phone", 3], ["call", 2], ["number", 2], ["linkedin", 4], ["instagram", 3], ["social", 2], ["connect", 3], ["talk", 2], ["chat with", 3]],
      html: "<p>The best ways to reach Abdullah:</p><ul><li><b>Email:</b> harooniqbal.ahi@gmail.com</li><li><b>WhatsApp:</b> use the button below</li><li>Or use the form on the contact page</li></ul><p>He's also on GitHub, LinkedIn and Instagram.</p>",
      links: [L.mail, L.wa, L.contact, L.github, L.linkedin, L.insta],
      chips: ["Hire him", "Download CV"]
    },
    {
      id: "hire",
      keys: [["hire", 5], ["hiring", 4], ["freelance", 4], ["freelancing", 4], ["available", 3], ["availability", 3], ["opportunity", 3], ["opportunities", 3], ["work with", 3], ["recruit", 3], ["open to", 3], ["collaborate", 3], ["collaboration", 3], ["project for", 3], ["need a developer", 4], ["offer", 2], ["vacancy", 3], ["looking for", 2]],
      html: "<p>Abdullah is <b>open to opportunities</b> in tech, AI and finance, and he's happy to connect about interesting problems. He's also completed a DigiSkills <b>Freelancing</b> course.</p><p>The quickest way to start a conversation is email or WhatsApp — and his CV has the full picture.</p>",
      links: [L.mail, L.wa, L.cv, L.contact],
      chips: ["Projects", "Skills", "Experience"]
    },
    {
      id: "cv",
      keys: [["cv", 5], ["resume", 5], ["résumé", 5], ["download", 3], ["curriculum", 3], ["pdf", 2]],
      html: "<p>You can download Abdullah's CV (2 pages, PDF) below. It covers his education, internship, projects, skills and certificates.</p>",
      links: [L.cv, L.contact],
      chips: ["Experience", "Projects", "Contact"]
    },
    {
      id: "location",
      keys: [["where", 3], ["location", 4], ["live", 2], ["city", 3], ["based", 3], ["country", 3], ["khanewal", 4], ["multan", 4], ["pakistan", 3], ["from", 1], ["address", 3], ["lives", 3]],
      html: "<p>Abdullah is from <b>Khanewal, Pakistan</b>, and studies at Bahauddin Zakariya University in <b>Multan</b>. I don't share any more specific address details here — please use the contact page for that.</p>",
      links: [L.contact],
      chips: ["Education", "Contact"]
    },
    {
      id: "interests",
      keys: [["interests", 4], ["interest", 4], ["hobbies", 4], ["hobby", 4], ["passion", 3], ["passionate", 3], ["spoken", 3], ["urdu", 3], ["english", 2], ["speak", 2], ["language", 1]],
      html: "<p><b>Interests:</b> Artificial Intelligence, Web Development, Data Analysis, and Finance &amp; Banking.</p><p><b>Languages:</b> English and Urdu.</p><p>Soft skills he lists: teamwork, collaboration, public speaking, problem solving, time management and adaptability.</p>",
      chips: ["Skills", "Projects", "Certificates"]
    },
    {
      id: "site",
      keys: [["this website", 5], ["this site", 5], ["this portfolio", 5], ["website", 3], ["how was this made", 5], ["built with", 3], ["made with", 3], ["three.js", 4], ["animation", 2], ["animations", 2], ["github pages", 3]],
      html: "<p>This portfolio is a hand-built static site using <b>HTML, CSS and JavaScript</b>, with a Three.js particle background on desktop and a lighter mode on phones. It's hosted on GitHub Pages.</p>",
      links: [L.proj],
      chips: ["Projects", "Skills"]
    },
    {
      id: "private",
      keys: [["age", 3], ["how old", 4], ["birthday", 4], ["date of birth", 4], ["dob", 3], ["salary", 4], ["income", 3], ["cnic", 4], ["married", 4], ["religion", 4], ["girlfriend", 4], ["marital", 4], ["home address", 4], ["pay", 1]],
      html: "<p>That's personal information I don't have and wouldn't share here. If it matters for a role or an offer, please ask Abdullah directly.</p>",
      links: [L.contact, L.mail],
      chips: MAIN_CHIPS
    }
  ];

  /* quick "does he know X?" answers */
  var TECH = [
    { k: ["python"], a: "Yes — Python is one of his main languages. He used it for HARNECT, Infinity-X and StockWise, and his skills page lists it among his strongest.", chips: ["HARNECT", "Infinity-X", "StockWise"] },
    { k: ["flask"], a: "Yes — Flask powers HARNECT (his social media app) and Infinity-X (his AI chatbot).", chips: ["HARNECT", "Infinity-X"] },
    { k: ["fastapi", "fast api"], a: "Yes — StockWise's backend is built with FastAPI, with PostgreSQL, SQLAlchemy, JWT-style authentication and 93 automated tests.", chips: ["StockWise"] },
    { k: ["javascript", "js"], a: "Yes — JavaScript is on his skills list. He used it for the front end of his web apps and wrote the whole Simplex Solver in it.", chips: ["Simplex Solver", "HARNECT"] },
    { k: ["html", "css", "frontend", "front end", "front-end"], a: "Yes — HTML and CSS are core skills. He builds responsive static sites (including this portfolio) and the front ends of his apps.", chips: ["Projects", "Skills"] },
    { k: ["sql", "mysql"], a: "Yes — SQL is a listed skill. His Employee Payroll System is a MySQL project, and his other apps use SQLAlchemy over SQLite / PostgreSQL.", chips: ["Employee Payroll", "StockWise"] },
    { k: ["postgres", "postgresql"], a: "Yes — StockWise uses PostgreSQL, with Alembic for database migrations.", chips: ["StockWise"] },
    { k: ["sqlite"], a: "Yes — SQLite is on his skills page and used in projects like Infinity-X.", chips: ["Infinity-X"] },
    { k: ["sqlalchemy", "alembic", "orm"], a: "Yes — he uses SQLAlchemy for database models and Alembic for migrations in HARNECT, Infinity-X and StockWise.", chips: ["StockWise", "HARNECT"] },
    { k: ["excel"], a: "Yes — Microsoft Excel is listed under Data & Analysis, and it's one of the skills he rates highest.", chips: ["Skills", "Certificates"] },
    { k: ["matlab"], a: "Yes — MATLAB is part of his BS Mathematics coursework and is on his skills list.", chips: ["Education", "Skills"] },
    { k: ["scikit", "sklearn", "machine learning", "ml", "decision tree"], a: "Yes — StockWise includes a scikit-learn Decision Tree model (81.5% test accuracy) for stock-out and expiry risk, and Infinity-X uses TF-IDF and semantic search.", chips: ["StockWise", "Infinity-X"] },
    { k: ["data analysis", "data analytics", "analytics", "data science"], a: "Yes — Data Analysis is a listed skill, and he completed the DigiSkills 'Data Analytics and Business Intelligence' course (Dec 2025). Data Analysis is also part of his degree coursework.", chips: ["Certificates", "Skills"] },
    { k: ["git", "github"], a: "Yes — Git & GitHub are on his skills list, and his projects and this portfolio are hosted on GitHub.", chips: ["Projects"] },
    { k: ["canva", "design"], a: "Yes — Canva design is listed under Tools & Other on his skills page.", chips: ["Skills"] },
    { k: ["docker"], a: "StockWise ships with Docker configuration (Dockerfile and docker-compose), so he has used it for packaging that project.", chips: ["StockWise"] },
    { k: ["pwa"], a: "Yes — HARNECT includes PWA support so it can be installed on a phone.", chips: ["HARNECT"] },
    { k: ["api", "rest", "backend", "back end", "back-end", "full stack", "full-stack", "fullstack"], a: "Yes — he builds full-stack apps and REST APIs (Flask and FastAPI) with databases behind them. HARNECT and StockWise are good examples.", chips: ["HARNECT", "StockWise"] },
    { k: ["ai", "artificial intelligence", "gpt", "openai", "gemini"], a: "AI is one of his main interests. Infinity-X is his AI chatbot — it rotates between several LLM providers with automatic failover — and StockWise uses a machine-learning model.", chips: ["Infinity-X", "StockWise"] }
  ];
  var NOT_LISTED = ["react", "angular", "vue", "django", "node", "nodejs", "java", "c++", "c#", "php", "laravel", "flutter", "kotlin", "swift", "tensorflow", "pytorch", "wordpress", "power bi", "powerbi", "tableau", "mongodb", "aws", "azure"];

  /* ------------------------------------------------------------------
     2. MATCHING
     ------------------------------------------------------------------ */
  function norm(s) {
    return " " + s.toLowerCase().replace(/[^a-z0-9+#.\u00e9\- ]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  }
  function edit1(a, b) {               // true if a and b differ by at most one edit
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, miss = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++miss > 1) return false;
      if (a.length > b.length) i++;
      else if (a.length < b.length) j++;
      else { i++; j++; }
    }
    return miss + (a.length - i) + (b.length - j) <= 1;
  }
  function hasWord(text, tokens, word) {
    if (word.indexOf(" ") > -1 || /[-.]/.test(word)) return text.indexOf(" " + word + " ") > -1 || text.indexOf(word) > -1;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (t === word) return true;
      if (word.length >= 5 && (t.indexOf(word) === 0 || word.indexOf(t) === 0 && t.length >= 5)) return true;  // plural / stem
      if (word.length >= 6 && edit1(t, word)) return true;                                                    // small typos
    }
    return false;
  }
  function hasTech(text, tokens, key) {
    if (key.indexOf(" ") > -1) return text.indexOf(" " + key + " ") > -1;
    return tokens.indexOf(key) > -1;
  }

  function findAnswer(raw) {
    var text = norm(raw), tokens = text.trim().split(" ").map(function (t) { return t.replace(/^[.\-]+|[.\-]+$/g, ""); });
    // 1. intent scoring
    var best = null, bestScore = 0;
    INTENTS.forEach(function (it) {
      var s = 0;
      it.keys.forEach(function (k) { if (hasWord(text, tokens, k[0])) s += k[1]; });
      if (s > bestScore) { bestScore = s; best = it; }
    });
    var specific = best && ["harnect", "infinity", "stockwise", "simplex", "payroll", "hub"].indexOf(best.id) > -1 && bestScore >= 4;
    if (specific) return best;

    // 2. "does he know <tech>?"
    for (var n = 0; n < NOT_LISTED.length; n++) {
      if (hasTech(text, tokens, NOT_LISTED[n])) {
        var name = NOT_LISTED[n];
        return {
          html: "<p>I don't see <b>" + name.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</b> listed among Abdullah's skills, so I can't confirm it. If it matters, ask him directly — he enjoys learning new tools.</p>",
          links: [L.skills, L.contact], chips: ["Skills", "Projects", "Contact"]
        };
      }
    }
    var techHit = null;
    TECH.forEach(function (t) { t.k.forEach(function (k) { if (!techHit && hasTech(text, tokens, k)) techHit = t; }); });
    if (techHit && (bestScore < 5 || best.id === "skills")) {
      return { html: "<p>" + techHit.a + "</p>", links: [L.skills], chips: techHit.chips };
    }

    if (best && bestScore >= 2) return best;
    return null;
  }

  var FALLBACK = {
    html: "<p>Hmm, I'm not sure about that one — I only know what's on this portfolio and Abdullah's CV. 🙂</p><p>Try asking about his <b>projects</b>, <b>skills</b>, <b>experience</b>, <b>education</b> or <b>certificates</b>, or reach out to him directly.</p>",
    links: [L.contact, L.mail],
    chips: MAIN_CHIPS
  };

  var CHIP_TO_QUERY = {
    "Hire him": "hire", "Employee Payroll": "payroll", "Leadership": "leadership",
    "Simplex Solver": "simplex solver", "Infinity-X": "infinity-x"
  };

  /* ------------------------------------------------------------------
     3. UI
     ------------------------------------------------------------------ */
  var ICON_BOT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 8V4"/><circle cx="12" cy="3.2" r="1"/><circle cx="9" cy="14" r="1.2" fill="currentColor"/><circle cx="15" cy="14" r="1.2" fill="currentColor"/><path d="M2 13v3M22 13v3"/></svg>';
  var ICON_X = '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var STORE = "portfolioAssistantV1";
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-40))); } catch (e) {} }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var launcher = el("button", "", ICON_BOT.replace("<svg", '<svg class="bot"') + ICON_X);
    launcher.id = "ai-launcher";
    launcher.setAttribute("aria-label", "Open chat assistant");
    launcher.setAttribute("aria-expanded", "false");

    var teaser = el("div", "", "Hi! 👋 Ask me anything about Abdullah.");
    teaser.id = "ai-teaser";

    var panel = el("div", "ai-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat with Abdullah's assistant");
    panel.innerHTML =
      '<div class="ai-head"><div class="ai-avatar">' + ICON_BOT + '</div>' +
      '<div><div class="ai-title">Abdullah\u2019s Assistant</div><div class="ai-sub">Online \u00b7 answers from this portfolio</div></div>' +
      '<button class="ai-close" aria-label="Close chat">\u2715</button></div>' +
      '<div class="ai-msgs" aria-live="polite"></div>' +
      '<div class="ai-chips"></div>' +
      '<form class="ai-form"><input class="ai-input" type="text" placeholder="Ask about projects, skills\u2026" autocomplete="off" maxlength="200" aria-label="Your question">' +
      '<button class="ai-send" type="submit" aria-label="Send">' + ICON_SEND + '</button></form>' +
      '<div class="ai-foot">Automated assistant \u00b7 not a general AI</div>';

    document.body.appendChild(panel);
    document.body.appendChild(teaser);
    document.body.appendChild(launcher);

    var msgs = panel.querySelector(".ai-msgs");
    var chips = panel.querySelector(".ai-chips");
    var form = panel.querySelector(".ai-form");
    var input = panel.querySelector(".ai-input");
    var busy = false;

    function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

    function addUser(text, silent) {
      var row = el("div", "ai-row user");
      var b = el("div", "ai-bubble"); b.textContent = text;       // visitor text is never parsed as HTML
      row.appendChild(b); msgs.appendChild(row);
      if (!silent) { history.push({ r: "u", t: text }); save(); }
      scrollDown();
    }
    function linksHtml(links) {
      if (!links || !links.length) return "";
      return '<div class="ai-links">' + links.map(function (l) {
        return '<a class="ai-link' + (l.alt ? " alt" : "") + '" href="' + l.h + '"' +
          (l.ext ? ' target="_blank" rel="noopener"' : "") + (l.dl ? " download" : "") + ">" + l.t + "</a>";
      }).join("") + "</div>";
    }
    function addBot(ans, silent) {
      var row = el("div", "ai-row");
      row.appendChild(el("div", "ai-mini", ICON_BOT));
      row.appendChild(el("div", "ai-bubble", ans.html + linksHtml(ans.links)));
      msgs.appendChild(row);
      setChips(ans.chips || MAIN_CHIPS);
      if (!silent) { history.push({ r: "b", html: ans.html, links: ans.links, chips: ans.chips }); save(); }
      scrollDown();
    }
    function setChips(list) {
      chips.innerHTML = "";
      list.forEach(function (c) {
        var b = el("button", "ai-chip"); b.type = "button"; b.textContent = c;
        b.addEventListener("click", function () { ask(c); });
        chips.appendChild(b);
      });
      chips.scrollLeft = 0;
    }

    function ask(text) {
      text = (text || "").trim();
      if (!text || busy) return;
      busy = true;
      addUser(text);
      input.value = "";
      var typing = el("div", "ai-row");
      typing.appendChild(el("div", "ai-mini", ICON_BOT));
      typing.appendChild(el("div", "ai-bubble ai-typing", "<i></i><i></i><i></i>"));
      msgs.appendChild(typing); scrollDown();

      var q = CHIP_TO_QUERY[text] || text;
      var ans = findAnswer(q) || FALLBACK;
      var delay = 450 + Math.min(ans.html.length, 600) * 0.7;       // feels natural, never slow
      setTimeout(function () {
        typing.remove(); addBot(ans); busy = false;
      }, delay);
    }

    /* restore earlier conversation (the site has several pages) */
    if (history.length) {
      history.forEach(function (m) { if (m.r === "u") addUser(m.t, true); else addBot(m, true); });
    } else {
      addBot(INTENTS[0], true);
      history.push({ r: "b", html: INTENTS[0].html, chips: INTENTS[0].chips }); save();
    }

    function setOpen(open) {
      panel.classList.toggle("open", open);
      launcher.classList.toggle("open", open);
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      launcher.setAttribute("aria-label", open ? "Close chat assistant" : "Open chat assistant");
      teaser.classList.remove("show");
      try { sessionStorage.setItem(STORE + "Open", open ? "1" : "0"); sessionStorage.setItem(STORE + "Teased", "1"); } catch (e) {}
      if (open) { scrollDown(); if (window.innerWidth > 600) setTimeout(function () { input.focus(); }, 280); }
    }
    launcher.addEventListener("click", function () { setOpen(!panel.classList.contains("open")); });
    teaser.addEventListener("click", function () { setOpen(true); });
    panel.querySelector(".ai-close").addEventListener("click", function () { setOpen(false); launcher.focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) setOpen(false); });
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });

    var wasOpen = false, teased = false;
    try { wasOpen = sessionStorage.getItem(STORE + "Open") === "1"; teased = sessionStorage.getItem(STORE + "Teased") === "1"; } catch (e) {}
    if (wasOpen) { panel.classList.add("open"); launcher.classList.add("open"); launcher.setAttribute("aria-expanded", "true"); scrollDown(); }
    else if (!teased) {
      setTimeout(function () {
        if (!panel.classList.contains("open")) {
          teaser.classList.add("show");
          setTimeout(function () { teaser.classList.remove("show"); }, 7000);
          try { sessionStorage.setItem(STORE + "Teased", "1"); } catch (e) {}
        }
      }, 6000);
    }
  });
})();
