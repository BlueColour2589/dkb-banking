'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings, AlertTriangle, Shield, Plus, MoreHorizontal } from 'lucide-react';

interface Card {
  id: string;
  cardNumber: string;
  cardType: 'debit' | 'credit';
  cardName: string;
  expiryDate: string;
  cvv: string;
  status: 'active' | 'blocked' | 'expired';
  linkedAccount: string;
  dailyLimit: number;
  monthlyLimit: number;
  currentDailySpent: number;
  currentMonthlySpent: number;
  lastTransaction: Date;
  cardColor: string;
}

interface CardSettings {
  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  internationalPaymentsEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  notificationsEnabled: boolean;
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardNumber, setShowCardNumber] = useState<{ [key: string]: boolean }>({});
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    contactlessEnabled: true,
    onlinePaymentsEnabled: true,
    internationalPaymentsEnabled: false,
    atmWithdrawalsEnabled: true,
    notificationsEnabled: true
  });

  // Mock realistic card data
  useEffect(() => {
    const mockCards: Card[] = [
      {
        id: '1',
        cardNumber: '4532 1234 5678 9012',
        cardType: 'debit',
        cardName: 'DKB Visa Debit Card',
        expiryDate: '12/28',
        cvv: '123',
        status: 'active',
        linkedAccount: 'Main Checking Account',
        dailyLimit: 2000.00,
        monthlyLimit: 10000.00,
        currentDailySpent: 156.80,
        currentMonthlySpent: 2340.50,
        lastTransaction: new Date('2025-08-13T14:30:00'),
        cardColor: 'bg-gradient-to-r from-blue-600 to-blue-800'
      },
      {
        id: '2',
        cardNumber: '5555 4444 3333 2222',
        cardType: 'credit',
        cardName: 'DKB Mastercard Credit',
        expiryDate: '09/27',
        cvv: '456',
        status: 'active',
        linkedAccount: 'Credit Line',
        dailyLimit: 5000.00,
        monthlyLimit: 25000.00,
        currentDailySpent: 0.00,
        currentMonthlySpent: 458.90,
        lastTransaction: new Date('2025-08-12T09:15:00'),
        cardColor: 'bg-gradient-to-r from-gray-800 to-gray-900'
      },
      {
        id: '3',
        cardNumber: '4111 1111 1111 1111',
        cardType: 'debit',
        cardName: 'DKB Backup Card',
        expiryDate: '06/26',
        cvv: '789',
        status: 'blocked',
        linkedAccount: 'Main Checking Account',
        dailyLimit: 1000.00,
        monthlyLimit: 5000.00,
        currentDailySpent: 0.00,
        currentMonthlySpent: 0.00,
        lastTransaction: new Date('2025-07-20T16:45:00'),
        cardColor: 'bg-gradient-to-r from-red-500 to-red-700'
      }
    ];

    setTimeout(() => {
      setCards(mockCards);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCardNumber = (cardNumber: string, cardId: string) => {
    if (showCardNumber[cardId]) {
      return cardNumber;
    }
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumber(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleCardStatus = (cardId: string) => {
    setCards(cards =>
      cards.map(card =>
        card.id === cardId
          ? { ...card, status: card.status === 'active' ? 'blocked' : 'active' }
          : card
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCardTypeIcon = (type: string) => {
    return <CreditCard className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Card Management</h1>
            <p className="text-gray-600 mt-1">Manage your debit and credit cards</p>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>Request New Card</span>
          </button>
        </div>

        {/* Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative rounded-xl p-6 text-white shadow-lg transform transition-all duration-200 hover:scale-105 cursor-pointer ${card.cardColor}`}
              onClick={() => setSelectedCard(card)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  {getCardTypeIcon(card.cardType)}
                  <span className="text-sm font-medium opacity-90">
                    {card.cardType.toUpperCase()}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  card.status === 'active' 
                    ? 'bg-green-500 bg-opacity-20 text-green-100 border-green-400' 
                    : card.status === 'blocked'
                    ? 'bg-red-500 bg-opacity-20 text-red-100 border-red-400'
                    : 'bg-gray-500 bg-opacity-20 text-gray-100 border-gray-400'
                }`}>
                  {card.status.toUpperCase()}
                </div>
              </div>

              {/* Card Number */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg tracking-wider">
                    {formatCardNumber(card.cardNumber, card.id)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardVisibility(card.id);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    {showCardNumber[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs opacity-75 mb-1">CARDHOLDER</p>
                  <p className="font-medium text-sm">DKB CUSTOMER</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">EXPIRES</p>
                  <p className="font-medium text-sm">{card.expiryDate}</p>
                </div>
              </div>

              {/* Card Name */}
              <div className="mt-4">
                <p className="text-xs opacity-75">{card.cardName}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Cards</p>
                <p className="text-xl font-bold text-gray-900">
                  {cards.filter(card => card.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Blocked Cards</p>
                <p className="text-xl font-bold text-gray-900">
                  {cards.filter(card => card.status === 'blocked').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cards</p>
                <p className="text-xl font-bold text-gray-900">{cards.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">All Cards</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {cards.map((card) => (
              <div key={card.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-8 rounded flex items-center justify-center ${card.cardColor}`}>
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-gray-900">{card.cardName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(card.status)}`}>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>****{card.cardNumber.slice(-4)}</span>
                        <span>•</span>
                        <span>Expires {card.expiryDate}</span>
                        <span>•</span>
                        <span>{card.linkedAccount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Daily Limit</p>
                      <p className="font-medium text-gray-900">
                        €{card.currentDailySpent.toLocaleString('de-DE')} / €{card.dailyLimit.toLocaleString('de-DE')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCardStatus(card.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          card.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={card.status === 'active' ? 'Block Card' : 'Unblock Card'}
                      >
                        {card.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Card Settings"
                      >
                        <Settings size={18} />
                      </button>
                      
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Spending Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Daily Spending</span>
                    <span className="text-xs text-gray-500">
                      {((card.currentDailySpent / card.dailyLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((card.currentDailySpent / card.dailyLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Settings Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Card Settings
                  </h3>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Selected Card Preview */}
                <div className={`relative rounded-lg p-4 text-white mb-6 ${selectedCard.cardColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium opacity-90">
                      {selectedCard.cardType.toUpperCase()}
                    </span>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="font-mono text-lg tracking-wider mb-4">
                    {formatCardNumber(selectedCard.cardNumber, selectedCard.id)}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>{selectedCard.cardName}</span>
                    <span>{selectedCard.expiryDate}</span>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Card Controls</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Contactless Payments</p>
                          <p className="text-sm text-gray-500">Enable tap-to-pay transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cardSettings.contactlessEnabled}
                            onChange={(e) => setCardSettings({...cardSettings, contactlessEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Online Payments</p>
                          <p className="text-sm text-gray-500">Allow internet purchases</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cardSettings.onlinePaymentsEnabled}
                            onChange={(e) => setCardSettings({...cardSettings, onlinePaymentsEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">International Payments</p>
                          <p className="text-sm text-gray-500">Allow foreign transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cardSettings.internationalPaymentsEnabled}
                            onChange={(e) => setCardSettings({...cardSettings, internationalPaymentsEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">ATM Withdrawals</p>
                          <p className="text-sm text-gray-500">Enable cash withdrawals</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cardSettings.atmWithdrawalsEnabled}
                            onChange={(e) => setCardSettings({...cardSettings, atmWithdrawalsEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Spending Limits */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Spending Limits</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Limit (€)
                        </label>
                        <input
                          type="number"
                          value={selectedCard.dailyLimit}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Limit (€)
                        </label>
                        <input
                          type="number"
                          value={selectedCard.monthlyLimit}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleCardStatus(selectedCard.id)}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                          selectedCard.status === 'active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {selectedCard.status === 'active' ? (
                          <>
                            <Lock size={18} />
                            <span>Block Card</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={18} />
                            <span>Unblock Card</span>
                          </>
                        )}
                      </button>

                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                        <AlertTriangle size={18} />
                        <span>Report Lost/Stolen</span>
                      </button>

                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        <CreditCard size={18} />
                        <span>Request Replacement</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
