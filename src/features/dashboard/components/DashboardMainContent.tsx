import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Percent, MousePointerClick } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useIndexDashboard } from '@/services/dashboard';
import { Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#F43F5E'];

const DashboardMainContent: React.FC = () => {
    const { data: response, isLoading } = useIndexDashboard();
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const dashboardData = response?.data;
    
    const segmentEngagementData = dashboardData?.engagement_per_segment.map(item => ({
        name: item.segment_name,
        opened: parseFloat(item.open_rate_pct),
        clicked: parseFloat(item.click_rate_pct)
    })) || [];

    const segmentDistributionData = dashboardData?.contact_distribution.map(item => ({
        name: item.segment_name,
        value: item.total_contact
    })) || [];
    return (
        <div className="p-6 h-full overflow-auto bg-slate-50/50">
            <h1 className="text-2xl font-bold mb-6">CRM & Analytics Dashboard</h1>
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Contacts</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.summary.active_contacts.toLocaleString('id-ID') || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total active contacts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns Sent</CardTitle>
                        <Mail className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.summary.total_campaigns_sent.toLocaleString('id-ID') || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
                        <Percent className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{dashboardData?.summary.avg_open_rate || 0}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Global average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Click Rate</CardTitle>
                        <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{dashboardData?.summary.avg_click_rate || 0}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Global average</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Grouped Bar Chart */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Engagement per Segment (Opens vs Clicks %)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={segmentEngagementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="opened" name="Open Rate (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="clicked" name="Click Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Donut Chart */}
                <Card className="lg:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Contact Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segmentDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {segmentDistributionData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Log */}
            <Card className="shadow-sm mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Blast Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dashboardData?.recent_blast_campaigns.length ? dashboardData.recent_blast_campaigns.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-semibold text-sm">{activity.campaign_name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Segment: {activity.segment_name || 'All Contacts'}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className={activity.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200 capitalize' : 'capitalize'}>
                                        {activity.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(activity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} {activity.time ? `• ${activity.time}` : ''}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-sm text-muted-foreground py-4">No recent campaigns</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardMainContent;
