import * as React from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Container, Sheet, Typography, IconButton } from '@mui/joy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link } from '~/common/components/Link';
import { NewsItems } from './news.data';
import { useMarkNewsAsSeen } from './news.hooks'; // Assuming the modified hook is in the same directory

export default function AppNews() {
  // state
  const [lastNewsIdx, setLastNewsIdx] = React.useState<number>(0);
  const [keyword, setKeyword] = React.useState<string>('');
  const markNewsAsSeen = useMarkNewsAsSeen(); // Using the modified hook

  // news selection
  const news = NewsItems.filter((_, idx) => idx <= lastNewsIdx);
  const firstNews = news[0] ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markNewsAsSeen(keyword); // Using the modified hook
  };

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

      {!!news && <Container disableGutters maxWidth='sm'>
        {news.map((item, idx) => {
          const firstCard = idx === 0;
          const hasCardAfter = news.length < NewsItems.length;
          const showExpander = hasCardAfter && (idx === news.length - 1);
          const addPadding = !firstCard || showExpander;
          return (
            <Card key={'news-' + idx} sx={{ mb: 2, minHeight: 32 }}>
              <CardContent sx={{ position: 'relative', pr: addPadding ? 4 : 0 }}>
                {!!item.text && <Typography component='div' level='body1'>
                  {item.text}
                </Typography>}

                {!!item.items && (item.items.length > 0) && <ul style={{ marginTop: 8, marginBottom: 8, paddingInlineStart: 32 }}>
                  {item.items.map((item, idx) => <li key={idx}>
                    <Typography component='div' level='body1'>
                      {item.text}
                    </Typography>
                  </li>)}
                </ul>}

                {!firstCard && (
                  <Typography level='body2' sx={{ position: 'absolute', right: 0, top: 0 }}>
                    {item.versionName}
                  </Typography>
                )}

                {showExpander && (
                  <IconButton
                    variant='plain' size='sm'
                    onClick={() => setLastNewsIdx(idx + 1)}
                    sx={{ position: 'absolute', right: 0, bottom: 0, mr: -1, mb: -1 }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Container>}
      
      <form onSubmit={handleSubmit}>
        <label>
          Entre com a palavra chave :
          <input 
            type="text" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
<div 
        className="_form_101" 
        dangerouslySetInnerHTML={{ 
          __html: `<script src="https://targetteal.activehosted.com/f/embed.php?id=101" type="text/javascript" charset="utf-8"></script>` 
        }} 
      />
      <Button variant='solid' color='neutral' size='lg' component={Link} href='/' noLinkStyle>
        Ok!
      </Button>
    </Sheet>
  );
}
