/**
 * File System Access API utilities for local directory access
 * Note: This API only works in secure contexts (HTTPS or localhost) and requires user permission
 */

export interface DirectoryHandle {
	name: string;
	kind: 'directory';
	entries(): AsyncIterableIterator<
		[string, FileSystemFileHandle | FileSystemDirectoryHandle]
	>;
	getFileHandle(name: string): Promise<FileSystemFileHandle>;
	getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
}

export interface FileHandle {
	name: string;
	kind: 'file';
	getFile(): Promise<File>;
}

// Type guards
export function isFileHandle(handle: any): handle is FileSystemFileHandle {
	return handle && handle.kind === 'file';
}

export function isDirectoryHandle(
	handle: any
): handle is FileSystemDirectoryHandle {
	return handle && handle.kind === 'directory';
}

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
	return 'showDirectoryPicker' in window && 'showOpenFilePicker' in window;
}

/**
 * Select a directory using the File System Access API
 */
export async function selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
	try {
		if (!isFileSystemAccessSupported()) {
			throw new Error(
				'File System Access API is not supported in this browser'
			);
		}

		const dirHandle = await (window as any).showDirectoryPicker({
			mode: 'read',
		});

		return dirHandle;
	} catch (error) {
		if ((error as Error).name === 'AbortError') {
			return null; // User cancelled
		}
		throw error;
	}
}

/**
 * Select multiple files using the File System Access API
 */
export async function selectFiles(
	options: {
		multiple?: boolean;
		accept?: Record<string, string[]>;
	} = {}
): Promise<FileSystemFileHandle[]> {
	try {
		if (!isFileSystemAccessSupported()) {
			throw new Error(
				'File System Access API is not supported in this browser'
			);
		}

		const fileHandles = await (window as any).showOpenFilePicker({
			multiple: options.multiple || false,
			types:
				options.accept ?
					[
						{
							description: 'Supported files',
							accept: options.accept,
						},
					]
				:	undefined,
		});

		return fileHandles;
	} catch (error) {
		if ((error as Error).name === 'AbortError') {
			return [];
		}
		throw error;
	}
}

/**
 * Read all image files from a directory
 */
export async function readImagesFromDirectory(
	dirHandle: FileSystemDirectoryHandle
): Promise<{ tokenId: number; file: File; url: string }[]> {
	const images: { tokenId: number; file: File; url: string }[] = [];
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

	for await (const [name, handle] of (dirHandle as any).entries()) {
		if (isFileHandle(handle)) {
			const extension = name
				.toLowerCase()
				.substring(name.lastIndexOf('.'));
			if (imageExtensions.includes(extension)) {
				// Extract token ID from filename (assuming format like "1.jpg", "2.png", etc.)
				const tokenIdMatch = name.match(/^(\d+)\./);
				if (tokenIdMatch) {
					const tokenId = parseInt(tokenIdMatch[1]);
					const file = await handle.getFile();
					const url = URL.createObjectURL(file);
					images.push({ tokenId, file, url });
				}
			}
		}
	}

	// Sort by token ID
	return images.sort((a, b) => a.tokenId - b.tokenId);
}

/**
 * Read all JSON metadata files from a directory
 */
export async function readMetadataFromDirectory(
	dirHandle: FileSystemDirectoryHandle
): Promise<Record<number, any>> {
	const metadata: Record<number, any> = {};

	for await (const [name, handle] of (dirHandle as any).entries()) {
		if (isFileHandle(handle) && name.toLowerCase().endsWith('.json')) {
			// Extract token ID from filename (assuming format like "1.json", "2.json", etc.)
			const tokenIdMatch = name.match(/^(\d+)\.json$/);
			if (tokenIdMatch) {
				const tokenId = parseInt(tokenIdMatch[1]);
				const file = await handle.getFile();
				const text = await file.text();
				try {
					metadata[tokenId] = JSON.parse(text);
				} catch (error) {
					console.warn(
						`Failed to parse JSON for token ${tokenId}:`,
						error
					);
				}
			}
		}
	}

	return metadata;
}

/**
 * Read a specific file from a directory
 */
export async function readFileFromDirectory(
	dirHandle: FileSystemDirectoryHandle,
	filename: string
): Promise<File | null> {
	try {
		const fileHandle = await dirHandle.getFileHandle(filename);
		return await fileHandle.getFile();
	} catch (error) {
		if ((error as Error).name === 'NotFoundError') {
			return null;
		}
		throw error;
	}
}

/**
 * Get directory path (limited info available from File System Access API)
 */
export function getDirectoryInfo(dirHandle: FileSystemDirectoryHandle): {
	name: string;
} {
	return {
		name: dirHandle.name,
	};
}

/**
 * Cleanup object URLs to prevent memory leaks
 */
export function cleanupObjectUrls(urls: string[]): void {
	urls.forEach((url) => {
		if (url.startsWith('blob:')) {
			URL.revokeObjectURL(url);
		}
	});
}

/**
 * Fallback file input handler for unsupported browsers
 */
export function createFallbackFileInput(
	accept: string,
	multiple: boolean = false,
	webkitdirectory: boolean = false
): Promise<FileList | null> {
	return new Promise((resolve) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = accept;
		input.multiple = multiple;
		if (webkitdirectory) {
			(input as any).webkitdirectory = true;
		}

		input.onchange = () => {
			resolve(input.files);
		};

		input.oncancel = () => {
			resolve(null);
		};

		input.click();
	});
}

/**
 * Universal directory selector that uses File System Access API when available,
 * falls back to webkitdirectory
 */
export async function selectDirectoryUniversal(): Promise<{
	handle?: FileSystemDirectoryHandle;
	files?: FileList;
	type: 'filesystem' | 'fallback';
}> {
	if (isFileSystemAccessSupported()) {
		const handle = await selectDirectory();
		if (handle) {
			return { handle, type: 'filesystem' };
		}
	}

	// Fallback to webkitdirectory
	const files = await createFallbackFileInput('', true, true);
	return { files: files || undefined, type: 'fallback' };
}
