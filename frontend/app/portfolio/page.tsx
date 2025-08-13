'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Eye, EyeOff, Plus, Search } from 'lucide-react';

interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  sector: string;
  lastUpdate: Date;
}

interface PortfolioSummary {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  todayChange: number;
  todayChangePercent: number;
  diversification: { sector: string; value: number; percentage: number }[];
}

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'holdings' | 'performance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock realistic investment data
  useEffect(() => {
    const mockInvestments: Investment[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 150,
        avgPrice: 180.50,
        currentPrice: 195.20,
        totalValue: 29280.00,
        gainLoss: 2205.00,
        gainLossPercent: 8.15,
        sector: 'Technology',
        lastUpdate: new Date('2025-08-13T15:30:00')
      },
      {
        id: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 75,
        avgPrice: 320.00,
        currentPrice: 335.80,
        totalValue: 25185.00,
        gainLoss: 1185.00,
        gainLossPercent: 4.94,
        sector: 'Technology',
        lastUpdate: new Date('2025-08-13T15:30:00')
      },
      {
        id: '3',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        shares: 50,
        avgPrice: 250.00,
        currentPrice: 245.60,
        totalValue: 12280.00,
        gainLoss: -220.00,
        gainLossPercent: -1.76,
        sector: 'Automotive',
        lastUpdate: new Date('2025-08-13T15:30:00')
      },
      {
        id: '4',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        shares: 40,
        avgPrice: 140.00,
        currentPrice: 152.30,
        totalValue: 6092.00,
        gainLoss: 492.00,
        gainLossPercent: 8.79,
        sector: 'Consumer Discretionary',
        lastUpdate: new Date('2025-08-13T15:30:00')
      },
      {
        id: '5',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 25,
        avgPrice: 120.00,
        currentPrice: 128.75,
        totalValue: 3218.75,
        gainLoss: 218.75,
        gainLossPercent: 7.29,
        sector: 'Technology',
        lastUpdate: new Date('2025-08-13T15:30:00')
      },
      {
        id: '6',
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        shares: 60,
        avgPrice: 165.00,
        currentPrice: 168.40,
        totalValue: 10104.00,
        gainLoss: 204.00,
        gainLossPercent: 2.06,
        sector: 'Healthcare',
        lastUpdate: new Date('2025-08-13T15:30:00')
      }
    ];

    const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.shares * inv.avgPrice), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

    // Calculate sector diversification
    const sectorMap = new Map<string, number>();
    mockInvestments.forEach(inv => {
      const currentValue = sectorMap.get(inv.sector) || 0;
      sectorMap.set(inv.sector, currentValue + inv.totalValue);
    });

    const diversification = Array.from(sectorMap.entries()).map(([sector, value]) => ({
      sector,
      value,
      percentage: (value / totalValue) * 100
    }));

    const mockPortfolio: PortfolioSummary = {
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      todayChange: 342.50,
      todayChangePercent: 0.42,
      diversification
    };

    setTimeout(() => {
      setInvestments(mockInvestments);
      setPortfolio(mockPortfolio);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    if (!balanceVisible) return '••••••';
    return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const filteredInvestments = investments.filter(inv =>
    inv.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600 mt-1">Track your investments and performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {balanceVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="text-sm font-medium">
                {balanceVisible ? 'Hide' : 'Show'} Values
              </span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={18} />
              <span>Buy Stock</span>
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(portfolio.totalValue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  portfolio.totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {portfolio.totalGainLoss >= 0 ? 
                    <TrendingUp className="w-5 h-5 text-green-600" /> :
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  }
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Gain/Loss</p>
                  <p className={`text-xl font-bold ${
                    portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(portfolio.totalGainLoss)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  portfolio.todayChange >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <BarChart3 className={`w-5 h-5 ${
                    portfolio.todayChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today's Change</p>
                  <p className={`text-xl font-bold ${
                    portfolio.todayChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(portfolio.todayChangePercent)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Holdings</p>
                  <p className="text-xl font-bold text-gray-900">
                    {investments.length} stocks
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'holdings', label: 'Holdings' },
              { id: 'performance', label: 'Performance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on selected view */}
        {selectedView === 'overview' && portfolio && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Asset Allocation</h3>
              <div className="space-y-4">
                {portfolio.diversification.map((item, index) => (
                  <div key={item.sector} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{item.sector}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                {investments
                  .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                  .slice(0, 3)
                  .map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{investment.symbol}</p>
                        <p className="text-sm text-gray-500">{investment.name}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercent(investment.gainLossPercent)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(investment.gainLoss)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'holdings' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search holdings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Holdings Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol/Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvestments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {investment.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investment.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {investment.shares}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €{investment.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €{investment.currentPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(investment.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(investment.gainLoss)}
                        </div>
                        <div className={`text-xs ${
                          investment.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercent(investment.gainLossPercent)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Chart</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Performance chart coming soon</p>
                <p className="text-sm text-gray-400">Interactive charts will be available in the next update</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
