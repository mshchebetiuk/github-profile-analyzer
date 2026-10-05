# 📊 GitHub Profile Analyzer

> A modern GitHub profile and repository analysis application built with Next.js, React, and TypeScript. It analyzes developer profiles, repositories, technologies, activity, documentation quality, portfolio readiness, and other GitHub statistics.

## 🔗 Live Demo

🚧 Live demo is currently unavailable. The project is under active development.

<!--
## 📸 Preview

![Desktop Preview](./screenshots/desktop.png)

### 📱 Tablet

![Tablet Preview](./screenshots/tablet.png)

### 📱 Mobile

![Mobile Preview](./screenshots/mobile.png)
-->

## ✨ Features

- GitHub profile search
- GitHub profile comparison
- Profile statistics and analytics
- Repository analysis
- Repository scoring
- Repository score breakdown
- Repository strengths and weaknesses
- Portfolio readiness analysis
- Repository readiness grades
- Priority improvement recommendations
- README quality analysis
- README improvement recommendations
- Repository health analysis
- Best repository detection
- Top repositories ranking
- Repository activity analysis
- Language statistics
- Technology detection
- Profile score
- Profile summary
- Developer recommendations
- Repository search
- Repository filtering by language
- Repository sorting
- Repository pagination
- GitHub API rate-limit handling
- Loading, error, and empty states
- Responsive user interface
- Unit tests for analytics and GitHub API logic

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### API & Data

- GitHub REST API
- Next.js Route Handlers
- Server-side GitHub API requests
- GitHub Personal Access Token support

### Testing

- Vitest

### Development Tools

- ESLint
- TypeScript
- pnpm
- Git
- GitHub

## 📁 Project Structure

```text
github-profile-analyzer/
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── github/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🧩 Architecture

The application separates UI, GitHub API communication, stateful application logic, analytics, and shared types into dedicated layers.

- `app/` — application routes and page composition
- `app/api/` — server-side API endpoints
- `app/components/` — reusable UI components
- `hooks/` — reusable React state and application logic
- `services/` — GitHub API communication
- `types/` — shared TypeScript types
- `utils/` — analytics, filtering, pagination, and README analysis

The browser does not communicate with the GitHub API directly.

```text
Browser
   ↓
Next.js /api/github
   ↓
GitHub API
   ↓
Profile + repositories
   ↓
Analytics utilities
   ↓
React UI
```

This keeps API credentials on the server and separates external API communication from presentation and analytics logic.

## 📊 Profile Analytics

The application calculates useful statistics from GitHub profile and repository data, including:

- Total stars
- Total forks
- Primary language
- Number of technologies and languages
- Repository activity
- Repository health
- README coverage
- Profile score
- Best repository
- Top repositories
- Profile strengths
- Suggested improvements

## 🔍 Repository Analysis

Individual repositories can be analyzed in more detail.

The analysis includes:

- Repository score
- Score breakdown
- README availability
- README quality
- Repository activity
- Stars and forks
- Repository strengths
- Areas for improvement
- Portfolio readiness
- Repository grade
- Priority improvements

Repository scores and grades are custom project heuristics and are not official GitHub metrics.

## 📖 README Analysis

The application analyzes README structure and checks for common documentation sections such as:

- Project description
- Installation or setup
- Usage
- Technologies / tech stack
- License

A README quality score and improvement recommendations are generated from these checks.

The analyzer currently uses heuristic README analysis and does not evaluate the factual accuracy of documentation.

## 🎯 Portfolio Readiness

Repositories receive a custom portfolio readiness score from `0` to `100`.

The score considers:

- Documentation
- Project information
- Recent activity
- Popularity
- Primary technology

Repositories are also assigned a readiness grade:

```text
90–100  Excellent
75–89   Good
50–74   Needs Improvement
0–49    Incomplete
```

These values are custom heuristics designed for this project rather than official GitHub ratings.

## 💡 Priority Improvements

Repository analysis generates prioritized suggestions to make projects more portfolio-ready.

Recommendations can include:

- Adding a README
- Adding a project description
- Adding installation instructions
- Adding usage examples
- Documenting the technology stack
- Adding license information
- Improving repository activity

Suggestions are grouped by priority:

- High
- Medium
- Low

## 🔎 Repository Explorer

Repositories can be explored using:

- Name and description search
- Language filtering
- Sorting by recent updates
- Sorting by stars
- Sorting by forks
- Sorting by name
- Progressive pagination with Show More / Show Less

## ⚡ GitHub API

GitHub data is retrieved through a server-side Next.js API route.

The project supports an optional GitHub Personal Access Token to increase API limits.

GitHub responses are cached using Next.js revalidation.

The API layer also handles:

- User not found errors
- GitHub API failures
- Rate-limit errors
- Optional missing resources such as README files

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/mshchebetiuk/github-profile-analyzer.git
```

### Navigate to the project

```bash
cd github-profile-analyzer
```

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Create a `.env.local` file in the project root:

```env
GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

The token should never be committed to Git.

### Start the development server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## 📜 Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:run
```

TypeScript can also be checked with:

```bash
pnpm exec tsc --noEmit
```

## 🧪 Testing

The project uses Vitest for unit testing.

Tests currently cover core logic such as:

- GitHub API handling
- Repository analytics
- Repository scoring
- Repository score breakdown
- Repository assessment
- Portfolio readiness
- Repository grades
- Priority improvements
- README analysis
- README recommendations

Run the test suite with:

```bash
pnpm test:run
```

## 🎯 What I Practiced

During this project, I practiced:

- Building applications with Next.js App Router
- Working with React and TypeScript
- Integrating the GitHub REST API
- Creating server-side API routes
- Working with environment variables
- Handling API errors and rate limits
- Separating API communication into services
- Designing reusable React components
- Creating custom React hooks
- Building repository search and filtering
- Implementing sorting and pagination
- Processing and aggregating API data
- Designing repository scoring algorithms
- Building portfolio readiness heuristics
- Analyzing README documentation
- Generating prioritized recommendations
- Writing unit tests with Vitest
- Handling loading, error, and empty states
- Refactoring application architecture
- Debugging UI and filtering issues

## 🔮 Future Improvements

- Deploy the application
- Add screenshots and application previews
- Improve README analysis
- Analyze more repository metadata
- Add repository comparison
- Add charts and additional visualizations
- Improve accessibility
- Add integration tests
- Add End-to-End tests
- Add CI/CD
- Add Docker support

## 👨‍💻 Author

**Maksym Shchebetiuk**

- GitHub: https://github.com/mshchebetiuk
- LinkedIn: https://www.linkedin.com/in/maksym-shchebetiuk-bb53102a0/

## 📄 License

This project is created for educational and portfolio purposes.
