import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimplifyBook() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    language: 'uk',
    style: 'casual',
    font: 'Arial',
    font_size: 12
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'font_size' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText('');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFile(null);
  };

  const extractTextFromFile = async (uploadedFile) => {
    const formDataObj = new FormData();
    formDataObj.append('file', uploadedFile);

    try {
      const response = await fetch('https://d1ther.online/api/files/upload/', {
        method: 'POST',
        body: formDataObj
      });

      if (!response.ok) throw new Error('Помилка при завантаженні файлу');
      const data = await response.json();
      return data.text;
    } catch (err) {
      throw new Error('Не вдалося прочитати файл: ' + err.message);
    }
  };

  const simplifyBook = async (textContent) => {
    try {
      const payload = {
        text: textContent,
        language: formData.language,
        style: formData.style,
        font: formData.font,
        font_size: formData.font_size
      };

      const response = await fetch('https://d1ther.online/api/ai/generate-book-analysis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Помилка при спрощенні тексту');
      const data = await response.json();
      return data.text;
    } catch (err) {
      throw new Error('Помилка AI: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let contentText = text;

      if (inputType === 'file' && file) {
        contentText = await extractTextFromFile(file);
      }

      if (!contentText.trim()) {
        throw new Error('Будь ласка, введіть текст або завантажте файл');
      }

      const result = await simplifyBook(contentText);
      
      // Очищення попередніх результатів
      localStorage.removeItem('conspectResult');
      localStorage.removeItem('testResult');
      
      localStorage.setItem('simplifyResult', result);
      navigate('/result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="form-wrapper">
          <h1>Спростити книгу</h1>
          <p className="subtitle">Виберіть текст або завантажте файл для спрощення</p>

          <form onSubmit={handleSubmit} className="ai-form">
            <div className="form-group">
              <label className="form-label">Тип вводу</label>
              <div className="input-type-tabs">
                <button
                  type="button"
                  className={`tab-button ${inputType === 'text' ? 'active' : ''}`}
                  onClick={() => setInputType('text')}
                >
                  Текст
                </button>
                <button
                  type="button"
                  className={`tab-button ${inputType === 'file' ? 'active' : ''}`}
                  onClick={() => setInputType('file')}
                >
                  Файл
                </button>
              </div>
            </div>

            {inputType === 'text' && (
              <div className="form-group">
                <label className="form-label">Текст матеріалу</label>
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Вставте текст книги для спрощення..."
                  className="form-textarea"
                  rows="8"
                  required
                />
              </div>
            )}

            {inputType === 'file' && (
              <div className="form-group">
                <label className="form-label">Завантажте файл</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="form-file"
                  required
                />
                <small>Підтримуються формати: PDF, DOCX, TXT</small>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Мова</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="uk">Українська</option>
                  <option value="en">Англійська</option>
                  <option value="ru">Російська</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Стиль</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  placeholder="Наприклад: розмовний, академічний, технічний..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Шрифт</label>
                <select
                  name="font"
                  value={formData.font}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Розмір шрифту</label>
                <input
                  type="number"
                  name="font_size"
                  value={formData.font_size}
                  onChange={handleInputChange}
                  min="8"
                  max="24"
                  className="form-input"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="form-submit-button"
            >
              {loading ? 'Обробка...' : 'Спростити текст'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}