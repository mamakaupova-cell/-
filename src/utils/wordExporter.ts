/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  TextRun,
  AlignmentType,
  HeightRule,
  PageOrientation,
} from 'docx';
import { QMZhDocument, CombinedQMZhDocument } from '../types/qmzh';
import { calculateGroupDivision } from './groupDivision';

const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '000000';

function createHeading(text: string, bold: boolean = true, size: number = 24, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.CENTER): Paragraph {
  return new Paragraph({
    alignment: align,
    spacing: { before: 120, after: 120 },
    children: [
      new TextRun({
        text,
        bold,
        size, // 24 = 12pt
        font: FONT_FAMILY,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

function createMetaRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 24, // 12pt
        font: FONT_FAMILY,
        color: PRIMARY_COLOR,
      }),
      new TextRun({
        text: value || '—',
        size: 24,
        font: FONT_FAMILY,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

function createBorderedCell(text: string, widthPercent: number, isHeader: boolean = false): TableCell {
  return new TableCell({
    width: {
      size: widthPercent,
      type: WidthType.PERCENTAGE,
    },
    shading: isHeader ? { fill: 'F1F5F9' } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
    children: text.split('\n').map(line =>
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: line,
            bold: isHeader,
            size: 22, // 11pt inside table
            font: FONT_FAMILY,
            color: PRIMARY_COLOR,
          }),
        ],
      })
    ),
  });
}

/**
 * Downloads a Blob directly to the client's browser.
 */
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads the Official Order #130 Word Document (.docx)
 */
/**
 * Generates and downloads the Official Order #130 Word Document (.docx)
 * Matching the exact WhatsApp template (Meruert Math / Kazakhstan Order 130)
 */
export async function exportQMZhToWord(qmzh: QMZhDocument): Promise<void> {
  const isKk = qmzh.language === 'kk';
  const subjectName = qmzh.subject === 'math' 
    ? (isKk ? 'Математика' : 'Математика')
    : qmzh.subject === 'algebra'
    ? (isKk ? 'Алгебра' : 'Алгебра')
    : qmzh.subject === 'geometry'
    ? (isKk ? 'Геометрия' : 'Геометрия')
    : (isKk ? 'Алгебра және анализ бастамалары' : 'Алгебра и начала анализа');

  // 1. Boxed Header Table (Exact 7-row Kazakhstan Ministry template)
  const groupDiv = calculateGroupDivision(qmzh.studentsCount || 24, isKk ? 'kk' : 'ru');
  const goalsText = (qmzh.lessonGoalsList && qmzh.lessonGoalsList.length > 0)
    ? qmzh.lessonGoalsList.join('\n')
    : qmzh.lessonGoal;

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Бөлім:' : 'Раздел:', 28, true),
          createBorderedCell(qmzh.sectionName || (isKk ? 'Рационал сандар' : 'Рациональные числа'), 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Педагогтің аты-жөні:' : 'ФИО педагога:', 28, true),
          createBorderedCell(qmzh.teacherName || 'Каюпова Орынгуль Жумагалиевна', 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Күні:' : 'Дата:', 28, true),
          createBorderedCell(qmzh.date || new Date().toISOString().split('T')[0], 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(`${isKk ? 'Сынып:' : 'Класс:'} ${qmzh.grade}`, 28, true),
          createBorderedCell(
            `${isKk ? 'Қатысқандар саны:' : 'Присутствуют:'} ${qmzh.studentsCount}      ${isKk ? 'Қатыспағандар саны:' : 'Отсутствуют:'} ${qmzh.absentCount}\n[${isKk ? groupDiv.summaryDistributionKk : groupDiv.summaryDistributionRu}]`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Сабақтың тақырыбы:' : 'Тема урока:', 28, true),
          createBorderedCell(qmzh.lessonTopic, 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(
            isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаттары:' : 'Цели обучения по программе:',
            28,
            true
          ),
          createBorderedCell(`${qmzh.learningObjectiveCode} — ${qmzh.learningObjectiveText}`, 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Сабақтың мақсаты:' : 'Цели урока:', 28, true),
          createBorderedCell(goalsText, 72),
        ],
      }),
      ...(qmzh.textbookReference ? [
        new TableRow({
          children: [
            createBorderedCell(isKk ? 'Оқулық және баспасы:' : 'Учебник и издательство:', 28, true),
            createBorderedCell(
              typeof qmzh.textbookReference === 'string'
                ? qmzh.textbookReference
                : [
                    qmzh.textbookReference.publisher || '',
                    qmzh.textbookReference.textbookTitle || '',
                    qmzh.textbookReference.authors ? `(${qmzh.textbookReference.authors})` : '',
                    qmzh.textbookReference.paragraph || '',
                    qmzh.textbookReference.pageNumbers || '',
                    qmzh.textbookReference.exercises ? `${isKk ? 'Жаттығулар:' : 'Задания:'} ${qmzh.textbookReference.exercises}` : '',
                  ].filter(Boolean).join(' • '),
              72
            ),
          ],
        }),
      ] : []),
    ],
  });

  // 2. 5-Column Table Header
  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createBorderedCell(isKk ? 'Уақыты/ кезеңдері' : 'Время / этап', 14, true),
        createBorderedCell(isKk ? 'Педагогтің әрекеті' : 'Действия педагога', 27, true),
        createBorderedCell(isKk ? 'Оқушының әрекеті' : 'Действия ученика', 31, true),
        createBorderedCell(isKk ? 'Бағалау' : 'Оценивание', 14, true),
        createBorderedCell(isKk ? 'Ресурстар' : 'Ресурсы', 14, true),
      ],
    }),
  ];

  // Populate Stages & Sub-activities
  for (const stage of qmzh.stages) {
    if (stage.stageId === 'middle' && stage.subActivities && stage.subActivities.length > 0) {
      // Middle stage: Render each subactivity as its own row in the table
      stage.subActivities.forEach((sub, subIdx) => {
        const timeCellText = subIdx === 0
          ? `${stage.stageName}\n(${stage.timeMinutes} минут)`
          : `${stage.stageName}`;

        const teacherCellContent = `${sub.title}:\n${sub.teacherAction}`;
        const studentCellContent = sub.studentAction;

        tableRows.push(
          new TableRow({
            children: [
              createBorderedCell(timeCellText, 14),
              createBorderedCell(teacherCellContent, 27),
              createBorderedCell(studentCellContent, 31),
              createBorderedCell(sub.assessment, 14),
              createBorderedCell(sub.resources, 14),
            ],
          })
        );
      });
    } else {
      // Regular stage row (org, intro, conclusion)
      tableRows.push(
        new TableRow({
          children: [
            createBorderedCell(`${stage.stageName}\n(${stage.timeMinutes} мин)`, 14),
            createBorderedCell(stage.teacherActions, 27),
            createBorderedCell(stage.studentActions, 31),
            createBorderedCell(stage.assessment, 14),
            createBorderedCell(stage.resources, 14),
          ],
        })
      );
    }
  }

  // Answer Key Section
  const answerKeyParagraphs: Paragraph[] = [
    new Paragraph({ spacing: { before: 240, after: 120 } }),
    createHeading(isKk ? 'ҚОСЫМША: МҰҒАЛІМГЕ АРНАЛҒАН ТОЛЫҚ ЖАУАП КІЛТІ МЕН ШЕШУ ЖОЛДАРЫ' : 'ПРИЛОЖЕНИЕ: ПОЛНЫЙ КЛЮЧ И ПОШАГОВЫЕ РЕШЕНИЯ ДЛЯ УЧИТЕЛЯ', true, 26, AlignmentType.LEFT),
  ];

  for (const task of qmzh.tieredTasks) {
    answerKeyParagraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({ text: `${task.levelName} (Критерий: ${task.criteria}):`, bold: true, size: 24, font: FONT_FAMILY }),
        ],
      })
    );

    for (const [idx, prob] of task.problems.entries()) {
      answerKeyParagraphs.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: `Тапсырма ${idx + 1}: ${prob.statement}`, bold: true, size: 22, font: FONT_FAMILY }),
          ],
        })
      );
      if (prob.given) {
        answerKeyParagraphs.push(new Paragraph({ children: [new TextRun({ text: `Берілгені: ${prob.given}`, size: 22, font: FONT_FAMILY })] }));
      }
      if (prob.toFind) {
        answerKeyParagraphs.push(new Paragraph({ children: [new TextRun({ text: `Табу керек / Дәлелдеу керек: ${prob.toFind}`, size: 22, font: FONT_FAMILY })] }));
      }
      prob.stepByStepSolution.forEach(step => {
        answerKeyParagraphs.push(new Paragraph({ children: [new TextRun({ text: `• ${step}`, size: 22, font: FONT_FAMILY })] }));
      });
      answerKeyParagraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `Дұрыс жауабы: ${prob.answer}`, bold: true, color: '059669', size: 22, font: FONT_FAMILY }),
            new TextRun({ text: ` | Дескриптор: ${prob.descriptorText} (${prob.points} балл)`, italics: true, size: 20, font: FONT_FAMILY }),
          ],
        })
      );
    }
  }

  // Build the complete docx Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch margins
          },
        },
        children: [
          // Centered Header Title
          createHeading(
            `${isKk ? 'Қысқа мерзімді сабақ жоспары' : 'Краткосрочный план урока'} №${qmzh.lessonNumberTitle || '1'}`,
            true,
            28
          ),
          createHeading(
            `${qmzh.grade} ${isKk ? 'сынып' : 'класс'} ${subjectName}`,
            true,
            24
          ),

          // Approval block
          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: `${isKk ? 'Бекітемін:' : 'Утверждаю:'} ________________________`,
                bold: true,
                size: 24,
                font: FONT_FAMILY,
              }),
            ],
          }),

          // Boxed Metadata Table
          headerTable,

          // Lesson Progress Title
          new Paragraph({ spacing: { before: 180, after: 100 } }),
          createHeading(isKk ? 'Сабақ барысы:' : 'Ход урока:', true, 24),

          // 5-Column Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),

          ...answerKeyParagraphs,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTopic = (qmzh.lessonTopic || 'KMZh').replace(/[^a-zA-Z0-9а-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ_\-]/g, '_');
  downloadBlob(blob, `QMZh_${qmzh.grade}_synyp_${cleanTopic}.docx`);
}

