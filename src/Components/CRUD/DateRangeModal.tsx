import { Calendar, CalendarCheck, CalendarRange, Check, Sun, X, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';

// --- Utility Functions for Calendar Logic ---

const getCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const days: Date[] = [];

    for (let i = startingDay; i > 0; i--) {
        const prevDay = new Date(year, month, 1 - i);
        days.push(prevDay);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    const totalDays = days.length;
    const trailingDaysNeeded = 42 - totalDays;

    for (let i = 1; i <= trailingDaysNeeded; i++) {
        const nextDay = new Date(year, month + 1, i);
        days.push(nextDay);
    }

    return days.slice(0, 42);
};

const formatDate = (date: Date | null | undefined): string => {
    // Validasi ganda: Pastikan date ada, berwujud Date object, dan bukan "Invalid Date"
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    // getMonth() mengembalikan index 0-11, jadi wajib + 1
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Calendar Month Renderer Component ---

interface CalendarMonthProps {
    displayDate: Date;
    dates: (Date | null)[];
    handleDateClick: (date: Date) => void;
    selectedDateStr: string | null;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ displayDate, dates, handleDateClick }) => {
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const days = useMemo(() => getCalendarDays(displayDate), [displayDate]);
    const today = new Date();
    const todayStr = formatDate(today);
    const startDate = dates[0] ? formatDate(dates[0]) : null;
    const endDate = dates[1] ? formatDate(dates[1]) : null;

    return (
        <div className="p-2 flex flex-col items-center select-none w-full max-w-xs mx-auto">
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 text-center w-full mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center w-full">
                {days.map((day, index) => {
                    const dayStr = formatDate(day);
                    const isCurrentMonth = day.getMonth() === displayDate.getMonth();
                    const isToday = dayStr === todayStr;
                    const isStart = dayStr === startDate;
                    const isEnd = dayStr === endDate;
                    const isSelected = isStart || isEnd;

                    let isInRange = false;
                    const start = dates[0];
                    const end = dates[1];

                    if (start && end) {
                        isInRange = day > start && day < end;
                    }

                    let className = "w-full aspect-square flex items-center justify-center text-sm transition-all cursor-pointer font-medium ";

                    // Current Month/Not Current Month Styling
                    className += isCurrentMonth ? 'text-slate-700' : 'text-slate-300 opacity-50 pointer-events-none';

                    // Today Styling
                    if (isToday && !isSelected && !isInRange) {
                        className += ' border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold';
                    }

                    // Range Styling (Tengah-tengah rentang)
                    if (isInRange) {
                        className += ' bg-emerald-100/60 hover:bg-emerald-200 text-emerald-800 rounded-none';
                        if (isStart) className += ' rounded-r-none';
                        if (isEnd) className += ' rounded-l-none';
                    }

                    // Selected Day Styling (Start/End)
                    if (isSelected) {
                        className += ' bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30 hover:bg-emerald-600';
                        if (isStart && !isEnd) className += ' rounded-r-none';
                        if (isEnd && !isStart) className += ' rounded-l-none';
                        if (isStart && isEnd) className += ' rounded-full';
                    } else if (isCurrentMonth && !isInRange) {
                        className += ' hover:bg-slate-100 hover:text-slate-900';
                    }

                    // Border radius untuk hari di luar range
                    if (isCurrentMonth && (!isInRange || (isStart && isEnd))) {
                        className = className.replace('rounded-none', 'rounded-full');
                    }

                    return (
                        <div key={index} className="px-0.5">
                            <div
                                className={className}
                                onClick={() => isCurrentMonth && handleDateClick(day)}
                            >
                                {day.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Modal Component ---

const DateRangeModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    onApply: (dates: Date[]) => void
}> = ({ isOpen, onClose, onApply }) => {
    const [dates, setDates] = useState<(Date | null)[]>([null, null]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const navigateMonth = (direction: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + direction);
            return newDate;
        });
    };

    const handleDateClick = useCallback((clickedDate: Date) => {
        const clickedMidnight = new Date(clickedDate);
        clickedMidnight.setHours(0, 0, 0, 0);

        const [start, end] = dates;

        if (!start || (start && end)) {
            setDates([clickedMidnight, null]);
        } else if (start && !end) {
            if (clickedMidnight.getTime() === start.getTime()) {
                setDates([null, null]);
            } else if (clickedMidnight < start) {
                setDates([clickedMidnight, start]);
            } else {
                setDates([start, clickedMidnight]);
            }
        }
    }, [dates]);


    const handleQuickRange = (type: 'today' | 'last7' | 'last30') => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let start = new Date(today);

        if (type === 'last7') start.setDate(today.getDate() - 6);
        if (type === 'last30') start.setDate(today.getDate() - 29);

        setCurrentDate(new Date(today));
        setDates([start, today]);
    }

    if (!isOpen) return null;

    const startDateStr = formatDate(dates[0]);
    const endDateStr = formatDate(dates[1]);
    const isRangeSelected = dates[0] && dates[1];

    const displayRange = isRangeSelected
        ? `${startDateStr} - ${endDateStr}`
        : dates[0] ? `${startDateStr} - ...` : 'Belum Dipilih';

    const datesToApply = isRangeSelected ? [dates[0] as Date, dates[1] as Date] : [];

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-60">
            {/* Animasi Masuk: zoom-in dan fade-in */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center">
                        <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Filter Rentang Tanggal</h2>
                    </div>
                    <div className="text-sm font-semibold text-emerald-700 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-center">
                        {displayRange}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Filter Cepat (Quick Filters) */}
                    <div className="bg-slate-50/50 md:w-56 p-5 border-b md:border-b-0 md:border-r border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pintas Cepat</h4>
                        <div className="space-y-2">
                            <button onClick={() => handleQuickRange('today')} className="flex items-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <Sun className="w-4 h-4 mr-3" /> Hari Ini
                            </button>
                            <button onClick={() => handleQuickRange('last7')} className="flex items-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <CalendarRange className="w-4 h-4 mr-3" /> 7 Hari Terakhir
                            </button>
                            <button onClick={() => handleQuickRange('last30')} className="flex items-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <CalendarCheck className="w-4 h-4 mr-3" /> 30 Hari Terakhir
                            </button>
                        </div>
                    </div>

                    {/* Custom Calendar Area */}
                    <div className="p-6 w-full md:w-auto flex-1 flex flex-col items-center">
                        {/* Calendar Navigation */}
                        <div className="flex justify-between items-center mb-4 w-full max-w-xs">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-base font-bold text-slate-800">
                                {new Date(currentDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors active:scale-95"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <CalendarMonth
                            displayDate={currentDate}
                            dates={dates}
                            handleDateClick={handleDateClick}
                            selectedDateStr={null}
                        />

                        <p className="text-center mt-4 text-xs font-medium text-slate-400">
                            Pilih tanggal awal dan akhir untuk membuat rentang.
                        </p>
                    </div>
                </div>

                {/* Footer / Aksi */}
                <div className="flex justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => { setDates([null, null]); onClose() }}
                        className="flex items-center py-2.5 px-5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <X className="w-4 h-4 mr-2" /> Batal
                    </button>
                    <button
                        onClick={() => { onApply(datesToApply); onClose() }}
                        disabled={!isRangeSelected}
                        className={`flex items-center py-2.5 px-5 text-sm font-bold rounded-xl transition-all active:scale-95 ${isRangeSelected
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Check className="w-4 h-4 mr-2" /> Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DateRangeModal;