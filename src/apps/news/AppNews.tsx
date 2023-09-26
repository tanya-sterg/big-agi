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
       Novidades!
    </Typography>

<Typography level='body1'>
   <p>
        Essa é a versão 0.2 Beta dos nossos Assistentes de IA para Org Design. O acesso é gratuito e foi liberado para que possamos aprender junto com você.
   </p>
   <p>
        Queremos estreitar o contato para entender melhor suas necessidades e o uso diário desses assistentes. Por isso, para acessar agora é necessário preencher um formulário.
   </p>
   <p>
       <strong>Novidades da versão 0.2 Beta:</strong>
       <ul>
           <li>Não são mais necessários comandos! Assistentes mais intuitivos!</li>
           <li>O chat permite continuação da conversa mesmo após atingir o limite de texto, apagando mensagens mais antigas.</li>
       </ul>
   </p>
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

