// -*- coding: utf-8 -*-
// type: ignore

/**
 * Utility functions for NFT Metadata Trainer
 * Handles data processing, validation, and helper functions
 */

export interface TraitData {
	type: string;
	value: string;
	key: string;
}

export interface TrainingResult {
	type: string;
	value: string;
	examples: number[];
}

export interface ProjectData {
	traitsData: Record<string, string[]>;
	imageMap: Record<string, string>;
	overallSchema: Record<string, any>;
	traitSchema: Record<string, any>;
	imagesPath: string;
	metadataPath: string;
	imageData?: { tokenId: number; file: File; url: string }[]; // Add this}
}

export interface ExportData {
	timestamp: string;
	totalTraits: number;
	trainedTraits: number;
	trainingResults: Record<string, TrainingResult>;
	schemas: {
		overall: Record<string, any>;
		traits: Record<string, any>;
	};
	imageMap: Record<string, string>;
	paths: {
		images: string;
		metadata: string;
	};
}

/**
 * Processes traits data into flat array for training
 */
export const processTraitsData = (
	traitsData: Record<string, string[]>
): TraitData[] => {
	const traits: TraitData[] = [];

	for (const [traitType, traitValues] of Object.entries(traitsData)) {
		for (const traitValue of traitValues) {
			traits.push({
				type: traitType,
				value: traitValue,
				key: `${traitType}: ${traitValue}`,
			});
		}
	}

	return traits;
};

/**
 * Validates uploaded JSON files
 */
export const validateTraitsFile = (data: any): boolean => {
	if (!data || typeof data !== 'object') return false;

	return Object.entries(data).every(
		([key, value]) =>
			typeof key === 'string' &&
			Array.isArray(value) &&
			value.every((item) => typeof item === 'string')
	);
};

export const validateImageMapFile = (data: any): boolean => {
	if (!data || typeof data !== 'object') return false;

	return Object.entries(data).every(
		([key, value]) => !isNaN(Number(key)) && typeof value === 'string'
	);
};

export const validateSchemaFile = (data: any): boolean => {
	return data && typeof data === 'object';
};

/**
 * File reading utilities
 */
export const readFileAsJSON = (file: File): Promise<any> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const result = JSON.parse(e.target?.result as string);
				resolve(result);
			} catch (error) {
				reject(new Error(`Invalid JSON file: ${error}`));
			}
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsText(file);
	});
};

/**
 * Progress calculation utilities
 */
export const calculateProgress = (current: number, total: number): number => {
	return total > 0 ? Math.round((current / total) * 100) : 0;
};

export const getProgressColor = (percentage: number): string => {
	if (percentage < 25) return 'from-red-500 to-red-600';
	if (percentage < 50) return 'from-orange-500 to-orange-600';
	if (percentage < 75) return 'from-yellow-500 to-yellow-600';
	return 'from-green-500 to-green-600';
};

/**
 * Selection validation utilities
 */
export const getSelectionStatus = (count: number) => {
	if (count === 0)
		return { isValid: false, isOptimal: false, color: 'bg-gray-500' };
	if (count >= 3 && count <= 5)
		return { isValid: true, isOptimal: true, color: 'bg-green-500' };
	return { isValid: true, isOptimal: false, color: 'bg-orange-500' };
};

/**
 * Export utilities
 */
export const generateExportData = (
	trainingResults: Record<string, TrainingResult>,
	allTraits: TraitData[],
	projectData: ProjectData
): ExportData => {
	return {
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
};

export const downloadJSON = (data: any, filename: string): void => {
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

/**
 * Path utilities for Windows/Linux compatibility
 */
export const normalizePath = (path: string): string => {
	return path.replace(/\\/g, '/');
};

export const isValidPath = (path: string): boolean => {
	if (!path) return false;

	const windowsPattern = /^[a-zA-Z]:\\[\\\S|*\S]?.*$/;
	const unixPattern = /^\/.*$/;
	const relativePattern = /^\.\.?\/.*$/;

	return (
		windowsPattern.test(path) ||
		unixPattern.test(path) ||
		relativePattern.test(path)
	);
};

/**
 * Image utilities
 */
export const generateImageUrl = (
	imagePath: string,
	imageNumber: number
): string => {
	return `${normalizePath(imagePath)}/${imageNumber}.jpeg`;
};

export const extractImageNumber = (imageString: string): number => {
	const match = imageString.match(/Image#(\d+)/);
	return match ? parseInt(match[1], 10) : 0;
};

/**
 * Local storage utilities for progress saving
 */
export const saveProgressToStorage = (key: string, data: any): void => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.warn('Failed to save progress to localStorage:', error);
	}
};

export const loadProgressFromStorage = (key: string): any => {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.warn('Failed to load progress from localStorage:', error);
		return null;
	}
};

export const clearProgressFromStorage = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.warn('Failed to clear progress from localStorage:', error);
	}
};

/**
 * Statistics utilities
 */
export const calculateTrainingStats = (
	trainingResults: Record<string, TrainingResult>
) => {
	const totalTrained = Object.keys(trainingResults).length;
	const totalExamples = Object.values(trainingResults).reduce(
		(sum, result) => sum + result.examples.length,
		0
	);
	const avgExamplesPerTrait =
		totalTrained > 0 ? Math.round(totalExamples / totalTrained) : 0;

	return {
		totalTrained,
		totalExamples,
		avgExamplesPerTrait,
	};
};

/**
 * Error handling utilities
 */
export const createErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === 'string') {
		return error;
	}
	return 'An unknown error occurred';
};

/**
 * Debounce utility for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};
