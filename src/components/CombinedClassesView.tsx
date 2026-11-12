/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Printer, 
  Sparkles, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Edit3, 
  Copy, 
  ExternalLink,
  ChevronRight,
  GraduationCap,
  PenTool,
  Clock,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CombinedQMZhDocument, LanguageType, SubjectType, CombinedStage, TieredTask } from '../types/qmzh';
import { generateOfflineCombinedQMZh } from '../utils/fallbackGenerator';
import { exportCombinedQMZhToWord } from '../utils/wordExporter';
import { MathView } from './MathView';

interface CombinedClassesViewProps {
  language: LanguageType;
}

interface PresetCombo {
  id: string;
  titleKk: string;
  titleRu: string;
  c1Grade: number;
  c1Subject: SubjectType;
  c1TopicKk: string;
  c1TopicRu: string;
  c1Code: string;
  c2Grade: number;
  c2Subject: SubjectType;
  c2TopicKk: string;
  c2TopicRu: string;
  c2Code: string;
}

const PRESET_COMBOS: PresetCombo[] = [
  {
    id: '5_6_math',
    titleKk: '5-сынып + 6-сынып (Математика)',
    titleRu: '5 класс + 6 класс (Математика)',
    c1Grade: 5,
    c1Subject: 'math',
    c1TopicKk: 'Жай бөлшектерді салыстыру',
    c1TopicRu: 'Сравнение обыкновенных дробей',
    c1Code: '5.1.2.16',
    c2Grade: 6,
    c2Subject: 'math',
    c2TopicKk: 'Рационал сандарды көбейту',
    c2TopicRu: 'Умножение рациональных чисел',
    c2Code: '6.1.2.15',
  },
  {
    id: '6_7_math_alg',
    titleKk: '6-сынып (Мат) + 7-сынып (Алгебра)',
    titleRu: '6 класс (Мат) + 7 класс (Алгебра)',
    c1Grade: 6,
    c1Subject: 'math',
    c1TopicKk: 'Рационал сандарды көбейту',
    c1TopicRu: 'Умножение рациональных чисел',
    c1Code: '6.1.2.15',
    c2Grade: 7,
    c2Subject: 'algebra',
    c2TopicKk: 'Көпмүшені көбейткіштерге жіктеу',
    c2TopicRu: 'Разложение многочлена на множители',
    c2Code: '7.2.1.8',
  },
  {
    id: '7_8_algebra',
    titleKk: '7-сынып + 8-сынып (Алгебра)',
    titleRu: '7 класс + 8 класс (Алгебра)',
    c1Grade: 7,
    c1Subject: 'algebra',
    c1TopicKk: 'Көпмүшені көбейткіштерге жіктеу',
    c1TopicRu: 'Разложение многочлена на множители',
    c1Code: '7.2.1.8',
    c2Grade: 8,
    c2Subject: 'algebra',
    c2TopicKk: 'Квадрат теңдеулерді шешу формулалары',
    c2TopicRu: 'Формулы корней квадратного уравнения',
    c2Code: '8.2.2.3',
  },
  {
    id: '7_8_geometry',
    titleKk: '7-сынып + 8-сынып (Геометрия)',
    titleRu: '7 класс + 8 класс (Геометрия)',
    c1Grade: 7,
    c1Subject: 'geometry',
    c1TopicKk: 'Үшбұрыштар теңдігінің белгілері',
    c1TopicRu: 'Признаки равенства треугольников',
    c1Code: '7.1.1.21',
    c2Grade: 8,
    c2Subject: 'geometry',
    c2TopicKk: 'Пифагор теоремасы',
    c2TopicRu: 'Теорема Пифагора',
    c2Code: '8.1.3.3',
  },
  {
    id: '8_9_algebra',
    titleKk: '8-сынып + 9-сынып (Алгебра)',
    titleRu: '8 класс + 9 класс (Алгебра)',
    c1Grade: 8,
    c1Subject: 'algebra',
    c1TopicKk: 'Квадрат теңдеулерді шешу формулалары',
    c1TopicRu: 'Формулы корней квадратного уравнения',
    c1Code: '8.2.2.3',
    c2Grade: 9,
    c2Subject: 'algebra',
    c2TopicKk: 'Екі айнымалысы бар теңдеулер жүйесі',
    c2TopicRu: 'Системы уравнений с двумя переменными',
    c2Code: '9.2.2.2',
  },
];

