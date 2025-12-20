import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateNotes() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    words_count: 500,
    language: 'uk',
    complexity: 'middle',
    style: 'academic',
    font: 'Arial',
    font_size: 12
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'words_count' || name === 'font_size' ? parseInt(value) : value
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

  const generateConspect = async (textContent) => {
    try {
      const payload = {
        topic: formData.topic || 'Конспект',
        text: textContent,
        words_count: formData.words_count,
        language: formData.language,
        complexity: formData.complexity,
        style: formData.style,
        font: formData.font,
        size_font: formData.font_size
      };

      const response = await fetch('https://d1ther.online/api/ai/generate-conspect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Помилка при генерації конспекту');
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

      const result = await generateConspect(contentText);
      
      // Очищення попередніх результатів
      localStorage.removeItem('testResult');
      localStorage.removeItem('simplifyResult');
      
      // Збереження результату та перенаправлення на сторінку результату
      localStorage.setItem('conspectResult', result);
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
          <h1>Створити конспект</h1>
          <p className="subtitle">Виберіть текст або завантажте файл для генерації конспекту</p>

          <form onSubmit={handleSubmit} className="ai-form">
            {/* Input Type Selection */}
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

            {/* Text Input */}
            {inputType === 'text' && (
              <div className="form-group">
                <label className="form-label">Текст матеріалу</label>
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Вставте текст лекції..."
                  className="form-textarea"
                  rows="8"
                  required
                />
              </div>
            )}

            {/* File Input */}
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

            {/* Topic */}
            <div className="form-group">
              <label className="form-label">Тема конспекту</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Вкажіть тему (необов'язково)"
                className="form-input"
              />
            </div>

            {/* Settings Grid */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Кількість слів</label>
                <input
                  type="number"
                  name="words_count"
                  value={formData.words_count}
                  onChange={handleInputChange}
                  min="100"
                  max="5000"
                  className="form-input"
                />
              </div>

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
                <label className="form-label">Складність</label>
                <select
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="easy">Легка</option>
                  <option value="middle">Середня</option>
                  <option value="hard">Складна</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Стиль</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="academic">Академічний</option>
                  <option value="casual">Розмовний</option>
                  <option value="technical">Технічний</option>
                </select>
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
              {loading ? 'Генерування...' : 'Створити конспект'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}