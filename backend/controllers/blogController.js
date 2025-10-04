// // file: controllers/blogController.js

// import axios from "axios";
// import User from "../models/User.js";
// import Post from "../models/Post.js";
// import fetch from "node-fetch";
// import mime from "mime-types";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { generateImageFromPrompt } from "../config/generateImage.js";
// import { postToLinkedIn } from "../utils/postToLinkedIn.js";

// // ------------------ Topic Suggestion using Gemini ------------------
// export async function getTopicSuggestions(req, res) {
//   const { q } = req.query;

//   if (!q || q.length < 2) {
//     return res.status(400).json({ suggestions: [] });
//   }

//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `Suggest 5 short LinkedIn blog topics related to: "${q}". Respond with a plain comma-separated list only.`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text().trim();

//     const suggestions = text.split(",").map((s) => s.trim()).filter(Boolean);
//     res.status(200).json({ suggestions });
//   } catch (error) {
//     console.error("Gemini topic suggestion error:", error.message);
//     res.status(500).json({ message: "Gemini topic suggestion failed" });
//   }
// }

// // ------------------ Generate Blog ------------------
// export async function generateBlog(req, res) {
//   // console.log("Received virality score: ", req.body.viralityScore);
  
//   const { topic, wordCount, language = "english", tone = "professional", viralityScore = 50, status: payloadStatus } = req.body; 

//   // console.log("Received virality score 2: ", req.body.viralityScore);

//   const payload = topic
//     ? { topic, wordCount, language, tone, viralityScore }
//     : { language, tone, viralityScore };

//   let linkedInPosted = false;
//   let linkedinPostUrn = null;

//   try {
//     const response = await axios.post(
//       "https://lavi0105.app.n8n.cloud/webhook/generatePost",
//       payload
//     );

//     const blogData = response.data;
//     const user = await User.findById(req.user.id);

//     const title = blogData.video_title || blogData.title || topic || "Generated Blog";
//     const script = blogData.script || blogData.generated_text || "";

//     let imageUrl = blogData.image || blogData.picture || req.body.image || null;

//     // ✅ Auto-post to LinkedIn if enabled
//     if (
//       user.autoPostToLinkedIn &&
//       user.linkedinAccessToken &&
//       user.linkedinPersonURN &&
//       script.trim().length > 0
//     ) {
//       try {
//         const result = await postToLinkedIn(user, {
//           title,
//           content: script,
//           image: imageUrl,
//         });

//         linkedinPostUrn = result.postId;
//         linkedInPosted = true;
//       } catch (err) {
//         console.error("❌ LinkedIn auto-post failed:", err.message);
//       }
//     }

//     // ✅ Save as draft
//     await Post.create({
//       user: req.user.id,
//       title,
//       content: script,
//       image: imageUrl,
//       linkedinPostUrn,
//       status: linkedInPosted ? "posted" : payloadStatus || "draft",
//       viralityScore : Number(viralityScore),
//     });

//     res.json({ ...blogData, image: imageUrl, linkedInPosted });
//   } catch (err) {
//     console.error("❌ Blog generation error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Blog generation failed" });
//   }
// }  

// // ------------------ Generate Blog (No Auto-Post) ------------------
// export async function generateBlogOnly(req, res) {
//   const {
//     topic,
//     wordCount,
//     tone = "professional",
//     language = "english",
//     imageOption,
//     viralityScore = 5
//   } = req.body;

//   const payload = topic
//     ? { topic, wordCount, language, tone, viralityScore }
//     : { language, tone, wordCount, viralityScore };

//   try {
//     const response = await axios.post(
//       "https://lavi0105.app.n8n.cloud/webhook/generatePost",
//       payload
//     );

//     const blogData = response.data;

//     const title = blogData.video_title || blogData.title || topic || "Generated Blog";
//     const script = blogData.script || blogData.generated_text || "";
//     let imageUrl = blogData.image || blogData.picture || req.body.image || null;

//     if (!imageUrl && imageOption === "generate") {
//       try {
//         const generatedImage = await generateImageFromPrompt(title);
//         if (generatedImage?.trim()) {
//           imageUrl = generatedImage;
//         }
//       } catch (err) {
//         console.warn("⚠️ Failed to generate image from prompt:", err.message);
//       }
//     }

