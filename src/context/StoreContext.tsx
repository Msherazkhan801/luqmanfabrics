'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, StoreSettings, CustomerDetails, OrderStatus, PaymentMethod } from '../lib/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_STORE_SETTINGS } from '../lib/mockData';
import {
  syncOrderToFirestore,
  deleteOrderFromFirestore,
  updateOrderStatusInFirestore,
  syncProductToFirestore,
  deleteProductFromFirestore,
  syncSettingsToFirestore,
  db
} from '../lib/firebase';
import { collection, onSnapshot, doc, getDocs } from 'firebase/firestore';

interface PlaceOrderParams {
  customer: CustomerDetails;
  items: {
    productId: string;
    productName: string;
    colorName: string;
    colorHex: string;
    image: string;
    cutLength: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (params: PlaceOrderParams) => Order;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markOrderWhatsAppSent: (orderId: string) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  trackOrderPrefill: string;
  openTrackOrderModal: (prefill?: string) => void;
  closeTrackOrderModal: () => void;
  resetToSampleData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderPrefill, setTrackOrderPrefill] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const openTrackOrderModal = (prefill?: string) => {
    if (prefill !== undefined) {
      setTrackOrderPrefill(prefill);
    }
    setIsTrackOrderOpen(true);
  };

  const closeTrackOrderModal = () => {
    setIsTrackOrderOpen(false);
  };

  // Initialize data from localStorage or seed
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('luqman_fabrics_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('luqman_fabrics_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      const savedOrders = localStorage.getItem('luqman_fabrics_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('luqman_fabrics_orders', JSON.stringify(INITIAL_ORDERS));
      }

      const savedSettings = localStorage.getItem('luqman_fabrics_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings(INITIAL_STORE_SETTINGS);
        localStorage.setItem('luqman_fabrics_settings', JSON.stringify(INITIAL_STORE_SETTINGS));
      }
    } catch (e) {
      console.error('Error loading store data', e);
    }
    setIsLoaded(true);

    // Real-time Firestore sync listeners if connected
    try {
      const ordersCol = collection(db, 'orders');
      const unsubscribeOrders = onSnapshot(ordersCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudOrders: Order[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Order;
            if (data && data.id) {
              cloudOrders.push(data);
            }
          });
          // Sort by creation date descending
          cloudOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(cloudOrders);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot error:", err);
      });

      return () => {
        unsubscribeOrders();
      };
    } catch (e) {
      // Offline fallback
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('luqman_fabrics_products', JSON.stringify(products));
      } catch (e) {}
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('luqman_fabrics_orders', JSON.stringify(orders));
      } catch (e) {}
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('luqman_fabrics_settings', JSON.stringify(settings));
      } catch (e) {}
    }
  }, [settings, isLoaded]);

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    // Cloud sync to Firestore
    syncProductToFirestore(newProduct);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // Cloud sync to Firestore
    syncProductToFirestore(updated);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Cloud sync to Firestore
    deleteProductFromFirestore(id);
  };

  const placeOrder = (params: PlaceOrderParams): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `LF-${randomSuffix}`,
      customer: {
        fullName: params.customer.fullName || '',
        whatsappNumber: params.customer.whatsappNumber || '',
        alternatePhone: params.customer.alternatePhone || '',
        email: params.customer.email || '',
        address: params.customer.address || '',
        city: params.customer.city || 'Shewa',
        province: params.customer.province || 'Khyber Pakhtunkhwa',
        postalCode: params.customer.postalCode || '',
        orderNotes: params.customer.orderNotes || '',
      },
      items: params.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        colorName: item.colorName,
        colorHex: item.colorHex,
        image: item.image,
        cutLength: item.cutLength,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.total),
      })),
      subtotal: Number(params.subtotal),
      shippingFee: Number(params.shippingFee),
      discountAmount: Number(params.discountAmount || 0),
      promoCode: params.promoCode || '',
      totalAmount: Number(params.totalAmount),
      paymentMethod: params.paymentMethod || 'cod',
      status: 'pending',
      notes: params.customer.orderNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      whatsappSent: false,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Cloud sync to Firebase Firestore
    syncOrderToFirestore(newOrder);

    // Update product stock counts
    setProducts((prevProds) => {
      const updated = [...prevProds];
      params.items.forEach((item) => {
        const prodIndex = updated.findIndex((p) => p.id === item.productId);
        if (prodIndex > -1) {
          const currentStock = updated[prodIndex].stock;
          const newStock = Math.max(0, currentStock - item.quantity);
          const updatedProd = {
            ...updated[prodIndex],
            stock: newStock,
            inStock: newStock > 0,
          };
          updated[prodIndex] = updatedProd;
          syncProductToFirestore(updatedProd);
        }
      });
      return updated;
    });

    return newOrder;
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    // Cloud sync to Firestore
    deleteOrderFromFirestore(orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    // Cloud sync to Firestore
    updateOrderStatusInFirestore(orderId, status);
  };

  const markOrderWhatsAppSent = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, whatsappSent: true, updatedAt: new Date().toISOString() } : o))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      syncOrderToFirestore({ ...targetOrder, whatsappSent: true, updatedAt: new Date().toISOString() });
    }
  };

  const updateSettings = (newSet: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSet };
    setSettings(updated);
    // Cloud sync to Firestore
    syncSettingsToFirestore(updated);
  };

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_STORE_SETTINGS);
    localStorage.setItem('luqman_fabrics_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('luqman_fabrics_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('luqman_fabrics_settings', JSON.stringify(INITIAL_STORE_SETTINGS));
    // Sync sample products and settings to Firestore
    INITIAL_PRODUCTS.forEach((prod) => syncProductToFirestore(prod));
    INITIAL_ORDERS.forEach((ord) => syncOrderToFirestore(ord));
    syncSettingsToFirestore(INITIAL_STORE_SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        deleteOrder,
        updateOrderStatus,
        markOrderWhatsAppSent,
        updateSettings,
        quickViewProduct,
        setQuickViewProduct,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        trackOrderPrefill,
        openTrackOrderModal,
        closeTrackOrderModal,
        resetToSampleData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
