'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Transaction } from '@/types';
import { InputField, Card } from '@/components/ui';
import * as Icons from '../ui/Icons';

interface AddTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isScanning, setIsScanning] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  // Client-side Image Compression (Reduces 5MB photo to ~150KB for fast AI scanning)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Output as compressed JPEG (60% quality is perfect for AI OCR)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    try {
      // Compress the image before sending to avoid Vercel 4.5MB payload limit
      const base64 = await compressImage(file);
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        // Success: Auto-fill fields
        if (data.total) setAmount(data.total.toString());
        if (data.category) setCategory(data.category);
        if (data.merchant || data.description) {
          setDescription(data.merchant || data.description);
        }
      }
    } catch (err) {
      console.error("Scanning failed:", err);
      alert("AI scanning failed. Please try manual entry.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const categories = [
    { name: 'Food', icon: <Icons.FoodIcon />, color: '#FF9F43' },
    { name: 'Transport', icon: <Icons.CarIcon />, color: '#54A0FF' },
    { name: 'Shopping', icon: <Icons.CartIcon />, color: '#EE5253' },
    { name: 'Bill', icon: <Icons.FileTextIcon />, color: '#10AC84' },
    { name: 'Health', icon: <Icons.HospitalIcon />, color: '#FF6B6B' },
    { name: 'Other', icon: <Icons.SparklesIcon />, color: '#576574' },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!amount) return;
    
    // Logic for saving...
    console.log('Saving transaction:', { amount, category, description, date, type });
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 4px', position: 'relative' }}>
      {/* Hidden File Input for Native Camera/Gallery */}
      <input 
        type="file" 
        accept="image/*" 
        // Removed capture="environment" so users can choose between Camera and Gallery
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      {/* AI Scan Option */}
      <button 
        onClick={handleScanClick}
        disabled={isScanning}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontWeight: 700,
          fontSize: '0.9375rem',
          boxShadow: '0 8px 20px rgba(30, 27, 75, 0.2)',
          cursor: isScanning ? 'not-allowed' : 'pointer',
          opacity: isScanning ? 0.8 : 1,
          transition: 'transform 0.2s',
          transform: isScanning ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>{isScanning ? <Icons.HourglassIcon /> : <Icons.CameraIcon />}</span>
        {isScanning ? 'AI Analyzing Receipt...' : 'Scan Receipt (Auto-Fill)'}
      </button>

      {/* Visual Amount Display */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          color: 'var(--text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '4px'
        }}>
          {type === 'expense' ? 'Spend Amount' : 'Income Amount'}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)', opacity: 0.5 }}>Rp</span>
          <input
            ref={amountInputRef}
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              border: 'none',
              outline: 'none',
              background: 'none',
              width: '200px',
              textAlign: 'left',
              letterSpacing: '-0.02em'
            }}
          />
        </div>
      </div>

      {/* Quick Category Grid - TAP 1 */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 8px',
                borderRadius: '16px',
                border: '1.5px solid',
                borderColor: category === cat.name ? 'var(--primary-color)' : 'transparent',
                backgroundColor: category === cat.name ? 'rgba(79, 70, 229, 0.05)' : 'var(--surface-secondary)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: category === cat.name ? 'var(--primary-color)' : 'var(--text-main)' 
              }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Metadata Section (Note & Date) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          placeholder="What was this for?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-main)',
            backgroundColor: 'var(--surface-color)',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setType('expense')}
              style={{ 
                fontSize: '0.6875rem', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '6px',
                backgroundColor: type === 'expense' ? 'var(--danger-color)' : 'var(--surface-secondary)',
                color: type === 'expense' ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              Expense
            </button>
            <button 
              onClick={() => setType('income')}
              style={{ 
                fontSize: '0.6875rem', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '6px',
                backgroundColor: type === 'income' ? 'var(--success-color)' : 'var(--surface-secondary)',
                color: type === 'income' ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              Income
            </button>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON - TAP 2 */}
      <button
        onClick={handleSubmit}
        disabled={!amount || !category}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: '20px',
          backgroundColor: amount && category ? 'var(--primary-color)' : '#E5E7EB',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 800,
          border: 'none',
          cursor: amount && category ? 'pointer' : 'not-allowed',
          boxShadow: amount && category ? '0 10px 25px rgba(79, 70, 229, 0.25)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: amount && category ? 'scale(1)' : 'scale(0.98)'
        }}
      >
        {amount && category ? 'Add Transaction' : 'Enter Details'}
      </button>
    </div>
  );
}

