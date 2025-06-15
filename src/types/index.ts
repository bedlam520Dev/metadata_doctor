// Core data structures
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
	imageData?: { tokenId: number; file: File; url: string }[]; // Add this
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

// UI and component types
export interface StatusMessage {
	message: string;
	type: 'info' | 'success' | 'error' | 'warning';
}

export interface FormData {
	imagesPath: string;
	metadataPath: string;
	imagesDirectory?: FileSystemDirectoryHandle;
	metadataDirectory?: FileSystemDirectoryHandle;
	traitsFile: File | null;
	imageMapFile: File | null;
	overallSchemaFile: File | null;
	traitSchemaFile: File | null;
}

export interface ImageItem {
	tokenId: number;
	imageNumber: number;
	imageUrl?: string;
}

export interface SelectionStatus {
	isValid: boolean;
	isOptimal: boolean;
	color: string;
}

export interface ProgressStats {
	current: number;
	total: number;
	percentage: number;
}

export interface TrainingStats {
	totalTrained: number;
	totalExamples: number;
	avgExamplesPerTrait: number;
}

// Component prop types
export interface StatusMessageProps {
	message: string;
	type: StatusMessage['type'];
	onClose?: () => void;
}

export interface ProgressBarProps {
	current: number;
	total: number;
	showPercentage?: boolean;
	className?: string;
}

export interface FileUploadInputProps {
	label: string;
	accept?: string;
	placeholder?: string;
	helperText?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
	required?: boolean;
}

export interface ImageItemProps {
	tokenId: number;
	imageNumber: number;
	isSelected: boolean;
	onClick: (tokenId: number) => void;
	imageUrl?: string;
	className?: string;
}

export interface ImageGalleryProps {
	images: ImageItem[];
	selectedImages: number[];
	onToggleImage: (tokenId: number) => void;
	loading?: boolean;
	className?: string;
}

export interface TraitTrainerProps {
	trait: TraitData;
	selectedImages: number[];
	onToggleImage: (tokenId: number) => void;
	onSave: () => void;
	onSkip: () => void;
	images: ImageItem[];
}

export interface SetupPanelProps {
	onStart: (formData: FormData) => void;
	loading: boolean;
}

export interface TrainingPanelProps {
	allTraits: TraitData[];
	currentTraitIndex: number;
	selectedImages: number[];
	trainingResults: Record<string, TrainingResult>;
	images: ImageItem[];
	onToggleImage: (tokenId: number) => void;
	onSaveTrait: () => void;
	onSkipTrait: () => void;
	onExport: () => void;
}

// File system and API types
export interface FileSystemAPISupport {
	supported: boolean;
	canRead: boolean;
	canWrite: boolean;
}

export interface DirectoryHandle {
	name: string;
	kind: 'directory';
	entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
	getFileHandle(name: string): Promise<FileSystemFileHandle>;
	getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
}

export interface FileHandle {
	name: string;
	kind: 'file';
	getFile(): Promise<File>;
}

// Validation types
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings?: string[];
}

export interface FileValidation {
	traitsFile: ValidationResult;
	imageMapFile: ValidationResult;
	overallSchemaFile: ValidationResult;
	traitSchemaFile: ValidationResult;
}

// App state types
export type AppStage = 'setup' | 'training' | 'completed';

export interface AppState {
	stage: AppStage;
	loading: boolean;
	status: StatusMessage;
	allTraits: TraitData[];
	currentTraitIndex: number;
	selectedImages: number[];
	trainingResults: Record<string, TrainingResult>;
	projectData: ProjectData;
	images: ImageItem[];
}

// Error types
export interface AppError {
	code: string;
	message: string;
	details?: any;
}

export interface FileError extends AppError {
	filename: string;
	fileType: string;
}

export interface ValidationError extends AppError {
	field: string;
	value: any;
}

// Configuration types
export interface AppConfig {
	maxFileSize: number;
	supportedImageFormats: string[];
	maxImagesPerTrait: number;
	minImagesPerTrait: number;
	optimalImagesPerTrait: {
		min: number;
		max: number;
	};
	localStorageKeys: {
		progress: string;
		config: string;
		cache: string;
	};
}

// Event handler types
export type FileChangeHandler = (
	field: keyof FormData
) => (e: React.ChangeEvent<HTMLInputElement>) => void;
export type ImageToggleHandler = (tokenId: number) => void;
export type StatusHandler = (
	message: string,
	type: StatusMessage['type']
) => void;

// Utility function types
export type ReadFileAsJSON = (file: File) => Promise<any>;
export type ValidateFile = (data: any) => ValidationResult;
export type ProcessTraitsData = (
	traitsData: Record<string, string[]>
) => TraitData[];
export type GenerateExportData = (
	trainingResults: Record<string, TrainingResult>,
	allTraits: TraitData[],
	projectData: ProjectData
) => ExportData;

// React component types
export type FC<P = {}> = React.FunctionComponent<P>;
export type PropsWithChildren<P = {}> = P & { children?: React.ReactNode };

// Custom hook types
export interface UseFileUploadReturn {
	formData: FormData;
	handleInputChange: (field: keyof FormData, value: any) => void;
	handleFileChange: FileChangeHandler;
	isComplete: boolean;
	validation: FileValidation;
}

export interface UseTrainingReturn {
	currentTrait: TraitData | null;
	isComplete: boolean;
	progress: ProgressStats;
	stats: TrainingStats;
	canSave: boolean;
	canSkip: boolean;
}

export interface UseImageGalleryReturn {
	images: ImageItem[];
	loading: boolean;
	error: string | null;
	loadImages: (
		imagePath: string,
		imageMap: Record<string, string>
	) => Promise<void>;
}

// Storage types
export interface StoredProgress {
	timestamp: string;
	currentTraitIndex: number;
	trainingResults: Record<string, TrainingResult>;
	allTraits: TraitData[];
	projectData: ProjectData;
}

// Export default types for common use
export type {
	ReactNode,
	ChangeEvent,
	MouseEvent,
	KeyboardEvent,
	FormEvent,
} from 'react';
