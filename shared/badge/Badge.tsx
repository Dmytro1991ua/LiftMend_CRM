import { cn } from '@/lib/utils';

type BadgeProps = {
  items: string[];
  className?: string;
  bgColor?: string;
};

const Badge = ({ items, className, bgColor }: BadgeProps) => {
  return (
    <span className={cn('flex flex-wrap gap-2', className)}>
      {items.map((skill, index) => (
        <span key={`${skill}_${index}`} className={cn('p-2.5 text-white text-xs font-bold mr-3 rounded-3xl', bgColor)}>
          {skill}
        </span>
      ))}
    </span>
  );
};

export default Badge;
