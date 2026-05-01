/* ═══════════════════════════════════════════════════════════════
   CITY LIFE DATA — Curated metros + entry-level occupations
   Source: BLS OEWS (May 2024), Apartment List + Zumper rent reports
   (2025), MIT Living Wage Calculator (2024), Numbeo (2025), state
   DOL/franchise tax authorities (2025).
   All values are ESTIMATES for educational use only.
   Last refreshed: 2026-05
   ═══════════════════════════════════════════════════════════════ */

/* ── State income tax rates (top marginal, single filer) ──
   Used as a simplified flat estimate. Real tax is bracket-based.
   0 = no state income tax. */
const STATE_TAX = {
  AL:0.05, AK:0.00, AZ:0.025, AR:0.044, CA:0.093, CO:0.044, CT:0.0699,
  DE:0.066, DC:0.0875, FL:0.00, GA:0.0539, HI:0.11, ID:0.058, IL:0.0495,
  IN:0.0305, IA:0.057, KS:0.057, KY:0.045, LA:0.0425, ME:0.0715, MD:0.0575,
  MA:0.05, MI:0.0425, MN:0.0985, MS:0.05, MO:0.0495, MT:0.059, NE:0.0584,
  NV:0.00, NH:0.00, NJ:0.0637, NM:0.059, NY:0.0685, NC:0.045, ND:0.025,
  OH:0.0375, OK:0.0475, OR:0.099, PA:0.0307, RI:0.0599, SC:0.064, SD:0.00,
  TN:0.00, TX:0.00, UT:0.0455, VT:0.0875, VA:0.0575, WA:0.00, WV:0.0512,
  WI:0.0765, WY:0.00
};

/* ── 100 U.S. metros ──
   medianRent  = 1BR median monthly rent (USD)
   utilities   = electric + water + heat estimate (USD/mo)
   internet    = home broadband typical (USD/mo)
   groceries   = single adult grocery estimate (USD/mo)
   transport   = monthly transit pass OR equivalent gas+insurance (USD/mo)
   healthcare  = young adult marketplace silver plan estimate (USD/mo)
   colIndex    = composite cost-of-living index (US avg = 100)              */
