# File System Access API Setup Guide

## Overview

The File System Access API allows your Next.js app to work directly with local directories without uploading files. This is perfect for working with large image collections locally.

## Browser Support

- **Supported**: Chrome 86+, Edge 86+, Opera 72+
- **Not Supported**: Firefox, Safari (as of 2024)
- **Fallback**: Uses webkitdirectory for unsupported browsers

## Setup Instructions

### 1. HTTPS/Localhost Requirement

The File System Access API only works in secure contexts:

- ✅ `https://` URLs
- ✅ `http://localhost`
- ✅ `http://127.0.0.1`
- ❌ `http://` on other domains

Your Next.js dev server (`npm run dev`) on localhost will work perfectly.

### 2. Browser Permissions

When users first select a directory:

1. Browser shows permission dialog
2. User must click "Allow" to grant access
3. Permission persists for the session

### 3. Implementation in Components

Update your existing components to use the File System Access API:

#### A. Update SetupPanel.tsx

Replace the file input sections with directory picker buttons:

```tsx
// Add to imports
import {
  selectDirectoryUniversal,
  isFileSystemAccessSupported,
  selectFiles
} from '@/utils/fileSystemApi';

// In your SetupPanel component, replace file inputs with:
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Images Directory
    </label>
    <button
      type="button"
      onClick={async () => {
        const result = await selectDirectoryUniversal();
        if (result.handle) {
          handleInputChange('imagesDirectory', result.handle);
          handleInputChange('imagesPath', result.handle.name);
        }
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Select Images Directory
    </button>
    {formData.imagesPath && (
      <p className="text-sm text-gray-600 mt-1">Selected: {formData.imagesPath}</p>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Metadata Directory
    </label>
    <button
      type="button"
      onClick={async () => {
        const result = await selectDirectoryUniversal();
        if (result.handle) {
          handleInputChange('metadataDirectory', result.handle);
          handleInputChange('metadataPath', result.handle.name);
        }
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Select Metadata Directory
    </button>
    {formData.metadataPath && (
      <p className="text-sm text-gray-600 mt-1">Selected: {formData.metadataPath}</p>
    )}
  </div>

  {/* Keep existing file inputs for JSON files */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Configuration Files
    </label>
    <button
      type="button"
      onClick={async () => {
        const files = await selectFiles({
          multiple: true,
          accept: { 'application/json': ['.json'] }
        });
        // Handle the selected JSON files
        if (files.length >= 4) {
          // Assume order: traits, imageMap, overallSchema, traitSchema
          const [traitsFile, imageMapFile, overallSchemaFile, traitSchemaFile] = await Promise.all(
            files.map(handle => handle.getFile())
          );
          handleInputChange('traitsFile', traitsFile);
          handleInputChange('imageMapFile', imageMapFile);
          handleInputChange('overallSchemaFile', overallSchemaFile);
          handleInputChange('traitSchemaFile', traitSchemaFile);
        }
      }}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Select All JSON Files
    </button>
  </div>
</div>
```

#### B. Update NFTMetadataTrainer.tsx

Modify the form data structure and file loading:

```tsx
// Update FormData interface
interface FormData {
  imagesPath: string;
  metadataPath: string;
  imagesDirectory?: FileSystemDirectoryHandle;
  metadataDirectory?: FileSystemDirectoryHandle;
  traitsFile: File | null;
  imageMapFile: File | null;
  overallSchemaFile: File | null;
  traitSchemaFile: File | null;
}

// In handleStartTraining, add directory processing:
const handleStartTraining = async (formData: FormData) => {
  setLoading(true);
  try {
    showStatus('Loading files and directories...', 'info');

    // Load JSON files (same as before)
    const traitsData = await readFileAsJSON(formData.traitsFile!);
    const imageMap = await readFileAsJSON(formData.imageMapFile!);
    const overallSchema = await readFileAsJSON(formData.overallSchemaFile!);
    const traitSchema = await readFileAsJSON(formData.traitSchemaFile!);

    // Load images from directory if available
    let imageData: { tokenId: number; file: File; url: string }[] = [];
    if (formData.imagesDirectory) {
      showStatus('Loading images from directory...', 'info');
      imageData = await readImagesFromDirectory(formData.imagesDirectory);
    }

    // Store image data in project data
    setProjectData({
      traitsData,
      imageMap,
      overallSchema,
      traitSchema,
      imagesPath: formData.imagesPath,
      metadataPath: formData.metadataPath,
      imageData // Add this new field
    });

    // Continue with existing logic...
  } catch (error) {
    showStatus(`Error: ${(error as Error).message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

#### C. Update ImageGallery.tsx to use real images

```tsx
// Update ImageGallery to use actual loaded images
interface ImageGalleryProps {
  selectedImages: number[];
  onToggleImage: (tokenId: number) => void;
  imageData: { tokenId: number; file: File; url: string }[];
}

export default function ImageGallery({ selectedImages, onToggleImage, imageData }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-4 border rounded">
      {imageData.map(({ tokenId, url }) => (
        <ImageItem
          key={tokenId}
          tokenId={tokenId}
          imageUrl={url}  // Pass the actual image URL
          isSelected={selectedImages.includes(tokenId)}
          onClick={onToggleImage}
        />
      ))}
    </div>
  );
}
```

#### D. Update ImageItem.tsx to display real images

```tsx
interface ImageItemProps {
  tokenId: number;
  imageUrl: string;  // Add this
  isSelected: boolean;
  onClick: (tokenId: number) => void;
}

export default function ImageItem({ tokenId, imageUrl, isSelected, onClick }: ImageItemProps) {
  return (
    <div
      className={`relative border-2 rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onClick(tokenId)}
    >
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`Token ${tokenId}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
          }}
        />
      </div>
      <div className="p-2 text-center">
        <div className="text-sm font-medium">Token {tokenId}</div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
}
```

## Usage Instructions

### 1. Start Development Server

```bash
npm run dev
```

### 2. Open in Supported Browser

- Chrome, Edge, or Opera recommended
- Navigate to `http://localhost:3000`

### 3. Directory Structure Expected

```md
your-nft-project/
├── images/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── metadata/
│   ├── 1.json
│   ├── 2.json
│   └── ...
└── config/
    ├── traits.json
    ├── imageMap.json
    ├── overallSchema.json
    └── traitSchema.json
```

### 4. Using the App

1. Click "Select Images Directory" → Choose your images folder
2. Click "Select Metadata Directory" → Choose your metadata folder
3. Click "Select All JSON Files" → Choose your 4 config JSON files
4. Click "Start Training"
5. The app will load all images and display them for trait training

## Benefits

- **No Upload Required**: Work directly with local files
- **Fast Performance**: No network transfer of large images
- **Real Images**: See actual NFT images during training
- **Secure**: Files never leave your machine
- **Efficient**: Only loads images as needed

## Troubleshooting

### Permission Denied

- Ensure you're on localhost or HTTPS
- Check browser console for errors
- Try refreshing and granting permission again

### Browser Not Supported

- Use Chrome, Edge, or Opera for best experience
- Firefox/Safari will fall back to file upload

### Images Not Loading

- Check image file names match expected pattern (1.jpg, 2.jpg, etc.)
- Ensure images are in standard formats (jpg, png, gif, webp)
- Check browser console for loading errors

### Memory Issues

- The app automatically cleans up image URLs
- For very large collections (>1000 images), consider pagination
- Close other browser tabs to free memory
