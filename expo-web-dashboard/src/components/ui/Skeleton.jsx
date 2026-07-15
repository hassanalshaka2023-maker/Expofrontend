import { motion } from 'framer-motion';

export function SkeletonBox({ className = '', width = '100%', height = '20px' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-[#0d2338]/[0.07] ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function BoothSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <SkeletonBox height="200px" className="rounded-2xl" />
      <SkeletonBox width="60%" height="16px" />
      <SkeletonBox width="80%" height="12px" />
      <SkeletonBox width="40%" height="12px" />
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="p-6 space-y-5">
      <SkeletonBox width="50%" height="24px" />
      <SkeletonBox height="80px" />
      <SkeletonBox height="80px" />
      <SkeletonBox width="70%" height="40px" />
      <div className="flex gap-3">
        <SkeletonBox width="50%" height="44px" />
        <SkeletonBox width="50%" height="44px" />
      </div>
    </div>
  );
}