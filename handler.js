/* eslint-disable no-console */
const getDogsTrustDogs = require('./services/dogsTrust.js');
const { putItem } = require('./dynamoActions/index.js');

module.exports.scrapeDogs = async () => {
  const config = {
    dogsTrust: {
      breeds: [
        { name: 'Border Collie', id: 269 },
        { name: 'Dobermann', id: 277 },
      ],
    },
  };

  const getDogs = async () => {
    let results = await Promise.all([
      ...config.dogsTrust.breeds.map(async (breed) => {
        return getDogsTrustDogs(breed);
      }),
    ]);

    results = results.flat();
    return results;
  };

  const dogs = getDogs();

  (await dogs).forEach(async (dog) => {
    try {
      await putItem(dog);
      console.log(`Inserted new dog ${dog.name} (id: ${dog.id})`);
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        console.log(`Dog ${dog.name} (id: ${dog.id}) already exists.`);
      } else {
        console.error(err);
      }
    }
  });
};
