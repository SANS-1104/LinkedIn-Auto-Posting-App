import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../LANDING-PAGE/ui/card"
import { Button } from "../LANDING-PAGE/ui/button"
import { Badge } from "../LANDING-PAGE/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "../LANDING-PAGE/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../LANDING-PAGE/ui/dialog"
import { Input } from "../LANDING-PAGE/ui/input"
import { Label } from "../LANDING-PAGE/ui/label"
import { Textarea } from "../LANDING-PAGE/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../LANDING-PAGE/ui/select"
import { Separator } from "../LANDING-PAGE/ui/separator"
import { Progress } from "../LANDING-PAGE/ui/progress"
import {
  FileText,
  Calendar,
  Edit3,
  Trash2,
  GripVertical,
  Clock,
  TrendingUp,
  Play,
  X,
  Save,
  Send,
  Wand2
} from "lucide-react"

// const drafts = [
//   {
//     id: "1",
//     title: "The Future of AI in Marketing",
//     content:
//       "AI is revolutionizing how we approach marketing strategies. From personalized content to predictive analytics, artificial intelligence is reshaping the marketing landscape. In this post, I will explore the key trends and practical applications that every marketer should know about in 2024.",
//     topic: "Technology",
//     createdAt: new Date(2024, 6, 20),
//     viralityScore: 78,
//     wordCount: 245,
//     language: "english"
//   },
//   {
//     id: "2",
//     title: "5 Remote Work Productivity Tips",
//     content:
//       "Working from home can be challenging. Here are my top 5 tips to stay productive while working remotely: 1) Create a dedicated workspace, 2) Set clear boundaries, 3) Use time-blocking techniques, 4) Take regular breaks, 5) Stay connected with your team.",
//     topic: "Productivity",
//     createdAt: new Date(2024, 6, 18),
//     viralityScore: 65,
//     wordCount: 180,
//     language: "english"
//   },
//   {
//     id: "3",
//     title: "LinkedIn Content Strategy 2024",
//     content:
//       "Building a strong LinkedIn presence requires a strategic approach. Here's what works in 2024: Focus on authentic storytelling, engage with your network consistently, share valuable insights from your industry, and use data to optimize your posting schedule.",
//     topic: "Marketing",
//     createdAt: new Date(2024, 6, 15),
//     viralityScore: 82,
//     wordCount: 320,
//     language: "english"
//   },
//   {
//     id: "4",
//     title: "Career Growth Mindset",
//     content:
//       "Developing the right mindset is crucial for career advancement. Here are key principles that helped me: embrace continuous learning, seek feedback actively, build meaningful relationships, take calculated risks, and always stay curious about new opportunities.",
//     topic: "Career",
//     createdAt: new Date(2024, 6, 12),
//     viralityScore: 72,
//     wordCount: 290,
//     language: "english"
//   },
//   {
//     id: "5",
//     title: "Industry Automation Trends",
//     content:
//       "Automation is reshaping industries across the board. Let's explore the latest trends and their impact: AI-driven decision making, robotic process automation, smart manufacturing, and the future of work in an automated world.",
//     topic: "Business",
//     createdAt: new Date(2024, 6, 10),
//     viralityScore: 69,
//     wordCount: 205,
//     language: "english"
//   }
// ]