//     res.json({ title, script, image: imageUrl || "" });
//   } catch (err) {
//     console.error("❌ Blog-only generation error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Blog-only generation failed" });
//   }
// }

// // ------------------ Manual LinkedIn Post ------------------
// export async function manualLinkedInPost(req, res) {
//   let { title, content, image, blogId,viralityScore } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user.linkedinAccessToken || !user.linkedinPersonURN) {
//       return res.status(400).json({ error: "LinkedIn not connected" });
//     }

//     title = (title || "Generated Post").trim();

//     const result = await postToLinkedIn(user, { title, content, image });
//     const linkedinPostUrn = result.postId;

//     // ✅ If blogId is provided, update the post with LinkedIn URN
//     if (blogId) {
//       await Post.findByIdAndUpdate(blogId, { linkedinPostUrn, status: "posted" });
//     }

//     res.json({ success: true, linkedinPostUrn });
//   } catch (err) {
//     console.error("❌ Manual LinkedIn post failed:", err.message);
//     res.status(500).json({ error: "LinkedIn post failed" });
//   }
// }

// export const createBlogPost = async (req, res) => {
//   try {
//     const { title, content, image, topic, viralityScore } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ error: "Title and content are required" });
//     }

//     const draft = await Post.create({
//       user: req.user.id,
//       title,
//       content,
//       topic: topic || "General",
//       image,
//       viralityScore: viralityScore,
//       scheduledTime: new Date(), // ✅ mark as draft
//       status: "posted"      // ✅ clearly marked as draft
//     });

//     res.status(201).json(draft);
//   } catch (err) {
//     console.error("Error creating Post:", err);
//     res.status(500).json({ error: "Failed to create Post" });
//   }
// };

// // ------------------ Get User Blogs ------------------
// export const getUserBlogs = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const posts = await Post.find({ user: userId }).lean();

//     const formattedPosts = posts.map((post) => ({
//       ...post,
//       topic: post.topic || "General",
//       viralityScore: post.viralityScore ?? 5, // ✅ FIXED
//       publishDate: post.scheduledTime || post.createdAt,
//       analytics: post.analytics || {
//         likes: 0,
//         comments: 0,
//         shares: 0,
//         impressions: 0,
//         engagementRate: 0,
//       },
//     }));

//     const sorted = formattedPosts.sort(
//       (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
//     );

//     res.json(sorted);
//   } catch (err) {
//     console.error("Error fetching blogs:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ------------------ Get Single Blog ------------------
// export async function getSingleBlog(req, res) {
//   try {
//     const blog = await Post.findOne({ _id: req.params.id, user: req.user.id });
//     if (!blog) return res.status(404).json({ error: "Blog not found" });
//     res.json(blog);
//   } catch (err) {
//     console.error("Error fetching single blog:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// // ------------------ Update a blog by ID ------------------
// export const updateBlogById = async (req, res) => {
//   const { id } = req.params;
//   const { title, content, image, topic } = req.body;

//   try {
//     const blog = await Post.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });
//     if (!blog.user) return res.status(400).json({ message: "Blog corrupted" });
//     if (blog.user.toString() !== req.user._id.toString())
//       return res.status(403).json({ message: "Not authorized to edit this blog" });

//     blog.title = title || blog.title;
//     blog.content = content || blog.content;
//     blog.image = image || blog.image;
//     blog.topic = topic || blog.topic;

//     const updatedBlog = await blog.save();
//     res.json(updatedBlog);
//   } catch (error) {
//     console.error("Error updating blog:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ------------------ Delete a blog by ID ------------------
// export const deleteBlogById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const blog = await Post.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });
//     if (!blog.user) return res.status(400).json({ message: "Blog corrupted" });
//     if (blog.user.toString() !== req.user._id.toString())
//       return res.status(403).json({ message: "Not authorized to delete this blog" });

//     await blog.deleteOne();
//     res.json({ message: "Blog deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting blog:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// // file: controllers/blogController.js

// import axios from "axios";
// import User from "../models/User.js";
// import Post from "../models/Post.js";
// import { postToLinkedIn } from "../utils/postToLinkedIn.js";

// // ------------------ Topic Suggestion using Gemini ------------------
// export async function getTopicSuggestions(req, res) {
//   const { q } = req.query;

