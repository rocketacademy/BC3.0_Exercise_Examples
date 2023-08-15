const { readFile } = require('fs/promises')

const getSightings = async () => {
  // Retrieve sightings.json file contents as string
  const sightings = await readFile("./sightings.json", "utf8");
  // Return sightings as an object
  return JSON.parse(sightings);
};


module.exports = {
  getSightings
}
