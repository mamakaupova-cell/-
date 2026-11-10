/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Calculator, 
  Variable, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { LanguageType, SubjectType } from '../types/qmzh';

interface HeroHomeProps {
  language: LanguageType;
  onSelectSubject: (subject: SubjectType, grade?: number) => void;
  onStartCombined: () => void;
  onRunTest: (testId: string) => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  language,
  onSelectSubject,
  onStartCombined,
  onRunTest,
}) => {
  const isKk = language === 'kk';

  const subjectCards = [
    {
      id: 'math' as SubjectType,
      titleKk: 'Математика',
      titleRu: 'Математика',
      grades: '5–6 сыныптар',
      descKk: 'Жай және ондық бөлшектер, рационал сандар, пайыз, пропорция, қарапайым теңдеулер мен мәтіндік есептер.',
      descRu: 'Обыкновенные и десятичные дроби, рациональные числа, проценты, пропорции, базовые уравнения.',
      icon: Calculator,
      gradient: 'from-blue-600 to-cyan-500',
      badgeBg: 'bg-blue-100 text-blue-800',
      defaultGrade: 6,
      popularTopicsKk: ['Рационал сандарды көбейту', 'Жай бөлшектерді салыстыру', 'Пропорция'],
      popularTopicsRu: ['Умножение рациональных чисел', 'Сравнение обыкновенных дробей', 'Пропорция'],
      formula: '(-a) \\times b = -(ab)',
    },
    {
      id: 'algebra' as SubjectType,
      titleKk: 'Алгебра',
      titleRu: 'Алгебра',
      grades: '7–9, 10–11 сыныптар',
      descKk: 'Көпмүшелерді көбейткіштерге жіктеу, қысқаша көбейту формулалары, функциялар мен графиктер, квадрат теңдеулер, анализ.',
      descRu: 'Разложение на множители, формулы сокращенного умножения, функции и графики, квадратные уравнения.',
      icon: Variable,
      gradient: 'from-indigo-600 to-purple-600',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      defaultGrade: 7,
      popularTopicsKk: ['Көпмүшені көбейткіштерге жіктеу', 'Квадрат теңдеулер', 'Арифметикалық прогрессия'],
      popularTopicsRu: ['Разложение многочлена на множители', 'Квадратные уравнения', 'Прогрессии'],
      formula: 'a^2 - b^2 = (a-b)(a+b)',
    },
    {
      id: 'geometry' as SubjectType,
      titleKk: 'Геометрия',
      titleRu: 'Геометрия',
      grades: '7–11 сыныптар',
      descKk: 'Векторлар, үшбұрыштар мен төртбұрыштар, Пифагор теоремасы, автоматты векторлық сызбалар мен қадамдық дәлелдеулер.',
      descRu: 'Векторы, треугольники, теорема Пифагора, векторные чертежи, доказательства геометрических теорем.',
      icon: Compass,
      gradient: 'from-emerald-600 to-teal-500',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      defaultGrade: 9,
      popularTopicsKk: ['Векторларды есептерге қолдану', 'Пифагор теоремасы', 'Үшбұрыштар теңдігі'],
      popularTopicsRu: ['Применение векторов к решению задач', 'Теорема Пифагора', 'Признаки равенства'],
      formula: '\\vec{c} = \\vec{a} + \\vec{b}',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner with Soft Math Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-xl shadow-blue-900/10">
        {/* Subtle decorative math backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden font-serif">
          <span className="absolute top-4 left-8 text-7xl font-bold">∫</span>
          <span className="absolute top-12 right-24 text-6xl">∑</span>
          <span className="absolute bottom-8 left-1/3 text-6xl">√x²+y²</span>
          <span className="absolute top-1/2 right-12 text-7xl">π</span>
          <span className="absolute bottom-4 right-1/4 text-5xl">f(x)</span>
        </div>

        <div className="relative max-w-3xl z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-cyan-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026–2027 оқу жылы • ҚР Оқу-ағарту министрлігі №130 бұйрығы</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Math AI-QMZh
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-blue-100 leading-relaxed">
            «{isKk ? 'Математика сабағыңызды кәсіби деңгейде жоспарлаңыз!' : 'Планируйте уроки математики на профессиональном уровне!'}»
          </p>

          <p className="text-sm sm:text-base text-blue-200/90 leading-relaxed">
            {isKk 
              ? 'Жай бос шаблондар емес — нақты сандық есептері, дескрипторлары мен баллдары, автоматты векторлық сызбалары және ресми бес бағанды Word кестесі бар кәсіби ҚМЖ генераторы.'
              : 'Не просто пустые шаблоны — профессиональный конструктор с реальными математическими задачами, пошаговыми решениями, дескрипторами и чертежами по приказу №130.'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectSubject('math', 6)}
              className="px-6 py-3 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-semibold text-sm shadow-lg shadow-black/10 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{isKk ? 'ҚМЖ құрастыруды бастау' : 'Создать КСП'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartCombined}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/20 flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>{isKk ? 'Біріктірілген сыныптар' : 'Малокомплектная школа'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Main Subject Cards */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isKk ? 'Пәнді таңдаңыз' : 'Выберите предмет'}
            </h2>
            <p className="text-sm text-slate-500">
              {isKk ? 'Әр пәнге арнайы бейімделген дидактикалық және есептік база' : 'Специализированная дидактическая база для каждого предмета'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjectCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectSubject(card.id, card.defaultGrade)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${card.badgeBg}`}>
                      {card.grades}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {isKk ? card.titleKk : card.titleRu}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {isKk ? card.descKk : card.descRu}
                    </p>
                  </div>

                  {/* Math formula accent */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs text-slate-700 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-sans">Үлгі:</span>
                    <span className="font-semibold text-blue-800">{card.formula}</span>
                  </div>

                  {/* Popular topics */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {isKk ? 'Негізгі тақырыптар:' : 'Ключевые темы:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isKk ? card.popularTopicsKk : card.popularTopicsRu).map((top, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>{isKk ? 'ҚМЖ жасау' : 'Перейти к планированию'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Mandatory Verification Scenarios */}
      <section className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/40 rounded-2xl border border-blue-100 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {isKk ? 'Міндетті сынақ сабақтары (1-басумен дайын ҚМЖ)' : 'Обязательные тестовые уроки'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isKk ? 'Тапсырыс талаптарына толық сәйкес дайын сынақ сабақтарын тексеріңіз:' : 'Проверьте функционал платформы на утвержденных тестовых сценариях:'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Test 1 */}
          <div 
            onClick={() => onRunTest('test1')}
            className="p-4 rounded-xl bg-white border border-blue-200/80 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">Сынақ 1</span>
                <span className="text-[10px] text-slate-400">45 мин • Қаз</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Математика, 6-сынып</h4>
              <p className="text-xs text-blue-700 font-medium">Рационал сандарды көбейту</p>
              <p className="text-[11px] text-slate-500 mt-1">
                4 деңгейлік тапсырма, дескрипторлар, өзін-өзі бағалау парағы.
              </p>
            </div>
            <button className="w-full mt-2 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              ҚМЖ ашу →
            </button>
          </div>

          {/* Test 2 */}
          <div 
            onClick={() => onRunTest('test2')}
            className="p-4 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Сынақ 2</span>
                <span className="text-[10px] text-slate-400">45 мин • Қаз</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Алгебра, 7-сынып</h4>
              <p className="text-xs text-indigo-700 font-medium">Көпмүшені көбейткіштерге жіктеу</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Жеке және жұптық жұмыс, 3 деңгейлік тапсырма, топтау тәсілі.
              </p>
            </div>
            <button className="w-full mt-2 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              ҚМЖ ашу →
            </button>
          </div>

          {/* Test 3 */}
          <div 
            onClick={() => onRunTest('test3')}
            className="p-4 rounded-xl bg-white border border-emerald-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Сынақ 3</span>
                <span className="text-[10px] text-slate-400">45 мин • Рус</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Геометрия, 9 класс</h4>
              <p className="text-xs text-emerald-700 font-medium">Применение векторов</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Векторные чертежи, доказательства, средняя линия треугольника.
              </p>
            </div>
            <button className="w-full mt-2 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              Открыть КСП →
            </button>
          </div>

          {/* Test 4 */}
          <div 
            onClick={() => onRunTest('test4')}
            className="p-4 rounded-xl bg-white border border-amber-200/80 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Сынақ 4</span>
                <span className="text-[10px] text-slate-400">Шағын жинақты</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Біріктірілген 5–6-сынып</h4>
              <p className="text-xs text-amber-700 font-medium">5-сынып + 6-сынып</p>
              <p className="text-[11px] text-slate-500 mt-1">
                1 мұғалім, уақытты үйлестіру: түсіндіру ↔ өздік жұмыс алмасуы.
              </p>
            </div>
            <button className="w-full mt-2 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              Жоспарды ашу →
            </button>
          </div>
        </div>
      </section>

      {/* Highlights & Order 130 Compliance Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">№130 бұйрық нысаны</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Бес бағанды ресми кесте, дәл уақыт бөлу (басы, ортасы, соңы = 45 мин).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Нақты есептер мен шешу жолы</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Қадамдық шешуі, жауабы, әр қадамға дескриптор мен балл.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">«Адал азамат» құндылықтары</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ынтымақтастық, академиялық адалдық, еңбекқорлық тәрбиелік аспектісі.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Word (.docx) толық экспорт</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Times New Roman, 12pt, кесте жиектері бұзылмайтын ресми баспаға дайын құжат.
          </p>
        </div>
      </section>
    </div>
  );
};
