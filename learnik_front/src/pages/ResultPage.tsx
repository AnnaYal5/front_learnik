import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultPage() {
  const navigate = useNavigate()
  const result = (useLocation().state as any)?.result

  return (
    <div className="container">
      <button className="link" onClick={() => navigate('/generate')}>Назад</button>
      <h2>Готовий конспект</h2>
      {result ? (
        <pre>{Array.isArray(result.summary) ? result.summary.join('\n') : result.summary}</pre>
      ) : (
        <p>Немає даних</p>
      )}
    </div>
  )
}
