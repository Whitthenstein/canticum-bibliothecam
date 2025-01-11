interface TranslationLanguageObject {
  Composer: string;
  Lyricist: string;
  pdfFile: string;
  musescoreFile: string;
  audioFile: string;

  biography: string;
  name: string;
  title: string;
  subtitle: string;
  composer_s: string;
  lyricist_s: string;
  home: string;
  author: string;
  authors: string;
  authorType: string;
  otherAuthors: string;
  song: string;
  songs: string;
  lyrics: string;
  settings: string;
  admin: string;
  details: string;
  audio: string;

  and: string;

  addAuthor: string;
  addSong: string;

  authorNameWarning: string;
  authorTypeSelectionWarning: string;

  songTitleWarning: string;
  songComposersWarning: string;
  otherAuthorCreditWarning: string;
  songPdfFileWarning: string;

  waiting: string;
  success: string;
  submit: string;
  addNew: string;

  songAddedTitle: string;
  songAddedDescription: string;
  authorAddedTitle: string;
  authorAddedDescription: string;
  authorEditedTitle: string;
  authorEditedDescription: string;
  authorHasNoSongs: string;
  searchAuthors: string;
  searchSongs: string;
  searchAuthorsAndSongs: string;
  writeNameToSelect: string;
  savingSong: string;
  waitForProcesses: string;
  savingPdfFile: string;
  savingMusescoreFile: string;
  savingAudioFile: string;
  savingSongInDatabase: string;
}

const ENGLISH: TranslationLanguageObject = {
  Composer: "Composer",
  Lyricist: "Lyricist",
  pdfFile: "PDF File",
  musescoreFile: "Musescore File",
  audioFile: "Audio File",

  biography: "Biography",
  name: "Name",
  title: "Title",
  subtitle: "Subtitle",
  composer_s: "Composer(s)",
  lyricist_s: "Lyricist(s)",
  home: "Home",
  author: "Author",
  authors: "Authors",
  authorType: "Author Type",
  otherAuthors: "Other Authors",
  song: "Song",
  songs: "Songs",
  lyrics: "Lyrics",
  settings: "Settings",
  admin: "Admin",
  details: "Details",
  audio: "Audio",

  and: "and",

  addAuthor: "Add Author",
  addSong: "Add Song",

  authorNameWarning: "Author's name should be at least 2 characters long.",
  authorTypeSelectionWarning: "You have to select at least 1 author type.",

  songTitleWarning: "Song title must be at least 2 characters long.",
  songComposersWarning: "Song needs to have at least one composer.",
  otherAuthorCreditWarning: "Insert this author's contribution to this song.",
  songPdfFileWarning: "Pdf file is mandatory.",

  waiting: "Waiting...",
  success: "Sucess!",
  submit: "Submit",
  addNew: "Add New",

  songAddedTitle: "Song added!",
  songAddedDescription: "was added to the songs list!",
  authorAddedTitle: "Author added!",
  authorAddedDescription: "was added to the authors list!",
  authorEditedTitle: "Author edited!",
  authorEditedDescription: "was edited!",
  authorHasNoSongs: "This author has no songs for now.",
  searchAuthors: "Authors...",
  searchSongs: "Songs...",
  searchAuthorsAndSongs: "Song, Author...",
  writeNameToSelect: "Write author name to select...",
  savingSong: "Saving song...",
  waitForProcesses: "Please wait for the following:",
  savingPdfFile: "Saving Pdf file...",
  savingMusescoreFile: "Saving Musescore file...",
  savingAudioFile: "Saving audio file...",
  savingSongInDatabase: "Saving song in database..."
};

const PORTUGUESE: TranslationLanguageObject = {
  Composer: "Compositor",
  Lyricist: "Letrista",
  pdfFile: "Ficheiro PDF",
  musescoreFile: "Ficheiro Musescore",
  audioFile: "Ficheiro Audio",

  biography: "Biografia",
  name: "Nome",
  title: "Título",
  subtitle: "Sub Título",
  composer_s: "Compositor(es)",
  lyricist_s: "Letrista(s)",
  home: "Início",
  song: "Música",
  songs: "Músicas",
  author: "Autor",
  authors: "Autores",
  authorType: "Tipo de Autor",
  otherAuthors: "Outros Autores",
  lyrics: "Letra",
  settings: "Definições",
  admin: "Administrador",
  details: "Detalhes",
  audio: "Áudio",

  and: "e",

  addAuthor: "Adicionar Autor",
  addSong: "Adicionar Música",
  addNew: "Adicionar Novo",

  authorNameWarning: "O nome do autor deve ter pelo menos 2 letras.",
  authorTypeSelectionWarning: "Tem de selecionar pelo menos um tipo de autor.",

  songTitleWarning: "O título deve ter pelo menos 2 letras.",
  songComposersWarning: "Deve inserir pelo menos 1 compositor.",
  otherAuthorCreditWarning: "Insira um contributo deste autor nesta música.",
  songPdfFileWarning: "Ficheiro pdf é obrigatório.",

  waiting: "À espera...",
  success: "Sucesso!",
  submit: "Submeter",

  songAddedTitle: "Música adicionada!",
  songAddedDescription: "foi adicionada à lista de músicas!",
  authorAddedTitle: "Autor adicionado!",
  authorAddedDescription: "foi adicionado à lista de autores!",
  authorEditedTitle: "Autor editado!",
  authorEditedDescription: "foi editado!",
  authorHasNoSongs: "Este autor não tem músicas por agora.",
  searchAuthors: "Autores...",
  searchSongs: "Músicas...",
  searchAuthorsAndSongs: "Música, Autor...",
  writeNameToSelect: "Escrever nome para selecionar..",
  savingSong: "A guardar a música...",
  waitForProcesses: "Por favor espere pelos seguintes processos",
  savingPdfFile: "A guardar ficheiro Pdf...",
  savingMusescoreFile: "A guardar ficheiro Musescore...",
  savingAudioFile: "A guardar ficheiro audio...",
  savingSongInDatabase: "A guardar música na base de dados..."
};

export const TRANSLATIONS = {
  pt: PORTUGUESE,
  eng: ENGLISH
};
