import React, { useState } from 'react';
import FileUploadInput from './FileUploadInput';
import { FormData } from '@/types';
import { selectDirectoryUniversal, selectFiles } from '@/utils/fileSystemApi';

interface SetupPanelProps {
	onStart: (formData: FormData) => void;
	loading: boolean;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ onStart, loading }) => {
	const [formData, setFormData] = useState<FormData>({
		imagesPath: '',
		metadataPath: '',
		traitsFile: null,
		imageMapFile: null,
		overallSchemaFile: null,
		traitSchemaFile: null,
	});

	const handleInputChange = (
		field: keyof FormData,
		value: string | File | FileSystemDirectoryHandle | null
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFileChange =
		(field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0] || null;
			handleInputChange(field, file);
		};

	const handleSubmit = () => {
		onStart(formData);
	};

	const isComplete =
		formData.imagesPath &&
		formData.metadataPath &&
		formData.traitsFile &&
		formData.imageMapFile &&
		formData.overallSchemaFile &&
		formData.traitSchemaFile;

	return (
		<div className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Images Directory
				</label>
				<button
					type='button'
					onClick={async () => {
						const result = await selectDirectoryUniversal();
						if (result.handle) {
							handleInputChange('imagesDirectory', result.handle);
							handleInputChange('imagesPath', result.handle.name);
						}
					}}
					className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
					Select Images Directory
				</button>
				{formData.imagesPath && (
					<p className='text-sm text-gray-600 mt-1'>
						Selected: {formData.imagesPath}
					</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Metadata Directory
				</label>
				<button
					type='button'
					onClick={async () => {
						const result = await selectDirectoryUniversal();
						if (result.handle) {
							handleInputChange(
								'metadataDirectory',
								result.handle
							);
							handleInputChange(
								'metadataPath',
								result.handle.name
							);
						}
					}}
					className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
					Select Metadata Directory
				</button>
				{formData.metadataPath && (
					<p className='text-sm text-gray-600 mt-1'>
						Selected: {formData.metadataPath}
					</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Traits JSON File
				</label>
				<button
					type='button'
					onClick={async () => {
						const files = await selectFiles({
							multiple: false,
							accept: { 'application/json': ['.json'] },
						});
						if (files.length > 0) {
							const file = await files[0].getFile();
							handleInputChange('traitsFile', file);
						}
					}}
					className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
					Select Traits File
				</button>
				{formData.traitsFile && (
					<p className='text-sm text-gray-600 mt-1'>
						Traits File: {formData.traitsFile.name}
					</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Image Map JSON File
				</label>
				<button
					type='button'
					onClick={async () => {
						const files = await selectFiles({
							multiple: false,
							accept: { 'application/json': ['.json'] },
						});
						if (files.length > 0) {
							const file = await files[0].getFile();
							handleInputChange('imageMapFile', file);
						}
					}}
					className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
					Select Image Map File
				</button>
				{formData.imageMapFile && (
					<p className='text-sm text-gray-600 mt-1'>
						Image Map File: {formData.imageMapFile.name}
					</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Overall Schema JSON File
				</label>
				<button
					type='button'
					onClick={async () => {
						const files = await selectFiles({
							multiple: false,
							accept: { 'application/json': ['.json'] },
						});
						if (files.length > 0) {
							const file = await files[0].getFile();
							handleInputChange('overallSchemaFile', file);
						}
					}}
					className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
					Select Overall Schema File
				</button>
				{formData.overallSchemaFile && (
					<p className='text-sm text-gray-600 mt-1'>
						Overall Schema File: {formData.overallSchemaFile.name}
					</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Trait Schema JSON File
				</label>
				<button
					type='button'
					onClick={async () => {
						const files = await selectFiles({
							multiple: false,
							accept: { 'application/json': ['.json'] },
						});
						if (files.length > 0) {
							const file = await files[0].getFile();
							handleInputChange('traitSchemaFile', file);
						}
					}}
					className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
					Select Trait Schema File
				</button>
				{formData.traitSchemaFile && (
					<p className='text-sm text-gray-600 mt-1'>
						Trait Schema File: {formData.traitSchemaFile.name}
					</p>
				)}
			</div>

			{/* Submit Button */}
			<div className='mt-8 pt-6 border-t border-gray-200'>
				<button
					type='button'
					onClick={handleSubmit}
					disabled={!isComplete || loading}
					className='w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
					{loading ? 'Processing...' : 'Start Training'}
				</button>
			</div>
		</div>
	);
};

export default SetupPanel;
