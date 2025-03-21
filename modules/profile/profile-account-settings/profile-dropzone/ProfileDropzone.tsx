import React, { ReactNode } from 'react';

import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

type ProfileDropzoneProps = {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  children?: ReactNode;
};

const ProfileDropzone = ({ getRootProps, getInputProps, children }: ProfileDropzoneProps) => {
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default ProfileDropzone;
