import { getAllFilesFromFolder } from './googleDrive.js';
import { createNewNotionDBEntry, getAllDatabaseEntries } from './notion.js';

const tags = [
  { name: 'EKG', pattern: /EKG/ },
  { name: 'MRI', pattern: /MRI|rezonans|\bRM\b/ },
  { name: 'USG', pattern: /USG/ },
  { name: 'Oczy', pattern: /okul|soczewki/ },
  { name: 'Serce', pattern: /EKG|serc/ },
  { name: 'Plecy', pattern: /kr[eę]gos/ },
  { name: 'Brzuch', pattern: /gastro/ },
];

const getTagsFromName = (name) =>
  tags.filter((tag) => tag.pattern.test(name)).map((tag) => tag.name);

console.log('Fetching files from Google Drive...');
const allFiles = await getAllFilesFromFolder();
const filePattern =
  /(?<year>\d\d\d\d)-(?<month>\d\d)-(?<day>\d\d) (?<title>.*)/;
const preparedFiles = allFiles.map((file) => {
  const match = file.name.match(filePattern);
  if (!match) {
    console.warn(
      `File doesn't conform to naming convention and will be skipped`,
      file
    );
    return false;
  }
  const { title, year, month, day } = match.groups;
  const date = `${year}-${month}-${day}`;
  return {
    link: file.webViewLink,
    title: title.replace(/\.pdf$/, ''),
    date,
    tags: getTagsFromName(title),
  };
});
console.log('Fetching files from Google Drive... [DONE]');

console.log('Filtering Google Drive results with files already in Notion...');
const getAlreadyExistingDocumentPages = async () => {
  const entries = await getAllDatabaseEntries();
  return entries.map((page) => page.properties['Google Drive Link'].url);
};
const filesAlreadyInNotion = await getAlreadyExistingDocumentPages();
const filteredFiles = preparedFiles.filter(
  (file) => !filesAlreadyInNotion.includes(file.link)
);

console.log(
  'Filtering Google Drive results with files already in Notion... [DONE]'
);

console.log('Creating new pages in notion...');
for (const file of filteredFiles) {
  await createNewNotionDBEntry(file);
}
console.log('Creating new pages in notion... [DONE]');
