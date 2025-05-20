import { render, screen } from '@testing-library/react';

import { mockTechnicianCertificates, mockTechnicianSkills } from '@/mocks/dropdownOptions';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import SkillsAndCertifications from '@/modules/technician-management/components/technician-record-form/steps/skills-and-certifications';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';

jest.mock('@/shared/hooks/useFetchDropdownOptions');

describe('SkillsAndCertifications', () => {
  beforeEach(() => {
    (useFetchDropdownOptions as jest.Mock).mockImplementation(() => {
      return {
        dropdownOptions: {
          skills: [...mockTechnicianSkills.skills],
          certifications: [...mockTechnicianCertificates.certifications],
        },
        loading: false,
        error: undefined,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const SkillsAndCertificationsComponent = () => withApolloAndFormProvider(<SkillsAndCertifications />);

  it('should render component without crashing', async () => {
    render(SkillsAndCertificationsComponent());

    expect(screen.getByText('Technician Skill(s)')).toBeInTheDocument();
    expect(screen.getByText('Technician Certificate(s)')).toBeInTheDocument();
  });
});
