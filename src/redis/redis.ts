import { createClient, print } from 'redis';
const client = createClient();

client.on("error", function(error) {
  console.error(error);
});

client.set("key", "Success: you are connected redis-server!", print);
client.get("key", print);