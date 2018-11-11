async function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    let file_reader = new FileReader();
    file_reader.addEventListener('loadend', function(event) {
      try {
        resolve(JSON.parse(event.target.result));
      } catch (e) {
        reject("Impossible to read file: " + e);
      }
    });
    file_reader.addEventListener('error', function(error) {
      reject("Error when reading file: " + error);
    });
    file_reader.readAsText(file, 'utf-8');
  });
}

export default readJsonFile