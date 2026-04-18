// type PhotoEvidenceItem = {
//   id: string;
//   title: string;
//   content: React.ReactNode;
//   cardTittleClassName?: string;
//   cardHeaderClassName?: string;
//   cardContentClassName?: string;
// };

// const IMAGE_FRAME_CLASS = 'w-full aspect-video overflow-hidden bg-gray-50';
// const IMAGE_CLASS = 'w-full h-full object-cover';
// const CARD_CONTENT_CLASS = 'p-0 flex-1 overflow-hidden';

// export const getPhotoEvidenceConfig = (beforePhotoUrl: string, afterPhotoUrl?: string | null): PhotoEvidenceItem[] => [
//   {
//     id: 'before',
//     title: 'Before',
//     content: (
//       <div className={IMAGE_FRAME_CLASS}>
//         <img src={beforePhotoUrl} alt='Before' className={IMAGE_CLASS} />
//       </div>
//     ),
//     cardHeaderClassName: 'bg-primary text-white text-lg items-center font-bold',
//     cardTittleClassName: 'font-bold',
//     cardContentClassName: CARD_CONTENT_CLASS,
//   },
//   {
//     id: 'after',
//     title: 'After',
//     content: afterPhotoUrl ? (
//       <div className={IMAGE_FRAME_CLASS}>
//         <img src={afterPhotoUrl} alt='After' className={IMAGE_CLASS} />
//       </div>
//     ) : (
//       <div className='w-full aspect-video flex items-center justify-center text-gray-400 text-sm text-center px-4'>
//         Repair job is not completed yet.
//       </div>
//     ),
//     cardHeaderClassName: 'bg-primary text-white text-lg items-center',
//     cardTittleClassName: 'font-bold',
//     cardContentClassName: CARD_CONTENT_CLASS,
//   },
// ];

type PhotoEvidenceItem = {
  id: string;
  title: string;
  content: React.ReactNode;
  cardTittleClassName?: string;
  cardHeaderClassName?: string;
  cardContentClassName?: string;
};

const IMAGE_FRAME_CLASS = 'w-full h-[35rem] bg-gray-50 flex items-center justify-center';
const IMAGE_CLASS = 'max-w-full max-h-full object-contain';

export const getPhotoEvidenceConfig = (beforePhotoUrl: string, afterPhotoUrl?: string | null): PhotoEvidenceItem[] => [
  {
    id: 'before',
    title: 'Before',
    content: (
      <div className={IMAGE_FRAME_CLASS}>
        <img alt='Before' className={IMAGE_CLASS} src={beforePhotoUrl} />
      </div>
    ),
    cardHeaderClassName: 'bg-primary text-white text-lg items-center font-bold',
    cardTittleClassName: 'font-bold',
    cardContentClassName: 'p-0',
  },
  {
    id: 'after',
    title: 'After',
    content: afterPhotoUrl ? (
      <div className={IMAGE_FRAME_CLASS}>
        <img alt='After' className={IMAGE_CLASS} src={afterPhotoUrl} />
      </div>
    ) : (
      <div className='w-full flex items-center justify-center text-gray-400 text-sm text-center py-10'>
        Repair job is not completed yet.
      </div>
    ),
    cardHeaderClassName: 'bg-primary text-white text-lg items-center',
    cardTittleClassName: 'font-bold',
    cardContentClassName: 'flex h-full p-0',
  },
];
