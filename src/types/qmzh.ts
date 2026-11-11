/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubjectType = 'math' | 'algebra' | 'geometry' | 'analysis';

export type LanguageType = 'kk' | 'ru';

export type LessonType = 
  | 'new'          // Жаңа тақырыпты меңгерту
  | 'reinforce'    // Бекіту
  | 'revision'     // Қайталау
  | 'practical'    // Практикалық сабақ
  | 'research'     // Зерттеу сабағы
  | 'bjb'          // БЖБ
  | 'tjb';         // ТЖБ

export type WorkForm = 
  | 'individual'   // Жеке жұмыс
  | 'pair'         // Жұптық жұмыс
  | 'group'        // Топтық жұмыс
  | 'guided';      // Мұғаліммен бірлескен жұмыс

export type TaskType = 
  | 'tiered'          // Деңгейлік тапсырма
  | 'logic'           // Логикалық есеп
  | 'word_problem'    // Мәтіндік есеп
  | 'real_world'      // Өмірмен байланысты есеп
  | 'pisa'            // PISA тапсырмасы
  | 'functional'      // Функционалдық сауаттылық
  | 'research'        // Зерттеу тапсырмасы
  | 'geometry_proof'  // Геометриялық дәлелдеу
  | 'graph'           // Графикпен жұмыс
  | 'ai_analysis';    // ЖИ көмегімен талдау

export type AssessmentMethod = 
  | 'self'             // Өзін-өзі бағалау
  | 'peer'             // Өзара бағалау
  | 'descriptor'       // Дескриптор бойынша бағалау
  | 'teacher_feedback';// Мұғалімнің кері байланысы

export type AdalAzamatValue = 
  | 'independence'     // Тәуелсіздік және отаншылдық
  | 'unity'            // Бірлік және ынтымақ
  | 'justice'          // Әділдік және жауапкершілік
  | 'law'              // Заң мен тәртіп
  | 'diligence'        // Еңбекқорлық және кәсіби біліктілік
  | 'creativity';      // Жасампаздық және жаңашылдық

export interface GeometryDiagramData {
  type: 'triangle' | 'right_triangle' | 'circle' | 'vectors' | 'parallel_lines' | 'coordinate_system' | 'parallelogram';
  title: string;
  description?: string;
  vertices?: { label: string; x: number; y: number }[];
  edges?: { from: string; to: string; label?: string; style?: 'solid' | 'dashed' }[];
  angles?: { vertex: string; label?: string; isRightAngle?: boolean }[];
  vectors?: { label: string; start: [number, number]; end: [number, number]; color?: string; expression?: string }[];
  annotations?: string[];
  customSvgXml?: string;
}

export interface MathProblem {
  id: string;
  statement: string; // The problem condition
  given?: string;    // Берілгені (for geometry/applied)
  toFind?: string;   // Табу керек / Дәлелдеу керек
  theorems?: string[]; // Теоремалар мен формулалар
  stepByStepSolution: string[]; // Steps of solution
  answer: string;    // Final answer
  descriptorText: string;
  points: number;
  diagram?: GeometryDiagramData;
  aiPrompt?: string; // If AI-assisted analysis
}

export interface TieredTask {
  level: 'A' | 'B' | 'C';
  levelName: string; // e.g. "А деңгейі — Қолдауды қажет ететін оқушы"
  guidance: string;  // Тірек формулалар немесе бағыттау
  problems: MathProblem[];
  criteria: string;  // Бағалау критерийі
  descriptors: { text: string; score: number }[];
  totalPoints: number;
}

/**
 * Sub-activity inside the 25-minute middle lesson stage
 * Matches the exact Meruert Math Kazakhstan QMZh template
 */
export interface DetailedActivity {
  id: string;
  type: 
    | 'textbook_error' // Оқулықпен жұмыс: Қатені тап және түзет
    | 'individual'     // Жеке жұмыс (платформа)
    | 'pair'           // Жұппен жұмыс (жұмыс парағы)
    | 'group_game'     // Топтық жұмыс («Үш парта» жарыс ойыны)
    | 'tiered'         // Деңгейлік тапсырмалар (Жеңіл, Орташа, Қиын)
    | 'inclusive'      // ЕБҚБ оқушысына (Ерекше білім беру қажеттілігі бар / ООП)
    | 'functional'     // Функционалдық сауаттылық (Өмірлік есеп)
    | 'custom';
  title: string;       // e.g. "Оқулықпен жұмыс: Қатені тап және түзет"
  teacherAction: string; // Мұғалім әрекеті (есеп шарты, құндылық «Жауапкершілік»)
  studentAction: string; // Оқушы әрекеті (ашылып жазылған толық шешуі, жауабы, ереже)
  assessment: string;    // Дескриптор және бағалау
  resources: string;     // Ресурстар
  valueTag?: string;     // e.g. "Жауапкершілік", "Әділдік"
  visualType?: 'game' | 'juice' | 'pizza' | 'geometry' | 'none';
  customSvg?: string;
}

