/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, Check, School, UserCheck, ShieldCheck, Info } from 'lucide-react';
import { LanguageType } from '../types/qmzh';

interface SettingsViewProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ language, setLanguage }) => {
  const isKk = language === 'kk';

  const [defaultSchool, setDefaultSchool] = useState(
    localStorage.getItem('math_qmzh_default_school') || '№48 жалпы орта білім беретін мектеп'
  );
  const [defaultTeacher, setDefaultTeacher] = useState(
    localStorage.getItem('math_qmzh_default_teacher') || 'Ахметова А. Б.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('math_qmzh_default_school', defaultSchool);
    localStorage.setItem('math_qmzh_default_teacher', defaultTeacher);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Жеке баптаулар</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isKk ? 'Мұғалімнің жеке деректері мен баптаулары' : 'Настройки учителя и школы'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKk ? 'Бұл деректер әр жаңа ҚМЖ құрастырғанда автоматты түрде қойылады.' : 'Эти данные будут автоматически подставляться в новые КСП.'}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <School className="w-4 h-4 text-slate-500" />
                <span>{isKk ? 'Әдепкі білім беру ұйымының атауы:' : 'Школа по умолчанию:'}</span>
              </label>
              <input
                type="text"
                value={defaultSchool}
                onChange={(e) => setDefaultSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>{isKk ? 'Әдепкі мұғалімнің аты-жөні:' : 'ФИО учителя по умолчанию:'}</span>
              </label>
              <input
                type="text"
                value={defaultTeacher}
                onChange={(e) => setDefaultTeacher(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKk ? 'Негізгі интерфейс тілі:' : 'Язык интерфейса:'}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('kk')}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold ${
                    language === 'kk' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Қазақ тілі (Қаз)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ru')}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold ${
                    language === 'ru' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Русский язык (Рус)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-colors"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? (isKk ? 'Сақталды!' : 'Сохранено!') : (isKk ? 'Баптауларды сақтау' : 'Сохранить настройки')}</span>
            </button>
          </div>
        </form>

        {/* Regulatory note */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Нормативтік-құқықтық негіздеме</span>
          </div>
          <p className="leading-relaxed">
            Платформа Қазақстан Республикасы Оқу-ағарту министрлігінің №130 бұйрығымен бекітілген Сабақ жоспарының ресми үлгісіне толық сәйкес келеді. 2026–2027 оқу жылының типтік оқу бағдарламалары және «Адал азамат» тұжырымдамасы ескерілген.
          </p>
        </div>
      </div>
    </div>
  );
};
