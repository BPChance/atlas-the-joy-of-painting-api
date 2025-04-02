const csv = require('csv-parser');
const papa = require('papaparse');
const fs = require('fs');
const titleCase = require('title-case').titleCase;

const colorsUsed = 'The Joy Of Painting - Colors Used';
const subjectMatter = 'The Joy Of Painting - Subject Matter';
const episodeDates = 'The Joy Of Painting - Episode Dates';

function cleanData(fileName, outputFileName) {
  // read csv files
  const cleanedData = [];

  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      if (row.TITLE) {
        // remove triple quote and make lowercase
        row.TITLE = row.TITLE.replace(/^["']+|["']+$/g, '').toLowerCase();
        // capitalize first letter of each word in title
        row.TITLE = titleCase(row.TITLE);
      }
      cleanedData.push(row);
    })
    .on('end', () => {
      console.log(`${fileName} cleaned`);

      const csvOutput = papa.unparse(cleanedData);
      fs.writeFileSync(outputFileName, csvOutput);
      console.log(`cleaned data saved to ${outputFileName}`);
    });
}

cleanData(subjectMatter, 'subjectMatterCleaned.csv');
