
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart as RechartsAreaChart, 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart, 
  PieChart as RechartsPieChart,
  Area, 
  Bar, 
  Line, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  PieLabel,
} from 'recharts';

interface ChartProps {
  data: any[];
  categories?: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  showAnimation?: boolean;
}

interface PieChartProps {
  data: any[];
  index: string;
  category: string;
  valueFormatter?: (value: number) => string;
  colors?: string[];
  className?: string;
  showAnimation?: boolean;
}

export const AreaChart = ({
  data,
  categories,
  index,
  colors = ['#1a73e8'],
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = false,
}: ChartProps) => {
  const categoryKeys = categories || Object.keys(data[0] || {}).filter((key) => key !== index);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          {categoryKeys.map((key, idx) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.3}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart = ({
  data,
  categories,
  index,
  colors = ['#00a19d'],
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = false,
}: ChartProps) => {
  const categoryKeys = categories || Object.keys(data[0] || {}).filter((key) => key !== index);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          {categoryKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[idx % colors.length]}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChart = ({
  data,
  categories,
  index,
  colors = ['#e63946'],
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = false,
}: ChartProps) => {
  const categoryKeys = categories || Object.keys(data[0] || {}).filter((key) => key !== index);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          {categoryKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart = ({
  data,
  index,
  category,
  colors = ['#1a73e8', '#00a19d', '#e63946', '#888888'],
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = false,
}: PieChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey={category}
            nameKey={index}
            isAnimationActive={showAnimation}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
