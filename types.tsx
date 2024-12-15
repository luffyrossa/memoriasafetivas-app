// types.ts

// Definindo o tipo das telas no seu stack de navegação
export type RootStackParamList = {
    Home: undefined;  // A tela inicial não espera nenhum parâmetro
    FullText: { text: string };  // A tela de texto completo espera um parâmetro 'text' do tipo string
  };
  