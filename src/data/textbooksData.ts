/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TextbookCatalogItem } from '../types/qmzh';

export const OFFICIAL_KAZAKHSTAN_TEXTBOOKS: TextbookCatalogItem[] = [
  // 5-СЫНЫП МАТЕМАТИКА (ҚАЗАҚША)
  {
    id: 'math-5-atamura-kk',
    title: 'Математика. 5-сынып. 1, 2-бөлім',
    subject: 'math',
    grade: 5,
    publisher: 'Атамұра',
    authors: 'Т. Алдамұратова, Қ. Байшоланов, Е. Байшоланов',
    year: 2024,
    language: 'kk',
    chapters: [
      {
        name: '1-тарау. Жай бөлшектер',
        paragraphs: [
          {
            number: '§ 21',
            title: 'Жай бөлшектерді салыстыру',
            pages: '84–89',
            sampleExercises: ['№ 421', '№ 424', '№ 428', '№ 432 (күрделі)'],
          },
          {
            number: '§ 22',
            title: 'Бөлімдері бірдей жай бөлшектерді қосу және азайту',
            pages: '90–95',
            sampleExercises: ['№ 445', '№ 448', '№ 451'],
          },
          {
            number: '§ 25',
            title: 'Жай бөлшектерді көбейту',
            pages: '108–114',
            sampleExercises: ['№ 512', '№ 515', '№ 520'],
          },
        ],
      },
      {
        name: '2-тарау. Ондық бөлшектер',
        paragraphs: [
          {
            number: '§ 32',
            title: 'Ондық бөлшектерді қосу және азайту',
            pages: '142–148',
            sampleExercises: ['№ 670', '№ 673', '№ 678'],
          },
          {
            number: '§ 34',
            title: 'Ондық бөлшектерді көбейту',
            pages: '154–160',
            sampleExercises: ['№ 710', '№ 714', '№ 719'],
          },
        ],
      },
    ],
  },

  // 5 КЛАСС МАТЕМАТИКА (РУССКИЙ)
  {
    id: 'math-5-atamura-ru',
    title: 'Математика. 5 класс. Части 1, 2',
    subject: 'math',
    grade: 5,
    publisher: 'Атамұра',
    authors: 'Т. Алдамуратова, К. Байшоланов, Е. Байшоланов',
    year: 2024,
    language: 'ru',
    chapters: [
      {
        name: 'Глава 1. Обыкновенные дроби',
        paragraphs: [
          {
            number: '§ 21',
            title: 'Сравнение обыкновенных дробей',
            pages: '84–89',
            sampleExercises: ['№ 421', '№ 424', '№ 428', '№ 432 (повышенной сложности)'],
          },
          {
            number: '§ 25',
            title: 'Умножение обыкновенных дробей',
            pages: '108–114',
            sampleExercises: ['№ 512', '№ 515', '№ 520'],
          },
        ],
      },
    ],
  },

  // 6-СЫНЫП МАТЕМАТИКА (ҚАЗАҚША)
  {
    id: 'math-6-atamura-kk',
    title: 'Математика. 6-сынып. 1, 2-бөлім',
    subject: 'math',
    grade: 6,
    publisher: 'Атамұра',
    authors: 'Т. Алдамұратова, Қ. Байшоланов, Е. Байшоланов',
    year: 2024,
    language: 'kk',
    chapters: [
      {
        name: '3-тарау. Рационал сандар және оларға амалдар қолдану',
        paragraphs: [
          {
            number: '§ 28',
            title: 'Рационал сандарды көбейту',
            pages: '120–126',
            sampleExercises: ['№ 540', '№ 543', '№ 546', '№ 551 (зерттеу есебі)'],
          },
          {
            number: '§ 29',
            title: 'Рационал сандарды бөлу',
            pages: '127–132',
            sampleExercises: ['№ 562', '№ 565', '№ 570'],
          },
          {
            number: '§ 31',
            title: 'Рационал сандармен арифметикалық амалдарды орындау',
            pages: '138–145',
            sampleExercises: ['№ 595', '№ 598', '№ 603'],
          },
        ],
      },
      {
        name: '1-тарау. Қатынас және пропорция',
        paragraphs: [
          {
            number: '§ 3',
            title: 'Пропорция. Пропорцияның негізгі қасиеті',
            pages: '18–24',
            sampleExercises: ['№ 72', '№ 76', '№ 81'],
          },
        ],
      },
    ],
  },

  // 6 КЛАСС МАТЕМАТИКА (РУССКИЙ)
  {
    id: 'math-6-atamura-ru',
    title: 'Математика. 6 класс. Части 1, 2',
    subject: 'math',
    grade: 6,
    publisher: 'Атамұра',
    authors: 'Т. Алдамуратова, К. Байшоланов, Е. Байшоланов',
    year: 2024,
    language: 'ru',
    chapters: [
      {
        name: 'Глава 3. Рациональные числа и действия над ними',
        paragraphs: [
          {
            number: '§ 28',
            title: 'Умножение рациональных чисел',
            pages: '120–126',
            sampleExercises: ['№ 540', '№ 543', '№ 546', '№ 551 (исследовательская)'],
          },
          {
            number: '§ 29',
            title: 'Деление рациональных чисел',
            pages: '127–132',
            sampleExercises: ['№ 562', '№ 565', '№ 570'],
          },
        ],
      },
    ],
  },

  // 7-СЫНЫП АЛГЕБРА (ҚАЗАҚША)
  {
    id: 'algebra-7-mektep-kk',
    title: 'Алгебра. 7-сынып',
    subject: 'algebra',
    grade: 7,
    publisher: 'Мектеп',
    authors: 'Ә. Шыныбеков, Д. Шыныбеков, Р. Жұмабаев',
    year: 2024,
    language: 'kk',
    chapters: [
      {
        name: '2-тарау. Көпмүшелер және қысқаша көбейту формулалары',
        paragraphs: [
          {
            number: '§ 14',
            title: 'Көпмүшені көбейткіштерге жіктеу (ортақ көбейткішті шығару және топтау тәсілі)',
            pages: '72–78',
            sampleExercises: ['№ 14.1', '№ 14.4', '№ 14.8', '№ 14.12'],
          },
          {
            number: '§ 16',
            title: 'Екі өрнектің квадраттарының айырмасы',
            pages: '85–90',
            sampleExercises: ['№ 16.2', '№ 16.5', '№ 16.10'],
          },
          {
            number: '§ 17',
            title: 'Екі өрнектің қосындысының квадраты және айырымының квадраты',
            pages: '91–98',
            sampleExercises: ['№ 17.3', '№ 17.7', '№ 17.11'],
          },
        ],
      },
    ],
  },

  // 7 КЛАСС АЛГЕБРА (РУССКИЙ)
  {
    id: 'algebra-7-mektep-ru',
    title: 'Алгебра. 7 класс',
    subject: 'algebra',
    grade: 7,
    publisher: 'Мектеп',
    authors: 'А. Шыныбеков, Д. Шыныбеков, Р. Жумабаев',
    year: 2024,
    language: 'ru',
    chapters: [
      {
        name: 'Глава 2. Многочлены и формулы сокращенного умножения',
        paragraphs: [
          {
            number: '§ 14',
            title: 'Разложение многочлена на множители (вынесение за скобки и группировка)',
            pages: '72–78',
            sampleExercises: ['№ 14.1', '№ 14.4', '№ 14.8', '№ 14.12'],
          },
          {
            number: '§ 16',
            title: 'Разность квадратов двух выражений',
            pages: '85–90',
            sampleExercises: ['№ 16.2', '№ 16.5', '№ 16.10'],
          },
        ],
      },
    ],
  },

  // 9-СЫНЫП ГЕОМЕТРИЯ (ҚАЗАҚША)
  {
    id: 'geometry-9-mektep-kk',
    title: 'Геометрия. 9-сынып',
    subject: 'geometry',
    grade: 9,
    publisher: 'Мектеп',
    authors: 'Ә. Шыныбеков, Д. Шыныбеков',
    year: 2024,
    language: 'kk',
    chapters: [
      {
        name: '1-тарау. Жазықтықтағы векторлар',
        paragraphs: [
          {
            number: '§ 4',
            title: 'Векторларды есептер шығаруға қолдану (векторлық әдіс)',
            pages: '28–36',
            sampleExercises: ['№ 4.2', '№ 4.5', '№ 4.9', '№ 4.14 (дәлелдеу)'],
          },
          {
            number: '§ 5',
            title: 'Векторлардың скаляр көбейтіндісі',
            pages: '37–44',
            sampleExercises: ['№ 5.1', '№ 5.4', '№ 5.8'],
          },
        ],
      },
    ],
  },

  // 9 КЛАСС ГЕОМЕТРИЯ (РУССКИЙ)
  {
    id: 'geometry-9-mektep-ru',
    title: 'Геометрия. 9 класс',
    subject: 'geometry',
    grade: 9,
    publisher: 'Мектеп',
    authors: 'А. Шыныбеков, Д. Шыныбеков',
    year: 2024,
    language: 'ru',
    chapters: [
      {
        name: 'Глава 1. Векторы на плоскости',
        paragraphs: [
          {
            number: '§ 4',
            title: 'Применение векторов к решению задач (векторный метод)',
            pages: '28–36',
            sampleExercises: ['№ 4.2', '№ 4.5', '№ 4.9', '№ 4.14 (доказательство)'],
          },
          {
            number: '§ 5',
            title: 'Скалярное произведение векторов',
            pages: '37–44',
            sampleExercises: ['№ 5.1', '№ 5.4', '№ 5.8'],
          },
        ],
      },
    ],
  },
];
