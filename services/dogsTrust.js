const jsdom = require('jsdom');
const { v5: uuidv5 } = require('uuid');
const { oidNamespace } = require('../constants');

const { JSDOM } = jsdom;

const options = {
  includeNodeLocations: true,
};

module.exports = async function getDogsTrustDogs({
  name: breedName,
  id: breedId,
}) {
  let dogs = [];

  const getDogs = async (filterId, page = 1) => {
    const dom = await JSDOM.fromURL(
      `https://www.dogstrust.org.uk/rehoming/dogs/filters/~${filterId}~~~~n~~/page/${page}`,
      options,
    );
    const foundDogs = [
      ...dom.window.document.querySelectorAll("a[id*='lnkDog']"),
    ].map((node) => {
      const name = node
        .querySelector('h3')
        .textContent.replace('\n', '')
        .trim();

      return {
        link: node.href,
        name,
        breed: breedName,
        // Generate repeatable UUID for database
        id: uuidv5(`${node.href}_${name}`, oidNamespace),
      };
    });

    dogs = [...dogs, ...foundDogs];

    if (foundDogs.length > 0) {
      // Recursively move to next page of results if the current page contained dogs
      await getDogs(filterId, page + 1);
    }

    return foundDogs;
  };

  await getDogs(breedId);
  return dogs;
};
