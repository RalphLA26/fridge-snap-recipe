
import React from 'react';
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExpiryStatistics } from "@/lib/inventoryUtils";

interface InventoryStatisticsProps {
  items: any[];
  categoryCounts: Record<string, number>;
  expiryStats: {
    expiringSoon: number;
    expired: number;
  };
}

const InventoryStatistics = ({ items, categoryCounts, expiryStats }: InventoryStatisticsProps) => {
  // Prepare data for category chart
  const categoryData = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name: name.split(' ')[0], // Shorten category name
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Get colors based on category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Fruits": "#22c55e", // green
      "Dairy": "#60a5fa", // blue
      "Meat": "#ef4444", // red
      "Pantry": "#f59e0b", // amber
      "Frozen": "#0ea5e9", // sky
      "Beverages": "#a855f7", // purple
      "Spices": "#f97316", // orange
      "Other": "#6b7280", // gray
    };
    
    return colors[category] || "#6b7280";
  };

  // Get expiry statistics
  const expiryStats2 = getExpiryStatistics(items);
  const expiryData = [
    { name: "Good", count: expiryStats2.good, color: "#22c55e" },
    { name: "Expiring soon", count: expiryStats2.expiringSoon, color: "#f59e0b" },
    { name: "Expired", count: expiryStats2.expired, color: "#ef4444" },
    { name: "No expiry", count: expiryStats2.noExpiryDate, color: "#6b7280" },
  ].filter(item => item.count > 0);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Items by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`${value} items`, 'Count']}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#8884d8">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expiry Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expiryData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`${value} items`, 'Count']}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#8884d8">
                  {expiryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {expiryStats.expired > 0 && (
            <p className="text-xs mt-2 text-red-600">
              You have {expiryStats.expired} expired item{expiryStats.expired !== 1 ? 's' : ''} that should be removed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStatistics;
