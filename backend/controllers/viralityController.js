// backend/controllers/viralityController.js
import { getGoogleTrendsScore } from "../utils/googleTrends.js";
import {
  getLinkedInPopularityScore,
  getMatchedKeywords,
} from "../utils/linkedinTrends.js";

function normalizeTopic(topic) {
  if (!topic) return "";
  return String(topic).trim().toLowerCase().replace(/\s+/g, " ");
}

export async function getViralityScore(req, res) {
  try {
    const rawTopic = req.query.topic;
    if (!rawTopic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Normalize once and use everywhere
    const topic = normalizeTopic(rawTopic);

    // 1️⃣ Google Trends Score
    const googleRaw = await getGoogleTrendsScore(topic);
    const googleScore = Math.min(1, Math.max(0, parseFloat((googleRaw / 100).toFixed(2))));

    // 2️⃣ LinkedIn Popularity Score
    const matchedKeywords = getMatchedKeywords(topic);
    const rawLinkedIn = getLinkedInPopularityScore(topic);
    const minLinkedIn = 2.4;
    const maxLinkedIn = 4.8;
    const linkedinScore = Math.min(
      1,
      Math.max(
        0,
        parseFloat(((rawLinkedIn - minLinkedIn) / (maxLinkedIn - minLinkedIn)).toFixed(2))
      )
    );

    // 3️⃣ Weighted Final Score
    let baseScore = (0.4 * googleScore + 0.6 * linkedinScore) * 10;

    // Niche boost
    if (linkedinScore >= 0.9 && googleScore < 0.2) {
      baseScore = Math.max(baseScore, 6.5);
    }

    const viralityScore = parseFloat((baseScore * 10).toFixed(1));

    return res.json({
      topic,
      viralityScore,
      googleScore,
      linkedinScore,
      matchedKeywords,
    });
  } catch (err) {
    console.error("Virality Score Error:", err.message);
    res.status(500).json({ error: "Failed to calculate virality score" });
  }
}
