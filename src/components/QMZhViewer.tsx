/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Edit3, 
  Check, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Key, 
  FileCheck, 
  Save, 
  Plus, 
  Minus,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { QMZhDocument, TieredTask, MathProblem } from '../types/qmzh';
import { MathView } from './MathView';
import { GeometryCanvas } from './GeometryCanvas';
import { exportQMZhToWord, exportStudentWorksheet } from '../utils/wordExporter';
import { calculateGroupDivision } from '../utils/groupDivision';

interface QMZhViewerProps {
  qmzh: QMZhDocument;
  onUpdateQMZh: (updated: QMZhDocument) => void;
  onSaveToMyPlans: (qmzh: QMZhDocument) => void;
  onRegenerate: () => void;
}

export const QMZhViewer: React.FC<QMZhViewerProps> = ({
  qmzh,
  onUpdateQMZh,
  onSaveToMyPlans,
  onRegenerate,
}) => {
  const isKk = qmzh.language === 'kk';
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'tiered' | 'answers'>('table');
  const [wordExporting, setWordExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable local state
  const [editedPlan, setEditedPlan] = useState<QMZhDocument>(qmzh);
  const groupDiv = calculateGroupDivision(editedPlan.studentsCount || 24, isKk ? 'kk' : 'ru');

  // Sync if outer prop changes
  React.useEffect(() => {
    setEditedPlan(qmzh);
  }, [qmzh]);

  const handleStageEdit = (index: number, field: string, val: any) => {
    const newStages = [...editedPlan.stages];
    newStages[index] = { ...newStages[index], [field]: val };
    const updated = { ...editedPlan, stages: newStages };
    setEditedPlan(updated);
    onUpdateQMZh(updated);
  };

  const handleWordExport = async () => {
    try {
      setWordExporting(true);
      await exportQMZhToWord(editedPlan);
    } catch (e) {
      console.error(e);
    } finally {
      setWordExporting(false);
    }
  };

  const handleWorksheetExport = async () => {
    try {
      setWordExporting(true);
      await exportStudentWorksheet(editedPlan);
    } catch (e) {
      console.error(e);
    } finally {
      setWordExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveToMyPlans(editedPlan);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const totalTime = editedPlan.stages.reduce((acc, s) => acc + (s.timeMinutes || 0), 0);

  // Three desks interactive game state for classroom presentation
  const [deskScores, setDeskScores] = useState({ desk1: 5, desk2: 5, desk3: 5 });

  const subjectLabel = editedPlan.subject === 'math'
    ? (isKk ? 'Математика' : 'Математика')
    : editedPlan.subject === 'algebra'
    ? (isKk ? 'Алгебра' : 'Алгебра')
    : editedPlan.subject === 'geometry'
    ? (isKk ? 'Геометрия' : 'Геометрия')
    : (isKk ? 'Алгебра және анализ бастамалары' : 'Алгебра и начала анализа');

  // Format value highlight helper
  const renderFormattedActionText = (text: string) => {
    return text.split('\n').map((line, lIdx) => {
      const isValueLine = line.includes('Жауапкершілік:') || line.includes('Әділдік:') || line.includes('Құндылық:') || line.includes('Ответственность:') || line.includes('Справедливость:');
      const isHeaderLine = line.startsWith('Теория:') || line.startsWith('Мысал:') || line.startsWith('Есепте:') || line.startsWith('Оқулықпен жұмыс:') || line.startsWith('Жауаптары:') || line.startsWith('Деңгейіне сай');

      if (isValueLine) {
        return (
          <div key={lIdx} className="text-red-700 font-serif italic text-[11px] mt-1.5 font-medium">
            {line}
          </div>
        );
      }
      if (isHeaderLine) {
        return (
          <div key={lIdx} className="font-semibold text-slate-900 mt-1">
            {line}
          </div>
        );
      }
      return <div key={lIdx}>{line}</div>;
    });
  };

  // Helper to render resources with interactive platform link
  const renderResourceCell = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, lIdx) => {
          if (line.includes('differen-git-main-oryngul-kayupova')) {
            return (
              <div key={lIdx} className="space-y-1">
                <div>{line.replace('https://differen-git-main-oryngul-kayupova.vercel.app/', '').replace('https://differen-git-main-oryngul-kayupova.vercel.app', '')}</div>
                <a
                  href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Деңгейлік ЖИ платформасы ↗</span>
                </a>
              </div>
            );
          }
          return <div key={lIdx}>{line}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 print:p-0 print:max-w-none">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-20 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'table'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isKk ? 'Ресми ҚМЖ кестесі (№130)' : 'Официальная таблица КСП'}
          </button>

          <button
            onClick={() => setActiveTab('tiered')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'tiered'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isKk ? 'Деңгейлік есептер (A, B, C)' : 'Уровневые задачи (A, B, C)'}
          </button>

          <button
            onClick={() => setActiveTab('answers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'answers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isKk ? 'Жауап кілті мен шешуі' : 'Ключи ответов'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isEditing ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? (isKk ? 'Өңдеуді аяқтау' : 'Завершить') : (isKk ? 'ҚМЖ өңдеу' : 'Редактировать')}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? (isKk ? 'Сақталды!' : 'Сохранено!') : (isKk ? 'Сақтау' : 'Сохранить')}</span>
          </button>

          <button
            onClick={handleWorksheetExport}
            disabled={wordExporting}
            className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Оқушыға арналған үлестірме парақ (.docx)"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isKk ? 'Үлестірме (Docx)' : 'Раздатка (Docx)'}</span>
          </button>

          <button
            onClick={handleWordExport}
            disabled={wordExporting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{wordExporting ? 'Дайындалуда...' : 'Word (.docx)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Басып шығару / PDF (A4)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification & Time check banner */}
      <div className="print:hidden bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
            ✓
          </div>
          <div>
            <span className="font-bold">Математикалық дұрыстығы тексерілді:</span> {editedPlan.mathVerification.details}
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-emerald-800">
          <Clock className="w-3.5 h-3.5" />
          <span>Сабақ уақыты: {totalTime} / {editedPlan.durationMinutes} мин</span>
        </div>
      </div>

      {/* Official WhatsApp & Order #130 Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header (Matching WhatsApp screenshot #1) */}
        <div className="text-center space-y-1 font-serif">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isKk ? 'Қысқа мерзімді сабақ жоспары' : 'Краткосрочный план урока'} №{editedPlan.lessonNumberTitle || '1'}
          </h1>
          <h2 className="text-lg font-bold text-slate-800">
            {editedPlan.grade} {isKk ? 'сынып' : 'класс'} {subjectLabel}
          </h2>
        </div>

        {/* Approval block */}
        <div className="flex items-center justify-between font-serif text-sm font-bold text-slate-900 pt-1">
          <div>
            {isKk ? 'Бекітемін:' : 'Утверждаю:'} ________________________
          </div>
          <div className="text-xs text-slate-400 font-sans print:hidden">
            ҚР Оқу-ағарту министрлігі №130 бұйрығы
          </div>
        </div>

        {/* Boxed Metadata Table (Exact 7-row Kazakhstan Ministry template) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs font-serif">
            <tbody>
              <tr className="border-b border-black">
                <td className="w-[30%] p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Бөлім:' : 'Раздел:'}
                </td>
                <td className="p-2 text-slate-900 font-semibold">
                  {editedPlan.sectionName}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Педагогтің аты-жөні:' : 'ФИО педагога:'}
                </td>
                <td className="p-2 text-slate-900">
                  {editedPlan.teacherName}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Күні:' : 'Дата:'}
                </td>
                <td className="p-2 text-slate-900">
                  {editedPlan.date}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Сынып:' : 'Класс:'} {editedPlan.grade}
                </td>
                <td className="p-2 text-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>{isKk ? 'Қатысқандар саны:' : 'Присутствуют:'} <strong className="font-bold text-slate-900">{editedPlan.studentsCount}</strong></span>
                    <span>{isKk ? 'Қатыспағандар саны:' : 'Отсутствуют:'} {editedPlan.absentCount}</span>
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                      {isKk ? groupDiv.summaryDistributionKk : groupDiv.summaryDistributionRu}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Сабақтың тақырыбы:' : 'Тема урока:'}
                </td>
                <td className="p-2 font-bold text-blue-900 text-sm">
                  {editedPlan.lessonTopic}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаттары:' : 'Цели обучения по программе:'}
                </td>
                <td className="p-2 text-slate-900">
                  <span className="font-mono font-bold text-blue-700">{editedPlan.learningObjectiveCode}</span> — {editedPlan.learningObjectiveText}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                  {isKk ? 'Сабақтың мақсаты:' : 'Цели урока:'}
                </td>
                <td className="p-2 text-slate-900 whitespace-pre-line leading-relaxed">
                  {editedPlan.lessonGoalsList && editedPlan.lessonGoalsList.length > 0
                    ? editedPlan.lessonGoalsList.map((g, i) => <div key={i}>{g}</div>)
                    : editedPlan.lessonGoal}
                </td>
              </tr>
              {editedPlan.textbookReference && (
                <tr>
                  <td className="p-2 font-bold border-r border-black bg-slate-50/60 text-slate-900">
                    {isKk ? 'Оқулық және баспасы:' : 'Учебник и издательство:'}
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-blue-900">
                        {typeof editedPlan.textbookReference === 'string'
                          ? editedPlan.textbookReference
                          : `${editedPlan.textbookReference.publisher || ''} ${editedPlan.textbookReference.textbookTitle ? `• ${editedPlan.textbookReference.textbookTitle}` : ''}`}
                      </span>
                      {typeof editedPlan.textbookReference !== 'string' && editedPlan.textbookReference.authors && (
                        <span className="text-slate-600">({editedPlan.textbookReference.authors})</span>
                      )}
                      {typeof editedPlan.textbookReference !== 'string' && editedPlan.textbookReference.paragraph && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold">
                          {editedPlan.textbookReference.paragraph}
                        </span>
                      )}
                      {typeof editedPlan.textbookReference !== 'string' && editedPlan.textbookReference.pageNumbers && (
                        <span className="text-slate-600 text-xs">
                          {editedPlan.textbookReference.pageNumbers}
                        </span>
                      )}
                      {typeof editedPlan.textbookReference !== 'string' && editedPlan.textbookReference.exercises && (
                        <span className="text-blue-800 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {isKk ? 'Жаттығулар:' : 'Задания:'} {editedPlan.textbookReference.exercises}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tab 1: The Official 5-Column Table */}
        {activeTab === 'table' && (
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 uppercase font-serif tracking-wide">
                {isKk ? 'Сабақ барысы:' : 'Ход урока:'}
              </h3>
            </div>

            <div className="overflow-x-auto border border-black rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-black text-center font-bold text-slate-900">
                    <th className="p-2.5 border-r border-black w-[14%]">
                      {isKk ? 'Уақыты/ кезеңдері' : 'Время / этап'}
                    </th>
                    <th className="p-2.5 border-r border-black w-[27%]">
                      {isKk ? 'Педагогтің әрекеті' : 'Действия педагога'}
                    </th>
                    <th className="p-2.5 border-r border-black w-[31%]">
                      {isKk ? 'Оқушының әрекеті' : 'Действия ученика'}
                    </th>
                    <th className="p-2.5 border-r border-black w-[14%]">
                      {isKk ? 'Бағалау' : 'Оценивание'}
                    </th>
                    <th className="p-2.5 w-[14%]">
                      {isKk ? 'Ресурстар' : 'Ресурсы'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-serif">
                  {editedPlan.stages.map((stage, idx) => {
                    // Check if this is the middle stage with rich sub-activities
                    if (stage.stageId === 'middle' && stage.subActivities && stage.subActivities.length > 0) {
                      return stage.subActivities.map((sub, sIdx) => (
                        <tr key={sub.id || sIdx} className="align-top hover:bg-slate-50/40">
                          {/* 1. Stage / Time cell */}
                          <td className="p-2.5 border-r border-black font-sans align-top">
                            {sIdx === 0 ? (
                              <div>
                                <div className="font-bold text-slate-900 text-xs">
                                  {stage.stageName}
                                </div>
                                <div className="text-xs font-semibold text-blue-700 font-mono mt-0.5">
                                  {stage.timeMinutes} минут
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 font-medium">
                                {stage.stageName}
                              </div>
                            )}
                          </td>

                          {/* 2. Teacher Action */}
                          <td className="p-2.5 border-r border-black whitespace-pre-line leading-relaxed">
                            <span className="font-bold text-sky-700 text-xs block mb-1">
                              {sub.title}:
                            </span>
                            {renderFormattedActionText(sub.teacherAction)}
                            {sub.type === 'tiered' && (
                              <div className="mt-2">
                                <a
                                  href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] transition-colors"
                                >
                                  <Sparkles className="w-3 h-3 text-indigo-600" />
                                  <span>differen-git-main-oryngul-kayupova.vercel.app ↗</span>
                                </a>
                              </div>
                            )}
                          </td>

                          {/* 3. Student Action & Solutions */}
                          <td className="p-2.5 border-r border-black leading-relaxed space-y-2">
                            {renderFormattedActionText(sub.studentAction)}
                            {sub.type === 'tiered' && (
                              <div className="mt-1.5 p-2 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px] font-sans flex items-center justify-between gap-2">
                                <span className="font-semibold text-blue-900">
                                  {isKk ? 'Оқушылар тапсырманы ЖИ платформасында орындайды' : 'Учащиеся выполняют задания на ИИ платформе'}
                                </span>
                                <a
                                  href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-blue-700 underline hover:text-blue-900 shrink-0"
                                >
                                  {isKk ? 'Өту ↗' : 'Перейти ↗'}
                                </a>
                              </div>
                            )}

                            {/* Special Interactive Widget for Group Game adapted to student count */}
                            {sub.type === 'group_game' && (
                              <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 font-sans shadow-xs space-y-2.5">
                                <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>
                                      {groupDiv.strategy === 'small_class_individual_pair'
                                        ? (isKk ? `Шағын сыныптағы сараланған сайыс (${groupDiv.studentsCount} оқушы)` : `Парный блиц (${groupDiv.studentsCount} уч.)`)
                                        : groupDiv.strategy === 'two_micro_groups'
                                        ? (isKk ? `2 командалық блиц-сайыс (${groupDiv.studentsCount} оқушы: ${groupDiv.groupSizes[0]} + ${groupDiv.groupSizes[1]})` : `Соревнование 2 команд (${groupDiv.studentsCount} уч.)`)
                                        : (isKk ? `«Үш парта» жарыс тақтасы (${groupDiv.studentsCount} оқушы: ${groupDiv.groupSizes.join(' + ')})` : `Игра «Три парты» (${groupDiv.studentsCount} уч.)`)}
                                    </span>
                                  </span>
                                  <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                    ⏱ 00:00
                                  </span>
                                </div>

                                <div className={`grid grid-cols-1 ${groupDiv.strategy === 'three_rows_standard' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2 text-xs`}>
                                  {/* Team 1 / Row 1 / Pair 1 */}
                                  <div className="bg-white p-2.5 rounded-lg border border-red-200 shadow-2xs space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-red-700">
                                      <span>
                                        {groupDiv.strategy === 'small_class_individual_pair' 
                                          ? (isKk ? '1-жұп / 1-оқушы' : '1-я пара / уч.') 
                                          : (isKk ? `1-топ / қатар (${groupDiv.groupSizes[0]} оқушы)` : `1-я группа (${groupDiv.groupSizes[0]} уч.)`)}
                                      </span>
                                      <span className="font-mono bg-red-100 px-1.5 py-0.2 rounded">{deskScores.desk1} б.</span>
                                    </div>
                                    <div className="font-mono text-[11px] text-slate-700 font-semibold">
                                      12 · (-6) = ?
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-[10px] text-emerald-700 font-bold font-mono">Жауап: -72</span>
                                      <button
                                        type="button"
                                        onClick={() => setDeskScores(prev => ({ ...prev, desk1: prev.desk1 + 1 }))}
                                        className="text-[10px] px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
                                      >
                                        +1 балл
                                      </button>
                                    </div>
                                  </div>

                                  {/* Team 2 / Row 2 / Pair 2 */}
                                  <div className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-2xs space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                                      <span>
                                        {groupDiv.strategy === 'small_class_individual_pair' 
                                          ? (isKk ? '2-жұп / 2-оқушы' : '2-я пара / уч.') 
                                          : (isKk ? `2-топ / қатар (${groupDiv.groupSizes[1] || groupDiv.groupSizes[0]} оқушы)` : `2-я группа (${groupDiv.groupSizes[1] || groupDiv.groupSizes[0]} уч.)`)}
                                      </span>
                                      <span className="font-mono bg-blue-100 px-1.5 py-0.2 rounded">{deskScores.desk2} б.</span>
                                    </div>
                                    <div className="font-mono text-[11px] text-slate-700 font-semibold">
                                      (-8) · (-14) = ?
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-[10px] text-emerald-700 font-bold font-mono">Жауап: 112</span>
                                      <button
                                        type="button"
                                        onClick={() => setDeskScores(prev => ({ ...prev, desk2: prev.desk2 + 1 }))}
                                        className="text-[10px] px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                                      >
                                        +1 балл
                                      </button>
                                    </div>
                                  </div>

                                  {/* Team 3 / Row 3 (Only if standard class >= 9 students) */}
                                  {groupDiv.strategy === 'three_rows_standard' && (
                                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700">
                                        <span>3-қатар ({groupDiv.groupSizes[2]} оқушы)</span>
                                        <span className="font-mono bg-emerald-100 px-1.5 py-0.2 rounded">{deskScores.desk3} б.</span>
                                      </div>
                                      <div className="font-mono text-[11px] text-slate-700 font-semibold">
                                        (-16) · 7 = ?
                                      </div>
                                      <div className="flex items-center justify-between pt-1">
                                        <span className="text-[10px] text-emerald-700 font-bold font-mono">Жауап: -112</span>
                                        <button
                                          type="button"
                                          onClick={() => setDeskScores(prev => ({ ...prev, desk3: prev.desk3 + 1 }))}
                                          className="text-[10px] px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                                        >
                                          +1 балл
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Special Visual Illustration for Functional Literacy */}
                            {sub.type === 'functional' && (
                              <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 font-sans space-y-2">
                                <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                                  <span>Көрнекілік модель:</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-2.5 rounded-lg border border-amber-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-10 border-2 border-red-500 rounded bg-red-100 flex items-end justify-center pb-0.5 text-[9px] font-bold text-red-800">
                                      0.4 л
                                    </div>
                                    <div className="w-8 h-10 border-2 border-red-500 rounded bg-red-100 flex items-end justify-center pb-0.5 text-[9px] font-bold text-red-800">
                                      0.4 л
                                    </div>
                                    <div className="w-8 h-10 border-2 border-red-500 rounded bg-red-100 flex items-end justify-center pb-0.5 text-[9px] font-bold text-red-800">
                                      0.4 л
                                    </div>
                                  </div>
                                  <div className="text-[11px] text-slate-700 font-medium">
                                    3 стақан × 0,4 л = <strong className="text-emerald-700 font-mono">1,2 л</strong> шырын
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 4. Assessment */}
                          <td className="p-2.5 border-r border-black whitespace-pre-line leading-relaxed">
                            <span className="font-bold text-sky-700 text-xs block mb-1">
                              {sub.assessment.includes('Дескриптор') ? '' : 'Бағалау:'}
                            </span>
                            {sub.assessment.split('\n').map((l, li) => (
                              <div key={li} className={l.includes('Дескриптор') ? 'font-bold text-sky-700 text-xs' : ''}>
                                {l}
                              </div>
                            ))}
                          </td>

                          {/* 5. Resources */}
                          <td className="p-2.5 whitespace-pre-line leading-relaxed text-slate-700">
                            {renderResourceCell(sub.resources)}
                          </td>
                        </tr>
                      ));
                    }

                    // Default render for Org, Intro, Conclusion stages
                    return (
                      <tr key={stage.stageId || idx} className="align-top hover:bg-slate-50/40">
                        {/* 1. Stage / Time */}
                        <td className="p-2.5 border-r border-black font-sans">
                          <div className="font-bold text-slate-900 text-xs">{stage.stageName}</div>
                          {isEditing ? (
                            <div className="mt-1 flex items-center gap-1">
                              <input
                                type="number"
                                min={1}
                                max={40}
                                value={stage.timeMinutes}
                                onChange={(e) => handleStageEdit(idx, 'timeMinutes', parseInt(e.target.value) || 0)}
                                className="w-14 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-center font-bold"
                              />
                              <span className="text-[11px] text-slate-500">мин</span>
                            </div>
                          ) : (
                            <div className="text-xs font-semibold text-blue-700 font-mono mt-0.5">
                              {stage.timeMinutes} мин
                            </div>
                          )}
                        </td>

                        {/* 2. Teacher Action */}
                        <td className="p-2.5 border-r border-black whitespace-pre-line leading-relaxed">
                          {isEditing ? (
                            <textarea
                              rows={6}
                              value={stage.teacherActions}
                              onChange={(e) => handleStageEdit(idx, 'teacherActions', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
                            />
                          ) : (
                            renderFormattedActionText(stage.teacherActions)
                          )}
                        </td>

                        {/* 3. Student Action */}
                        <td className="p-2.5 border-r border-black leading-relaxed space-y-2">
                          {isEditing ? (
                            <textarea
                              rows={8}
                              value={stage.studentActions}
                              onChange={(e) => handleStageEdit(idx, 'studentActions', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
                            />
                          ) : (
                            renderFormattedActionText(stage.studentActions)
                          )}
                        </td>

                        {/* 4. Assessment */}
                        <td className="p-2.5 border-r border-black whitespace-pre-line leading-relaxed">
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={stage.assessment}
                              onChange={(e) => handleStageEdit(idx, 'assessment', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
                            />
                          ) : (
                            stage.assessment
                          )}
                        </td>

                        {/* 5. Resources */}
                        <td className="p-2.5 whitespace-pre-line leading-relaxed text-slate-700">
                          {isEditing ? (
                            <textarea
                              rows={3}
                              value={stage.resources}
                              onChange={(e) => handleStageEdit(idx, 'resources', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
                            />
                          ) : (
                            renderResourceCell(stage.resources)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Print-Only Appendix with Complete Answer Key & Geometry Diagrams */}
            <div className="print-only page-break-before space-y-4 font-serif">
              <h3 className="text-base font-bold uppercase tracking-wide border-b border-black pb-2">
                {isKk ? 'ҚОСЫМША: МҰҒАЛІМГЕ АРНАЛҒАН ТОЛЫҚ ЖАУАП КІЛТІ МЕН ДЕСКРИПТОРЛАР' : 'ПРИЛОЖЕНИЕ: ПОЛНЫЙ КЛЮЧ ОТВЕТОВ И ДЕСКРИПТОРЫ'}
              </h3>
              <div className="space-y-3">
                {editedPlan.tieredTasks.flatMap(t => t.problems).map((prob, idx) => (
                  <div key={prob.id} className="border border-black p-3 space-y-1.5 avoid-break">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>№{idx + 1} тапсырма: <MathView math={prob.statement} /></span>
                      <span>Жауабы: <MathView math={prob.answer} /></span>
                    </div>
                    {prob.diagram && (
                      <div className="my-2 flex justify-start">
                        <GeometryCanvas diagram={prob.diagram} width={260} height={160} />
                      </div>
                    )}
                    <div className="text-xs space-y-0.5">
                      {prob.stepByStepSolution.map((s, i) => (
                        <div key={i}>• {s}</div>
                      ))}
                    </div>
                    <div className="text-[10pt] italic pt-1 border-t border-slate-300">
                      Дескриптор: {prob.descriptorText} ({prob.points} балл)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tiered Tasks Card View with Geometry SVG diagrams */}
        {activeTab === 'tiered' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isKk ? 'Деңгейлік тапсырмалар (Саралау)' : 'Дифференцированные уровневые задания'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isKk ? 'А деңгейі (қолдау), В деңгейі (стандарт), С деңгейі (жоғары)' : 'Уровни А, В, С с пошаговыми дескрипторами'}
                </p>
              </div>
            </div>

            {/* Direct AI Platform Integration Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {isKk ? 'Деңгейлік тапсырмалар ЖИ платформасы' : 'ИИ платформа дифференцированных заданий'}
                  </span>
                  <span className="text-emerald-300 font-bold text-xs">● Онлайн</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {isKk ? 'Орынгул Каюпованың Деңгейлік ЖИ платформасы' : 'ИИ платформа дифференциации Орынгуль Каюповой'}
                </h4>
                <p className="text-xs text-blue-100 font-mono">
                  https://differen-git-main-oryngul-kayupova.vercel.app/
                </p>
              </div>

              <a
                href="https://differen-git-main-oryngul-kayupova.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto hover:scale-105 active:scale-95"
              >
                <span>{isKk ? 'ЖИ платформаны ашу (А, В, С)' : 'Открыть ИИ платформу (А, В, С)'}</span>
                <span>↗</span>
              </a>
            </div>

            <div className="space-y-6">
              {editedPlan.tieredTasks.map((task) => (
                <div 
                  key={task.level}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        task.level === 'A' ? 'bg-blue-100 text-blue-800' : task.level === 'B' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {task.level}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{task.levelName}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Жалпы: {task.totalPoints} балл
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                    <strong className="text-slate-800 font-sans">Тірек нұсқаулық: </strong>
                    {task.guidance}
                  </div>

                  {/* Concrete Problems */}
                  <div className="space-y-4 pt-1">
                    {task.problems.map((prob, pIndex) => (
                      <div key={prob.id} className="p-4 rounded-xl border border-slate-200/90 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-blue-700 font-mono">
                              Тапсырма {pIndex + 1}:
                            </span>
                            <div className="text-sm font-semibold text-slate-900">
                              <MathView math={prob.statement} />
                            </div>
                            {prob.given && (
                              <p className="text-xs text-slate-600">
                                <strong>Берілгені:</strong> {prob.given}
                              </p>
                            )}
                            {prob.toFind && (
                              <p className="text-xs text-slate-600">
                                <strong>Табу керек:</strong> {prob.toFind}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {prob.points} балл
                          </span>
                        </div>

                        {/* If Geometry Diagram is attached */}
                        {prob.diagram && (
                          <div className="pt-2">
                            <GeometryCanvas diagram={prob.diagram} />
                          </div>
                        )}

                        {/* Step by step solution */}
                        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 space-y-1.5 text-xs text-emerald-950 font-serif">
                          <span className="font-sans font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">
                            Қадамдық шешуі мен жауабы:
                          </span>
                          {prob.stepByStepSolution.map((st, sIdx) => (
                            <div key={sIdx} className="leading-relaxed">
                              {st}
                            </div>
                          ))}
                          <div className="pt-1 font-sans font-bold text-emerald-700 text-xs">
                            Дұрыс жауабы: <MathView math={prob.answer} />
                          </div>
                        </div>

                        {/* Descriptor */}
                        <div className="text-xs text-slate-500 font-mono flex items-center justify-between pt-1">
                          <span>Дескриптор: {prob.descriptorText}</span>
                          <span className="font-bold text-blue-600">[{prob.points} б]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Complete Answer Key */}
        {activeTab === 'answers' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Key className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {isKk ? 'Мұғалімге арналған толық жауап кілті мен бағалау шкаласы' : 'Полный ключ ответов и шкала баллов'}
              </h3>
            </div>

            <div className="space-y-4">
              {editedPlan.tieredTasks.flatMap(t => t.problems).map((prob, idx) => (
                <div key={prob.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Есеп #{idx + 1}: <MathView math={prob.statement} /></span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Жауабы: <MathView math={prob.answer} />
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 font-serif">
                    {prob.stepByStepSolution.map((s, i) => (
                      <div key={i}>• {s}</div>
                    ))}
                  </div>
                  <div className="text-[11px] text-blue-700 font-mono pt-1">
                    Дескриптор: {prob.descriptorText} ({prob.points} балл)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
