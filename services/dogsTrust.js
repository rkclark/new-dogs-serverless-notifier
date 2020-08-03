const jsdom = require('jsdom');

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
    const newDogs = [
      ...dom.window.document.querySelectorAll("a[id*='lnkDog']"),
    ].map((node) => {
      return {
        link: node.href,
        name: node.querySelector('h3').textContent.replace('\n', '').trim(),
        breed: breedName,
      };
    });

    dogs = [...dogs, ...newDogs];

    if (newDogs.length > 0) {
      // Recursively move to next page of results if the current page contained dogs
      await getDogs(filterId, page + 1);
    }

    return newDogs;
  };

  await getDogs(breedId);
  return dogs;
};
