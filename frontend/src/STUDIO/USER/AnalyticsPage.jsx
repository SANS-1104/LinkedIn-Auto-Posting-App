import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../LANDING-PAGE/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../LANDING-PAGE/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Filter,
  Download,
  Calendar,
  Target
} from "lucide-react";
import { Button } from "../LANDING-PAGE/ui/button";
import { Badge } from "../LANDING-PAGE/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../LANDING-PAGE/ui/card";

const postsData = [
  {
    id: 1,
    title: "AI automation trends for 2024",
    date: "2024-07-20",
    impressions: 15420,
    likes: 1250,
    comments: 89,
    shares: 156,
    viralityScore: 85,
    topic: "Technology"
  },
  {
    id: 2,
    title: "Remote work productivity hacks",
    date: "2024-07-18",
    impressions: 8950,
    likes: 720,
    comments: 45,
    shares: 93,
    viralityScore: 72,
    topic: "Productivity"
  },
  {
    id: 3,
    title: "LinkedIn marketing strategies",
    date: "2024-07-15",
    impressions: 12300,
    likes: 980,
    comments: 67,
    shares: 134,
    viralityScore: 78,
    topic: "Marketing"
  },
  {
    id: 4,
    title: "Career development insights",
    date: "2024-07-12",
    impressions: 6780,
    likes: 425,
    comments: 32,
    shares: 58,
    viralityScore: 65,
    topic: "Career"
  },
  {
    id: 5,
    title: "Industry trends analysis",
    date: "2024-07-10",
    impressions: 11200,
    likes: 890,
    comments: 76,
    shares: 112,
    viralityScore: 74,
    topic: "Business"
  }
];

const impressionsVsViralityData = postsData.map(post => ({
  impressions: post.impressions,
  virality: post.viralityScore,
  title: post.title,
  engagement: post.likes + post.comments + post.shares
}));

const monthlyTrends = [
  { month: 'Jan', impressions: 45000, engagement: 3200, posts: 8 },
  { month: 'Feb', impressions: 52000, engagement: 3800, posts: 10 },
  { month: 'Mar', impressions: 48000, engagement: 3400, posts: 9 },
  { month: 'Apr', impressions: 61000, engagement: 4500, posts: 12 },
  { month: 'May', impressions: 58000, engagement: 4200, posts: 11 },
  { month: 'Jun', impressions: 67000, engagement: 5100, posts: 13 },
  { month: 'Jul', impressions: 54000, engagement: 4800, posts: 5 },
];

export function AnalyticsPage() {
  const getViralityColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getTotalEngagement = (post) => {
    return post.likes + post.comments + post.shares;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 blur-xl"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent">
            LinkedIn Analytics
          </h1>
        </div>
        <p className="text-muted-foreground">
          Deep insights into your LinkedIn content performance and engagement trends
        </p>
      </div>

      {/* Filters and Export */}
      <Card className="bg-gradient-to-r from-white to-green-50/30 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-green-600" />
                <span className="font-medium">Filters:</span>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Monthly Performance
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-gray-600" fontSize={12} />
                <YAxis className="text-gray-600" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  name="Impressions"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impressions vs Virality */}
        <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                Impressions vs Virality
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={impressionsVsViralityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="impressions" 
                  className="text-gray-600" 
                  fontSize={12}
                  name="Impressions"
                />
                <YAxis 
                  dataKey="virality" 
                  className="text-gray-600" 
                  fontSize={12}
                  name="Virality Score"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  labelFormatter={(value) => `Impressions: ${formatNumber(value)}`}
                />
                <Scatter 
                  dataKey="virality" 
                  fill="#8B5CF6"
                  r={8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Posts Performance Table */}
      <Card className="bg-gradient-to-br from-white to-amber-50/30 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-amber-800 bg-clip-text text-transparent">
              Post Performance Details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Post Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Impressions</TableHead>
                  <TableHead className="font-semibold text-gray-700">Engagement</TableHead>
                  <TableHead className="font-semibold text-gray-700">Virality</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsData.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium max-w-64">
                      <div className="truncate">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.topic}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{formatNumber(post.impressions)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-blue-500" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-green-500" />
                            <span>{post.shares}</span>
                          </div>
                        </div>
                        <div className="font-medium text-gray-900">
                          Total: {formatNumber(getTotalEngagement(post))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getViralityColor(post.viralityScore)}
                      >
                        {post.viralityScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}