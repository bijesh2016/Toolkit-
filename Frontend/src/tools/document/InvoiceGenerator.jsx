import React, { useState } from 'react';
import { DollarSign, Printer, Plus, Trash2 } from 'lucide-react';

export default function InvoiceGenerator({ onShowToast }) {
  const [currency, setCurrency] = useState('$');
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-101');
  const [senderName, setSenderName] = useState('Bijesh Digital Agency');
  const [senderEmail, setSenderEmail] = useState('billing@bijeshsharam.com.np');
  const [clientName, setClientName] = useState('Acme Global Corp');
  const [clientEmail, setClientEmail] = useState('accounts@acme.com');

  const [items, setItems] = useState([
    { id: 1, desc: 'Web Platform Architecture & Development', qty: 40, rate: 65 },
    { id: 2, desc: 'API Integration & Cloud Deployment', qty: 15, rate: 75 }
  ]);

  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const discountAmount = (subtotal * (Number(discount) || 0)) / 100;
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxable * (Number(taxRate) || 0)) / 100;
  const total = taxable + taxAmount;

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), desc: 'Service / Item', qty: 1, rate: 100 }]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, val) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('Opening invoice print layout...');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editor Controls */}
      <div className="no-print p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Global Invoice Maker</h3>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="$">$ USD</option>
              <option value="NPR">NPR रू</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="₹">₹ INR</option>
            </select>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From (Your Business)"
            value={senderName}
            onChange={e => setSenderName(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="To (Client Name)"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        {/* Dynamic Items */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">Line Items:</span>
            <button
              onClick={addItem}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          {items.map(item => (
            <div key={item.id} className="flex gap-2 items-center">
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
                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
              />
              <span className="text-xs font-mono text-slate-300 w-20 text-right">
                {currency}{(item.qty * item.rate).toFixed(2)}
              </span>
              <button onClick={() => removeItem(item.id)} className="p-1 text-slate-500 hover:text-rose-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div className="p-10 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-2xl font-sans max-w-4xl mx-auto print-card">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">{senderName}</h1>
            <p className="text-xs text-slate-600 mt-1">{senderEmail}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600 block">INVOICE</span>
            <span className="text-xs text-slate-600 mt-1 block">#{invoiceNo}</span>
          </div>
        </div>

        <div className="py-6 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Billed To:</span>
          <h3 className="font-bold text-sm text-slate-900 mt-0.5">{clientName}</h3>
          <p className="text-xs text-slate-600">{clientEmail}</p>
        </div>

        <table className="w-full text-left text-xs my-6">
          <thead>
            <tr className="border-b-2 border-slate-800 font-bold text-slate-800">
              <th className="py-2.5">Item Description</th>
              <th className="py-2.5 text-right w-16">Qty</th>
              <th className="py-2.5 text-right w-24">Rate</th>
              <th className="py-2.5 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map(it => (
              <tr key={it.id}>
                <td className="py-3 font-medium text-slate-900">{it.desc}</td>
                <td className="py-3 text-right">{it.qty}</td>
                <td className="py-3 text-right">{currency}{Number(it.rate).toFixed(2)}</td>
                <td className="py-3 text-right font-bold">{currency}{(it.qty * it.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pt-4 border-t-2 border-slate-800">
          <div className="w-64 space-y-2 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({taxRate}%):</span>
              <span className="font-semibold text-slate-900">{currency}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-900">
              <span>Total Balance Due:</span>
              <span className="text-indigo-600">{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
