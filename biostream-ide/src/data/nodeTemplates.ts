import { NodeTemplate } from '@/types/workflow'

export const nodeTemplates: NodeTemplate[] = [
  // Data Source Nodes
  {
    id: 'csv-reader',
    type: 'data-source',
    label: 'CSV Reader',
    description: 'Read data from CSV file',
    category: 'Data Sources',
    icon: '📄',
    defaultCode: 'data <- read.csv("input.csv")',
    defaultParams: {
      'file_path': 'input.csv',
      'header': true,
      'sep': ','
    }
  },
  {
    id: 'excel-reader',
    type: 'data-source',
    label: 'Excel Reader',
    description: 'Read data from Excel file',
    category: 'Data Sources',
    icon: '📊',
    defaultCode: 'library(readxl)\ndata <- read_excel("input.xlsx")',
    defaultParams: {
      'file_path': 'input.xlsx',
      'sheet': 1
    }
  },
  {
    id: 'db-query',
    type: 'data-source',
    label: 'Database Query',
    description: 'Execute SQL query on database',
    category: 'Data Sources',
    icon: '🗄️',
    defaultCode: 'library(DBI)\ncon <- dbConnect(RSQLite::SQLite(), "database.db")\ndata <- dbGetQuery(con, "SELECT * FROM table")',
    defaultParams: {
      'connection_string': 'sqlite://database.db',
      'query': 'SELECT * FROM table'
    }
  },

  // Transform Nodes
  {
    id: 'filter-data',
    type: 'transform',
    label: 'Filter Data',
    description: 'Filter rows based on conditions',
    category: 'Data Transformations',
    icon: '🔍',
    defaultCode: 'filtered_data <- data[data$column > 0, ]',
    defaultParams: {
      'column': 'value',
      'operator': '>',
      'value': 0
    }
  },
  {
    id: 'select-columns',
    type: 'transform',
    label: 'Select Columns',
    description: 'Select specific columns from dataset',
    category: 'Data Transformations',
    icon: '📋',
    defaultCode: 'selected_data <- data[, c("col1", "col2", "col3")]',
    defaultParams: {
      'columns': 'col1,col2,col3'
    }
  },
  {
    id: 'group-by',
    type: 'transform',
    label: 'Group By',
    description: 'Group data by specified columns',
    category: 'Data Transformations',
    icon: '📊',
    defaultCode: 'library(dplyr)\ngrouped_data <- data %>% group_by(group_column)',
    defaultParams: {
      'group_columns': 'category,region'
    }
  },

  // R Script Nodes
  {
    id: 'custom-r-script',
    type: 'r-script',
    label: 'Custom R Script',
    description: 'Execute custom R code',
    category: 'R Scripts',
    icon: '📝',
    defaultCode: '# Your R code here\ndata <- read.csv("input.csv")\nresult <- summary(data)\nwrite.csv(result, "output.csv")',
    defaultParams: {
      'script_name': 'custom_script.R',
      'timeout': 300
    }
  },
  {
    id: 'stat-analysis',
    type: 'r-script',
    label: 'Statistical Analysis',
    description: 'Perform statistical analysis',
    category: 'R Scripts',
    icon: '📈',
    defaultCode: 'library(stats)\nmodel <- lm(y ~ x, data=data)\nsummary(model)',
    defaultParams: {
      'dependent_var': 'y',
      'independent_vars': 'x1,x2,x3',
      'method': 'lm'
    }
  },
  {
    id: 'ml-model',
    type: 'r-script',
    label: 'Machine Learning',
    description: 'Train machine learning model',
    category: 'R Scripts',
    icon: '🤖',
    defaultCode: 'library(randomForest)\nmodel <- randomForest(target ~ ., data=train_data)\npredictions <- predict(model, test_data)',
    defaultParams: {
      'algorithm': 'randomForest',
      'target_column': 'target',
      'test_size': 0.2
    }
  },

  // Visualization Nodes
  {
    id: 'scatter-plot',
    type: 'visualization',
    label: 'Scatter Plot',
    description: 'Create scatter plot',
    category: 'Visualizations',
    icon: '📊',
    defaultCode: 'library(ggplot2)\nggplot(data, aes(x=x, y=y)) + geom_point() + theme_minimal()',
    defaultParams: {
      'x_column': 'x',
      'y_column': 'y',
      'color_column': '',
      'size_column': ''
    }
  },
  {
    id: 'bar-chart',
    type: 'visualization',
    label: 'Bar Chart',
    description: 'Create bar chart',
    category: 'Visualizations',
    icon: '📊',
    defaultCode: 'library(ggplot2)\nggplot(data, aes(x=category, y=value)) + geom_bar(stat="identity") + theme_minimal()',
    defaultParams: {
      'x_column': 'category',
      'y_column': 'value',
      'fill_column': ''
    }
  },
  {
    id: 'line-plot',
    type: 'visualization',
    label: 'Line Plot',
    description: 'Create line plot',
    category: 'Visualizations',
    icon: '📈',
    defaultCode: 'library(ggplot2)\nggplot(data, aes(x=time, y=value)) + geom_line() + theme_minimal()',
    defaultParams: {
      'x_column': 'time',
      'y_column': 'value',
      'group_column': ''
    }
  },

  // Control Nodes
  {
    id: 'conditional-branch',
    type: 'control',
    label: 'Conditional Branch',
    description: 'Conditional execution based on data',
    category: 'Control Flow',
    icon: '🔀',
    defaultCode: 'if (condition) {\n  # true branch\n} else {\n  # false branch\n}',
    defaultParams: {
      'condition': 'nrow(data) > 1000',
      'true_branch': 'heavy_processing',
      'false_branch': 'light_processing'
    }
  },
  {
    id: 'loop',
    type: 'control',
    label: 'Loop',
    description: 'Iterate over data or conditions',
    category: 'Control Flow',
    icon: '🔄',
    defaultCode: 'for (i in 1:nrow(data)) {\n  # process each row\n  result[i] <- process_row(data[i, ])\n}',
    defaultParams: {
      'loop_type': 'for',
      'iterator': 'i',
      'range': '1:nrow(data)'
    }
  },
  {
    id: 'parallel-execution',
    type: 'control',
    label: 'Parallel Execution',
    description: 'Execute tasks in parallel',
    category: 'Control Flow',
    icon: '⚡',
    defaultCode: 'library(parallel)\ncl <- makeCluster(4)\nresults <- parLapply(cl, data_list, process_function)\nstopCluster(cl)',
    defaultParams: {
      'num_cores': 4,
      'chunk_size': 100
    }
  }
]

export const getTemplatesByCategory = () => {
  const categories = [...new Set(nodeTemplates.map(template => template.category))]
  return categories.map(category => ({
    category,
    templates: nodeTemplates.filter(template => template.category === category)
  }))
} 