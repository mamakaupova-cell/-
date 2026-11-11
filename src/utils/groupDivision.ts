/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageType } from '../types/qmzh';

export type GroupStrategy = 'small_class_individual_pair' | 'two_micro_groups' | 'three_rows_standard';

export interface GroupDivisionResult {
  studentsCount: number;
  canDivideIntoGroups: boolean;
  strategy: GroupStrategy;
  groupCount: number;
  groupSizes: number[];
  badgeStatus: 'small' | 'moderate' | 'standard';
  badgeTitleKk: string;
  badgeTitleRu: string;
  explanationKk: string;
  explanationRu: string;
  summaryDistributionKk: string;
  summaryDistributionRu: string;
  orgStageTeacherActionKk: string;
  orgStageTeacherActionRu: string;
  groupActivityTitleKk: string;
  groupActivityTitleRu: string;
  groupActivityTeacherActionKk: string;
  groupActivityTeacherActionRu: string;
  groupActivityStudentActionKk: string;
  groupActivityStudentActionRu: string;
  groupNamesKk: string[];
  groupNamesRu: string[];
}

/**
 * Calculates whether group division is possible and builds appropriate pedagogical texts
 * for lesson planning according to Kazakhstan educational methodology.
 */
export function calculateGroupDivision(count: number, language: LanguageType = 'kk'): GroupDivisionResult {
  const studentsCount = Math.max(1, count || 24);
  const isKk = language === 'kk';

  // CASE 1: Малокомплектный класс / Шағын жинақталған сынып (1 to 4 students)
  if (studentsCount <= 4) {
    const pairCount = Math.ceil(studentsCount / 2);
    return {
      studentsCount,
      canDivideIntoGroups: false,
      strategy: 'small_class_individual_pair',
      groupCount: pairCount,
      groupSizes: studentsCount === 1 ? [1] : studentsCount === 2 ? [2] : studentsCount === 3 ? [2, 1] : [2, 2],
      badgeStatus: 'small',
      badgeTitleKk: `⚠️ Шағын сынып (${studentsCount} оқушы): Топқа бөлу мүмкін емес`,
      badgeTitleRu: `⚠️ Малокомплектный класс (${studentsCount} уч.): Деление на группы невозможно`,
      explanationKk: `Сыныпта оқушы саны аз (${studentsCount} оқушы) болғандықтан, 3 үлкен топқа немесе қатарға бөлу мүмкін емес әрі тиімсіз. Дәстүрлі топтық сайыстың орнына жұптық саралау немесе жеке шеберлік сағаты қолданылады.`,
      explanationRu: `Из-за малого числа учащихся (${studentsCount} уч.) деление на 3 большие группы нецелесообразно. Традиционное соревнование адаптируется в парную дифференциацию или индивидуальный практикум.`,
      summaryDistributionKk: studentsCount <= 2 
        ? `${studentsCount} оқушымен жеке сараланған жұмыс` 
        : `2 шағын жұп (${studentsCount === 3 ? '2 оқушы + 1 оқушы' : '2 оқушы + 2 оқушы'})`,
      summaryDistributionRu: studentsCount <= 2
        ? `Индивидуальная дифференциация для ${studentsCount} уч.`
        : `2 пары (${studentsCount === 3 ? '2 уч. + 1 уч.' : '2 уч. + 2 уч.'})`,
      orgStageTeacherActionKk: `Сәлемдесу, түгелдеу.\nОқушы санына назар аудару: сыныпта бар болғаны ${studentsCount} оқушы (шағын жинақталған сынып). Оқушы саны аз болғандықтан, топқа бөлудің орнына сараланған жұптық/жеке жұмыс ұйымдастырылады.\nЖағымды психологиялық ахуал орнату: «Сәттілік тілеймін! Бірлесе биікке жетеміз!».`,
      orgStageTeacherActionRu: `Приветствие, перекличка.\nВнимание на состав: в классе всего ${studentsCount} уч. (малокомплектный класс). Деление на группы не проводится; организуется парная и индивидуальная дифференциация.\nСоздание психологического настроя: «Желаю успеха!».`,
      groupActivityTitleKk: `Шағын сыныпқа бейімделген сараланған жұптық сайыс (${studentsCount} оқушы)`,
      groupActivityTitleRu: `Парное соревнование, адаптированное под малокомплектный класс (${studentsCount} уч.)`,
      groupActivityTeacherActionKk: `Оқушы санының шектеулігін (${studentsCount} оқушы) ескере отырып, 3 қатар сайысының орнына жеке саралау және блиц-жұптық өзара тексеру ұйымдастырылады.\nӘділдік және ынтымақтастық: Әр оқушының жеке қарқыны ескеріліп, өзара қолдау көрсетіледі.`,
      groupActivityTeacherActionRu: `Учитывая малое число учащихся (${studentsCount} уч.), вместо 3 рядов организуется парный блиц-контроль и индивидуальная поддержка.\nСправедливость и солидарность: Учет индивидуального темпа каждого ученика.`,
      groupActivityStudentActionKk: `Шағын сынып бойынша тапсырмалар толық шешуімен орындалады:\n1) Әр оқушы/жұп берілген есепті дәптерге толық амалдарымен шығарады;\n2) Өзара тексеру жүргізіп, нәтижелерін түсіндіреді;\n3) Барлық есептеулер қадам бойынша тексеріледі.`,
      groupActivityStudentActionRu: `Задания выполняются с подробной записью решений:\n1) Каждый ученик выполняет расчеты пошагово в тетради;\n2) Проводит взаимопроверку с напарником;\n3) Обосновывает каждый шаг вычислений.`,
      groupNamesKk: studentsCount <= 2 ? ['1-оқушы', '2-оқушы'] : ['1-жұп', '2-жұп'],
      groupNamesRu: studentsCount <= 2 ? ['1-й ученик', '2-й ученик'] : ['1-я пара', '2-я пара'],
    };
  }

  // CASE 2: Малочисленный класс / 5-8 учащихся (2 малые группы)
  if (studentsCount <= 8) {
    const g1 = Math.ceil(studentsCount / 2);
    const g2 = Math.floor(studentsCount / 2);
    return {
      studentsCount,
      canDivideIntoGroups: true,
      strategy: 'two_micro_groups',
      groupCount: 2,
      groupSizes: [g1, g2],
      badgeStatus: 'moderate',
      badgeTitleKk: `ℹ️ Шағын құрамды сынып (${studentsCount} оқушы): 2 шағын топқа бөлінеді`,
      badgeTitleRu: `ℹ️ Малочисленный класс (${studentsCount} уч.): Деление на 2 малые группы`,
      explanationKk: `Сыныпта ${studentsCount} оқушы болғандықтан, 3 үлкен қатар құру тиімсіз. Ең оңтайлы шешім — сыныпты 2 шағын командаға теңдей бөліп жарыстыру (1-топ: ${g1} оқушы, 2-топ: ${g2} оқушы).`,
      explanationRu: `При количестве ${studentsCount} уч. формирование 3 рядов нецелесообразно. Оптимально разделить класс на 2 равные команды (1-я группа: ${g1} уч., 2-я группа: ${g2} уч.).`,
      summaryDistributionKk: `2 шағын топ: 1-топ (${g1} оқушы), 2-топ (${g2} оқушы)`,
      summaryDistributionRu: `2 малые группы: 1-я группа (${g1} уч.), 2-я группа (${g2} уч.)`,
      orgStageTeacherActionKk: `Сәлемдесу, түгелдеу.\nПлатформа арқылы сыныптағы ${studentsCount} оқушыны 2 шағын топқа бөлу: 1-топ (${g1} оқушы), 2-топ (${g2} оқушы).\n«Жылдам жауап» сұрақтары: өтілген ережелерді топтар арасында кезектесіп тексеру.\nЖауапкершілік: Әр топ мүшесі команда үшін жауап береді.`,
      orgStageTeacherActionRu: `Приветствие, перекличка.\nДеление ${studentsCount} учащихся на 2 малые группы: 1-я группа (${g1} уч.), 2-я группа (${g2} уч.).\n«Быстрый ответ»: разминка между двумя командами.\nОтветственность: Каждый ученик вносит вклад в общий результат команды.`,
      groupActivityTitleKk: `Топтық жұмыс: 2 команда арасындағы блиц-сайыс (${studentsCount} оқушы: ${g1} + ${g2})`,
      groupActivityTitleRu: `Групповая работа: Блиц-соревнование 2 команд (${studentsCount} уч.: ${g1} + ${g2})`,
      groupActivityTeacherActionKk: `2 шағын командаға арнайы тапсырмалар беріліп, тақтада жарыс өткізіледі:\n1-топ (${g1} оқушы) тапсырмасы;\n2-топ (${g2} оқушы) тапсырмасы.\nӘділдік және жауапкершілік: Топта міндеттерді тең бөлісу, уақытты үнемдеу.`,
      groupActivityTeacherActionRu: `Организуется соревнование двух команд:\n1-я группа (${g1} уч.) решает пример 1;\n2-я группа (${g2} уч.) решает пример 2.\nСправедливость и ответственность: Равное распределение обязанностей в группе.`,
      groupActivityStudentActionKk: `2 команда есептерді толық амалдарымен, әрбір аралық қадамын жазып тақтада көрсетеді:\nКоманда мүшелері есептеулерді өзара тексеріп, ортақ нақты жауапты ұсынады.`,
      groupActivityStudentActionRu: `Обе команды подробно расписывают все этапы вычислений на доске и в тетрадях:\nУчащиеся проверяют промежуточные действия и формулируют обоснованный ответ.`,
      groupNamesKk: [`1-топ (${g1} оқушы)`, `2-топ (${g2} оқушы)`],
      groupNamesRu: [`1-я группа (${g1} уч.)`, `2-я группа (${g2} уч.)`],
    };
  }

  // CASE 3: Стандартный класс / 9+ учащихся (3 ряда «Үш парта» жарыс ойыны)
  const base = Math.floor(studentsCount / 3);
  const rem = studentsCount % 3;
  const g1 = base + (rem >= 1 ? 1 : 0);
  const g2 = base + (rem >= 2 ? 1 : 0);
  const g3 = base;

  return {
    studentsCount,
    canDivideIntoGroups: true,
    strategy: 'three_rows_standard',
    groupCount: 3,
    groupSizes: [g1, g2, g3],
    badgeStatus: 'standard',
    badgeTitleKk: `✅ Стандартты сынып (${studentsCount} оқушы): «Үш парта» 3 қатарға бөлу тиімді`,
    badgeTitleRu: `✅ Стандартный класс (${studentsCount} уч.): Деление на 3 ряда («Три парты») оптимально`,
    explanationKk: `Сыныптағы ${studentsCount} оқушы «Үш парта» әдісі бойынша 3 қатарға теңдей бөлінеді: 1-қатар (${g1} оқушы), 2-қатар (${g2} оқушы), 3-қатар (${g3} оқушы).`,
    explanationRu: `Учащиеся (${studentsCount} уч.) делятся на 3 ряда по методике «Три парты»: 1-й ряд (${g1} уч.), 2-й ряд (${g2} уч.), 3-й ряд (${g3} уч.).`,
    summaryDistributionKk: `3 қатар: 1-қатар (${g1} оқушы), 2-қатар (${g2} оқушы), 3-қатар (${g3} оқушы)`,
    summaryDistributionRu: `3 ряда: 1-й ряд (${g1} уч.), 2-й ряд (${g2} уч.), 3-й ряд (${g3} уч.)`,
    orgStageTeacherActionKk: `Сәлемдесу, түгелдеу.\nПлатформа арқылы сыныптағы ${studentsCount} оқушыны 3 топқа/қатарға теңдей бөлу: 1-қатар (${g1} оқушы), 2-қатар (${g2} оқушы), 3-қатар (${g3} оқушы).\n«Жылдам жауап» блиц-ойыны: жағымды психологиялық ахуал орнату, сабаққа зейінді шоғырландыру.\nЖауапкершілік: Әр оқушы өз жауабы үшін және өз қатары үшін жауап береді.`,
    orgStageTeacherActionRu: `Приветствие, перекличка.\nДеление ${studentsCount} учащихся на 3 ряда/группы через платформу: 1-й ряд (${g1} уч.), 2-й ряд (${g2} уч.), 3-й ряд (${g3} уч.).\nБлиц-опрос «Быстрый ответ»: создание благоприятного психологического климата.\nОтветственность: Каждый ученик отвечает за свой результат и за команду своего ряда.`,
    groupActivityTitleKk: `Топтық жұмыс: «Үш парта» жарыс ойыны (3 қатар: ${g1} + ${g2} + ${g3} = ${studentsCount} оқушы)`,
    groupActivityTitleRu: `Групповая работа: Игра «Три парты» (3 ряда: ${g1} + ${g2} + ${g3} = ${studentsCount} уч.)`,
    groupActivityTeacherActionKk: `«Үш парта» жарыс ойыны арқылы үш қатарды жарыстыра есеп шығарту:\n1-қатар (${g1} оқушы);\n2-қатар (${g2} оқушы);\n3-қатар (${g3} оқушы).\nӘділдік және жауапкершілік: Міндеттерді әділ бөлісіп, ортақ жауапкершілікті сезінеді, ойын ережесін қатаң сақтайды.`,
    groupActivityTeacherActionRu: `Организует соревнование трех рядов «Три парты»:\n1-й ряд (${g1} уч.);\n2-й ряд (${g2} уч.);\n3-й ряд (${g3} уч.).\nСправедливость и ответственность: Честное распределение ролей в команде, соблюдение правил.`,
    groupActivityStudentActionKk: `Үш қатар берілген тапсырмаларды толық ашып, барлық амалдары мен таңбаларын көрсете отырып тақтада және дәптерде шығарады:\nКомандада міндеттерді бөлісіп, жарыс ережесін сақтайды.`,
    groupActivityStudentActionRu: `Три ряда выполняют задания с подробной записью промежуточных вычислений на доске и в тетрадях:\nСоблюдают правила соревнования, поддерживают командный дух.`,
    groupNamesKk: [`1-қатар (${g1} оқушы)`, `2-қатар (${g2} оқушы)`, `3-қатар (${g3} оқушы)`],
    groupNamesRu: [`1-й ряд (${g1} уч.)`, `2-й ряд (${g2} уч.)`, `3-й ряд (${g3} уч.)`],
  };
}
