type Payload = { text: string; file: File | null; style: string }

export async function generateSummary({ text, file, style }: Payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: `Тестовий конспект\nСтиль: ${style}\nТекст: ${text || 'Файл завантажено'}`,
        style,
        createdAt: new Date().toISOString(),
      })
    }, 1000)
  })
}
