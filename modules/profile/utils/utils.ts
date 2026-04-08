import { GetUserQuery } from '@/graphql/types/client/generated_types';

import { ProfileContentFormFields } from '../validation';

export const convertProfileDataToFormValues = (user: GetUserQuery['getUser'] | null): ProfileContentFormFields => ({
  email: user ? user.email : '',
  firstName: user ? user.firstName : '',
  lastName: user ? user.lastName : '',
  phoneNumber: user && user?.phone ? user.phone : '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
