/**
 * @typedef {Object} Source
 * @property {string} url - The URL of the source
 * @property {string} title - The title of the source
 */

/**
 * @typedef {Object} AiAnswersResponse
 * @property {Object} response
 * @property {string} response.answer - The answer text
 * @property {string} response.conversation_id - The answer ID
 * @property {Object} response.source_documents
 * @property {Array<Object>} response.source_documents.hits - Array of source documents
 */

/**
 * @typedef {Object} AiAnswersData
 * @property {string} id - The answer ID
 * @property {string} answerText - The answer text
 * @property {Array<Source>} sources - Array of sources
 */

/**
 * Creates a structured data object from a AI answers response
 * @param {AiAnswersResponse} aiAnswersResponse - The response from the AI answers
 * @returns {AiAnswersData} The structured data for the search result
 */
export function createAiAnswersData(aiAnswersResponse) {
  return {
    id: aiAnswersResponse.conversation_id,
    answerText: aiAnswersResponse.answer || '',
    sources:
      aiAnswersResponse.source_documents?.hits?.map((hit) => ({
        url: hit.url,
        title: hit.title
      })) || []
  };
}
