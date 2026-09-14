'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/products/ProductCard';
import { CATEGORIES_DATA } from '../../lib/mockData';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  List,
  Heart
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const { products } = useStore();
  const { wishlist } = useWishlist();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialView = searchParams.get('view') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedPieces, setSelectedPieces] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search')!);
    }
  }, [searchParams]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // If wishlist view is requested
    if (initialView === 'wishlist') {
      const wishlistIds = wishlist.map((p) => p.id);
      list = list.filter((p) => wishlistIds.includes(p.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabricType.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Season filter
    if (selectedSeason !== 'all') {
      list = list.filter((p) => p.features.season === selectedSeason);
    }

    // Pieces / Cut filter
    if (selectedPieces !== 'all') {
      list = list.filter((p) => p.pieces === selectedPieces);
    }

    // Price range
    list = list.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, selectedCategory, searchQuery, selectedSeason, selectedPieces, maxPrice, sortBy, initialView, wishlist]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSeason('all');
    setSelectedPieces('all');
    setMaxPrice(15000);
    setSortBy('featured');
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left border-b border-pearl-200 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700 font-semibold block mb-1">
              Luqman Fabrics Shewa Boutique
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950">
              {initialView === 'wishlist' ? 'Your Saved Wishlist' : 'Luxury Fabric Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Showing {filteredProducts.length} authentic unstitched textile selections
            </p>
          </div>

          {/* Quick Search in Shop */}
          <div className="w-full sm:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search lawn, boski, chiffon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-pearl-50 border border-pearl-300 rounded-full focus:outline-none focus:border-gold-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-pearl-50/70 p-6 rounded-3xl border border-pearl-200 space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-neutral-900">
                <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                <span>Filter Fabrics</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                Fabric Category
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-charcoal-900 text-gold-400 font-semibold shadow-sm'
                      : 'text-neutral-700 hover:bg-pearl-100'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-charcoal-900 text-gold-400 font-semibold shadow-sm'
                        : 'text-neutral-700 hover:bg-pearl-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-pearl-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono uppercase text-neutral-500 font-bold">Max Price:</span>
                <span className="font-bold text-neutral-900 font-serif">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>Rs. 2,000</span>
                <span>Rs. 15,000</span>
              </div>
            </div>

            {/* Pieces / Cut Type */}
            <div className="space-y-2 pt-4 border-t border-pearl-200">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                Suit Cut / Pieces
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {['all', '3-Piece', '4.5m Suit', '2-Piece', '1-Piece'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPieces(p)}
                    className={`py-1.5 px-2 rounded-lg text-center border transition-all ${
                      selectedPieces === p
                        ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-500'
                        : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-100'
                    }`}
                  >
                    {p === 'all' ? 'All Cuts' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Season Filter */}
            <div className="space-y-2 pt-4 border-t border-pearl-200">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                Wearing Season
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {['all', 'Summer', 'Winter', 'Festive / Wedding', 'All Seasons'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`py-1.5 px-2 rounded-lg text-center border transition-all ${
                      selectedSeason === s
                        ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-500'
                        : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-100'
                    }`}
                  >
                    {s === 'all' ? 'All Seasons' : s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar: Sorting & Mobile filter trigger */}
            <div className="bg-pearl-50 p-4 rounded-2xl border border-pearl-200 flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-pearl-300 text-xs font-semibold text-neutral-800"
              >
                <Filter className="w-3.5 h-3.5 text-gold-600" />
                <span>Filters</span>
              </button>

              {/* Active Filter Badges */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap text-xs">
                {selectedCategory !== 'all' && (
                  <span className="bg-white px-2.5 py-1 rounded-full border border-pearl-300 flex items-center gap-1.5 text-neutral-700">
                    Category: <strong>{selectedCategory}</strong>
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSeason !== 'all' && (
                  <span className="bg-white px-2.5 py-1 rounded-full border border-pearl-300 flex items-center gap-1.5 text-neutral-700">
                    Season: <strong>{selectedSeason}</strong>
                    <button onClick={() => setSelectedSeason('all')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-white px-2.5 py-1 rounded-full border border-pearl-300 flex items-center gap-1.5 text-neutral-700">
                    Query: <strong>"{searchQuery}"</strong>
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-mono uppercase text-neutral-500 hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-pearl-300 text-xs font-medium text-neutral-800 rounded-xl px-3 py-2 focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-pearl-50 rounded-3xl p-16 text-center border border-pearl-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-pearl-200 flex items-center justify-center mx-auto text-neutral-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  No matching fabrics found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your search terms, price slider, or category filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-gold-500 hover:text-charcoal-900 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-slideInRight">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pearl-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                  <h3 className="font-serif font-bold text-lg text-neutral-900">Filter Fabrics</h3>
                </div>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-pearl-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-500 font-bold block mb-2">Category</label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setSelectedCategory('all'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${selectedCategory === 'all' ? 'bg-charcoal-900 text-gold-400 font-semibold' : 'text-neutral-700 hover:bg-pearl-100'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug); }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${selectedCategory === cat.slug ? 'bg-charcoal-900 text-gold-400 font-semibold' : 'text-neutral-700 hover:bg-pearl-100'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="pt-4 border-t border-pearl-200">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-mono uppercase font-bold text-neutral-500">Max Price</span>
                  <span className="font-bold text-neutral-900 font-serif">Rs. {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={15000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                  <span>Rs. 2,000</span>
                  <span>Rs. 15,000</span>
                </div>
              </div>

              {/* Mobile Pieces / Cut */}
              <div className="pt-4 border-t border-pearl-200">
                <label className="text-xs font-mono uppercase text-neutral-500 font-bold block mb-2">Suit Cut / Pieces</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['all', '3-Piece', '4.5m Suit', '2-Piece', '1-Piece'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPieces(p)}
                      className={`py-1.5 px-2 rounded-lg text-center border text-xs transition-all ${
                        selectedPieces === p
                          ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-500'
                          : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-100'
                      }`}
                    >
                      {p === 'all' ? 'All Cuts' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Season */}
              <div className="pt-4 border-t border-pearl-200">
                <label className="text-xs font-mono uppercase text-neutral-500 font-bold block mb-2">Wearing Season</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['all', 'Summer', 'Winter', 'Festive / Wedding', 'All Seasons'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeason(s)}
                      className={`py-1.5 px-2 rounded-lg text-center border text-xs transition-all ${
                        selectedSeason === s
                          ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-500'
                          : 'bg-white border-pearl-300 text-neutral-600 hover:bg-pearl-100'
                      }`}
                    >
                      {s === 'all' ? 'All Seasons' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-pearl-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-xs font-semibold bg-pearl-100 hover:bg-pearl-200 text-neutral-700 rounded-xl transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 text-xs font-semibold bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl shadow-md transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center font-serif text-lg text-neutral-500">
          Loading Luqman Fabrics Collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

