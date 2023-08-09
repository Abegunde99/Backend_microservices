const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const { APP_SECRET , EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME, SHOPPING_BINDING_KEY} = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//message broker

//create channel
module.exports.CreateChannel = async (connection) => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
    return channel;
  } catch (error) {
    throw error;
  }

};

//publish message
module.exports.PublishMessage = async (channel, binding_key, message) => { 
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log('message has been sent from shopping service' + message)
  } catch (error) {
    throw error;
  }
};

//subscribe message
module.exports.SubscribeMessage = async (channel, service) => { 
  const appQueue = await channel.assertQueue(QUEUE_NAME);

  await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);

  await channel.consume(appQueue.queue, async (message) => {
    const { event, data } = JSON.parse(message.content.toString());
    console.log('received data to shopping service', SHOPPING_BINDING_KEY)
    await service.SubscribeEvents({ event, data });

    await channel.ack(message);
  });
};