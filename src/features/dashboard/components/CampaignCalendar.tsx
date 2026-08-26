import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CampaignSchedule {
    id: string;
    campaign_name: string;
    email_subject: string;
    date: string; // YYYY-MM-DD
    time: string;
    timezone: string;
    status: string;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

const generateDummyData = (): CampaignSchedule[] => {
    const today = new Date();
    
    const offsetDate = (days: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        // Format as YYYY-MM-DD locally to avoid timezone shifts
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    return [
        {
            id: '1',
            campaign_name: 'Q3 Newsletter Blast',
            email_subject: 'Your Q3 Updates are here!',
            date: offsetDate(0),
            time: '10:00',
            timezone: 'WIB',
            status: 'completed'
        },
        {
            id: '2',
            campaign_name: 'Flash Sale Promo',
            email_subject: 'Hurry! 50% Off Everything',
            date: offsetDate(2),
            time: '14:30',
            timezone: 'WIB',
            status: 'scheduled'
        },
        {
            id: '3',
            campaign_name: 'VIP Invitation',
            email_subject: 'Exclusive Event for VIPs',
            date: offsetDate(5),
            time: '09:00',
            timezone: 'WIB',
            status: 'draft'
        },
        {
            id: '4',
            campaign_name: 'Follow-up Demo',
            email_subject: 'Did you miss our demo?',
            date: offsetDate(2),
            time: '16:00',
            timezone: 'WIB',
            status: 'scheduled'
        }
    ];
};

interface CampaignCalendarProps {
    data?: CampaignSchedule[];
}

export const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ data }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Fallback to dummy data if no data provided
    const campaigns = useMemo(() => data || generateDummyData(), [data]);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleMonthChange = (val: string) => {
        setCurrentDate(new Date(currentYear, parseInt(val), 1));
    };

    const handleYearChange = (val: string) => {
        setCurrentDate(new Date(parseInt(val), currentMonth, 1));
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Get days from previous month to fill the first row
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => ({
        day: prevMonthDays - firstDay + i + 1,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - firstDay + i + 1)
    }));

    const days = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i + 1)
    }));

    // Fill remaining cells in the last row
    const totalCells = blanks.length + days.length;
    const remainingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const endBlanks = Array.from({ length: remainingBlanks }, (_, i) => ({
        day: i + 1,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i + 1)
    }));

    const calendarGrid = [...blanks, ...days, ...endBlanks];
    
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getCampaignsForDate = (date: Date) => {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return campaigns.filter(c => c.date === dateString);
    };

    return (
        <div className="flex flex-col h-full w-full min-h-[650px]">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                        <SelectTrigger className="w-[140px] font-semibold bg-white">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((month, i) => (
                                <SelectItem key={i} value={i.toString()}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-[100px] font-semibold bg-white">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-9 w-9 bg-white">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="h-9 bg-white">
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9 bg-white">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-t border-l flex-1 rounded-t-md overflow-hidden bg-white h-full shadow-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 border-b border-r bg-slate-50">
                        {day}
                    </div>
                ))}
                {calendarGrid.map((cell, i) => {
                    const cellCampaigns = getCampaignsForDate(cell.date);
                    const today = isToday(cell.date);
                    
                    return (
                        <div 
                            key={i} 
                            className={cn(
                                "min-h-[100px] border-b border-r p-1.5 flex flex-col gap-1 overflow-hidden transition-colors relative",
                                !cell.isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "hover:bg-slate-50/30"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ml-auto",
                                    today ? "bg-primary text-white" : ""
                                )}>
                                    {cell.day}
                                </span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-1 mt-1 custom-scrollbar pr-1 absolute top-9 left-1 right-1 bottom-1">
                                <TooltipProvider delayDuration={300}>
                                    {cellCampaigns.map(campaign => (
                                        <Tooltip key={campaign.id}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={cn(
                                                        "text-left p-1.5 rounded border text-xs cursor-pointer hover:shadow-sm transition-all",
                                                        campaign.status === 'completed' ? "bg-green-50 border-green-200 text-green-800" :
                                                        campaign.status === 'scheduled' ? "bg-blue-50 border-blue-200 text-blue-800" :
                                                        "bg-slate-50 border-slate-200 text-slate-700"
                                                    )}
                                                >
                                                    <div className="font-semibold truncate leading-tight">{campaign.campaign_name}</div>
                                                    <div className="flex items-center gap-1 text-[10px] opacity-80 mt-0.5 font-medium">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {campaign.time} {campaign.timezone}
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="w-64 p-3 bg-white border shadow-xl text-slate-800" align="start">
                                                <div className="space-y-2">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Campaign</div>
                                                        <div className="font-bold text-sm">{campaign.campaign_name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Subject</div>
                                                        <div className="text-sm line-clamp-2 italic text-slate-600">"{campaign.email_subject}"</div>
                                                    </div>
                                                    <div className="flex items-center gap-4 pt-1">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-medium">{campaign.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <Globe className="w-3.5 h-3.5 text-primary" />
                                                            <span className="font-medium">{campaign.timezone}</span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 flex justify-end">
                                                        <Badge variant="outline" className={cn(
                                                            "capitalize text-[10px]",
                                                            campaign.status === 'completed' ? "text-green-600 border-green-200 bg-green-50" : ""
                                                        )}>
                                                            {campaign.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </TooltipProvider>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
