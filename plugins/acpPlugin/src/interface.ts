export interface AcpAgent {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  twitterHandle: string;
  offerings: {
    name: string;
    price: number;
  }[];
}

export enum AcpClusters {
  HEDGE_FUND = "hedge_fund",
  MEDIAHOUSE = "mediahouse",
}

export type AcpClusterOptions = AcpClusters | undefined;

export enum AcpJobPhases {
  REQUEST = 0,
  NEGOTIOATION = 1,
  TRANSACTION = 2,
  EVALUATION = 3,
  COMPLETED = 4,
  REJECTED = 5,
}

export enum AcpJobPhasesDesc {
  REQUEST = "request",
  NEGOTIOATION = "pending_payment",
  TRANSACTION = "in_progress",
  EVALUATION = "evaluation",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export interface AcpRequestMemo {
  id: number;
  createdAt: number;
}

export interface ITweet {
  type: "buyer" | "seller";
  tweetId: string;
  content: string;
  createdAt: number;
}

export interface AcpJob {
  jobId: number;
  desc: string;
  price: string;
  phase: AcpJobPhasesDesc;
  memo: AcpRequestMemo[];
  tweetHistory: ITweet[];
  lastUpdated: number;
}

export interface IDeliverable {
  type: "url" | "text";
  value: string;
}

export interface IInventory extends IDeliverable {
  jobId: number;
}

export interface AcpState {
  inventory: {
    aquired: IInventory[];
    produced: IInventory[];
  };
  jobs: {
    active: {
      asABuyer: AcpJob[];
      asASeller: AcpJob[];
    };
    completed: AcpJob[];
    cancelled: AcpJob[];
  };
}