//   if (!q || q.length < 2) return res.status(400).json({ suggestions: [] });

//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `Suggest 5 short LinkedIn blog topics related to: "${q}". Respond with a plain comma-separated list only.`;

//     const result = await model.generateContent(prompt);
//     const text = (await result.response).text().trim();
//     const suggestions = text.split(",").map((s) => s.trim()).filter(Boolean);

//     res.status(200).json({ suggestions });
//   } catch (error) {
//     console.error("Gemini topic suggestion error:", error.message);
//     res.status(500).json({ message: "Gemini topic suggestion failed" });
//   }
// }

// // ------------------ Generate Blog ------------------
// export async function generateBlog(req, res) {
//   const { topic, wordCount, language = "english", tone = "professional", viralityScore = 50, status: payloadStatus } = req.body;

//   const payload = topic
//     ? { topic, wordCount, language, tone, viralityScore }
//     : { language, tone, viralityScore };

//   try {

//     const user = await User.findById(req.user.id);
//     if (user.usageCount >= user.monthlyQuota) {
//       return res.status(403).json({ error: "Monthly quota exceeded. Please upgrade your plan." });
//     }
//     if (user.subscriptionStatus !== "active") {
//       return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
//     }

//     const response = await axios.post("https://lavi0105.app.n8n.cloud/webhook/generatePost", payload);
//     const blogData = response.data;

//     const title = blogData.video_title || blogData.title || topic || "Generated Blog";
//     const content = blogData.script || blogData.generated_text || "";
//     let imageUrl = blogData.image || blogData.picture || req.body.image || null;

//     // ✅ Auto-post if enabled
//     let linkedInPosted = false;
//     let linkedinPostUrn = null;

//     if (user.autoPostToLinkedIn && user.linkedinAccessToken && user.linkedinPersonURN && content.trim()) {
//       try {
//         const result = await postToLinkedIn(user, { title, content, image: imageUrl });
//         linkedinPostUrn = result.postId;
//         linkedInPosted = true;
//       } catch (err) {
//         console.error("LinkedIn auto-post failed:", err.message);
//       }
//     }

//     // ✅ Save post
//     await Post.create({
//       user: user._id,
//       title,
//       content,
//       image: imageUrl,
//       linkedinPostUrn,
//       status: linkedInPosted ? "posted" : payloadStatus || "draft",
//       viralityScore: Number(viralityScore),
//     });

//     // ✅ Increment user's usage count
//     user.usageCount += 1;
//     await user.save();

//     res.json({ ...blogData, image: imageUrl, linkedInPosted });
//   } catch (err) {
//     console.error("Blog generation error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Blog generation failed" });
//   }
// }

// // ------------------ Generate Blog (No Auto-Post) ------------------
// export async function generateBlogOnly(req, res) {
//   const { topic, wordCount, tone = "professional", language = "english", imageOption, viralityScore = 5 } = req.body;

//   const payload = topic
//     ? { topic, wordCount, language, tone, viralityScore }
//     : { language, tone, wordCount, viralityScore };

//   try {
//     const response = await axios.post("https://lavi0105.app.n8n.cloud/webhook/generatePost", payload);
//     const blogData = response.data;

//     const title = blogData.video_title || blogData.title || topic || "Generated Blog";
//     const content = blogData.script || blogData.generated_text || "";
//     let imageUrl = blogData.image || blogData.picture || req.body.image || null;

//     res.json({ title, content, image: imageUrl || "" });
//   } catch (err) {
//     console.error("Blog-only generation error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Blog-only generation failed" });
//   }
// }

// // ------------------ Manual LinkedIn Post ------------------
// export async function manualLinkedInPost(req, res) {
//   let { title, content, image, blogId } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user.linkedinAccessToken || !user.linkedinPersonURN) {
//       return res.status(400).json({ error: "LinkedIn not connected" });
//     }

//     title = (title || "Generated Post").trim();
//     const result = await postToLinkedIn(user, { title, content, image });
//     const linkedinPostUrn = result.postId;

//     if (blogId) await Post.findByIdAndUpdate(blogId, { linkedinPostUrn, status: "posted" });

//     // ✅ Increment usage count
//     user.usageCount += 1;
//     await user.save();

