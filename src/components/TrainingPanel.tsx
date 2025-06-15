import React from 'react';
import ProgressBar from './ProgressBar';
import TraitTrainer from './TraitTrainer';
import { TraitData, TrainingResult } from '@/types';

interface TrainingPanelProps {
	allTraits: TraitData[];
	currentTraitIndex: number;
	selectedImages: number[];
	trainingResults: Record<string, TrainingResult>;
	onToggleImage: (tokenId: number) => void;
	onSaveTrait: () => void;
	onSkipTrait: () => void;
	onExport: () => void;
	imageData: { tokenId: number; file: File }[];
}

const TrainingPanel: React.FC<TrainingPanelProps> = ({
	allTraits,
	currentTraitIndex,
	selectedImages,
	trainingResults,
	onToggleImage,
	onSaveTrait,
	onSkipTrait,
	onExport,
	imageData,
}) => {
	if (currentTraitIndex >= allTraits.length) {
		return (
			<div className='bg-white rounded-xl shadow-lg p-8 text-center'>
				<h2 className='text-2xl font-bold text-green-600 mb-4'>
					Training Completed!
				</h2>
				<p className='text-gray-600 mb-6'>
					You've trained {Object.keys(trainingResults).length} traits.
					Export your results to continue.
				</p>
				<button
					onClick={onExport}
					className='bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200'>
					Export Training Data
				</button>
			</div>
		);
	}

	const currentTrait = allTraits[currentTraitIndex];

	return (
		<div className='bg-white rounded-xl shadow-lg p-8'>
			<ProgressBar current={currentTraitIndex} total={allTraits.length} />

			<TraitTrainer
				trait={currentTrait}
				selectedImages={selectedImages}
				onToggleImage={onToggleImage}
				onSave={onSaveTrait}
				onSkip={onSkipTrait}
				imageData={imageData}
			/>

			<div className='mt-8 p-4 bg-gray-50 rounded-lg text-center'>
				<button
					onClick={onExport}
					className='bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors'>
					Export Progress
				</button>
				<p className='text-gray-500 text-sm mt-2'>
					Save your progress anytime
				</p>
			</div>
		</div>
	);
};

export default TrainingPanel;
