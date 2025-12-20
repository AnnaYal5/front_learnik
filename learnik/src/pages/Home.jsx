import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleCreateNotes = () => {
    navigate('/create-notes');
  };

  const handleGenerateTest = () => {
    navigate('/generate-test');
  };

  const handleSimplifyBook = () => {
    navigate('/simplify-book');
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">📖</div>
          Learnik
        </div>
      </header>

      <div className="container">
        <div className="hero">
          <div className="badge">
            <span className="sparkle">✨</span>
            AI-генератор конспектів
          </div>

          <h1>
            Створюй конспекти <span className="gradient-text">за лічені секунди</span>
          </h1>

          <p className="subtitle">
            Завантажите матеріали лекції або вставте текст — отримайте структурований конспект у потрібному форматі. Ідеальний помічник для студентів.
          </p>

          <div className="cta-buttons">
            <button className="cta-button" onClick={handleCreateNotes}>
              Створити конспект
              <span>›</span>
            </button>

            <button className="cta-button cta-button-secondary" onClick={handleGenerateTest}>
              Згенерувати тест
              <span>›</span>
            </button>

            <button className="cta-button cta-button-tertiary" onClick={handleSimplifyBook}>
              Спростити книгу
              <span>›</span>
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon icon-blue">
                📄
              </div>
              <h3 className="feature-title">Різні формати</h3>
              <p className="feature-description">
                Підтримка PDF, DOCX і TXT файлів
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-purple">
                ⚡
              </div>
              <h3 className="feature-title">Швидка обробка</h3>
              <p className="feature-description">
                AI генерує конспект за секунди
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-pink">
                💾
              </div>
              <h3 className="feature-title">Зручне збереження</h3>
              <p className="feature-description">
                Завантажте готовий конспект у зручному форматі
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}