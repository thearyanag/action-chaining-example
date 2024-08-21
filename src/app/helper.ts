import { NextActionLink } from "@solana/actions-spec";

// just a helper function to get the completed action at final stage [ last action in the chain ]
export const getCompletedAction = (stage: string): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `Action ${stage} completed`,
      icon: `https://action-chaining-example.vercel.app/${stage}.webp`,
      label: `Action ${stage} Label`,
      title: `Action ${stage} completed`,
      type: "completed",
    },
  };
};

export const getNextAction = (stage: string): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `Action ${stage}`,
      icon: `https://action-chaining-example.vercel.app/${stage}.webp`,
      label: `Action ${stage} Label`,
      title: `Action ${stage}`,
      type: "action",
      links: {
        actions: [
          {
            label: `Submit ${stage}`, // button text
            href: `/api/action?amount={amount}&stage=${stage}`, // api endpoint
            parameters: [
              {
                name: "amount", // field name
                label: "Enter a custom SOL amount", // text input placeholder
              },
            ],
          },
        ],
      },
    },
  };
};
