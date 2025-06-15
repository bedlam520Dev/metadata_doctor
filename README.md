# NFT Metadata Trainer

A React/Next.js application for training visual trait libraries to automate NFT metadata generation. This tool helps you create training datasets by selecting example images for each trait, which can then be used for automated trait detection and metadata generation.

## Features

- **Interactive Setup**: Upload your traits, image mappings, and schema files through a user-friendly interface
- **Visual Training**: Select example images for each trait using an intuitive gallery interface
- **Progress Tracking**: Monitor your training progress with a visual progress bar
- **Export Functionality**: Export your training data as JSON for use in other systems
- **Flexible Schema Support**: Works with custom overall and trait value schemas

## Prerequisites

- Node.js 18+ (managed via nvm recommended)
- npm or yarn
- Modern web browser with File System Access API support

## Installation

1.1 Clone the repository:

```bash
git clone <repository-url>
cd nft-metadata-trainer
```

1.2 Install dependencies:

```bash
npm install
# or
yarn install
```

1.3 Run the development server:

```bash
npm run dev
# or
yarn dev
```

1.4 Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Setup Phase

Upload the following required files:

- **Traits JSON**: Contains trait_types and trait_values arrays
- **Image Map JSON**: Maps tokenId to Image# (typically 10,000 entries)
- **Overall Schema JSON**: Defines strict key order for metadata structure
- **Trait Value Schema JSON**: Defines strict trait_value key order

Provide paths to your:

- **Images Directory**: Contains numbered images (1.jpeg, 2.jpeg, etc.)
- **Metadata Directory**: Contains corresponding JSON files (1.json, 2.json, etc.)

### 2. Training Phase

1. The app will present each trait combination for training
2. Select 3-5 example images that demonstrate each trait (minimum 1)
3. Use the gallery interface to toggle image selections
4. Save your selections or skip traits as needed
5. Export your training data when complete

### 3. Export

The exported JSON contains:

- Training results with selected examples for each trait
- Schema definitions
- Image mappings
- Timestamp and statistics

## File Structure

```md
nft-metadata-trainer/
├── components/
│   ├── setup/          # Setup phase components
│   ├── training/       # Training phase components
│   └── ui/            # Reusable UI components
├── lib/
│   ├── filesystemapi.ts    # File system operations
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts          # TypeScript type definitions
├── docs/
│   └── filesystem-setup.md # File system setup guide
└── public/              # Static assets
```

## Data Formats

### Traits JSON Format

```json
{
  "Background": ["Blue", "Red", "Green"],
  "Eyes": ["Normal", "Laser", "3D"],
  "Mouth": ["Smile", "Frown", "Neutral"]
}
```

### Image Map JSON Format

```json
{
  "1": "Image#1234",
  "2": "Image#5678",
  ...
}
```

### Exported Training Data Format

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "totalTraits": 150,
  "trainedTraits": 145,
  "trainingResults": {
    "Background: Blue": {
      "type": "Background",
      "value": "Blue",
      "examples": [1, 5, 12, 23, 45]
    }
  },
  "schemas": { ... },
  "imageMap": { ... },
  "paths": { ... }
}
```

## Development

### Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind
- **File Handling**: File System Access API

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Browser Compatibility

This application uses the File System Access API for optimal file handling. For best experience, use:

- Chrome 86+
- Edge 86+
- Safari 15.2+ (limited support)

For browsers without File System Access API support, the app falls back to standard file input methods.

## Performance Considerations

- **Low Performance Machines**: The app is optimized for low-performance Windows 11 machines
- **Large Datasets**: Handles up to 10,000 NFT collections efficiently
- **Memory Management**: Images are loaded on-demand to minimize memory usage
- **Progress Saving**: Training progress can be exported at any time to prevent data loss

## Troubleshooting

### File Access Issues

- Ensure your browser supports the File System Access API
- Check that file paths are correctly formatted for your operating system
- Verify that image and metadata directories contain the expected files

### Performance Issues

- Close unnecessary browser tabs and applications
- Consider processing smaller batches if experiencing memory issues
- Use the export functionality frequently to save progress

### Training Data Issues

- Ensure JSON files are properly formatted
- Verify that image numbers in the image map correspond to actual files
- Check that trait values match between your traits file and metadata

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