const CITY_DATA = [
  /* ─ Northeast ─ */
  { id:"nyc",         city:"New York",         state:"NY", medianRent:3450, utilities:165, internet:75, groceries:485, transport:135, healthcare:295, colIndex:187 },
  { id:"brooklyn",    city:"Brooklyn",         state:"NY", medianRent:2890, utilities:155, internet:70, groceries:455, transport:135, healthcare:295, colIndex:163 },
  { id:"jersey-city", city:"Jersey City",      state:"NJ", medianRent:2750, utilities:150, internet:70, groceries:430, transport:130, healthcare:280, colIndex:148 },
  { id:"newark",      city:"Newark",           state:"NJ", medianRent:1820, utilities:150, internet:65, groceries:385, transport:115, healthcare:280, colIndex:111 },
  { id:"boston",      city:"Boston",           state:"MA", medianRent:2950, utilities:175, internet:75, groceries:455, transport:90,  healthcare:295, colIndex:162 },
  { id:"cambridge",   city:"Cambridge",        state:"MA", medianRent:3100, utilities:175, internet:75, groceries:465, transport:90,  healthcare:295, colIndex:170 },
  { id:"providence",  city:"Providence",       state:"RI", medianRent:1850, utilities:165, internet:65, groceries:385, transport:75,  healthcare:285, colIndex:117 },
  { id:"philadelphia",city:"Philadelphia",     state:"PA", medianRent:1610, utilities:155, internet:65, groceries:380, transport:96,  healthcare:265, colIndex:101 },
  { id:"pittsburgh",  city:"Pittsburgh",       state:"PA", medianRent:1290, utilities:155, internet:65, groceries:355, transport:97,  healthcare:265, colIndex:91  },
  { id:"buffalo",     city:"Buffalo",          state:"NY", medianRent:1180, utilities:165, internet:70, groceries:355, transport:80,  healthcare:285, colIndex:86  },
  { id:"rochester",   city:"Rochester",        state:"NY", medianRent:1190, utilities:160, internet:65, groceries:355, transport:75,  healthcare:285, colIndex:88  },
  { id:"hartford",    city:"Hartford",         state:"CT", medianRent:1620, utilities:175, internet:70, groceries:385, transport:80,  healthcare:295, colIndex:115 },
  { id:"manchester",  city:"Manchester",       state:"NH", medianRent:1750, utilities:170, internet:65, groceries:390, transport:60,  healthcare:280, colIndex:114 },
  { id:"portland-me", city:"Portland",         state:"ME", medianRent:1880, utilities:175, internet:65, groceries:395, transport:60,  healthcare:280, colIndex:115 },
  { id:"burlington",  city:"Burlington",       state:"VT", medianRent:1690, utilities:175, internet:65, groceries:395, transport:60,  healthcare:295, colIndex:113 },

  /* ─ Mid-Atlantic / South Atlantic ─ */
  { id:"dc",          city:"Washington",       state:"DC", medianRent:2480, utilities:155, internet:75, groceries:430, transport:120, healthcare:285, colIndex:152 },
  { id:"arlington",   city:"Arlington",        state:"VA", medianRent:2510, utilities:150, internet:75, groceries:430, transport:120, healthcare:265, colIndex:151 },
  { id:"alexandria",  city:"Alexandria",       state:"VA", medianRent:2290, utilities:150, internet:75, groceries:420, transport:120, healthcare:265, colIndex:142 },
  { id:"richmond",    city:"Richmond",         state:"VA", medianRent:1480, utilities:155, internet:65, groceries:380, transport:75,  healthcare:265, colIndex:99  },
  { id:"virginia-beach",city:"Virginia Beach", state:"VA", medianRent:1420, utilities:155, internet:65, groceries:375, transport:90,  healthcare:265, colIndex:97  },
  { id:"norfolk",     city:"Norfolk",          state:"VA", medianRent:1290, utilities:155, internet:65, groceries:370, transport:75,  healthcare:265, colIndex:93  },
  { id:"baltimore",   city:"Baltimore",        state:"MD", medianRent:1480, utilities:160, internet:65, groceries:385, transport:77,  healthcare:275, colIndex:96  },
  { id:"wilmington",  city:"Wilmington",       state:"DE", medianRent:1390, utilities:155, internet:65, groceries:380, transport:65,  healthcare:275, colIndex:95  },
  { id:"raleigh",     city:"Raleigh",          state:"NC", medianRent:1380, utilities:150, internet:60, groceries:370, transport:70,  healthcare:270, colIndex:96  },
  { id:"charlotte",   city:"Charlotte",        state:"NC", medianRent:1490, utilities:150, internet:60, groceries:375, transport:90,  healthcare:270, colIndex:99  },
  { id:"durham",      city:"Durham",           state:"NC", medianRent:1390, utilities:150, internet:60, groceries:370, transport:55,  healthcare:270, colIndex:95  },
  { id:"asheville",   city:"Asheville",        state:"NC", medianRent:1480, utilities:150, internet:60, groceries:380, transport:60,  healthcare:270, colIndex:100 },
  { id:"charleston",  city:"Charleston",       state:"SC", medianRent:1690, utilities:155, internet:65, groceries:385, transport:60,  healthcare:275, colIndex:108 },
  { id:"columbia-sc", city:"Columbia",         state:"SC", medianRent:1240, utilities:155, internet:60, groceries:355, transport:60,  healthcare:275, colIndex:90  },
  { id:"atlanta",     city:"Atlanta",          state:"GA", medianRent:1640, utilities:160, internet:65, groceries:380, transport:115, healthcare:280, colIndex:103 },
  { id:"savannah",    city:"Savannah",         state:"GA", medianRent:1390, utilities:160, internet:60, groceries:370, transport:60,  healthcare:280, colIndex:95  },
  { id:"jacksonville",city:"Jacksonville",     state:"FL", medianRent:1380, utilities:170, internet:65, groceries:380, transport:80,  healthcare:285, colIndex:96  },
  { id:"orlando",     city:"Orlando",          state:"FL", medianRent:1690, utilities:170, internet:65, groceries:385, transport:50,  healthcare:285, colIndex:104 },
  { id:"tampa",       city:"Tampa",            state:"FL", medianRent:1620, utilities:170, internet:65, groceries:385, transport:97,  healthcare:285, colIndex:103 },
  { id:"miami",       city:"Miami",            state:"FL", medianRent:2350, utilities:175, internet:70, groceries:415, transport:113, healthcare:295, colIndex:135 },
  { id:"fort-lauderdale",city:"Fort Lauderdale",state:"FL", medianRent:2080, utilities:170, internet:70, groceries:405, transport:65,  healthcare:295, colIndex:122 },
  { id:"tallahassee", city:"Tallahassee",      state:"FL", medianRent:1290, utilities:165, internet:65, groceries:370, transport:55,  healthcare:285, colIndex:91  },

  /* ─ Midwest ─ */
  { id:"chicago",     city:"Chicago",          state:"IL", medianRent:1880, utilities:155, internet:65, groceries:395, transport:75,  healthcare:265, colIndex:108 },
  { id:"milwaukee",   city:"Milwaukee",        state:"WI", medianRent:1390, utilities:155, internet:65, groceries:370, transport:75,  healthcare:280, colIndex:95  },
  { id:"madison",     city:"Madison",          state:"WI", medianRent:1490, utilities:155, internet:65, groceries:375, transport:65,  healthcare:280, colIndex:99  },
  { id:"minneapolis", city:"Minneapolis",      state:"MN", medianRent:1480, utilities:150, internet:65, groceries:380, transport:99,  healthcare:285, colIndex:101 },
  { id:"st-paul",     city:"St. Paul",         state:"MN", medianRent:1390, utilities:150, internet:65, groceries:375, transport:99,  healthcare:285, colIndex:97  },
  { id:"des-moines",  city:"Des Moines",       state:"IA", medianRent:1180, utilities:150, internet:60, groceries:355, transport:50,  healthcare:280, colIndex:88  },
  { id:"omaha",       city:"Omaha",            state:"NE", medianRent:1290, utilities:155, internet:60, groceries:360, transport:65,  healthcare:280, colIndex:91  },
  { id:"kansas-city", city:"Kansas City",      state:"MO", medianRent:1290, utilities:160, internet:60, groceries:370, transport:50,  healthcare:275, colIndex:91  },
  { id:"st-louis",    city:"St. Louis",        state:"MO", medianRent:1180, utilities:160, internet:60, groceries:365, transport:78,  healthcare:275, colIndex:88  },
  { id:"detroit",     city:"Detroit",          state:"MI", medianRent:1190, utilities:160, internet:60, groceries:365, transport:70,  healthcare:275, colIndex:89  },
  { id:"grand-rapids",city:"Grand Rapids",     state:"MI", medianRent:1290, utilities:160, internet:60, groceries:365, transport:55,  healthcare:275, colIndex:91  },
  { id:"ann-arbor",   city:"Ann Arbor",        state:"MI", medianRent:1690, utilities:160, internet:65, groceries:385, transport:65,  healthcare:275, colIndex:108 },
  { id:"cleveland",   city:"Cleveland",        state:"OH", medianRent:1090, utilities:160, internet:60, groceries:355, transport:95,  healthcare:270, colIndex:84  },
  { id:"columbus",    city:"Columbus",         state:"OH", medianRent:1280, utilities:160, internet:60, groceries:365, transport:62,  healthcare:270, colIndex:91  },
  { id:"cincinnati",  city:"Cincinnati",       state:"OH", medianRent:1280, utilities:160, internet:60, groceries:365, transport:80,  healthcare:270, colIndex:90  },
  { id:"indianapolis",city:"Indianapolis",     state:"IN", medianRent:1190, utilities:160, internet:60, groceries:355, transport:60,  healthcare:270, colIndex:88  },

  /* ─ South / Gulf ─ */
  { id:"nashville",   city:"Nashville",        state:"TN", medianRent:1690, utilities:155, internet:65, groceries:380, transport:65,  healthcare:275, colIndex:106 },
  { id:"memphis",     city:"Memphis",          state:"TN", medianRent:1190, utilities:160, internet:60, groceries:360, transport:60,  healthcare:275, colIndex:88  },
  { id:"knoxville",   city:"Knoxville",        state:"TN", medianRent:1290, utilities:155, internet:60, groceries:365, transport:55,  healthcare:275, colIndex:91  },
  { id:"louisville",  city:"Louisville",       state:"KY", medianRent:1190, utilities:160, internet:60, groceries:355, transport:55,  healthcare:265, colIndex:88  },
  { id:"lexington",   city:"Lexington",        state:"KY", medianRent:1190, utilities:160, internet:60, groceries:360, transport:50,  healthcare:265, colIndex:89  },
  { id:"birmingham",  city:"Birmingham",       state:"AL", medianRent:1190, utilities:165, internet:60, groceries:355, transport:65,  healthcare:270, colIndex:87  },
  { id:"huntsville",  city:"Huntsville",       state:"AL", medianRent:1190, utilities:160, internet:60, groceries:355, transport:50,  healthcare:270, colIndex:88  },
  { id:"new-orleans", city:"New Orleans",      state:"LA", medianRent:1490, utilities:170, internet:65, groceries:380, transport:80,  healthcare:285, colIndex:97  },
  { id:"baton-rouge", city:"Baton Rouge",      state:"LA", medianRent:1190, utilities:175, internet:60, groceries:365, transport:50,  healthcare:285, colIndex:88  },
  { id:"jackson",     city:"Jackson",          state:"MS", medianRent:1090, utilities:170, internet:60, groceries:355, transport:50,  healthcare:280, colIndex:84  },

  /* ─ Texas / Southwest ─ */
  { id:"houston",     city:"Houston",          state:"TX", medianRent:1390, utilities:170, internet:60, groceries:375, transport:90,  healthcare:285, colIndex:96  },
  { id:"austin",      city:"Austin",           state:"TX", medianRent:1690, utilities:160, internet:65, groceries:385, transport:50,  healthcare:285, colIndex:106 },
  { id:"dallas",      city:"Dallas",           state:"TX", medianRent:1490, utilities:165, internet:60, groceries:380, transport:96,  healthcare:285, colIndex:99  },
  { id:"fort-worth",  city:"Fort Worth",       state:"TX", medianRent:1380, utilities:165, internet:60, groceries:375, transport:96,  healthcare:285, colIndex:96  },
  { id:"san-antonio", city:"San Antonio",      state:"TX", medianRent:1290, utilities:165, internet:60, groceries:370, transport:75,  healthcare:285, colIndex:91  },
  { id:"el-paso",     city:"El Paso",          state:"TX", medianRent:1090, utilities:165, internet:60, groceries:360, transport:60,  healthcare:285, colIndex:84  },
  { id:"oklahoma-city",city:"Oklahoma City",   state:"OK", medianRent:1090, utilities:170, internet:60, groceries:355, transport:60,  healthcare:280, colIndex:84  },
  { id:"tulsa",       city:"Tulsa",            state:"OK", medianRent:1090, utilities:170, internet:60, groceries:355, transport:60,  healthcare:280, colIndex:84  },
  { id:"little-rock", city:"Little Rock",      state:"AR", medianRent:1090, utilities:165, internet:60, groceries:355, transport:50,  healthcare:275, colIndex:84  },
  { id:"phoenix",     city:"Phoenix",          state:"AZ", medianRent:1490, utilities:170, internet:65, groceries:380, transport:64,  healthcare:280, colIndex:99  },
  { id:"tucson",      city:"Tucson",           state:"AZ", medianRent:1290, utilities:170, internet:60, groceries:370, transport:50,  healthcare:280, colIndex:91  },
  { id:"albuquerque", city:"Albuquerque",      state:"NM", medianRent:1290, utilities:160, internet:60, groceries:365, transport:60,  healthcare:285, colIndex:91  },

  /* ─ Mountain West ─ */
  { id:"denver",      city:"Denver",           state:"CO", medianRent:1790, utilities:155, internet:65, groceries:395, transport:114, healthcare:285, colIndex:113 },
  { id:"colorado-springs",city:"Colorado Springs",state:"CO", medianRent:1490, utilities:155, internet:65, groceries:380, transport:65,  healthcare:285, colIndex:101 },
  { id:"salt-lake-city",city:"Salt Lake City", state:"UT", medianRent:1490, utilities:150, internet:65, groceries:380, transport:85,  healthcare:280, colIndex:101 },
  { id:"boise",       city:"Boise",            state:"ID", medianRent:1390, utilities:150, internet:60, groceries:380, transport:42,  healthcare:280, colIndex:97  },
  { id:"billings",    city:"Billings",         state:"MT", medianRent:1190, utilities:155, internet:60, groceries:380, transport:35,  healthcare:280, colIndex:91  },
  { id:"las-vegas",   city:"Las Vegas",        state:"NV", medianRent:1490, utilities:175, internet:65, groceries:380, transport:65,  healthcare:280, colIndex:101 },
  { id:"reno",        city:"Reno",             state:"NV", medianRent:1490, utilities:170, internet:60, groceries:385, transport:60,  healthcare:280, colIndex:99  },

  /* ─ West Coast ─ */
  { id:"seattle",     city:"Seattle",          state:"WA", medianRent:2150, utilities:160, internet:75, groceries:430, transport:99,  healthcare:285, colIndex:142 },
  { id:"tacoma",      city:"Tacoma",           state:"WA", medianRent:1490, utilities:155, internet:65, groceries:395, transport:99,  healthcare:285, colIndex:103 },
  { id:"spokane",     city:"Spokane",          state:"WA", medianRent:1290, utilities:155, internet:60, groceries:380, transport:60,  healthcare:285, colIndex:91  },
  { id:"portland-or", city:"Portland",         state:"OR", medianRent:1690, utilities:155, internet:65, groceries:395, transport:100, healthcare:280, colIndex:113 },
  { id:"eugene",      city:"Eugene",           state:"OR", medianRent:1490, utilities:155, internet:60, groceries:385, transport:60,  healthcare:280, colIndex:101 },
  { id:"sf",          city:"San Francisco",    state:"CA", medianRent:3290, utilities:165, internet:75, groceries:455, transport:81,  healthcare:295, colIndex:181 },
  { id:"oakland",     city:"Oakland",          state:"CA", medianRent:2390, utilities:160, internet:75, groceries:425, transport:81,  healthcare:295, colIndex:142 },
  { id:"san-jose",    city:"San Jose",         state:"CA", medianRent:2790, utilities:160, internet:75, groceries:445, transport:81,  healthcare:295, colIndex:160 },
  { id:"sacramento",  city:"Sacramento",       state:"CA", medianRent:1750, utilities:160, internet:65, groceries:395, transport:75,  healthcare:285, colIndex:115 },
  { id:"fresno",      city:"Fresno",           state:"CA", medianRent:1390, utilities:160, internet:60, groceries:385, transport:55,  healthcare:285, colIndex:99  },
  { id:"la",          city:"Los Angeles",      state:"CA", medianRent:2290, utilities:160, internet:70, groceries:425, transport:100, healthcare:295, colIndex:148 },
  { id:"long-beach",  city:"Long Beach",       state:"CA", medianRent:2090, utilities:160, internet:70, groceries:415, transport:100, healthcare:295, colIndex:135 },
  { id:"san-diego",   city:"San Diego",        state:"CA", medianRent:2390, utilities:155, internet:70, groceries:425, transport:72,  healthcare:295, colIndex:148 },
  { id:"riverside",   city:"Riverside",        state:"CA", medianRent:1690, utilities:160, internet:65, groceries:395, transport:60,  healthcare:295, colIndex:108 },
  { id:"anchorage",   city:"Anchorage",        state:"AK", medianRent:1290, utilities:165, internet:75, groceries:475, transport:60,  healthcare:295, colIndex:107 },
  { id:"honolulu",    city:"Honolulu",         state:"HI", medianRent:1990, utilities:185, internet:75, groceries:535, transport:80,  healthcare:280, colIndex:155 }
];