/**
 * Exports Student Worksheet (.docx) without answers so students can practice directly.
 */
export async function exportStudentWorksheet(qmzh: QMZhDocument): Promise<void> {
  const isKk = qmzh.language === 'kk';

  const docChildren: (Paragraph | Table)[] = [
    createHeading(isKk ? 'МАТЕМАТИКАЛЫҚ ЖҰМЫС ПАРАҒЫ (ҮЛЕСТІРМЕЛІ МАТЕРИАЛ)' : 'МАТЕМАТИЧЕСКИЙ РАБОЧИЙ ЛИСТ (РАЗДАТОЧНЫЙ МАТЕРИАЛ)', true, 26),
    createMetaRow(isKk ? 'Оқушының аты-жөні' : 'Имя ученика', '_________________________________'),
    createMetaRow(isKk ? 'Сыныбы / Күні' : 'Класс / Дата', `${qmzh.grade}-сынып, ${qmzh.date}`),
    createMetaRow(isKk ? 'Сабақтың тақырыбы' : 'Тема урока', qmzh.lessonTopic),
    createMetaRow(isKk ? 'Оқу мақсаты' : 'Цель обучения', `${qmzh.learningObjectiveCode} ${qmzh.learningObjectiveText}`),
    new Paragraph({ spacing: { before: 100, after: 100 } }),
  ];

  for (const task of qmzh.tieredTasks) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({ text: `${task.levelName}`, bold: true, size: 24, font: FONT_FAMILY }),
        ],
      }),
      new Paragraph({
        spacing: { before: 20, after: 60 },
        children: [
          new TextRun({ text: `Тірек нұсқаулық: ${task.guidance}`, italics: true, size: 20, font: FONT_FAMILY }),
        ],
      })
    );

    for (const [idx, prob] of task.problems.entries()) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({ text: `${idx + 1}-тапсырма. ${prob.statement}`, bold: true, size: 22, font: FONT_FAMILY }),
          ],
        })
      );
      if (prob.given) {
        docChildren.push(new Paragraph({ children: [new TextRun({ text: `Берілгені: ${prob.given}`, size: 22, font: FONT_FAMILY })] }));
      }
      if (prob.toFind) {
        docChildren.push(new Paragraph({ children: [new TextRun({ text: `Табу керек / Дәлелдеу керек: ${prob.toFind}`, size: 22, font: FONT_FAMILY })] }));
      }
      // Blank lines for student solution
      docChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [
            new TextRun({ text: 'Шешуі: _________________________________________________________________________________\n_______________________________________________________________________________________', size: 20, font: FONT_FAMILY, color: '64748B' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `Дескриптор: ${prob.descriptorText} [ ____ / ${prob.points} балл ]`, italics: true, size: 18, font: FONT_FAMILY, color: '2563EB' }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Worksheet_${qmzh.grade}_${(qmzh.lessonTopic || 'math').replace(/\s+/g, '_')}.docx`);
}

/**
 * Generates and downloads Combined Class QMZh Word document (ҚР Оқу-ағарту министрлігінің №130 бұйрығы)
 */
export async function exportCombinedQMZhToWord(cq: CombinedQMZhDocument): Promise<void> {
  const isKk = cq.language === 'kk';

  // 1. Boxed Header Table (Order #130 for Combined Multi-Grade Classes)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Бөлімдері:' : 'Разделы:', 28, true),
          createBorderedCell(
            `1-сынып (${cq.class1.grade}): ${cq.class1.sectionName || cq.class1.topic}\n2-сынып (${cq.class2.grade}): ${cq.class2.sectionName || cq.class2.topic}`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Педагогтің аты-жөні:' : 'ФИО педагога:', 28, true),
          createBorderedCell(cq.teacherName || 'Каюпова Орынгуль Жумагалиевна', 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Күні және мектеп:' : 'Дата и школа:', 28, true),
          createBorderedCell(`${cq.date || new Date().toISOString().split('T')[0]} | ${cq.schoolName || (isKk ? 'Шағын жинақты мектеп' : 'Малокомплектная школа')}`, 72),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Сыныптар мен оқушылар:' : 'Классы и учащиеся:', 28, true),
          createBorderedCell(
            `1-сынып (${cq.class1.grade}): ${cq.class1.studentsCount} оқушы (қатыспағандар: ${cq.class1.absentCount || 0})\n2-сынып (${cq.class2.grade}): ${cq.class2.studentsCount} оқушы (қатыспағандар: ${cq.class2.absentCount || 0})\n[Синхрондалған 45 минуттық ротациялық кесте]`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Сабақтың тақырыптары:' : 'Темы уроков:', 28, true),
          createBorderedCell(
            `1-сынып (${cq.class1.grade}): ${cq.class1.topic}\n2-сынып (${cq.class2.grade}): ${cq.class2.topic}`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Оқу бағдарламасына сәйкес оқыту мақсаттары:' : 'Цели обучения по программе:', 28, true),
          createBorderedCell(
            `1-сынып (${cq.class1.grade}): ${cq.class1.objectiveCode} — ${cq.class1.objectiveText}\n2-сынып (${cq.class2.grade}): ${cq.class2.objectiveCode} — ${cq.class2.objectiveText}`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Сабақтың мақсаттары:' : 'Цели уроков:', 28, true),
          createBorderedCell(
            `1-сынып (${cq.class1.grade}-сынып):\n${(cq.class1.lessonGoalsList || [cq.class1.lessonGoal]).join('\n')}\n\n2-сынып (${cq.class2.grade}-сынып):\n${(cq.class2.lessonGoalsList || [cq.class2.lessonGoal]).join('\n')}`,
            72
          ),
        ],
      }),
      new TableRow({
        children: [
          createBorderedCell(isKk ? 'Оқулықтар мен баспалары:' : 'Учебники и издательства:', 28, true),
          createBorderedCell(
            `1-сынып: ${typeof cq.class1.textbookReference === 'string' ? cq.class1.textbookReference : (cq.class1.textbookReference?.publisher || '«Атамұра»') + ' (' + (cq.class1.textbookReference?.textbookTitle || `${cq.class1.grade}-сынып`) + ')'}\n2-сынып: ${typeof cq.class2.textbookReference === 'string' ? cq.class2.textbookReference : (cq.class2.textbookReference?.publisher || '«Мектеп»') + ' (' + (cq.class2.textbookReference?.textbookTitle || `${cq.class2.grade}-сынып`) + ')'}`,
            72
          ),
        ],
      }),
    ],
  });

  // 2. 5-Column Synchronized Table
  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createBorderedCell(isKk ? 'Уақыт / Кезең' : 'Время / Этап', 12, true),
        createBorderedCell(isKk ? 'Мұғалімнің үйлестіруі (Мұғалім әрекеті)' : 'Координация учителя', 22, true),
        createBorderedCell(`${cq.class1.grade}-сынып оқушыларының әрекеті (${cq.class1.studentsCount} оқушы)`, 28, true),
        createBorderedCell(`${cq.class2.grade}-сынып оқушыларының әрекеті (${cq.class2.studentsCount} оқушы)`, 28, true),
        createBorderedCell(isKk ? 'Ресурстар' : 'Ресурсы', 10, true),
      ],
    }),
  ];

  for (const st of cq.stages) {
    rows.push(
      new TableRow({
        children: [
          createBorderedCell(`${st.stageName}\n(${st.timeMinutes} мин)`, 12),
          createBorderedCell(`[${st.coordinationPrinciple}]\n\n${st.teacherActionCombined}`, 22),
          createBorderedCell(`${st.class1StudentAction}\n\nБағалау: ${st.class1Assessment}`, 28),
          createBorderedCell(`${st.class2StudentAction}\n\nБағалау: ${st.class2Assessment}`, 28),
          createBorderedCell(st.resources, 10),
        ],
      })
    );
  }

  // Appendix: Tasks for Class 1 & Class 2
  const appendixParagraphs: Paragraph[] = [
    new Paragraph({ spacing: { before: 240, after: 120 } }),
    createHeading(isKk ? 'ҚОСЫМША: СЫНЫПТАРҒА АРНАЛҒАН ДЕҢГЕЙЛІК ТАПСЫРМАЛАР МЕН ТОЛЫҚ ЖАУАП КІЛТТЕРІ' : 'ПРИЛОЖЕНИЕ: УРОВНЕВЫЕ ЗАДАНИЯ И ПОЛНЫЕ КЛЮЧИ ОТВЕТОВ', true, 26, AlignmentType.LEFT),
  ];

  // Class 1 Tasks
  appendixParagraphs.push(
    createHeading(isKk ? `1-СЫНЫП (${cq.class1.grade}-сынып) ТАПСЫРМАЛАРЫ:` : `ЗАДАНИЯ ДЛЯ 1-ГО КЛАССА (${cq.class1.grade} КЛАСС):`, true, 24, AlignmentType.LEFT)
  );
  for (const t of cq.class1.tasks) {
    appendixParagraphs.push(new Paragraph({ spacing: { before: 80, after: 20 }, children: [new TextRun({ text: `${t.levelName} (${t.criteria}):`, bold: true, size: 22, font: FONT_FAMILY })] }));
    for (const [idx, p] of t.problems.entries()) {
      appendixParagraphs.push(new Paragraph({ children: [new TextRun({ text: `${idx + 1}-есеп: ${p.statement}`, bold: true, size: 20, font: FONT_FAMILY })] }));
      p.stepByStepSolution.forEach(s => appendixParagraphs.push(new Paragraph({ children: [new TextRun({ text: `• ${s}`, size: 20, font: FONT_FAMILY })] })));
      appendixParagraphs.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `Дұрыс жауабы: ${p.answer} | Дескриптор: ${p.descriptorText} (${p.points} балл)`, bold: true, color: '059669', size: 20, font: FONT_FAMILY })] }));
    }
  }

  // Class 2 Tasks
  appendixParagraphs.push(
    new Paragraph({ spacing: { before: 140, after: 80 } }),
    createHeading(isKk ? `2-СЫНЫП (${cq.class2.grade}-сынып) ТАПСЫРМАЛАРЫ:` : `ЗАДАНИЯ ДЛЯ 2-ГО КЛАССА (${cq.class2.grade} КЛАСС):`, true, 24, AlignmentType.LEFT)
  );
  for (const t of cq.class2.tasks) {
    appendixParagraphs.push(new Paragraph({ spacing: { before: 80, after: 20 }, children: [new TextRun({ text: `${t.levelName} (${t.criteria}):`, bold: true, size: 22, font: FONT_FAMILY })] }));
    for (const [idx, p] of t.problems.entries()) {
      appendixParagraphs.push(new Paragraph({ children: [new TextRun({ text: `${idx + 1}-есеп: ${p.statement}`, bold: true, size: 20, font: FONT_FAMILY })] }));
      p.stepByStepSolution.forEach(s => appendixParagraphs.push(new Paragraph({ children: [new TextRun({ text: `• ${s}`, size: 20, font: FONT_FAMILY })] })));
      appendixParagraphs.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `Дұрыс жауабы: ${p.answer} | Дескриптор: ${p.descriptorText} (${p.points} балл)`, bold: true, color: '059669', size: 20, font: FONT_FAMILY })] }));
    }
  }

  if (cq.answerKeysCombined) {
    appendixParagraphs.push(
      new Paragraph({ spacing: { before: 140, after: 40 } }),
      createHeading(isKk ? 'СИНХРОНДАУ КЕСТЕСІНІҢ ШЫҒАРЫЛУ ЖАУАПТАРЫ:' : 'ОТВЕТЫ СИНХРОНИЗИРОВАННОЙ ТАБЛИЦЫ:', true, 22, AlignmentType.LEFT),
      new Paragraph({ children: [new TextRun({ text: cq.answerKeysCombined, size: 20, font: FONT_FAMILY })] })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          createHeading(
            isKk 
              ? `Қысқа мерзімді сабақ жоспары (Біріктірілген сыныптар)\n${cq.class1.grade} және ${cq.class2.grade}-сыныптар` 
              : `Краткосрочный план урока (Совмещенные классы)\n${cq.class1.grade} и ${cq.class2.grade} классы`,
            true,
            28
          ),
          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: `${isKk ? 'Бекітемін:' : 'Утверждаю:'} ________________________`,
                bold: true,
                size: 24,
                font: FONT_FAMILY,
              }),
            ],
          }),
          headerTable,
          new Paragraph({ spacing: { before: 180, after: 100 } }),
          createHeading(isKk ? 'Синхрондалған сабақ барысы (45 минут):' : 'Синхронизированный ход урока (45 минут):', true, 24),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          }),
          ...appendixParagraphs,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Combined_QMZh_${cq.class1.grade}_${cq.class2.grade}_synyp.docx`);
}
