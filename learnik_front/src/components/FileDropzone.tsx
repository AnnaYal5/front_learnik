import { useRef } from 'react'

type Props = { onFileSelected: (file: File) => void }

export default function FileDropzone({ onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    onFileSelected(files[0])
  }

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
    >
      <p>Виберіть файл або перетягніть сюди</p>
      <small>PDF, DOCX або TXT • максимум 10MB</small>
      <button className="secondary" onClick={() => inputRef.current?.click()}>
        Завантажити файл
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
