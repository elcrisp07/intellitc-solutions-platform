/**
 * IntelliTC — ZIP3 → Metro Mapping
 * Maps the first 3 digits of any US zip code to the nearest of 35 tracked metros.
 * ~900 ZIP3 prefixes compressed into range-based entries.
 *
 * Each entry: [startZip3, endZip3, metroKey, isApproximate]
 *   isApproximate = true when ZIP3 is 100+ miles from metro center
 *
 * Sources: USPS ZIP3 sectional center facility list, Census CBSA delineations
 */
(function(global) {
  'use strict';

  // Range-based mapping: [start, end, metroKey, approx]
  // Sorted ascending by start. First match wins.
  var RANGES = [
    // New England
    [  5,   5, 'new_york',     true],   // VT (far)
    [  6,   6, 'new_york',     true],   // VT
    [ 10,  14, 'new_york',     true],   // MA — Boston area (no Boston metro, nearest NYC)
    [ 15,  16, 'new_york',     true],   // CT border
    [ 17,  19, 'new_york',     true],   // MA
    [ 20,  26, 'new_york',     true],   // MA
    [ 27,  29, 'new_york',     true],   // RI / CT
    [ 30,  38, 'new_york',     true],   // NH
    [ 39,  49, 'new_york',     true],   // ME (far)
    [ 50,  54, 'new_york',     true],   // VT
    [ 55,  56, 'new_york',     true],   // MA
    [ 60,  69, 'new_york',     false],  // CT — close to NYC metro

    // NJ / NY / PA
    [ 70,  89, 'new_york',     false],  // NJ
    [100, 119, 'new_york',     false],  // NYC proper + suburbs
    [120, 129, 'new_york',     false],  // Albany / upstate NY
    [130, 137, 'new_york',     true],   // Syracuse / upstate NY
    [138, 139, 'new_york',     true],   // Binghamton
    [140, 149, 'new_york',     true],   // Buffalo (far from NYC)

    // Pennsylvania
    [150, 153, 'pittsburgh',   false],
    [154, 159, 'pittsburgh',   false],
    [160, 168, 'pittsburgh',   false],
    [169, 169, 'philadelphia', true],   // Central PA
    [170, 174, 'philadelphia', true],   // Harrisburg area
    [175, 176, 'philadelphia', true],   // Lancaster
    [177, 179, 'philadelphia', true],   // Williamsport / Scranton
    [180, 187, 'philadelphia', false],  // Lehigh Valley / Scranton
    [188, 196, 'philadelphia', false],  // Philadelphia metro

    // Delaware / Maryland / DC / Virginia
    [197, 199, 'philadelphia', false],  // DE — Wilmington
    [200, 205, 'washington_dc',false],  // DC
    [206, 209, 'washington_dc',false],  // MD suburbs
    [210, 212, 'baltimore',    false],  // Baltimore
    [214, 219, 'baltimore',    false],  // MD
    [220, 229, 'washington_dc',false],  // Northern VA
    [230, 232, 'richmond',     false],  // Richmond
    [233, 234, 'richmond',     false],  // Norfolk area
    [235, 237, 'richmond',     true],   // Southern VA
    [238, 239, 'richmond',     true],   // Roanoke area
    [240, 241, 'richmond',     true],   // SW Virginia
    [242, 244, 'richmond',     true],   // Roanoke / Lynchburg
    [245, 246, 'richmond',     true],   // WV (closest: Richmond)
    [247, 253, 'richmond',     true],   // WV — Charleston
    [254, 258, 'charlotte',    true],   // WV — Bluefield/south
    [259, 261, 'pittsburgh',   true],   // WV — north
    [262, 268, 'richmond',     true],   // WV — central

    // North Carolina
    [270, 274, 'raleigh',      false],  // Raleigh / Greensboro
    [275, 276, 'raleigh',      false],  // Raleigh proper
    [277, 279, 'charlotte',    false],  // Charlotte / Asheville
    [280, 282, 'charlotte',    false],  // Charlotte metro
    [283, 285, 'raleigh',      false],  // Fayetteville
    [286, 289, 'charlotte',    true],   // Asheville / western NC

    // South Carolina
    [290, 292, 'charlotte',    false],  // Columbia / upstate SC
    [293, 294, 'charlotte',    true],   // Charleston SC
    [295, 296, 'jacksonville', true],   // Beaufort / coastal SC
    [297, 299, 'charlotte',    true],   // Rock Hill / SC border

    // Georgia
    [300, 303, 'atlanta',      false],  // Atlanta metro
    [304, 307, 'atlanta',      false],  // Atlanta suburbs
    [308, 309, 'atlanta',      true],   // Augusta
    [310, 312, 'atlanta',      false],  // Atlanta proper
    [313, 315, 'atlanta',      true],   // Savannah
    [316, 319, 'atlanta',      true],   // Columbus / Macon GA

    // Florida
    [320, 322, 'jacksonville', false],  // Jacksonville
    [323, 325, 'orlando',      false],  // Tallahassee / Gainesville
    [326, 329, 'orlando',      false],  // Orlando metro
    [330, 334, 'miami',        false],  // Miami / Fort Lauderdale
    [335, 338, 'tampa',        false],  // Tampa metro
    [339, 339, 'miami',        false],  // Fort Myers area
    [340, 342, 'miami',        true],   // US Virgin Islands / PR
    [346, 347, 'tampa',        false],  // Tampa / Sarasota
    [349, 349, 'tampa',        true],   // Fort Myers

    // Alabama / Mississippi
    [350, 352, 'atlanta',      true],   // Birmingham
    [353, 355, 'atlanta',      true],   // Alabama — Huntsville
    [356, 358, 'atlanta',      true],   // Alabama — central
    [359, 361, 'atlanta',      true],   // Alabama — Mobile (far)
    [362, 365, 'atlanta',      true],   // Alabama
    [366, 369, 'atlanta',      true],   // Alabama — Montgomery

    // Tennessee
    [370, 374, 'nashville',    false],  // Nashville / Knoxville
    [375, 376, 'nashville',    false],  // Nashville metro
    [377, 379, 'nashville',    false],  // Chattanooga
    [380, 385, 'memphis',      false],  // Memphis metro

    // Mississippi
    [386, 389, 'memphis',      true],   // N Mississippi
    [390, 394, 'memphis',      true],   // Jackson MS
    [395, 397, 'memphis',      true],   // S Mississippi (far)

    // Kentucky
    [400, 409, 'indianapolis', true],   // Louisville
    [410, 412, 'indianapolis', true],   // Lexington
    [413, 418, 'indianapolis', true],   // Eastern KY
    [420, 427, 'nashville',    true],   // Western KY

    // Ohio
    [430, 432, 'columbus',     false],  // Columbus
    [433, 436, 'columbus',     false],  // Columbus area
    [437, 438, 'columbus',     true],   // Zanesville / SE Ohio
    [439, 441, 'cleveland',    false],  // Cleveland area
    [442, 443, 'cleveland',    false],  // Youngstown / Akron
    [444, 445, 'cleveland',    false],  // Cleveland proper
    [446, 449, 'cleveland',    false],  // Canton / Akron
    [450, 455, 'columbus',     false],  // Dayton / Cincinnati → Columbus
    [456, 458, 'columbus',     true],   // SE Ohio

    // Indiana
    [460, 462, 'indianapolis', false],  // Indianapolis
    [463, 466, 'indianapolis', false],  // Indy suburbs
    [467, 468, 'indianapolis', true],   // Fort Wayne
    [469, 472, 'indianapolis', false],  // Indianapolis area
    [473, 475, 'indianapolis', true],   // Southern IN
    [476, 479, 'indianapolis', true],   // Evansville / Terre Haute

    // Michigan
    [480, 485, 'detroit',      false],  // Detroit metro
    [486, 489, 'detroit',      true],   // Saginaw / Traverse City
    [490, 495, 'detroit',      true],   // Kalamazoo / Grand Rapids
    [496, 499, 'detroit',      true],   // Upper Michigan (far)

    // Iowa
    [500, 509, 'kansas_city',  true],   // Des Moines
    [510, 516, 'kansas_city',  true],   // Iowa western
    [520, 528, 'minneapolis',  true],   // Iowa eastern — Cedar Rapids

    // Wisconsin
    [530, 532, 'chicago',      true],   // Milwaukee / Madison
    [534, 535, 'chicago',      true],   // Milwaukee area
    [537, 539, 'chicago',      true],   // Madison
    [540, 545, 'minneapolis',  true],   // Green Bay / northern WI
    [546, 549, 'minneapolis',  true],   // La Crosse / Eau Claire

    // Minnesota
    [550, 553, 'minneapolis',  false],  // Minneapolis / St. Paul
    [554, 558, 'minneapolis',  false],  // Twin Cities metro
    [559, 563, 'minneapolis',  true],   // Rochester / Mankato
    [564, 567, 'minneapolis',  true],   // Duluth / northern MN

    // South Dakota
    [570, 577, 'minneapolis',  true],   // Sioux Falls / Rapid City (far)

    // North Dakota
    [580, 588, 'minneapolis',  true],   // Fargo / Bismarck (far)

    // Montana
    [590, 599, 'salt_lake',    true],   // Billings / Helena (far)

    // Illinois
    [600, 608, 'chicago',      false],  // Chicago metro
    [609, 612, 'chicago',      false],  // Chicago suburbs
    [613, 616, 'st_louis',     true],   // Peoria / Champaign
    [617, 619, 'st_louis',     true],   // Bloomington / Decatur
    [620, 629, 'st_louis',     false],  // Southern IL → St. Louis

    // Missouri
    [630, 631, 'st_louis',     false],  // St. Louis
    [633, 639, 'st_louis',     false],  // St. Louis area
    [640, 641, 'kansas_city',  false],  // Kansas City MO
    [644, 645, 'kansas_city',  false],  // Kansas City
    [646, 648, 'kansas_city',  true],   // Mid-Missouri
    [649, 649, 'kansas_city',  true],   // NW Missouri
    [650, 653, 'st_louis',     true],   // Jefferson City / central MO
    [654, 655, 'kansas_city',  true],   // Springfield MO
    [656, 658, 'kansas_city',  true],   // Springfield area

    // Kansas
    [660, 662, 'kansas_city',  false],  // Kansas City KS
    [664, 668, 'kansas_city',  true],   // Topeka / Wichita
    [669, 672, 'kansas_city',  true],   // Salina / Wichita
    [673, 679, 'kansas_city',  true],   // Western Kansas (far)

    // Nebraska
    [680, 681, 'kansas_city',  true],   // Omaha
    [683, 689, 'kansas_city',  true],   // Lincoln / NE
    [690, 693, 'kansas_city',  true],   // Western Nebraska (far)

    // Louisiana
    [700, 701, 'houston',      true],   // New Orleans
    [703, 708, 'houston',      true],   // Louisiana
    [710, 714, 'houston',      true],   // Shreveport / Monroe

    // Arkansas
    [716, 722, 'memphis',      true],   // Little Rock / central AR
    [723, 725, 'memphis',      true],   // Pine Bluff / west AR
    [726, 729, 'dallas',       true],   // Texarkana / SW AR

    // Oklahoma
    [730, 731, 'dallas',       true],   // Oklahoma City
    [734, 741, 'dallas',       true],   // Oklahoma
    [743, 744, 'dallas',       true],   // Tulsa area
    [745, 749, 'dallas',       true],   // Tulsa / NE OK

    // Texas
    [750, 754, 'dallas',       false],  // Dallas metro
    [755, 756, 'dallas',       true],   // Texarkana
    [757, 759, 'dallas',       false],  // DFW suburbs
    [760, 764, 'dallas',       false],  // Fort Worth / DFW
    [765, 767, 'dallas',       true],   // Waco
    [768, 769, 'dallas',       true],   // Abilene (far)
    [770, 775, 'houston',      false],  // Houston metro
    [776, 777, 'houston',      false],  // Houston proper
    [778, 779, 'san_antonio',  true],   // Bryan / College Station
    [780, 782, 'san_antonio',  false],  // San Antonio metro
    [783, 785, 'houston',      true],   // Corpus Christi
    [786, 789, 'austin',       false],  // Austin metro
    [790, 793, 'dallas',       true],   // Amarillo / Lubbock (far)
    [794, 796, 'dallas',       true],   // Midland / Odessa (far)
    [797, 799, 'dallas',       true],   // El Paso (far)

    // Colorado
    [800, 803, 'denver',       false],  // Denver metro
    [804, 806, 'denver',       false],  // Denver suburbs
    [807, 808, 'denver',       true],   // Southern CO
    [809, 810, 'denver',       true],   // Colorado Springs
    [811, 816, 'denver',       true],   // Western CO — Grand Junction / Durango

    // Wyoming
    [820, 831, 'denver',       true],   // Cheyenne / Casper (far)

    // Idaho
    [832, 833, 'salt_lake',    true],   // Boise
    [834, 838, 'salt_lake',    true],   // Idaho

    // Utah
    [840, 844, 'salt_lake',    false],  // Salt Lake City metro
    [845, 847, 'salt_lake',    true],   // Southern Utah

    // Arizona
    [850, 853, 'phoenix',      false],  // Phoenix metro
    [855, 857, 'phoenix',      true],   // Globe / Tucson
    [859, 860, 'phoenix',      true],   // Flagstaff / Show Low
    [863, 865, 'phoenix',      true],   // Tucson

    // New Mexico
    [870, 875, 'phoenix',      true],   // Albuquerque / Santa Fe
    [877, 884, 'phoenix',      true],   // New Mexico (far)

    // Nevada
    [889, 891, 'las_vegas',    false],  // Las Vegas metro
    [893, 895, 'las_vegas',    true],   // Reno / Carson City
    [897, 898, 'las_vegas',    true],   // Northern NV

    // California
    [900, 908, 'los_angeles',  false],  // Los Angeles metro
    [910, 918, 'los_angeles',  false],  // LA suburbs / Pasadena
    [919, 921, 'los_angeles',  true],   // San Diego
    [922, 925, 'los_angeles',  true],   // Palm Springs / San Bernardino
    [926, 928, 'los_angeles',  false],  // Orange County / Santa Ana
    [930, 935, 'los_angeles',  true],   // Santa Barbara / Bakersfield
    [936, 939, 'san_francisco',false],  // San Francisco Bay Area
    [940, 942, 'san_francisco',false],  // SF proper
    [943, 945, 'san_francisco',false],  // San Mateo / Palo Alto
    [946, 948, 'san_francisco',false],  // Oakland / East Bay
    [949, 951, 'san_francisco',true],   // Stockton / Modesto
    [952, 954, 'san_francisco',true],   // Fresno (far-ish)
    [955, 960, 'san_francisco',true],   // Sacramento / northern CA
    [961, 966, 'san_francisco',true],   // Far northern CA — Redding / Eureka

    // Oregon
    [970, 974, 'portland',     false],  // Portland metro
    [975, 979, 'portland',     true],   // Southern / Eastern OR

    // Washington
    [980, 981, 'seattle',      false],  // Seattle
    [982, 984, 'seattle',      false],  // Seattle metro / Tacoma
    [985, 986, 'portland',     true],   // Olympia / SW WA
    [988, 989, 'seattle',      true],   // Wenatchee / Yakima
    [990, 994, 'seattle',      true],   // Spokane / Eastern WA

    // Hawaii
    [967, 968, 'los_angeles',  true],   // Hawaii (far)

    // Alaska
    [995, 999, 'seattle',      true],   // Alaska (far)

    // Puerto Rico / US territories
    [  0,   4, 'new_york',     true],   // PR / USVI
    [  6,   9, 'new_york',     true]    // PR / USVI
  ];

  /**
   * Look up a zip code and return the matched metro key + proximity info.
   * @param {string} zip — 5-digit zip code
   * @returns {{ metroKey: string, approximate: boolean } | null}
   */
  function lookupZip(zip) {
    if (!zip || zip.length < 3) return null;
    var z3 = parseInt(zip.substring(0, 3), 10);
    if (isNaN(z3)) return null;

    for (var i = 0; i < RANGES.length; i++) {
      var r = RANGES[i];
      if (z3 >= r[0] && z3 <= r[1]) {
        return { metroKey: r[2], approximate: r[3] };
      }
    }
    return null;
  }

  global.ZipMetroMap = { lookup: lookupZip };
})(window);
