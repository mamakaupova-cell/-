/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Check, 
  School, 
  UserCheck,
  ChevronDown,
  Bookmark,
  BookCheck,
  Library
} from 'lucide-react';
import { 
  SubjectType, 
  LanguageType, 
  LessonType, 
  WorkForm, 
  TaskType, 
  AssessmentMethod, 
  AdalAzamatValue,
  QMZhDocument,
  TextbookCatalogItem,
  TextbookReference
} from '../types/qmzh';
import { CURRICULUM_OBJECTIVES, ADAL_AZAMAT_VALUES_INFO } from '../data/curriculumData';
import { 
  OFFICIAL_PUBLISHERS, 
  TEXTBOOKS_CATALOG, 
  getTextbooksForGradeAndSubject 
} from '../data/textbooksData';
import { calculateGroupDivision } from '../utils/groupDivision';

interface QMZhFormProps {
  language: LanguageType;
  initialSubject?: SubjectType;
  initialGrade?: number;
  initialTopic?: string;
  onGenerate: (formData: any) => Promise<void>;
  loading: boolean;
  onLanguageChange?: (lang: LanguageType) => void;
}

export const QMZhForm: React.FC<QMZhFormProps> = ({
  language,
  initialSubject = 'math',
  initialGrade = 6,
  initialTopic = '',
  onGenerate,
  loading,
  onLanguageChange,
}) => {
  const isKk = language === 'kk';

  // Form states
  const [schoolName, setSchoolName] = useState(
    localStorage.getItem('math_qmzh_default_school') || (isKk ? '№48 жалпы орта білім беретін мектеп' : 'Общеобразовательная средняя школа №48')
  );
  const [teacherName, setTeacherName] = useState(
    localStorage.getItem('math_qmzh_default_teacher') || 'Каюпова Орынгуль Жумагалиевна'
  );
  const [subject, setSubject] = useState<SubjectType>(initialSubject);
  const [grade, setGrade] = useState<number>(initialGrade);
  const [studentsCount, setStudentsCount] = useState<number>(24);
  const [absentCount, setAbsentCount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sectionName, setSectionName] = useState<string>(
    initialTopic ? 'Математика' : (isKk ? '6.2B Рационал сандарға амалдар қолдану' : '6.2B Действия над рациональными числами')
  );
  const [lessonTopic, setLessonTopic] = useState<string>(
    initialTopic || (isKk ? 'Рационал сандарды көбейту' : 'Умножение рациональных чисел')
  );
  const [learningObjectiveCode, setLearningObjectiveCode] = useState<string>('6.1.2.15');
  const [learningObjectiveText, setLearningObjectiveText] = useState<string>(
    isKk ? 'Рационал сандарды көбейту ережелерін қолданып есептер шығару' : 'Применять правила умножения рациональных чисел'
  );
  const [lessonGoalsList, setLessonGoalsList] = useState<string[]>([
    isKk ? '1. Оң және теріс сандарды көбейтудің таңбалар ережесін айтады.' : '1. Формулирует правило знаков при умножении чисел.',
    isKk ? '2. Көбейтіндінің таңбасын табады және қатесіз есептейді.' : '2. Безошибочно вычисляет произведение рациональных чисел.',
    isKk ? '3. Көбейту ережесін есептерді шығаруда қолданады.' : '3. Применяет правила умножения при решении задач.'
  ]);
  const [showCatalog, setShowCatalog] = useState(false);
  const groupDiv = calculateGroupDivision(studentsCount, language);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [lessonType, setLessonType] = useState<LessonType>('new');
  const [taskCount, setTaskCount] = useState<number>(6);

  // Multi-selects
  const [workForms, setWorkForms] = useState<WorkForm[]>(['individual', 'pair', 'group', 'guided']);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(['tiered', 'logic', 'functional', 'ai_analysis']);
  const [assessmentMethods, setAssessmentMethods] = useState<AssessmentMethod[]>(['descriptor', 'self', 'peer']);
  const [selectedValues, setSelectedValues] = useState<AdalAzamatValue[]>(['diligence', 'justice', 'unity']);

  // Official Textbook & Publisher states
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>('tb-atamura-6-math');
  const [textbookPublisher, setTextbookPublisher] = useState<string>('«Атамұра»');
  const [textbookTitle, setTextbookTitle] = useState<string>(
    isKk ? 'Математика. 6-сынып. 1, 2-бөлім' : 'Математика. 6 класс. Части 1, 2'
  );
  const [textbookAuthors, setTextbookAuthors] = useState<string>(
    'Т.А. Алдамұратова, Т.С. Байшоланов, Е.С. Байшоланов'
  );
  const [textbookEditionYear, setTextbookEditionYear] = useState<string>('2024 (жаңартылған басылым)');
  const [textbookParagraph, setTextbookParagraph] = useState<string>(
    isKk ? '§18. Рационал сандарды көбейту. Таңбалар ережесі' : '§18. Умножение рациональных чисел. Правило знаков'
  );
  const [textbookPages, setTextbookPages] = useState<string>('72–76 б.');
  const [textbookExercises, setTextbookExercises] = useState<string>(
    isKk ? '№557 (А деңгейі), №558 (В деңгейі), №562 (С деңгейі)' : '№557 (уровень А), №558 (уровень В), №562 (уровень С)'
  );
  const [selectedExerciseText, setSelectedExerciseText] = useState<string>(
    isKk ? '№557. Есепте: 1) (-3) · 7; 2) (-2.5) · (-4); 3) (-3/5) · (10/9).' : '№557. Вычислите: 1) (-3) · 7; 2) (-2.5) · (-4); 3) (-3/5) · (10/9).'
  );
  const [textbookNotification, setTextbookNotification] = useState<string | null>(null);

  // Sync textbook info when grade or subject changes
  const applyTextbookDefaults = (g: number, s: SubjectType) => {
    const list = getTextbooksForGradeAndSubject(g, s);
    if (list.length > 0) {
      const tb = list[0];
      setSelectedTextbookId(tb.id);
      setTextbookPublisher(tb.publisher);
      setTextbookTitle(isKk ? tb.titleKk : tb.titleRu);
      setTextbookAuthors(isKk ? tb.authorsKk : tb.authorsRu);
      setTextbookEditionYear(tb.editionYear);
      if (tb.recommendedTopics && tb.recommendedTopics.length > 0) {
        const top = tb.recommendedTopics[0];
        setTextbookParagraph(top.paragraph);
        setTextbookPages(top.pages);
        setTextbookExercises(top.exercises);
        setSelectedExerciseText(isKk ? top.sampleProblemKk || '' : top.sampleProblemRu || '');
      }
    }
  };

  // Handle grade change across 5-9 range
  const handleGradeSelect = (g: number) => {
    setGrade(g);
    let newSubject: SubjectType = subject;
    if (g <= 6) {
      newSubject = 'math';
      setSubject('math');
    } else {
      if (subject !== 'geometry') {
        newSubject = 'algebra';
        setSubject('algebra');
      }
    }
    applyTextbookDefaults(g, newSubject);
  };

  const handleSubjectChange = (newSubj: SubjectType) => {
    setSubject(newSubj);
    applyTextbookDefaults(grade, newSubj);
  };

  // When teacher clicks a textbook card
  const handleSelectTextbookCard = (tb: TextbookCatalogItem) => {
    setSelectedTextbookId(tb.id);
    setTextbookPublisher(tb.publisher);
    setTextbookTitle(isKk ? tb.titleKk : tb.titleRu);
    setTextbookAuthors(isKk ? tb.authorsKk : tb.authorsRu);
    setTextbookEditionYear(tb.editionYear);
    if (tb.recommendedTopics && tb.recommendedTopics.length > 0) {
      const top = tb.recommendedTopics[0];
      setTextbookParagraph(top.paragraph);
      setTextbookPages(top.pages);
      setTextbookExercises(top.exercises);
      setSelectedExerciseText(isKk ? top.sampleProblemKk || '' : top.sampleProblemRu || '');
    }
    setTextbookNotification(isKk ? `«${tb.publisher}» оқулығы таңдалды` : `Выбран учебник «${tb.publisher}»`);
    setTimeout(() => setTextbookNotification(null), 3000);
  };

  // When teacher clicks a specific topic inside a textbook
  const handleSelectTextbookTopic = (tb: TextbookCatalogItem, top: any) => {
    setSelectedTextbookId(tb.id);
    setTextbookPublisher(tb.publisher);
    setTextbookTitle(isKk ? tb.titleKk : tb.titleRu);
    setTextbookAuthors(isKk ? tb.authorsKk : tb.authorsRu);
    setTextbookEditionYear(tb.editionYear);
    setTextbookParagraph(top.paragraph);
    setTextbookPages(top.pages);
    setTextbookExercises(top.exercises);
    setSelectedExerciseText(isKk ? top.sampleProblemKk || '' : top.sampleProblemRu || '');

    // Synchronize to Lesson Topic & Objective fields
    const topicName = isKk ? top.topicNameKk : top.topicNameRu;
    setLessonTopic(topicName);
    if (top.topicCode) {
      setLearningObjectiveCode(top.topicCode);
      const curr = CURRICULUM_OBJECTIVES.find(o => o.code === top.topicCode);
      if (curr) {
        setLearningObjectiveText(isKk ? curr.textKk : curr.textRu);
        setSectionName(isKk ? curr.sectionKk : curr.sectionRu);
      }
    }
    if (isKk) {
      setLessonGoalsList([
        `1. ${topicName} тақырыбы бойынша ережелер мен алгоритмдерді тұжырымдайды.`,
        `2. Оқулықтағы ${top.exercises.split(',')[0] || 'тапсырмаларды'} қатесіз орындайды.`,
        `3. Тақырыпқа қатысты практикалық және өмірлік есептерді шешеді.`
      ]);
    } else {
      setLessonGoalsList([
        `1. Формулирует правила и алгоритмы по теме «${topicName}».`,
        `2. Безошибочно выполняет задания из учебника (${top.exercises.split(',')[0] || ''}).`,
        `3. Решает практические и жизненные задачи по данной теме.`
      ]);
    }

    setTextbookNotification(isKk ? `«${tb.publisher}» тапсырмалары ҚМЖ-ға енгізілді` : `Задания «${tb.publisher}» применены к КСП`);
    setTimeout(() => setTextbookNotification(null), 3500);
  };

  // Auto-generate 3 SMART goals based on teacher's entered topic
  const handleAutoGenerateGoals = () => {
    const t = lessonTopic.trim() || (isKk ? 'Математика' : 'Математика');
    if (isKk) {
      setLessonGoalsList([
        `1. «${t}» тақырыбы бойынша негізгі ұғымдар мен формулаларды тұжырымдайды.`,
        `2. Есептерді шығаруда сәйкес алгоритмді қатесіз қолданады.`,
        `3. Өз бетінше деңгейлік және өмірлік тапсырмаларды орындап, шешімін тексереді.`
      ]);
    } else {
      setLessonGoalsList([
        `1. Формулирует основные понятия, правила и формулы по теме «${t}».`,
        `2. Безошибочно применяет соответствующий алгоритм при вычислениях.`,
        `3. Самостоятельно выполняет разноуровневые и практические задания, обосновывает результат.`
      ]);
    }
  };

  // Quick preset loader from catalog
  const handleObjectiveSelect = (code: string) => {
    const obj = CURRICULUM_OBJECTIVES.find(o => o.code === code);
    if (obj) {
      setLearningObjectiveCode(obj.code);
      setLearningObjectiveText(isKk ? obj.textKk : obj.textRu);
      setLessonTopic(isKk ? obj.topicKk : obj.topicRu);
      setSectionName(isKk ? obj.sectionKk : obj.sectionRu);
      if (isKk) {
        setLessonGoalsList([
          `1. ${obj.topicKk} тақырыбы бойынша ережелер мен қасиеттерді түсіндіреді.`,
          `2. ${obj.code} мақсатына сәйкес алгоритмді есептерді шығаруда қолданады.`,
          `3. Деңгейлік және өмірлік есептерді қатесіз орындайды.`
        ]);
      } else {
        setLessonGoalsList([
          `1. Объясняет правила и свойства по теме «${obj.topicRu}».`,
          `2. Корректно применяет формулы согласно цели ${obj.code} при решении задач.`,
          `3. Самостоятельно решает практические и дифференцированные задания.`
        ]);
      }
    }
  };

  const toggleWorkForm = (val: WorkForm) => {
    setWorkForms(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleTaskType = (val: TaskType) => {
    setTaskTypes(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleAssessment = (val: AssessmentMethod) => {
    setAssessmentMethods(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleValue = (val: AdalAzamatValue) => {
    setSelectedValues(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      schoolName,
      teacherName,
      language,
      subject,
      grade,
      studentsCount,
      absentCount,
      date,
      sectionName,
      lessonTopic,
      learningObjectiveCode,
      learningObjectiveText,
      lessonGoal: lessonGoalsList.join('\n'),
      lessonGoalsList,
      durationMinutes,
      lessonType,
      taskCount,
      workForms,
      taskTypes,
      assessmentMethods,
      adalAzamatValues: selectedValues,
      textbookReference: {
        publisher: textbookPublisher,
        authors: textbookAuthors,
        textbookTitle: textbookTitle,
        editionYear: textbookEditionYear,
        paragraph: textbookParagraph,
        pageNumbers: textbookPages,
        exercises: textbookExercises,
        selectedExerciseText: selectedExerciseText,
      },
    });
  };

  // Popular topic quick chips for the current grade
  const popularGradeChips = grade === 5
    ? (isKk ? ['Жай бөлшектерді салыстыру', 'Жай бөлшектерді қосу', 'Жай бөлшектерді көбейту', 'Пайыз'] : ['Сравнение дробей', 'Сложение дробей', 'Умножение дробей', 'Проценты'])
    : grade === 6
    ? (isKk ? ['Рационал сандарды көбейту', 'Рационал сандарды бөлу', 'Пропорция', 'Сызықтық теңдеулер'] : ['Умножение рациональных чисел', 'Деление рациональных чисел', 'Пропорция', 'Линейные уравнения'])
    : grade === 7
    ? (isKk ? ['Көпмүшені көбейткіштерге жіктеу', 'Екі өрнектің квадраттарының айырмасы', 'Сызықтық функция', 'Үшбұрыштар теңдігі'] : ['Разложение многочлена на множители', 'Разность квадратов', 'Линейная функция', 'Признаки равенства треугольников'])
    : grade === 8
    ? (isKk ? ['Квадрат теңдеулерді шешу', 'Виет теоремасы', 'Пифагор теоремасы', 'Параллелограммның қасиеттері'] : ['Квадратные уравнения', 'Теорема Виета', 'Теорема Пифагора', 'Свойства параллелограмма'])
    : (isKk ? ['Арифметикалық прогрессия', 'Екі айнымалысы бар теңдеулер жүйесі', 'Векторларды есептерге қолдану', 'Синустар және косинустар теоремалары'] : ['Арифметическая прогрессия', 'Системы уравнений', 'Применение векторов', 'Теорема синусов и косинусов']);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Form Title & Bilingual Switcher */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>5–9 сыныптар • №130 Бұйрық нысаны</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isKk ? 'ҚМЖ құрастыру конструкторы' : 'Конструктор КСП (5–9 классы)'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isKk 
                ? 'Мұғалім КТЖ бойынша кез келген тақырып пен мақсатты өзі еркін жаза алады.' 
                : 'Учитель может свободно ввести любую тему и цель урока из своего КТП.'}
            </p>
          </div>

          {/* Bilingual Switcher */}
          {onLanguageChange && (
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onLanguageChange('kk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isKk ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇰🇿 Қазақша
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ru')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !isKk ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇷🇺 Русский
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Official Organization & Teacher Meta */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>1. {isKk ? 'Ұйым және оқытушы мәліметтері' : 'Сведения об организации и педагоге'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Білім беру ұйымының атауы *' : 'Наименование организации образования *'}
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="№48 жалпы орта білім беретін мектеп"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Педагогтің аты-жөні *' : 'ФИО педагога *'}
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Каюпова Орынгуль Жумагалиевна"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Grades 5 to 9 & Subject Selection */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>2. {isKk ? 'Сынып (5–9) және пәнді таңдау' : 'Класс (5–9) и предмет'}</span>
            </h3>

            {/* Prominent Grade Selector (5, 6, 7, 8, 9) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isKk ? 'Сыныпты таңдаңыз (5–9 сыныптар):' : 'Выберите класс (5–9 классы):'}
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[5, 6, 7, 8, 9].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeSelect(g)}
                    className={`py-3 rounded-2xl text-center font-bold text-sm sm:text-base transition-all ${
                      grade === g
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600 ring-offset-2 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{g}-{isKk ? 'сынып' : 'кл'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Indicator / Toggle for Grades 7-9 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {isKk ? 'Таңдалған пән:' : 'Выбранный предмет:'}
                </span>
                <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs">
                  {grade <= 6 
                    ? (isKk ? '📘 Математика (5–6 сынып)' : '📘 Математика (5–6 класс)')
                    : subject === 'geometry'
                    ? (isKk ? '📐 Геометрия (7–9 сынып)' : '📐 Геометрия (7–9 класс)')
                    : (isKk ? '✏️ Алгебра (7–9 сынып)' : '✏️ Алгебра (7–9 класс)')
                  }
                </span>
              </div>

              {/* Subject switcher for Grades 7, 8, 9 */}
              {grade >= 7 && (
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSubjectChange('algebra')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      subject === 'algebra' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isKk ? 'Алгебра' : 'Алгебра'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubjectChange('geometry')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      subject === 'geometry' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isKk ? 'Геометрия' : 'Геометрия'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Сабақтың ұзақтығы' : 'Длительность урока'}
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm bg-white outline-none"
                >
                  <option value={45}>45 минут (Стандарт)</option>
                  <option value={40}>40 минут</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Күні *' : 'Дата *'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Қатысушылар / Қатыспағандар' : 'Присутствуют / Отсутствуют'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(parseInt(e.target.value) || 1)}
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-center font-bold"
                    title={isKk ? 'Қатысқандар саны' : 'Присутствующие'}
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    min={0}
                    max={studentsCount}
                    value={absentCount}
                    onChange={(e) => setAbsentCount(parseInt(e.target.value) || 0)}
                    className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-center"
                    title={isKk ? 'Қатыспағандар саны' : 'Отсутствующие'}
                  />
                </div>
              </div>

              {/* Group Division Feasibility & Pedagogical Adaptation Preview */}
              <div className="sm:col-span-2 pt-1">
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all shadow-2xs ${
                  groupDiv.badgeStatus === 'small'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-900'
                    : groupDiv.badgeStatus === 'moderate'
                    ? 'bg-blue-50/90 border-blue-300 text-blue-900'
                    : 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="font-extrabold flex items-center gap-1.5 text-xs">
                      <Users className="w-4 h-4 shrink-0 text-current" />
                      <span>{isKk ? groupDiv.badgeTitleKk : groupDiv.badgeTitleRu}</span>
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-white/90 border border-current/20 shadow-2xs self-start sm:self-auto">
                      {isKk ? groupDiv.summaryDistributionKk : groupDiv.summaryDistributionRu}
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed opacity-95">
                    {isKk ? groupDiv.explanationKk : groupDiv.explanationRu}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Official Textbook Publishers & Tasks Selection (Атамұра, Мектеп, Алматыкітап, т.б.) */}
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  <span>3. {isKk ? 'ҚР Оқулық баспалары және оқулық тапсырмалары' : 'Издательства учебников РК и задания'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isKk 
                    ? 'Мектебіңізде оқытылатын баспаны таңдаңыз («Атамұра», «Мектеп», «Алматыкітап», т.б.). Оқулықтың параграфы, беті және нақты есептері (№) ҚМЖ-ға тікелей енеді.' 
                    : 'Выберите издательство учебника вашей школы («Атамұра», «Мектеп», «Алматыкітап» и др.). Номера упражнений и параграф включаются в КСП.'}
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto flex items-center gap-1">
                <BookCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKk ? 'ҚР БҒМ бекіткен баспалар' : 'Утвержденные издательства РК'}</span>
              </span>
            </div>

            {/* Notification alert */}
            {textbookNotification && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>{textbookNotification}</span>
                </div>
                <span className="text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {isKk ? 'ҚМЖ-ға бекітілді' : 'Включено в план'}
                </span>
              </div>
            )}

            {/* Publisher Filter Buttons */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {isKk ? 'Оқитын баспаны таңдаңыз:' : 'Выберите издательство учебника:'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedPublisher('all')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    selectedPublisher === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isKk ? 'Барлық баспалар' : 'Все издательства'}
                </button>
                {OFFICIAL_PUBLISHERS.map((pub) => {
                  const isSel = selectedPublisher === pub.nameKk || selectedPublisher === pub.id;
                  return (
                    <button
                      key={pub.id}
                      type="button"
                      onClick={() => {
                        setSelectedPublisher(pub.nameKk);
                        setTextbookPublisher(pub.nameKk);
                        const found = getTextbooksForGradeAndSubject(grade, subject, pub.nameKk);
                        if (found.length > 0) {
                          handleSelectTextbookCard(found[0]);
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span>{pub.nameKk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Textbooks List for this grade/subject */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>
                  {grade}-{isKk ? 'сыныпқа арналған бекітілген оқулықтар' : 'класс: утвержденные учебники'}:
                </span>
                <span className="text-slate-400 font-normal text-[11px]">
                  {getTextbooksForGradeAndSubject(grade, subject, selectedPublisher).length} {isKk ? 'оқулық табылды' : 'найдено'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getTextbooksForGradeAndSubject(grade, subject, selectedPublisher).map((tb) => {
                  const isCurrent = selectedTextbookId === tb.id;
                  return (
                    <div
                      key={tb.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold">
                              {tb.publisher}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">
                              {isKk ? tb.titleKk : tb.titleRu}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({tb.editionYear})
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            <span className="font-semibold text-slate-700">{isKk ? 'Авторлары:' : 'Авторы:'}</span> {isKk ? tb.authorsKk : tb.authorsRu}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectTextbookCard(tb)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isCurrent ? (isKk ? '✓ Таңдалған оқулық' : '✓ Выбран') : (isKk ? 'Осы оқулықты таңдау' : 'Выбрать учебник')}
                        </button>
                      </div>

                      {/* Recommended topics and exercises inside this textbook */}
                      {tb.recommendedTopics && tb.recommendedTopics.length > 0 && (
                        <div className="pt-3 space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            {isKk ? 'Оқулықтағы тақырыптар мен жаттығулар (1 шертумен ҚМЖ-ға енгізу):' : 'Темы и упражнения учебника (нажмите для вставки):'}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {tb.recommendedTopics.map((top, tIdx) => {
                              const isTopicSelected = textbookParagraph === top.paragraph;
                              return (
                                <button
                                  key={tIdx}
                                  type="button"
                                  onClick={() => handleSelectTextbookTopic(tb, top)}
                                  className={`text-left p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                                    isTopicSelected
                                      ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold">
                                    <span className="text-blue-700 font-mono">{top.paragraph}</span>
                                    <span className="text-slate-500 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                                      {top.pages}
                                    </span>
                                  </div>
                                  <div className="font-semibold text-slate-900 leading-snug">
                                    {isKk ? top.topicNameKk : top.topicNameRu}
                                  </div>
                                  <div className="text-[11px] text-indigo-700 font-medium">
                                    <span className="font-bold text-slate-700">{isKk ? 'Жаттығулар:' : 'Задания:'}</span> {top.exercises}
                                  </div>
                                  {top.sampleProblemKk && (
                                    <div className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-1 line-clamp-1">
                                      {isKk ? top.sampleProblemKk : top.sampleProblemRu}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editable Textbook Reference Details (Synchronized with QMZh) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Library className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isKk ? 'ҚМЖ-ға енгізілетін оқулық деректері (мұғалім өзгерте алады):' : 'Данные учебника для включения в КСП (можно редактировать):'}</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  {isKk ? '№130 нысан бойынша' : 'По форме приказа №130'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Баспасы' : 'Издательство'}
                  </label>
                  <input
                    type="text"
                    value={textbookPublisher}
                    onChange={(e) => setTextbookPublisher(e.target.value)}
                    placeholder="«Атамұра»"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-bold text-blue-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Оқулық атауы' : 'Название учебника'}
                  </label>
                  <input
                    type="text"
                    value={textbookTitle}
                    onChange={(e) => setTextbookTitle(e.target.value)}
                    placeholder="Математика. 6-сынып"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Авторлары' : 'Авторы'}
                  </label>
                  <input
                    type="text"
                    value={textbookAuthors}
                    onChange={(e) => setTextbookAuthors(e.target.value)}
                    placeholder="Т.А. Алдамұратова"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Параграф / Тақырып' : 'Параграф / Тема'}
                  </label>
                  <input
                    type="text"
                    value={textbookParagraph}
                    onChange={(e) => setTextbookParagraph(e.target.value)}
                    placeholder="§18. Рационал сандарды көбейту"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Беттері' : 'Страницы'}
                  </label>
                  <input
                    type="text"
                    value={textbookPages}
                    onChange={(e) => setTextbookPages(e.target.value)}
                    placeholder="72–76 б."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {isKk ? 'Оқулықтан жаттығулар (№)' : 'Номера упражнений (№)'}
                  </label>
                  <input
                    type="text"
                    value={textbookExercises}
                    onChange={(e) => setTextbookExercises(e.target.value)}
                    placeholder="№557 (А), №558 (В), №562 (С)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-bold text-indigo-700 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isKk ? 'Таңдалған оқулық есебінің шарты (ҚМЖ кестесінде ашылып жазылады):' : 'Условие задачи из учебника (будет детально раскрыто в таблице):'}
                </label>
                <input
                  type="text"
                  value={selectedExerciseText}
                  onChange={(e) => setSelectedExerciseText(e.target.value)}
                  placeholder="№557. Есепте: 1) (-3) · 7; 2) (-2.5) · (-4)..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Teacher Manual Custom Topic & Learning Objective Entry */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>4. {isKk ? 'Тақырып пен оқу мақсаттарын еркін енгізу' : 'Свободный ввод темы и целей урока'}</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {isKk ? 'Қолмен жазуға дайын' : 'Ручной ввод доступен'}
              </span>
            </div>

            {/* Helper Notice for Teachers */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
              {isKk 
                ? '💡 Мұғалім күнтізбелік-тақырыптық жоспарынан (КТЖ) кез келген тақырып пен мақсатты осы өрістерге тікелей жаза немесе көшіріп қоя алады. Сондай-ақ дайын каталогтан таңдауға да болады.' 
                : '💡 Учитель может ввести любую тему и цель из календарно-тематического плана (КТП) вручную или выбрать из каталога утвержденных целей.'}
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{grade}-{isKk ? 'сыныптың танымал тақырыптары (1 рет шертіп таңдауға болады):' : 'Популярные темы класса:'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularGradeChips.map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => {
                      setLessonTopic(chip);
                      handleAutoGenerateGoals();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      lessonTopic === chip
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Lesson Topic Field */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                {isKk ? 'Сабақтың тақырыбы (мұғалімнің өз тақырыбы) *' : 'Тема урока (введите вашу тему) *'}
              </label>
              <input
                type="text"
                required
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                placeholder={isKk ? 'Мысалы: Рационал сандарды көбейту немесе Квадрат теңдеулер...' : 'Например: Умножение рациональных чисел или Теорема Пифагора...'}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base font-bold text-slate-900 outline-none transition-all"
              />
            </div>

            {/* Section Name & Objective Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Бөлім (тарау) атауы *' : 'Раздел *'}
                </label>
                <input
                  type="text"
                  required
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder={isKk ? 'Мысалы: Рационал сандарға амалдар қолдану' : 'Например: Действия над рациональными числами'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Оқу мақсаты коды *' : 'Код цели *'}
                </label>
                <input
                  type="text"
                  required
                  value={learningObjectiveCode}
                  onChange={(e) => setLearningObjectiveCode(e.target.value)}
                  placeholder="6.1.2.15"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm font-mono font-bold text-blue-700 outline-none"
                />
              </div>
            </div>

            {/* Full Learning Objective Text (KTZh) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаты (толық мәтіні) *' : 'Текст цели обучения из КТП *'}
              </label>
              <textarea
                rows={2}
                required
                value={learningObjectiveText}
                onChange={(e) => setLearningObjectiveText(e.target.value)}
                placeholder={isKk ? 'КТЖ-дағы оқу мақсатын осында жазыңыз немесе көшіріп қойыңыз...' : 'Введите или вставьте цель обучения из вашего КТП...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm outline-none leading-relaxed"
              />
            </div>

            {/* 3 Lesson Goals (Numbered and editable) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-900">
                  {isKk ? 'Сабақтың мақсаты (3 нақты пункт):' : 'Цели урока (3 конкретных пункта):'}
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateGoals}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isKk ? 'Тақырыпқа сай 3 мақсатты автоматты құрастыру' : 'Сгенерировать 3 цели по теме'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {lessonGoalsList.map((goal, gIdx) => (
                  <div key={gIdx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {gIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={goal.replace(/^\d+\.\s*/, '')}
                      onChange={(e) => {
                        const copy = [...lessonGoalsList];
                        copy[gIdx] = `${gIdx + 1}. ${e.target.value}`;
                        setLessonGoalsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Collapsible Curriculum Objectives Catalog */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCatalog(!showCatalog)}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showCatalog ? 'rotate-180' : ''}`} />
                <span>
                  {showCatalog 
                    ? (isKk ? 'Үлгілік оқу мақсаттары каталогын жасыру' : 'Скрыть каталог утвержденных целей')
                    : (isKk ? `2026–2027 Бағдарламалық оқу мақсаттары каталогынан таңдау (${grade}-сынып) ▼` : `Выбрать из каталога утвержденных целей (${grade} класс) ▼`)}
                </span>
              </button>

              {showCatalog && (
                <div className="mt-3 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/70 space-y-2.5">
                  <div className="text-xs font-semibold text-blue-900">
                    {isKk ? 'Кез келген мақсатты басып, өрістерге 1 шертумен қоюға болады:' : 'Нажмите на цель, чтобы вставить ее в форму:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURRICULUM_OBJECTIVES.filter(o => o.subject === subject && o.grade === grade).map(obj => (
                      <button
                        key={obj.code}
                        type="button"
                        onClick={() => {
                          handleObjectiveSelect(obj.code);
                          setShowCatalog(false);
                        }}
                        className="text-left p-2.5 rounded-xl border border-blue-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-xs space-y-1"
                      >
                        <div className="font-bold text-blue-800 flex items-center justify-between">
                          <span className="font-mono">{obj.code}</span>
                          <span className="text-[10px] text-slate-500">{obj.grade}-{isKk ? 'сынып' : 'кл'}</span>
                        </div>
                        <div className="font-semibold text-slate-900">{isKk ? obj.topicKk : obj.topicRu}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-2">{isKk ? obj.textKk : obj.textRu}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Type */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Сабақтың түрі *' : 'Тип урока *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'new', label: isKk ? 'Жаңа тақырып' : 'Новый урок' },
                  { id: 'reinforce', label: isKk ? 'Бекіту сабағы' : 'Закрепление' },
                  { id: 'revision', label: isKk ? 'Қайталау' : 'Повторение' },
                  { id: 'practical', label: isKk ? 'Практикалық' : 'Практический' },
                  { id: 'research', label: isKk ? 'Зерттеу сабағы' : 'Исследование' },
                  { id: 'bjb', label: isKk ? 'БЖБ сабағы' : 'Урок СОР' },
                  { id: 'tjb', label: isKk ? 'ТЖБ сабағы' : 'Урок СОЧ' },
                ].map(lt => (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() => setLessonType(lt.id as LessonType)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      lessonType === lt.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{lt.label}</span>
                    {lessonType === lt.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Pedagogical Forms & Task Types */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>5. {isKk ? 'Жұмыс формалары мен тапсырма түрлері' : 'Формы работы и виды заданий'}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Жұмыс формалары (бірнешеуін таңдаңыз):' : 'Формы работы:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'individual', label: 'Жеке жұмыс' },
                  { id: 'pair', label: 'Жұптық жұмыс' },
                  { id: 'group', label: 'Топтық жұмыс' },
                  { id: 'guided', label: 'Мұғаліммен бірлескен жұмыс' },
                ].map(wf => (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => toggleWorkForm(wf.id as WorkForm)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      workForms.includes(wf.id as WorkForm)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {wf.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Тапсырма түрлері:' : 'Виды заданий:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'tiered', label: isKk ? 'Деңгейлік тапсырма (ЖИ платформа differen-git...)' : 'Дифференцированные (ИИ платформа differen-git...)' },
                  { id: 'logic', label: 'Логикалық есеп' },
                  { id: 'word_problem', label: 'Мәтіндік есеп' },
                  { id: 'real_world', label: 'Өмірмен байланысты есеп' },
                  { id: 'pisa', label: 'PISA тапсырмасы' },
                  { id: 'functional', label: 'Функционалдық сауаттылық' },
                  { id: 'research', label: 'Зерттеу тапсырмасы' },
                  { id: 'geometry_proof', label: 'Геометриялық дәлелдеу' },
                  { id: 'graph', label: 'Графикпен жұмыс' },
                  { id: 'ai_analysis', label: 'ЖИ қатесін талдау' },
                ].map(tt => (
                  <button
                    key={tt.id}
                    type="button"
                    onClick={() => toggleTaskType(tt.id as TaskType)}
                    className={`p-2 rounded-lg border text-xs text-left font-medium ${
                      taskTypes.includes(tt.id as TaskType)
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Тапсырмалар саны:' : 'Количество задач:'}
              </label>
              <div className="flex gap-3">
                {[3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTaskCount(num)}
                    className={`w-12 h-10 rounded-xl border text-sm font-bold flex items-center justify-center ${
                      taskCount === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. «Адал азамат» Values */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>6. «Адал азамат» тәрбие бағдарламасының құндылықтары</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isKk ? 'Сабақ мазмұны мен тапсырмаларына кіріктірілетін негізгі құндылықтар:' : 'Ценности, интегрируемые в содержание уроков:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(ADAL_AZAMAT_VALUES_INFO) as AdalAzamatValue[]).map((val) => {
                const info = ADAL_AZAMAT_VALUES_INFO[val];
                const isSelected = selectedValues.includes(val);
                return (
                  <div
                    key={val}
                    onClick={() => toggleValue(val)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {isKk ? info.titleKk : info.titleRu}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isKk ? info.descKk : info.descRu}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isKk ? 'ЖИ ҚМЖ-ны дайындауда...' : 'Генерация КСП...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isKk ? 'Кәсіби ҚМЖ жасау (№130 бұйрық)' : 'Сгенерировать КСП (Приказ №130)'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
