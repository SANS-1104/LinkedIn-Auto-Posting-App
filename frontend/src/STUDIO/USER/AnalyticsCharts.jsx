import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../LANDING-PAGE/ui/card"
import { Badge } from "../LANDING-PAGE/ui/badge"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Clock, TrendingUp, Sparkles } from "lucide-react"
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";


const engagementData = [
  { date: 'Jan 1', engagement: 1200 },
  { date: 'Jan 8', engagement: 1400 },
  { date: 'Jan 15', engagement: 1100 },
  { date: 'Jan 22', engagement: 1800 },
  { date: 'Jan 29', engagement: 2200 },
  { date: 'Feb 5', engagement: 1900 },
  { date: 'Feb 12', engagement: 2500 },
]

const postPerformanceData = [
  { title: 'AI in Marketing', engagement: 2500, color: '#3B82F6' },
  { title: 'Remote Work Tips', engagement: 1800, color: '#10B981' },
  { title: 'LinkedIn Strategy', engagement: 2200, color: '#8B5CF6' },
  { title: 'Career Growth', engagement: 1600, color: '#F59E0B' },
  { title: 'Industry Trends', engagement: 1400, color: '#EF4444' },
]

const bestTimesData = [
  { time: '9:00 AM', score: 85, day: 'Tuesday', color: 'from-emerald-500 to-green-500' },
  { time: '1:00 PM', score: 78, day: 'Wednesday', color: 'from-blue-500 to-indigo-500' },
  { time: '11:00 AM', score: 72, day: 'Thursday', color: 'from-purple-500 to-violet-500' },
]

function EngagementChartCard() {
  return (
    <Card className="col-span-full lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent leading-6">
            Engagement Over Time
          </span>
        </CardTitle>
        <CardDescription>Total engagement across all posts in the last 6 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={engagementData}>
            <defs>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="date" className="text-gray-600" fontSize={12} tick={{ fill: '#6B7280' }} />
            <YAxis className="text-gray-600" fontSize={12} tick={{ fill: '#6B7280' }} />
            <Tooltip contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }} />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#engagementGradient)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function BestTimeToPostCard({ user }) {
  const [bestTimesData, setBestTimesData] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchBestTimes = async () => {
      try {
        const res = await axiosClient.get(`/analytics/best-time/${user._id}`);
        const weeklyTop3 = res.data.weeklyTop3 || [];

        const colors = [
          "from-emerald-500 to-green-500",
          "from-blue-500 to-indigo-500",
          "from-purple-500 to-violet-500"
        ];

        // Find the highest avg engagement in the weeklyTop3
        const maxScore = Math.max(...weeklyTop3.map(i => i.avg), 1); // 1 to avoid /0

        const formatted = weeklyTop3.map((item, index) => {
          const [day, hour] = item.key.split("-");
          return {
            time: formatHour(hour),
            // Calculate percentage relative to best score
            score: Math.round((item.avg / maxScore) * 100),
            day,
            color: colors[index % colors.length]
          };
        });


        setBestTimesData(formatted);
      } catch (error) {
        console.error("Error fetching best posting times:", error);
      }
    };

    fetchBestTimes();
  }, [user]);

  const formatHour = (hour) => {
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const adjusted = h % 12 || 12;
    return `${adjusted}:00 ${suffix}`;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
            Best Time to Post
          </span>
        </CardTitle>
        <CardDescription>Optimal posting times based on your audience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bestTimesData.length > 0 ? (
          bestTimesData.map((item, index) => (
            <div key={index} className="group relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-102">
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="font-semibold text-gray-900">{item.time}</div>
                  <div className="text-sm text-gray-600">{item.day}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 bg-gradient-to-r ${item.color} rounded-full`} />
                  <Badge variant="outline" className="bg-white/80 text-gray-700 border-gray-200 shadow-sm">
                    {item.score}% optimal
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Loading best times...</p>
        )}

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Pro Tip</span>
          </div>
          <p className="text-sm text-blue-700">
            Posting during these optimal times can increase engagement by up to 40%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TopPostsCard() {
  return (
    <Card className="col-span-full bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent leading-6">
            Top Performing Posts
          </span>
        </CardTitle>
        <CardDescription>Your most engaging posts from the last month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={postPerformanceData} layout="horizontal" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis type="number" className="text-gray-600" fontSize={12} tick={{ fill: '#6B7280' }} />
            <YAxis dataKey="title" type="category" className="text-gray-600" fontSize={12} width={120} tick={{ fill: '#6B7280' }} />
            <Tooltip contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }} />
            <Bar dataKey="engagement" radius={[0, 8, 8, 0]}>
              {postPerformanceData.map((entry, index) => (
                <Bar key={index} dataKey="engagement" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function AnalyticsCharts({user}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <EngagementChartCard />
      <BestTimeToPostCard user={user} />
      <TopPostsCard />
    </div>
  )
}
