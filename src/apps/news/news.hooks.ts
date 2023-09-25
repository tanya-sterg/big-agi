import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppStateStore } from '~/common/state/store-appstate'; // Certifique-se de que o caminho do import está correto

function KeywordForm() {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const { push } = useRouter();
  const setAccessGranted = useAppStateStore(state => state.setAccessGranted); // Certifique-se de que setAccessGranted está definido corretamente no seu store

  const handleSubmit = (event) => {
    event.preventDefault();

    if (keyword === 'tt-ai-thebest') {
      setAccessGranted(true);
      push('/another-page').then(() => null);
    } else {
      setError('Palavra-chave incorreta. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="keyword">Digite a palavra-chave:</label>
      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit">Enviar</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default KeywordForm;
