import React from 'react';

interface ProgressBarProps {
	current: number;
	total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
	const percentage = total > 0 ? (current / total) * 100 : 0;

	return (
		<div className='w-full mb-6'>
			<div className='flex justify-between text-sm text-gray-600 mb-2'>
				<span>
					{current} / {total} traits completed
				</span>
				<span>{Math.round(percentage)}%</span>
			</div>
			<div className='w-full bg-gray-200 rounded-full h-3'>
				<div
					className='bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300'
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
