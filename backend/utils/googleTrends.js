// utils/googleTrends.js
import googleTrends from "google-trends-api";

const trendsCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Normalize topic to avoid duplicates: trim, lowercase, single space
function normalizeTopic(topic) {
  if (!topic) return "";
  return String(topic).trim().toLowerCase().replace(/\s+/g, " ");
}

function extractKeywords(topic) {
  const stopwords = ["can", "of", "the", "a", "an", "is", "are", "to", "for", "do", "will"];
  return topic
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !stopwords.includes(w))
    .join(" ");
}

export async function getGoogleTrendsScore(topic) {
  // Step 1: normalize + stopword filter
  const cleanTopic = normalizeTopic(topic);
  const keyword = extractKeywords(cleanTopic) || cleanTopic;

  // Skip invalid
  if (!keyword || keyword.length < 2) {
    console.warn("Skipping invalid/too-short keyword:", keyword);
    return 0;
  }

  // Step 2: cache check
  if (trendsCache.has(keyword)) {
    const { score, timestamp } = trendsCache.get(keyword);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log("Returning cached Google Trends score for:", `"${keyword}"`);
      return score;
    }
  }

  // Step 3: request to Google Trends
  try {
    console.log("Sending to Google Trends:", `"${keyword}"`);

    const results = await googleTrends.interestOverTime({
      keyword,
      geo: "IN",
      timeframe: "now 7-d",
    });

    let parsed;
    try {
      parsed = JSON.parse(results);
    } catch (parseErr) {
      console.error("Google Trends returned non-JSON (possible block)");
      return 0;
    }

    const timeline = parsed?.default?.timelineData;
    if (!timeline?.length) {
      console.warn("No Google Trends data for keyword:", keyword);
      return 0;
    }

    const values = timeline
      .map((item) => Number(item.value[0]))
      .filter((v) => !isNaN(v));

    if (!values.length) {
      console.warn("No numeric data in Google Trends for keyword:", keyword);
      return 0;
    }

    const avg = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

    console.log("Google Trends Score for", `"${keyword}"`, ":", avg);

    // Step 4: save in cache
    trendsCache.set(keyword, { score: avg, timestamp: Date.now() });

    return avg;
  } catch (err) {
    console.error("Error fetching Google Trends score:", err.message);
    return 0;
  }
}
