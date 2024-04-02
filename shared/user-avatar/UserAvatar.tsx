import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  imageSrc: string;
  imageFallback?: string;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
};

const UserAvatar = ({
  className,
  imageSrc,
  imageHeight = 50,
  imageWidth = 50,
  imageFallback,
}: UserAvatarProps): React.JSX.Element => {
  return (
    <Avatar className={className}>
      <AvatarImage asChild src={imageSrc}>
        <Image alt='avatar' height={imageHeight} objectFit='cover' src={imageSrc} width={imageWidth} />
      </AvatarImage>
      <AvatarFallback>{imageFallback}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
