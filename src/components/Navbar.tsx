/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Layers, 
  BookmarkCheck, 
  Database, 
  Settings, 
  Home, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { LanguageType } from '../types/qmzh';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  onOpenQuickTest: (testId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  onOpenQuickTest,
}) => {
  const isKk = language === 'kk';

  const navItems = [
    { id: 'home', label: isKk ? 'Басты бет' : 'Главная', icon: Home },
    { id: 'generator', label: isKk ? 'ҚМЖ құрастыру' : 'Конструктор КСП', icon: Sparkles },
    { id: 'combined', label: isKk ? 'Біріктірілген сыныптар' : 'Совмещенные классы', icon: Layers },
    { id: 'taskbank', label: isKk ? 'Тапсырмалар банкі' : 'Банк заданий', icon: Database },
    { id: 'myplans', label: isKk ? 'Менің жоспарларым' : 'Мои планы', icon: BookmarkCheck },
    { id: 'settings', label: isKk ? 'Баптаулар' : 'Настройки', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="font-serif font-bold text-xl italic">∑π</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Math AI-QMZh
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  №130 бұйрық
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isKk ? 'Математика, алгебра, геометрия ҚМЖ' : 'КСП по математике, алгебре, геометрии'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Toggle & Quick Test Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Quick Test Scenarios */}
            <div className="relative group">
              <button 
                type="button" 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100/80 text-purple-700 text-xs font-medium transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isKk ? 'Сынақ сабақтары' : 'Тест-уроки'}</span>
                <span className="sm:hidden">Сынақ</span>
              </button>
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block transition-all z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isKk ? 'Міндетті сынақтар (1-басумен)' : 'Быстрый запуск тестов'}
                </div>
                <button
                  onClick={() => onOpenQuickTest('test1')}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <span className="font-semibold text-blue-600">Сынақ 1:</span> Математика 6-сынып (Рационал сандар)
                </button>
                <button
                  onClick={() => onOpenQuickTest('test2')}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <span className="font-semibold text-indigo-600">Сынақ 2:</span> Алгебра 7-сынып (Көбейткіштерге жіктеу)
                </button>
                <button
                  onClick={() => onOpenQuickTest('test3')}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <span className="font-semibold text-emerald-600">Сынақ 3:</span> Геометрия 9 класс (Векторы, чертеж)
                </button>
                <button
                  onClick={() => onOpenQuickTest('test4')}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <span className="font-semibold text-amber-600">Сынақ 4:</span> Біріктірілген 5–6-сыныптар
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
              <button
                onClick={() => setLanguage('kk')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'kk' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ҚАЗ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'ru' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                РУС
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav pills */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
