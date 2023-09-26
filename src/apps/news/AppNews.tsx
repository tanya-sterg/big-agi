import * as React from 'react';
import { Sheet, Typography, Container, Card, CardContent, IconButton } from '@mui/joy';
import { useMarkNewsAsSeen } from './news.hooks';

export default function AppNews() {
  // state
  const [lastNewsIdx, setLastNewsIdx] = React.useState<number>(0);
  const [keyword, setKeyword] = React.useState<string>('');
  const markNewsAsSeen = useMarkNewsAsSeen();

  // news selection

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markNewsAsSeen(keyword);
  };
const greyBlue = "#5a5a72"; 
  return (
    <Sheet variant='soft' invertedColors sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      flexGrow: 1,
      overflowY: 'auto',
      minHeight: 96,
      p: { xs: 3, md: 6 },
      gap: 4,
    }}>

      <Typography level='display2'>
        Updates - Novidades!
      </Typography>

      <Typography level='body1'>
        Não é mais necessário usar comandos! Assistentes mais inteligentes!
        Quando o limite de texto em um chat chegar ao máximo as mensagens mais antigas são apagadas, e você pode continuar conversando!
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={{ color: greyBlue }}>
          Entre com a palavra chave* :
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ backgroundColor: greyBlue, color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>

      <div>*Visite <b><a href="https://targetteal.com/pt/ia/" target='_blank'>targetteal.com</a></b> para obter a palavra chave</div>

    </Sheet>
  );
}

