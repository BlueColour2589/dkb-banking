'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, TrendingDown, Search, Filter, Star,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Globe, Euro, DollarSign, Activity, Eye, Plus,
  ChevronRight, Clock, AlertCircle, CheckCircle
} from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector: string;
  currency: string;
}

interface IndexData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

const mockIndices: IndexData[] = [
  { name: 'DAX', symbol: 'DAX', value: 17845.32, change: 125.43, changePercent: 0.71 },
  { name: 'MDAX', symbol: 'MDAX', value: 26789.45, change: -87.23, changePercent: -0.32 },
  { name: 'S&P 500', symbol: 'SPX', value: 5234.18, change: 23.45, changePercent: 0.45 },
  { name: 'NASDAQ', symbol: 'IXIC', value: 16123.45, change: 89.23, changePercent: 0.56 },
  { name: 'FTSE 100', symbol: 'UKX', value: 7456.78, change: -12.34, changePercent: -0.17 },
  { name: 'Nikkei 225', symbol: 'NKY', value: 33245.67, change: 234.56, changePercent: 0.71 }
];

const mockStocks: MarketData[] = [
  { symbol: 'SAP', name: 'SAP SE', price: 145.23, change: 2.45, changePercent: 1.71, volume: 1234567, marketCap: 156000000000, sector: 'Technology', currency: 'EUR' },
  { symbol: 'SIE', name: 'Siemens AG', price: 178.45, change: -1.23, changePercent: -0.68, volume: 987654, marketCap: 143000000000, sector: 'Industrial', currency: 'EUR' },
  { symbol: 'ALV', name: 'Allianz SE', price: 245.67, change: 3.21, changePercent: 1.32, volume: 654321, marketCap: 98000000000, sector: 'Finance', currency: 'EUR' },
  { symbol: 'ASME', name: 'ASML Holding', price: 734.12, change: 8.45, changePercent: 1.16, volume: 432198, marketCap: 287000000000, sector: 'Technology', currency: 'EUR' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: -2.34, changePercent: -1.22, volume: 45678901, marketCap: 2980000000000, sector: 'Technology', currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 423.78, change: 5.67, changePercent: 1.36, volume: 23456789, marketCap: 3140000000000, sector: 'Technology', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 912.34, change: 23.45, changePercent: 2.64, volume: 34567890, marketCap: 2250000000000, sector: 'Technology', currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -8.91, changePercent: -3.66, volume: 56789012, marketCap: 746000000000, sector: 'Automotive', currency: 'USD' }
];

const mockWatchlist = ['SAP', 'SIE', 'AAPL', 'NVDA'];

export default function MarketPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'indices' | 'stocks' | 'watchlist'>('indices');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [watchlist, setWatchlist] = useState<string[]>(mockWatchlist);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const filteredStocks = mockStocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const watchlistStocks = mockStocks.filter(stock => watchlist.includes(stock.symbol));

  const sectors = ['all', ...Array.from(new Set(mockStocks.map(stock => stock.sector)))];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  const renderStockCard = (stock: MarketData) => (
    <div key={stock.symbol} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="font-bold text-blue-600 text-sm">{stock.symbol}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-600 truncate max-w-32">{stock.name}</p>
          </div>
        </div>
        <button
          onClick={() => toggleWatchlist(stock.symbol)}
          className={`p-2 rounded-lg transition-colors ${
            watchlist.includes(stock.symbol)
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Star size={16} fill={watchlist.includes(stock.symbol) ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(stock.price, stock.currency)}
          </span>
          <div className={`flex items-center space-x-1 ${getChangeColor(stock.change)}`}>
            {getChangeIcon(stock.change)}
            <span className="font-medium">
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Volume</p>
            <p className="font-medium">{formatNumber(stock.volume)}</p>
          </div>
          <div>
            <p className="text-gray-600">Sector</p>
            <p className="font-medium">{stock.sector}</p>
          </div>
        </div>

        {stock.marketCap && (
          <div className="text-sm">
            <p className="text-gray-600">Market Cap</p>
            <p className="font-medium">{formatCurrency(stock.marketCap, stock.currency)}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 pt-20 lg:pt-8">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Market Overview</h1>
                <p className="text-gray-600">Real-time market data and analysis</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Add to Watchlist</span>
                </button>
              </div>
            </div>

            {/* Market Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {mockIndices.map((index) => (
                <div key={index.symbol} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{index.name}</h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {index.value.toLocaleString('de-DE')}
                    </p>
                    <div className={`flex items-center justify-center space-x-1 mt-1 ${getChangeColor(index.change)}`}>
                      {getChangeIcon(index.change)}
                      <span className="text-sm font-medium">
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search stocks, indices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>
                        {sector === 'all' ? 'All Sectors' : sector}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {[
                      { key: 'indices', label: 'Indices', icon: BarChart3 },
                      { key: 'stocks', label: 'Stocks', icon: TrendingUp },
                      { key: 'watchlist', label: 'Watchlist', icon: Star }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTab(key as any)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedTab === key
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {selectedTab === 'indices' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Major Indices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockIndices.map((index) => (
                    <div key={index.symbol} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{index.name}</h3>
                            <p className="text-sm text-gray-600">{index.symbol}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Eye size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {index.value.toLocaleString('de-DE')}
                          </span>
                          <div className={`flex items-center space-x-1 ${getChangeColor(index.change)}`}>
                            {getChangeIcon(index.change)}
                            <span className="font-medium">
                              {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-gray-600">Change</p>
                          <p className={`font-medium ${getChangeColor(index.change)}`}>
                            {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'stocks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Stocks</h2>
                  <p className="text-sm text-gray-600">{filteredStocks.length} results</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStocks.map(renderStockCard)}
                </div>
              </div>
            )}

            {selectedTab === 'watchlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Watchlist</h2>
                  <p className="text-sm text-gray-600">{watchlistStocks.length} items</p>
                </div>
                
                {watchlistStocks.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-600 mb-6">Add stocks to your watchlist to track them easily</p>
                    <button
                      onClick={() => setSelectedTab('stocks')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Browse Stocks
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlistStocks.map(renderStockCard)}
                  </div>
                )}
              </div>
            )}

            {/* Market Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Market Movers</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                
                <div className="space-y-3">
                  {mockStocks
                    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                    .slice(0, 5)
                    .map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{stock.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{stock.symbol}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(stock.price, stock.currency)}</p>
                          </div>
                        </div>
                        <div className={`text-right ${getChangeColor(stock.change)}`}>
                          <div className="flex items-center space-x-1">
                            {getChangeIcon(stock.change)}
                            <span className="font-medium">
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Market News</h3>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "ECB Keeps Interest Rates Steady",
                      time: "2 hours ago",
                      impact: "positive"
                    },
                    {
                      title: "German Manufacturing Data Beats Expectations",
                      time: "4 hours ago",
                      impact: "positive"
                    },
                    {
                      title: "Tech Stocks Rally on AI Optimism",
                      time: "6 hours ago",
                      impact: "positive"
                    },
                    {
                      title: "Energy Sector Under Pressure",
                      time: "8 hours ago",
                      impact: "negative"
                    }
                  ].map((news, index) => (
                    <div key={index} className="flex items-start space-x-3 py-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        news.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{news.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{news.time}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
