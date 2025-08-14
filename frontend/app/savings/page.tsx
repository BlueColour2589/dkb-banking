'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PiggyBank, Plus, TrendingUp, Calendar, Euro, 
  Target, Play, Pause, Settings, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, ChevronRight,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';

interface SavingsPlan {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyAmount: number;
  startDate: string;
  targetDate: string;
  status: 'active' | 'paused' | 'completed';
  category: string;
  automaticTransfer: boolean;
  nextTransfer: string;
}

const mockSavingsPlans: SavingsPlan[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6750,
    monthlyAmount: 500,
    startDate: '2024-01-01',
    targetDate: '2025-01-01',
    status: 'active',
    category: 'Emergency',
    automaticTransfer: true,
    nextTransfer: '2025-09-01'
  },
  {
    id: '2',
    name: 'Vacation 2025',
    targetAmount: 3000,
    currentAmount: 1200,
    monthlyAmount: 200,
    startDate: '2024-06-01',
    targetDate: '2025-06-01',
    status: 'active',
    category: 'Travel',
    automaticTransfer: true,
    nextTransfer: '2025-09-01'
  },
  {
    id: '3',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8500,
    monthlyAmount: 800,
    startDate: '2024-03-01',
    targetDate: '2026-03-01',
    status: 'paused',
    category: 'Vehicle',
    automaticTransfer: false,
    nextTransfer: '-'
  },
  {
    id: '4',
    name: 'Home Down Payment',
    targetAmount: 50000,
    currentAmount: 50000,
    monthlyAmount: 1000,
    startDate: '2022-01-01',
    targetDate: '2024-12-31',
    status: 'completed',
    category: 'Housing',
    automaticTransfer: false,
    nextTransfer: '-'
  }
];

export default function SavingsPlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savingsPlans, setSavingsPlans] = useState<SavingsPlan[]>(mockSavingsPlans);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
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

  const totalSaved = savingsPlans.reduce((sum, plan) => sum + plan.currentAmount, 0);
  const totalTarget = savingsPlans.reduce((sum, plan) => sum + plan.targetAmount, 0);
  const monthlyContributions = savingsPlans
    .filter(plan => plan.status === 'active')
    .reduce((sum, plan) => sum + plan.monthlyAmount, 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={12} />;
      case 'paused': return <Pause size={12} />;
      case 'completed': return <CheckCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Savings Plans</h1>
                <p className="text-gray-600">Manage your savings goals and track progress</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create New Plan</span>
              </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PiggyBank className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Saved</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSaved)}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12.3% vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Target</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget)}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(totalSaved, totalTarget)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {getProgressPercentage(totalSaved, totalTarget).toFixed(1)}% complete
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyContributions)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {savingsPlans.filter(p => p.status === 'active').length} active plans
                </p>
              </div>
            </div>

            {/* Savings Plans List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Your Savings Plans</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {savingsPlans.map((plan) => (
                  <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <PiggyBank className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(plan.status)}`}>
                          {getStatusIcon(plan.status)}
                          <span className="capitalize">{plan.status}</span>
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(plan.currentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Target Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(plan.targetAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Contribution</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(plan.monthlyAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Target Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(plan.targetDate)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {getProgressPercentage(plan.currentAmount, plan.targetAmount).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            plan.status === 'completed' ? 'bg-blue-500' : 
                            plan.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${getProgressPercentage(plan.currentAmount, plan.targetAmount)}%` }}
                        />
                      </div>
                    </div>

                    {plan.automaticTransfer && plan.status === 'active' && (
                      <div className="mt-4 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-2" />
                        <span>Next automatic transfer: {formatDate(plan.nextTransfer)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Create New Plan</h3>
                <p className="text-sm text-gray-600">Set up a new savings goal</p>
              </button>

              <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Savings Analytics</h3>
                <p className="text-sm text-gray-600">View detailed progress reports</p>
              </button>

              <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Plans</h3>
                <p className="text-sm text-gray-600">Edit or pause existing plans</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
