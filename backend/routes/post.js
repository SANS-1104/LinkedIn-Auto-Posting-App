// // ✅ Updated backend/routes/post.js
// import { Router } from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { checkQuota } from "../middleware/quotaMiddleware.js";
// import {
//   generateBlog,
//   manualLinkedInPost,
//   getUserBlogs,
//   createBlogPost,
//   getSingleBlog,
//   getTopicSuggestions,
//   updateBlogById,
//   deleteBlogById,
//   generateBlogOnly
// } from "../controllers/blogController.js";
// import {
//   scheduleLinkedInPost,
//   getScheduledPosts,
//   cancelScheduledPost,
//   updateScheduledPost,
//   getBestPostTime
// } from "../controllers/scheduleController.js";
// import { updateBlogAnalytics } from "../controllers/analyticsController.js";
// import { getViralityScore } from "../controllers/viralityController.js";
// import { getDrafts, scheduleDraft, createDraft, moveToDraft } from "../controllers/draftController.js";
// import {generateImage} from "../controllers/imageController.js"


// const router = Router();
// router.post("/generate-blog", authMiddleware, checkQuota, generateBlog);
// router.post("/blogs", authMiddleware, checkQuota, createBlogPost);
// router.post("/schedule", authMiddleware, checkQuota, scheduleLinkedInPost);
// // router.post("/generate-blog", authMiddleware, generateBlog);
// router.post("/generate-blog-only", authMiddleware, generateBlogOnly);
// router.post("/linkedin/post", authMiddleware, checkQuota, manualLinkedInPost);
// router.get("/blogs", authMiddleware, getUserBlogs);
// // router.post("/blogs", authMiddleware, createBlogPost);
// router.get("/blogs/:id", authMiddleware, getSingleBlog);
// router.put("/blogs/:id", authMiddleware, updateBlogById);
// router.delete("/blogs/:id", authMiddleware, deleteBlogById);
// router.get("/suggest-topics", getTopicSuggestions);
// router.post('/generate-image', generateImage);

// // Scheduled post routes
// // router.post("/schedule", authMiddleware, scheduleLinkedInPost);
// router.get("/schedule", authMiddleware, getScheduledPosts);
// router.delete("/schedule/:id", authMiddleware, cancelScheduledPost);
// router.put("/schedule/:id", authMiddleware, updateScheduledPost);

// // Scheduled post Draft routes
// router.post("/drafts", authMiddleware,checkQuota, createDraft);
// // router.get("/drafts", authMiddleware, getDrafts);
// router.put("/drafts/:id/schedule", authMiddleware, scheduleDraft)
// router.put("/drafts/:id/unschedule", authMiddleware, moveToDraft);


// // LinkedIn Analytics update route
// router.post("/analytics/update", authMiddleware, updateBlogAnalytics);

// // routes/scheduleRoutes.js
// router.get('/best-time/:userId', getBestPostTime);

// // Virality Score (Is it a good idea to post this blog?)
// router.get("/virality-score", getViralityScore);

// export default router;



// ✅ Updated backend/routes/post.js
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkQuota } from "../middleware/quotaMiddleware.js";
import {
  generateBlog,
  manualLinkedInPost,
  getUserBlogs,
  createBlogPost,
  getSingleBlog,
  getTopicSuggestions,
  updateBlogById,
  deleteBlogById,
  generateBlogOnly
} from "../controllers/blogController.js";
import {
  scheduleLinkedInPost,
  getScheduledPosts,
  cancelScheduledPost,
  updateScheduledPost,
  getBestPostTime
} from "../controllers/scheduleController.js";
import { updateBlogAnalytics } from "../controllers/analyticsController.js";
import { getViralityScore } from "../controllers/viralityController.js";
import { getDrafts, scheduleDraft, createDraft, moveToDraft } from "../controllers/draftController.js";
import {generateImage} from "../controllers/imageController.js"


const router = Router();
router.post("/generate-blog", authMiddleware,  generateBlog);
router.post("/blogs", authMiddleware,  createBlogPost);
router.post("/schedule", authMiddleware,  scheduleLinkedInPost);
// router.post("/generate-blog", authMiddleware, generateBlog);
router.post("/generate-blog-only", authMiddleware, generateBlogOnly);
router.post("/linkedin/post", authMiddleware,  manualLinkedInPost);
router.get("/blogs", authMiddleware, getUserBlogs);
// router.post("/blogs", authMiddleware, createBlogPost);
router.get("/blogs/:id", authMiddleware, getSingleBlog);
router.put("/blogs/:id", authMiddleware, updateBlogById);
router.delete("/blogs/:id", authMiddleware, deleteBlogById);
router.get("/suggest-topics", getTopicSuggestions);
router.post('/generate-image', generateImage);

// Scheduled post routes
// router.post("/schedule", authMiddleware, scheduleLinkedInPost);
router.get("/schedule", authMiddleware, getScheduledPosts);
router.delete("/schedule/:id", authMiddleware, cancelScheduledPost);
router.put("/schedule/:id", authMiddleware, updateScheduledPost);

// Scheduled post Draft routes
router.post("/drafts", authMiddleware, createDraft);
// router.get("/drafts", authMiddleware, getDrafts);
router.put("/drafts/:id/schedule", authMiddleware, scheduleDraft)
router.put("/drafts/:id/unschedule", authMiddleware, moveToDraft);


// LinkedIn Analytics update route
router.post("/analytics/update", authMiddleware, updateBlogAnalytics);

// routes/scheduleRoutes.js
router.get('/best-time/:userId', getBestPostTime);

// Virality Score (Is it a good idea to post this blog?)
router.get("/virality-score", getViralityScore);

export default router;
 