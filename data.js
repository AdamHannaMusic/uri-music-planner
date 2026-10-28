/*
 * URI Music Course Sequence Planner — data
 *
 * Sources (all in this project folder):
 *   - Degree worksheets (BOM / BA, Fall 2026–Spring 2027)
 *   - URI MUSIC PROJECTED COURSE ROTATION 2027–2031
 *
 * TERMS come straight from the rotation sheet columns.
 * COURSES carry title, credits, gen-ed attributes, and the set of terms
 * each course is projected to run ("X" = offered, "?" = tentative).
 */

// Ordered list of planning terms available from the projected rotation.
const TERMS = [
  { id: "S27", label: "Spring 2027", season: "Spring", year: 2027 },
  { id: "F27", label: "Fall 2027", season: "Fall", year: 2027 },
  { id: "S28", label: "Spring 2028", season: "Spring", year: 2028 },
  { id: "F28", label: "Fall 2028", season: "Fall", year: 2028 },
  { id: "S29", label: "Spring 2029", season: "Spring", year: 2029 },
  { id: "F29", label: "Fall 2029", season: "Fall", year: 2029 },
  { id: "S30", label: "Spring 2030", season: "Spring", year: 2030 },
  { id: "F30", label: "Fall 2030", season: "Fall", year: 2030 },
  { id: "S31", label: "Spring 2031", season: "Spring", year: 2031 },
];

const TERM_IDS = TERMS.map((t) => t.id);

/*
 * COURSES
 * key   = course code
 * title = course name
 * cr    = credits (string, since several are ranges like "0-1")
 * attrs = gen-ed outcome attributes noted on the rotation
 * terms = { S27: "X"|"?", ... }  only terms where the course runs are listed
 *
 * Availability transcribed from the projected rotation grid. "X" offered,
 * "?" tentative. A missing term = not projected to run that semester.
 */
function _t(str) {
  // helper: "X X X X" aligned to TERM_IDS -> {S27:'X', F27:'X', ...}
  const parts = str.trim().split(/\s+/);
  const out = {};
  parts.forEach((v, i) => {
    if (v && v !== "-" && TERM_IDS[i]) out[TERM_IDS[i]] = v;
  });
  return out;
}

