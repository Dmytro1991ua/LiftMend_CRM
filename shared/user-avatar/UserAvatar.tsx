import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  imageSrc: string;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
};

const UserAvatar = ({ className, imageSrc, imageHeight = 50, imageWidth = 50 }: UserAvatarProps): React.JSX.Element => {
  return (
    <Avatar className={className} data-testid='user-avatar'>
      <AvatarImage asChild src={imageSrc}>
        <Image alt='avatar' height={imageHeight} objectFit='cover' src={imageSrc} width={imageWidth} />
      </AvatarImage>
      <AvatarFallback>
        <Image alt='avatar' height={imageHeight} objectFit='cover' src='/user.png' width={imageWidth} />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
