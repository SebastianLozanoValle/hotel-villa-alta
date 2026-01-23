"use client";

interface BookingFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  isDate?: boolean;
  value?: string;
}

const BookingField = ({ label, type = "text", placeholder, options, isDate, value }: BookingFieldProps) => {
  return (
    <div className='flex flex-col gap-1 w-full border-b border-white/30 pb-2 group hover:border-white transition-colors text-white/70 hover:text-white relative'>
      <label className='text-[10px] font-source tracking-widest uppercase opacity-50'>
        {label}
      </label>
      <div className='flex justify-between items-center relative'>
        {options ? (
          <select 
            className='bg-transparent text-base md:text-lg font-source tracking-wide outline-none appearance-none cursor-pointer w-full pr-8'
          >
            {options.map(opt => (
              <option key={opt} value={opt} className="bg-secondary text-white py-4">
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <div className="w-full relative">
            <input 
              type={isDate ? "date" : type} 
              placeholder={placeholder}
              className={`bg-transparent text-base md:text-lg font-source tracking-wide outline-none w-full placeholder:text-white/30 ${isDate ? 'opacity-0 absolute inset-0 z-10' : ''}`}
            />
            {isDate && (
              <span className="text-base md:text-lg font-source tracking-wide text-white pointer-events-none">
                {value || ''}
              </span>
            )}
          </div>
        )}
        <div className="absolute right-0 pointer-events-none">
          <svg 
            width="12" 
            height="8" 
            viewBox="0 0 12 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default BookingField;
