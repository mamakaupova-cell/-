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
 * Generates and downloads Combined Class QMZh Word document
 */
export async function exportCombinedQMZhToWord(cq: CombinedQMZhDocument): Promise<void> {
  const isKk = cq.language === 'kk';

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createBorderedCell(isKk ? 'Уақыт / Кезең' : 'Время / Этап', 12, true),
        createBorderedCell(isKk ? 'Мұғалімнің үйлестіруі' : 'Координация учителя', 22, true),
        createBorderedCell(`${cq.class1.grade}-сынып әрекеті`, 28, true),
        createBorderedCell(`${cq.class2.grade}-сынып әрекеті`, 28, true),
        createBorderedCell(isKk ? 'Ресурстар' : 'Ресурсы', 10, true),
      ],
    }),
  ];

  for (const st of cq.stages) {
    rows.push(
      new TableRow({
        children: [
          createBorderedCell(`${st.stageName}\n(${st.timeMinutes} мин)`, 12),
          createBorderedCell(`${st.coordinationPrinciple}\n\n${st.teacherActionCombined}`, 22),
          createBorderedCell(`${st.class1StudentAction}\n\nБағалау: ${st.class1Assessment}`, 28),
          createBorderedCell(`${st.class2StudentAction}\n\nБағалау: ${st.class2Assessment}`, 28),
          createBorderedCell(st.resources, 10),
        ],
      })
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
          createHeading(cq.schoolName || (isKk ? 'Шағын жинақты мектеп' : 'Малокомплектная школа'), true, 26),
          createHeading(isKk ? `БІРІКТІРІЛГЕН СЫНЫПТАР ҚМЖ (${cq.class1.grade} ЖӘНЕ ${cq.class2.grade}-СЫНЫПТАР)` : `КСП ДЛЯ СОВМЕЩЕННЫХ КЛАССОВ (${cq.class1.grade} И ${cq.class2.grade} КЛАССЫ)`, true, 28),
          createMetaRow(isKk ? 'Педагогтің АӘТ' : 'ФИО педагога', cq.teacherName),
          createMetaRow(isKk ? 'Күні / Ұзақтығы' : 'Дата / Время', `${cq.date}, 45 минут`),
          createMetaRow(`1-сынып (${cq.class1.grade}-сынып)`, `${cq.class1.subject.toUpperCase()}: ${cq.class1.topic} (${cq.class1.objectiveCode})`),
          createMetaRow(`2-сынып (${cq.class2.grade}-сынып)`, `${cq.class2.subject.toUpperCase()}: ${cq.class2.topic} (${cq.class2.objectiveCode})`),
          new Paragraph({ spacing: { before: 120, after: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Combined_QMZh_${cq.class1.grade}_${cq.class2.grade}.docx`);
}
