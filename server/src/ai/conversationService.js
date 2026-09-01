const {
  getConversationHistory,
} = require("./aiConversationService");


const buildConversationContext = async ({
  conversationId,
  limit = 10,
}) => {

  const messages =
    await getConversationHistory({
      conversationId,
      limit,
    });


  if (!messages.length) {
    return "";
  }


  return messages
    .map((message) => {

      const role =
        message.sender === "user"
          ? "User"
          : "Assistant";

      return `${role}: ${message.content}`;

    })
    .join("\n\n");
};


module.exports = {
  buildConversationContext,
};