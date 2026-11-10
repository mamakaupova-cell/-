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
  ChevronDown
} from 'lucide-react';
import { 
  SubjectType, 
  LanguageType, 
  LessonType, 
  WorkForm, 
  TaskType, 
  AssessmentMethod, 
  AdalAzamatValue,
  QMZhDocument
} from '../types/qmzh';
import { CURRICULUM_OBJECTIVES, ADAL_AZAMAT_VALUES_INFO } from '../data/curriculumData';

interface QMZhFormProps {
  language: LanguageType;
  initialSubject?: SubjectType;
  initialGrade?: number;
  initialTopic?: string;
  onGenerate: (formData: any) => Promise<void>;
  loading: boolean;
}

export const QMZhForm: React.FC<QMZhFormProps> = ({
  language,
  initialSubject = 'math',
  initialGrade = 6,
  initialTopic = '',
  onGenerate,
  loading,
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
  const [sectionName, setSectionName] = useState<string>('Рационал сандарға амалдар қолдану');
  const [lessonTopic, setLessonTopic] = useState<string>(initialTopic || (isKk ? 'Рационал сандарды көбейту' : 'Умножение рациональных чисел'));
  const [learningObjectiveCode, setLearningObjectiveCode] = useState<string>('6.1.2.15');
  const [learningObjectiveText, setLearningObjectiveText] = useState<string>(
    isKk ? 'Рационал сандарды көбейту ережелерін қолданып есептер шығару' : 'Применять правила умножения рациональных чисел'
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [lessonType, setLessonType] = useState<LessonType>('new');
  const [taskCount, setTaskCount] = useState<number>(4);

  // Multi-selects
  const [workForms, setWorkForms] = useState<WorkForm[]>(['individual', 'pair', 'guided']);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(['tiered', 'logic', 'ai_analysis']);
  const [assessmentMethods, setAssessmentMethods] = useState<AssessmentMethod[]>(['descriptor', 'self', 'peer']);
  const [selectedValues, setSelectedValues] = useState<AdalAzamatValue[]>(['diligence', 'justice', 'unity']);

  // Available grade options based on subject
  const gradeOptions = subject === 'math' 
    ? [5, 6] 
    : subject === 'algebra' 
    ? [7, 8, 9, 10, 11] 
    : subject === 'geometry' 
    ? [7, 8, 9, 10, 11] 
    : [10, 11];

  // Auto-fill suggested curriculum objectives when subject/grade changes
  useEffect(() => {
    const matched = CURRICULUM_OBJECTIVES.filter(o => o.subject === subject && o.grade === grade);
    if (matched.length > 0) {
      const first = matched[0];
      setSectionName(isKk ? first.sectionKk : first.sectionRu);
      setLessonTopic(isKk ? first.topicKk : first.topicRu);
      setLearningObjectiveCode(first.code);
      setLearningObjectiveText(isKk ? first.textKk : first.textRu);
    }
  }, [subject, grade, isKk]);

  const handleObjectiveSelect = (code: string) => {
    const obj = CURRICULUM_OBJECTIVES.find(o => o.code === code);
    if (obj) {
      setLearningObjectiveCode(obj.code);
      setLearningObjectiveText(isKk ? obj.textKk : obj.textRu);
      setLessonTopic(isKk ? obj.topicKk : obj.topicRu);
      setSectionName(isKk ? obj.sectionKk : obj.sectionRu);
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
      durationMinutes,
      lessonType,
      taskCount,
      workForms,
      taskTypes,
      assessmentMethods,
      adalAzamatValues: selectedValues,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Form Title */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>№130 Бұйрық сәйкестігімен</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isKk ? 'ҚМЖ құрастыру конструкторы' : 'Конструктор Краткосрочного плана (КСП)'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isKk ? 'Төмендегі ресми өрістерді толтырыңыз немесе дайын стандарттан таңдаңыз.' : 'Заполните обязательные поля для составления официального КСП.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Official Organization & Teacher Meta */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>1. Ұйым және оқытушы мәліметтері</span>
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
                  {isKk ? 'Мұғалімнің аты-жөні *' : 'ФИО педагога *'}
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Ахметова А. Б."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* 2. Subject, Grade, Date, Duration */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>2. Пән, сынып және сабақ уақыты</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Пән *' : 'Предмет *'}
                </label>
                <select
                  value={subject}
                  onChange={(e) => {
                    const s = e.target.value as SubjectType;
                    setSubject(s);
                    if (s === 'math') setGrade(6);
                    else if (s === 'algebra') setGrade(7);
                    else if (s === 'geometry') setGrade(9);
                    else if (s === 'analysis') setGrade(10);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm bg-white outline-none"
                >
                  <option value="math">Математика (5–6)</option>
                  <option value="algebra">Алгебра (7–9, 10–11)</option>
                  <option value="geometry">Геометрия (7–11)</option>
                  <option value="analysis">Алгебра және анализ (10–11)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Сынып *' : 'Класс *'}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm bg-white outline-none"
                >
                  {gradeOptions.map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Оқушылар саны (қатысушылар)' : 'Количество учащихся'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={studentsCount}
                  onChange={(e) => setStudentsCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Қатыспағандар саны' : 'Отсутствующие'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={studentsCount}
                  value={absentCount}
                  onChange={(e) => setAbsentCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Section, Topic, Learning Objective */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>3. Тақырып және оқу мақсаттары</span>
            </h3>

            {/* Quick preset selector for standard Kazakhstan curriculum */}
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>{isKk ? '2026–2027 Бағдарламалық оқу мақсаттарынан таңдау:' : 'Выбрать из утвержденных целей:'}</span>
                <span className="text-[11px] text-blue-600 font-mono">ҚР Үлгілік жоспары</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CURRICULUM_OBJECTIVES.filter(o => o.subject === subject && o.grade === grade).map(obj => (
                  <button
                    key={obj.code}
                    type="button"
                    onClick={() => handleObjectiveSelect(obj.code)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                      learningObjectiveCode === obj.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-bold">{obj.code}</span> — {isKk ? obj.topicKk : obj.topicRu}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Бөлім (тарау) атауы *' : 'Раздел *'}
                </label>
                <input
                  type="text"
                  required
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Сабақтың тақырыбы *' : 'Тема урока *'}
                </label>
                <input
                  type="text"
                  required
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Оқу мақсаты коды *' : 'Код цели *'}
                </label>
                <input
                  type="text"
                  required
                  value={learningObjectiveCode}
                  onChange={(e) => setLearningObjectiveCode(e.target.value)}
                  placeholder="6.1.2.15"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаты (толық мәтіні) *' : 'Текст цели обучения *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={learningObjectiveText}
                  onChange={(e) => setLearningObjectiveText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Сабақтың түрі *' : 'Тип урока *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'new', label: 'Жаңа тақырып' },
                  { id: 'reinforce', label: 'Бекіту сабағы' },
                  { id: 'revision', label: 'Қайталау' },
                  { id: 'practical', label: 'Практикалық' },
                  { id: 'research', label: 'Зерттеу сабағы' },
                  { id: 'bjb', label: 'БЖБ сабағы' },
                  { id: 'tjb', label: 'ТЖБ сабағы' },
                ].map(lt => (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() => setLessonType(lt.id as LessonType)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between ${
                      lessonType === lt.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
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

          {/* 4. Pedagogical Forms & Task Types */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>4. Жұмыс формалары мен тапсырма түрлері</span>
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
                  { id: 'tiered', label: 'Деңгейлік тапсырма (А, В, С)' },
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

          {/* 5. «Адал азамат» Values */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>5. «Адал азамат» тәрбие бағдарламасының құндылықтары</span>
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
