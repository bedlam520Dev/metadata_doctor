'use client';

import { useState } from 'react';
import SetupPanel from './SetupPanel';
import TrainingPanel from './TrainingPanel';
import StatusMessage from './StatusMessage';
import { type FormData, type TraitData } from '@/types';
import { readImagesFromDirectory } from '@/utils/fileSystemApi';

interface TrainingResult {
	type: string;
	value: string;
	examples: number[];
}

interface ProjectData {
	traitsData: Record<string, string[]> | null;
	imageMap: Record<string, any> | null;
	overallSchema: any | null;
	traitSchema: any | null;
	imagesPath: string;
	imageData: { tokenId: number; file: File }[];
	metadataPath: string;
}

interface Status {
	message: string;
	type: 'info' | 'success' | 'error';
}

export default function NFTMetadataTrainer() {
	const [stage, setStage] = useState<'setup' | 'training'>('setup');
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<Status>({ message: '', type: 'info' });

	const [allTraits, setAllTraits] = useState<TraitData[]>([]);
	const [currentTraitIndex, setCurrentTraitIndex] = useState(0);
	const [selectedImages, setSelectedImages] = useState<number[]>([]);
	const [trainingResults, setTrainingResults] = useState<
		Record<string, TrainingResult>
	>({});

	const [projectData, setProjectData] = useState<ProjectData>({
		traitsData: null,
		imageMap: null,
		overallSchema: null,
		traitSchema: null,
		imagesPath: '',
		imageData: [],
		metadataPath: '',
	});

	const showStatus = (
		message: string,
		type: 'info' | 'success' | 'error' = 'info'
	) => {
		setStatus({ message, type });
	};

	const clearStatus = () => {
		setStatus({ message: '', type: 'info' });
	};

	const readFileAsJSON = <T = any,>(file: File): Promise<T> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					resolve(JSON.parse(e.target?.result as string) as T);
				} catch (error) {
					reject(error);
				}
			};
			reader.onerror = reject;
			reader.readAsText(file);
		});
	};

	// In handleStartTraining, add directory processing:
	const handleStartTraining = async (formData: FormData) => {
		setLoading(true);
		try {
			showStatus('Loading files and directories...', 'info');
			if (!formData.traitsFile) {
				throw new Error('Traits file is not selected.');
			}

			const rawTraitsData = await readFileAsJSON<
				Record<string, string[]>
			>(formData.traitsFile);
			const imageMap = await readFileAsJSON(formData.imageMapFile!);
			const overallSchema = await readFileAsJSON(
				formData.overallSchemaFile!
			);
			const traitSchema = await readFileAsJSON(formData.traitSchemaFile!);

			// Transform rawTraitsData into an array of TraitData
			const processedTraits: TraitData[] = [];
			if (rawTraitsData) {
				for (const type in rawTraitsData) {
					if (
						Object.prototype.hasOwnProperty.call(
							rawTraitsData,
							type
						)
					) {
						const values: string[] = rawTraitsData[type];
						if (Array.isArray(values)) {
							for (const value of values) {
								processedTraits.push({
									type: type,
									value: value,
									key: `${type}:${value}`, // Construct a unique key
								});
							}
						} else {
							console.warn(
								`Values for trait type "${type}" is not an array:`,
								values
							);
						}
					}
				}
			} else {
				console.warn(
					'Traits data is null or undefined after reading file.'
				);
			}

			// Load images from directory if available
			let imageData: { tokenId: number; file: File; url: string }[] = [];
			if (formData.imagesDirectory) {
				showStatus('Loading images from directory...', 'info');
				imageData = await readImagesFromDirectory(
					formData.imagesDirectory
				);
			}

			// Store image data in project data
			setProjectData({
				traitsData: rawTraitsData,
				imageMap,
				overallSchema,
				traitSchema,
				imagesPath: formData.imagesPath,
				metadataPath: formData.metadataPath,
				imageData,
			});

			setAllTraits(processedTraits);
			setCurrentTraitIndex(0);
			setSelectedImages([]);
			setTrainingResults({});
			setStage('training');

			if (processedTraits.length > 0) {
				showStatus(
					'Training started! Select example images for each trait.',
					'success'
				);
			} else {
				showStatus(
					'Setup complete, but no traits found to train. Please check your traits JSON file.',
					'error'
				);
				setStage('setup'); // Revert to setup if no traits
			}
		} catch (error) {
			showStatus(
				`Error during setup: ${(error as Error).message}`,
				'error'
			);
			setStage('setup'); // Revert to setup on error
		} finally {
			setLoading(false);
		}
	};

	const handleToggleImage = (tokenId: number) => {
		setSelectedImages((prev) => {
			const index = prev.indexOf(tokenId);
			if (index === -1) {
				return [...prev, tokenId];
			} else {
				return prev.filter((id) => id !== tokenId);
			}
		});
	};

	const handleSaveTrait = () => {
		if (selectedImages.length === 0) return;

		const trait = allTraits[currentTraitIndex];
		setTrainingResults((prev) => ({
			...prev,
			[trait.key]: {
				type: trait.type,
				value: trait.value,
				examples: [...selectedImages],
			},
		}));

		showStatus(
			`Saved ${selectedImages.length} examples for "${trait.key}"`,
			'success'
		);
		setCurrentTraitIndex((prev) => prev + 1);
		setSelectedImages([]);
	};

	const handleSkipTrait = () => {
		const trait = allTraits[currentTraitIndex];
		showStatus(`Skipped "${trait.key}"`, 'info');
		setCurrentTraitIndex((prev) => prev + 1);
		setSelectedImages([]);
	};

	const handleExport = () => {
		const exportData = {
			timestamp: new Date().toISOString(),
			totalTraits: allTraits.length,
			trainedTraits: Object.keys(trainingResults).length,
			trainingResults,
			schemas: {
				overall: projectData.overallSchema,
				traits: projectData.traitSchema,
			},
			imageMap: projectData.imageMap,
			paths: {
				images: projectData.imagesPath,
				metadata: projectData.metadataPath,
			},
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `nft-training-data-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		showStatus('Training data exported successfully!', 'success');
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='bg-white border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
					<h1 className='text-3xl font-bold text-gray-900'>
						NFT Metadata Trainer
					</h1>
					<p className='mt-2 text-gray-600'>
						Train your visual trait library for automated metadata
						generation
					</p>
				</div>
			</div>

			<StatusMessage
				message={status.message}
				type={status.type}
				onClose={clearStatus}
			/>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{stage === 'setup' ?
					<SetupPanel
						onStart={handleStartTraining}
						loading={loading}
					/>
				:	<TrainingPanel
						allTraits={allTraits}
						currentTraitIndex={currentTraitIndex}
						selectedImages={selectedImages}
						trainingResults={trainingResults}
						onToggleImage={handleToggleImage}
						onSaveTrait={handleSaveTrait}
						onSkipTrait={handleSkipTrait}
						onExport={handleExport}
						imageData={projectData.imageData}
					/>
				}
			</div>
		</div>
	);
}
