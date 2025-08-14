'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HelpCircle, Search, Book, MessageCircle, Phone, Mail,
  ChevronRight, ChevronDown, Clock, CheckCircle, Star,
  CreditCard, ArrowUpDown, Shield, Settings, TrendingUp,
  FileText, Globe, Headphones, Video, Bot, ExternalLink
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
  available: boolean;
  responseTime?: string;
}

const mockFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I transfer money to another bank account?',
    answer: 'To transfer money: 1) Go to the Transfer section, 2) Enter recipient details, 3) Specify amount, 4) Review and confirm. Transfers within Germany typically complete within minutes.',
    category: 'Transfers',
    helpful: 89,
    views: 1234
  },
  {
    id: '2',
    question: 'What are the fees for international transfers?',
    answer: 'International transfer fees vary by destination and amount. EU transfers: €0.50, Non-EU transfers: €15-25. Real-time rates are shown before confirmation.',
    category: 'Transfers',
    helpful: 76,
    views: 892
  },
  {
    id: '3',
    question: 'How do I reset my login password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions sent to your email. The process takes 2-3 minutes.',
    category: 'Account',
    helpful: 94,
    views: 2156
  },
  {
    id: '4',
    question: 'What security measures protect my account?',
    answer: 'We use 256-bit SSL encryption, two-factor authentication, biometric login, transaction monitoring, and device recognition to protect your account.',
    category: 'Security',
    helpful: 91,
    views: 1567
  },
  {
    id: '5',
    question: 'How do I set up automatic savings plans?',
    answer: 'Go to Savings Plans > Create New Plan. Choose your target amount, monthly contribution, and target date. The system will automatically transfer funds monthly.',
    category: 'Savings',
    helpful: 87,
    views: 743
  },
  {
    id: '6',
    question: 'Can I invest in stocks through DKB?',
    answer: 'Yes! Access our Market section to view stocks, ETFs, and indices. Our investment advisory team can help you create a diversified portfolio.',
    category: 'Investment',
    helpful: 82,
    views: 658
  }
];

const supportOptions: SupportOption[] = [
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    icon: MessageCircle,
    action: 'Start Chat',
    available: true,
    responseTime: 'Usually responds in 2-3 minutes'
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Speak directly with a banking specialist',
    icon: Phone,
    action: 'Call Now',
    available: true,
    responseTime: 'Mon-Fri 8:00-20:00, Sat 9:00-16:00'
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us a detailed message about your issue',
    icon: Mail,
    action: 'Send Email',
    available: true,
    responseTime: 'Response within 24 hours'
  },
  {
    id: 'video',
    title: 'Video Call',
    description: 'Schedule a video consultation with an advisor',
    icon: Video,
    action: 'Schedule Call',
    available: true,
    responseTime: 'Available Mon-Fri 9:00-17:00'
  }
];

const helpCategories = [
  { name: 'All Topics', icon: Book, count: mockFAQs.length },
  { name: 'Account', icon: Settings, count: mockFAQs.filter(f => f.category === 'Account').length },
  { name: 'Transfers', icon: ArrowUpDown, count: mockFAQs.filter(f => f.category === 'Transfers').length },
  { name: 'Security', icon: Shield, count: mockFAQs.filter(f => f.category === 'Security').length },
  { name: 'Savings', icon: TrendingUp, count: mockFAQs.filter(f => f.category === 'Savings').length },
  { name: 'Investment', icon: TrendingUp, count: mockFAQs.filter(f => f.category === 'Investment').length },
  { name: 'Cards', icon: CreditCard, count: 0 }
];

export default function HelpCenterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
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

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Topics' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
              <p className="text-gray-600">Find answers to your questions or get in touch with our support team</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {supportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Categories and FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {helpCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedCategory === category.name
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent size={16} />
                            <span>{category.name}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            selectedCategory === category.name
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="text-center">
                    <Headphones className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-blue-900 mb-2">Still need help?</h4>
                    <p className="text-sm text-blue-700 mb-4">Our support team is here to assist you</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedCategory === 'All Topics' ? 'Frequently Asked Questions' : `${selectedCategory} Questions`}
                      </h2>
                      <span className="text-sm text-gray-600">
                        {filteredFAQs.length} article{filteredFAQs.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {filteredFAQs.length === 0 ? (
                      <div className="p-8 text-center">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                      </div>
                    ) : (
                      filteredFAQs.map((faq) => (
                        <div key={faq.id} className="p-6">
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                            {expandedFAQ === faq.id ? (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          
                          {expandedFAQ === faq.id && (
                            <div className="mt-4 space-y-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Star className="w-4 h-4" />
                                    <span>{faq.helpful}% found this helpful</span>
                                  </span>
                                  <span>{faq.views} views</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Was this helpful?</span>
                                  <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                    <CheckCircle size={16} />
                                  </button>
                                  <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                    <HelpCircle size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Book className="w-6 h-6 text-green-600" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">User Guide</h3>
                <p className="text-gray-600 text-sm mb-4">Complete guide to using DKB Digital Banking</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Read Guide →
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm mb-4">Step-by-step video guides for common tasks</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Watch Videos →
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-gray-600 text-sm mb-4">Connect with other users and share tips</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Join Forum →
                </button>
              </div>
            </div>

            {/* Contact Support Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <div className="text-center max-w-2xl mx-auto">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
                <p className="text-blue-100 mb-6">
                  Our expert support team is available 24/7 to help you with any banking needs
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Phone className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-blue-100">+49 30 120 300 00</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-blue-100">Available 24/7</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Mail className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-blue-100">support@dkb.de</p>
                  </div>
                </div>
                
                <button className="mt-6 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                  Contact Support Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
