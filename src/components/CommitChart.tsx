
import React from "react";
import { CommitsByDay } from "@/types/github";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO, isValid } from "date-fns";

interface CommitChartProps {
  commits: CommitsByDay[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    try {
      const parsedDate = parseISO(label);
      if (isValid(parsedDate)) {
        return (
          <div className="bg-popover text-popover-foreground p-2 rounded-md border shadow-sm text-sm">
            <p className="font-medium">{format(parsedDate, "MMM dd, yyyy")}</p>
            <p>
              <span className="font-semibold">{payload[0].value}</span> commits
            </p>
          </div>
        );
      }
    } catch (error) {
      console.error("Date parsing error:", error);
    }
    
    // Fallback for invalid dates
    return (
      <div className="bg-popover text-popover-foreground p-2 rounded-md border shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        <p>
          <span className="font-semibold">{payload[0].value}</span> commits
        </p>
      </div>
    );
  }
  return null;
};

const CommitChart: React.FC<CommitChartProps> = ({ commits }) => {
  if (!commits.length) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No recent commit data available
      </div>
    );
  }

  // Filter out any invalid dates and format the valid ones
  const chartData = commits
    .filter(item => {
      try {
        const date = parseISO(item.date);
        return isValid(date);
      } catch (error) {
        console.error(`Invalid date: ${item.date}`, error);
        return false;
      }
    })
    .map(item => {
      try {
        const parsedDate = parseISO(item.date);
        return {
          ...item,
          formattedDate: isValid(parsedDate) ? format(parsedDate, "MMM dd") : "Invalid"
        };
      } catch (error) {
        console.error(`Error formatting date: ${item.date}`, error);
        return {
          ...item,
          formattedDate: "Invalid"
        };
      }
    });

  // If all dates were invalid, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No valid commit data available
      </div>
    );
  }

  // Find max value for yAxis domain
  const maxCount = Math.max(...chartData.map(c => c.count), 1);
  const yAxisMax = Math.ceil(maxCount * 1.1); // Add 10% headroom

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }}
          tickMargin={10}
          interval="preserveStartEnd"
        />
        <YAxis 
          allowDecimals={false}
          domain={[0, yAxisMax]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="count" 
          fill="hsl(var(--primary))" 
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommitChart;
