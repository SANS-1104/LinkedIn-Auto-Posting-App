import { useState, useEffect } from "react"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardOverview } from "./DashboardOverview"
import { AnalyticsCharts } from "./AnalyticsCharts"
import { CreateBlogPage } from "./CreateBlogPage"
import { CalendarPage } from "./CalendarPage"
import { AnalyticsPage } from "./AnalyticsPage"
import { ProfilePage } from "./ProfilePage"
import { PostsPage } from "./PostsPage"
import { DraftsSidebar } from "./DraftsSidebar"
// import { AuthPage } from "../AUTH/AuthPage"
// import { AuthContext } from "../Navbar/AuthContext"
import axiosClient from "../../api/axiosClient"
import {useParams } from "react-router-dom";
import {
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  Clock,
  Zap
} from "lucide-react"
import { toast } from "react-toastify";



export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isDraftsSidebarOpen, setIsDraftsSidebarOpen] = useState(false)

  const [firstName, setFirstName] = useState("");
  const { name } = useParams();
  const [drafts, setDrafts] = useState([]);
  const [posts, setPosts] = useState([]); // replaces posts

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axiosClient.get("/blogs");

      const formatted = data.map(blog => {
        let publishDate = null;

        // Prefer scheduledTime if present, else createdAt, else publishDate
        if (blog.scheduledTime) {
          publishDate = new Date(blog.scheduledTime);
        } else if (blog.publishDate) {
          publishDate = new Date(blog.publishDate);
        } else if (blog.createdAt) {
          publishDate = new Date(blog.createdAt);
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
  const fetchScheduledPosts = async () => {
    try {
      const res = await axiosClient.get("/schedule");
      setPosts(res.data);
    } catch (err) {
      toast.error("Failed to fetch scheduled posts");
    }
  };
  useEffect(() => {
    fetchScheduledPosts();
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await axiosClient.get("/blogs");
      const onlyDrafts = res.data.filter(post => post.status === "draft");
      // ✅ Save drafts for DraftsSidebar
      setDrafts(onlyDrafts);
    } catch (err) {
      toast.error("Failed to fetch drafts");
    }
  };


  useEffect(() => {
    if (name) {
      setFirstName(name.split(" ")[0]);
    }
  }, [name]);

  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/profile");
      const fullName = res.data.name || "User";
      setFirstName(fullName.split(" ")[0]);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };

  // Shows what all is there in user??
  // useEffect(() => {
  //   console.log("Updated User object:", user);
  // }, [user]);



  const renderPage = () => {
    switch (currentPage) {
      case "create":
        return <CreateBlogPage />
      case "posts":
        return <PostsPage currentPage={currentPage}  onPageChange={setCurrentPage}/>
      case "calendar":
        return <CalendarPage />
      case "analytics":
        return <AnalyticsPage />
      case "profile":
        return <ProfilePage user={user} />
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="space-y-2 relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 blur-xl"></div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Welcome, {firstName || "fallback"} !
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your LinkedIn content performance and
                what's happening today.
              </p>
            </div>

            {/* Overview Cards */}
            <section className="relative">
              <div className="absolute -top-2 -left-2 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-5 blur-2xl"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Overview
              </h2>
              <DashboardOverview />
            </section>

            {/* Analytics Section */}
            <section className="relative">
              <div className="absolute -top-2 -right-2 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-5 blur-2xl"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                Performance Analytics
              </h2>
              <AnalyticsCharts user={user}/>
            </section>

            {/* Recent Activity */}
            <section className="relative">
              <div className="absolute -top-2 -left-2 w-36 h-36 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full opacity-5 blur-2xl"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                Recent Activity
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="rounded-2xl border bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Today's Schedule
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {posts.filter(post => {
                      // Only show posts with status "scheduled" and scheduledTime is today
                      if (post.status !== "scheduled" || !post.scheduledTime) return false;
                      const postDate = new Date(post.scheduledTime);
                      const today = new Date();
                      return (
                        postDate.getFullYear() === today.getFullYear() &&
                        postDate.getMonth() === today.getMonth() &&
                        postDate.getDate() === today.getDate()
                      );
                    }).length === 0 ? (
                      <div className="p-3 bg-blue-50 rounded-lg text-center text-sm text-muted-foreground">
                        No posts scheduled for today.
                      </div>
                    ) : (
                      posts
                        .filter(post => {
                          if (post.status !== "scheduled" || !post.scheduledTime) return false;
                          const postDate = new Date(post.scheduledTime);
                          const today = new Date();
                          return (
                            postDate.getFullYear() === today.getFullYear() &&
                            postDate.getMonth() === today.getMonth() &&
                            postDate.getDate() === today.getDate()
                          );
                        })
                        .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
                        .map(post => (
                          <div key={post._id || post.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{post.title || "Untitled Post"}</div>
                              <div className="text-xs text-muted-foreground">{post.topic || "General"}</div>
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              {new Date(post.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Top Performing */}
                <div className="rounded-2xl border bg-gradient-to-br from-white to-emerald-50/50 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">
                      Top Performer
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="font-medium text-sm mb-2">
                        LinkedIn Marketing Strategies
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Impressions
                        </span>
                        <span className="font-medium text-emerald-600">
                          15.4K
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Engagement
                        </span>
                        <span className="font-medium text-emerald-600">
                          1.5K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Ideas */}
                <div className="rounded-2xl border bg-gradient-to-br from-white to-purple-50/50 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      AI Suggestions
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentPage("create")}
                      className="w-full text-left p-2 text-sm bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      🤖 "Future of AI in 2025"
                    </button>
                    <button
                      onClick={() => setCurrentPage("create")}
                      className="w-full text-left p-2 text-sm bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      💼 "Remote team management"
                    </button>
                    <button
                      onClick={() => setCurrentPage("create")}
                      className="w-full text-left p-2 text-sm bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      📈 "Growth marketing tactics"
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="pt-4 relative">
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-5 blur-2xl"></div>
              <div className="rounded-2xl border bg-gradient-to-r from-white to-blue-50/50 p-8 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Quick Actions
                  </h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Get started with your content creation workflow
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setCurrentPage("create")}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">Create New Post</span>
                  </button>
                  <button
                    onClick={async () => {
                      await fetchDrafts();
                      setIsDraftsSidebarOpen(true);
                    }}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                  >
                    <FileText className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-green-800">
                      View Drafts
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentPage("calendar")}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 hover:from-purple-100 hover:to-violet-100 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                  >
                    <Calendar className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-purple-800">
                      Schedule Content
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentPage("analytics")}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                  >
                    <BarChart3 className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-amber-800">
                      View Analytics
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Growth Insights */}
            <section className="relative">
              <div className="absolute -top-2 -right-2 w-28 h-28 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-5 blur-2xl"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                Growth Insights
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border bg-gradient-to-br from-white to-rose-50/50 p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-rose-600" />
                    <h3 className="font-semibold text-gray-900">
                      Content Goals
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Monthly Posts</span>
                        <span className="font-medium">15/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Engagement Target</span>
                        <span className="font-medium">4.2K/5K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                          style={{ width: "84%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">
                      Audience Growth
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Followers</div>
                        <div className="text-sm text-muted-foreground">
                          +320 this month
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">
                        15.2K
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Engagement Rate</div>
                        <div className="text-sm text-muted-foreground">
                          +0.8% vs last month
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        4.2%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        // onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {renderPage()}
      </main>

      <DraftsSidebar
        isOpen={isDraftsSidebarOpen}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        drafts={drafts} // pass fetched drafts
        onClose={() => setIsDraftsSidebarOpen(false)}
        onScheduleDraft={async (draftId, date) => {
          try {
            await axiosClient.put(`/drafts/${draftId}/schedule`, { scheduledTime: date });
            toast.success("Draft scheduled successfully!");
            fetchDrafts(); // refresh drafts list
            fetchBlogs(); // refresh all posts
          } catch {
            toast.error("Failed to schedule draft");
          }
        }}
        onUnscheduleDraft={async (draftId) => {
          try {
            await axiosClient.put(`/drafts/${draftId}/unschedule`);
            toast.success("Draft moved back to drafts");
            fetchDrafts();
            fetchBlogs();
          } catch {
            toast.error("Failed to unschedule draft");
          }
        }}
      />
    </div>
  )
}
