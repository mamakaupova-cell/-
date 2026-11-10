/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  Download, 
  ExternalLink, 
  Copy, 
  Search, 
  Calendar, 
  GraduationCap, 
  FileText 
} from 'lucide-react';
import { QMZhDocument, LanguageType, SubjectType } from '../types/qmzh';
import { exportQMZhToWord } from '../utils/wordExporter';

interface MyPlansViewProps {
  plans: QMZhDocument[];
  onOpenPlan: (plan: QMZhDocument) => void;
  onDeletePlan: (id: string) => void;
  onDuplicatePlan: (plan: QMZhDocument) => void;
  language: LanguageType;
}

export const MyPlansView: React.FC<MyPlansViewProps> = ({
  plans,
  onOpenPlan,
  onDeletePlan,
  onDuplicatePlan,
  language,
}) => {
  const isKk = language === 'kk';

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const filtered = plans.filter(p => {
    if (filterSubject !== 'all' && p.subject !== filterSubject) return false;
    if (filterGrade !== 'all' && String(p.grade) !== filterGrade) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.lessonTopic.toLowerCase().includes(q) ||
        p.learningObjectiveCode.toLowerCase().includes(q) ||
        p.sectionName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <BookmarkCheck className="w-4 h-4" />
          <span>Сақталған құжаттар</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isKk ? 'Менің сабақ жоспарларым (ҚМЖ)' : 'Мои поурочные планы (КСП)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isKk ? `Барлығы: ${plans.length} ҚМЖ сақталған` : `Всего сохранено: ${plans.length} планов`}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={isKk ? 'Тақырып немесе оқу мақсаты бойынша іздеу...' : 'Поиск по теме или коду цели...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
          >
            <option value="all">{isKk ? 'Барлық пәндер' : 'Все предметы'}</option>
            <option value="math">Математика</option>
            <option value="algebra">Алгебра</option>
            <option value="geometry">Геометрия</option>
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
          >
            <option value="all">{isKk ? 'Барлық сыныптар' : 'Все классы'}</option>
            {[5, 6, 7, 8, 9, 10, 11].map(g => (
              <option key={g} value={String(g)}>{g}-сынып</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plan Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">
            {isKk ? 'Әзірге сақталған жоспар жоқ' : 'Нет сохраненных планов'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isKk 
              ? 'ҚМЖ құрастырушы арқылы жаңа сабақ жоспарын жасап, «Сақтау» батырмасын басыңыз.' 
              : 'Создайте КСП в генераторе и нажмите «Сохранить».'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    plan.subject === 'math' ? 'bg-blue-100 text-blue-800' : plan.subject === 'algebra' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {plan.grade}-сынып • {plan.subject.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {plan.date}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 line-clamp-2">
                    {plan.lessonTopic}
                  </h4>
                  <p className="text-xs text-blue-700 font-mono mt-1">
                    {plan.learningObjectiveCode}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {plan.sectionName}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenPlan(plan)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isKk ? 'Ашу' : 'Открыть'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportQMZhToWord(plan)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Word (.docx) жүктеу"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDuplicatePlan(plan)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Көшірмесін жасау"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Жою"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
