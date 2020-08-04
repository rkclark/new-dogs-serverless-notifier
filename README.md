# New Dogs Serverless Notifier

I'm hoping to adopt a border collie or dobermann from the Dogs Trust rescue centre here in the UK. Unfortunately their website doesn't allow you to subscribe to any notifications about new dogs, so I decided to make my own solution!

This project contains a serverless (AWS Lambda) function that will check for new border collies or dobermanns on a set schedule (every two hours at time of writing). If a new dog is found, it will send an SMS notification with a link to the dog to a configured phone number via Twilio.

## How it works

- AWS Lambda is triggered by schedule.
- The Dogs Trust website is scraped with JSDOM and an array of all border collies and dobermanns is created. It will recursively scrape through all paginated results until there are no more pages.
- Each dog has a repeatable uuid generated for it using its name and dogs trust web link.
- Each dog is inserted in an DynamoDB table, but only if its (repeatable) uuid does not already exist.
- Based on the above, only new dogs are successfully inserted into the DB. For each successful insertion, an SMS is sent to the configured phone number via Twilio containg the dog's breed, name and web link. :muscle:

