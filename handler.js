const getDogsTrustDogs = require('./services/dogsTrust.js');

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
    let dogs = await Promise.all([
      ...config.dogsTrust.breeds.map(async (breed) => {
        return getDogsTrustDogs(breed);
      }),
    ]);

    dogs = dogs.flat();
    console.log(dogs, dogs.length);
  };

  getDogs();
};
