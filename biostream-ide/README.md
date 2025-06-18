# BioStream IDE - Graphical R Workflow Editor

A modern, node-based Integrated Development Environment (IDE) for creating, executing, and managing R workflows with visual programming capabilities.

## Features

### 🎯 Core Functionality
- **Visual Node Editor**: Drag-and-drop interface for creating R workflows
- **R Code Integration**: Monaco-based code editor for each node
- **Multiple Node Types**: Data sources, transforms, visualizations, and control flow
- **Execution Engine**: Local and HPC (Slurm) execution support
- **Project Management**: Save, load, import, and export workflows

### 🚀 Key Capabilities
- **Parallel Execution**: Independent branches run simultaneously
- **HPC Integration**: Submit heavy computations to Slurm clusters
- **Real-time Debugging**: Live logs and error tracking
- **Version Control**: Undo/redo with history management
- **Resource Management**: CPU, memory, and time specifications for HPC jobs

### 🎨 User Experience
- **Modern UI**: Clean, responsive interface built with React 19 and Tailwind CSS
- **Intuitive Workflow**: Familiar RStudio-like experience with visual clarity
- **Performance Optimized**: Handles large workflows with thousands of nodes
- **Accessibility**: WCAG 2.1 AA compliant

## Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Next.js 15** - App Router for optimal performance
- **TypeScript** - Type-safe development
- **React Flow** - Professional node-based editor
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend (Planned)
- **Node.js/Express** - API Gateway
- **Go** - Execution Manager
- **PostgreSQL** - Project persistence
- **R/Rserve** - R code execution
- **Slurm** - HPC job scheduling

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- R (for local execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd biostream-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Usage

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the left palette to the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles
3. **Configure Nodes**: Double-click nodes to edit code and parameters
4. **Set Execution Target**: Choose between local and HPC execution
5. **Run Workflow**: Click the "Run Workflow" button in the toolbar

### Node Types

#### Data Sources
- **Read CSV**: Import data from CSV files
- **Read Excel**: Import data from Excel files  
- **Database Query**: Execute SQL queries

#### Transforms
- **Filter Rows**: Filter data based on conditions
- **Select Columns**: Choose specific columns
- **Group By**: Aggregate data by groups

#### R Scripts
- **Custom R Script**: Write arbitrary R code
- **Statistical Analysis**: Perform statistical tests

#### Visualizations
- **Scatter Plot**: Create scatter plots with ggplot2
- **Histogram**: Generate histograms
- **Box Plot**: Create box plots

#### Control Flow
- **If/Else**: Conditional execution
- **Loop**: Iterative operations

### HPC Integration

1. **Select HPC Target**: Choose "HPC (Slurm)" in node settings
2. **Configure Resources**: Set CPU, memory, and time limits
3. **Submit Jobs**: Workflow automatically generates and submits Slurm scripts
4. **Monitor Progress**: Track job status and retrieve results

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── canvas/            # Workflow canvas
│   ├── nodes/             # Node components
│   ├── palette/           # Node palette
│   ├── toolbar/           # Main toolbar
│   └── layout/            # Layout components
├── data/                  # Static data and templates
├── lib/                   # Utility functions
├── store/                 # Redux store
└── types/                 # TypeScript type definitions
```

## Architecture

### State Management
- **Redux Toolkit**: Centralized state management
- **Workflow State**: Project data, execution status, history
- **Real-time Updates**: Live execution progress and logs

### Execution Engine
- **DAG Processing**: Topological sorting for dependency resolution
- **Parallel Execution**: Independent node sets run concurrently
- **Caching**: Skip unchanged nodes for efficiency
- **Error Handling**: Graceful failure recovery

### Data Flow
1. **Node Creation**: Templates → Canvas → Configuration
2. **Workflow Execution**: DAG Analysis → Job Submission → Result Collection
3. **State Persistence**: Autosave → Export/Import → Version Control

## Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write comprehensive tests
- Follow accessibility guidelines

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Document complex functions

## Roadmap

### Phase 1 (MVP) ✅
- [x] Core node editor
- [x] Local execution
- [x] Basic project management
- [x] Node templates

### Phase 2 (Enhancement)
- [ ] HPC integration (Slurm)
- [ ] Advanced debugging
- [ ] Performance optimization
- [ ] User authentication

### Phase 3 (Advanced)
- [ ] Real-time collaboration
- [ ] Cloud execution (AWS Batch)
- [ ] AI-assisted node generation
- [ ] Marketplace for node templates

### Phase 4 (Enterprise)
- [ ] Multi-tenant architecture
- [ ] Advanced security features
- [ ] Enterprise integrations
- [ ] Analytics and monitoring

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@biostream-ide.com

## Acknowledgments

- React Flow team for the excellent node editor
- R community for inspiration and best practices
- Next.js team for the amazing framework
- All contributors and early adopters

---

Built with ❤️ for the R and bioinformatics communities
