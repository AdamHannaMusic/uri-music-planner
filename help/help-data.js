/*
 * URI Music Advising — Help assistant knowledge base (DATA)
 * =========================================================
 * Generated from the project's student-safe knowledge base
 * (URI_Music_Kiro_Student_Safe_Knowledge_Base.md, compiled Oct 28 2026).
 * Each entry: a vetted answer + official URI source link(s).
 * This is a planning aid, NOT official advising. The assistant always
 * shows the official link and defers decisions to a human advisor.
 *
 * To refresh: re-run the build script against an updated knowledge base.
 */

const HELP_FAQS = [
  {
    id: 1,
    q: "What is this chatbot allowed to do?",
    a: "It can explain publicly documented requirements, ask for a catalog year, outline course choices, and draft a plan for advisor review. It cannot grant a waiver, determine a jury result, certify graduation, issue permission numbers or replace an official degree audit.",
    links: [{text: "University Manual (policy hierarchy)", url: "https://web.uri.edu/manual/"}, {text: "Manual Chapter 8 - Academic Regulations", url: "https://web.uri.edu/manual/chapter-8/"}, {text: "Music degree program overview", url: "https://www.uri.edu/programs/program/music-b-a-b-m/"}, {text: "Music department forms", url: "https://web.uri.edu/music/forms/"}],
  },
  {
    id: 2,
    q: "What information should I provide first?",
    a: "Identify your intended degree and concentration, your controlling catalog/requirement term, the term you want to plan, current Music theory/musicianship and piano levels, and which requirements you have already completed. Do not supply private student IDs, grade reports or identifiable transcripts to a general-purpose chatbot.",
    links: [{text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}, {text: "Music degree program overview", url: "https://www.uri.edu/programs/program/music-b-a-b-m/"}, {text: "Music Department academics", url: "https://web.uri.edu/music/academics/"}],
  },
  {
    id: 3,
    q: "Which catalog applies to me?",
    a: "The student-specific requirement term controls; a 2026 website update does not automatically replace the requirements for a student who entered in an earlier term. Verify the requirement term in official student records and use its corresponding catalog.",
    links: [{text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}, {text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "General Education - advisor FAQ", url: "https://web.uri.edu/general-education/advisors/faqs/"}],
  },
  {
    id: 4,
    q: "Can I use a mixture of catalog years?",
    a: "Do not combine requirements from different catalogs without an authorized process. If a change of requirement term is contemplated, ask the dean/advisor to review all major, General Education and college requirements together.",
    links: [{text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}, {text: "General Education - advisor FAQ", url: "https://web.uri.edu/general-education/advisors/faqs/"}],
  },
  {
    id: 5,
    q: "What should I do if documents disagree?",
    a: "Check the University Manual first, then the student’s controlling catalog and official record, then current Registrar instructions and the department. Cite the disputed sections and refer the decision to the proper authorized office.",
    links: [{text: "University Manual (policy hierarchy)", url: "https://web.uri.edu/manual/"}, {text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}],
  },
  {
    id: 6,
    q: "Can the chatbot say I will graduate?",
    a: "No. A proposed schedule or checklist is not degree certification; the responsible college and Enrollment Services determine degree completion from official records.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 7,
    q: "What Music degrees are offered?",
    a: "URI describes BA Music paths in Music Studies, Jazz Studies, and Music History and Literature, and BM paths in Composition, Music Education, Performance, and Music Therapy. Detailed requirements vary by concentration and year.",
    links: [{text: "Music degree program overview", url: "https://www.uri.edu/programs/program/music-b-a-b-m/"}, {text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}],
  },
  {
    id: 8,
    q: "Do I need a Music audition?",
    a: "URI’s BA and BM program pages state that successful auditions are required for admission to those programs. Applied study and ensemble placement may also involve auditions or instructor approval.",
    links: [{text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}, {text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}],
  },
  {
    id: 9,
    q: "What is the main difference between BA and BM?",
    a: "The BA emphasizes liberal arts flexibility alongside musicianship, history and performance; the BM is a professionally focused degree with specialized requirements for its concentration. Compare the exact curriculum rather than assuming one is shorter.",
    links: [{text: "Music degree program overview", url: "https://www.uri.edu/programs/program/music-b-a-b-m/"}, {text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}],
  },
  {
    id: 10,
    q: "What is the BA Music Studies path?",
    a: "The department describes a music foundation within a flexible arts and sciences curriculum. Its public page lists at least 120 total credits and an upper-division-credit threshold; confirm how those apply to the student’s requirement term.",
    links: [{text: "BA - Music Studies", url: "https://web.uri.edu/music/academics/ba-music/music/"}, {text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}],
  },
  {
    id: 11,
    q: "What is the BA Jazz Studies path?",
    a: "The department’s published pathway includes jazz-specific theory, applied study, ensembles, jazz recital work and Music Convocation. Verify principal instrument eligibility and jazz placement with the faculty.",
    links: [{text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}],
  },
  {
    id: 12,
    q: "What is BA Music History and Literature?",
    a: "This route emphasizes the study of music history and literature and includes upper-level history and language requirements. The department’s page provides course and semester details subject to the student’s catalog term.",
    links: [{text: "BA - Music History and Literature", url: "https://web.uri.edu/music/academics/ba-music/music-history-and-literature/"}],
  },
  {
    id: 13,
    q: "Which kinds of BM Performance are available?",
    a: "The department advertises classical and jazz performance emphases, including voice, keyboard, strings, winds, percussion and guitar. Specific applied-study, ensemble and recital sequences depend on the performance area.",
    links: [{text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}, {text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}],
  },
  {
    id: 14,
    q: "What do BM Composition students need to plan around?",
    a: "Composition students should prioritize theory, analysis, counterpoint/orchestration, composition study, ensemble or performance obligations, and the senior composition recital. Confirm any specialization and requirements with the assigned faculty.",
    links: [{text: "BM - Composition", url: "https://web.uri.edu/music/academics/bm/composition/"}],
  },
  {
    id: 15,
    q: "Does BM Music Education include teacher certification?",
    a: "The department links the BM Music Education sequence to teacher preparation, supervised teaching and testing. An academic plan does not itself confirm eligibility for admission, internship or certification; School of Education review is needed.",
    links: [{text: "BM - Music Education", url: "https://web.uri.edu/music/academics/bm/music-education/"}, {text: "School of Education Music Education", url: "https://web.uri.edu/education/academics/music-education/"}],
  },
  {
    id: 16,
    q: "How is BM Music Therapy different?",
    a: "URI presents it as a roughly five-year professional program with clinical foundations, practica, an internship and certification/licensure-related requirements. It is not safe to assume that standard four-year Music sequencing applies.",
    links: [{text: "BM - Music Therapy", url: "https://web.uri.edu/music/academics/bm/music-therapy/"}],
  },
  {
    id: 17,
    q: "Can I double major with Music?",
    a: "Some BA Music pathways are designed with flexibility for additional majors or minors, but both sets of requirements must be checked, along with applicable rules about degrees versus majors. A proposed double-major plan needs both advisers.",
    links: [{text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 18,
    q: "What if I want to change my Music concentration?",
    a: "Verify entry requirements, audition or placement obligations, the active requirement term and newly missing sequential courses with the department and college. A web page describing a different program is not permission to switch.",
    links: [{text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}, {text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}],
  },
  {
    id: 19,
    q: "What should I register for first?",
    a: "Give priority to sequential theory and musicianship, prerequisites, courses offered infrequently, applied study and ensemble obligations, piano and convocation, then upper-level requirements, General Education and electives. Verify the current e-Campus schedule.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}, {text: "Music Department academics", url: "https://web.uri.edu/music/academics/"}],
  },
  {
    id: 20,
    q: "How do I know which theory class follows mine?",
    a: "Use the Music curriculum for the student’s cohort and the course prerequisites in e-Campus. Course sequences often include MUS 115/116, 117/118, 215/216 and 217/218, but placement, exemptions and prior credit must be reviewed.",
    links: [{text: "BA Music overview", url: "https://web.uri.edu/music/academics/ba-music/"}, {text: "BM Music overview", url: "https://web.uri.edu/music/academics/bm/"}, {text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}],
  },
  {
    id: 21,
    q: "Can I skip a theory course after AP or transfer credit?",
    a: "Do not treat a prior course or exam as an automatic Music equivalency or permission to skip a prerequisite. Verify posted evaluation, program placement rules and instructor/advisor review.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}, {text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}, {text: "School of Education Music Education", url: "https://web.uri.edu/education/academics/music-education/"}],
  },
  {
    id: 22,
    q: "Do I have to take class piano?",
    a: "Many Music programs identify keyboard proficiency or a class-piano sequence. Requirements and exemptions are program-specific; consult the controlling curriculum and piano area before declaring proficiency satisfied.",
    links: [{text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}, {text: "BM - Music Education", url: "https://web.uri.edu/music/academics/bm/music-education/"}, {text: "BM - Music Therapy", url: "https://web.uri.edu/music/academics/bm/music-therapy/"}],
  },
  {
    id: 23,
    q: "How many ensembles do I need?",
    a: "The required ensemble type, eligible codes, credits and number of semesters vary widely by concentration and principal applied area. Music Education, Jazz Studies and Music Therapy have distinct published rules.",
    links: [{text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}, {text: "BM - Music Education", url: "https://web.uri.edu/music/academics/bm/music-education/"}, {text: "BM - Music Therapy", url: "https://web.uri.edu/music/academics/bm/music-therapy/"}],
  },
  {
    id: 24,
    q: "Can I choose any ensemble?",
    a: "Not necessarily. A qualifying major ensemble may have an audition, instrumentation restriction or assignment rule. A student should verify eligibility before counting it toward a concentration requirement.",
    links: [{text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}, {text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}, {text: "BM - Music Education", url: "https://web.uri.edu/music/academics/bm/music-education/"}],
  },
  {
    id: 25,
    q: "What is MUS 300 / Convocation?",
    a: "It is a recurring Music requirement appearing in multiple published programs. Count the applicable semesters or credits as defined for the student’s exact curriculum, not by generalizing from another track.",
    links: [{text: "BA - Jazz Studies", url: "https://web.uri.edu/music/academics/ba-music/jazz-studies/"}, {text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}, {text: "BM - Music Education", url: "https://web.uri.edu/music/academics/bm/music-education/"}, {text: "BM - Music Therapy", url: "https://web.uri.edu/music/academics/bm/music-therapy/"}],
  },
  {
    id: 26,
    q: "What are jury and recital requirements?",
    a: "Music performance evaluation, recitals and related approvals depend on area and curriculum. The Music Department publishes jury evaluation and recital/petition forms, but only the authorized faculty evaluate the result.",
    links: [{text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}, {text: "Music department forms", url: "https://web.uri.edu/music/forms/"}],
  },
  {
    id: 27,
    q: "Can I trust the Fall 2026 planning schedule in this file?",
    a: "Use the historical planning sheet only to suggest courses and detect possible overlaps. e-Campus is the source for current days, times, credits, seats, restrictions and cancellations; earlier planning data may be obsolete.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}],
  },
  {
    id: 28,
    q: "Can I trust the 2027-2031 Music rotation in this file?",
    a: "No future offering can be guaranteed from a draft rotation. The included rotation is explicitly marked for faculty review and is not a published promise of future courses. Use it only as a preliminary advising hypothesis.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}],
  },
  {
    id: 29,
    q: "How should the chatbot build a proposed semester?",
    a: "Ask for the program and requirement term, completed sequential courses, remaining requirements, known conflicts and intended credit load. Return a table of proposed courses, priorities, alternatives, needed permission and specific advisor-review items.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}, {text: "2026-27 live URI Catalog", url: "https://web.uri.edu/catalog/"}],
  },
  {
    id: 30,
    q: "How many credits does a bachelor’s degree require?",
    a: "The University Manual sets 120 as the minimum for four-year bachelor’s curricula; some Music concentrations require more than 120. Use the precise program and catalog-year total.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}, {text: "BM - Music Therapy", url: "https://web.uri.edu/music/academics/bm/music-therapy/"}],
  },
  {
    id: 31,
    q: "What GPA is needed to graduate?",
    a: "The University Manual requires at least a 2.00 cumulative average for undergraduate degrees, but individual programs or milestones may impose additional academic standards.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 32,
    q: "How many credits must I earn at URI?",
    a: "The University Manual includes a general one-quarter-of-degree-credit URI residency rule and a separate rule that at least half of the major’s required credits must be earned at URI, with limited exceptions.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 33,
    q: "Do I need to complete my senior year at URI?",
    a: "The Manual contains senior-year residence requirements and narrowly authorized exceptions. Ask the academic dean before planning senior-year work elsewhere.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 34,
    q: "How many General Education credits are required?",
    a: "The standard program contains at least 40 approved Gen Ed credits spanning 12 outcomes plus a Grand Challenge course; overlap of outcomes does not create duplicate earned credits. Older cohorts or exceptional programs should verify their own rules.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "General Education - students", url: "https://web.uri.edu/general-education/students/"}, {text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 35,
    q: "What are the General Education outcomes?",
    a: "They cover four knowledge areas (A1-A4), four competencies (B1-B4), three responsibilities (C1-C3), and integration/application (D1). The student FAQ gives the full definitions and course options.",
    links: [{text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 36,
    q: "What is a Grand Challenge course?",
    a: "A course with the designated G suffix addresses issues across disciplines. The Gen Ed program requires one qualifying Grand Challenge course; confirm the course’s designation when taken.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 37,
    q: "Can one course satisfy two Gen Ed outcomes?",
    a: "Yes when it is approved to assess both, but its credit hours count only once toward the 40-credit total.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 38,
    q: "Can a Music class count for both major and Gen Ed?",
    a: "An approved Gen Ed course may also fulfill a major requirement when appropriately designated. The same-course-code Gen Ed credit limit and the course’s designation in the semester taken still matter.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 39,
    q: "Why does an older course not show a newly added Gen Ed outcome?",
    a: "Gen Ed outcome designations generally attach to the term when a student took the course. A later change to the course does not necessarily apply retroactively; ask the college to review an apparent APR error.",
    links: [{text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}, {text: "General Education - advisor FAQ", url: "https://web.uri.edu/general-education/advisors/faqs/"}],
  },
  {
    id: 40,
    q: "Can I add a minor?",
    a: "The Manual establishes at least 18 credits, 12 at 200-level or above, at least 8 earned at URI, a 2.00 average, and limits on overlap with the major. College and minor program rules may add constraints.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 41,
    q: "Can my minor be taken pass/fail?",
    a: "The Manual generally excludes courses used for the minor from the pass/fail option. Verify exceptions only through official policy and an authorized office.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}],
  },
  {
    id: 42,
    q: "What does 300-level or upper division mean?",
    a: "The Manual identifies 300- and 400-level courses as upper division. Some BA Music pages specify an upper-division-credit minimum; confirm the student’s exact degree worksheet.",
    links: [{text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}, {text: "BA - Music Studies", url: "https://web.uri.edu/music/academics/ba-music/music/"}, {text: "BA - Music History and Literature", url: "https://web.uri.edu/music/academics/ba-music/music-history-and-literature/"}],
  },
  {
    id: 43,
    q: "How do I register?",
    a: "Use e-Campus, open Manage Classes, search for the class and section, and complete the enrollment submission. Your advisor can guide course selection but does not register on your behalf merely by suggesting a plan.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}],
  },
  {
    id: 44,
    q: "Where do I check a registration hold?",
    a: "Check the Tasks or Holds area in e-Campus and follow the instructions for the specific hold; Enrollment Services or the responsible office can advise on resolution.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}],
  },
  {
    id: 45,
    q: "How do I fix a prerequisite error?",
    a: "Check the exact error, whether the required course is posted, and whether linked courses must be added together. If appropriate, request instructor permission; only authorized personnel can override prerequisites.",
    links: [{text: "Common registration errors", url: "https://web.uri.edu/registration-records/common-registration-error-messages/"}, {text: "Registration faculty/permission numbers", url: "https://web.uri.edu/registration-records/faculty-staff-advisors/for-faculty-courses/"}],
  },
  {
    id: 46,
    q: "Who gives me a permission number?",
    a: "Instructor or other authorized department personnel may provide the number. Enrollment Services states that it cannot override students into courses or issue permission numbers.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}, {text: "Common registration errors", url: "https://web.uri.edu/registration-records/common-registration-error-messages/"}, {text: "Registration faculty/permission numbers", url: "https://web.uri.edu/registration-records/faculty-staff-advisors/for-faculty-courses/"}],
  },
  {
    id: 47,
    q: "What if a class is full?",
    a: "Check alternative sections or an available waitlist, then ask the instructor/department about authorized permission. Do not assume that an advisor or chatbot can create a seat.",
    links: [{text: "Common registration errors", url: "https://web.uri.edu/registration-records/common-registration-error-messages/"}],
  },
  {
    id: 48,
    q: "What if e-Campus says there is a time conflict?",
    a: "Change one of the sections or ask the relevant instructors/college about any policy-compliant resolution. A planned course overlap is not automatically allowed.",
    links: [{text: "Common registration errors", url: "https://web.uri.edu/registration-records/common-registration-error-messages/"}],
  },
  {
    id: 49,
    q: "Can I take over 19 credits?",
    a: "The University Manual normally requires written permission from the student’s academic dean to exceed 19 credits in a semester for an undergraduate. Students on academic probation face a lower limit.",
    links: [{text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}, {text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 50,
    q: "When was the Fall 2026 open add period?",
    a: "The official 2026-27 calendar lists September 9-15, 2026 for open add and September 16-22 for permission-number late add. These deadlines are now past as of this bundle’s assembly date.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}],
  },
  {
    id: 51,
    q: "What is the Fall 2026 drop deadline?",
    a: "The 2026-27 calendar lists October 21, 2026 as the last day to drop in e-Campus. Later drops require a late-drop process; starting October 1, eligible course drops carry a W.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}, {text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}],
  },
  {
    id: 52,
    q: "When are Fall 2026 finals?",
    a: "URI lists final exams for December 16-18 and December 21-22, 2026, after the December 14 last day of classes. Students must consult the official final-exam schedule for their sections.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}],
  },
  {
    id: 53,
    q: "When do Spring 2027 classes begin?",
    a: "The 2026-27 calendar lists January 26, 2027 as the first class day. Open add runs January 26-February 1, followed by a permission-number late-add period through February 8.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}],
  },
  {
    id: 54,
    q: "When is the Spring 2027 drop deadline?",
    a: "The official calendar lists March 9, 2027 as the last date to drop via e-Campus; after that, a late-drop process is required. Check the current calendar before advising on exceptions.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}],
  },
  {
    id: 55,
    q: "When does a W appear on my transcript?",
    a: "For Fall 2026, the calendar says drops on or after October 1 receive a W; for Spring 2027, on or after February 17. These are term-specific and different from the final e-Campus drop deadline.",
    links: [{text: "Academic Calendar 2026-27", url: "https://web.uri.edu/academic-calendars/"}],
  },
  {
    id: 56,
    q: "How do repeat courses work starting Fall 2026?",
    a: "For an allowed repeat of a course previously graded C- or below, URI says the lower of the two grades is automatically excluded from earned credits and GPA after a qualifying Fall 2026-or-later repeat. Specific third attempts and C-or-higher repeats have separate rules.",
    links: [{text: "Grading and honors / Fall 2026 repeats", url: "https://web.uri.edu/registration-records/grading-and-honors/"}, {text: "Academic status", url: "https://web.uri.edu/advising/academic-status/"}, {text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}],
  },
  {
    id: 57,
    q: "Can I repeat a class where I earned C or higher?",
    a: "Such repeats generally do not earn credit and can be treated as out-of-policy unless an authorized petition is approved. Confirm details with the dean before reenrolling.",
    links: [{text: "Grading and honors / Fall 2026 repeats", url: "https://web.uri.edu/registration-records/grading-and-honors/"}, {text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}],
  },
  {
    id: 58,
    q: "What happens when I am on academic probation?",
    a: "The University Manual defines probation at a cumulative GPA below 2.00 and limits students on probation to no more than 15 credits with advisor approval to change or register. Other consequences require individual dean review.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Academic status", url: "https://web.uri.edu/advising/academic-status/"}],
  },
  {
    id: 59,
    q: "Can I take a major requirement pass/fail?",
    a: "The University Manual ordinarily limits the pass/fail option to eligible free electives, with additional eligibility limits. Do not assume a Music major or minor course can be changed to pass/fail.",
    links: [{text: "Manual 8.3 - Courses / Enrollment", url: "https://web.uri.edu/manual/chapter-8/chapter-8-3/"}, {text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 60,
    q: "How do I check if outside coursework transfers to URI?",
    a: "Use URI’s Transfer Evaluation System and Transferology as preliminary references. A missing listing does not itself establish rejection; URI faculty and Admissions evaluate official coursework.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}, {text: "Transfer admission overview", url: "https://web.uri.edu/admission/transfer/transfer-resources/"}],
  },
  {
    id: 61,
    q: "Can I take a summer course elsewhere?",
    a: "Obtain academic advising and, where required, approval before enrolling; verify that the course will meet the intended URI requirement and then send the official transcript after completion.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}],
  },
  {
    id: 62,
    q: "Where do I see transferred credit?",
    a: "URI describes viewing processed transfer credit through e-Campus Self Service and the Transfer Credit Report. Check the official report rather than a screenshot of a prospective equivalency.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}],
  },
  {
    id: 63,
    q: "What if my transfer course is not appearing in the degree audit?",
    a: "Check whether URI has evaluated and posted it and whether it fulfills the exact requirement in the Academic Progress Report. Route unresolved equivalency versus requirement-application questions to the college/advisor.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}, {text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}],
  },
  {
    id: 64,
    q: "Does earning course credit elsewhere automatically waive a Music prerequisite?",
    a: "No. Transfer-credit posting, course equivalency, departmental placement, prerequisites and degree requirement substitutions may require different approvals.",
    links: [{text: "Transfer credit process", url: "https://web.uri.edu/transfer/transfer-credit/"}, {text: "School of Education Music Education", url: "https://web.uri.edu/education/academics/music-education/"}, {text: "Common registration errors", url: "https://web.uri.edu/registration-records/common-registration-error-messages/"}],
  },
  {
    id: 65,
    q: "What is the Academic Progress Report?",
    a: "It is the official degree-requirement reporting view to inspect with the academic transcript and the controlling catalog. A worksheet does not substitute for the report; discrepancies should be escalated for correction.",
    links: [{text: "General Education - student FAQ", url: "https://web.uri.edu/general-education/students/faqs/"}, {text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 66,
    q: "How do I request a waiver or substitution?",
    a: "Identify the exact requirement, justification and supporting official documentation. University-level exceptions require the published written petition route to the academic dean; department and college procedures govern routing.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Music department forms", url: "https://web.uri.edu/music/forms/"}],
  },
  {
    id: 67,
    q: "Can a faculty advisor approve any requested waiver?",
    a: "No. Faculty advice does not by itself create a recorded exception. The Manual restricts waivers to established petition and approval processes; confirm final posting in the official student record.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}],
  },
  {
    id: 68,
    q: "Where are the Music forms?",
    a: "The Department of Music forms page includes petitions, recital paperwork, jury materials, audition documents, independent-study and other student forms. Use the current forms hub, not a cached file without validation.",
    links: [{text: "Music department forms", url: "https://web.uri.edu/music/forms/"}],
  },
  {
    id: 69,
    q: "When should I begin a graduation audit?",
    a: "Begin well before the final semester, especially when there are substitutions, dual programs, transfer credits or recurring Music requirements. URI lists general check-in dates but directs students to their college for the controlling deadlines.",
    links: [{text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 70,
    q: "What is the difference between a double major and a dual degree?",
    a: "The Manual treats two majors within one bachelor’s degree differently from two separate bachelor’s degrees. If the graduation webpage seems inconsistent about diploma counts, defer to the Manual and Enrollment Services.",
    links: [{text: "Manual 8.2 - Academic Requirements", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/"}, {text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 71,
    q: "Do minors appear on diplomas?",
    a: "URI says minors are recorded on the transcript, not the diploma. Other diploma details may depend on degree and current Enrollment Services procedures.",
    links: [{text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 72,
    q: "Where do I seek help on music-specific graduation milestones?",
    a: "Ask the assigned program advisor and responsible faculty for recitals, competencies and ensemble/placement requirements; use the college dean and Enrollment Services for official graduation certification.",
    links: [{text: "BM - Performance", url: "https://web.uri.edu/music/academics/bm/performance/"}, {text: "Music department forms", url: "https://web.uri.edu/music/forms/"}, {text: "Graduation and degree progress", url: "https://web.uri.edu/registration-records/graduation/"}],
  },
  {
    id: 73,
    q: "Should the chatbot ask students to upload a transcript?",
    a: "A student-facing, shared bot should avoid collecting identifiable transcripts or student identifiers unless an approved secure workflow with FERPA controls exists. Ask for non-identifying course information when possible.",
    links: [{text: "Registration and Records", url: "https://web.uri.edu/registration-records/"}, {text: "Enrollment Services", url: "https://web.uri.edu/enrollment/"}],
  },
  {
    id: 74,
    q: "What can the bot say when it is unsure?",
    a: "State \"ADVISOR REVIEW REQUIRED\"; identify the unanswered factual question, the governing source and exactly which university decision-maker should verify it. Never manufacture an approval.",
    links: [{text: "University Manual (policy hierarchy)", url: "https://web.uri.edu/manual/"}, {text: "Registration and Records", url: "https://web.uri.edu/registration-records/"}],
  },
  {
    id: 75,
    q: "Should the bot quote the entire University Manual as its answer?",
    a: "Prefer short, student-friendly paraphrases with the exact source URL and clause. Link students to the university webpage for the current full rule; the static PDF may become outdated.",
    links: [{text: "University Manual (policy hierarchy)", url: "https://web.uri.edu/manual/"}, {text: "Manual Chapter 8 - Academic Regulations", url: "https://web.uri.edu/manual/chapter-8/"}],
  },
  {
    id: 76,
    q: "How should the bot handle a course not appearing in e-Campus?",
    a: "Do not claim it will be offered later based only on a projected rotation. State that future offerings are not confirmed and recommend contacting Music and checking the live schedule.",
    links: [{text: "e-Campus registration instructions", url: "https://web.uri.edu/registration-records/course-registration/"}, {text: "Music Department academics", url: "https://web.uri.edu/music/academics/"}],
  },
  {
    id: 77,
    q: "What resources should the bot refer to when a student needs help?",
    a: "Direct enrollment and records questions to Enrollment Services, curriculum and degree questions to the academic advisor/college, Music placement and milestones to the department, and appropriate student success needs to official URI service pages.",
    links: [{text: "Registration and Records", url: "https://web.uri.edu/registration-records/"}, {text: "Music Department academics", url: "https://web.uri.edu/music/academics/"}, {text: "Enrollment Services", url: "https://web.uri.edu/enrollment/"}],
  },
];

const HELP_SUGGESTED = [
  "What can this tool help me with?",
  "How do juries and recitals work?",
  "How many General Education credits do I need?",
  "How do I transfer a credit from another school?",
  "How do I request a waiver or substitution?",
  "How many ensembles do I need?",
  "What GPA do I need to graduate?",
  "How do I register for classes?",
  "When is the drop deadline?",
  "Where are the Music Department forms?"
];

const HELP_FALLBACK = {
  a: "I can't match that to a specific official answer. These official URI pages are the best starting points, and your Music advisor can always help:",
  links: [
    {text: "Music Department — academics", url: "https://web.uri.edu/music/academics/"},
    {text: "Academic Advising", url: "https://web.uri.edu/advising/"},
    {text: "URI Catalog", url: "https://web.uri.edu/catalog/"},
    {text: "University Manual (policy)", url: "https://web.uri.edu/manual/"},
  ],
};

window.PLANNER_HELP = { HELP_FAQS, HELP_SUGGESTED, HELP_FALLBACK };
