import { Order, Product } from './types';

export const OFFICIAL_WHATSAPP_NUMBER = "923409797271";
export const DISPLAY_WHATSAPP_NUMBER = "+92 340 9797271";
export const STORE_EMAIL = "luqmanfabricsshewa@gmail.com";
export const STORE_NAME = "Luqman Fabrics";

/**
 * Clean phone number to WhatsApp international format (e.g. 03409797271 -> 923409797271)
 */
export function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('03')) {
    return '92' + digits.slice(1);
  }
  if (digits.startsWith('3') && digits.length === 10) {
    return '92' + digits;
  }
  if (digits.startsWith('92')) {
    return digits;
  }
  if (digits.startsWith('0092')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Generates WhatsApp URL for customer to send their order confirmation to Luqman Fabrics Admin
 */
export function getCustomerOrderWhatsAppUrl(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   - Color: ${item.colorName}\n   - Cut: ${item.cutLength}\n   - Qty: ${item.quantity} × Rs. ${item.price.toLocaleString()} = Rs. ${item.total.toLocaleString()}`
    )
    .join('\n\n');

  const text = `*✨ NEW ORDER - ${STORE_NAME.toUpperCase()} ✨*
━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${order.orderNumber}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}

👤 *Customer Details:*
• *Name:* ${order.customer.fullName}
• *WhatsApp:* ${order.customer.whatsappNumber}
${order.customer.alternatePhone ? `• *Alt Phone:* ${order.customer.alternatePhone}\n` : ''}• *Delivery Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.province}
${order.customer.orderNotes ? `• *Special Instructions:* ${order.customer.orderNotes}\n` : ''}
🛍️ *Ordered Fabrics:*
${itemsText}

━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* Rs. ${order.subtotal.toLocaleString()}
🚚 *Shipping Fee:* ${order.shippingFee === 0 ? 'FREE DELIVERY' : `Rs. ${order.shippingFee.toLocaleString()}`}
${order.discountAmount > 0 ? `🏷️ *Discount (${order.promoCode || 'PROMO'}):* -Rs. ${order.discountAmount.toLocaleString()}\n` : ''}💵 *TOTAL AMOUNT:* Rs. ${order.totalAmount.toLocaleString()}
💳 *Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}
━━━━━━━━━━━━━━━━━━
_Please confirm my order and share tracking dispatch details. Thank you!_`;

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL for Store Admin to message and confirm order with customer
 */
export function getAdminConfirmCustomerWhatsAppUrl(order: Order): string {
  const customerPhone = formatWhatsAppNumber(order.customer.whatsappNumber);
  
  const text = `*Assalam-o-Alaikum ${order.customer.fullName}!* 🌸

Thank you for choosing *${STORE_NAME}*. 

We have received your order *#${order.orderNumber}* for:
${order.items.map(i => `• ${i.productName} (${i.colorName}, ${i.cutLength}) × ${i.quantity}`).join('\n')}

💰 *Total Payable:* Rs. ${order.totalAmount.toLocaleString()} (${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'})
📍 *Delivery Address:* ${order.customer.address}, ${order.customer.city}

Your order is now being processed for inspection and packaging. We will share your courier tracking number once dispatched. 

If you have any custom cutting or urgent delivery requirements, please reply to this chat.

*Luqman Fabrics - Quality You Feel, Style You Love*
📍 Shewa, Khyber Pakhtunkhwa
📞 ${DISPLAY_WHATSAPP_NUMBER}
✉️ ${STORE_EMAIL}`;

  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL for direct product inquiry
 */
export function getProductInquiryWhatsAppUrl(product: Product, selectedColorName?: string): string {
  const text = `*Assalam-o-Alaikum Luqman Fabrics!* 🌸

I would like to inquire about this fabric from your store:
• *Fabric:* ${product.name}
• *SKU:* ${product.sku}
• *Fabric Type:* ${product.fabricType}
• *Cut / Length:* ${product.cutLength}
• *Price:* Rs. ${product.price.toLocaleString()}
${selectedColorName ? `• *Selected Color:* ${selectedColorName}\n` : ''}
Could you please share more real-video/photos and confirm availability? Thank you!`;

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * General Help WhatsApp URL
 */
export function getGeneralHelpWhatsAppUrl(message?: string): string {
  const text = message || `*Assalam-o-Alaikum Luqman Fabrics!* 🌸\n\nI need assistance with choosing fabrics from your online store.`;
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
