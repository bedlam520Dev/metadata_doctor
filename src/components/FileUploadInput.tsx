import React from 'react';

interface FileUploadInputProps {
	label: string;
	accept?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	helperText?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
	label,
	accept,
	onChange,
	placeholder,
	helperText,
}) => (
	<div className='mb-6'>
		<label className='block text-sm font-semibold text-gray-700 mb-2'>
			{label}
		</label>
		{accept ?
			<input
				type='file'
				accept={accept}
				onChange={onChange}
				className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer'
			/>
		:	<input
				type='text'
				placeholder={placeholder}
				onChange={onChange}
				className='w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors'
			/>
		}
		{helperText && (
			<p className='text-xs text-gray-500 mt-1'>{helperText}</p>
		)}
	</div>
);

export default FileUploadInput;