/* ── Entry-Level Occupations ──
   Median annual entry-level wage (BLS 10th-25th percentile)
   for someone within 0–3 years of starting the role.
   Education tier: HS = high school (no degree), AA = associate or trade,
                   BA = bachelor's, MIL = military service path        */
const OCCUPATIONS = [
  /* HS / no degree required */
  { id:"retail-mgr",        title:"Retail Store Manager",        entryWage:36000, edu:"HS" },
  { id:"warehouse-worker",  title:"Warehouse Associate",         entryWage:34000, edu:"HS" },
  { id:"delivery-driver",   title:"Delivery Driver",             entryWage:38000, edu:"HS" },
  { id:"truck-driver",      title:"Truck Driver (CDL)",          entryWage:48000, edu:"AA" },
  { id:"food-service",      title:"Food Service Worker",         entryWage:30000, edu:"HS" },
  { id:"barista",           title:"Barista / Café Lead",         entryWage:31000, edu:"HS" },
  { id:"hotel-clerk",       title:"Hotel Front-Desk Clerk",      entryWage:32000, edu:"HS" },
  { id:"customer-service",  title:"Customer Service Rep",        entryWage:36000, edu:"HS" },
  { id:"admin-assistant",   title:"Administrative Assistant",    entryWage:38000, edu:"HS" },
  { id:"bank-teller",       title:"Bank Teller",                 entryWage:35000, edu:"HS" },
  { id:"security-guard",    title:"Security Officer",            entryWage:34000, edu:"HS" },
  { id:"emt",               title:"EMT (entry)",                 entryWage:38500, edu:"AA" },
  { id:"firefighter",       title:"Firefighter (Recruit)",       entryWage:46000, edu:"HS" },
  { id:"police-officer",    title:"Police Officer (Recruit)",    entryWage:50000, edu:"HS" },
  { id:"navy-msc",          title:"MSC Civilian Mariner (Entry)",entryWage:55000, edu:"HS" },
  { id:"navy-enlisted",     title:"Military — Enlisted (E-3)",   entryWage:42000, edu:"MIL" },
  { id:"hvac-tech",         title:"HVAC Apprentice",             entryWage:42000, edu:"AA" },
  { id:"electrician-app",   title:"Electrician Apprentice",      entryWage:44000, edu:"AA" },
  { id:"plumber-app",       title:"Plumber Apprentice",          entryWage:42000, edu:"AA" },
  { id:"welder",            title:"Welder",                      entryWage:42000, edu:"AA" },
  { id:"auto-tech",         title:"Auto Technician",             entryWage:40000, edu:"AA" },
  { id:"construction-laborer",title:"Construction Laborer",      entryWage:38000, edu:"HS" },
  { id:"landscaper",        title:"Landscaper",                  entryWage:34000, edu:"HS" },

  /* Associate's / trade school / certificate */
  { id:"medical-assistant", title:"Medical Assistant",           entryWage:38000, edu:"AA" },
  { id:"dental-assistant",  title:"Dental Assistant",            entryWage:40000, edu:"AA" },
  { id:"pharmacy-tech",     title:"Pharmacy Technician",         entryWage:36000, edu:"AA" },
  { id:"radiology-tech",    title:"Radiology Technologist",      entryWage:55000, edu:"AA" },
  { id:"dental-hygienist",  title:"Dental Hygienist",            entryWage:65000, edu:"AA" },
  { id:"paralegal",         title:"Paralegal",                   entryWage:48000, edu:"AA" },
  { id:"licensed-practical-nurse",title:"LPN (Licensed Practical Nurse)",entryWage:52000, edu:"AA" },
  { id:"web-dev-jr",        title:"Junior Web Developer",        entryWage:55000, edu:"AA" },
  { id:"network-tech",      title:"Network Technician",          entryWage:52000, edu:"AA" },

  /* Bachelor's preferred */
  { id:"teacher-elem",      title:"Elementary Teacher",          entryWage:46000, edu:"BA" },
  { id:"teacher-secondary", title:"High School Teacher",         entryWage:48000, edu:"BA" },
  { id:"social-worker",     title:"Social Worker (BSW)",         entryWage:42000, edu:"BA" },
  { id:"registered-nurse",  title:"Registered Nurse (BSN)",      entryWage:62000, edu:"BA" },
  { id:"accountant-jr",     title:"Junior Accountant",           entryWage:55000, edu:"BA" },
  { id:"financial-analyst", title:"Financial Analyst (Entry)",   entryWage:62000, edu:"BA" },
  { id:"marketing-coord",   title:"Marketing Coordinator",       entryWage:48000, edu:"BA" },
  { id:"sales-rep",         title:"Inside Sales Rep",            entryWage:48000, edu:"BA" },
  { id:"hr-coordinator",    title:"HR Coordinator",              entryWage:48000, edu:"BA" },
  { id:"engineer-mech",     title:"Mechanical Engineer (Entry)", entryWage:72000, edu:"BA" },
  { id:"engineer-civil",    title:"Civil Engineer (Entry)",      entryWage:68000, edu:"BA" },
  { id:"engineer-electrical",title:"Electrical Engineer (Entry)",entryWage:75000, edu:"BA" },
  { id:"software-eng-jr",   title:"Software Engineer (Entry)",   entryWage:80000, edu:"BA" },
  { id:"data-analyst",      title:"Data Analyst (Entry)",        entryWage:62000, edu:"BA" },
  { id:"journalist",        title:"Journalist / Reporter",       entryWage:42000, edu:"BA" },
  { id:"graphic-designer",  title:"Graphic Designer",            entryWage:46000, edu:"BA" },
  { id:"architect-jr",      title:"Architectural Drafter",       entryWage:55000, edu:"AA" },
  { id:"real-estate-agent", title:"Real Estate Agent (Year 1)",  entryWage:42000, edu:"AA" },
  { id:"loan-officer",      title:"Loan Officer (Entry)",        entryWage:50000, edu:"BA" }
];

/* Make data globally available */
window.NGC_CITY_DATA = CITY_DATA;
window.NGC_OCCUPATIONS = OCCUPATIONS;
window.NGC_STATE_TAX = STATE_TAX;
