"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { TranslatedText } from "../translation/TranslatedText";

interface LuxuryCalendarProps {
  arrivalDate: string;
  departureDate: string;
  onArrivalChange: (date: string) => void;
  onDepartureChange: (date: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const LuxuryCalendar = ({ arrivalDate, departureDate, onArrivalChange, onDepartureChange, isOpen, onClose }: LuxuryCalendarProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingArrival, setSelectingArrival] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setSelectingArrival(!arrivalDate);
    } else {
      setSelectingArrival(!arrivalDate);
    }
  }, [isOpen, arrivalDate]);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesShort = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!arrivalDate || !departureDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= arrivalDate && dateStr <= departureDate;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === arrivalDate || dateStr === departureDate;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    if (selectingArrival) {
      onArrivalChange(dateStr);
      // Si hay fecha de salida y la nueva llegada es posterior, resetear salida
      if (departureDate && dateStr >= departureDate) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onDepartureChange(nextDay.toISOString().split('T')[0]);
      }
      setSelectingArrival(false);
    } else {
      if (dateStr <= arrivalDate) {
        // Si la fecha es anterior a llegada, cambiar llegada
        onArrivalChange(dateStr);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onDepartureChange(nextDay.toISOString().split('T')[0]);
        setSelectingArrival(false);
      } else {
        onDepartureChange(dateStr);
        onClose();
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  // Refs separados para móvil y desktop
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  // Animaciones solo para dropdown desktop (GSAP)
  useEffect(() => {
    if (isOpen) {
      // Mostrar dropdown desktop (solo visible en desktop por CSS)
      if (desktopDropdownRef.current) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          gsap.fromTo(desktopDropdownRef.current,
            { opacity: 0, y: 10, display: 'none' },
            { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: "power2.out" }
          );
        }
      }
    } else {
      // Ocultar dropdown desktop
      if (desktopDropdownRef.current) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          gsap.to(desktopDropdownRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              if (desktopDropdownRef.current) desktopDropdownRef.current.style.display = 'none';
            }
          });
        }
      }
    }
  }, [isOpen]);

  // Renderizar contenido del calendario
  const calendarContent = (
    <>
      {/* Header con indicador de arrastre en móvil */}
      <div className="flex items-center justify-center mb-4 md:hidden">
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-3 md:p-2 hover:bg-white/10 active:bg-white/20 rounded transition-colors touch-manipulation"
          aria-label="Mes anterior"
        >
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4 md:w-3 md:h-3">
            <path d="M7 2L3 6l4 4" />
          </svg>
        </button>
        <h3 className="font-source text-base md:text-sm text-white tracking-wider uppercase px-4 text-center font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-3 md:p-2 hover:bg-white/10 active:bg-white/20 rounded transition-colors touch-manipulation"
          aria-label="Mes siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4 md:w-3 md:h-3">
            <path d="M5 2l4 4-4 4" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-1 mb-3 md:mb-2">
        {dayNamesShort.map((day) => (
          <div key={day} className="text-center py-2 md:py-2">
            <span className="text-[10px] md:text-[9px] font-source text-white/50 uppercase tracking-wider font-medium">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-1">
        {days.map((day, idx) => {
          const dateStr = day.fullDate.toISOString().split('T')[0];
          const isSelected = isDateSelected(day.fullDate);
          const isInRange = isDateInRange(day.fullDate);
          const isDisabled = isDateDisabled(day.fullDate);
          const isArrival = dateStr === arrivalDate;
          const isDeparture = dateStr === departureDate;

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day.fullDate)}
              disabled={isDisabled}
              className={`
                aspect-square flex items-center justify-center text-base md:text-sm font-source transition-all touch-manipulation
                min-h-[44px] md:min-h-0
                ${!day.isCurrentMonth ? 'text-white/20' : 'text-white'}
                ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 active:bg-white/20 cursor-pointer'}
                ${isSelected ? 'bg-accent-rose text-white font-semibold scale-105' : ''}
                ${isInRange && !isSelected ? 'bg-white/5' : ''}
                ${isArrival ? 'rounded-l-full' : ''}
                ${isDeparture ? 'rounded-r-full' : ''}
                ${isInRange && !isArrival && !isDeparture ? 'rounded-none' : ''}
                ${!isSelected && !isInRange ? 'rounded-full' : ''}
              `}
            >
              {day.date}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-sm md:text-xs font-source text-white/60">
        <span className="uppercase tracking-wider text-center md:text-left font-medium">
          {selectingArrival ? 'Selecciona llegada' : 'Selecciona salida'}
        </span>
        <button
          onClick={onClose}
          className="uppercase tracking-wider hover:text-white active:text-white transition-colors touch-manipulation px-6 py-3 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 rounded-full md:rounded-sm font-medium"
        >
          Cerrar
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Modal móvil - CSS puro, sin GSAP - Visible solo en móvil */}
      <div
        className={`fixed inset-0 bg-black/70 z-[9998] md:!hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-1/2 left-4 right-4 bg-secondary shadow-2xl z-[9999] p-6 max-h-[85vh] overflow-y-auto md:!hidden transition-all duration-400 ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ transform: 'translateY(-50%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {calendarContent}
      </div>

      {/* Dropdown desktop - Renderizado relativo - Visible solo en desktop */}
      <div
        ref={desktopDropdownRef}
        className="absolute bottom-full left-0 w-[340px] bg-secondary shadow-2xl z-[100] mb-4 border border-white/10 p-6 hidden max-md:!hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {calendarContent}
      </div>
    </>
  );
};

interface LuxurySelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const LuxurySelect = ({ label, value, options, onChange, isOpen, onToggle, onClose }: LuxurySelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(dropdownRef.current, 
        { opacity: 0, y: 10, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: "power2.out" }
      );
      gsap.to(iconRef.current, { rotation: 180, duration: 0.3 });
    } else {
      gsap.to(dropdownRef.current, { 
        opacity: 0, y: 10, duration: 0.2, ease: "power2.in",
        onComplete: () => { if(dropdownRef.current) dropdownRef.current.style.display = 'none'; }
      });
      gsap.to(iconRef.current, { rotation: 0, duration: 0.3 });
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1 w-full md:min-w-[220px] relative group border-b border-white/30 pb-2 cursor-pointer" 
         onClick={onToggle}>
      <label className="text-[10px] font-source tracking-[0.2em] uppercase opacity-50 text-white">
        <TranslatedText>{label}</TranslatedText>
      </label>
      <div className="flex justify-between items-center">
        <span className="text-lg font-source text-white tracking-wide">
          <TranslatedText>{value}</TranslatedText>
        </span>
        <svg 
          ref={iconRef}
          width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <div 
        ref={dropdownRef}
        className="luxury-select-dropdown absolute bottom-full left-0 w-full bg-secondary shadow-2xl z-[100] mb-4 py-2 border border-white/10 hidden"
      >
        {options.map((opt) => (
          <div 
            key={opt}
            onClick={(e) => {
              e.stopPropagation();
              onChange(opt);
              onClose();
            }}
            className="px-4 py-3 text-sm font-source text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <TranslatedText>{opt}</TranslatedText>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BookingEngineProps {
  content: {
    arrival: string;
    rooms: string;
    guests: string;
    rooms_options: string[];
    guests_options: string[];
    cta: string;
  };
}

const BookingEngine = ({ content }: BookingEngineProps) => {
  const [rooms, setRooms] = useState(content.rooms_options[0]);
  const [guests, setGuests] = useState(content.guests_options[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const dateContainerRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  const formatDateRange = (): string => {
    if (!arrivalDate && !departureDate) return 'Seleccionar fechas';
    if (arrivalDate && !departureDate) return `${formatDate(arrivalDate)} - ...`;
    if (arrivalDate && departureDate) return `${formatDate(arrivalDate)} - ${formatDate(departureDate)}`;
    return 'Seleccionar fechas';
  };

  const handleDateClick = () => {
    // Cerrar otros dropdowns
    if (openDropdown !== 'date') {
      setOpenDropdown('date');
    } else {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dateContainerRef.current && 
        !dateContainerRef.current.contains(target) &&
        !(target as Element).closest('.luxury-select-dropdown')
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-12 md:mt-16 w-full max-w-5xl px-4 mx-auto relative z-10'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
          <div 
            ref={dateContainerRef}
            className="flex flex-col gap-1 w-full border-b border-white/30 pb-2 cursor-pointer relative group"
            onClick={handleDateClick}
          >
            <label className="text-[10px] font-source tracking-[0.2em] uppercase opacity-50 text-white">
              <TranslatedText>{content.arrival}</TranslatedText>
            </label>
            <div className="flex justify-between items-center">
              <span className="text-lg font-source text-white tracking-wide">{formatDateRange()}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-70 group-hover:opacity-100 transition-opacity">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            
            <LuxuryCalendar
              arrivalDate={arrivalDate}
              departureDate={departureDate}
              onArrivalChange={(date) => {
                setArrivalDate(date);
                if (!departureDate || new Date(date) >= new Date(departureDate)) {
                  const nextDay = new Date(date);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setDepartureDate(nextDay.toISOString().split('T')[0]);
                }
              }}
              onDepartureChange={(date) => {
                setDepartureDate(date);
              }}
              isOpen={openDropdown === 'date'}
              onClose={() => setOpenDropdown(null)}
            />
          </div>
          
          <LuxurySelect 
            label={content.rooms} 
            value={rooms}
            options={content.rooms_options}
            onChange={setRooms}
            isOpen={openDropdown === 'rooms'}
            onToggle={() => setOpenDropdown(openDropdown === 'rooms' ? null : 'rooms')}
            onClose={() => setOpenDropdown(null)}
          />

          <LuxurySelect 
            label={content.guests} 
            value={guests}
            options={content.guests_options}
            onChange={setGuests}
            isOpen={openDropdown === 'guests'}
            onToggle={() => setOpenDropdown(openDropdown === 'guests' ? null : 'guests')}
            onClose={() => setOpenDropdown(null)}
          />
        </div>
        
        <button className='w-full md:w-auto flex items-center justify-center gap-6 bg-secondary border border-secondary rounded-full px-10 py-4 hover:bg-white text-white hover:text-secondary transition-all duration-300 group shadow-xl'>
            <span className='font-source tracking-[0.2em] text-sm font-medium'>
              <TranslatedText>{content.cta}</TranslatedText>
            </span>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        </button>
    </div>
  )
}

export default BookingEngine;