const COURSES = {
  // 01 GENERAL EDUCATION | BROAD-ACCESS
  "MUS 101": { title: "Introduction to Music", cr: "3", attrs: ["A4", "B1"], terms: _t("X X X X X X X X X") },
  "MUS 105": { title: "History of Rock and Roll", cr: "3", attrs: ["A4", "C3"], terms: _t("X X X X X X X X X") },
  "MUS 106": { title: "History of Jazz", cr: "3", attrs: ["A4", "C3"], terms: _t("X X X X X X X X X") },
  "MUS 269": { title: "The Art of Video Game Music", cr: "3", attrs: ["A4", "B2"], terms: _t("X X X X") },

  // 02 ADDITIONAL APPROVED GEN ED
  "MUS 208": { title: "History of Hip-Hop in Black American Culture", cr: "3", attrs: ["A4", "C1"], terms: _t("X X X X X X X X X") },
  "MUS 301": { title: "Music as a Form of Social Protest", cr: "3", attrs: ["A4", "C1"], terms: _t("X X X X X X X X X") },
  "MUS 318G": { title: "Technologies and Music", cr: "3", attrs: ["A1", "G"], terms: _t("X X X X") },

  // 03 THEORY, MUSICIANSHIP & SHARED CORE
  "MUS 115": { title: "Musicianship Lab I", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 116": { title: "Music Theory I", cr: "3", attrs: [], terms: _t("X - X - X - X") },
  "MUS 117": { title: "Musicianship Lab II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 118": { title: "Music Theory II", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 171": { title: "Class Piano I", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 172": { title: "Class Piano II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 215": { title: "Musicianship Lab III", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 216": { title: "Music Theory III", cr: "3", attrs: [], terms: _t("X - X - X - X") },
  "MUS 217": { title: "Musicianship Lab IV", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 218": { title: "Music Theory IV", cr: "3", attrs: ["A4", "B3"], terms: _t("X X X X X") },
  "MUS 271": { title: "Class Piano III", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 272": { title: "Class Piano IV", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 111": { title: "Basic Musicianship", cr: "3", attrs: ["A4"], terms: _t("X X X X X X X X X") },
  "MUS 119": { title: "Introduction to the Music Profession", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 220": { title: "Music as Global Culture", cr: "3", attrs: ["A3", "C2"], terms: _t("X - X - X - X") },
  "MUS 222": { title: "History of Classical Music, 900-1900", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 239": { title: "Music, Gesture and Sound", cr: "1", attrs: [], terms: _t("? ? ? ? ? ? ? ? ?") },
  "MUS 256": { title: "Somatic Education for Musicians", cr: "2", attrs: [], terms: _t("X X X X X") },

  // 04 APPLIED MUSIC & PERFORMANCE FOUNDATIONS
  "MUS 110": { title: "Applied Music (non-majors / second instrument)", cr: "1-2", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 210": { title: "Applied Music (lessons, first 4 semesters)", cr: "2", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 410": { title: "Applied Music (lessons, 5th semester and beyond)", cr: "2", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 107": { title: "Basics in Acoustic and Classical Guitar", cr: "1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 108": { title: "Basics of Piano", cr: "1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 109": { title: "Basics of Singing", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 184": { title: "Lyric Diction I: Italian and English", cr: "2", attrs: [], terms: _t("? ? ? ? ?") },
  "MUS 283": { title: "Lyric Diction II: German and French", cr: "2", attrs: [], terms: _t("? ? ? ?") },
  "MUS 411": { title: "Advanced Performance Studies", cr: "1", attrs: [], terms: _t("? ? ? ? ? ? ? ? ?") },
  "MUS 442": { title: "Directed Study in Applied Music Pedagogy", cr: "2", attrs: [], terms: _t("X X X X X") },
  "MUS 445": { title: "Vocal Pedagogy (runs when needed)", cr: "2", attrs: [], terms: {} },
  "MUS 446": { title: "Piano Pedagogy (use when needed)", cr: "3", attrs: [], terms: {} },
  "MUS 447": { title: "Piano Literature (use when needed)", cr: "3", attrs: [], terms: {} },
  "MUS 371": { title: "Piano Accompanying", cr: "1", attrs: [], terms: _t("X X X X X X X X X") },

  // 05 MUSIC PRODUCTION & PROFESSIONAL STUDIES
  "MUS 261": { title: "Introduction to Music Production", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 367": { title: "Integrative Career Studies for Musicians", cr: "3", attrs: ["D1"], terms: _t("X X X X X") },

  // 06 JAZZ STUDIES
  "MUS 124": { title: "Jazz Improvisation I", cr: "3", attrs: [], terms: _t("X - X - X - X") },
  "MUS 125": { title: "Jazz Improvisation II", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 229": { title: "History of Jazz for Majors I: Early Jazz 1900-1951", cr: "3", attrs: [], terms: _t("X - X - X - X") },
  "MUS 252": { title: "Jazz Repertoire Building I", cr: "1", attrs: [], terms: { S27: "?", S28: "?" } },
  "MUS 253": { title: "Jazz Repertoire Building II", cr: "1", attrs: [], terms: { F27: "?", F28: "?", F29: "?" } },
  "MUS 273": { title: "Basics of Jazz Piano", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 324": { title: "Advanced Jazz Improvisation", cr: "2", attrs: [], terms: { S27: "?", S28: "?", S29: "?", S30: "?" } },
  "MUS 329": { title: "History of Jazz for Majors II: Modern Jazz 1952-Now", cr: "3", attrs: [], terms: { F27: "?", F28: "?" } },
  "MUS 418": { title: "Jazz Composition and Arranging I", cr: "3", attrs: [], terms: { F27: "?", F29: "?" } },
  "MUS 419": { title: "Jazz Composition and Arranging II", cr: "3", attrs: [], terms: { S28: "?", S30: "?" } },
  "MUS 423": { title: "Jazz Research", cr: "3", attrs: ["A3", "C3"], terms: { S27: "X" } },
  "MUS 424": { title: "Jazz Theory and Improvisation", cr: "3", attrs: [], terms: { S27: "?" } },

  // 07 ADVANCED MUSICOLOGY, THEORY & COMPOSITION
  "MUS 322": { title: "Genre and Identity in 20th and 21st Century Music", cr: "3", attrs: ["A3", "C3"], terms: _t("X - X - X - X") },
  "MUS 407": { title: "The Symphony", cr: "3", attrs: [], terms: { S27: "X" } },
  "MUS 408": { title: "The Opera", cr: "3", attrs: [], terms: { F27: "X" } },
  "MUS 416": { title: "Form and Analysis", cr: "3", attrs: [], terms: { S27: "X", S28: "X" } },
  "MUS 417": { title: "Orchestration", cr: "3", attrs: [], terms: { F27: "X", F28: "X" } },
  "MUS 420": { title: "Eighteenth-Century Counterpoint", cr: "3", attrs: [], terms: { S27: "X", S28: "X", S29: "X" } },
  "MUS 516": { title: "Seminar in Advanced Music Theory", cr: "3", attrs: [], terms: {} },
  "MUS 517": { title: "Orchestration", cr: "3", attrs: [], terms: {} },
  "MUS 520": { title: "Advanced Studies In Musicology", cr: "3", attrs: [], terms: { F27: "X", F28: "X" } },
  "MUS 422": { title: "Music and Word in the Western Art Music Tradition", cr: "3", attrs: [], terms: { S27: "X" } },
  "MUS 426": { title: "Period Studies in Music", cr: "3", attrs: [], terms: { F27: "X", F28: "X" } },
  "MUS 427": { title: "Critical Studies in Musicology", cr: "3", attrs: [], terms: { S27: "X" } },

  // 08 MUSIC EDUCATION & TEACHING METHODS
  "MUS 311": { title: "Choral Conducting Laboratory", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 312": { title: "Instrumental Conducting Laboratory", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 338": { title: "General Music Methods & Materials", cr: "3", attrs: [], terms: _t("X - X - X - X") },
  "MUS 339": { title: "Choral Methods & Materials", cr: "3", attrs: [], terms: {} },
  "MUS 169": { title: "Percussion Methods", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 173": { title: "Voice Methods", cr: "1", attrs: [], terms: _t("? ? ? ? ? ? ? ? ?") },
  "MUS 175": { title: "String Methods", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 177": { title: "Woodwind Methods", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 179": { title: "Brass Methods", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 235": { title: "Introduction to Music Teaching", cr: "3", attrs: [], terms: _t("? ? ? ? ? ? ? ? ?") },
  "MUS 340": { title: "Ensemble Methods and Materials", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 376": { title: "Field Experiences in Music Education", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 441": { title: "Diverse Learners in Music", cr: "3", attrs: ["A4", "C1"], terms: _t("? ? ? ? ?") },
  "MUS 476": { title: "Practical Music Teaching Residency I", cr: "4", attrs: [], terms: _t("X - X - X - X") },

  // 09 MUSIC THERAPY
  "MUS 136": { title: "Music Therapy Overview", cr: "2", attrs: [], terms: _t("X X X X X") },
  "MUS 137": { title: "Music Therapy Pre-clinical Observation", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 170": { title: "Guitar Methods", cr: "1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 180": { title: "Guitar Methods II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 183": { title: "Voice Methods II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 232": { title: "Music Therapy in Adult and Late Life", cr: "2", attrs: [], terms: _t("X X X X X") },
  "MUS 233": { title: "Assessment and Treatment Planning", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 236": { title: "Music Therapy Practicum I", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 237": { title: "Music Therapy Practicum II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 243": { title: "Seminar in Therapeutic Relationships I", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 244": { title: "Seminar in Therapeutic Relationships II", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 331": { title: "Music Therapy for Children and Adolescents", cr: "2", attrs: [], terms: _t("X X X X X") },
  "MUS 332": { title: "Psychiatric Music Therapy", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 334": { title: "World Percussion Traditions", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 335": { title: "Music Therapy Foundations", cr: "2", attrs: [], terms: _t("X X X X X") },
  "MUS 336": { title: "Music Therapy Practicum III", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 337": { title: "Music Therapy Practicum IV", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 343": { title: "Seminar in Therapeutic Relationships III", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 344": { title: "Seminar in Therapeutic Relationships IV", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 435": { title: "Clinical Musicianship", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 436": { title: "Music Therapy Practicum V", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 437": { title: "Music Therapy Practicum VI", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 438": { title: "Music, Mind and Body", cr: "3", attrs: [], terms: _t("X X X X X") },
  "MUS 439": { title: "Medical Music Therapy", cr: "2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 443": { title: "Seminar in Therapeutic Relationships V", cr: "1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 444": { title: "Seminar in Therapeutic Relationships VI", cr: "1", attrs: [], terms: _t("X X X X X") },
  "MUS 486": { title: "Music Therapy Research", cr: "3", attrs: [], terms: { S27: "?" } },
  "MUS 491": { title: "Clinical Internship", cr: "3-6", attrs: [], terms: _t("? ? ? ? ? ? ? ? ?") },
  "MUS 493": { title: "Internship Seminar", cr: "3", attrs: ["B2", "D1"], terms: _t("X - X - X - X") },

  // 10 SPECIAL TOPICS, INTERNSHIPS & INDEPENDENT STUDY
  "MUS 470": { title: "Special Topics in Music", cr: "3", attrs: [], terms: {} },
  "MUS 477": { title: "Music Internship", cr: "1-3", attrs: [], terms: {} },
  "MUS 490": { title: "Independent Study", cr: "1-3", attrs: [], terms: _t("X X X X X X X X X") },

  // 11 ENSEMBLES, CONVOCATION & RECITALS
  "MUS 290": { title: "University Pep Band", cr: "0-1", attrs: [], terms: _t("X X X X X") },
  "MUS 291": { title: "University Marching Band", cr: "0-2", attrs: [], terms: _t("X - X - X - X") },
  "MUS 292": { title: "Concert Band", cr: "0-1", attrs: ["A4"], terms: _t("X X X X X X X X X") },
  "MUS 293": { title: "University Chorus", cr: "0-1", attrs: ["A4"], terms: _t("X X X X X X X X X") },
  "MUS 300": { title: "Music Convocation", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 350": { title: "Junior Recital", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 391": { title: "Jazz Combo / Studio (applied jazz)", cr: "1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 394": { title: "Wind Ensemble", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 395": { title: "Concert Choir", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 396": { title: "Jazz Studio Ensemble", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 397": { title: "University Symphony Orchestra", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 450": { title: "Senior Recital", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398B": { title: "Chamber Music Ensembles — Brass", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398G": { title: "Chamber Music Ensembles — Guitar", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398J": { title: "Chamber Music Ensembles — Jazz", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398K": { title: "Chamber Music Ensembles — Keyboard", cr: "0-1", attrs: [], terms: _t("X - X - X - X") },
  "MUS 398M": { title: "Chamber Music Ensembles — Mixed Instrumentation", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398P": { title: "Chamber Music Ensembles — Percussion", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398S": { title: "Chamber Music Ensembles — Strings", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398V": { title: "Chamber Music Ensembles — Voice", cr: "0-1", attrs: [], terms: _t("? ? ? ?") },
  "MUS 398W": { title: "Chamber Music Ensembles — Woodwinds", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
  "MUS 398Z": { title: "Chamber Music Ensembles", cr: "0-1", attrs: [], terms: {} },
  "MUS 485": { title: "Opera Workshop", cr: "0-1", attrs: [], terms: _t("X X X X X X X X X") },
};

/*
 * DEGREES — each worksheet turned into a list of requirement groups.
 *
 * A group has:
 *   label    : heading text from the worksheet
 *   note     : optional guidance line
 *   courses  : array of items. Each item is either
 *                { code: "MUS 116" }                        a specific required course
 *                { code: "MUS 311", alt: ["MUS 312"] }      pick-one alternatives
 *                { choose: n, from: [...codes] }            pick n from a list
 *                { placeholder: "Upper-div MUS History", cr: "3" }   student fills in
 *              Items may also carry repeat:n to show n slots of the same course.
 */
const DEGREES = {
  classical_guitar: {
    name: "B.M. — Classical Guitar Performance",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311" }, { code: "MUS 312" }, { code: "MUS 322" }, { code: "MUS 350" },
          { code: "MUS 367" }, { code: "MUS 416" }, { code: "MUS 442" }, { code: "MUS 450" },
          { code: "MUS 170" }, { code: "MUS 256" }, { code: "MUS 411", repeat: 2 },
        ],
      },
      {
        label: "Piano Proficiency",
        note: "Pass all exams by fall of junior year. C or better to advance.",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      {
        label: "Music Convocation (8 semesters)",
        courses: [{ code: "MUS 300", repeat: 8 }],
      },
      {
        label: "Applied Music Lessons (principal area)",
        note: "MUS 210T first four semesters, then MUS 410T.",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }],
      },
      {
        label: "Major Ensemble (2 semesters)",
        note: "From MUS 292, 293.",
        courses: [{ choose: 2, from: ["MUS 292", "MUS 293"] }],
      },
      {
        label: "Chamber Ensemble (2 semesters)",
        courses: [{ code: "MUS 398M", repeat: 2 }],
      },
      {
        label: "Guitar Ensemble (8 semesters)",
        courses: [{ code: "MUS 398G", repeat: 8 }],
      },
      {
        label: "Upper-Division History & Theory",
        note: "1 upper-division MUS History and 1 upper-division MUS Theory course.",
        courses: [
          { placeholder: "Upper-division MUS History", cr: "3" },
          { placeholder: "Upper-division MUS Theory", cr: "3" },
        ],
      },
      {
        label: "Electives (7 cr, ≥3 upper-division MUS)",
        courses: [{ placeholder: "MUS Elective", cr: "3" }, { placeholder: "MUS Elective", cr: "3" }, { placeholder: "Elective", cr: "1" }],
      },
    ],
  },

  composition: {
    name: "B.M. — Music Composition",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 322" }, { code: "MUS 367" },
          { code: "MUS 416" }, { code: "MUS 417" }, { code: "MUS 420" }, { code: "MUS 450" },
        ],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (8 semesters)", courses: [{ code: "MUS 300", repeat: 8 }] },
      {
        label: "Applied Composition (8 semesters, 16 cr)",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }],
      },
      {
        label: "Upper-Division Music History",
        courses: [{ placeholder: "Upper-division MUS History", cr: "3" }],
      },
      {
        label: "Major Ensemble (6 cr, 1/semester)",
        note: "From MUS 292, 293, 394, 395, 396, 397, 398J.",
        courses: [{ choose: 6, from: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398J"] }],
      },
      {
        label: "Electives (3 cr)",
        note: "MUS 106 recommended for composition students.",
        courses: [{ placeholder: "Elective", cr: "3" }],
      },
    ],
  },

  music_education: {
    name: "B.M. — Music Education",
    credits: 122,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311" }, { code: "MUS 312" }, { code: "MUS 322" },
          { code: "MUS 416", alt: ["MUS 417"] }, { code: "MUS 450" },
        ],
      },
      {
        label: "Method Classes (min. 1 cr each)",
        courses: [
          { code: "MUS 169" }, { code: "MUS 170" }, { code: "MUS 173" },
          { code: "MUS 175" }, { code: "MUS 177" }, { code: "MUS 179" },
        ],
      },
      {
        label: "Music Education Sequence",
        courses: [
          { code: "MUS 338" }, { code: "MUS 340" }, { code: "MUS 376" },
          { code: "MUS 441" }, { code: "MUS 476" },
        ],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (7 semesters)", courses: [{ code: "MUS 300", repeat: 7 }] },
      {
        label: "Applied Music Lessons (7 semesters)",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 3 }],
      },
      {
        label: "Major Ensemble (7 semesters, 6 cr)",
        note: "From MUS 291, 292, 293, 394, 395, 396, 397.",
        courses: [{ choose: 7, from: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397"] }],
      },
      {
        label: "Professional Education",
        note: "3 cr electives from EDC 102, 103G, 312, 402, PSY 113, 232, HDF 200, 201, MUS 136, 256, 311, 312. Plus EDC 250, 484, 485 (non-MUS).",
        courses: [{ placeholder: "Professional Ed elective", cr: "3" }],
      },
    ],
  },

  jazz_performance: {
    name: "B.M. — Jazz Performance",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 124" }, { code: "MUS 125" }, { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 229" },
          { code: "MUS 235" }, { code: "MUS 239" }, { code: "MUS 252" }, { code: "MUS 253" }, { code: "MUS 273" },
          { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 324" }, { code: "MUS 329" }, { code: "MUS 350" },
          { code: "MUS 367" }, { code: "MUS 418" }, { code: "MUS 419" }, { code: "MUS 423" }, { code: "MUS 442" }, { code: "MUS 450" },
        ],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (8 semesters)", courses: [{ code: "MUS 300", repeat: 8 }] },
      {
        label: "Applied Music Lessons",
        note: "Sax, trumpet, trombone, piano, guitar, string bass, drums.",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }],
      },
      {
        label: "Jazz Studio Ensemble",
        courses: [{ code: "MUS 396", repeat: 2 }, { code: "MUS 398J", repeat: 4 }],
      },
      {
        label: "Major Ensemble (2 semesters)",
        note: "From MUS 291, 292, 293, 394, 395, 396, 397.",
        courses: [{ choose: 2, from: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397"] }],
      },
      {
        label: "Upper-Division History or Theory",
        courses: [{ placeholder: "Upper-division MUS History or Theory", cr: "3" }],
      },
      {
        label: "Electives (6 cr, ≥3 upper-division MUS)",
        courses: [{ placeholder: "MUS Elective", cr: "3" }, { placeholder: "Elective", cr: "3" }],
      },
    ],
  },

  orchestral_performance: {
    name: "B.M. — Orchestral Performance",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 322" }, { code: "MUS 350" },
          { code: "MUS 367" }, { code: "MUS 416" }, { code: "MUS 442" }, { code: "MUS 450" },
          { code: "MUS 256" }, { code: "MUS 417" }, { code: "MUS 411", repeat: 4 },
        ],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (8 semesters)", courses: [{ code: "MUS 300", repeat: 8 }] },
      {
        label: "Applied Music Lessons (principal area, classical)",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }],
      },
      {
        label: "Major Ensemble (8 semesters)",
        note: "From MUS 292, 394, 397.",
        courses: [{ choose: 8, from: ["MUS 292", "MUS 394", "MUS 397"] }],
      },
      {
        label: "Secondary / Chamber Ensembles (6 semesters)",
        courses: [{ code: "MUS 398M", repeat: 6 }],
      },
      {
        label: "Upper-Division MUS",
        note: "2 upper-division MUS History & 1 upper-division MUS course.",
        courses: [
          { placeholder: "Upper-division MUS History", cr: "3" },
          { placeholder: "Upper-division MUS History", cr: "3" },
          { placeholder: "Upper-division MUS course", cr: "3" },
        ],
      },
      {
        label: "Electives (5 cr, ≥3 upper-division MUS)",
        courses: [{ placeholder: "MUS Elective", cr: "3" }, { placeholder: "Elective", cr: "2" }],
      },
    ],
  },

  piano_performance: {
    name: "B.M. — Piano Performance",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 322" }, { code: "MUS 350" },
          { code: "MUS 367" }, { code: "MUS 416" }, { code: "MUS 420" }, { code: "MUS 442" },
          { code: "MUS 446" }, { code: "MUS 447" }, { code: "MUS 450" }, { code: "MUS 256" },
          { code: "MUS 411", repeat: 4 },
        ],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (8 semesters)", courses: [{ code: "MUS 300", repeat: 8 }] },
      {
        label: "Applied Music Lessons",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }],
      },
      {
        label: "Major Ensemble (4 semesters)",
        note: "From MUS 292, 293, 394, 395, 397.",
        courses: [{ choose: 4, from: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"] }],
      },
      {
        label: "Piano Accompaniment / Chamber (6 semesters)",
        note: "MUS 371 or MUS 398.",
        courses: [{ code: "MUS 371", repeat: 3 }, { code: "MUS 398K", repeat: 3 }],
      },
      {
        label: "Upper-Division Music History",
        courses: [{ placeholder: "Upper-division MUS History", cr: "3" }],
      },
      {
        label: "Electives (9 cr, ≥3 upper-division MUS)",
        courses: [{ placeholder: "MUS Elective", cr: "3" }, { placeholder: "Elective", cr: "3" }, { placeholder: "Elective", cr: "3" }],
      },
    ],
  },

  music_therapy: {
    name: "B.M. — Music Therapy (5-year)",
    credits: 135,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 170" }, { code: "MUS 180" }, { code: "MUS 173" }, { code: "MUS 183" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 239" }, { code: "MUS 334" }, { code: "MUS 438" }, { code: "MUS 450" },
        ],
      },
      {
        label: "Music Therapy Sequence",
        courses: [
          { code: "MUS 136" }, { code: "MUS 137" }, { code: "MUS 236" }, { code: "MUS 237" },
          { code: "MUS 336" }, { code: "MUS 337" }, { code: "MUS 232" }, { code: "MUS 233" },
          { code: "MUS 331" }, { code: "MUS 332" }, { code: "MUS 335" }, { code: "MUS 435" },
          { code: "MUS 436" }, { code: "MUS 437" }, { code: "MUS 439" }, { code: "MUS 486" }, { code: "MUS 491" }, { code: "MUS 493" },
        ],
      },
      {
        label: "Therapeutic Relationships Seminars",
        courses: [
          { code: "MUS 243" }, { code: "MUS 244" }, { code: "MUS 343" }, { code: "MUS 344" }, { code: "MUS 443" }, { code: "MUS 444" },
        ],
      },
      {
        label: "Clinical Foundations (non-MUS)",
        note: "PSY 113, PSY 254, KIN 122 — add these outside this planner.",
        courses: [],
      },
      {
        label: "Musicology Electives (choose 2)",
        note: "From MUS 105, 106, 222, 301, 322.",
        courses: [{ choose: 2, from: ["MUS 105", "MUS 106", "MUS 222", "MUS 301", "MUS 322"] }],
      },
      {
        label: "Piano Proficiency",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (7 semesters)", courses: [{ code: "MUS 300", repeat: 7 }] },
      {
        label: "Applied Music Lessons (7 semesters)",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 3 }],
      },
      {
        label: "Voice Ensemble (2 semesters)",
        note: "From MUS 293 or 395.",
        courses: [{ choose: 2, from: ["MUS 293", "MUS 395"] }],
      },
      {
        label: "Major Ensemble (8 semesters, 6 cr)",
        courses: [{ code: "MUS 292", repeat: 8 }],
      },
    ],
  },

  voice_performance: {
    name: "B.M. — Voice Performance",
    credits: 120,
    groups: [
      {
        label: "Shared Core & Theory",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 173" }, { code: "MUS 183" }, { code: "MUS 184" }, { code: "MUS 283" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 235" }, { code: "MUS 239" },
          { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 322" }, { code: "MUS 350" },
          { code: "MUS 367" }, { code: "MUS 416" }, { code: "MUS 442" }, { code: "MUS 445" }, { code: "MUS 450" },
        ],
      },
      {
        label: "Piano Proficiency",
        note: "C or better in each. MUS 272-level placement: pass all by fall of junior year.",
        courses: [{ code: "MUS 171" }, { code: "MUS 172" }, { code: "MUS 271" }, { code: "MUS 272" }],
      },
      { label: "Music Convocation (8 semesters)", courses: [{ code: "MUS 300", repeat: 8 }] },
      {
        label: "Secondary lessons (CCM style)",
        courses: [{ code: "MUS 110", repeat: 2 }],
      },
      {
        label: "Applied Music Lessons",
        courses: [{ code: "MUS 210", repeat: 4 }, { code: "MUS 410", repeat: 4 }, { code: "MUS 411", repeat: 4 }],
      },
      {
        label: "Major Ensemble (8 semesters, 7 cr)",
        note: "From MUS 293 or 395.",
        courses: [{ choose: 8, from: ["MUS 293", "MUS 395"] }],
      },
      {
        label: "Chamber / Other Ensemble (5 semesters)",
        courses: [{ code: "MUS 485", repeat: 5 }],
      },
      {
        label: "Upper-Division Music History",
        courses: [{ placeholder: "Upper-division MUS History", cr: "3" }],
      },
      {
        label: "Other Requirements",
        note: "THE 111 and 9 cr Foreign Language (ITL/GER/FRN 101) — add outside this planner.",
        courses: [],
      },
    ],
  },

  ba_history_lit: {
    name: "B.A. — Music History & Literature",
    credits: 120,
    groups: [
      {
        label: "Major Requirements",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 322" }, { code: "MUS 367" },
        ],
      },
      {
        label: "3 Upper-Division Music History Courses",
        courses: [
          { placeholder: "Upper-division MUS History", cr: "3" },
          { placeholder: "Upper-division MUS History", cr: "3" },
          { placeholder: "Upper-division MUS History", cr: "3" },
        ],
      },
      {
        label: "Applied Music (6 cr)",
        courses: [{ code: "MUS 210", repeat: 4 }],
      },
      {
        label: "Major Ensembles (3 semesters)",
        note: "From MUS 291, 292, 293, 394, 395, 396, 397, 398G.",
        courses: [{ choose: 3, from: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"] }],
      },
      { label: "Music Convocation (7 semesters)", courses: [{ code: "MUS 300", repeat: 7 }] },
      {
        label: "Other Requirements",
        note: "9 cr foreign language through 103-level; 30 cr non-Music; 42 cr at 300-level or higher.",
        courses: [],
      },
    ],
  },

  ba_jazz_studies: {
    name: "B.A. — Jazz Studies Option",
    credits: 120,
    groups: [
      {
        label: "Major Requirements",
        courses: [
          { code: "MUS 106" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 220" }, { code: "MUS 222", alt: ["MUS 322"] }, { code: "MUS 367" }, { code: "MUS 424" }, { code: "MUS 350" },
        ],
      },
      {
        label: "Music Performance (5 cr)",
        note: "At least 2 semesters of MUS 396.",
        courses: [
          { code: "MUS 391", repeat: 2 },
          { choose: 3, from: ["MUS 396", "MUS 398J"] },
        ],
      },
      {
        label: "Applied Music (12 cr)",
        note: "MUS 210D or 210W.",
        courses: [{ code: "MUS 210", repeat: 6 }],
      },
      {
        label: "Major Ensembles (2 semesters)",
        note: "From MUS 291, 292, 293, 394, 395, 397 (sax/tpt/tbn) or MUS 396/398J (piano/bass/guitar/drums).",
        courses: [{ choose: 2, from: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398J"] }],
      },
      { label: "Music Convocation (7 semesters)", courses: [{ code: "MUS 300", repeat: 7 }] },
      {
        label: "Other Requirements",
        note: "30 cr non-Music; 42 cr at 300-level or higher. MUS 171/172 if deficient in keyboard.",
        courses: [],
      },
    ],
  },

  ba_music_option: {
    name: "B.A. — Music Option",
    credits: 120,
    groups: [
      {
        label: "Major Requirements",
        courses: [
          { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 117" }, { code: "MUS 118" },
          { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 217" }, { code: "MUS 218" },
          { code: "MUS 220" }, { code: "MUS 222" }, { code: "MUS 322" }, { code: "MUS 367" },
        ],
      },
      {
        label: "Applied Music (8 cr)",
        courses: [{ code: "MUS 210", repeat: 4 }],
      },
      {
        label: "Major Ensembles (3 semesters)",
        note: "From MUS 291, 292, 293, 394, 395, 396, 397, 398G.",
        courses: [{ choose: 3, from: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"] }],
      },
      { label: "Music Convocation (7 semesters)", courses: [{ code: "MUS 300", repeat: 7 }] },
      {
        label: "Other Requirements",
        note: "30 cr non-Music; 30 cr at 300-level or higher. MUS 171 if deficient in keyboard.",
        courses: [],
      },
    ],
  },
};

/*
 * Approved Upper-Division requirement lists.
 * Approved by the URI Music Faculty on April 18, 2025. These drive the dropdown
 * shown when a student fills an "Upper-Division MUS History" or
 * "Upper-Division MUS Theory" slot.
 */
const UPPER_DIVISION = {
  history: ["MUS 301", "MUS 407", "MUS 408", "MUS 422", "MUS 423", "MUS 426", "MUS 427"],
  theory: ["MUS 318G", "MUS 324", "MUS 424", "MUS 416", "MUS 417", "MUS 420", "MUS 516", "MUS 517"],
};

/*
 * Major ensembles — the department-wide set of courses that count as a major
 * ensemble. This is the FALLBACK; at runtime the live rotation sheet's
 * "MAJOR ENSEMBLE" column overrides it (so faculty control it from the sheet).
 * Seeded from the faculty-approved list (per the April 2025 meeting notes):
 * Symphony, Pep Band, Concert Band, Marching Band, University Chorus,
 * Concert Choir, Wind Ensemble, Jazz Studio Lab, Jazz Studio Ensemble.
 */
const MAJOR_ENSEMBLES = [
  "MUS 397", "MUS 290", "MUS 292", "MUS 291", "MUS 293",
  "MUS 395", "MUS 394", "MUS 391", "MUS 396",
];

/*
 * Resolution paths for the Transfer / Curriculum-Modification bank.
 * Music is in the College of Arts & Sciences, so these point to the A&S forms.
 * If a link moves, update it here (one place).
 */
const RESOLUTIONS = {
  transfer: {
    label: "Transfer credit (needs re-evaluation)",
    short: "Transfer credit",
    instructions:
      "This course was taken elsewhere. If it didn't transfer in as the URI course you need, " +
      "request a transfer-credit re-evaluation: send an official transcript to URI, then submit " +
      "the Arts & Sciences re-evaluation form with the course description/syllabus to the Music " +
      "Department chair for review.",
    links: [
      { text: "A&S Transfer Credit Re-evaluation form (PDF)", url: "https://web.uri.edu/artsci/wp-content/uploads/sites/1132/AS_Transfer_Credit_Reevaluation.pdf" },
      { text: "How transfer credit works at URI", url: "https://web.uri.edu/transfer/transfer-credit/" },
    ],
  },
  modification: {
    label: "Waiver / substitution (curriculum modification)",
    short: "Curriculum modification",
    instructions:
      "To waive a requirement or substitute a different course for it, you must file a Curriculum " +
      "Modification form. Get it approved by your faculty advisor and the Music Department, then " +
      "submit it to Arts & Sciences. Note: an approved waiver does not reduce the total credits " +
      "required for your degree.",
    links: [
      { text: "A&S Curriculum Modification form (PDF)", url: "https://web.uri.edu/wp-content/uploads/sites/1132/Curriculum-Mod-Form-1.pdf" },
    ],
  },
};

/*
 * LINKS — graduation, forms repository, and fallback pages.
 * -----------------------------------------------------------------------
 * EVERYTHING an advisor might need to update lives here, in one place.
 *
 * Because a static site can't verify a URL is alive at click time, each
 * important link carries a `search` fallback: a Google query scoped to
 * uri.edu that always surfaces the current official page even if the direct
 * URL moves. The UI shows a small "can't find it? search" link next to each.
 *
 * To update a link: change its `url`. To make a link "search-only" (so it
 * never goes stale), set url to "" and it will use the search fallback.
 */
const LINKS = {
  // Graduation: apply-to-graduate instructions + the actual application.
  graduation: {
    label: "Apply for Graduation",
    url: "https://web.uri.edu/enrollment/graduation/",
    search: "https://www.google.com/search?q=" + encodeURIComponent("URI apply to graduate application site:uri.edu"),
    note: "Opens URI's official graduation / apply-to-graduate page.",
  },

  // Fallback destinations if any specific form link is dead.
  musicFormsPage: {
    label: "URI Music forms & resources",
    url: "https://web.uri.edu/music/",
    search: "https://www.google.com/search?q=" + encodeURIComponent("URI Music department forms site:uri.edu"),
  },
  universityFormsPage: {
    label: "URI University forms (A&S / Enrollment Services)",
    url: "https://web.uri.edu/artsci/current-students/",
    search: "https://www.google.com/search?q=" + encodeURIComponent("URI Arts and Sciences student forms site:uri.edu"),
  },

  // The forms repository shown at the bottom of the page. Each entry links to
  // the form's current URL; if that ever breaks, the fallback pages above
  // catch the student. Add/edit/remove freely — one line each.
  forms: [
    { name: "Apply for Graduation", url: "https://web.uri.edu/enrollment/graduation/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI apply to graduate site:uri.edu") },
    { name: "Curriculum Modification (waiver / substitution)", url: "https://web.uri.edu/wp-content/uploads/sites/1132/Curriculum-Mod-Form-1.pdf",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI Arts Sciences curriculum modification form site:uri.edu") },
    { name: "Transfer Credit Re-evaluation", url: "https://web.uri.edu/artsci/wp-content/uploads/sites/1132/AS_Transfer_Credit_Reevaluation.pdf",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI transfer credit re-evaluation form site:uri.edu") },
    { name: "Change of Major / Add a Major or Minor", url: "https://web.uri.edu/enrollment/change-of-major/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI change of major form site:uri.edu") },
    { name: "Declare a Minor", url: "https://web.uri.edu/music/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI declare minor form site:uri.edu") },
    { name: "Overload / Excess Credits petition", url: "https://web.uri.edu/artsci/current-students/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI Arts Sciences credit overload form site:uri.edu") },
    { name: "Independent Study", url: "https://web.uri.edu/artsci/current-students/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI independent study form site:uri.edu") },
    { name: "Leave of Absence / Withdrawal", url: "https://web.uri.edu/enrollment/",
      search: "https://www.google.com/search?q=" + encodeURIComponent("URI leave of absence withdrawal form site:uri.edu") },
  ],
};

/*
 * USAGE LOG / EMAIL CODE — PLACEHOLDER FOR A FUTURE FEATURE (not used yet).
 * -----------------------------------------------------------------------
 * The tool currently opens straight to the planner with no email prompt.
 * When you're ready to add "enter your email to get your code" plus an
 * advisor usage log, create a Google Form (one short-answer "email" question,
 * optionally a "code" question), paste its details here, and wire it up.
 * A static site can't send email or write to a database on its own, so a
 * Google Form (free) is the simplest way to log emails into a Sheet an
 * advisor can read. Nothing in the app reads this object today.
 */
const USAGE_LOG = {
  googleFormUrl: "",   // the form's /formResponse POST URL
  emailField: "",      // entry.* id for the email question
  codeField: "",       // entry.* id for the save-code question (optional)
  enabled: false,      // flip on only after the above are filled in + code is wired
};

// Expose to the app
window.PLANNER_DATA = { TERMS, TERM_IDS, COURSES, DEGREES, UPPER_DIVISION, MAJOR_ENSEMBLES, RESOLUTIONS, LINKS, USAGE_LOG };
