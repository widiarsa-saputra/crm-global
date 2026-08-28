import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent, MousePointerClick } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useIndexDashboard } from '@/services/dashboard';
import { Loader2 } from 'lucide-react';
import { CampaignCalendar } from './CampaignCalendar';
import { BaseTable } from '@/shared/components/table/BaseTable';
import { getStatusBadge } from '@/features/campaign-contacts/pages/CampaignContactsPage';
import { getMetricColor } from '@/lib/utils';

const DashboardMainContent: React.FC = () => {
    const { data: response, isLoading } = useIndexDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[80dvh]">
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

    const sortedDistributionData = [...segmentDistributionData].sort((a, b) => b.value - a.value);
    const totalDistributionContacts = sortedDistributionData.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className="py-4 h-full overflow-auto bg-slate-50/50">

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Left Column: Metric Cards */}
                <div className="flex flex-col gap-4 lg:col-span-1 h-[320px]">
                    <Card className="flex-1 flex flex-col justify-center shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
                            <Percent className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{dashboardData?.summary.avg_open_rate || 0}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Global average</p>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 flex flex-col justify-center shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Click Rate</CardTitle>
                            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{dashboardData?.summary.avg_click_rate || 0}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Global average</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Top Contacts Table */}
                <section className="lg:col-span-3 border rounded p-3 flex flex-col space-y-2 bg-white">
                    <header className=''>
                        <h2 className="text-md font-medium text-muted-foreground">Top 8 Active Contacts (Engagement)</h2>
                    </header>
                    <article className="overflow-hidden flex-1 p-0">
                        <BaseTable
                            columns={[
                                { title: "No.", key: "no", className: "w-10 text-center", render: (_, idx) => <span className="text-sm font-medium text-slate-500">{idx + 1}</span> },
                                { title: "Contact", key: "name", render: (c) => <span className="font-semibold text-sm leading-tight">{c.name}</span> },
                                { title: "Email", key: "email", render: (c) => <span className="text-sm text-slate-500">{c.email}</span> },
                                { title: "Engagement", key: "engagement", render: (c) => <div className="text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded-md">{c.engagement}%</div> },
                                { title: "Opens", key: "opens", className: "text-right", render: (c) => <div className="text-sm text-right font-semibold">{c.opens} <span className="font-normal">times</span></div> },
                                { title: "Clicks", key: "clicks", className: "text-right", render: (c) => <div className="text-sm text-right font-semibold">{c.clicks} <span className="font-normal">times</span></div> }
                            ]}
                            data={dashboardData?.top_contacts || []}
                            emptyMessage="No top contacts found"
                        />
                    </article>
                </section>
            </div>

            {/* Charts Area */}
            <div className="flex flex-col gap-6 mb-6">
                {/* Grouped Bar Chart */}
                <Card className="w-full shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Engagement per Segment (Opens vs Clicks %)</CardTitle>
                    </CardHeader>
                    <CardContent className="pr-4">
                        <ResponsiveContainer width="100%" height={Math.max(300, segmentEngagementData.length * 60)}>
                            <BarChart layout="vertical" data={segmentEngagementData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="opened" name="Open Rate (%)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="clicked" name="Click Rate (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Schedule Calendar */}
                <Card className="w-full shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Schedule Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 bg-slate-50/50 p-6 pt-0 rounded-b-xl border-t">
                        <div className="mt-6 h-full">
                            <CampaignCalendar />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Distribution & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-sm flex flex-col h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-lg">Contact Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-y-auto">
                        <div className="flex flex-col">
                            {sortedDistributionData.map((item, index) => {
                                const percentage = totalDistributionContacts > 0 ? (item.value / totalDistributionContacts) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center gap-4 px-6 py-3 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-sm font-medium text-slate-700 truncate pr-2">{item.name}</span>
                                                <span className="text-sm font-semibold text-slate-900">{item.value.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-12 text-right shrink-0">
                                            <span className="text-xs font-medium text-slate-500">{percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedDistributionData.length === 0 && (
                                <div className="p-6 text-center text-sm text-slate-500">
                                    No data available.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Log */}
                <Card className="shadow-sm flex flex-col h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Blast Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden flex-1 p-0">
                        <BaseTable
                            columns={[
                                { title: "Campaign", key: "campaign_name", render: (c) => <span className="font-semibold text-xs leading-tight">{c.campaign_name}</span> },
                                { title: "Status", key: "status", render: (c) => getStatusBadge(c.status) },
                                { title: "Date", key: "date", render: (c) => <div className="text-[10px] leading-tight text-slate-500 font-medium whitespace-nowrap">{new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div> },
                                {
                                    title: "Open Rate",
                                    key: "open_rate",
                                    className: "text-right",
                                    render: (campaign) => (
                                        <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(campaign.open_rate)}`}>
                                            {campaign.open_rate} <Percent className="w-3 h-3 opacity-70" />
                                        </div>
                                    )
                                },
                                {
                                    title: "Click Rate",
                                    key: "click_rate",
                                    className: "text-right",
                                    render: (campaign) => (
                                        <div className={`flex items-center justify-end gap-1 font-semibold ${getMetricColor(campaign.click_rate)}`}>
                                            {campaign.click_rate} <Percent className="w-3 h-3 opacity-70" />
                                        </div>
                                    )
                                },
                            ]}
                            data={dashboardData?.recent_blast_campaigns || []}
                            emptyMessage="No recent campaigns"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardMainContent;
