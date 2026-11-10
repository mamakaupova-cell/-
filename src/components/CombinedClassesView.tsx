/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  Download, 
  Printer, 
  Sparkles, 
  ArrowRightLeft, 
  Users, 
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { CombinedQMZhDocument, LanguageType } from '../types/qmzh';
import { generateOfflineCombinedQMZh } from '../utils/fallbackGenerator';
import { exportCombinedQMZhToWord } from '../utils/wordExporter';
import { MathView } from './MathView';

interface CombinedClassesViewProps {
  language: LanguageType;
}

export const CombinedClassesView: React.FC<CombinedClassesViewProps> = ({ language }) => {
  const isKk = language === 'kk';

  const [class1Grade, setClass1Grade] = useState<number>(5);
  const [class1Count, setClass1Count] = useState<number>(3);
  const [class2Grade, setClass2Grade] = useState<number>(6);
  const [class2Count, setClass2Count] = useState<number>(4);
  const [isExporting, setIsExporting] = useState(false);

  const [combinedPlan, setCombinedPlan] = useState<CombinedQMZhDocument>(() =>
    generateOfflineCombinedQMZh({ language })
  );

  const handleGenerate = () => {
    const plan = generateOfflineCombinedQMZh({
      language,
      class1: {
        grade: class1Grade,
        studentsCount: class1Count,
        subject: 'math',
        topic: class1Grade === 5 ? 'Жай бөлшектерді салыстыру' : 'Рационал сандар',
        objectiveCode: class1Grade === 5 ? '5.1.2.16' : '6.1.2.15',
        objectiveText: 'Бөлімдері бірдей немесе алымдары бірдей жай бөлшектерді салыстыру',
        lessonGoal: 'Бөлшектерді салыстыруды үйрену',
        tasks: [],
      },
      class2: {
        grade: class2Grade,
        studentsCount: class2Count,
        subject: 'math',
        topic: class2Grade === 6 ? 'Рационал сандарды көбейту' : 'Көпмүшелер',
        objectiveCode: class2Grade === 6 ? '6.1.2.15' : '7.2.1.8',
        objectiveText: 'Рационал сандарды көбейту ережелерін қолданып есептер шығару',
        lessonGoal: 'Таңбалар ережесін қолданып көбейтуді меңгеру',
        tasks: [],
      },
    });
    setCombinedPlan(plan);
  };

  const handleWordExport = async () => {
    try {
      setIsExporting(true);
      await exportCombinedQMZhToWord(combinedPlan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Intro header */}
      <div className="print:hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Шағын жинақты мектептер режимі</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isKk ? 'Біріктірілген сыныптар ҚМЖ генераторы' : 'КСП для совмещенных (комплект-классов)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {isKk
            ? 'Бір оқу кабинетінде бір мезгілде өткізілетін екі немесе үш сынып (мысалы, 5 және 6-сынып) үшін 45 минуттық синхрондалған ортақ ҚМЖ. Мұғалімнің түсіндіру уақыты мен оқушылардың өздік жұмысы нақты уақыт бойынша кезектеседі.'
            : 'Синхронизированный 45-минутный план для малокомплектных классов (5+6, 6+7 классы). Чередование прямой работы учителя и самостоятельной работы учащихся.'}
        </p>
      </div>

      {/* Combined Class Selector Panel */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {isKk ? 'Сыныптар мен оқушылар санын баптау' : 'Настройка классов и количества учеников'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class 1 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              1-сынып (Блок А)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Сынып:</label>
                <select 
                  value={class1Grade} 
                  onChange={(e) => setClass1Grade(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value={5}>5-сынып</option>
                  <option value={6}>6-сынып</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Оқушы саны:</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={class1Count}
                  onChange={(e) => setClass1Count(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Тақырып: <strong className="text-slate-800">Жай бөлшектерді салыстыру</strong> (5.1.2.16)
            </p>
          </div>

          {/* Class 2 */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              2-сынып (Блок Б)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Сынып:</label>
                <select 
                  value={class2Grade} 
                  onChange={(e) => setClass2Grade(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value={6}>6-сынып</option>
                  <option value={7}>7-сынып</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Оқушы саны:</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={class2Count}
                  onChange={(e) => setClass2Count(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Тақырып: <strong className="text-slate-800">Рационал сандарды көбейту</strong> (6.1.2.15)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Оқушы санына қарай оңтайлы жұмыс түрі (жеке немесе жұптық) автоматты бейімделеді.</span>
          </div>

          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Қайта синхрондау</span>
          </button>
        </div>
      </div>

      {/* Synchronized Lesson Plan Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Синхрондалған сабақ кестесі
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {combinedPlan.class1.grade}-сынып және {combinedPlan.class2.grade}-сынып бірлескен ҚМЖ
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWordExport}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Жүктелуде...' : 'Word (.docx) жүктеу'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Басып шығару"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-block Alternating Schedule Table */}
        <div className="overflow-x-auto border border-black/80 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-black/80 font-bold text-slate-900 text-center">
                <th className="p-3 border-r border-black/80 w-[12%]">Кезең / Уақыт</th>
                <th className="p-3 border-r border-black/80 w-[24%]">Мұғалімнің үйлестіруі (Мұғалім әрекеті)</th>
                <th className="p-3 border-r border-black/80 w-[28%] bg-blue-50/50">
                  {combinedPlan.class1.grade}-сынып оқушыларының әрекеті ({combinedPlan.class1.studentsCount} оқушы)
                </th>
                <th className="p-3 border-r border-black/80 w-[28%] bg-indigo-50/50">
                  {combinedPlan.class2.grade}-сынып оқушыларының әрекеті ({combinedPlan.class2.studentsCount} оқушы)
                </th>
                <th className="p-3 w-[8%]">Ресурстар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/80 font-serif">
              {combinedPlan.stages.map((st, i) => (
                <tr key={i} className="align-top hover:bg-slate-50/40">
                  <td className="p-3 border-r border-black/80 font-sans">
                    <span className="font-bold text-slate-900">{st.stageName}</span>
                    <div className="text-xs font-semibold text-blue-700 font-mono mt-0.5">
                      ({st.timeMinutes} мин)
                    </div>
                  </td>

                  <td className="p-3 border-r border-black/80 whitespace-pre-line leading-relaxed">
                    <div className="p-1.5 rounded bg-amber-50 text-amber-900 text-[11px] font-sans font-semibold mb-2">
                      {st.coordinationPrinciple}
                    </div>
                    {st.teacherActionCombined}
                  </td>

                  <td className="p-3 border-r border-black/80 whitespace-pre-line leading-relaxed bg-blue-50/20">
                    <div>{st.class1StudentAction}</div>
                    <div className="mt-2 text-[11px] font-sans text-blue-800 font-semibold border-t border-blue-100 pt-1">
                      Бағалау: {st.class1Assessment}
                    </div>
                  </td>

                  <td className="p-3 border-r border-black/80 whitespace-pre-line leading-relaxed bg-indigo-50/20">
                    <div>{st.class2StudentAction}</div>
                    <div className="mt-2 text-[11px] font-sans text-indigo-800 font-semibold border-t border-indigo-100 pt-1">
                      Бағалау: {st.class2Assessment}
                    </div>
                  </td>

                  <td className="p-3 whitespace-pre-line text-slate-600 text-[11px]">
                    {st.resources}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
