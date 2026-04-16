const FileUploadPlaceholder = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition'>
      <span className='text-sm text-gray-500'>Click or drag to upload</span>
      <span className='text-xs text-gray-400 mt-1'>JPG, PNG up to ~5MB</span>
    </div>
  );
};

export default FileUploadPlaceholder;