export function DraftsSidebar({ isOpen, drafts, onClose, onScheduleDraft, onUnscheduleDraft, currentPage, onPageChange }) {
  const [editingDraft, setEditingDraft] = useState(null)
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    topic: "",
    language: ""
  })

  
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

  const getTopicColor = topic => {
    if (!topic) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (topic.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "marketing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "productivity":
        return "bg-green-100 text-green-800 border-green-200"
      case "career":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "business":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = date => {
    if (!date) return "No date"; // Fallback if date is missing
    if (!(date instanceof Date)) date = new Date(date); // Convert to Date if string

    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };


  const calculateViralityScore = (content, title) => {
    const viralKeywords = [
      "AI",
      "ML",
      "automation",
      "future",
      "trends",
      "tips",
      "hack",
      "secret",
      "ultimate",
      "game-changer",
      "breakthrough"
    ]
    const combinedText = `${title} ${content}`.toLowerCase()
    const score = viralKeywords.reduce((acc, keyword) => {
      return combinedText.includes(keyword.toLowerCase()) ? acc + 15 : acc
    }, Math.floor(Math.random() * 40) + 30)
    return Math.min(score, 95)
  }

  const openEditDialog = draft => {
    setEditingDraft(draft)
    setEditForm({
      title: draft.title,
      content: draft.content,
      topic: draft.topic,
      language: draft.language
    })
  }

  const closeEditDialog = () => {
    setEditingDraft(null)
    setEditForm({ title: "", content: "", topic: "", language: "" })
  }

  const handleSaveDraft = () => {
    // In a real app, this would save to backend
    console.log("Saving draft:", editForm)
    closeEditDialog()
  }

  const currentViralityScore =
    editForm.title || editForm.content
      ? calculateViralityScore(editForm.content, editForm.title)
      : 0

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-96 p-0 bg-gradient-to-b from-blue-50 to-indigo-50"
        >
          <SheetHeader className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Draft Posts ({drafts.length})
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </div>
            <p className="text-blue-100 text-sm">
              Drag drafts to calendar to schedule or edit them here
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No drafts yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first post to see drafts here
                </p>
              </div>
            ) : (
              drafts.map(draft => (
                <Card
                  key={draft.id}
                  className="group cursor-move hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-md"
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData("text/plain", draft.id)
                    e.dataTransfer.effectAllowed = "move"
                  }}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">
                          {draft.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getTopicColor(draft.topic)}`}
                          >
                            {draft.topic}
                          </Badge>
                          <Badge
                            className={`text-xs bg-gradient-to-r ${getViralityColor(
                              draft.viralityScore
                            )} text-white border-0`}
                          >
                            {getViralityText(draft.viralityScore)}
                          </Badge>
                        </div>
                      </div>
                      <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {draft.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(draft.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{draft.viralityScore}%</span>
                        </div>
                      </div>
                      <span>{draft.content.split(" ").filter(word => word.length > 0).length} words</span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 text-xs h-8"
                        onClick={() => openEditDialog(draft)}
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-1 text-xs h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={() => onScheduleDraft(draft.id, new Date())}
                      >
                        <Calendar className="h-3 w-3" />
                        Schedule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-white">
            <Button
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                onClose();
                onPageChange("create")
              }}
            >
              <Play className="h-4 w-4" />
              Create New Draft
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Draft Dialog */}
      <Dialog open={!!editingDraft} onOpenChange={closeEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Draft Post
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6 py-4">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Post Title</Label>
                <div className="relative">
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter your post title..."
                    className="pr-20"
                  />
                  {editForm.title && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Badge
                        className={`bg-gradient-to-r ${getViralityColor(
                          currentViralityScore
                        )} text-white border-0 shadow-sm`}
                      >
                        {currentViralityScore}%{" "}
                        {getViralityText(currentViralityScore)}
                      </Badge>
                    </div>
                  )}
                </div>
                {editForm.title && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      Virality potential:{" "}
                      {getViralityText(currentViralityScore)}
                    </span>
                    <Progress
                      value={currentViralityScore}
                      className="w-20 h-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editForm.content}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Write your engaging LinkedIn post content here..."
                  className="min-h-48 resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{editForm.content.length} characters</span>
                  <span>
                    Recommended: 150-300 characters for optimal engagement
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-topic">Topic</Label>
                  <Select
                    value={editForm.topic}
                    onValueChange={value =>
                      setEditForm(prev => ({ ...prev, topic: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-language">Language</Label>
                  <Select
                    value={editForm.language}
                    onValueChange={value =>
                      setEditForm(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">🇺🇸 English</SelectItem>
                      <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="french">🇫🇷 French</SelectItem>
                      <SelectItem value="german">🇩🇪 German</SelectItem>
                      <SelectItem value="portuguese">🇵🇹 Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Performance Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Virality Score</span>
                      <span className="font-medium">
                        {currentViralityScore}%
                      </span>
                    </div>
                    <Progress value={currentViralityScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Word Count</span>
                      <span className="font-medium">
                        {
                          editForm.content
                            .split(" ")
                            .filter(word => word.length > 0).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Character Count</span>
                      <span className="font-medium">
                        {editForm.content.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-green-600" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Improve engagement:
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>• Add relevant emojis</li>
                      <li>• Include call-to-action</li>
                      <li>• Use trending hashtags</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button
                  onClick={handleSaveDraft}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    handleSaveDraft()
                    // Also schedule logic here
                  }}
                >
                  <Send className="h-4 w-4" />
                  Save & Post Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={closeEditDialog}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
