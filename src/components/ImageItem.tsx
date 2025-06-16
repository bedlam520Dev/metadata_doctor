import React, { useEffect, useState } from 'react';

interface ImageItemProps {
	tokenId: number;
	imageFile: File;
	isSelected: boolean;
	onClick: (tokenId: number) => void;
}

const FALLBACK_IMAGE_SRC =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

export default function ImageItem({
	tokenId,
	imageFile,
	isSelected,
	onClick,
}: ImageItemProps) {
	const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

	useEffect(() => {
		let objectUrl: string | null = null;
		if (imageFile) {
			objectUrl = URL.createObjectURL(imageFile);
			setCurrentImageUrl(objectUrl);
		}

		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
			setCurrentImageUrl('');
		};
	}, [imageFile]);

	return (
		<div
			className={`flex flex-col min-w-0 relative border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
				isSelected
					? 'border-blue-500 bg-blue-50 shadow-lg'
					: 'border-gray-200 hover:border-gray-300'
			}`}
			onClick={() => onClick(tokenId)}>
			<div className='aspect-square bg-gray-100 rounded-lg overflow-hidden h-full'>
				<img
					src={currentImageUrl || FALLBACK_IMAGE_SRC}
					alt={`Token ${tokenId}`}
					className='w-full h-full object-cover'
					onError={(e) => {
						(e.target as HTMLImageElement).src = FALLBACK_IMAGE_SRC;
					}}
				/>
			</div>
			<div className='px-2 py-1 text-center'>
				<div className='text-xs font-medium text-gray-700 truncate h-5'>
					Token {tokenId}
				</div>
			</div>
			{isSelected && (
				<div className='absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm'>
					✓
				</div>
			)}
		</div>
	);
}
