/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { QMZhForm } from './components/QMZhForm';
import { QMZhViewer } from './components/QMZhViewer';
import { CombinedClassesView } from './components/CombinedClassesView';
import { TaskBankView } from './components/TaskBankView';
import { MyPlansView } from './components/MyPlansView';
import { SettingsView } from './components/SettingsView';
import { QMZhDocument, LanguageType, SubjectType } from './types/qmzh';
import { generateOfflineQMZh } from './utils/fallbackGenerator';
import { TEST_PRESETS } from './data/curriculumData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageType>('kk');
  const [loading, setLoading] = useState(false);

  // Active QMZh Document currently generated or being viewed
  const [activeQMZh, setActiveQMZh] = useState<QMZhDocument | null>(null);

  // Pre-configured subject or grade when entering generator from subject cards
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('math');
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  // Persisted plans in localStorage
  const [savedPlans, setSavedPlans] = useState<QMZhDocument[]>(() => {
    try {
      const data = localStorage.getItem('math_qmzh_saved_plans');
      if (data) return JSON.parse(data);
    } catch {}
    // Seed initial demo plans
    const initialTest1 = generateOfflineQMZh({
      subject: 'math',
      grade: 6,
      lessonTopic: 'Рационал сандарды көбейту',
      learningObjectiveCode: '6.1.2.15',
      language: 'kk',
    });
    return [initialTest1];
  });

  // Keep localStorage synced
  useEffect(() => {
    try {
      localStorage.setItem('math_qmzh_saved_plans', JSON.stringify(savedPlans));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [savedPlans]);

  // Handle generating plan via server API or fallback
  const handleGenerateQMZh = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-qmzh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.qmzh) {
          setActiveQMZh(data.qmzh);
          return;
        }
      }
      // If server or network fails, use high-quality deterministic offline generator
      const offline = generateOfflineQMZh(formData);
      setActiveQMZh(offline);
    } catch (err) {
      console.warn('API error, using offline generator:', err);
      const offline = generateOfflineQMZh(formData);
      setActiveQMZh(offline);
    } finally {
      setLoading(false);
    }
  };

  // Launch pre-configured test scenarios (Tests 1, 2, 3, 4)
  const handleLaunchTest = (testId: string) => {
    if (testId === 'test4') {
      setCurrentTab('combined');
      return;
    }

    const preset = TEST_PRESETS.find(p => p.id === testId);
    if (!preset) return;

    setLanguage(preset.language);
    const plan = generateOfflineQMZh({
      subject: preset.subject,
      grade: preset.grade,
      lessonTopic: preset.language === 'kk' ? preset.topicKk : preset.topicRu,
      learningObjectiveCode: preset.code,
      learningObjectiveText: preset.language === 'kk' ? preset.objectiveTextKk : preset.objectiveTextRu,
      durationMinutes: preset.duration,
      language: preset.language,
    });

    setActiveQMZh(plan);
    setCurrentTab('generator');
  };

  // Select subject card from home
  const handleSelectSubjectFromHome = (subj: SubjectType, grade: number = 6) => {
    setSelectedSubject(subj);
    setSelectedGrade(grade);
    setActiveQMZh(null); // Open form
    setCurrentTab('generator');
  };

  // Save plan to MyPlans
  const handleSavePlan = (plan: QMZhDocument) => {
    setSavedPlans(prev => {
      const exists = prev.findIndex(p => p.id === plan.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = plan;
        return copy;
      }
      return [plan, ...prev];
    });
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicatePlan = (plan: QMZhDocument) => {
    const copy: QMZhDocument = {
      ...plan,
      id: `qmzh-${Date.now()}`,
      lessonTopic: `${plan.lessonTopic} (Көшірме)`,
      createdAt: new Date().toISOString(),
    };
    setSavedPlans(prev => [copy, ...prev]);
  };

  const handleOpenPlan = (plan: QMZhDocument) => {
    setActiveQMZh(plan);
    setLanguage(plan.language);
    setCurrentTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'generator' && !activeQMZh) {
            // keep form open
          }
        }}
        language={language}
        setLanguage={setLanguage}
        onOpenQuickTest={handleLaunchTest}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HeroHome
            language={language}
            onSelectSubject={handleSelectSubjectFromHome}
            onStartCombined={() => setCurrentTab('combined')}
            onRunTest={handleLaunchTest}
          />
        )}

        {currentTab === 'generator' && (
          <div>
            {activeQMZh ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 print:hidden">
                  <button
                    onClick={() => setActiveQMZh(null)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                  >
                    ← {language === 'kk' ? 'Жаңа ҚМЖ баптауларына оралу' : 'Вернуться к форме параметров'}
                  </button>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    №130 Бұйрық форматы
                  </span>
                </div>

                <QMZhViewer
                  qmzh={activeQMZh}
                  onUpdateQMZh={setActiveQMZh}
                  onSaveToMyPlans={handleSavePlan}
                  onRegenerate={() => handleLaunchTest('test1')}
                />
              </div>
            ) : (
              <QMZhForm
                language={language}
                onLanguageChange={setLanguage}
                initialSubject={selectedSubject}
                initialGrade={selectedGrade}
                initialTopic={selectedTopic}
                onGenerate={handleGenerateQMZh}
                loading={loading}
              />
            )}
          </div>
        )}

        {currentTab === 'combined' && (
          <CombinedClassesView language={language} />
        )}

        {currentTab === 'taskbank' && (
          <TaskBankView language={language} />
        )}

        {currentTab === 'myplans' && (
          <MyPlansView
            plans={savedPlans}
            onOpenPlan={handleOpenPlan}
            onDeletePlan={handleDeletePlan}
            onDuplicatePlan={handleDuplicatePlan}
            language={language}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-800">Math AI-QMZh</span>
            <span>—</span>
            <span>Қазақстан Республикасы Оқу-ағарту министрлігі №130 бұйрығы</span>
          </div>
          <div>
            <span>2026–2027 оқу жылы • Математика, Алгебра, Геометрия</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
