import { Card, CardContent, CardHeader, CardTitle } from "../LANDING-PAGE/ui/card";
import { Badge } from "../LANDING-PAGE/ui/badge";
import { FileText, Calendar, Edit3, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react"
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

// Removed TypeScript interface and replaced with destructuring without type annotations
function OverviewCard({
  title,
  value,
  icon,
  description,
  badge,
  gradient,
  iconColor,
  descriptionColor
}) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${gradient}`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        <div className={`h-5 w-5 ${iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {description && (
          <p className={`text-xs ${descriptionColor || 'text-white/70'} mt-1`}>
            {description}
          </p>
        )}
        {badge && (
          <Badge 
            variant={badge.variant} 
            className={`mt-3 ${badge.className || ''} backdrop-blur-sm`}
          >
            {badge.text}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const [allPosts, setAllPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [averageVirality, setAverageVirality] = useState(0);
  
  useEffect(() => {
    totalPosts();
    fetchScheduled();
    fetchDrafts();
  }, []);

  const totalPosts = async () => {
    try {
      const res = await axiosClient.get("/blogs");
      setAllPosts(res.data);
      calculateAverageVirality(res.data);
    } catch (err) {
      toast.error("Failed to fetch Scheduled Posts");
    }
  };


  const fetchDrafts = async () => {
    try {
      const res = await axiosClient.get("/blogs");
      // console.log("Fetched drafts:", res.data); // 👈 debug
      const onlyDrafts = res.data.filter(post => post.status === "draft");
      // ✅ Save drafts for DraftsSidebar
      setDrafts(onlyDrafts);
    } catch (err) {
      toast.error("Failed to fetch drafts");
    }
  };

  const fetchScheduled = async () => {
    try {
      const res = await axiosClient.get("/blogs");
      // console.log("Fetched drafts:", res.data); // 👈 debug
      const onlyScheduled = res.data.filter(post => post.status === "scheduled");
      // ✅ Save drafts for DraftsSidebar
      setScheduledPosts(onlyScheduled);
    } catch (err) {
      toast.error("Failed to fetch Scheduled Posts");
    }
  };

  const calculateAverageVirality = (posts) => {
    if (!posts || posts.length === 0) {
      setAverageVirality(0);
      return;
    }

    const scores = posts
      .map(p => Number(p.viralityScore))
      .filter(score => !isNaN(score));

    if (scores.length === 0) {
      setAverageVirality(0);
      return;
    }

    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    setAverageVirality(Number(avg.toFixed(2))); // Round to 2 decimal places
  };

  const getViralityColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-emerald-100";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200 shadow-blue-100";
    if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200 shadow-amber-100";
    return "bg-red-100 text-red-800 border-red-200 shadow-red-100";
  };

  const getViralityText = (score) => {
    if (score >= 80) return "Viral";
    if (score >= 60) return "High";
    if (score >= 40) return "Moderate";
    return "Low";
  };

  const getNextScheduledDescription = () => {
  if (!scheduledPosts.length) return "No scheduled posts";

  const now = new Date();
  const futurePosts = scheduledPosts
    .filter(post => new Date(post.scheduledTime) > now) // <-- use scheduledTime
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)); // <-- use scheduledTime

  if (!futurePosts.length) return "No upcoming scheduled posts";

  const nextPost = new Date(futurePosts[0].scheduledTime); // <-- use scheduledTime
  const diffMs = nextPost - now;
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "Next post in less than a minute";
  if (diffMins < 60) return `Next post in ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Next post in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  const diffDays = Math.round(diffHours / 24);
  return `Next post in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
};

  const viralityScore = 8;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Posts"
        value={allPosts.length}
        icon={<FileText />}
        description="+12% from last month"
        gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        iconColor="text-blue-200"
        descriptionColor="text-blue-100"
      />
      <OverviewCard
        title="Scheduled Posts"
        value={scheduledPosts.length}
        icon={<Calendar />}
        description={getNextScheduledDescription()}
        gradient="bg-gradient-to-br from-emerald-600 to-green-600"
        iconColor="text-emerald-200"
        descriptionColor="text-emerald-100"
      />
      <OverviewCard
        title="Drafts"
        value={drafts.length}
        icon={<Edit3 />}
        description="Ready to schedule"
        gradient="bg-gradient-to-br from-purple-600 to-violet-600"
        iconColor="text-purple-200"
        descriptionColor="text-purple-100"
      />
      <OverviewCard
        title="Avg. Virality Score"
        value={`${averageVirality}%`}
        icon={<TrendingUp />}
        description={`Based on ${allPosts.length} posts`}
        gradient="bg-gradient-to-br from-amber-600 to-orange-600"
        iconColor="text-amber-200"
        descriptionColor="text-amber-100"
        badge={{
          text: getViralityText(averageVirality),
          variant: "outline",
          className: getViralityColor(averageVirality)
        }}
      />
    </div>
  );
}
