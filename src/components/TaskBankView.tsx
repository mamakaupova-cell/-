/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Filter, Search, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { SubjectType, LanguageType, MathProblem } from '../types/qmzh';
import { MathView } from './MathView';
import { GeometryCanvas } from './GeometryCanvas';
import { 
  getGrade6RationalMultiplicationTasks, 
  getGrade7FactoringPolynomialTasks, 
  getGrade9VectorTasks,
  getGrade5ComparingFractionsTasks 
} from '../utils/mathEngine';

interface TaskBankViewProps {
  language: LanguageType;
}

export const TaskBankView: React.FC<TaskBankViewProps> = ({ language }) => {
  const isKk = language === 'kk';

  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collect tasks from verified modules
  const allTiered = [
    ...getGrade5ComparingFractionsTasks(language).map(t => ({ ...t, subject: 'math', grade: 5, topic: 'Жай бөлшектерді салыстыру' })),
    ...getGrade6RationalMultiplicationTasks(language).map(t => ({ ...t, subject: 'math', grade: 6, topic: 'Рационал сандарды көбейту' })),
    ...getGrade7FactoringPolynomialTasks(language).map(t => ({ ...t, subject: 'algebra', grade: 7, topic: 'Көпмүшені көбейткіштерге жіктеу' })),
    ...getGrade9VectorTasks(language).map(t => ({ ...t, subject: 'geometry', grade: 9, topic: 'Векторларды қолдану' })),
  ];

  const filteredTasks = allTiered.filter(task => {
    if (selectedSubject !== 'all' && task.subject !== selectedSubject) return false;
    if (selectedLevel !== 'all' && task.level !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTopic = task.topic.toLowerCase().includes(q);
      const matchProb = task.problems.some(p => p.statement.toLowerCase().includes(q));
      if (!matchTopic && !matchProb) return false;
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Дидактикалық қор</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isKk ? 'Математикалық тапсырмалар мен дескрипторлар банкі' : 'Банк математических задач и дескрипторов'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {isKk 
            ? '5–11-сыныптар аралығындағы әр тақырыпқа арналған нақты сандық есептер, қадамдық шешулері, жауап кілттері және ресми дескрипторлары бар дайын тапсырмалар жинағы.'
            : 'Каталог выверенных задач с пошаговыми решениями, ответами, чертежами и готовыми критериями оценивания.'}
        </p>

        {/* User AI Platform Link in Task Bank */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              🤖
            </span>
            <div>
              <div className="text-xs font-bold text-blue-900">
                {isKk ? 'Деңгейлік тапсырмалардың ЖИ платформасы (А, В, С)' : 'ИИ платформа дифференцированных заданий (А, В, С)'}
              </div>
              <div className="text-[11px] text-blue-700 font-mono">
                https://differen-git-main-oryngul-kayupova.vercel.app/
              </div>
            </div>
          </div>
          <a
            href="https://differen-git-main-oryngul-kayupova.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>{isKk ? 'Платформаға өту' : 'Перейти на платформу'}</span>
            <span>↗</span>
          </a>
        </div>

        {/* Filters bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={isKk ? 'Тақырып немесе есеп бойынша іздеу...' : 'Поиск по теме или условию...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
            >
              <option value="all">{isKk ? 'Барлық пәндер' : 'Все предметы'}</option>
              <option value="math">Математика</option>
              <option value="algebra">Алгебра</option>
              <option value="geometry">Геометрия</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
            >
              <option value="all">{isKk ? 'Барлық деңгейлер (А, В, С)' : 'Все уровни'}</option>
              <option value="A">А деңгейі</option>
              <option value="B">В деңгейі</option>
              <option value="C">С деңгейі</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        {filteredTasks.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  t.level === 'A' ? 'bg-blue-100 text-blue-800' : t.level === 'B' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {t.level}-деңгей
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.levelName}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t.grade}-сынып • {t.topic}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                Жалпы: {t.totalPoints} балл
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700">
              <strong>Тірек формула / нұсқау: </strong> {t.guidance}
            </div>

            {/* Problems */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.problems.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-sm text-slate-900">
                        <MathView math={p.statement} />
                      </div>
                      <button
                        onClick={() => handleCopy(p.id, p.statement)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600"
                        title="Көшіріп алу"
                      >
                        {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {p.diagram && (
                      <div className="pt-1">
                        <GeometryCanvas diagram={p.diagram} width={280} height={180} />
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 text-xs font-serif space-y-1">
                      <div className="font-sans font-bold text-emerald-800 text-[10px] uppercase">Шешуі мен жауабы:</div>
                      {p.stepByStepSolution.map((s, i) => (
                        <div key={i}>• {s}</div>
                      ))}
                      <div className="font-sans font-bold text-emerald-700 text-xs pt-1">
                        Жауабы: <MathView math={p.answer} />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-700 font-mono pt-1 border-t border-slate-100">
                    Дескриптор: {p.descriptorText} ({p.points} б)
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
