import React from 'react';
import ImageItem from './ImageItem';

interface ImageGalleryProps {
	selectedImages: number[];
	onToggleImage: (tokenId: number) => void;
	imageData: { tokenId: number; file: File }[];
}

export default function ImageGallery({
	selectedImages,
	onToggleImage,
	imageData,
}: ImageGalleryProps) {
	return (
		<div className='w-full border rounded-lg bg-white'>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 max-h-96 overflow-y-auto auto-rows-fr'>
				{imageData.map(({ tokenId, file }) => (
					<ImageItem
						key={tokenId}
						tokenId={tokenId}
						imageFile={file}
						isSelected={selectedImages.includes(tokenId)}
						onClick={onToggleImage}
					/>
				))}
			</div>
		</div>
	);
}
