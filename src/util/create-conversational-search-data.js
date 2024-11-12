/**
 * @typedef {Object} Source
 * @property {string} url - The URL of the source
 * @property {string} title - The title of the source
 */

/**
 * @typedef {Object} ConversationalSearchResponse
 * @property {Object} response
 * @property {string} response.answer - The answer text
 * @property {Object} response.sourceDocuments
 * @property {Array<Object>} response.sourceDocuments.hits - Array of source documents
 */

/**
 * @typedef {Object} ConversationalSearchData
 * @property {string} answerText - The answer text
 * @property {Array<Source>} sources - Array of sources
 */

/**
 * Creates a structured data object from a conversational search response
 * @param {ConversationalSearchResponse} conversationalSearchResponse - The response from the conversational search
 * @returns {ConversationalSearchData} The structured data for the search result
 */
export function createConversationalSearchData(conversationalSearchResponse) {
  return {
    answerText: conversationalSearchResponse.answer || '',
    sources:
      conversationalSearchResponse.sourceDocuments?.hits?.map((hit) => ({
        url: hit.url,
        title: hit.title
      })) || []
  };
}
