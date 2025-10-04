import { useState,useEffect } from "react"
import { Card, CardContent } from "../LANDING-PAGE/ui/card"
import { Button } from "../LANDING-PAGE/ui/button"
import { Badge } from "../LANDING-PAGE/ui/badge"
import { Input } from "../LANDING-PAGE/ui/input"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../LANDING-PAGE/ui/select"
import { Dialog,DialogContent,DialogHeader,DialogTitle} from "../LANDING-PAGE/ui/dialog"
import { Label } from "../LANDING-PAGE/ui/label"
import { FileText,Search,Filter,Plus,Calendar,Eye,Edit3,Trash2,Share2,Heart,MessageCircle,Clock,CheckCircle,XCircle,AlertTriangle,Bookmark} from "lucide-react"
import axiosClient from "../../api/axiosClient"
import { toast } from "react-toastify";

export function PostsPage({ currentPage, onPageChange }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [topicFilter, setTopicFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewingPost, setViewingPost] = useState(null)
  const [posts, setPosts] = useState([]); // replaces posts
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "", topic: "" });
  const [deletePost, setDeletePost] = useState(null); // post to delete

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axiosClient.get("/blogs");

      const formatted = data.map(blog => {
        let publishDate = null;

        if (blog.scheduledTime) {
          publishDate = new Date(blog.scheduledTime);
        } else if (blog.publishDate) {
          publishDate = new Date(blog.publishDate);
        } else if (blog.createdAt) {
          publishDate = new Date(blog.createdAt);
        } else {
          // ✅ Fallback to current date to avoid null
          publishDate = new Date();
        }

        return {
          ...blog,
          publishDate,
          engagement: blog.analytics
            ? {
              impressions: blog.analytics.impressions || 0,
              likes: blog.analytics.likes || 0,
              comments: blog.analytics.comments || 0,
              shares: blog.analytics.shares || 0
            }
            : { impressions: 0, likes: 0, comments: 0, shares: 0 }
        };
      });

      setPosts(formatted);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleViewPost = async (id) => {
    try {
      const { data } = await axiosClient.get(`/blogs/${id}`);
      setViewingPost({
        ...data,
        publishDate: new Date(data.publishDate)
      });
    } catch (err) {
      console.error("Error fetching blog details:", err);
    }
  };
  

  const handleDeletePost = async (id) => {
    try {
      await axiosClient.delete(`/blogs/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const startEdit = (post) => {
    setEditForm({
      title: post.title || "",
      content: post.content || "",
      topic: post.topic || ""
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    // Prevent editing if posted
    if (viewingPost && viewingPost.status === "posted") {
      toast.error("Posted posts cannot be edited.");
      return;
    }
    try {
      // Use post id (either _id or id)
      const postId = viewingPost.id || viewingPost._id;
      await axiosClient.put(`/blogs/${postId}`, editForm);
      toast.success("Post updated successfully!");
      setIsEditing(false);
      setViewingPost(null);
      await fetchBlogs(); // Refresh posts after edit
    } catch (err) {
      console.error("Error updating blog:", err);
      toast.error("Failed to update post");
    }
  };



  const getFilteredPosts = () => {
    let filtered = posts.filter(post => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter
      const matchesTopic =
        topicFilter === "all" || post.topic.toLowerCase() === topicFilter

      return matchesSearch && matchesStatus && matchesTopic
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.publishDate.getTime() - a.publishDate.getTime()
        case "oldest":
          return a.publishDate.getTime() - b.publishDate.getTime()
        case "virality":
          return b.viralityScore - a.viralityScore
        case "engagement":
          const aEngagement = a.engagement
            ? a.engagement.likes + a.engagement.comments + a.engagement.shares
            : 0
          const bEngagement = b.engagement
            ? b.engagement.likes + b.engagement.comments + b.engagement.shares
            : 0
          return bEngagement - aEngagement
        default:
          return 0
      }
    })

    return filtered
  }

  const getStatusColor = status => {
    switch (status) {
      case "posted":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case "posted":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <FileText className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getViralityColor = score => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const formatNumber = num => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const filteredPosts = getFilteredPosts()
  const statusCounts = {
    all: posts.length,
    posted: posts.filter(p => p.status === "posted").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    draft: posts.filter(p => p.status === "draft").length,
    failed: posts.filter(p => p.status === "failed").length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 blur-xl"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            All Posts
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage all your LinkedIn content in one place
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-to-r from-white to-indigo-50/30 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Top row - Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search posts by title or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
               onClick={() => onPageChange("create")}>
                <Plus className="h-4 w-4" />
                Create New Post
              </Button>
            </div>

            {/* Bottom row - Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-sm">Filters:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Status ({statusCounts.all})
                  </SelectItem>
                  <SelectItem value="posted">
                    posted ({statusCounts.posted})
                  </SelectItem>
                  <SelectItem value="scheduled">
                    Scheduled ({statusCounts.scheduled})
                  </SelectItem>
                  <SelectItem value="draft">
                    Drafts ({statusCounts.draft})
                  </SelectItem>
                  <SelectItem value="failed">
                    Failed ({statusCounts.failed})
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="virality">Highest Virality</SelectItem>
                  <SelectItem value="engagement">Most Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or create your first post
              </p>
              <Button 
                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600"
                onClick={() => onPageChange("create")}
              >
                <Plus className="h-4 w-4" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map(post => (
            <Card
              key={post.id}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                          {post.isFavorite && (
                            <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(post.status)}
                      >
                        {getStatusIcon(post.status)}
                        <span className="ml-1">
                          {post.status?.charAt(0).toUpperCase() + post.status?.slice(1) || "Unknown"}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.topic || "Topic Not Specified"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getViralityColor(post.viralityScore)}
                      >
                        {post.viralityScore}% Virality
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.publishDate ? (
                            <>
                              <span>{post.publishDate.toLocaleDateString()}</span>
                              {/* Only show time if it exists and is not midnight */}
                              {post.publishDate.getHours() !== 0 || post.publishDate.getMinutes() !== 0 ? (
                                <span className="ml-1 text-xs text-gray-500">
                                  {post.publishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <span>No date</span>
                          )}
                        </div>

                        {post.status === "scheduled" && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            <span>Scheduled</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {post.status === "draft" && (
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => onPageChange("calendar")}>
                            <Calendar className="h-3 w-3" />
                            Schedule
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => {
                            setViewingPost(post);
                            setEditForm({
                              title: post.title || "",
                              content: post.content || "",
                              topic: post.topic || ""
                            });
                            setIsEditing(true); // <-- Open directly in edit mode
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => setViewingPost(post)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600"
                          onClick={() => setDeletePost(post)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                        {deletePost && (
                          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                            {/* Transparent clickable overlay to close */}
                            <div
                              className="absolute inset-0"
                              onClick={() => setDeletePost(null)}
                            ></div>

                            {/* Confirmation box */}
                            <div className="relative bg-white rounded-lg shadow-xl p-6 w-[320px] z-10 border border-gray-200">
                              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                              <p className="mt-2 text-sm text-gray-600">
                                Are you sure you want to delete{" "}
                                <strong>{deletePost.title}</strong>? This action cannot be undone.
                              </p>

                              <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setDeletePost(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-red-600 text-white"
                                  onClick={async () => {
                                    try {
                                      await axiosClient.delete(`/blogs/${deletePost._id}`);
                                      setPosts(prev => prev.filter(p => p._id !== deletePost._id));
                                      toast.success("Post deleted successfully");
                                      setDeletePost(null);
                                    } catch (err) {
                                      console.error("Error deleting post:", err);
                                      toast.error("Failed to delete post");
                                    }
                                  }}
                                >
                                  Yes, Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  {post.engagement && (
                    <div className="lg:w-48 space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Engagement
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-gray-600">Views</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatNumber(post.engagement.impressions)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-gray-600">Likes</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatNumber(post.engagement.likes)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-gray-600">
                              Comments
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatNumber(post.engagement.comments)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-gray-600">
                              Shares
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatNumber(post.engagement.shares)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Post Dialog */}
      <Dialog open={!!viewingPost} onOpenChange={() => setViewingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingPost && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit3 className="h-5 w-5 text-indigo-600" />
                      Edit Post
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 text-indigo-600" />
                      Post Details
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {isEditing ? (
                  <>
                    <Label>Title</Label>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-full"
                    />

                    <Label>Content</Label>
                    <textarea
                      name="content"
                      value={editForm.content}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-full"
                      rows={6}
                    />

                    <Label>Topic</Label>
                    <input
                      name="topic"
                      value={editForm.topic}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-full"
                    />
                  </>
                ) : (
                  <>
                    {/* Your existing read-only details UI here */}
                    <h3 className="text-xl font-semibold mb-2">
                      {viewingPost.title}
                    </h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {viewingPost.content}
                      </p>
                    </div>
                    {/* keep the rest of your read-only display */}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setViewingPost(null)}>
                  Close
                </Button>
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-indigo-600 text-white" onClick={saveEdit}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => startEdit(viewingPost)}>
                    <Edit3 className="h-4 w-4" />
                    Edit Post
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
