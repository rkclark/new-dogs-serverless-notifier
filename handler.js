/* eslint-disable no-console */
const getDogsTrustDogs = require('./services/dogsTrust.js');
const { putItem } = require('./dynamoActions/index.js');
const { sendSMS } = require('./twilio/index.js');

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

  const dogs = await getDogs();

  await Promise.all(
    dogs.map(async (dog) => {
      try {
        await putItem(dog);
        console.log(`Inserted new dog ${dog.name} (id: ${dog.id})`);
        await sendSMS(`New ${dog.breed} "${dog.name}" found! ${dog.link}`);
      } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
          console.log(`Dog ${dog.name} (id: ${dog.id}) already exists.`);
        } else {
          console.error(err);
        }
      }
    }),
  );
};
