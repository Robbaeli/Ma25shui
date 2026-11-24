import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
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

export const savePost = async (post) => {
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: post,
    }),
  );
};

export const deletePostById = async (id) => {
  await db.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { id },
    }),
  );
};
