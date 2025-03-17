import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { BLURRED_IMAGE } from '../constants';

type UserAvatarProps = {
  imageSrc: string;
  fallbackAvatar?: boolean;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
};

const DEFAULT_AVATAR_SRC = '/user.png';

const UserAvatar = ({
  className,
  imageSrc,
  fallbackAvatar,
  imageHeight = 50,
  imageWidth = 50,
}: UserAvatarProps): React.JSX.Element => {
  return (
    <Avatar className={className} data-testid='user-avatar'>
      <AvatarImage asChild src={imageSrc}>
        <Image
          alt='avatar'
          blurDataURL={BLURRED_IMAGE}
          height={imageHeight}
          objectFit='cover'
          src={imageSrc}
          width={imageWidth}
        />
      </AvatarImage>
      <AvatarFallback>{fallbackAvatar}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
