import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { BLURRED_IMAGE } from '../constants';

type UserAvatarProps = {
  imageSrc: string;
  previewImage?: string | null;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
  isLoading?: boolean;
};

const UserAvatar = ({
  className,
  imageSrc,
  previewImage,
  imageHeight = 50,
  imageWidth = 50,
  isLoading,
}: UserAvatarProps): React.JSX.Element => {
  const displayedImage = isLoading ? BLURRED_IMAGE : previewImage ?? imageSrc;
  const fallbackImage = (!previewImage || !imageSrc) && !isLoading ? '/user.png' : BLURRED_IMAGE;

  return (
    <Avatar className={className} data-testid='user-avatar'>
      <AvatarImage asChild src={imageSrc}>
        <Image alt='avatar' height={imageHeight} objectFit='cover' src={displayedImage} width={imageWidth} />
      </AvatarImage>
      <AvatarFallback>
        <Image alt='avatar' height={imageHeight} objectFit='cover' src={fallbackImage} width={imageWidth} />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
