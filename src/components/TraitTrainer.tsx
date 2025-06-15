import React from 'react';
import ImageGallery from './ImageGallery';
import { TraitData } from '@/types';

interface TraitTrainerProps {
	trait: TraitData;
	selectedImages: number[];
	onToggleImage: (tokenId: number) => void;
	onSave: () => void;
	onSkip: () => void;
	imageData: { tokenId: number; file: File }[];
}

const TraitTrainer: React.FC<TraitTrainerProps> = ({
	trait,
	selectedImages,
	onToggleImage,
	onSave,
	onSkip,
	imageData,
}) => {
	const selectionCount = selectedImages.length;
	const isValid = selectionCount >= 1;
	const isOptimal = selectionCount >= 3 && selectionCount <= 5;

	const getCounterColor = () => {
		if (selectionCount === 0) return 'bg-gray-500';
		if (isOptimal) return 'bg-green-500';
		return 'bg-orange-500';
	};

	return (
		<div className='bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h3 className='text-xl font-bold text-gray-800 mb-2'>
						{trait.key}
					</h3>
					<p className='text-gray-600'>
						Select 3-5 example images (minimum 1) that show this
						trait
					</p>
				</div>
				<div
					className={`${getCounterColor()} text-white px-4 py-2 rounded-full font-semibold`}>
					{selectionCount} selected
				</div>
			</div>

			<ImageGallery
				selectedImages={selectedImages}
				onToggleImage={onToggleImage}
				imageData={imageData}
			/>

			<div className='flex justify-center gap-4 mt-6'>
				<button
					onClick={onSkip}
					className='px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'>
					Skip This Trait
				</button>
				<button
					onClick={onSave}
					disabled={!isValid}
					className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
					Save & Continue
				</button>
			</div>
		</div>
	);
};

export default TraitTrainer;
