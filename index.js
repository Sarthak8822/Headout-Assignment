const express = require('express');
const fs = require('fs');
const util = require('util');
const axios = require('axios');

const app = express();
const port = 8080;

const chunkSize = 1024 * 1024; // 1MB chunk size

const readFileAsync = util.promisify(fs.readFile);
const readStreamAsync = util.promisify(fs.createReadStream);

app.get('/data', async (req, res) => {
  const fileName = req.query.n;
  const lineNumber = req.query.m;

  if (!fileName) {
    return res.status(400).send('File name (n) is required.');
  }

  const filePath = `/tmp/data/${fileName}.txt`;

  try {
    if (lineNumber) {
      // Read specific line
      const line = await getLine(filePath, lineNumber);
      res.send(line);
    } else {
      // Read entire file in chunks
      await readAndSendFileInChunks(filePath, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to get a specific line from a file
async function getLine(filePath, lineNumber) {
  const data = (await readFileAsync(filePath, 'utf-8')).split('\n');
  return data[lineNumber - 1] || '';
}

// Function to read and send a file in chunks
async function readAndSendFileInChunks(filePath, res) {
	const fileStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
  
	return new Promise((resolve, reject) => {
	  fileStream.on('data', async (chunk) => {
		if (!res.write(chunk)) {
		  fileStream.pause();
		  res.once('drain', () => {
			fileStream.resume();
			resolve();
		  });
		}
	  });
  
	  fileStream.on('end', () => {
		res.end();
		resolve();
	  });
  
	  fileStream.on('error', (error) => {
		reject(error);
	  });
	});
  }
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
