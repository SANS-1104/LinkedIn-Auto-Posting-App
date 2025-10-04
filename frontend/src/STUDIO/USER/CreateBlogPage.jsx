import React, { useRef, useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../LANDING-PAGE/ui/card"
import { Button } from "../LANDING-PAGE/ui/button"
import { Input } from "../LANDING-PAGE/ui/input"
import { Label } from "../LANDING-PAGE/ui/label"
import { Textarea } from "../LANDING-PAGE/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../LANDING-PAGE/ui/select"
import { Switch } from "../LANDING-PAGE/ui/switch"
import { Badge } from "../LANDING-PAGE/ui/badge"
import { Separator } from "../LANDING-PAGE/ui/separator"
import { Progress } from "../LANDING-PAGE/ui/progress"
import { PenTool, Upload, Wand2, Send, Save, Calendar, Sparkles, TrendingUp, Image as ImageIcon, Type, Zap, Maximize2, X } from "lucide-react"

import { toast } from 'react-toastify';
import axiosClient from "../../api/axiosClient"
import { AuthContext } from "../../Navbar/AuthContext"

export function CreateBlogPage() {
  const [topic, setTopic] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("english")
  const [tone, setTone] = useState("Professional")
  const [selectTopic, setSelectTopic] = useState("Technology")
  const [wordCount, setWordCount] = useState(300)
  const [postMode, setPostMode] = useState("custom");
  const [image, setImage] = useState(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const { profile, logout: authLogout, setProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [name, setName] = useState("User");
  const [autoPost, setAutoPost] = useState(false);
  // const [imageOption, setImageOption] = useState("upload");
  // const [uploadedFile, setUploadedFile] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [viralityScore, setViralityScore] = useState(0);
  const [todayBest, setTodayBest] = useState(null);

  // Fetch profile if not already loaded
  // 1️⃣ Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/profile");
      const data = res.data;
      setProfile?.(data); // update context if possible
      setName(data.name || "User");
      setAutoPost(data.autoPostToLinkedIn || false);

      // After profile is fetched, call fetchTodayBestTime
      if (data?._id) {
        fetchTodayBestTime(data._id);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err.message);
    }
  };

  // 2️⃣ Fetch today's best time
  const fetchTodayBestTime = async (userId) => {
    try {
      const res = await axiosClient.get(`/analytics/best-time/${userId}`);
      const dailyBest = res.data.dailyBest || {};
      const todayName = new Date().toLocaleString("en-US", { weekday: "long" });

      if (dailyBest[todayName]) {
        const { key, avg } = dailyBest[todayName];
        const hour = key.split("-")[1];
        setTodayBest({
          hour,
          avg
        });
      }
    } catch (error) {
      console.error("Error fetching best time for today:", error);
    }
  };

  // 3️⃣ Run on mount
  useEffect(() => {
    fetchProfile();
    if (profile?._id) {
      fetchTodayBestTime(profile._id);
    }
  }, [profile]);

  const handleAutoPostToggle = async () => {
    const newValue = !autoPost;
    try {
      await axiosClient.put("/preferences", { autoPostToLinkedIn: newValue });
      setAutoPost(newValue);
      toast.success(`Auto-post ${newValue ? "enabled" : "disabled"}`, { autoClose: 1000 });
    } catch (err) {
      toast.error("Failed to update preference");
    }
  };

  useEffect(() => {
    if (!topic) {
      setViralityScore(0);
      return;
    }

    const delayDebounce = setTimeout(() => {
      calculateViralityScore(topic);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [topic]);

  // Calculate virality score based on topic
  const calculateViralityScore = async (topicText) => {
    try {
      const res = await axiosClient.get("/virality-score", {
        params: { topic: topicText }
      });
      setViralityScore(res.data.viralityScore || 0);
    } catch (error) {
      console.error("Error fetching virality score:", error);
      setViralityScore(0);
    }
  };

  const getViralityColor = score => {
    if (score >= 80) return "from-emerald-500 to-green-500"
    if (score >= 60) return "from-blue-500 to-indigo-500"
    if (score >= 40) return "from-amber-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getViralityText = score => {
    if (score >= 80) return "Viral"
    if (score >= 60) return "High"
    if (score >= 40) return "Moderate"
    return "Low"
  }

  // Upload handler (from your old logic but sets `image`)
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // direct set so preview shows
    };
    reader.readAsDataURL(file);
  };

  // Generate handler (from your old logic but sets `image`)
  const generateImage = async () => {
    try {
      setIsGeneratingImage(true);

      // Build prompt from existing form values
      const prompt = `A professional LinkedIn post image about the topic: "${topic}".Its content is ${content}, 
    tone: ${tone}, style: clean, modern, minimal, high quality`;

      // Call backend DALL·E 3 API
      const res = await axiosClient.post("/generate-image", { prompt });

      // Get the returned AI image URL
      setImage(res.data.imageUrl);
    } catch (error) {
      console.error("Error generating AI image:", error);
      toast.error(`Failed to generate image for ${topic}. Please try again.`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const [generatedByAI, setGeneratedByAI] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() && postMode === "custom") {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.post("/generate-blog", {
        topic, content, language, tone, image, wordCount, viralityScore, status: autoPost ? "posted" : "draft", autoPost
      });

      const data = res.data;
      // console.log("Generated blog response:", data);
      // Store output
      setOutput(data);

      // Fill existing UI fields
      if (data.title || data.video_title) {
        setTopic(data.title || data.video_title);
      }
      if (data.script || data.generated_text) {
        setContent(data.script || data.generated_text);
      }
      if (data.picture || data.image) {
        setImage(data.picture || data.image);
      }

      toast.success("Blog generated successfully");
      if (data.linkedInPosted) {
        toast.success("Successfully posted to LinkedIn");
      }

      setGeneratedByAI(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate blog");
    } finally {
      setLoading(false);
    }
  };

  const handleManualLinkedInPost = async () => {
    if (!topic || !content) {
      toast.error("No generated content to post");
      return;
    }

    const payload = {
      title: topic || "Untitled Draft", topic: selectTopic || "General", content: content, image: image || "", viralityScore: viralityScore, status: "posted",
    };

    try {
      // 1️⃣ Post to LinkedIn
      await axiosClient.post("/linkedin/post", payload);

      // 2️⃣ Save to DB
      await axiosClient.post("/blogs", payload);

      toast.success("Posted to LinkedIn and saved to database");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post or save");
    }
  };

  // const handleScriptChange = (e) => {
  //   setOutput((prev) => ({
  //     ...prev, script: e.target.value
  //   }));
  // };

  const handleSaveDraft = async () => {
    try {
      // Basic validation
      if (!topic.trim() && !content.trim()) {
        toast.error("Please enter a topic or content before saving draft");
        return;
      }

      // Prepare the payload
      const payload = {
        title: topic || "Untitled Draft", topic: selectTopic || "General", content: content, image: image || "", viralityScore, status: "draft", // explicitly set as draft
      };

      // Send POST request to /drafts
      await axiosClient.post("/drafts", payload);

      toast.success("Draft saved successfully!", { autoClose: 1500 });
    } catch (err) {
      console.error("Failed to save draft:", err);
      toast.error("Failed to save draft");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Create Blog Post
          </h1>
        </div>
        <p className="text-muted-foreground">
          Craft engaging LinkedIn content with AI-powered insights
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Section */}
          <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-4 w-4 text-blue-600" />
                Topic & Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Selection */}
              <div className="flex gap-3 mb-4">
                <Button
                  variant={postMode === "auto" ? "default" : "outline"}
                  className={`rounded-full ${postMode === "auto" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setPostMode("auto")}
                >
                  Automated
                </Button>
                <Button
                  variant={postMode === "custom" ? "default" : "outline"}
                  className={`rounded-full ${postMode === "custom" ? "bg-green-600 text-white" : ""}`}
                  onClick={() => setPostMode("custom")}
                >
                  Custom
                </Button>
              </div>

              {/* Topic Input */}
              {postMode === "custom" ? (
                <>
                  <Label htmlFor="topic">Post Topic</Label>
                  <div className="relative">
                    <Input
                      id="topic"
                      placeholder="e.g., 'AI automation tips for marketing professionals'"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      className="pr-20"
                    />
                    {topic && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Badge
                          className={`bg-gradient-to-r ${getViralityColor(
                            viralityScore
                          )} text-white border-0 shadow-sm`}
                        >
                          <TrendingUp className="h-3 w-3" /> {viralityScore}% {getViralityText(viralityScore)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-lg text-blue-700 flex items-center justify-between w-full">
                  {topic ? (
                    <>
                      <div className="relative w-full">
                        <Input
                          className='pr-20'
                          id="topic"
                          value={topic}
                          onChange={e => setTopic(e.target.value)}
                        />
                        {
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Badge
                              className={`bg-gradient-to-r ${getViralityColor(
                                viralityScore
                              )} text-white border-0 shadow-sm`}
                            >
                              <TrendingUp className="h-3 w-3" /> {viralityScore}% {getViralityText(viralityScore)}
                            </Badge>
                          </div>
                        }
                      </div>
                    </>
                  ) : (
                    "Topic will be automatically selected from Google Trends."
                  )}
                </div>
              )}

              {/* Content Area */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your engaging LinkedIn post content here..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setGeneratedByAI(false); // user edited, so allow manual draft saving again
                  }}
                  className="min-h-48 resize-none text-2xl"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{content.length} characters</span>
                  <span>
                    Recommended: 150-300 characters for optimal engagement
                  </span>
                </div>
              </div>

              {/* Language & Tone */}
              <div className="flex flex-row flex-wrap gap-8 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">🇺🇸 English</SelectItem>
                      <SelectItem value="hindi">🇭🇮 Hindi</SelectItem>
                      <SelectItem value="french">🇫🇷 French</SelectItem>
                      <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Informative">Informative</SelectItem>
                      <SelectItem value="Emotional">Emotional</SelectItem>
                      <SelectItem value="Witty">Witty</SelectItem>
                      <SelectItem value="Authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selectTopic">Topic</Label>
                  <Select value={selectTopic} onValueChange={setSelectTopic}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="AuthorLeadershipitative">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wordCount">Word Count</Label>
                  <Input
                    id="wordCount"
                    value={wordCount}
                    onChange={e => setWordCount(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Section (only for Custom posts) */}
          {(
            <Card className="bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-purple-600" />
                  Visual Content
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {image ? (
                  <div className="relative group">
                    <img
                      src={image}
                      alt="Post preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                              transition-opacity rounded-lg flex items-center justify-center gap-3">
                      {/* View Image Button */}
                      <Button
                        variant="secondary"
                        onClick={() => setShowImageModal(true)}
                        className="bg-white/90 text-gray-900 hover:bg-white flex items-center gap-1"
                      >
                        <Maximize2 className="h-4 w-4" /> View
                      </Button>
                      {/* Remove Image Button */}
                      <Button
                        variant="secondary"
                        onClick={() => setImage(null)}
                        className="bg-white/90 text-gray-900 hover:bg-white"
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Add visual content to boost engagement
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button variant="outline" className="gap-2" asChild>
                          <label className="cursor-pointer">
                            <Upload className="h-4 w-4" />
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 bg-gradient-to-r from-purple-50 to-violet-50 
                               border-purple-200 hover:from-purple-100 hover:to-violet-100"
                          onClick={generateImage}
                          disabled={isGeneratingImage}
                        >
                          <Wand2
                            className={`h-4 w-4 ${isGeneratingImage ? "animate-spin" : ""}`}
                          />
                          {isGeneratingImage ? "Generating..." : "Generate with AI"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardContent>
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {loading ? (
                      <>
                        Generating...
                        <span className="ml-2 animate-spin">⏳</span>
                      </>
                    ) : (
                      "Generate Blog"
                    )}
                  </Button>

                  {/* {!autoPost && (
                    <Button
                      onClick={handleManualLinkedInPost}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      Post on LinkedIn
                    </Button>
                  )} */}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Full-Screen Image Modal */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-5 right-5 text-white hover:text-gray-300"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={image}
                alt="Full Size"
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
              />
            </div>
          )}


        </div>

        {/* Sidebar stays same */}
        <div className="space-y-6">
          {/* Settings */}
          <Card className="bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Publishing Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-post">Auto-post to LinkedIn</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically publish when ready
                  </p>
                </div>
                <Switch
                  id="auto-post"
                  checked={autoPost}
                  onCheckedChange={handleAutoPostToggle}
                />
              </div>

              <Separator />

              <div className="space-y-3">

                {/* <CardContent>Don't Save Post as Draft when You have created the content using AI ( :-)</CardContent> */}

                <Button
                  className={`w-full gap-2 shadow-lg transition-all duration-300 ${autoPost
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                    }`}
                  onClick={handleManualLinkedInPost}
                  disabled={autoPost}
                >
                  <Send className="h-4 w-4" />
                  Post Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleSaveDraft}
                  disabled={generatedByAI}
                  title={generatedByAI ? "Already saved as draft" : ""}
                >
                  <Save className="h-4 w-4" />
                  Save as Draft
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full gap-2 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 hover:from-purple-100 hover:to-violet-100"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Later
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-gradient-to-br from-white to-yellow-50/30 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trending Topics</p>
                <div className="space-y-2">
                  {[
                    "AI automation trends", "Remote work productivity", "LinkedIn marketing tips"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setTopic(suggestion)}
                      className="w-full text-left p-2 text-sm bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-amber-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Best Time to Post</p>
                <div className="text-sm text-muted-foreground">
                  {todayBest ? (
                    <>
                      📅 Today at {todayBest.hour}:00
                      <br />
                      🎯 {Math.round((todayBest.avg / 20) * 100)}% optimal engagement
                    </>
                  ) : (
                    <>Loading...</>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
