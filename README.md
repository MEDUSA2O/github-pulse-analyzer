## 📽 Demo Video

[Watch the demo video here]([https://youtu.be/your_video_link](https://drive.google.com/file/d/1yOZyb0vJjnyvIyPPrFx9uLtN78CAQKUj/view?usp=sharing))

# GitHub Profile Analyzer

A React application that analyzes GitHub user profiles and displays their activity metrics and repository information.

## Features

- Search for GitHub users by username
- View user profile information (bio, location, followers, etc.)
- Browse repositories with key metrics (stars, forks, language)
- Visualize commit activity over the past 30 days
- Sort and filter repositories by different criteria
- Responsive design for all device sizes

## Technologies Used

- React 18 with TypeScript
- Vite for build tooling
- ShadCN UI components
- TailwindCSS for styling
- React Query for data fetching and caching
- Recharts for data visualization
- GitHub REST API for data

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/github-profile-analyzer.git
cd github-profile-analyzer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Building for Production

1. Build the application
```bash
npm run build
# or
yarn build
```

2. Preview the production build locally (optional)
```bash
npm run preview
# or
yarn preview
```

## Deployment

This project can be deployed to any static site hosting service such as:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### Deploy to Vercel (Recommended)

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

### Deploy to Netlify

1. Install Netlify CLI
```bash
npm i -g netlify-cli
```

2. Build your project
```bash
npm run build
```

3. Deploy
```bash
netlify deploy
```

## API Rate Limits

This application uses the GitHub public API, which has rate limits:

- For unauthenticated requests: 60 requests per hour
- For authenticated requests: 5,000 requests per hour

The current implementation uses unauthenticated requests, so it may hit rate limits with frequent use.

## Future Enhancements

- Add authentication to increase API rate limits
- Add more visualizations (language breakdown, contribution calendar)
- Support for viewing organization profiles
- Compare two different GitHub users

## License

This project is open source and available under the MIT License.

## Acknowledgements

- GitHub API Documentation
- ShadCN UI for the component library
- Recharts for the charting library