const PUBLISHERS = ['«Атамұра»', '«Мектеп»', '«Келешек-2030»', '«Алматыкітап»'];

export const CombinedClassesView: React.FC<CombinedClassesViewProps> = ({ language }) => {
  const isKk = language === 'kk';

  // State
  const [selectedPreset, setSelectedPreset] = useState<string>('5_6_math');
  const [activeTab, setActiveTab] = useState<'schedule' | 'class1_tasks' | 'class2_tasks' | 'answer_keys'>('schedule');

  // Teacher metadata
  const [teacherName, setTeacherName] = useState<string>('Каюпова Орынгуль Жумагалиевна');
  const [schoolName, setSchoolName] = useState<string>(
    isKk ? '№12 шағын жинақталған негізгі мектебі' : 'Малокомплектная основная средняя школа №12'
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Class 1 parameters
  const [c1Grade, setC1Grade] = useState<number>(5);
  const [c1Subject, setC1Subject] = useState<SubjectType>('math');
  const [c1Students, setC1Students] = useState<number>(3);
  const [c1Absent, setC1Absent] = useState<number>(0);
  const [c1Topic, setC1Topic] = useState<string>('Жай бөлшектерді салыстыру');
  const [c1Code, setC1Code] = useState<string>('5.1.2.16');
  const [c1Publisher, setC1Publisher] = useState<string>('«Атамұра»');
  const [c1Exercises, setC1Exercises] = useState<string>('№557 (А), №558 (В)');

  // Class 2 parameters
  const [c2Grade, setC2Grade] = useState<number>(6);
  const [c2Subject, setC2Subject] = useState<SubjectType>('math');
  const [c2Students, setC2Students] = useState<number>(4);
  const [c2Absent, setC2Absent] = useState<number>(0);
  const [c2Topic, setC2Topic] = useState<string>('Рационал сандарды көбейту');
  const [c2Code, setC2Code] = useState<string>('6.1.2.15');
  const [c2Publisher, setC2Publisher] = useState<string>('«Мектеп»');
  const [c2Exercises, setC2Exercises] = useState<string>('№420 (А), №425 (В)');

  // Plan state
  const [combinedPlan, setCombinedPlan] = useState<CombinedQMZhDocument>(() =>
    generateOfflineCombinedQMZh({ language })
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Apply preset
  const handleSelectPreset = (preset: PresetCombo) => {
    setSelectedPreset(preset.id);
    setC1Grade(preset.c1Grade);
    setC1Subject(preset.c1Subject);
    setC1Topic(isKk ? preset.c1TopicKk : preset.c1TopicRu);
    setC1Code(preset.c1Code);

    setC2Grade(preset.c2Grade);
    setC2Subject(preset.c2Subject);
    setC2Topic(isKk ? preset.c2TopicKk : preset.c2TopicRu);
    setC2Code(preset.c2Code);

    // Regenerate offline plan immediately
    const newPlan = generateOfflineCombinedQMZh({
      language,
      teacherName,
      schoolName,
      date,
      class1: {
        grade: preset.c1Grade,
        subject: preset.c1Subject,
        studentsCount: c1Students,
        absentCount: c1Absent,
        topic: isKk ? preset.c1TopicKk : preset.c1TopicRu,
        objectiveCode: preset.c1Code,
        objectiveText: `${isKk ? 'Оқу бағдарламасы бойынша' : 'По учебной программе'}: ${isKk ? preset.c1TopicKk : preset.c1TopicRu}`,
        textbookReference: { publisher: c1Publisher, textbookTitle: `${preset.c1Grade}-сынып`, exercises: c1Exercises },
        tasks: [],
      },
      class2: {
        grade: preset.c2Grade,
        subject: preset.c2Subject,
        studentsCount: c2Students,
        absentCount: c2Absent,
        topic: isKk ? preset.c2TopicKk : preset.c2TopicRu,
        objectiveCode: preset.c2Code,
        objectiveText: `${isKk ? 'Оқу бағдарламасы бойынша' : 'По учебной программе'}: ${isKk ? preset.c2TopicKk : preset.c2TopicRu}`,
        textbookReference: { publisher: c2Publisher, textbookTitle: `${preset.c2Grade}-сынып`, exercises: c2Exercises },
        tasks: [],
      },
    });
    setCombinedPlan(newPlan);
  };

  // Generate with offline engine
  const handleGenerateOffline = () => {
    const plan = generateOfflineCombinedQMZh({
      language,
      teacherName,
      schoolName,
      date,
      class1: {
        grade: c1Grade,
        subject: c1Subject,
        studentsCount: c1Students,
        absentCount: c1Absent,
        topic: c1Topic,
        objectiveCode: c1Code,
        objectiveText: `Оқу мақсатына сәйкес: ${c1Topic}`,
        textbookReference: { publisher: c1Publisher, textbookTitle: `${c1Grade}-сынып`, exercises: c1Exercises },
        tasks: [],
      },
      class2: {
        grade: c2Grade,
        subject: c2Subject,
        studentsCount: c2Students,
        absentCount: c2Absent,
        topic: c2Topic,
        objectiveCode: c2Code,
        objectiveText: `Оқу мақсатына сәйкес: ${c2Topic}`,
        textbookReference: { publisher: c2Publisher, textbookTitle: `${c2Grade}-сынып`, exercises: c2Exercises },
        tasks: [],
      },
    });
    setCombinedPlan(plan);
  };

  // Generate with Gemini AI via /api/generate-combined
  const handleGenerateAi = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await fetch('/api/generate-combined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          teacherName,
          schoolName,
          date,
          class1: {
            grade: c1Grade,
            subject: c1Subject,
            studentsCount: c1Students,
            absentCount: c1Absent,
            topic: c1Topic,
            objectiveCode: c1Code,
            textbookReference: { publisher: c1Publisher, textbookTitle: `${c1Grade}-сынып`, exercises: c1Exercises },
          },
          class2: {
            grade: c2Grade,
            subject: c2Subject,
            studentsCount: c2Students,
            absentCount: c2Absent,
            topic: c2Topic,
            objectiveCode: c2Code,
            textbookReference: { publisher: c2Publisher, textbookTitle: `${c2Grade}-сынып`, exercises: c2Exercises },
          },
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      if (data.combinedQMZh) {
        setCombinedPlan(data.combinedQMZh);
      }
    } catch (err) {
      console.warn('AI generation failed, fallback to offline generator:', err);
      handleGenerateOffline();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Word export
  const handleWordExport = async () => {
    try {
      setIsExporting(true);
      await exportCombinedQMZhToWord(combinedPlan);
    } catch (e) {
      console.error('Word export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct edit stage field handler
  const handleStageChange = (idx: number, field: keyof CombinedStage, val: any) => {
    const updatedStages = [...combinedPlan.stages];
    updatedStages[idx] = { ...updatedStages[idx], [field]: val };
    setCombinedPlan({ ...combinedPlan, stages: updatedStages });
  };

  const copyPlanSummary = () => {
    const text = `${combinedPlan.schoolName}\n${combinedPlan.sectionName}\nМұғалім: ${combinedPlan.teacherName}\n${combinedPlan.class1.grade}-сынып: ${combinedPlan.class1.topic}\n${combinedPlan.class2.grade}-сынып: ${combinedPlan.class2.topic}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* 1. Header Banner */}
      <div className="print:hidden bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Layers className="w-80 h-80" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{isKk ? 'Шағын жинақталған мектептер (ШЖМ) модулі' : 'Малокомплектные школы (МКШ)'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {isKk ? 'Біріктірілген сыныптар ҚМЖ құрастырушысы' : 'Конструктор КСП для совмещенных классов'}
          </h1>
          <p className="text-sm text-amber-100 max-w-3xl leading-relaxed">
            {isKk
              ? 'Бір оқу кабинетінде қатар оқитын екі сыныпқа арналған 45 минуттық синхронды ҚМЖ (№130 бұйрық). Мұғалімнің түсіндіруі мен оқушылардың өздік жұмысы нақты 15 минуттық ротациямен кезектеседі. Оқушы әрекетінде барлық есептер 100% ашық шығарылады.'
              : 'Синхронизированный 45-минутный поурочный план для совмещенных классов (Приказ №130). Чередование прямой работы учителя и самостоятельной работы учащихся каждые 15 минут с полными решениями задач.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://differen-git-main-oryngul-kayupova.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold text-white transition-all shadow-xs"
            >
              <span>{isKk ? 'Деңгейлік тапсырмалар ЖИ платформасы' : 'ИИ платформа уровневых заданий'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-white/80">
              {isKk ? '• Әр сыныпқа А, В, С деңгейлік карточкалары толық құрылады' : '• Карточки А, В, С для обоих классов'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Preset Selection Chips */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {isKk ? 'Дайын сынып жұптарын таңдау (Пресеттер):' : 'Готовые пары совмещенных классов:'}
          </span>
          <span className="text-[11px] text-slate-500">
            {isKk ? '5–9 сыныптар аралығы' : '5–9 классы'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COMBOS.map((combo) => (
            <button
              key={combo.id}
              onClick={() => handleSelectPreset(combo)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedPreset === combo.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isKk ? combo.titleKk : combo.titleRu}
            </button>
          ))}
          <button
            onClick={() => setSelectedPreset('custom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedPreset === 'custom'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isKk ? '✏️ Еркін таңдау (Өз параметрлеріңіз)' : '✏️ Своя комбинация'}
          </button>
        </div>
      </div>

      {/* 3. Detailed Combined Class Configuration Panel */}
      <div className="print:hidden bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Meta inputs: Teacher & School */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKk ? 'Педагогтің аты-жөні:' : 'ФИО педагога:'}
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKk ? 'Мектеп атауы:' : 'Наименование школы:'}
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isKk ? 'Сабақ өткізілетін күн:' : 'Дата урока:'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 2 Blocks: Class 1 and Class 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class 1 (Блок А) */}
          <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/30 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                1-сынып (Блок А — 1-кезекте түсіндіру)
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {c1Grade}-сынып
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Сынып:</label>
                <select
                  value={c1Grade}
                  onChange={(e) => setC1Grade(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  {[5, 6, 7, 8, 9].map((g) => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Пән:</label>
                <select
                  value={c1Subject}
                  onChange={(e) => setC1Subject(e.target.value as SubjectType)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  <option value="math">Математика</option>
                  <option value="algebra">Алгебра</option>
                  <option value="geometry">Геометрия</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқушы саны:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={c1Students}
                  onChange={(e) => setC1Students(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Сабақ тақырыбы:</label>
              <input
                type="text"
                value={c1Topic}
                onChange={(e) => setC1Topic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="Мысалы: Жай бөлшектерді салыстыру"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқу мақсаты коды:</label>
                <input
                  type="text"
                  value={c1Code}
                  onChange={(e) => setC1Code(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  placeholder="5.1.2.16"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқулық баспасы:</label>
                <select
                  value={c1Publisher}
                  onChange={(e) => setC1Publisher(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  {PUBLISHERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқулық тапсырмалары:</label>
              <input
                type="text"
                value={c1Exercises}
                onChange={(e) => setC1Exercises(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                placeholder="№557 (А деңгейі), №558 (В деңгейі)"
              />
            </div>
          </div>

          {/* Class 2 (Блок Б) */}
          <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/30 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                2-сынып (Блок Б — 1-кезекте өздік жұмыс)
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                {c2Grade}-сынып
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Сынып:</label>
                <select
                  value={c2Grade}
                  onChange={(e) => setC2Grade(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  {[5, 6, 7, 8, 9].map((g) => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Пән:</label>
                <select
                  value={c2Subject}
                  onChange={(e) => setC2Subject(e.target.value as SubjectType)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  <option value="math">Математика</option>
                  <option value="algebra">Алгебра</option>
                  <option value="geometry">Геометрия</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқушы саны:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={c2Students}
                  onChange={(e) => setC2Students(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-indigo-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Сабақ тақырыбы:</label>
              <input
                type="text"
                value={c2Topic}
                onChange={(e) => setC2Topic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                placeholder="Мысалы: Рационал сандарды көбейту"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқу мақсаты коды:</label>
                <input
                  type="text"
                  value={c2Code}
                  onChange={(e) => setC2Code(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  placeholder="6.1.2.15"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқулық баспасы:</label>
                <select
                  value={c2Publisher}
                  onChange={(e) => setC2Publisher(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  {PUBLISHERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Оқулық тапсырмалары:</label>
              <input
                type="text"
                value={c2Exercises}
                onChange={(e) => setC2Exercises(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                placeholder="№420 (А деңгейі), №425 (В деңгейі)"
              />
            </div>
          </div>
        </div>

        {/* Generate Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isKk
                ? '45 минут қатаң синхрондалады: 5 мин ұйымдастыру + 15 мин 1-блок + 15 мин 2-блок (ротация) + 10 мин қорытынды'
                : 'Синхронизация 45 мин: 5 мин орг + 15 мин блок 1 + 15 мин блок 2 (ротация) + 10 мин итог'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateOffline}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isKk ? 'Жедел генератор (Офлайн)' : 'Быстрый генератор'}</span>
            </button>

            <button
              onClick={handleGenerateAi}
              disabled={isGeneratingAi}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isKk ? 'ЖИ есептеп құрастыруда...' : 'ИИ генерирует...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isKk ? 'ЖИ көмегімен құрастыру (Gemini AI)' : 'Сгенерировать через Gemini AI'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Combined QMZh Viewer & Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Navigation Tabs and Export Actions */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schedule'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isKk ? '1. Синхрондалған ҚМЖ кестесі (№130 бұйрық)' : '1. Синхронизированная таблица КСП'}</span>
            </button>

            <button
              onClick={() => setActiveTab('class1_tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'class1_tasks'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{combinedPlan.class1.grade}-сынып тапсырмалары (A, B, C)</span>
            </button>

            <button
              onClick={() => setActiveTab('class2_tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'class2_tasks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{combinedPlan.class2.grade}-сынып тапсырмалары (A, B, C)</span>
            </button>

            <button
              onClick={() => setActiveTab('answer_keys')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'answer_keys'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isKk ? 'Толық жауап кілті' : 'Ключи ответов'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isEditMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-200'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Кесте ұяшықтарын тікелей өңдеу"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Өңдеуді аяқтау' : 'ҚМЖ өңдеу'}</span>
            </button>

            <button
              onClick={copyPlanSummary}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Көшіріп алу"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Басып шығару (A4)"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleWordExport}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Жүктелуде...' : 'Word (.docx) жүктеу'}</span>
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-bold">
            {isKk ? 'ҚМЖ мәліметтері көшірілді!' : 'Данные КСП скопированы!'}
          </div>
        )}

        {/* TAB 1: SCHEDULE TABLE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Boxed Official Order 130 Header */}
            <div className="border border-black/80 rounded-xl overflow-hidden font-serif text-xs">
              <div className="p-3 bg-slate-50 border-b border-black/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block font-sans uppercase tracking-wider text-[11px]">
                    {isKk ? 'Қысқа мерзімді сабақ жоспары (№130 бұйрық нысаны)' : 'Краткосрочный план урока (Форма Приказа №130)'}
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-sans">
                    {combinedPlan.class1.grade} және {combinedPlan.class2.grade}-сыныптар біріктірілген сабағы (45 минут)
                  </div>
                </div>
                <div className="text-right font-sans">
                  <span className="font-bold text-slate-900">{isKk ? 'Бекітемін:' : 'Утверждаю:'}</span>
                  <div className="text-[11px] text-slate-500">____________________</div>
                </div>
              </div>

              <div className="divide-y divide-black/80">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Бөлімдері:' : 'Разделы:'}
                  </div>
                  <div className="col-span-9 p-2.5">
                    1-сынып ({combinedPlan.class1.grade}): <strong>{combinedPlan.class1.sectionName || combinedPlan.class1.topic}</strong>; 2-сынып ({combinedPlan.class2.grade}): <strong>{combinedPlan.class2.sectionName || combinedPlan.class2.topic}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Педагогтің аты-жөні:' : 'ФИО педагога:'}
                  </div>
                  <div className="col-span-9 p-2.5">
                    {combinedPlan.teacherName} ({combinedPlan.schoolName})
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Күні және уақыты:' : 'Дата и время:'}
                  </div>
                  <div className="col-span-9 p-2.5">
                    {combinedPlan.date} | 45 минут (Синхронды 4 кезең)
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Сыныптар мен оқушылар:' : 'Классы и учащиеся:'}
                  </div>
                  <div className="col-span-9 p-2.5 space-y-1">
                    <div>
                      <strong>{combinedPlan.class1.grade}-сынып:</strong> Қатысқандар: <strong>{combinedPlan.class1.studentsCount}</strong> оқушы | Қатыспағандар: <strong>{combinedPlan.class1.absentCount || 0}</strong>
                    </div>
                    <div>
                      <strong>{combinedPlan.class2.grade}-сынып:</strong> Қатысқандар: <strong>{combinedPlan.class2.studentsCount}</strong> оқушы | Қатыспағандар: <strong>{combinedPlan.class2.absentCount || 0}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Сабақтың тақырыптары:' : 'Темы уроков:'}
                  </div>
                  <div className="col-span-9 p-2.5 space-y-1">
                    <div>
                      1-сынып ({combinedPlan.class1.grade}): <strong>{combinedPlan.class1.topic}</strong>
                    </div>
                    <div>
                      2-сынып ({combinedPlan.class2.grade}): <strong>{combinedPlan.class2.topic}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаттары:' : 'Цели обучения по программе:'}
                  </div>
                  <div className="col-span-9 p-2.5 space-y-1">
                    <div>
                      <span className="font-mono font-bold text-blue-700">{combinedPlan.class1.objectiveCode}</span> — {combinedPlan.class1.objectiveText}
                    </div>
                    <div>
                      <span className="font-mono font-bold text-indigo-700">{combinedPlan.class2.objectiveCode}</span> — {combinedPlan.class2.objectiveText}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Сабақтың мақсаттары:' : 'Цели уроков:'}
                  </div>
                  <div className="col-span-9 p-2.5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-2 rounded bg-blue-50/50 border border-blue-100">
                      <strong className="text-blue-900 block font-sans text-[11px] mb-1">
                        {combinedPlan.class1.grade}-сынып мақсаты:
                      </strong>
                      <div className="whitespace-pre-line text-[11px] leading-relaxed">
                        {(combinedPlan.class1.lessonGoalsList || [combinedPlan.class1.lessonGoal]).join('\n')}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-indigo-50/50 border border-indigo-100">
                      <strong className="text-indigo-900 block font-sans text-[11px] mb-1">
                        {combinedPlan.class2.grade}-сынып мақсаты:
                      </strong>
                      <div className="whitespace-pre-line text-[11px] leading-relaxed">
                        {(combinedPlan.class2.lessonGoalsList || [combinedPlan.class2.lessonGoal]).join('\n')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 p-2.5 bg-slate-100 font-bold border-r border-black/80">
                    {isKk ? 'Оқулықтар мен баспалары:' : 'Учебники:'}
                  </div>
                  <div className="col-span-9 p-2.5">
                    1-сынып: {typeof combinedPlan.class1.textbookReference === 'string' ? combinedPlan.class1.textbookReference : (combinedPlan.class1.textbookReference?.publisher || '«Атамұра»') + (combinedPlan.class1.textbookReference?.exercises ? ` (${combinedPlan.class1.textbookReference.exercises})` : '')} | 2-сынып: {typeof combinedPlan.class2.textbookReference === 'string' ? combinedPlan.class2.textbookReference : (combinedPlan.class2.textbookReference?.publisher || '«Мектеп»') + (combinedPlan.class2.textbookReference?.exercises ? ` (${combinedPlan.class2.textbookReference.exercises})` : '')}
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Column Synchronized Table */}
            <div className="overflow-x-auto border border-black/80 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-black/80 font-bold text-slate-900 text-center font-sans">
                    <th className="p-3 border-r border-black/80 w-[12%]">
                      {isKk ? 'Уақыты / кезеңдері' : 'Время / Этап'}
                    </th>
                    <th className="p-3 border-r border-black/80 w-[24%]">
                      {isKk ? 'Мұғалімнің үйлестіруі (Мұғалім әрекеті)' : 'Координация учителя'}
                    </th>
                    <th className="p-3 border-r border-black/80 w-[28%] bg-blue-50/60 text-blue-900">
                      {combinedPlan.class1.grade}-сынып оқушыларының әрекеті ({combinedPlan.class1.studentsCount} оқушы)
                    </th>
                    <th className="p-3 border-r border-black/80 w-[28%] bg-indigo-50/60 text-indigo-900">
                      {combinedPlan.class2.grade}-сынып оқушыларының әрекеті ({combinedPlan.class2.studentsCount} оқушы)
                    </th>
                    <th className="p-3 w-[8%]">
                      {isKk ? 'Ресурстар' : 'Ресурсы'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/80 font-serif">
                  {combinedPlan.stages.map((st, i) => (
                    <tr key={i} className="align-top hover:bg-slate-50/30">
                      {/* 1. Time / Stage */}
                      <td className="p-3 border-r border-black/80 font-sans">
                        <span className="font-bold text-slate-900 block">{st.stageName}</span>
                        <div className="text-xs font-semibold text-blue-700 font-mono mt-0.5">
                          ({st.timeMinutes} мин)
                        </div>
                      </td>

                      {/* 2. Teacher Action */}
                      <td className="p-3 border-r border-black/80 leading-relaxed">
                        <div className="p-1.5 rounded bg-amber-50 text-amber-900 text-[11px] font-sans font-semibold mb-2 border border-amber-200">
                          {st.coordinationPrinciple}
                        </div>
                        {isEditMode ? (
                          <textarea
                            value={st.teacherActionCombined}
                            onChange={(e) => handleStageChange(i, 'teacherActionCombined', e.target.value)}
                            className="w-full p-2 border rounded font-mono text-[11px] h-36"
                          />
                        ) : (
                          <div className="whitespace-pre-line">{st.teacherActionCombined}</div>
                        )}
                      </td>

                      {/* 3. Class 1 Action */}
                      <td className="p-3 border-r border-black/80 leading-relaxed bg-blue-50/15">
                        <div className="flex items-center gap-1.5 mb-2 font-sans text-[11px] font-bold text-blue-800">
                          {i === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              <GraduationCap className="w-3 h-3" /> Мұғаліммен тікелей түсіндіру
                            </span>
                          ) : i === 2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              <PenTool className="w-3 h-3" /> Өздік / жұптық бекіту
                            </span>
                          ) : null}
                        </div>
                        {isEditMode ? (
                          <textarea
                            value={st.class1StudentAction}
                            onChange={(e) => handleStageChange(i, 'class1StudentAction', e.target.value)}
                            className="w-full p-2 border rounded font-mono text-[11px] h-36"
                          />
                        ) : (
                          <div className="whitespace-pre-line">{st.class1StudentAction}</div>
                        )}
                        <div className="mt-3 text-[11px] font-sans text-blue-900 font-bold border-t border-blue-200 pt-1.5">
                          Бағалау: {st.class1Assessment}
                        </div>
                      </td>

                      {/* 4. Class 2 Action */}
                      <td className="p-3 border-r border-black/80 leading-relaxed bg-indigo-50/15">
                        <div className="flex items-center gap-1.5 mb-2 font-sans text-[11px] font-bold text-indigo-800">
                          {i === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              <PenTool className="w-3 h-3" /> Өз бетінше нұсқаулықпен орындау
                            </span>
                          ) : i === 2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                              <GraduationCap className="w-3 h-3" /> Мұғаліммен тікелей талдау
                            </span>
                          ) : null}
                        </div>
                        {isEditMode ? (
                          <textarea
                            value={st.class2StudentAction}
                            onChange={(e) => handleStageChange(i, 'class2StudentAction', e.target.value)}
                            className="w-full p-2 border rounded font-mono text-[11px] h-36"
                          />
                        ) : (
                          <div className="whitespace-pre-line">{st.class2StudentAction}</div>
                        )}
                        <div className="mt-3 text-[11px] font-sans text-indigo-900 font-bold border-t border-indigo-200 pt-1.5">
                          Бағалау: {st.class2Assessment}
                        </div>
                      </td>

                      {/* 5. Resources */}
                      <td className="p-3 whitespace-pre-line text-slate-700 text-[11px]">
                        {isEditMode ? (
                          <textarea
                            value={st.resources}
                            onChange={(e) => handleStageChange(i, 'resources', e.target.value)}
                            className="w-full p-1.5 border rounded font-mono text-[11px] h-24"
                          />
                        ) : (
                          <div>{st.resources}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CLASS 1 TIERED TASKS (A, B, C) */}
        {activeTab === 'class1_tasks' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-blue-900 text-base">
                  {combinedPlan.class1.grade}-сыныпқа арналған деңгейлік тапсырмалар жинағы
                </h4>
                <p className="text-xs text-blue-700 mt-0.5">
                  Тақырып: <strong>{combinedPlan.class1.topic}</strong> ({combinedPlan.class1.objectiveCode})
                </p>
              </div>
              <a
                href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>ЖИ генераторға өту</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {combinedPlan.class1.tasks.map((task, tIdx) => (
                <div key={tIdx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg text-white font-bold flex items-center justify-center text-xs ${
                        tIdx === 0 ? 'bg-emerald-600' : tIdx === 1 ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        {tIdx === 0 ? 'A' : tIdx === 1 ? 'B' : 'C'}
                      </span>
                      {task.levelName}
                    </span>
                    <span className="text-xs text-slate-500">
                      Критерий: <strong>{task.criteria}</strong>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {task.problems.map((prob, pIdx) => (
                      <div key={pIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="font-bold text-slate-900 text-xs">
                          {pIdx + 1}-есеп: <MathView math={prob.statement} />
                        </div>
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block text-[11px]">Шешу қадамдары:</strong>
                          {prob.stepByStepSolution.map((s, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5 font-mono text-[11px]">
                              <span className="text-blue-600">•</span>
                              <MathView math={s} />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-bold text-emerald-700">
                            Дұрыс жауабы: {prob.answer}
                          </span>
                          <span className="text-slate-600 text-[11px]">
                            Дескриптор: {prob.descriptorText} (<strong>{prob.points} балл</strong>)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLASS 2 TIERED TASKS (A, B, C) */}
        {activeTab === 'class2_tasks' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-indigo-900 text-base">
                  {combinedPlan.class2.grade}-сыныпқа арналған деңгейлік тапсырмалар жинағы
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Тақырып: <strong>{combinedPlan.class2.topic}</strong> ({combinedPlan.class2.objectiveCode})
                </p>
              </div>
              <a
                href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>ЖИ генераторға өту</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {combinedPlan.class2.tasks.map((task, tIdx) => (
                <div key={tIdx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg text-white font-bold flex items-center justify-center text-xs ${
                        tIdx === 0 ? 'bg-emerald-600' : tIdx === 1 ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        {tIdx === 0 ? 'A' : tIdx === 1 ? 'B' : 'C'}
                      </span>
                      {task.levelName}
                    </span>
                    <span className="text-xs text-slate-500">
                      Критерий: <strong>{task.criteria}</strong>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {task.problems.map((prob, pIdx) => (
                      <div key={pIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="font-bold text-slate-900 text-xs">
                          {pIdx + 1}-есеп: <MathView math={prob.statement} />
                        </div>
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block text-[11px]">Шешу қадамдары:</strong>
                          {prob.stepByStepSolution.map((s, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5 font-mono text-[11px]">
                              <span className="text-indigo-600">•</span>
                              <MathView math={s} />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-bold text-emerald-700">
                            Дұрыс жауабы: {prob.answer}
                          </span>
                          <span className="text-slate-600 text-[11px]">
                            Дескриптор: {prob.descriptorText} (<strong>{prob.points} балл</strong>)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANSWER KEYS */}
        {activeTab === 'answer_keys' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h4 className="font-extrabold text-emerald-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Мұғалімге арналған толық шешу кілті мен жауаптары
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                Екі сыныптың да синхронды кестесіндегі және сараланған жұмыс парақтарындағы барлық есептердің шешімдері.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="font-sans text-slate-900 block mb-2 font-bold text-sm">
                  Синхрондалған кесте жауаптары:
                </strong>
                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {combinedPlan.answerKeysCombined}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                  <strong className="font-sans text-blue-900 block mb-2 font-bold">
                    {combinedPlan.class1.grade}-сынып тапсырмаларының кілті:
                  </strong>
                  {combinedPlan.class1.tasks.map((t, idx) => (
                    <div key={idx} className="mb-3">
                      <span className="font-bold text-blue-800">{t.levelName}:</span>
                      {t.problems.map((p, pIdx) => (
                        <div key={pIdx} className="text-[11px] text-slate-700 pl-2">
                          {pIdx + 1}) {p.statement} =&gt; <strong className="text-emerald-700">{p.answer}</strong> ({p.points} балл)
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
                  <strong className="font-sans text-indigo-900 block mb-2 font-bold">
                    {combinedPlan.class2.grade}-сынып тапсырмаларының кілті:
                  </strong>
                  {combinedPlan.class2.tasks.map((t, idx) => (
                    <div key={idx} className="mb-3">
                      <span className="font-bold text-indigo-800">{t.levelName}:</span>
                      {t.problems.map((p, pIdx) => (
                        <div key={pIdx} className="text-[11px] text-slate-700 pl-2">
                          {pIdx + 1}) {p.statement} =&gt; <strong className="text-emerald-700">{p.answer}</strong> ({p.points} балл)
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
