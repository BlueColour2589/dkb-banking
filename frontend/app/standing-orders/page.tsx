'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, Calendar, Euro, Users, Clock, AlertCircle, Check, X } from 'lucide-react';

interface StandingOrder {
  id: string;
  recipientName: string;
  recipientIban: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  nextExecution: Date;
  reference: string;
  status: 'active' | 'paused' | 'expired';
  fromAccount: string;
  executionCount: number;
}

interface CreateOrderForm {
  recipientName: string;
  recipientIban: string;
  amount: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  reference: string;
  fromAccount: string;
}

export default function StandingOrdersPage() {
  const [standingOrders, setStandingOrders] = useState<StandingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<StandingOrder | null>(null);
  const [formData, setFormData] = useState<CreateOrderForm>({
    recipientName: '',
    recipientIban: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    reference: '',
    fromAccount: ''
  });

  // Mock data - realistic standing orders
  useEffect(() => {
    const mockOrders: StandingOrder[] = [
      {
        id: '1',
        recipientName: 'Rent Payment',
        recipientIban: 'DE89 3704 0044 0532 0130 00',
        amount: 1200.00,
        frequency: 'monthly',
        startDate: new Date('2025-01-01'),
        nextExecution: new Date('2025-09-01'),
        reference: 'Monthly Rent - Apartment 4B',
        status: 'active',
        fromAccount: 'Main Checking Account',
        executionCount: 8
      },
      {
        id: '2',
        recipientName: 'Savings Transfer',
        recipientIban: 'DE89 3704 0044 0532 0130 01',
        amount: 500.00,
        frequency: 'monthly',
        startDate: new Date('2025-02-01'),
        nextExecution: new Date('2025-09-01'),
        reference: 'Monthly Savings',
        status: 'active',
        fromAccount: 'Main Checking Account',
        executionCount: 7
      },
      {
        id: '3',
        recipientName: 'Insurance Premium',
        recipientIban: 'DE75 5121 0800 1245 126199',
        amount: 89.99,
        frequency: 'monthly',
        startDate: new Date('2025-01-15'),
        nextExecution: new Date('2025-09-15'),
        reference: 'Health Insurance Premium',
        status: 'active',
        fromAccount: 'Main Checking Account',
        executionCount: 8
      },
      {
        id: '4',
        recipientName: 'Charity Donation',
        recipientIban: 'DE62 7021 0800 0000 012345',
        amount: 25.00,
        frequency: 'monthly',
        startDate: new Date('2024-06-01'),
        nextExecution: new Date('2025-09-01'),
        reference: 'Monthly Charity Donation',
        status: 'paused',
        fromAccount: 'Main Checking Account',
        executionCount: 14
      }
    ];

    setTimeout(() => {
      setStandingOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const accounts = [
    { id: '1', name: 'Main Checking Account', balance: 18000000.00 },
    { id: '2', name: 'Savings Account', balance: 0.00 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';  
      case 'yearly': return 'Yearly';
      default: return frequency;
    }
  };

  const toggleOrderStatus = (orderId: string) => {
    setStandingOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, status: order.status === 'active' ? 'paused' : 'active' }
          : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this standing order?')) {
      setStandingOrders(orders => orders.filter(order => order.id !== orderId));
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: StandingOrder = {
      id: Date.now().toString(),
      recipientName: formData.recipientName,
      recipientIban: formData.recipientIban,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      nextExecution: new Date(formData.startDate),
      reference: formData.reference,
      status: 'active',
      fromAccount: formData.fromAccount,
      executionCount: 0
    };

    setStandingOrders(orders => [...orders, newOrder]);
    setShowCreateForm(false);
    setFormData({
      recipientName: '',
      recipientIban: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      reference: '',
      fromAccount: ''
    });
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingOrder(null);
    setFormData({
      recipientName: '',
      recipientIban: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      reference: '',
      fromAccount: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Standing Orders</h1>
            <p className="text-gray-600 mt-1">Manage your recurring payments</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>New Standing Order</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {standingOrders.filter(order => order.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Pause className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paused Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {standingOrders.filter(order => order.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Total</p>
                <p className="text-xl font-bold text-gray-900">
                  €{standingOrders
                    .filter(order => order.status === 'active' && order.frequency === 'monthly')
                    .reduce((sum, order) => sum + order.amount, 0)
                    .toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Execution</p>
                <p className="text-xl font-bold text-gray-900">
                  {standingOrders
                    .filter(order => order.status === 'active')
                    .sort((a, b) => a.nextExecution.getTime() - b.nextExecution.getTime())[0]
                    ?.nextExecution.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Standing Orders List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              All Standing Orders ({standingOrders.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {standingOrders.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No standing orders</h3>
                <p className="text-gray-500">Create your first recurring payment to get started</p>
              </div>
            ) : (
              standingOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{order.recipientName}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{order.reference}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>IBAN: {order.recipientIban}</span>
                            <span>•</span>
                            <span>{getFrequencyLabel(order.frequency)}</span>
                            <span>•</span>
                            <span>{order.executionCount} executions</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Next: {order.nextExecution.toLocaleDateString('en-US')}</span>
                            <span>•</span>
                            <span>From: {order.fromAccount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          €{order.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500">{getFrequencyLabel(order.frequency)}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleOrderStatus(order.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            order.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={order.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {order.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {(showCreateForm || editingOrder) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingOrder ? 'Edit Standing Order' : 'Create Standing Order'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient IBAN
                    </label>
                    <input
                      type="text"
                      value={formData.recipientIban}
                      onChange={(e) => setFormData({...formData, recipientIban: e.target.value})}
                      placeholder="DE89 3704 0044 0532 0130 00"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (€)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      step="0.01"
                      min="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Account
                    </label>
                    <select
                      value={formData.fromAccount}
                      onChange={(e) => setFormData({...formData, fromAccount: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.name}>
                          {account.name} - €{account.balance.toLocaleString('de-DE')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({...formData, reference: e.target.value})}
                      placeholder="Payment reference"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingOrder ? 'Update Order' : 'Create Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
