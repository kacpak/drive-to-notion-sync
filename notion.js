import 'dotenv/config';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTION_DATABASE_ID;

export const getAllDatabaseEntries = async () => {
  let entries = [];
  let start_cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id,
      start_cursor,
    });
    entries = entries.concat(response.results);
    if (response.has_more) {
      start_cursor = response.next_cursor;
    }
  } while (start_cursor);
  return entries;
};

export const createNewNotionDBEntry = async ({ link, title, date, tags }) => {
  await notion.pages.create({
    parent: {
      database_id,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Date: {
        date: {
          start: date,
        },
      },
      'Google Drive Link': {
        url: link,
      },
      Tags: {
        multi_select: tags.map((name) => ({ name })),
      },
    },
  });
};
