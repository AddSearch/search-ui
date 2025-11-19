import './aianswersresult.scss';
import handlebars from 'handlebars';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { validateContainer } from '../../util/dom';
import { observeStoreByKey } from '../../store';
import PRECOMPILED_AI_ANSWERS_RESULT_TEMPLATE from './precompile-templates/aianswersresult.handlebars';
import { registerHelper } from '../../util/handlebars';
import {
  putSentimentValueStory,
  SET_AI_ANSWERS_ANSWER_EXPANDED,
  SET_AI_ANSWERS_HIDDEN
} from '../../actions/aiAnswers';

// Animation constants
const ANIMATION_CONSTANTS = {
  SPEED_BOOST_MULTIPLIER: 2,
  INITIAL_WORD_COUNT: 1,
  DEFAULT_WORDS_PER_SECOND: 20
};

export default class AiAnswersresult {
  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;
    this.answerMaxHeight = conf.answerMaxHeight || 150;

    // Cached Redux state for change detection
    this.cachedLoadingState = false;
    this.cachedHiddenState = false;
    this.cachedSentimentState = 'neutral';

    // Dual-buffer typewriter system
    this.actualContent = ''; // Raw markdown from API (network timing)
    this.displayedWordCount = 0; // Words revealed so far (smooth timing)
    this.isAnimating = false;
    this.animationFrameId = null;
    this.lastFrameTime = 0;

    // Answer tracking
    this.lastAnswerId = null; // Last answer we've rendered (initial or partial)
    this.lastFinalizedAnswerId = null; // Last answer that received final render (complete with buttons/sources)
    this.shouldAnimateButtonsForCurrentAnswer = false; // Flag to animate buttons only on first final render

    // State tracking for animations
    this.lastStreamingState = false;
    this.isBoostedSpeed = false;

    // Configuration
    this.baseTypewriterSpeed = conf.typewriterSpeed || ANIMATION_CONSTANTS.DEFAULT_WORDS_PER_SECOND;
    this.typewriterSpeed = this.baseTypewriterSpeed;
    this.enableTypewriter = conf.enableTypewriter !== false;

    // Cache DOM elements
    this.answerTextElement = null;

    this.observeResultLoadingState();

    registerHelper('markdown', function (text) {
      if (typeof text !== 'string') {
        return '';
      }

      // Parse markdown to HTML
      const html = marked.parse(text, { breaks: true, gfm: true });

      // Sanitize HTML to prevent XSS attacks
      const cleanHtml = DOMPurify.sanitize(html);

      return new handlebars.SafeString(cleanHtml);
    });

    // Validate container exists (observer is in observeResultLoadingState)
    validateContainer(conf.containerId);

    // Initialize show/hide toggle state from local storage
    const storedHiddenState = localStorage.getItem('addSearch-isAiAnswersHidden');

