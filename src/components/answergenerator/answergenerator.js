import { validateContainer } from "../../util/dom";
import { observeStoreByKey } from "../../store";
import handlebars from "handlebars";
import './answergenerator.scss';
import { askQuestion } from "../../actions/answergenerator";
import PRECOMPILED_ANSWERGENERATOR_TEMPLATE from "./precompile-templates/answergenerator.handlebars";

export default class AnswerGenerator {

  constructor(client, reduxStore, conf) {
    this.client = conf.client || client;
    this.conf = conf;
    this.reduxStore = reduxStore;
    this.previousQuestion = null;
    this.previousAnswer = null;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'answergenerator', (state) => {
        if (state.question === this.previousQuestion) {
          return;
        }
        this.previousQuestion = state.question;
        if (!this.conf.triggerOnNoResults) {
          this.reduxStore.dispatch(askQuestion(this.client, state.question, this.reduxStore));
        }
      });

      observeStoreByKey(this.reduxStore, 'answergenerator', (state) => {
        if (state.generatorResponse === this.previousAnswer) {
          return;
        }
        this.previousAnswer = state.generatorResponse;
        this.render(state);
      });
    }

    if (this.conf.triggerOnNoResults) {
      observeStoreByKey(this.reduxStore, 'search', (state) => {
        if (state && state.results && state.results.hits && state.results.hits.length === 0 &&
          this.previousQuestion) {
          this.reduxStore.dispatch(askQuestion(this.client, this.previousQuestion, this.reduxStore));
        }
      });
    }
  }

  typeWriterEffect() {
    let i = 0;
    const containerId = this.conf.containerId;
    const answerEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer');
    const answerTextEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer-text');
    const answerCaretEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer-caret');
    if (!answerEl || !answerTextEl || !answerCaretEl) {
      return;
    }
    const text = answerEl.getAttribute('data-answer');
    const textFormatted = text.replace(/\n/g, '<br>');
    const typingSpeed = 30;
    const step = 3;

    function showRelatedResults() {
      const relatedResultsEl = document.querySelector('#' + containerId + ' .adds-related-results');
      if (relatedResultsEl) {
        relatedResultsEl.classList.remove('hidden');
      }
    }

    function printCharacter() {
      if (i < textFormatted.length + step) {
        answerTextEl.innerHTML = textFormatted.slice(0, i);
        i += step;
        setTimeout(printCharacter, typingSpeed);
      } else {
        answerCaretEl.style.display = 'none';
        showRelatedResults();
      }
    }

    printCharacter();
  }

  render(answerGenerator) {
    const data = {
      question: answerGenerator.question,
      generatorResponse: answerGenerator.generatorResponse,
      relatedResults: answerGenerator.relatedResults
    };


    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else if (this.conf.template) {
      html = handlebars.compile(this.conf.template)(data);
    } else {
      html = PRECOMPILED_ANSWERGENERATOR_TEMPLATE(data);
    }

    if (this.renderedHtml === html) {
      return;
    }

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this.typeWriterEffect();
  }
}
