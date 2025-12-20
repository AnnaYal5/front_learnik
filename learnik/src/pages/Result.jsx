import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultType, setResultType] = useState('');

  useEffect(() => {
    // Перевіряємо всі можливі результати
    const conspect = localStorage.getItem('conspectResult');
    const test = localStorage.getItem('testResult');
    const simplify = localStorage.getItem('simplifyResult');

    if (conspect) {
      setResult(conspect);
      setResultType('conspect');
    } else if (test) {
      setResult(test);
      setResultType('test');
    } else if (simplify) {
      setResult(simplify);
      setResultType('simplify');
    }

    setLoading(false);
  }, []);

  const handleDownload = async () => {
    if (!result) return;

    try {
      const payload = {
        title: `Результат-${new Date().getTime()}`,
        text: result,
        file_type: 'docx' // або 'pdf', 'txt'
      };

      const response = await fetch('https://d1ther.online/api/files/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Помилка при генерації файлу');
      const data = await response.json();

      // Завантажуємо файл
      const downloadResponse = await fetch(
        `https://d1ther.online/api/files/download/${data.file_id}/`
      );
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Помилка при завантаженні файлу: ' + err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Результат скопійовано в буфер обміну!');
  };

  const handleClear = () => {
    localStorage.removeItem('conspectResult');
    localStorage.removeItem('testResult');
    localStorage.removeItem('simplifyResult');
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <header className="header">
          <div className="logo">
            <div className="logo-icon">📖</div>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Learnik
            </span>
          </div>
        </header>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 40px' }}>
            <p>Завантаження результату...</p>
          </div>
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <>
        <header className="header">
          <div className="logo">
            <div className="logo-icon">📖</div>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              Learnik
            </span>
          </div>
        </header>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 40px' }}>
            <h2>Немає результату</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              Будь ласка, спочатку創 одну з форм для генерації
            </p>
            <button className="cta-button" onClick={() => navigate('/')}>
              На головну
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">📖</div>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Learnik
          </span>
        </div>
      </header>

      <div className="container">
        <div className="result-wrapper">
          <div className="result-header">
            <h1>
              {resultType === 'conspect' && 'Ваш конспект готовий'}
              {resultType === 'test' && 'Ваш тест готовий'}
              {resultType === 'simplify' && 'Спрощений текст готовий'}
            </h1>
          </div>

          <div className="result-actions">
            <button className="result-button result-button-primary" onClick={handleDownload}>
              📥 Завантажити як файл
            </button>
            <button className="result-button result-button-secondary" onClick={handleCopy}>
              📋 Копіювати текст
            </button>
            <button className="result-button result-button-tertiary" onClick={handleClear}>
              🔄 Створити новий
            </button>
          </div>

          <div className="result-content">
            <div
              className="result-text"
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </div>
        </div>
      </div>
    </>
  );
}