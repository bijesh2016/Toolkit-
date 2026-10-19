import React, { useState } from 'react';
import { Receipt, Plus, Trash2, Printer, Download, Sparkles } from 'lucide-react';
import { convertToNprWords } from '../../../../Backend/src/utils/numberToWords.js';

export default function NepaliInvoice({ onShowToast }) {
  const [businessName, setBusinessName] = useState('Bijesh Solutions Pvt. Ltd.');
  const [businessPan, setBusinessPan] = useState('601234567');
  const [businessAddress, setBusinessAddress] = useState('Putalisadak, Kathmandu, Nepal');
  
  const [clientName, setClientName] = useState('Himalayan Tech Enterprises');
  const [clientPan, setClientPan] = useState('609876543');
  const [clientAddress, setClientAddress] = useState('Pokhara, Kaski, Nepal');

  const [invoiceNo, setInvoiceNo] = useState('BS-2081-0042');
  const [invoiceDateBs, setInvoiceDateBs] = useState('2081-07-01');

  const [items, setItems] = useState([
    { id: 1, desc: 'Web Application Development Services', qty: 1, rate: 85000 },
    { id: 2, desc: 'Cloud Server Setup & Maintenance', qty: 2, rate: 12500 }
  ]);

  const [discountPercent, setDiscountPercent] = useState(5);
  const [applyVat, setApplyVat] = useState(true);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), desc: 'New Service / Product Item', qty: 1, rate: 5000 }
    ]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, val) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatAmount = applyVat ? taxableAmount * 0.13 : 0;
  const grandTotal = taxableAmount + vatAmount;

  const words = convertToNprWords(grandTotal);

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('Opening print dialog for invoice...');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Configuration & Form (Hidden on Print) */}
      <div className="no-print p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Nepal IRD Standard Tax Invoice Generator</h3>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seller Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Business Details</h4>
            <input
              type="text"
              placeholder="Business Name"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="PAN / VAT Number"
                value={businessPan}
                onChange={e => setBusinessPan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                placeholder="Address"
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Billed To (Customer)</h4>
            <input
              type="text"
              placeholder="Customer / Company Name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Customer PAN (Optional)"
                value={clientPan}
                onChange={e => setClientPan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                placeholder="Customer Address"
                value={clientAddress}
                onChange={e => setClientAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={e => setInvoiceNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Date (BS)</label>
            <input
              type="text"
              value={invoiceDateBs}
              onChange={e => setInvoiceDateBs(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Discount (%)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={e => setDiscountPercent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={applyVat}
                onChange={e => setApplyVat(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>Apply 13% VAT (कर थप गर्ने)</span>
            </label>
          </div>
        </div>

        {/* Dynamic Item list editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Line Items</h4>
            <button
              onClick={addItem}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <span className="text-xs text-slate-500 w-5">{index + 1}.</span>
              <input
                type="text"
                value={item.desc}
                onChange={e => updateItem(item.id, 'desc', e.target.value)}
                placeholder="Description"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <input
                type="number"
                value={item.qty}
                onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                placeholder="Qty"
                className="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
              />
              <input
                type="number"
                value={item.rate}
                onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                placeholder="Rate"
                className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
              />
              <span className="text-xs text-slate-300 w-24 text-right font-mono">
                {(item.qty * item.rate).toLocaleString()}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div className="p-8 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-2xl font-sans print-card">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">{businessName}</h2>
            <p className="text-xs text-slate-600 mt-1">{businessAddress}</p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">PAN / VAT No: {businessPan}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold uppercase tracking-wider text-slate-900 block">TAX INVOICE</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">कर बिजक</span>
            <p className="text-xs text-slate-600 mt-2">Inv No: <strong>{invoiceNo}</strong></p>
            <p className="text-xs text-slate-600">Date (BS): <strong>{invoiceDateBs}</strong></p>
          </div>
        </div>

        {/* Client Address */}
        <div className="py-5 flex justify-between items-start border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Billed To (ग्राहक):</span>
            <h4 className="font-bold text-slate-900 text-sm mt-0.5">{clientName}</h4>
            <p className="text-xs text-slate-600">{clientAddress}</p>
          </div>
          {clientPan && (
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Buyer PAN:</span>
              <p className="text-xs font-semibold text-slate-900">{clientPan}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-xs my-6">
          <thead>
            <tr className="border-b-2 border-slate-800 font-bold text-slate-800">
              <th className="py-2.5 w-10">S.N.</th>
              <th className="py-2.5">Description (विवरण)</th>
              <th className="py-2.5 text-right w-16">Qty</th>
              <th className="py-2.5 text-right w-24">Rate (रू)</th>
              <th className="py-2.5 text-right w-28">Amount (रू)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((it, idx) => (
              <tr key={it.id}>
                <td className="py-3 text-slate-500">{idx + 1}</td>
                <td className="py-3 font-medium text-slate-900">{it.desc}</td>
                <td className="py-3 text-right">{it.qty}</td>
                <td className="py-3 text-right">{Number(it.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 text-right font-semibold">{(it.qty * it.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary */}
        <div className="flex justify-between items-start pt-4 border-t-2 border-slate-800">
          <div className="max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">In Words (अक्षरेपी):</span>
            <p className="text-xs font-semibold text-slate-800 mt-1 italic">
              {words.english}
            </p>
            <p className="text-xs font-devanagari text-slate-800 mt-0.5">
              {words.nepali}
            </p>
          </div>

          <div className="w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Sub Total:</span>
              <span className="font-semibold text-slate-900">रू {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount ({discountPercent}%):</span>
                <span className="font-semibold text-rose-600">- रू {discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxable Amount:</span>
              <span className="font-semibold text-slate-900">रू {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {applyVat && (
              <div className="flex justify-between text-slate-600">
                <span>13% VAT:</span>
                <span className="font-semibold text-slate-900">रू {vatAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-900">
              <span>Grand Total:</span>
              <span>रू {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-16 text-xs text-slate-700">
          <div className="text-center">
            <div className="border-t border-slate-400 w-44 pt-1 font-medium">Customer's Signature</div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 w-44 pt-1 font-medium">Authorized Signature</div>
            <p className="text-[10px] text-slate-500 mt-0.5">{businessName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