//     res.json({ success: true, linkedinPostUrn });
//   } catch (err) {
//     console.error("Manual LinkedIn post failed:", err.message);
//     res.status(500).json({ error: "LinkedIn post failed" });
//   }
// }

// // ------------------ Create Blog Post ------------------
// export const createBlogPost = async (req, res) => {
//   try {
//     const { title, content, image, topic, viralityScore } = req.body;

//     if (!title || !content) return res.status(400).json({ error: "Title and content required" });

//     const post = await Post.create({
//       user: req.user.id,
//       title,
//       content,
//       topic: topic || "General",
//       image,
//       viralityScore,
//       status: "draft",
//     });

//     // ✅ Increment usage count
//     const user = await User.findById(req.user.id);
//     user.usageCount += 1;
//     await user.save();

//     res.status(201).json(post);
//   } catch (err) {
//     console.error("Error creating Post:", err.message);
//     res.status(500).json({ error: "Failed to create Post" });
//   }
// };

// // ------------------ Get User Blogs ------------------
// export const getUserBlogs = async (req, res) => {
//   try {
//     const posts = await Post.find({ user: req.user.id }).lean();
//     const formatted = posts.map((post) => ({
//       ...post,
//       topic: post.topic || "General",
//       viralityScore: post.viralityScore ?? 5,
//       publishDate: post.scheduledTime || post.createdAt,
//       analytics: post.analytics || { likes: 0, comments: 0, shares: 0, impressions: 0, engagementRate: 0 },
//     }));

//     formatted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
//     res.json(formatted);
//   } catch (err) {
//     console.error("Error fetching blogs:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ------------------ Get Single Blog ------------------
// export async function getSingleBlog(req, res) {
//   try {
//     const blog = await Post.findOne({ _id: req.params.id, user: req.user.id });
//     if (!blog) return res.status(404).json({ error: "Blog not found" });
//     res.json(blog);
//   } catch (err) {
//     console.error("Error fetching single blog:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// // ------------------ Update Blog by ID ------------------
// export const updateBlogById = async (req, res) => {
//   const { id } = req.params;
//   const { title, content, image, topic } = req.body;

//   try {
//     const blog = await Post.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     if (!blog.user.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

//     blog.title = title || blog.title;
//     blog.content = content || blog.content;
//     blog.image = image || blog.image;
//     blog.topic = topic || blog.topic;

//     const updatedBlog = await blog.save();
//     res.json(updatedBlog);
//   } catch (err) {
//     console.error("Error updating blog:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ------------------ Delete Blog by ID ------------------
// export const deleteBlogById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const blog = await Post.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     if (!blog.user.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

//     await blog.deleteOne();
//     res.json({ message: "Blog deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting blog:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };



import axios from "axios";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { postToLinkedIn } from "../utils/postToLinkedIn.js";

// ------------------ Topic Suggestion using Gemini ------------------
export async function getTopicSuggestions(req, res) {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ suggestions: [] });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Suggest 5 short LinkedIn blog topics related to: "${q}". Respond with a plain comma-separated list only.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();
    const suggestions = text.split(",").map((s) => s.trim()).filter(Boolean);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Gemini topic suggestion error:", error.message);
    res.status(500).json({ message: "Gemini topic suggestion failed" });
  }
}

// ------------------ Generate Blog ------------------
export async function generateBlog(req, res) {
  try {
    const { topic, wordCount, language = "english", tone = "professional", viralityScore = 50, status: payloadStatus } = req.body;
    const user = await User.findById(req.user.id);

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
    // }
    // if (user.usageCount >= user.monthlyQuota) {
    //   return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to continue posting." });
    // }

    // ---- Generate content ----
    const payload = topic ? { topic, wordCount, language, tone, viralityScore } : { language, tone, viralityScore };
    const response = await axios.post("https://lavi0105.app.n8n.cloud/webhook/generatePost", payload);
    const blogData = response.data;

    const title = blogData.video_title || blogData.title || topic || "Generated Blog";
    const content = blogData.script || blogData.generated_text || "";
    let imageUrl = blogData.image || blogData.picture || req.body.image || null;

    // ---- Auto-post if enabled ----
    let linkedInPosted = false;
    let linkedinPostUrn = null;

    if (user.autoPostToLinkedIn && user.linkedinAccessToken && user.linkedinPersonURN && content.trim()) {
      try {
        const result = await postToLinkedIn(user, { title, content, image: imageUrl });
        linkedinPostUrn = result.postId;
        linkedInPosted = true;
      } catch (err) {
        console.error("LinkedIn auto-post failed:", err.message);
      }
    }

    // ---- Save post ----
    await Post.create({
      user: user._id,
      title,
      content,
      image: imageUrl,
      linkedinPostUrn,
      status: linkedInPosted ? "posted" : payloadStatus || "draft",
      viralityScore: Number(viralityScore),
    });

    // ---- Increment usage count ----
    user.usageCount += 1;
    await user.save();

    res.json({ ...blogData, image: imageUrl, linkedInPosted });
  } catch (err) {
    console.error("Blog generation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Blog generation failed" });
  }
}

