'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, Product } from '../../lib/types';
import { getAdminConfirmCustomerWhatsAppUrl } from '../../lib/whatsapp';
import {
  Lock,
  Unlock,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Printer,
  Sparkles,
  ExternalLink,
  Eye,
  LogOut,
  Save,
  RotateCcw,
  X,
  Layers,
  Send
} from 'lucide-react';

const ADMIN_DEFAULT_PIN = '9797';

export default function AdminDashboardPage() {
  const {
    orders,
    products,
    settings,
    updateOrderStatus,
    deleteOrder,
    deleteProduct,
    addProduct,
    updateProduct,
    updateSettings,
    resetToSampleData,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product modal (add / edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    price: 4500,
    originalPrice: 5500,
    category: 'women-unstitched',
    fabricType: 'Pure Swiss Lawn',
    cutLength: '3-Piece Unstitched (7.5m)',
    pieces: '3-Piece',
    description: '',
    stock: 20,
    badge: 'New Arrival',
    image: '/images/lawn_luxury.jpg',
    colorName: 'Pearl White',
    colorHex: '#FFFFFF',
    weave: 'Airjet Plain Weave',
    season: 'Summer',
  });

  // Store Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);

  // Persistent login check
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('luqman_fabrics_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_DEFAULT_PIN || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        sessionStorage.setItem('luqman_fabrics_admin_auth', 'true');
      } catch (e) {}
    } else {
      setPinError('Invalid Admin PIN. (Default PIN: 9898)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('luqman_fabrics_admin_auth');
    } catch (e) {}
  };

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'confirmed').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const matchQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.whatsappNumber.includes(q) ||
      o.customer.city.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      slug: '',
      sku: `LF-${Math.floor(100 + Math.random() * 900)}`,
      price: 4500,
      originalPrice: 5500,
      category: 'women-unstitched',
      fabricType: 'Pure Swiss Lawn',
      cutLength: '3-Piece Unstitched (7.5m)',
      pieces: '3-Piece',
      description: 'Handpicked premium unstitched fabric from Luqman Fabrics.',
      stock: 25,
      badge: 'New Arrival',
      image: '/images/lawn_luxury.jpg',
      colorName: 'Pearl White',
      colorHex: '#FFFFFF',
      weave: 'Airjet Plain Weave',
      season: 'Summer',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: prod.category,
      fabricType: prod.fabricType,
      cutLength: prod.cutLength,
      pieces: prod.pieces,
      description: prod.description,
      stock: prod.stock,
      badge: prod.badge || 'New Arrival',
      image: prod.images[0] || '/images/hero.jpg',
      colorName: prod.colors[0]?.name || 'Standard',
      colorHex: prod.colors[0]?.hex || '#FFFFFF',
      weave: prod.features.weave,
      season: prod.features.season,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: productFormData.name,
        slug: productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-'),
        sku: productFormData.sku,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        category: productFormData.category as any,
        fabricType: productFormData.fabricType,
        cutLength: productFormData.cutLength,
        pieces: productFormData.pieces,
        description: productFormData.description,
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        badge: productFormData.badge as any,
        images: [productFormData.image, ...editingProduct.images.slice(1)],
        colors: [
          {
            name: productFormData.colorName,
            hex: productFormData.colorHex,
            image: productFormData.image,
          },
          ...editingProduct.colors.slice(1),
        ],
        features: {
          ...editingProduct.features,
          weave: productFormData.weave,
          season: productFormData.season as any,
        },
      });
    } else {
      addProduct({
        name: productFormData.name,
        slug: productFormData.name.toLowerCase().replace(/\s+/g, '-'),
        sku: productFormData.sku,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        category: productFormData.category as any,
        fabricType: productFormData.fabricType,
        cutLength: productFormData.cutLength,
        pieces: productFormData.pieces,
        description: productFormData.description,
        details: [
          'Authentic Luqman Fabrics quality guaranteed',
          'Soft, breathable, and color-fast treated',
          'Includes luxury presentation packaging',
        ],
        features: {
          weave: productFormData.weave,
          season: productFormData.season as any,
          transparency: 'Non-Transparent',
          softness: 'Silky Smooth',
          shrinkage: 'Pre-shrunk',
        },
        colors: [
          {
            name: productFormData.colorName,
            hex: productFormData.colorHex,
            image: productFormData.image,
          },
        ],
        images: [productFormData.image],
        badge: productFormData.badge as any,
        stock: Number(productFormData.stock),
        inStock: Number(productFormData.stock) > 0,
        rating: 5.0,
        reviewCount: 1,
        featured: true,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('✅ Store & WhatsApp settings saved successfully!');
  };

  // IF NOT AUTHENTICATED: SHOW PIN GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-pearl-50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-pearl-300 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-charcoal-900 text-gold-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-neutral-950">
              Luqman Fabrics Admin
            </h2>
            <p className="text-xs text-neutral-500">
              Enter Store Security PIN to manage orders and inventory.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {pinError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (Default: 9797)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full p-3.5 text-center text-lg font-mono tracking-widest bg-pearl-50 border border-pearl-300 rounded-2xl focus:outline-none focus:border-gold-500"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-3.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-2xl shadow-md transition-all"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-[11px] text-neutral-400">
            Protected Admin Portal • Shewa, Khyber Pakhtunkhwa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pearl-50/70 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar with Admin Header & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-pearl-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold-700 font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Store Management System</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-950">
              Luqman Fabrics Admin
            </h1>
            <p className="text-xs text-neutral-500">
              WhatsApp Order Confirmations: <strong>{settings.displayWhatsApp}</strong> • {settings.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToSampleData}
              className="px-3.5 py-2 rounded-xl border border-pearl-300 bg-white hover:bg-pearl-100 text-xs font-medium text-neutral-600 flex items-center gap-1.5 shadow-sm"
              title="Reset orders and catalog to initial demo dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">From {orders.length} total orders placed</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Pending Orders</span>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-serif text-3xl font-bold text-amber-600">
              {pendingOrdersCount}
            </div>
            <p className="text-[11px] text-neutral-500">Requires WhatsApp confirmation</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Confirmed / Active</span>
              <CheckCircle2 className="w-5 h-5 text-gold-600" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              {confirmedOrdersCount}
            </div>
            <p className="text-[11px] text-neutral-500">In packing & dispatch queue</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-pearl-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-mono uppercase font-bold text-neutral-500">Active Fabrics</span>
              <Package className="w-5 h-5 text-charcoal-900" />
            </div>
            <div className="font-serif text-3xl font-bold text-neutral-950">
              {products.length}
            </div>
            <p className="text-[11px] text-neutral-500">Total catalog varieties</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-pearl-200 pb-2">
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-serif uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-charcoal-900 text-gold-400 shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-pearl-100 border border-pearl-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Controls */}
            <div className="bg-white p-4 rounded-3xl border border-pearl-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer, Phone, City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-pearl-50 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                      orderStatusFilter === st
                        ? 'bg-gold-500 text-charcoal-950 font-bold'
                        : 'bg-pearl-100 text-neutral-600 hover:bg-pearl-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List Table */}
            <div className="bg-white rounded-3xl border border-pearl-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pearl-100/70 text-neutral-600 uppercase font-mono tracking-wider border-b border-pearl-200">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer & City</th>
                      <th className="p-4">Fabric Items</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Admin WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pearl-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-neutral-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const confirmWhatsAppUrl = getAdminConfirmCustomerWhatsAppUrl(order);

                        return (
                          <tr key={order.id} className="hover:bg-pearl-50/60 transition-colors">
                            <td className="p-4">
                              <span className="font-mono font-bold text-neutral-900 block text-sm">
                                #{order.orderNumber}
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-neutral-900">{order.customer.fullName}</div>
                              <div className="text-neutral-500 font-mono">{order.customer.whatsappNumber}</div>
                              <div className="text-[11px] text-neutral-600 font-medium">
                                📍 {order.customer.city}
                              </div>
                            </td>

                            <td className="p-4 max-w-xs">
                              <ul className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="truncate text-neutral-700">
                                    • {item.quantity}× {item.productName} ({item.colorName})
                                  </li>
                                ))}
                              </ul>
                            </td>

                            <td className="p-4">
                              <span className="font-serif font-bold text-neutral-950 text-sm block">
                                Rs. {order.totalAmount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-neutral-500 uppercase font-mono">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                              </span>
                            </td>

                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : order.status === 'confirmed'
                                    ? 'bg-gold-50 text-gold-900 border-gold-400'
                                    : order.status === 'processing'
                                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : 'bg-amber-50 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="p-4 text-right space-x-2">
                              {/* 1-Click WhatsApp Confirmation Action */}
                              <a
                                href={confirmWhatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-sm transition-all text-xs"
                                title="Open WhatsApp chat with preformatted confirmation message"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>WhatsApp Customer</span>
                              </a>

                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 rounded-lg border border-pearl-300 hover:bg-pearl-100 text-neutral-600 inline-flex items-center"
                                title="View details & print receipt"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`⚠️ Permanently delete Order #${order.orderNumber} (${order.customer.fullName})?\n\nThis will remove it from both the dashboard and Firestore database.`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-flex items-center"
                                title="Delete Order from Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Fabric Catalog & Inventory ({products.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Add, update, or adjust fabric stock and prices.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white text-xs font-serif uppercase tracking-wider font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fabric</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-5 rounded-3xl border border-pearl-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-gold-400 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pearl-100">
                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      {prod.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold bg-charcoal-900 text-gold-300 rounded-full">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                        <span>{prod.sku}</span>
                        <span className="text-gold-700 font-semibold">{prod.category}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-neutral-950 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {prod.fabricType} • {prod.pieces}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-pearl-100">
                      <div>
                        <span className="font-serif font-bold text-base text-neutral-900">
                          Rs. {prod.price.toLocaleString()}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through ml-2">
                            Rs. {prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        prod.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                      }`}>
                        Stock: {prod.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="flex-1 py-2 bg-pearl-100 hover:bg-gold-100 text-neutral-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete fabric "${prod.name}"?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE & WHATSAPP SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-pearl-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Store Profile & WhatsApp Settings
              </h3>
              <p className="text-xs text-neutral-500">
                Configure official contact information, shipping rules, and top announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Official WhatsApp Number (No + or spaces)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 bg-emerald-50/40 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Display WhatsApp Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.displayWhatsApp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, displayWhatsApp: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Store Physical Address / Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Free Shipping Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Standard Shipping Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Top Announcement Ribbon Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50/50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-pearl-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white font-serif uppercase tracking-wider text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 font-bold block">
                    Order Details
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-950">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer summary */}
              <div className="p-4 bg-pearl-50 rounded-2xl border border-pearl-200 text-xs space-y-1">
                <div className="font-bold text-neutral-900 text-sm">{selectedOrder.customer.fullName}</div>
                <div className="text-emerald-800 font-semibold font-mono">WhatsApp: {selectedOrder.customer.whatsappNumber}</div>
                <div className="text-neutral-700">📍 {selectedOrder.customer.address}, {selectedOrder.customer.city}</div>
                {selectedOrder.customer.orderNotes && (
                  <div className="text-neutral-500 italic mt-1">Instructions: "{selectedOrder.customer.orderNotes}"</div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                <h4 className="font-serif font-bold text-sm text-neutral-900">Ordered Fabric Pieces</h4>
                <div className="divide-y divide-pearl-100 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">{item.productName}</div>
                        <div className="text-[11px] text-neutral-500">Color: {item.colorName} • {item.cutLength}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-neutral-900">
                        {item.quantity} × Rs. {item.price.toLocaleString()} = Rs. {item.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-charcoal-900 text-white rounded-2xl flex justify-between items-center text-sm font-serif">
                <span>Grand Total:</span>
                <span className="text-gold-400 font-bold text-lg">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <a
                  href={getAdminConfirmCustomerWhatsAppUrl(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 bg-pearl-100 hover:bg-pearl-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`⚠️ Permanently delete Order #${selectedOrder.orderNumber} (${selectedOrder.customer.fullName})?\n\nThis will remove it from the dashboard and database.`)) {
                      deleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }
                  }}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-red-200"
                  title="Delete this order"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pearl-300 overflow-hidden p-6 sm:p-8 space-y-6 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
                <h3 className="font-serif text-2xl font-bold text-neutral-950">
                  {editingProduct ? 'Edit Fabric Product' : 'Add New Luxury Fabric'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-neutral-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Fabric Title</label>
                    <input
                      type="text"
                      required
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                      placeholder="e.g. Royal Imperial Boski Suit"
                      className="w-full p-3 rounded-xl border border-pearl-300 focus:outline-none focus:border-gold-500 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={productFormData.sku}
                      onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-white"
                    >
                      <option value="women-unstitched">Women's Lawn</option>
                      <option value="men-unstitched">Men's Boski & Wash & Wear</option>
                      <option value="chiffon-luxury">Chiffon Formals</option>
                      <option value="pure-cotton">Pure Egyptian Cotton</option>
                      <option value="karandi-winter">Winter Karandi</option>
                      <option value="festive-silk">Festive Silk</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Original / Slash Price (PKR)</label>
                    <input
                      type="number"
                      value={productFormData.originalPrice}
                      onChange={(e) => setProductFormData({ ...productFormData, originalPrice: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Fabric Type / Material</label>
                    <input
                      type="text"
                      value={productFormData.fabricType}
                      onChange={(e) => setProductFormData({ ...productFormData, fabricType: e.target.value })}
                      placeholder="e.g. 6-Pound Microfiber Boski"
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Cut Length / Suit Pieces</label>
                    <input
                      type="text"
                      value={productFormData.cutLength}
                      onChange={(e) => setProductFormData({ ...productFormData, cutLength: e.target.value })}
                      placeholder="e.g. Unstitched 4.5m"
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({ ...productFormData, stock: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Promotional Badge</label>
                    <select
                      value={productFormData.badge}
                      onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-white"
                    >
                      <option value="New Arrival">New Arrival</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="Sale">Sale</option>
                      <option value="Exclusive Luxury">Exclusive Luxury</option>
                      <option value="Limited Stock">Limited Stock</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      value={productFormData.image}
                      onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50 font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-pearl-300 bg-pearl-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-pearl-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-pearl-100 rounded-xl font-semibold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-charcoal-900 hover:bg-gold-500 hover:text-charcoal-950 text-white rounded-xl font-serif font-bold uppercase tracking-wider transition-all"
                  >
                    Save Fabric Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
