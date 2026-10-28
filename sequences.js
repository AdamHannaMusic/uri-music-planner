/*
 * URI Music Course Sequence Planner — recommended 8-semester sequences
 *
 * Transcribed from the department's prior "Worksheet" course-map spreadsheets
 * (2023–2024 layouts). Each degree maps to EIGHT semesters (index 0 = first
 * fall, 1 = first spring, ... 7 = last spring), each a list of what that term
 * should contain. Music Therapy adds a 5th year (indices 8–9).
 *
 * Item shapes:
 *   { code: "MUS 116" }                 a specific course (credits come from COURSES)
 *   { code: "MUS 311", alt:["MUS 312"]} pick-one (first is the default)
 *   { choose:["MUS 292","MUS 293"], label:"Major Ensemble", cr:"1" }  pick from a set
 *   { label:"General Education", cr:"3", gened:true }   a non-MUS / gen-ed slot
 *   { label:"Upper-Division MUS History", cr:"3" }      a fill-in MUS slot
 *
 * The auto-fill lays semester 0 into the student's chosen start term, semester
 * 1 into the next term, and so on. Editing THIS file changes what gets
 * pre-filled downstream — see the README for the "live document" workflow.
 */

const SEQUENCES = {
  // ---------------------------------------------------------------- B.M. ----
  classical_guitar: [
    // FR FALL
    [
      { code: "MUS 210" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 119" },
      { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" }, { code: "MUS 398G" },
      { choose: ["MUS 292", "MUS 293"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    // FR SPRING
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 235" }, { code: "MUS 239" }, { code: "MUS 300" }, { code: "MUS 398G" },
      { label: "General Education", cr: "3", gened: true },
    ],
    // SO FALL
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 271" },
      { code: "MUS 300" }, { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 398G" },
      { choose: ["MUS 292", "MUS 293"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
      { label: "General Education", cr: "3", gened: true },
    ],
    // SO SPRING
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 272" }, { code: "MUS 312", alt: ["MUS 311"] }, { code: "MUS 170" },
      { code: "MUS 300" }, { code: "MUS 398G" }, { code: "MUS 256" },
    ],
    // JR FALL
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 322" }, { code: "MUS 416" },
      { code: "MUS 398G" }, { code: "MUS 398M" },
      { label: "General Education", cr: "4", gened: true },
    ],
    // JR SPRING
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 350" }, { code: "MUS 367" },
      { label: "Upper-Division MUS History", cr: "3" }, { code: "MUS 442" },
      { label: "General Education", cr: "3", gened: true }, { code: "MUS 398G" },
    ],
    // SR FALL
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 398M" },
      { code: "MUS 398G" }, { label: "Upper-Division MUS Theory", cr: "3" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "4" },
    ],
    // SR SPRING
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 450" },
      { code: "MUS 398G" }, { label: "General Education", cr: "6", gened: true },
      { label: "Elective", cr: "3" },
    ],
  ],

  composition: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 171" }, { code: "MUS 115" },
      { code: "MUS 116" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 235" }, { code: "MUS 239" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 271" },
      { code: "MUS 300" }, { code: "MUS 311", alt: ["MUS 312"] },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 272" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "4", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 322" },
      { code: "MUS 416" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 420" },
      { label: "Upper-Division MUS History", cr: "3" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true }, { code: "MUS 367" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 417" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 450" },
      { label: "Elective", cr: "2" }, { label: "General Education", cr: "6", gened: true },
    ],
  ],

  music_education: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" }, { code: "MUS 169" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 235" }, { code: "MUS 239" }, { code: "MUS 300" }, { code: "MUS 170" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 271" },
      { code: "MUS 300" }, { code: "MUS 311" }, { code: "MUS 173" }, { code: "MUS 175" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 272" }, { code: "MUS 300" }, { code: "MUS 312" }, { code: "MUS 177" }, { code: "MUS 179" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 322" }, { code: "MUS 338" },
      { code: "MUS 376" }, { code: "MUS 416", alt: ["MUS 417"] },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 340" }, { code: "MUS 441" },
      { label: "Professional Ed elective", cr: "3", gened: true },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 476" }, { code: "MUS 450" },
      { label: "General Education", cr: "6", gened: true },
    ],
    // Student teaching term (EDC 484/485 live outside this MUS planner)
    [
      { code: "MUS 300" }, { label: "EDC 484 Student Teaching (non-MUS)", cr: "12", gened: true },
    ],
  ],

  jazz_performance: [
    [
      { code: "MUS 210" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 119" },
      { code: "MUS 124" }, { code: "MUS 220" }, { code: "MUS 300" }, { code: "MUS 398J" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { code: "MUS 171" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 125" },
      { code: "MUS 273" }, { code: "MUS 239" }, { code: "MUS 300" }, { code: "MUS 398J" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { code: "MUS 172" }, { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 324" }, { code: "MUS 252" }, { code: "MUS 229" },
      { code: "MUS 300" }, { code: "MUS 311", alt: ["MUS 312"] }, { code: "MUS 398J" }, { code: "MUS 271" },
      { label: "General Education", cr: "4", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 235" }, { code: "MUS 253" }, { code: "MUS 222" },
      { label: "Elective", cr: "3" }, { code: "MUS 300" }, { code: "MUS 398J" }, { code: "MUS 272" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 418" }, { code: "MUS 442" },
      { code: "MUS 329" }, { code: "MUS 391" }, { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 350" }, { code: "MUS 419" },
      { code: "MUS 367" }, { label: "Upper-Division MUS History or Theory", cr: "3" },
      { code: "MUS 391" }, { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 396" },
      { label: "Elective", cr: "3" }, { label: "General Education", cr: "3", gened: true },
      { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 396" }, { code: "MUS 450" },
      { code: "MUS 423" }, { label: "General Education", cr: "9", gened: true },
    ],
  ],

  orchestral_performance: [
    [
      { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 171" },
      { code: "MUS 220" }, { code: "MUS 210" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 235" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 239" }, { code: "MUS 210" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "4", gened: true },
    ],
    [
      { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 271" }, { code: "MUS 210" },
      { code: "MUS 300" }, { code: "MUS 398M" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 272" }, { code: "MUS 222" },
      { code: "MUS 256" }, { code: "MUS 210" }, { code: "MUS 300" }, { code: "MUS 312" }, { code: "MUS 398M" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 322" }, { code: "MUS 416" }, { code: "MUS 410" }, { code: "MUS 411" },
      { code: "MUS 398M" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 350" }, { code: "MUS 442" }, { label: "Upper-Division MUS History", cr: "3" },
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 398M" }, { code: "MUS 367" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 417" }, { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 398M" },
      { code: "MUS 300" }, { label: "Upper-Division MUS History", cr: "3" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "Upper-Division MUS course", cr: "3" },
    ],
    [
      { label: "Upper-Division MUS History", cr: "3" }, { code: "MUS 410" }, { code: "MUS 411" },
      { code: "MUS 450" }, { code: "MUS 398M" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 394", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true }, { label: "Elective", cr: "2" },
    ],
  ],

  piano_performance: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 235" },
      { code: "MUS 239" }, { code: "MUS 300" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 300" },
      { code: "MUS 311" }, { code: "MUS 371" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "7", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 300" }, { code: "MUS 371" },
      { choose: ["MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 256" },
      { code: "MUS 322" }, { code: "MUS 371" }, { code: "MUS 416" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 350" },
      { code: "MUS 371" }, { code: "MUS 420" }, { code: "MUS 442" }, { code: "MUS 367" },
      { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 398K" },
      { code: "MUS 446" }, { label: "Upper-Division MUS History", cr: "3" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 398K" },
      { code: "MUS 447" }, { code: "MUS 450" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "3" },
    ],
  ],

  voice_performance: [
    [
      { code: "MUS 210" }, { code: "MUS 115" }, { code: "MUS 116" }, { code: "MUS 119" },
      { code: "MUS 171" }, { code: "MUS 184" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "ITL 101 Italian I", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 235" }, { code: "MUS 239" }, { code: "MUS 283" }, { code: "MUS 300" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "GER 101 German I", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 173" }, { code: "MUS 215" }, { code: "MUS 216" },
      { code: "MUS 271" }, { code: "MUS 300" }, { code: "MUS 311" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "FRN 101 French I", cr: "3", gened: true }, { label: "THE 111 Acting I", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 110" }, { code: "MUS 183" }, { code: "MUS 217" },
      { code: "MUS 218" }, { code: "MUS 222" }, { code: "MUS 272" }, { code: "MUS 300" },
      { code: "MUS 485" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "Music Elective", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 110" }, { code: "MUS 411" }, { code: "MUS 300" },
      { code: "MUS 322" }, { code: "MUS 416" }, { code: "MUS 485" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 350" },
      { code: "MUS 367" }, { code: "MUS 442" }, { code: "MUS 485" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 445" },
      { code: "MUS 485" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
      { label: "Upper-Division MUS History", cr: "3" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 411" }, { code: "MUS 300" }, { code: "MUS 450" },
      { code: "MUS 485" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "4", gened: true },
    ],
  ],

  // ----------------------------------------------------------------- B.A. ----
  ba_history_lit: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "Foreign Language", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "Foreign Language", cr: "3", gened: true }, { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "Foreign Language", cr: "3", gened: true }, { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 300" }, { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 300" }, { code: "MUS 322" },
      { label: "General Education", cr: "4", gened: true }, { label: "Elective", cr: "9" },
    ],
    [
      { code: "MUS 300" }, { label: "Upper-Division MUS History", cr: "3" }, { code: "MUS 367" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective", cr: "7" },
    ],
    [
      { code: "MUS 300" }, { label: "Upper-Division MUS History", cr: "3" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective (Music suggested)", cr: "3" },
      { label: "Elective", cr: "3" },
    ],
    [
      { label: "Upper-Division MUS History", cr: "3" }, { label: "Elective (Music suggested)", cr: "3" },
      { label: "Elective", cr: "8" },
    ],
  ],

  ba_jazz_studies: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397", "MUS 396", "MUS 398J"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 172" },
      { code: "MUS 300" }, { code: "MUS 106" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 397", "MUS 396", "MUS 398J"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 300" }, { code: "MUS 396" },
      { label: "General Education", cr: "9", gened: true }, { label: "Elective (non-MUS)", cr: "3" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 222", alt: ["MUS 322"] }, { code: "MUS 391" },
      { code: "MUS 300" }, { label: "General Education", cr: "6", gened: true }, { label: "Elective (non-MUS)", cr: "3" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 300" }, { code: "MUS 322", alt: ["MUS 222"] }, { code: "MUS 391" },
      { label: "Elective (upper-div MUS)", cr: "3" }, { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 300" }, { code: "MUS 350" }, { code: "MUS 398J" },
      { code: "MUS 424" }, { label: "General Education", cr: "4", gened: true }, { label: "Elective (non-MUS)", cr: "6" },
    ],
    [
      { code: "MUS 300" }, { code: "MUS 396" },
      { label: "Elective (upper-div MUS)", cr: "3" }, { label: "General Education", cr: "3", gened: true },
      { label: "Elective (non-MUS)", cr: "6" },
    ],
    [
      { code: "MUS 398J" }, { code: "MUS 367" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective (non-MUS)", cr: "9" },
    ],
  ],

  ba_music_option: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 215" }, { code: "MUS 216" }, { code: "MUS 300" },
      { choose: ["MUS 291", "MUS 292", "MUS 293", "MUS 394", "MUS 395", "MUS 396", "MUS 397", "MUS 398G"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "7", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 217" }, { code: "MUS 218" }, { code: "MUS 222" },
      { code: "MUS 300" }, { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 300" }, { code: "MUS 322" },
      { label: "General Education", cr: "3", gened: true }, { label: "Elective (Music suggested)", cr: "3" },
      { label: "Elective", cr: "3" },
    ],
    [
      { code: "MUS 300" }, { code: "MUS 367" }, { label: "General Education", cr: "3", gened: true },
      { label: "Elective (Music suggested)", cr: "3" }, { label: "Elective", cr: "6" },
    ],
    [
      { code: "MUS 300" }, { label: "General Education", cr: "3", gened: true },
      { label: "Elective (Music suggested)", cr: "3" }, { label: "Elective", cr: "12" },
    ],
    [
      { label: "Elective (Music suggested)", cr: "6" }, { label: "Elective", cr: "9" },
    ],
  ],

  // Music Therapy is a 5-year program: 8 undergrad terms + a 5th-year internship.
  music_therapy: [
    [
      { code: "MUS 210" }, { code: "MUS 119" }, { code: "MUS 115" }, { code: "MUS 116" },
      { code: "MUS 170" }, { code: "MUS 171" }, { code: "MUS 220" }, { code: "MUS 300" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "PSY 113 General Psychology", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 117" }, { code: "MUS 118" }, { code: "MUS 136" },
      { code: "MUS 137" }, { code: "MUS 172" }, { code: "MUS 180" }, { code: "MUS 239" }, { code: "MUS 300" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 173" }, { code: "MUS 215" }, { code: "MUS 216" },
      { code: "MUS 236" }, { code: "MUS 243" }, { code: "MUS 271" }, { code: "MUS 300" },
      { choose: ["MUS 105", "MUS 106", "MUS 222", "MUS 301", "MUS 322"], label: "Musicology Elective", cr: "3" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 210" }, { code: "MUS 183" }, { code: "MUS 217" }, { code: "MUS 218" },
      { code: "MUS 232" }, { code: "MUS 233" }, { code: "MUS 237" }, { code: "MUS 244" }, { code: "MUS 272" }, { code: "MUS 300" },
      { label: "PSY 254 Behavior Problems", cr: "3", gened: true },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 332" }, { code: "MUS 334" },
      { code: "MUS 336" }, { code: "MUS 343" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 331" }, { code: "MUS 335" },
      { code: "MUS 337" }, { code: "MUS 344" },
      { choose: ["MUS 105", "MUS 106", "MUS 222", "MUS 301", "MUS 322"], label: "Musicology Elective", cr: "3" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "3", gened: true },
    ],
    [
      { code: "MUS 410" }, { code: "MUS 300" }, { code: "MUS 435" }, { code: "MUS 436" },
      { code: "MUS 439" }, { code: "MUS 443" }, { code: "MUS 450" },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "7", gened: true },
    ],
    [
      { code: "MUS 437" }, { code: "MUS 438" }, { code: "MUS 444" }, { code: "MUS 486" },
      { label: "KIN 122 Human Anatomy & Physiology", cr: "4", gened: true },
      { choose: ["MUS 293", "MUS 395"], label: "Major Ensemble", cr: "1" },
      { label: "General Education", cr: "6", gened: true },
    ],
    // FIFTH YEAR — national clinical internship
    [
      { code: "MUS 491" }, { code: "MUS 493" },
    ],
    [
      { code: "MUS 491" },
    ],
  ],
};

window.PLANNER_SEQUENCES = SEQUENCES;
