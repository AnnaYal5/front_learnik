import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="container">
      <h1>AI-генератор конспектів</h1>
      <p>Створюй конспекти за лічені секунди. Завантажте матеріали лекції або вставте текст — отримайте структурований конспект.</p>
      <button className="primary" onClick={() => navigate('/generate')}>
        Створити конспект
      </button>
    </div>
  )
}
