import React from 'react';
import { SALE_CALENDAR } from '../constants';

const SaleCalendar: React.FC = () => (
  <div className="space-y-2">
    {SALE_CALENDAR.map((event) => (
      <div key={event.title} className="flex gap-3 bg-white border border-slate-200 rounded-xl p-3">
        <div className="shrink-0 text-center bg-blue-50 text-blue-700 font-bold rounded-lg px-3 py-2 text-xs w-20">
          {event.dateHint}
        </div>
        <div>
          <p className="font-bold text-slate-700 text-sm">{event.title}</p>
          <p className="text-xs text-slate-500">{event.note}</p>
        </div>
      </div>
    ))}
  </div>
);

export default SaleCalendar;
