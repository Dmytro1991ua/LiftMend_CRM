import { cn } from '@/lib/utils';

type TechnicianSkillsProps = {
  skills: string[];
  className?: string;
};

const TechnicianSkills = ({ skills, className }: TechnicianSkillsProps) => {
  return (
    <span className={cn('flex flex-wrap gap-2', className)}>
      {skills.map((skill, index) => (
        <span key={`${skill}_${index}`} className='p-2.5 bg-primary text-white text-xs font-bold mr-3 rounded-3xl'>
          {skill}
        </span>
      ))}
    </span>
  );
};

export default TechnicianSkills;
