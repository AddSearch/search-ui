import './aianswersresult.scss';
import handlebars from 'handlebars';
import { marked } from 'marked';
import { validateContainer } from '../../util/dom';
import { observeStoreByKey } from '../../store';
import PRECOMPILED_AI_ANSWERS_RESULT_TEMPLATE from './precompile-templates/aianswersresult.handlebars';
import { registerHelper } from '../../util/handlebars';
import {
  putSentimentValueStory,
  SET_AI_ANSWERS_ANSWER_EXPANDED,
  SET_AI_ANSWERS_HIDDEN
} from '../../actions/aiAnswers';

export default class AiAnswersresult {
  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;
    this.answerMaxHeight = conf.answerMaxHeight || 150;
    this.isSearchResultLoading = false;
    this.observeResultLoadingState();

    registerHelper('markdown', function (text) {
      if (typeof text !== 'string') {
        return '';
      }

      return new handlebars.SafeString(marked.parse(text, { breaks: true, gfm: true }));
    });

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', () => this.render());
    }

    // Initialize show/hide toggle state from local storage
    const storedHiddenState = localStorage.getItem('addSearch-isAiAnswersHidden');

    if (storedHiddenState !== null) {
      const isHidden = JSON.parse(storedHiddenState);
      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_HIDDEN,
        payload: isHidden
      });
    }
  }

  observeResultLoadingState() {
    this.reduxStore.subscribe(() => {
      const isAiAnswersResultLoading = this.reduxStore.getState().search.loadingAiAnswersResult;

      if (this.isSearchResultLoading !== isAiAnswersResultLoading) {
        this.isSearchResultLoading = isAiAnswersResultLoading;
        this.render();
      }
    });
  }

  setupHideAIAnswersToggle() {
    const aiAnswersResultContainer = document.querySelector('.addsearch-ai-answers-result');

    const toggleSwitch = document.querySelector('.toggle-switch input');

    if (!aiAnswersResultContainer || !toggleSwitch) {
      return;
    }

    toggleSwitch.addEventListener('change', () => {
      const isHidden = this.reduxStore.getState().search.isAiAnswersHidden;

      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_HIDDEN,
        payload: !isHidden
      });

      localStorage.setItem('addSearch-isAiAnswersHidden', JSON.stringify(!isHidden));
    });
  }

  setupShowMoreButton() {
    const answerContainer = document.querySelector('.answer-container');
    const fadeOutOverlay = answerContainer && answerContainer.querySelector('.fade-out-overlay');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const buttonText = showMoreBtn && showMoreBtn.querySelector('.button-text');
    const chevron = showMoreBtn && showMoreBtn.querySelector('.chevron');

    if (!answerContainer || !fadeOutOverlay || !showMoreBtn || !buttonText || !chevron) {
      return;
    }

    if (this.reduxStore.getState().search.isAiAnswersAnswerExpanded) {
      // Display "show less" button
      answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
      showMoreBtn.style.display = 'flex';
      buttonText.textContent = 'Show less';

      fadeOutOverlay.style.display = 'none';
      chevron.style.transform = 'rotate(180deg)';
    } else {
      answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;

      if (answerContainer.scrollHeight > this.answerMaxHeight) {
        // Only show "show more" button if the answer is longer than the max height
        showMoreBtn.style.display = 'flex';
        fadeOutOverlay.style.display = 'block';
      } else {
        showMoreBtn.style.display = 'none';
        fadeOutOverlay.style.display = 'none';
      }
    }

    showMoreBtn.addEventListener('click', () => {
      if (this.reduxStore.getState().search.isAiAnswersAnswerExpanded) {
        this.reduxStore.dispatch({
          type: SET_AI_ANSWERS_ANSWER_EXPANDED,
          payload: false
        });

        answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;
        buttonText.textContent = 'Show more';
        fadeOutOverlay.style.display = 'block';

        chevron.style.transform = '';
      } else {
        this.reduxStore.dispatch({
          type: SET_AI_ANSWERS_ANSWER_EXPANDED,
          payload: true
        });

        answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
        buttonText.textContent = 'Show less';
        fadeOutOverlay.style.display = 'none';

        chevron.style.transform = 'rotate(180deg)';
      }
    });
  }

  setupActionButtons() {
    const aiAnswersResultContainer = document.querySelector('.addsearch-ai-answers-result');

    const copyButton =
      aiAnswersResultContainer && aiAnswersResultContainer.querySelector('.copy-btn');

    const copyConfirm = aiAnswersResultContainer.querySelector('.copy-confirm-message');
    const thumbsUpButton = aiAnswersResultContainer.querySelector('.thumbs-up-btn');
    const thumbsDownButton = aiAnswersResultContainer.querySelector('.thumbs-down-btn');

    if (
      !aiAnswersResultContainer ||
      !copyButton ||
      !copyConfirm ||
      !thumbsUpButton ||
      !thumbsDownButton
    ) {
      return;
    }

    copyButton.addEventListener('click', () => {
      const answerText = document.querySelector('.answer-text').textContent;
      navigator.clipboard
        .writeText(answerText)
        .then(() => {
          copyConfirm.textContent = 'Answer copied!';
        })
        .catch((error) => {
          console.error('Failed to copy answer text with following error: ', error);
        });
    });

    thumbsUpButton.addEventListener('click', () => {
      const currentSearchState = this.reduxStore.getState().search;

      this.reduxStore.dispatch(
        putSentimentValueStory(
          this.client,
          currentSearchState.aiAnswersResult.id,
          currentSearchState.aiAnswersSentiment === 'positive' ? 'neutral' : 'positive'
        )
      );
    });

    thumbsDownButton.addEventListener('click', () => {
      const currentSearchState = this.reduxStore.getState().search;
      this.reduxStore.dispatch(
        putSentimentValueStory(
          this.client,
          currentSearchState.aiAnswersResult.id,
          currentSearchState.aiAnswersSentiment === 'negative' ? 'neutral' : 'negative'
        )
      );
    });
  }

  render() {
    const currentSearchState = this.reduxStore.getState().search;
    const currentAiAnswersResult = currentSearchState.aiAnswersResult;
    const currentlyLoadingAiAnswersResult = currentSearchState.loadingAiAnswersResult;
    const keyword = currentSearchState.keyword;
    const hadErrorFetchingAiAnswersResult = currentSearchState.aiAnswersResultError;

    const handlebarTemplateProps = {
      mainHeadlineText: this.conf.mainHeadlineText || 'Answer',
      subHeadlineText: keyword,
      answerText: currentAiAnswersResult.answerText,
      sourcesHeadlineText: this.conf.sourcesHeadlineText || 'Sources:',
      sources: currentAiAnswersResult.sources,
      aiExplanationText: this.conf.aiExplanationText || 'Generated by AI, may contain errors.',
      isResultLoading: this.isSearchResultLoading,
      hadError: hadErrorFetchingAiAnswersResult,
      sentimentState: currentSearchState.aiAnswersSentiment,
      showHideToggle: this.conf.hasHideToggle === undefined ? true : this.conf.hasHideToggle,
      isHidden: currentSearchState.isAiAnswersHidden
    };

    // Compile HTML and inject to element if changed
    let html;

    if (currentAiAnswersResult.answerText || (keyword && currentlyLoadingAiAnswersResult)) {
      if (this.conf.precompiledTemplate) {
        html = this.conf.precompiledTemplate(handlebarTemplateProps);
      } else if (this.conf.template) {
        html = handlebars.compile(this.conf.template)(handlebarTemplateProps);
      } else {
        html = PRECOMPILED_AI_ANSWERS_RESULT_TEMPLATE(handlebarTemplateProps);
      }
    }

    if (!html || this.renderedHtml === html) {
      return;
    }

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this.setupHideAIAnswersToggle();
    this.setupShowMoreButton();
    this.setupActionButtons();

    // Execute callback for when rendering is complete (if configured)
    if (
      this.conf.renderCompleteCallback &&
      typeof this.conf.renderCompleteCallback === 'function'
    ) {
      this.conf.renderCompleteCallback();
    }
  }
}
