import { validateContainer } from "../../util/dom";
import { observeStoreByKey } from "../../store";
import handlebars from "handlebars";
import { ANSWER_GENERATOR_TEMPLATE } from "./templates";
import './answergenerator.scss';
import { askQuestion } from "../../actions/answergenerator";

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
    const answerEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer');
    const answerTextEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer-text');
    const answerCaretEl = document.querySelector('#' + this.conf.containerId + ' .adds-answer-caret');
    if (!answerEl || !answerTextEl || !answerCaretEl) {
      return;
    }
    const text = answerEl.getAttribute('data-answer');
    const typingSpeed = 30;
    const step = 3;

    function printCharacter() {
      if (i < text.length + step) {
        answerTextEl.innerHTML = text.slice(0, i);
        i += step;
        setTimeout(printCharacter, typingSpeed);
      } else {
        answerCaretEl.style.display = 'none';
      }
    }

    printCharacter();
  }

  render(answerGenerator) {
    const data = {
      question: answerGenerator.question,
      generatorResponse: answerGenerator.generatorResponse
    };


    // Compile HTML and inject to element if changed
    let html;
    const template = this.conf.template || ANSWER_GENERATOR_TEMPLATE;
    html = handlebars.compile(template)(data);

    if (this.renderedHtml === html) {
      return;
    }

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this.typeWriterEffect();
  }
}
