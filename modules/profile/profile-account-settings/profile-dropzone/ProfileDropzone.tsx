import React, { ReactNode } from 'react';

import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

import { PROFILE_DROPZONE_TOOLTIP_MESSAGE } from '../../constants';

type ProfileDropzoneProps = {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  children?: ReactNode;
};

const ProfileDropzone = ({ getRootProps, getInputProps, children }: ProfileDropzoneProps) => {
  return (
    <div {...getRootProps()} title={PROFILE_DROPZONE_TOOLTIP_MESSAGE}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default ProfileDropzone;
