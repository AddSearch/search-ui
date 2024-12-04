import './conversationalsearchresult.scss';
import handlebars from 'handlebars';
import { marked } from 'marked';
import { validateContainer } from '../../util/dom';
import { observeStoreByKey } from '../../store';
import PRECOMPILED_CONVERSATIONAL_SEARCH_RESULT_TEMPLATE from './precompile-templates/conversationalsearchresult.handlebars';
import { registerHelper } from '../../util/handlebars';
import {
  putSentimentValueStory,
  SET_CONVERSATIONAL_SEARCH_ANSWER_EXPANDED,
  SET_CONVERSATIONAL_SEARCH_HIDDEN
} from '../../actions/conversationalsearch';

export default class ConversationalSearchResult {
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
    const storedHiddenState = localStorage.getItem('addSearch-isConversationalSearchHidden');

    if (storedHiddenState !== null) {
      const isHidden = JSON.parse(storedHiddenState);
      this.reduxStore.dispatch({
        type: SET_CONVERSATIONAL_SEARCH_HIDDEN,
        payload: isHidden
      });
    }
  }

  observeResultLoadingState() {
    this.reduxStore.subscribe(() => {
      const isConversationalSearchResultLoading =
        this.reduxStore.getState().search.loadingConversationalSearchResult;

      if (this.isSearchResultLoading !== isConversationalSearchResultLoading) {
        this.isSearchResultLoading = isConversationalSearchResultLoading;
        this.render();
      }
    });
  }

  setupHideConversationalSearchToggle() {
    const conversationalSearchResultContainer = document.querySelector(
      '.addsearch-conversational-search-result'
    );

    const toggleSwitch = document.querySelector('.toggle-switch input');

    if (!conversationalSearchResultContainer || !toggleSwitch) {
      return;
    }

    toggleSwitch.addEventListener('change', () => {
      const isHidden = this.reduxStore.getState().search.isConversationalSearchHidden;
      console.log('Toggle hide / show - setting it to: ', !isHidden);

      this.reduxStore.dispatch({
        type: SET_CONVERSATIONAL_SEARCH_HIDDEN,
        payload: !isHidden
      });

      localStorage.setItem('addSearch-isConversationalSearchHidden', JSON.stringify(!isHidden));
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

    if (this.reduxStore.getState().search.isConversationalSearchAnswerExpanded) {
      answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
      showMoreBtn.style.display = 'none';
      fadeOutOverlay.style.display = 'none';
    } else {
      answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;

      if (answerContainer.scrollHeight > this.answerMaxHeight) {
        showMoreBtn.style.display = 'flex';
        fadeOutOverlay.style.display = 'block';
      } else {
        showMoreBtn.style.display = 'none';
        fadeOutOverlay.style.display = 'none';
      }
    }

    showMoreBtn.addEventListener('click', () => {
      if (this.reduxStore.getState().search.isConversationalSearchAnswerExpanded) {
        this.reduxStore.dispatch({
          type: SET_CONVERSATIONAL_SEARCH_ANSWER_EXPANDED,
          payload: false
        });

        answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;
        buttonText.textContent = 'Show more';
        fadeOutOverlay.style.display = 'block';
        chevron.style.transform = '';
      } else {
        this.reduxStore.dispatch({
          type: SET_CONVERSATIONAL_SEARCH_ANSWER_EXPANDED,
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
    const conversationalSearchResultContainer = document.querySelector(
      '.addsearch-conversational-search-result'
    );

    const copyButton =
      conversationalSearchResultContainer &&
      conversationalSearchResultContainer.querySelector('.copy-btn');

    const copyConfirm = conversationalSearchResultContainer.querySelector('.copy-confirm-message');
    const thumbsUpButton = conversationalSearchResultContainer.querySelector('.thumbs-up-btn');
    const thumbsDownButton = conversationalSearchResultContainer.querySelector('.thumbs-down-btn');

    if (
      !conversationalSearchResultContainer ||
      !copyButton ||
      !copyConfirm ||
      !thumbsUpButton ||
      !thumbsDownButton
    ) {
      return;
    }

    copyButton.addEventListener('click', () => {
      const answerText = document.querySelector('.answer-text').textContent;
      console.log('Copy clicked, TODO connect to BE!');
      navigator.clipboard
        .writeText(answerText)
        .then(() => {
          copyConfirm.textContent = 'Answer copied!';

          console.log('Answer successfull copied, TODO connect to BE!');
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
          currentSearchState.conversationalSearchResult.id,
          currentSearchState.conversationalSearchSentiment === 'positive' ? 'neutral' : 'positive'
        )
      );
    });

    thumbsDownButton.addEventListener('click', () => {
      const currentSearchState = this.reduxStore.getState().search;
      this.reduxStore.dispatch(
        putSentimentValueStory(
          this.client,
          currentSearchState.conversationalSearchResult.id,
          currentSearchState.conversationalSearchSentiment === 'negative' ? 'neutral' : 'negative'
        )
      );
    });
  }

  render() {
    const currentSearchState = this.reduxStore.getState().search;
    const currentConversationalSearchResult = currentSearchState.conversationalSearchResult;
    const currentlyLoadingConversationSearchResult =
      currentSearchState.loadingConversationalSearchResult;
    const keyword = currentSearchState.keyword;
    const hadErrorFetchingConversationalSearchResult =
      currentSearchState.conversationalSearchResultError;

    const handlebarTemplateProps = {
      mainHeadlineText: this.conf.mainHeadlineText || 'Answer',
      subHeadlineText: keyword,
      answerText: currentConversationalSearchResult.answerText,
      sourcesHeadlineText: this.conf.sourcesHeadlineText || 'Sources:',
      sources: currentConversationalSearchResult.sources,
      aiExplanationText: this.conf.aiExplanationText || 'Generated by AI, may contain errors.',
      isResultLoading: this.isSearchResultLoading,
      hadError: hadErrorFetchingConversationalSearchResult,
      sentimentState: currentSearchState.conversationalSearchSentiment,
      showHideToggle: this.conf.hasHideToggle === undefined ? true : this.conf.hasHideToggle,
      isHidden: currentSearchState.isConversationalSearchHidden
    };

    // Compile HTML and inject to element if changed
    let html;

    if (
      currentConversationalSearchResult.answerText ||
      (keyword && currentlyLoadingConversationSearchResult)
    ) {
      if (this.conf.precompiledTemplate) {
        html = this.conf.precompiledTemplate(handlebarTemplateProps);
      } else if (this.conf.template) {
        html = handlebars.compile(this.conf.template)(handlebarTemplateProps);
      } else {
        html = PRECOMPILED_CONVERSATIONAL_SEARCH_RESULT_TEMPLATE(handlebarTemplateProps);
      }
    }

    if (!html || this.renderedHtml === html) {
      return;
    }

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this.setupHideConversationalSearchToggle();
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
