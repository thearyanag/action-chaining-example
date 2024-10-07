import { NextRequest, NextResponse } from "next/server";
import { ReactNode } from "react";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
} from "@solana/actions";
import { NextActionLink } from "@solana/actions-spec";
import { useSearchParams } from "next/navigation";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
import { getCompletedAction, getNextAction } from "@/app/helper";

export async function GET(req: NextRequest) {
  let response: ActionGetResponse = {
    type: "action",
    icon: `https://action-chaining-example.vercel.app/a.webp`,
    title: "Action A",
    description: "Action A",
    label: "Action A Label",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Submit A", // button text
          href: "/api/action?amount={amount}", // api endpoint
          parameters: [
            {
              name: "amount", // field name
              label: "Enter a custom SOL amount", // text input placeholder
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

// ensures cors
export const OPTIONS = GET;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { account: string; signature: string };

    const { searchParams } = new URL(req.url);
    // amount is just to show how to decide the next action
    const amount = searchParams.get("amount") as string;

    // stage is the stage of the action in the chain
    const stage = searchParams.get("stage") as string;

    if (!amount) {
      return new Response("Amount is required", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const sender = new PublicKey(body.account);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: new PublicKey("CRtPaRBqT274CaE5X4tFgjccx5XXY5zKYfLPnvitKdJx"),
        lamports: LAMPORTS_PER_SOL * 0,
      })
    );
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = sender;

    // stage is the stage of the action in the chain
    if (stage) {
      // can be any custom logic
      return NextResponse.json(
        await createPostResponse({
          fields: {
            type: "transaction",
            links: {
              next: getCompletedAction(stage),
            },
            transaction: tx,
            message: `Action ${stage} completed`,
          },
        }),
        {
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    const payload = await createPostResponse({
      fields: {
        type: "transaction",
        links: {
          // any condition to determine the next action
          next: amount === "1" ? getNextAction("b") : getNextAction("c"),
        },
        transaction: tx,
        message: "happy chaining",
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log("Error in POST /api/action", err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
