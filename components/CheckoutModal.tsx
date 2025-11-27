import React, { useState } from 'react';
import { CartItem, OrderDetails } from '../types';
import { GOOGLE_SCRIPT_URL, WHATSAPP_NUMBER } from '../constants';
import { X, Send, CheckCircle, Banknote, QrCode, Loader2, MapPin, Copy, Check, MessageCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
}

type PaymentMethod = 'cod' | 'online';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onClearCart }) => {
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    phone: '',
    houseNo: '',
    area: '',
    locality: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [generatedWhatsAppLink, setGeneratedWhatsAppLink] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Updated UPI ID
  const upiId = "hmoinuddin84@oksbi"; 
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3D${upiId}%26pn%3DBLACKPANTHER%20Store%26am%3D${total}%26cu%3DINR`;

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderItems = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
      
      // Construct full address string
      const fullAddress = `${formData.houseNo}, ${formData.area}, ${formData.locality}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      
      const paymentStatus = paymentMethod === 'online' ? 'PAID ONLINE (Verify QR)' : 'Cash on Delivery';

      // 1. Construct WhatsApp Message
      const waMessage = `*🐯 NEW ORDER ALERT - BLACKPANTHER*
--------------------------------
*👤 Customer Details:*
Name: ${formData.fullName}
Phone: ${formData.phone}
Address: ${fullAddress}

*🛒 Order Summary:*
${cart.map(item => `• ${item.name} (x${item.quantity})`).join('\n')}

*💰 Total Amount:* ₹${total}
*💳 Payment:* ${paymentStatus}
--------------------------------
Please confirm dispatch timeline.`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      setGeneratedWhatsAppLink(whatsappUrl);

      // 2. Prepare Payload for Google Sheet/Docs
      const payload = {
        date: new Date().toISOString(),
        customerName: formData.fullName,
        phone: formData.phone,
        email: "hmoinuddin84@gmail.com", // Send to owner email if script supports it
        address: fullAddress,
        items: orderItems,
        totalAmount: total,
        paymentMethod: paymentStatus,
        status: 'New'
      };

      // 3. Send to Google Script (if configured)
      if (GOOGLE_SCRIPT_URL.includes("XXXXXXXX")) {
        console.warn("Google Script URL is not configured. Simulating backend success.");
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // We use 'no-cors' mode which is standard for Google Apps Script Web Apps from frontend
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      // 4. Success State & Auto-Redirect
      setSuccess(true);
      onClearCart();
      
      // Attempt to open WhatsApp immediately
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error("Order Error:", error);
      setErrorMsg("Connection failed. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
       <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full sm:max-w-2xl bg-panther-800 rounded-t-2xl sm:rounded-2xl shadow-2xl border-t sm:border border-panther-700 overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
        {success ? (
          <div className="p-8 md:p-12 flex flex-col items-center text-center animate-fade-in my-auto overflow-y-auto">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shrink-0">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Thank you, {formData.fullName}. Your order details have been saved and sent to our team.
              <br/><br/>
              <span className="text-yellow-400 text-sm">⚠️ If WhatsApp did not open automatically, please click the button below to complete your order.</span>
            </p>
            
            <a 
              href={generatedWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 mb-4 shadow-lg hover:shadow-green-500/20 transition-all"
            >
              <MessageCircle size={20} />
              Send Order Details on WhatsApp
            </a>

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm hover:underline"
            >
              Close and Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="flex flex-col h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="shrink-0 p-4 border-b border-panther-700 flex justify-between items-center bg-panther-900 z-10">
              <div className="flex items-center gap-2">
                <MapPin className="text-panther-accent" />
                <h2 className="text-xl font-bold text-white">Delivery Details</h2>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 scrollbar-thin scrollbar-thumb-panther-accent scrollbar-track-panther-900">
              
              {/* Personal Info */}
              <div className="space-y-3">
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Contact Information</h3>
                 <div className="grid grid-cols-1 gap-3">
                    <input 
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="Full Name (Required)"
                    />
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel" 
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="Phone Number (10 digits)"
                    />
                 </div>
              </div>

              {/* Address Info */}
              <div className="space-y-3">
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Shipping Address</h3>
                 
                 {/* Compact Grid for Mobile */}
                 <div className="grid grid-cols-2 gap-3">
                    <input 
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      type="text" 
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="Pincode"
                    />
                    <input 
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="State"
                    />
                    <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="City/District"
                    />
                    <input 
                      required
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="Locality"
                    />
                 </div>

                 <input 
                    required
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
                    type="text" 
                    className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                    placeholder="Flat, House no., Building, Apt"
                 />
                 
                 <input 
                    required
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    type="text" 
                    className="w-full bg-panther-900 border border-panther-700 rounded-lg p-3 text-white focus:border-panther-accent focus:outline-none placeholder-gray-500 text-sm"
                    placeholder="Area, Street, Sector, Village"
                 />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Payment Method</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        paymentMethod === 'cod' 
                        ? 'bg-panther-accent/10 border-panther-accent text-white' 
                        : 'bg-panther-900 border-panther-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Banknote size={20} className="mb-1" />
                      <span className="font-bold text-xs">Cash on Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        paymentMethod === 'online' 
                        ? 'bg-panther-accent/10 border-panther-accent text-white' 
                        : 'bg-panther-900 border-panther-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <QrCode size={20} className="mb-1" />
                      <span className="font-bold text-xs">Pay Online (QR)</span>
                    </button>
                 </div>
              </div>

              {/* Online Payment QR Display */}
              {paymentMethod === 'online' && (
                <div className="bg-white p-4 rounded-xl flex flex-col items-center border-2 border-panther-accent/50 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  
                  <h4 className="text-panther-900 font-extrabold text-base mb-3 text-center">Scan & Pay via UPI</h4>
                  
                  <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-100 mb-3">
                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 rounded-lg" />
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg mb-2 w-full max-w-xs justify-between border border-gray-200">
                    <span className="text-xs font-mono text-gray-700 font-bold truncate select-all">{upiId}</span>
                    <button 
                      type="button"
                      onClick={handleCopyUpi}
                      className="text-panther-accent hover:text-purple-700 p-1 transition-colors flex items-center justify-center"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center max-w-xs space-y-1">
                    <p>Accepted: GPay, PhonePe, Paytm</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                       <span className="font-bold text-panther-900 text-sm">Total: ₹{total}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Summary for COD */}
              {paymentMethod === 'cod' && (
                <div className="bg-panther-900 p-4 rounded-lg border border-panther-700 flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Total Payable</span>
                  <span className="text-xl font-bold text-panther-accent">₹{total}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
                  {errorMsg}
                </div>
              )}
              
              {/* Spacer to ensure last item is not covered by footer in some browsers */}
              <div className="h-4"></div>
            </div>

            {/* Footer - Fixed */}
            <div className="shrink-0 p-4 border-t border-panther-700 bg-panther-800 z-10">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-panther-accent hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Confirm & Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;