import _ from "lodash";

const TERM_REGEX = /\{(term_\w*)_(.)}/g;

const TERM_TYPES = [
  "term_program",
  "term_skill_short",
  "term_skill_full",
  "term_module",
  "term_selfpaced_module",
  "term_live_module",
  "term_mooc_module",
  "term_classroom_module",
  "term_buzz",
  "term_skillmaster",
  "term_learner",
  "term_administrator",
  "term_team",
  "term_journey",
  "term_artefact",

  // K-12 specific
  "term_course",
  "term_batch",
  "term_lesson",
  "term_topic",
  "term_teacher",
  "term_student",
];

// eslint-disable-next-line no-unused-vars
let isInitialize = false;
let userTerminology = {};

class LanguageHelper {
  static initializeLanguageHelper = (terminologyInfoString, userLocale) => {
    let terminologyInfoItems = terminologyInfoString
      ? terminologyInfoString[userLocale]
      : {};
    if (_.isEmpty(terminologyInfoItems)) {
      console.warn(
        `Language key "${userLocale}" not available. So fallback to english`
      );
      // console.log(terminologyInfoItems);

      if (terminologyInfoString && terminologyInfoString["en"]) {
        terminologyInfoItems = terminologyInfoString["en"];
      } else {
        terminologyInfoItems = defaultTerminologyInfoString;
      }
    }
    terminologyInfoItems.forEach(function (terminologyInfoItem) {
      userTerminology[terminologyInfoItem.itemIdentifier] = {
        singularForm: terminologyInfoItem.singularForm,
        pluralForm: terminologyInfoItem.pluralForm,
      };
    });
    isInitialize = true;
  };

  static isTerminologyExists = (termType) => {
    return TERM_TYPES.includes(termType);
  };

  static getSingularForm = (termType) => {
    if (this.isTerminologyExists(termType)) {
      return userTerminology[termType]?.singularForm || "";
    }
    return termType;
  };

  static getPluralForm = (termType) => {
    if (this.isTerminologyExists(termType)) {
      return userTerminology[termType]?.pluralForm || "";
    }
    return termType;
  };

  static getTermValue = (text) => {
    return text.replace(TERM_REGEX, (match, termType, multiplicity) => {
      return multiplicity === "1"
        ? this.getSingularForm(termType)
        : this.getPluralForm(termType);
    });
  };

  static getLanguageText = (key, i18n, valueObject = {}) => {
    return this.getTermValue(i18n.t(key, valueObject));
  };
}

const defaultTerminologyInfoString = [
  {
    itemIdentifier: "term_program",
    itemName: "Program",
    singularForm: "Program",
    pluralForm: "Programs",
    examples: ["Curriculum", "Business Unit"],
  },
  {
    itemIdentifier: "term_skill_short",
    itemName: "Skill",
    singularForm: "Skill",
    pluralForm: "Skills",
    examples: ["Course"],
  },
  {
    itemIdentifier: "term_skill_full",
    itemName: "Skill (in full)",
    singularForm: "Skill",
    pluralForm: "Skills",
    examples: ["Skill & Knowledge Area", "Proficiency"],
  },
  {
    itemIdentifier: "term_module",
    itemName: "Module",
    singularForm: "Module",
    pluralForm: "Modules",
    examples: ["Courselet", "Capsule"],
  },
  {
    itemIdentifier: "term_selfpaced_module",
    itemName: "Self-Paced Module",
    singularForm: "Self-Paced Module",
    pluralForm: "Self-Paced Modules",
    examples: ["Program Material"],
  },
  {
    itemIdentifier: "term_live_module",
    itemName: "Live Module",
    singularForm: "Live module",
    pluralForm: "Live modules",
    examples: ["Live Session", "Meeting"],
  },
  {
    itemIdentifier: "term_mooc_module",
    itemName: "MOOC Module",
    singularForm: "MOOC Module",
    pluralForm: "MOOC Modules",
    examples: ["Online Course", "External Module"],
  },
  {
    itemIdentifier: "term_classroom_module",
    itemName: "Classroom Module",
    singularForm: "Classroom Module",
    pluralForm: "Classroom Modules",
    examples: ["Workshop", "Training Program"],
  },
  {
    itemIdentifier: "term_buzz",
    itemName: "Buzz",
    singularForm: "Buzz",
    pluralForm: "Buzz",
    examples: ["Knowledge Feed", "Community Update"],
  },
  {
    itemIdentifier: "term_course",
    itemName: "Course",
    singularForm: "Course",
    pluralForm: "Courses",
    examples: ["Subject", "Field of Study"],
  },
  {
    itemIdentifier: "term_batch",
    itemName: "Batch",
    singularForm: "Batch",
    pluralForm: "Batches",
    examples: ["Group", "Section"],
  },
  {
    itemIdentifier: "term_lesson",
    itemName: "Lesson",
    singularForm: "Lesson",
    pluralForm: "Lessons",
    examples: ["Chapter", "Courselet"],
  },
  {
    itemIdentifier: "term_topic",
    itemName: "Topic",
    singularForm: "Topic",
    pluralForm: "Topics",
    examples: ["Lecture", "Subject Matter"],
  },
  {
    itemIdentifier: "term_teacher",
    itemName: "Teacher",
    singularForm: "Teacher",
    pluralForm: "Teachers",
    examples: ["Faculty Member", "Guru"],
  },
  {
    itemIdentifier: "term_student",
    itemName: "Student",
    singularForm: "Student",
    pluralForm: "Students",
    examples: ["Learner", "Disciple"],
  },
  {
    itemIdentifier: "term_skillmaster",
    itemName: "Skill Master",
    singularForm: "Skill Master",
    pluralForm: "Skill Masters",
    examples: ["Trainer", "Guru", "Jedi"],
  },
  {
    itemIdentifier: "term_learner",
    itemName: "Learner",
    singularForm: "Learner",
    pluralForm: "Learners",
    examples: ["Student", "Employee", "Trainee"],
  },
  {
    itemIdentifier: "term_administrator",
    itemName: "Administrator",
    singularForm: "Administrator",
    pluralForm: "Administrators",
    examples: ["Admin", "Controller"],
  },
  {
    itemIdentifier: "term_journey",
    itemName: "Journey",
    singularForm: "Disprz Journey",
    pluralForm: "Disprz Journey",
    examples: ["Learning Path", "Learning Journey"],
  },
  {
    itemIdentifier: "term_team",
    itemName: "Team",
    singularForm: "Disprz Team 1",
    pluralForm: "Disprz Teams 1",
    examples: ["Learning Tribes", "Groups"],
  },
  {
    itemIdentifier: "term_artefact",
    itemName: "Artefact",
    singularForm: "Artefact",
    pluralForm: "Artefacts",
    examples: ["Web-crawled Content", "Web Artefacts"],
  },
];
export default LanguageHelper;
