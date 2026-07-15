import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-br from-[#27e8df] via-[#00a8bd] to-[#d3aa56] text-[#001116] shadow-lg shadow-[#00c4ca]/25',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25',
  danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25',
  ghost: 'bg-white text-[#0c3455] border border-[#0b93a6]/30 hover:bg-[#0b93a6]/[0.06]',
};

export default function Button({ children, variant = 'primary', onClick, className = '', disabled = false, size = 'md' }) {
  const sizeClasses = size === 'sm' 
    ? 'px-3 py-2 text-[10px] min-h-[36px]' 
    : 'px-5 py-3 text-xs min-h-[48px]';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden font-bold rounded-lg tracking-wide
        ${sizeClasses} ${variants[variant]} ${className}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300
      `}
    >
      {/* Shine effect layer */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}