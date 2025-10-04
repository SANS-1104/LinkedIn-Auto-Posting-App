// file: backend/utils/linkedinTrends.js

import fs from 'fs';

// Load LinkedIn keyword scores from local JSON file
const rawData = fs.readFileSync('./data/linkedinKeywordScores.json');
const keywordMap = JSON.parse(rawData);

/**
 * Get LinkedIn popularity score for a given topic.
 * It checks if any keywords in the JSON file appear in the topic.
 * Returns the highest matching score (default fallback is 2.4).
 */
export function getMatchedKeywords(topic) {
  const lowerTopic = topic.toLowerCase();
  const matched = [];

  for (const keyword in keywordMap) {
    if (lowerTopic.includes(keyword.toLowerCase())) {
      matched.push({ keyword, score: keywordMap[keyword] });
    }
  } 

  return matched;
}


export function getLinkedInPopularityScore(topic) {
  const lowerTopic = topic.toLowerCase();
  const matched = [];

  let maxScore = 2.4; // fallback base value if no match

  for (const keyword in keywordMap) {
    if (lowerTopic.includes(keyword.toLowerCase())) {
      const score = keywordMap[keyword];
      matched.push({ keyword, score });
      if (score > maxScore) maxScore = score;
    }
  }

  if (matched.length > 0) {
    // console.log(`Matched LinkedIn Keywords for "${topic}":`, matched);
  } else {
    // console.log(`No LinkedIn keyword matched for "${topic}". Using fallback score: ${maxScore}`);
  }

  return maxScore; // return max matched score or fallback
}