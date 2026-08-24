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

// Mock Data for Grouped Bar Chart (Per Segment Engagement)
const segmentEngagementData = [
    { name: 'VIP', opened: 85, clicked: 60 },
    { name: 'Hot Leads', opened: 65, clicked: 40 },
    { name: 'Inactive', opened: 10, clicked: 2 },
    { name: 'New Signups', opened: 50, clicked: 30 },
];

// Mock Data for Donut Chart (Distribution per Segment)
const segmentDistributionData = [
    { name: 'VIP', value: 1250 },
    { name: 'Hot Leads', value: 850 },
    { name: 'Inactive', value: 3200 },
    { name: 'New Signups', value: 450 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardMainContent: React.FC = () => {
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
                        <div className="text-2xl font-bold">5,750</div>
                        <p className="text-xs text-muted-foreground mt-1">vs 120 Bounced/Invalid</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns Sent</CardTitle>
                        <Mail className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground mt-1">+3 scheduled this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
                        <Percent className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">32.4%</div>
                        <p className="text-xs text-muted-foreground mt-1">Global average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Click Rate</CardTitle>
                        <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">12.8%</div>
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
                        {[
                            { name: 'Product Update v2.5', segment: 'All Active Users', status: 'completed', time: '2 days ago' },
                            { name: 'Re-engagement Campaign', segment: 'Inactive', status: 'completed', time: '1 week ago' },
                            { name: 'Promo Ramadhan 2026', segment: 'VIP & Hot Leads', status: 'scheduled', time: 'in 2 weeks' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-semibold text-sm">{activity.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Segment: {activity.segment}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className={activity.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''}>
                                        {activity.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardMainContent;
