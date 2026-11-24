import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./client.js";

const TABLE = process.env.POSTS_TABLE;

export const getAllPosts = async () => {
  const posts = [];
  let lastKey;

  do {
    const result = await db.send(
      new ScanCommand({
        TableName: TABLE,
        ExclusiveStartKey: lastKey,
      }),
    );
    posts.push(...(result.Items ?? []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return posts;
};

export const getPostById = async (id) => {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE,
      Key: { id },
    }),
  );
  return result.Item;
};
