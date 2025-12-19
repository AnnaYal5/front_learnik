import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileDropzone from '../components/FileDropzone'
import { generateSummary } from "../api/client";

export default function NoteGenerator() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [style, setStyle] = useState('short')

  const handleSubmit = async () => {
    const data = await generateSummary({ text, file, style })
    navigate('/result', { state: { result: data } })
  }

  return (
    <div className="container">
      <button className="link" onClick={() => navigate('/')}>Повернутися на головну</button>
      <h2>Створити конспект</h2>
      <textarea
        placeholder="Вставте текст лекції..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <div style={{ margin: '12px 0' }}>
        <label>
          <input type="radio" value="short" checked={style === 'short'} onChange={(e) => setStyle(e.target.value)} />
          Короткий
        </label>{' '}
        <label>
          <input type="radio" value="structured" checked={style === 'structured'} onChange={(e) => setStyle(e.target.value)} />
          Структурований
        </label>{' '}
        <label>
          <input type="radio" value="bulleted" checked={style === 'bulleted'} onChange={(e) => setStyle(e.target.value)} />
          З маркерами
        </label>
      </div>
      <FileDropzone onFileSelected={setFile} />
      {file && <div className="muted">Обрано: {file.name}</div>}
      <button className="primary" onClick={handleSubmit}>Згенерувати конспект</button>
    </div>
  )
}