// ------------------ Generate Blog (No Auto-Post) ------------------
export async function generateBlogOnly(req, res) {
  const { topic, wordCount, tone = "professional", language = "english", imageOption, viralityScore = 5 } = req.body;

  const payload = topic
    ? { topic, wordCount, language, tone, viralityScore }
    : { language, tone, wordCount, viralityScore };

  try {
    const response = await axios.post("https://lavi0105.app.n8n.cloud/webhook/generatePost", payload);
    const blogData = response.data;

    const title = blogData.video_title || blogData.title || topic || "Generated Blog";
    const content = blogData.script || blogData.generated_text || "";
    let imageUrl = blogData.image || blogData.picture || req.body.image || null;

    res.json({ title, content, image: imageUrl || "" });
  } catch (err) {
    console.error("Blog-only generation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Blog-only generation failed" });
  }
}

// ------------------ Manual LinkedIn Post ------------------
export async function manualLinkedInPost(req, res) {
  try {
    const { title, content, image, blogId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.linkedinAccessToken || !user.linkedinPersonURN) {
      return res.status(400).json({ error: "LinkedIn not connected" });
    }

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
    // }
    // if (user.usageCount >= user.monthlyQuota) {
    //   return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to continue posting." });
    // }

    const result = await postToLinkedIn(user, { title: title || "Generated Post", content, image });
    const linkedinPostUrn = result.postId;

    if (blogId) await Post.findByIdAndUpdate(blogId, { linkedinPostUrn, status: "posted" });

    // ---- Increment usage count ----
    user.usageCount += 1;
    await user.save();

    res.json({ success: true, linkedinPostUrn });
  } catch (err) {
    console.error("Manual LinkedIn post failed:", err.message);
    res.status(500).json({ error: "LinkedIn post failed" });
  }
}

// ------------------ Create Blog Post ------------------
export const createBlogPost = async (req, res) => {
  try {
    const { title, content, image, topic, viralityScore } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required" });

    const user = await User.findById(req.user.id);

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
    // }
    // if (user.usageCount >= user.monthlyQuota) {
    //   return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to continue posting." });
    // }

    const post = await Post.create({
      user: req.user.id,
      title,
      content,
      topic: topic || "General",
      image,
      viralityScore,
      status: "draft",
    });

    user.usageCount += 1;
    await user.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating Post:", err.message);
    res.status(500).json({ error: "Failed to create Post" });
  }
};

// ------------------ Get User Blogs ------------------
export const getUserBlogs = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean();
    const formatted = posts.map((post) => ({
      ...post,
      topic: post.topic || "General",
      viralityScore: post.viralityScore ?? 5,
      publishDate: post.scheduledTime || post.createdAt,
      analytics: post.analytics || { likes: 0, comments: 0, shares: 0, impressions: 0, engagementRate: 0 },
    }));

    formatted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ Get Single Blog ------------------
export async function getSingleBlog(req, res) {
  try {
    const blog = await Post.findOne({ _id: req.params.id, user: req.user.id });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Error fetching single blog:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ------------------ Update Blog by ID ------------------
export const updateBlogById = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, topic } = req.body;

  try {
    const blog = await Post.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!blog.user.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;
    blog.topic = topic || blog.topic;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    console.error("Error updating blog:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Delete Blog by ID ------------------
export const deleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Post.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!blog.user.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};