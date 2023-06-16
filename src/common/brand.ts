/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md             all over
 *  - package.json          app-slug and version
 *  - public/manifest.json  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  // Name: 'big-AGI',
  // UpperName: 'BIG-AGI',
  Title: {
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'Target Teal',
  },
  Meta: {
    SiteName: 'Target Teal',
    Title: 'Assistentes de Ia para Org Design',
    Description: 'Assistentes de IA para apoiar o seu trabalho com Org Design',
    Keywords: 'artificial general intelligence, org design, agi, openai, gpt-4, ai personas, code execution, pdf import, voice i/o, ai chat, artificial intelligence',
    ThemeColor: '#434356',
    TwitterSite: '@targetteal',
  },
  URIs: {
    // Slug: 'big-agi',
    Home: 'https://targetteal.com',
    CardImage: 'https://targetteal.com/wp-content/uploads/./logo-novo-quadrado.png',
    OpenRepo: 'https://targetteal.com',
    SupportInvite: 'https://discord.gg/sbKUY9Wv4C',
  },
};