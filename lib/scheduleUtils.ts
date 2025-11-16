export interface ScheduleSettings {
  schedule: string;
  closedMessage: string;
}

export function parseSchedule(scheduleText: string): { isOpen: boolean; nextOpenTime?: string } {
  if (!scheduleText) {
    return { isOpen: true };
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const dayMap: { [key: string]: number[] } = {
    'lunes': [1],
    'martes': [2], 
    'miércoles': [3],
    'miercoles': [3],
    'jueves': [4],
    'viernes': [5],
    'sábado': [6],
    'sabado': [6],
    'sábados': [6],
    'sabados': [6],
    'domingo': [0],
    'domingos': [0],
    'lun': [1],
    'mar': [2],
    'mié': [3],
    'mie': [3],
    'jue': [4],
    'vie': [5],
    'sáb': [6],
    'sab': [6],
    'dom': [0]
  };

  const text = scheduleText.toLowerCase().trim();

  if (/(24\s*horas?|24\/7)/i.test(text)) {
    return { isOpen: true };
  }

  if (/todos\s+los\s+días?\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i.test(text)) {
    const match = text.match(/todos\s+los\s+días?\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i);
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = parseInt(match[2] || '0');
      const endHour = parseInt(match[3]);
      const endMin = parseInt(match[4] || '0');
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      return { isOpen: currentTime >= startTime && currentTime <= endTime };
    }
  }

  if (/(?:sábados?|sabados?)\s+y\s+(?:domingos?)\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i.test(text)) {
    const match = text.match(/(?:sábados?|sabados?)\s+y\s+(?:domingos?)\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i);
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = parseInt(match[2] || '0');
      const endHour = parseInt(match[3]);
      const endMin = parseInt(match[4] || '0');
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      const isWeekend = currentDay === 0 || currentDay === 6;
      const isInTimeRange = currentTime >= startTime && currentTime <= endTime;
      
      return { isOpen: isWeekend && isInTimeRange };
    }
  }

  if (/(?:lunes?)\s+a\s+(?:viernes?)\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i.test(text)) {
    const match = text.match(/(?:lunes?)\s+a\s+(?:viernes?)\s+de\s+(\d{1,2}):?(\d{2})?\s*(?:a|hasta)\s*(\d{1,2}):?(\d{2})?/i);
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = parseInt(match[2] || '0');
      const endHour = parseInt(match[3]);
      const endMin = parseInt(match[4] || '0');
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      const isWeekday = currentDay >= 1 && currentDay <= 5;
      const isInTimeRange = currentTime >= startTime && currentTime <= endTime;
      
      return { isOpen: isWeekday && isInTimeRange };
    }
  }

  const daySchedules = text.split(',').map(s => s.trim());
  
  for (const schedule of daySchedules) {
    const dayMatch = schedule.match(/(lunes?|martes?|miércoles?|miercoles?|jueves?|viernes?|sábados?|sabados?|domingos?)\s+(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?/i);
    
    if (dayMatch) {
      const dayName = dayMatch[1].toLowerCase();
      const startHour = parseInt(dayMatch[2]);
      const startMin = parseInt(dayMatch[3] || '0');
      const endHour = parseInt(dayMatch[4]);
      const endMin = parseInt(dayMatch[5] || '0');
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      if (dayMap[dayName] && dayMap[dayName].includes(currentDay)) {
        return { isOpen: currentTime >= startTime && currentTime <= endTime };
      }
    }
  }

  return { isOpen: true };
}

export function getScheduleStatus(scheduleText: string, closedMessage: string = 'Cerrado por ahora'): {
  isOpen: boolean;
  message?: string;
  nextOpenTime?: string;
} {
  const result = parseSchedule(scheduleText);
  
  if (!result.isOpen) {
    return {
      isOpen: false,
      message: closedMessage,
      nextOpenTime: result.nextOpenTime
    };
  }
  
  return { isOpen: true };
}
