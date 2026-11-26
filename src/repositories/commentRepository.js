import {
  BatchWriteCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { db } from "./client.js";

const TABLE = process.env.COMMENTS_TABLE;

export const saveComment = async (comment) => {
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: comment,
    }),
  );
};

export const getCommentsByPostId = async (postId) => {
  const comments = [];
  let lastKey;

  do {
    const result = await db.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "postId = :postId",
        ExpressionAttributeValues: { ":postId": postId },
        ExclusiveStartKey: lastKey,
      }),
    );
    comments.push(...(result.Items ?? []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return comments;
};

export const deleteCommentsByPostId = async (postId) => {
  const comments = await getCommentsByPostId(postId);

  for (let i = 0; i < comments.length; i += 25) {
    const batch = comments.slice(i, i + 25);

    await db.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE]: batch.map((comment) => ({
            DeleteRequest: {
              Key: { postId: comment.postId, createdAt: comment.createdAt },
            },
          })),
        },
      }),
    );
  }
};
