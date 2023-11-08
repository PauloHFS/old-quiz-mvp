import { useState } from 'react';
import { z } from 'zod';

const schema = z.array(
  z.object({
    title: z.string().min(1),
    alternatives: z.array(z.string().min(1)),
    correctID: z.number().int().min(0),
  })
);

type QuestionFormData = z.infer<typeof schema>;

export const QuestionForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionFormData>([]);

  const [alternativa, setAlternativa] = useState<{
    title: string;
    correct: boolean;
  }>({
    title: '',
    correct: false,
  });
  const [alternativas, setAlternativas] = useState<string[]>([]);

  const handleAddAlternative = () => {
    setAlternativas(prev => [...prev, alternativa.title]);
    setAlternativa({ title: '', correct: false });
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { title, alternatives: alternativas, correctID: 0 },
    ]);
    setTitle('');
    setAlternativas([]);
  };

  return (
    <div className="border-2 border-black p-5">
      <h2>Questões</h2>
      <div>
        <label htmlFor="title">
          Título:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label htmlFor="alternatives" className="flex flex-col">
          Alternativas
          <div className="flex flex-col">
            <label htmlFor="alternative">
              Titulo da alternativa:
              <input
                type="text"
                value={alternativa.title}
                onChange={e => {
                  setAlternativa(prev => ({ ...prev, title: e.target.value }));
                }}
              />
            </label>
            <label htmlFor="correct">
              Correta?
              <input
                type="checkbox"
                checked={alternativa.correct}
                onChange={() => {
                  setAlternativa(prev => ({ ...prev, correct: !prev.correct }));
                }}
              />
            </label>
            <button type="button" onClick={handleAddAlternative}>
              Adicionar Alternativa
            </button>
          </div>
          <ul>
            {alternativas.map(alt => (
              <li key={alt}>
                {alt}
                <button type="button">Remover</button>
              </li>
            ))}
          </ul>
        </label>
        <button type="button" onClick={handleAddQuestion}>
          Adicionar Questão
        </button>
      </div>
      {questions.map(({ title, alternatives }) => (
        <div key={title}>
          <h3>{title}</h3>
          <ul>
            {alternatives.map(alt => (
              <li key={alt}>{alt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