    if (storedHiddenState !== null) {
      const isHidden = JSON.parse(storedHiddenState);
      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_HIDDEN,
        payload: isHidden
      });
    }

    if (this.conf.expandByDefault) {
      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_ANSWER_EXPANDED,
        payload: true
      });
    }

    // Setup event delegation (single listener for all buttons)
    this.setupEventDelegation();
  }

  // ========================================
  // Event Delegation & Handlers
  // ========================================
  // Single event listener on container delegates to all buttons
  // Prevents memory leaks from repeated addEventListener calls

  setupEventDelegation() {
    const container = document.getElementById(this.conf.containerId);
    if (!container) return;

    // Store bound handler for cleanup
    this.containerClickHandler = this.handleContainerClick.bind(this);
    container.addEventListener('click', this.containerClickHandler);

    // Store container reference for cleanup
    this.container = container;
  }

  handleContainerClick(e) {
    const target = e.target;

    // Copy button
    if (target.closest('.copy-btn')) {
      this.handleCopyClick();
      return;
    }

    // Thumbs up button
    if (target.closest('.thumbs-up-btn')) {
      this.handleThumbsUpClick();
      return;
    }

    // Thumbs down button
    if (target.closest('.thumbs-down-btn')) {
      this.handleThumbsDownClick();
      return;
    }

    // Show more/less button
    if (target.closest('.show-more-btn')) {
      this.handleShowMoreClick();
      return;
    }

    // Toggle switch
    if (target.closest('.toggle-switch input')) {
      this.handleToggleHideClick();
      return;
    }
  }

  handleCopyClick() {
    const answerText = document.querySelector('.answer-text')?.textContent;
    const copyConfirm = document.querySelector('.copy-confirm-message');

    if (!answerText || !copyConfirm) return;

    navigator.clipboard
      .writeText(answerText)
      .then(() => {
        copyConfirm.textContent = 'Answer copied!';
      })
      .catch((error) => {
        console.error('Failed to copy answer text with following error: ', error);
      });
  }

  handleThumbsUpClick() {
    const currentSearchState = this.reduxStore.getState().search;

    this.reduxStore.dispatch(
      putSentimentValueStory(
        this.client,
        currentSearchState.aiAnswersResult.id,
        currentSearchState.aiAnswersSentiment === 'positive' ? 'neutral' : 'positive'
      )
    );
  }

  handleThumbsDownClick() {
    const currentSearchState = this.reduxStore.getState().search;

    this.reduxStore.dispatch(
      putSentimentValueStory(
        this.client,
        currentSearchState.aiAnswersResult.id,
        currentSearchState.aiAnswersSentiment === 'negative' ? 'neutral' : 'negative'
      )
    );
  }

  handleShowMoreClick() {
    const answerContainer = document.querySelector('.answer-container');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const buttonText = showMoreBtn?.querySelector('.button-text');
    const fadeOutOverlay = answerContainer?.querySelector('.fade-out-overlay');
    const chevron = showMoreBtn?.querySelector('.chevron');

    if (!answerContainer || !showMoreBtn || !buttonText || !fadeOutOverlay || !chevron) return;

    const clickSearchState = this.reduxStore.getState().search;

    if (clickSearchState.isAiAnswersAnswerExpanded) {
      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_ANSWER_EXPANDED,
        payload: false
      });

      answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;
      buttonText.textContent = 'Show more';
      showMoreBtn.setAttribute('aria-expanded', 'false');
      fadeOutOverlay.style.display = 'block';
      chevron.style.transform = '';
    } else {
      this.reduxStore.dispatch({
        type: SET_AI_ANSWERS_ANSWER_EXPANDED,
        payload: true
      });

      answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
      buttonText.textContent = 'Show less';
      showMoreBtn.setAttribute('aria-expanded', 'true');
      fadeOutOverlay.style.display = 'none';
      chevron.style.transform = 'rotate(180deg)';
    }
  }

  handleToggleHideClick() {
    const isHidden = this.reduxStore.getState().search.isAiAnswersHidden;

    this.reduxStore.dispatch({
      type: SET_AI_ANSWERS_HIDDEN,
      payload: !isHidden
    });

    localStorage.setItem('addSearch-isAiAnswersHidden', JSON.stringify(!isHidden));
  }

  // ========================================
  // Observer Helper Methods
  // ========================================
  // These methods follow a consistent pattern for handling state changes:
  // - Return true: State change was handled, observer should exit early
  // - Return false: State change was not handled, observer should continue to next check
  // This creates a clean "chain of responsibility" for different types of state changes.

  handleStreamingUpdate(currentResult, newContent, isAiAnswersResultLoading) {
    // Ignore streaming updates if we're loading a new search
    if (isAiAnswersResultLoading) {
      return false; // Let it fall through to handle loading state
    }

    if (currentResult.isStreaming && newContent !== this.actualContent && this.answerTextElement) {
      this.actualContent = newContent;

      // Update loading state when streaming starts (loading is complete)
      if (this.cachedLoadingState) {
        this.cachedLoadingState = false;
      }

      if (!this.isAnimating && this.enableTypewriter && newContent) {
        this.startTypewriterAnimation();
      }
      this.lastStreamingState = currentResult.isStreaming;
      return true; // State handled - exit observer early
    }
    return false; // State not handled - continue to next check
  }

  handleSpeedBoost(currentResult, isAiAnswersResultLoading) {
    // Don't apply speed boost if we're loading a new search
    if (isAiAnswersResultLoading) {
      this.lastStreamingState = currentResult.isStreaming;
      return false; // State not handled - continue to next check
    }

    // Detect streaming-to-complete transition during animation
    // When streaming finishes but animation is still running (catching up),
    // boost speed to 2x to quickly show remaining content to user
    if (
      this.lastStreamingState && // Was streaming on last check
      !currentResult.isStreaming && // Now complete
      this.isAnimating && // Animation still running
      !this.isBoostedSpeed // Haven't boosted yet
    ) {
      this.typewriterSpeed = this.baseTypewriterSpeed * ANIMATION_CONSTANTS.SPEED_BOOST_MULTIPLIER;
      this.isBoostedSpeed = true;
      this.cachedLoadingState = isAiAnswersResultLoading;
      this.lastStreamingState = currentResult.isStreaming;
      return true; // State handled - exit observer early
    }

    this.lastStreamingState = currentResult.isStreaming;
    return false; // State not handled - continue to next check
  }

  handleFinalRenderWhenComplete(currentResult) {
    // When both streaming AND animation have completed, trigger final render
    // This shows the complete UI with buttons, sources, and full answer text
    if (
      !currentResult.isStreaming &&
      !this.isAnimating &&
      currentResult.answerText &&
      currentResult.id !== this.lastFinalizedAnswerId
    ) {
      this.lastFinalizedAnswerId = currentResult.id;
      this.render();
      return true; // State handled - exit observer early
    }
    return false; // State not handled - continue to next check
  }

  shouldSkipRenderDuringAnimation(state, currentResult, isAiAnswersResultLoading) {
    // Never skip render when starting a new search (loading spinner must show)
    if (isAiAnswersResultLoading) {
      return false;
    }

    return (
      this.isAnimating && !state.aiAnswersResultError && this.lastAnswerId === currentResult.id
    );
  }

  handleStateChanges(state, currentResult, isAiAnswersResultLoading, isAiAnswersHidden) {
    const currentSentiment = state.aiAnswersSentiment;

    const needsFullRender =
      this.cachedLoadingState !== isAiAnswersResultLoading ||
      this.lastAnswerId !== currentResult.id ||
      state.aiAnswersResultError ||
      this.cachedHiddenState !== isAiAnswersHidden ||
      this.cachedSentimentState !== currentSentiment;

    if (needsFullRender) {
      if (this.shouldSkipRenderDuringAnimation(state, currentResult, isAiAnswersResultLoading)) {
        this.cachedLoadingState = isAiAnswersResultLoading;
        this.cachedHiddenState = isAiAnswersHidden;
        this.cachedSentimentState = currentSentiment;
        return;
      }

      this.cachedLoadingState = isAiAnswersResultLoading;
      this.cachedHiddenState = isAiAnswersHidden;
      this.cachedSentimentState = currentSentiment;
      if (currentResult.id && currentResult.id !== this.lastAnswerId) {
        this.lastAnswerId = currentResult.id;
      }
      this.render();
    }
  }

  observeResultLoadingState() {
    observeStoreByKey(this.reduxStore, 'search', (state) => {
      const currentResult = state.aiAnswersResult;
      const newContent = currentResult.answerText;
      const isAiAnswersResultLoading = state.loadingAiAnswersResult;
      const isAiAnswersHidden = state.isAiAnswersHidden;

      // Handle streaming content updates
      if (this.handleStreamingUpdate(currentResult, newContent, isAiAnswersResultLoading)) return;

      // Handle speed boost on streaming completion
      if (this.handleSpeedBoost(currentResult, isAiAnswersResultLoading)) return;

      // Trigger final render when both streaming and animation complete
      if (this.handleFinalRenderWhenComplete(currentResult)) return;

      // Handle major state changes (errors, new answers, loading)
      this.handleStateChanges(state, currentResult, isAiAnswersResultLoading, isAiAnswersHidden);
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

    // During streaming: no height restrictions, let content grow naturally
    const currentSearchState = this.reduxStore.getState().search;
    const isStreaming = currentSearchState.aiAnswersResult.isStreaming;

    if (isStreaming) {
      answerContainer.style.maxHeight = 'none';
      showMoreBtn.style.display = 'none';
      fadeOutOverlay.style.display = 'none';
      return; // Exit early - apply normal logic after streaming completes
    }

    if (currentSearchState.isAiAnswersAnswerExpanded) {
      // Display "show less" button
      answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
      showMoreBtn.style.display = 'flex';
      buttonText.textContent = 'Show less';
      showMoreBtn.setAttribute('aria-expanded', 'true');

      fadeOutOverlay.style.display = 'none';
      chevron.style.transform = 'rotate(180deg)';
    } else {
      answerContainer.style.maxHeight = `${this.answerMaxHeight}px`;

      if (answerContainer.scrollHeight > this.answerMaxHeight) {
        // Only show "show more" button if the answer is longer than the max height
        showMoreBtn.style.display = 'flex';
        showMoreBtn.setAttribute('aria-expanded', 'false');
        fadeOutOverlay.style.display = 'block';
      } else {
        showMoreBtn.style.display = 'none';
        fadeOutOverlay.style.display = 'none';
      }
    }
  }

  parseMarkdown(content) {
    const html = marked.parse(content, { breaks: true, gfm: true });
    return DOMPurify.sanitize(html);
  }

  startTypewriterAnimation() {
    this.isAnimating = true;
    this.lastFrameTime = performance.now();
    this.displayedWordCount = ANIMATION_CONSTANTS.INITIAL_WORD_COUNT;
    this.animate();
  }

  stopTypewriterAnimation() {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  truncateHtmlAtWord(html, wordCount) {
    // Control flow constants for readability
    const STOP_PROCESSING = false;
    const CONTINUE_PROCESSING = true;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let wordsRevealed = 0;

    // Helper: Extract words from text node
    const getWordsFromNode = (node) => {
      return node.textContent.split(/\s+/).filter((w) => w.length > 0);
    };

    // Helper: Remove all siblings after a node
    const removeFollowingSiblings = (node) => {
      let sibling = node.nextSibling;
      while (sibling) {
        const next = sibling.nextSibling;
        sibling.remove();
        sibling = next;
      }
    };

    // Helper: Check if word limit reached
    const hasReachedLimit = () => {
      return wordsRevealed >= wordCount;
    };

    // Process text nodes: count and truncate words
    const processTextNode = (node) => {
      const words = getWordsFromNode(node);
      const remainingWords = wordCount - wordsRevealed;
      const wordsToShow = Math.min(words.length, remainingWords);

      // Handle case where we need to truncate mid-text
      if (wordsToShow < words.length) {
        node.textContent = words.slice(0, wordsToShow).join(' ');
        wordsRevealed += wordsToShow;
        return STOP_PROCESSING;
      }

      // Show all words in this text node
      wordsRevealed += words.length;

      if (hasReachedLimit()) {
        return STOP_PROCESSING;
      }

      return CONTINUE_PROCESSING;
    };

    // Process element nodes: recursively walk children
    const processElementNode = (node) => {
      const children = Array.from(node.childNodes);

      for (const child of children) {
        const shouldContinue = walkNodes(child);

        if (shouldContinue === STOP_PROCESSING) {
          removeFollowingSiblings(child);
          return STOP_PROCESSING;
        }
      }

      return CONTINUE_PROCESSING;
    };

    // Main recursive tree walker
    const walkNodes = (node) => {
      if (hasReachedLimit()) {
        return STOP_PROCESSING;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        return processTextNode(node);
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        return processElementNode(node);
      }

      return CONTINUE_PROCESSING;
    };

    walkNodes(tempDiv);
    return tempDiv.innerHTML;
  }

  calculateDeltaTime() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    return delta;
  }

  getWordsFromContent() {
    return this.actualContent.split(/\s+/);
  }

  updateDisplayProgress(totalWords, deltaTime) {
    const targetIndex = Math.floor(this.displayedWordCount);

    if (targetIndex < totalWords) {
      const wordsToAdd = (deltaTime / 1000) * this.typewriterSpeed;
      this.displayedWordCount += wordsToAdd;
    }
    // Else: frozen, waiting for more content
  }

  hasMoreWordsToReveal(current, total) {
    return current < total;
  }

  revealWords(wordCount) {
    const fullHtml = this.parseMarkdown(this.actualContent);
    const displayedHtml = this.truncateHtmlAtWord(fullHtml, wordCount);
    this.updateAnswerTextOnly(displayedHtml);
  }

  scheduleNextFrame() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  handleAnimationReachedEnd() {
    // Animation has revealed all currently available words
    // Show full content while we decide next step
    const displayedHtml = this.parseMarkdown(this.actualContent);
    this.updateAnswerTextOnly(displayedHtml);

    const currentSearchState = this.reduxStore.getState().search;
    const currentResult = currentSearchState.aiAnswersResult;
    const isStreamingComplete = !currentResult.isStreaming;

    if (isStreamingComplete) {
      // Streaming is done, finalize the answer
      this.finalizeAnimation(currentResult.id);
    } else {
      // Streaming still active, keep animation loop running and wait for more content
      this.waitForMoreContent();
    }
  }

  finalizeAnimation(answerId) {
    this.stopTypewriterAnimation();

    if (answerId !== this.lastFinalizedAnswerId) {
      this.finalizeAnswer(answerId);
    }
  }

  finalizeAnswer(answerId) {
    this.lastFinalizedAnswerId = answerId;
    this.shouldAnimateButtonsForCurrentAnswer = true; // Flag: next render should animate
    this.render();
    this.shouldAnimateButtonsForCurrentAnswer = false; // Reset after render
  }

  waitForMoreContent() {
    this.scheduleNextFrame();
  }

  animate() {
    if (!this.isAnimating) return;

    const deltaTime = this.calculateDeltaTime();
    const words = this.getWordsFromContent();

    // Update display progress
    this.updateDisplayProgress(words.length, deltaTime);

    const targetWord = Math.floor(this.displayedWordCount);

    if (this.hasMoreWordsToReveal(targetWord, words.length)) {
      this.revealWords(targetWord);
      this.scheduleNextFrame();
    } else {
      this.handleAnimationReachedEnd();
    }
  }

  updateAnswerTextOnly(htmlContent) {
    // Re-query element each time to handle DOM changes
    this.answerTextElement = document.querySelector('.answer-text');

    if (this.answerTextElement) {
      this.answerTextElement.innerHTML = htmlContent;
    }
  }

  render() {
    const currentSearchState = this.reduxStore.getState().search;
    const currentAiAnswersResult = currentSearchState.aiAnswersResult;
    const currentlyLoadingAiAnswersResult = currentSearchState.loadingAiAnswersResult;
    const currentKeywordState = this.reduxStore.getState().keyword;
    const keyword = currentKeywordState.value;
    const hadErrorFetchingAiAnswersResult = currentSearchState.aiAnswersResultError;

    const handlebarTemplateProps = {
      mainHeadlineText: this.conf.mainHeadlineText || 'Answer',
      answerText: currentAiAnswersResult.answerText,
      sourcesHeadlineText: this.conf.sourcesHeadlineText || 'Sources:',
      sources: currentAiAnswersResult.sources,
      aiExplanationText: this.conf.aiExplanationText || 'Generated by AI, may contain errors.',
      isResultLoading: currentlyLoadingAiAnswersResult,
      hadError: hadErrorFetchingAiAnswersResult,
      sentimentState: currentSearchState.aiAnswersSentiment,
      showHideToggle: this.conf.hasHideToggle === undefined ? true : this.conf.hasHideToggle,
      isHidden: currentSearchState.isAiAnswersHidden,
      shouldAnimateButtons: this.shouldAnimateButtonsForCurrentAnswer
    };

    // Compile HTML and inject to element if changed
    let html;

    if (currentAiAnswersResult.answerText || keyword) {
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

    // Cache DOM element reference after render
    this.answerTextElement = document.querySelector('.answer-text');

    // Reset animation state for new answer OR when new search interrupts animation
    const isNewAnswer = currentAiAnswersResult.id !== this.lastAnswerId;
    const newSearchInterruptedAnimation = currentlyLoadingAiAnswersResult && this.isAnimating;

    if (isNewAnswer || newSearchInterruptedAnimation) {
      // Stop animation completely
      this.stopTypewriterAnimation();

      // Clear all content buffers
      this.actualContent = '';
      this.displayedWordCount = 0;

      // Reset speed and boost state
      this.typewriterSpeed = this.baseTypewriterSpeed;
      this.isBoostedSpeed = false;

      // Clear tracking state
      this.lastStreamingState = false;
      this.lastFinalizedAnswerId = null;
      this.shouldAnimateButtonsForCurrentAnswer = false;
    }

    this.setupShowMoreButton();

    // Execute callback for when rendering is complete (if configured)
    if (
      this.conf.renderCompleteCallback &&
      typeof this.conf.renderCompleteCallback === 'function'
    ) {
      this.conf.renderCompleteCallback();
    }
  }
}
