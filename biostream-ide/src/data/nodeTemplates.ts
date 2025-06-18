import { NodeTemplate } from '@/types/workflow'

export const nodeTemplates: NodeTemplate[] = [
  // Data Source Nodes
  {
    type: 'data-source',
    label: 'Read CSV',
    description: 'Read data from a CSV file',
    icon: '📄',
    category: 'Data Sources',
    defaultCode: `# Read CSV file
data <- read.csv("{{file_path}}", header = TRUE, stringsAsFactors = FALSE)
print(head(data))`,
    defaultParams: {
      file_path: 'data/input.csv'
    }
  },
  {
    type: 'data-source',
    label: 'Read Excel',
    description: 'Read data from an Excel file',
    icon: '📊',
    category: 'Data Sources',
    defaultCode: `# Read Excel file
library(readxl)
data <- read_excel("{{file_path}}", sheet = "{{sheet_name}}")
print(head(data))`,
    defaultParams: {
      file_path: 'data/input.xlsx',
      sheet_name: 'Sheet1'
    }
  },
  {
    type: 'data-source',
    label: 'Database Query',
    description: 'Execute SQL query on database',
    icon: '🗄️',
    category: 'Data Sources',
    defaultCode: `# Database query
library(DBI)
library(RSQLite)

con <- dbConnect(RSQLite::SQLite(), "{{db_path}}")
data <- dbGetQuery(con, "{{sql_query}}")
dbDisconnect(con)
print(head(data))`,
    defaultParams: {
      db_path: 'data/database.db',
      sql_query: 'SELECT * FROM table_name LIMIT 100'
    }
  },

  // Transform Nodes
  {
    type: 'transform',
    label: 'Filter Rows',
    description: 'Filter data based on conditions',
    icon: '🔍',
    category: 'Transforms',
    defaultCode: `# Filter rows based on condition
filtered_data <- data[{{condition}}, ]
print(paste("Filtered from", nrow(data), "to", nrow(filtered_data), "rows"))`,
    defaultParams: {
      condition: 'data$column > 0'
    }
  },
  {
    type: 'transform',
    label: 'Select Columns',
    description: 'Select specific columns from dataset',
    icon: '📋',
    category: 'Transforms',
    defaultCode: `# Select specific columns
selected_data <- data[, c({{columns}})]
print(colnames(selected_data))`,
    defaultParams: {
      columns: '"col1", "col2", "col3"'
    }
  },
  {
    type: 'transform',
    label: 'Group By',
    description: 'Group data and apply aggregations',
    icon: '📊',
    category: 'Transforms',
    defaultCode: `# Group by and aggregate
library(dplyr)
grouped_data <- data %>%
  group_by({{group_column}}) %>%
  summarise(
    count = n(),
    mean_value = mean({{value_column}}, na.rm = TRUE)
  )
print(head(grouped_data))`,
    defaultParams: {
      group_column: 'category',
      value_column: 'value'
    }
  },

  // R Script Nodes
  {
    type: 'r-script',
    label: 'Custom R Script',
    description: 'Execute custom R code',
    icon: '⚙️',
    category: 'R Scripts',
    defaultCode: `# Custom R script
# Your R code here
result <- data * 2
print(summary(result))`
  },
  {
    type: 'r-script',
    label: 'Statistical Analysis',
    description: 'Perform statistical analysis',
    icon: '📈',
    category: 'R Scripts',
    defaultCode: `# Statistical analysis
# Perform t-test
t_result <- t.test(data\${{group1}}, data\${{group2}})
print(t_result)

# Correlation analysis
cor_result <- cor(data\${{var1}}, data\${{var2}}, use = "complete.obs")
print(paste("Correlation:", round(cor_result, 3)))`,
    defaultParams: {
      group1: 'group1_values',
      group2: 'group2_values',
      var1: 'variable1',
      var2: 'variable2'
    }
  },

  // Visualization Nodes
  {
    type: 'visualization',
    label: 'Scatter Plot',
    description: 'Create scatter plot with ggplot2',
    icon: '📊',
    category: 'Visualizations',
    defaultCode: `# Create scatter plot
library(ggplot2)

plot <- ggplot(data, aes(x = {{x_var}}, y = {{y_var}})) +
  geom_point(alpha = 0.6) +
  geom_smooth(method = "lm") +
  theme_minimal() +
  labs(title = "{{title}}", x = "{{x_label}}", y = "{{y_label}}")

print(plot)
ggsave("{{output_path}}", plot, width = 8, height = 6)`,
    defaultParams: {
      x_var: 'x_column',
      y_var: 'y_column',
      title: 'Scatter Plot',
      x_label: 'X Variable',
      y_label: 'Y Variable',
      output_path: 'output/scatter_plot.png'
    }
  },
  {
    type: 'visualization',
    label: 'Histogram',
    description: 'Create histogram with ggplot2',
    icon: '📊',
    category: 'Visualizations',
    defaultCode: `# Create histogram
library(ggplot2)

plot <- ggplot(data, aes(x = {{variable}})) +
  geom_histogram(bins = {{bins}}, fill = "steelblue", alpha = 0.7) +
  theme_minimal() +
  labs(title = "{{title}}", x = "{{x_label}}", y = "Count")

print(plot)
ggsave("{{output_path}}", plot, width = 8, height = 6)`,
    defaultParams: {
      variable: 'numeric_column',
      bins: 30,
      title: 'Histogram',
      x_label: 'Value',
      output_path: 'output/histogram.png'
    }
  },
  {
    type: 'visualization',
    label: 'Box Plot',
    description: 'Create box plot with ggplot2',
    icon: '📦',
    category: 'Visualizations',
    defaultCode: `# Create box plot
library(ggplot2)

plot <- ggplot(data, aes(x = {{group_var}}, y = {{value_var}})) +
  geom_boxplot(fill = "lightblue", alpha = 0.7) +
  theme_minimal() +
  labs(title = "{{title}}", x = "{{x_label}}", y = "{{y_label}}")

print(plot)
ggsave("{{output_path}}", plot, width = 8, height = 6)`,
    defaultParams: {
      group_var: 'category',
      value_var: 'value',
      title: 'Box Plot',
      x_label: 'Category',
      y_label: 'Value',
      output_path: 'output/box_plot.png'
    }
  },

  // Control Nodes
  {
    type: 'control',
    label: 'If/Else',
    description: 'Conditional execution based on data',
    icon: '🔀',
    category: 'Control',
    defaultCode: `# Conditional execution
if ({{condition}}) {
  # True branch
  result <- data[data\${{filter_col}} > {{threshold}}, ]
} else {
  # False branch
  result <- data[data\${{filter_col}} <= {{threshold}}, ]
}
print(paste("Selected", nrow(result), "rows"))`,
    defaultParams: {
      condition: 'nrow(data) > 1000',
      filter_col: 'value',
      threshold: 0.5
    }
  },
  {
    type: 'control',
    label: 'Loop',
    description: 'Iterate over data or perform repeated operations',
    icon: '🔄',
    category: 'Control',
    defaultCode: `# Loop through data
results <- list()
for (i in 1:{{iterations}}) {
  # Your loop body here
  subset_data <- data[sample(nrow(data), {{sample_size}}), ]
  results[[i]] <- mean(subset_data\${{value_column}}, na.rm = TRUE)
}
print(paste("Completed", length(results), "iterations"))`,
    defaultParams: {
      iterations: 10,
      sample_size: 100,
      value_column: 'value'
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