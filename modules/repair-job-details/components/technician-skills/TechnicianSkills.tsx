type TechnicianSkillsProps = {
  skills: string[];
};

const TechnicianSkills = ({ skills }: TechnicianSkillsProps) => {
  return (
    <span className='flex flex-wrap gap-2'>
      {skills.map((skill, index) => (
        <span key={`${skill}_${index}`} className='p-3 bg-primary text-white mr-3 rounded-3xl'>
          {skill}
        </span>
      ))}
    </span>
  );
};

export default TechnicianSkills;