export interface LessonStage {
  stageId: 'org' | 'intro' | 'middle' | 'conclusion';
  stageName: string; // Ұйымдастыру кезеңі / Сабақтың басы / Сабақтың ортасы / Сабақтың соңы
  timeMinutes: number; // 5, 10, 25, 5
  teacherActions: string;
  studentActions: string;
  assessment: string;
  resources: string;
  adalAzamatRef?: string;
  subActivities?: DetailedActivity[];
}

export interface QMZhDocument {
  id: string;
  createdAt: string;
  approvedBy?: string; // "Бекітемін:"
  lessonNumberTitle?: string; // "Қысқа мерзімді сабақ жоспары №1"
  schoolName: string;
  teacherName: string;
  language: LanguageType;
  subject: SubjectType;
  grade: number;
  studentsCount: number;
  absentCount: number;
  date: string;
  sectionName: string;
  lessonTopic: string;
  learningObjectiveCode: string;
  learningObjectiveText: string;
  lessonGoal: string;
  lessonGoalsList?: string[]; // 1. ..., 2. ..., 3. ...
  durationMinutes: number;
  lessonType: LessonType;
  workForms: WorkForm[];
  taskTypes: TaskType[];
  assessmentMethods: AssessmentMethod[];
  adalAzamatValues: AdalAzamatValue[];
  taskCount: number;
  stages: LessonStage[];
  tieredTasks: TieredTask[];
  additionalProblems?: MathProblem[];
  answerKeyAppendix: string;
  aiIntegrationNotes?: string;
  textbookReference?: TextbookReference | string;
  mathVerification: {
    verified: boolean;
    problemCount: number;
    details: string;
  };
}

export interface TextbookReference {
  publisher: string;       // e.g. "Атамұра", "Мектеп", "Алматыкітап"
  authors: string;         // e.g. "Т.А. Алдамұратова, Қ.С. Байшоланова"
  textbookTitle: string;   // e.g. "Математика. 6-сынып"
  editionYear?: string;    // e.g. "2024"
  paragraph?: string;      // e.g. "§18. Рационал сандарды көбейту"
  pageNumbers?: string;    // e.g. "72–75 б."
  exercises?: string;      // e.g. "№557 (А деңгейі), №558 (В деңгейі), №562 (С деңгейі)"
  selectedExerciseText?: string;
}

export interface TextbookCatalogItem {
  id: string;
  publisher: string;
  publisherLogo?: string;
  subject: SubjectType;
  grade: number;
  authorsKk: string;
  authorsRu: string;
  titleKk: string;
  titleRu: string;
  editionYear: string;
  recommendedTopics?: {
    topicCode?: string;
    topicNameKk: string;
    topicNameRu: string;
    paragraph: string;
    pages: string;
    exercises: string;
    sampleProblemKk?: string;
    sampleProblemRu?: string;
    sampleAnswerKk?: string;
    sampleAnswerRu?: string;
  }[];
}

export interface CombinedQMZhDocument {
  id: string;
  createdAt: string;
  schoolName: string;
  teacherName: string;
  language: LanguageType;
  date: string;
  durationMinutes: number;
  adalAzamatValues: AdalAzamatValue[];
  class1: {
    grade: number;
    studentsCount: number;
    subject: SubjectType;
    topic: string;
    objectiveCode: string;
    objectiveText: string;
    lessonGoal: string;
    tasks: TieredTask[];
  };
  class2: {
    grade: number;
    studentsCount: number;
    subject: SubjectType;
    topic: string;
    objectiveCode: string;
    objectiveText: string;
    lessonGoal: string;
    tasks: TieredTask[];
  };
  stages: {
    stageName: string;
    timeMinutes: number;
    coordinationPrinciple: string;
    teacherActionCombined: string;
    class1StudentAction: string;
    class1Assessment: string;
    class2StudentAction: string;
    class2Assessment: string;
    resources: string;
  }[];
  answerKeysCombined: string;
}
