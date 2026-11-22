import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client.js";

const TABLE = process.env.USERS_TABLE;

export const createUser = async (user) => {
  try {
    await db.send(
      new PutCommand({
        TableName: TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(username)",
      }),
    );
    return true;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") return false;
    throw err;
  }
};

export const getUserByUsername = async (username) => {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE,
      Key: { username },
    }),
  );
  return result.Item;
};
