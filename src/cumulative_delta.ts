import * as api from "kucoin-node-api";

const config = {
  environment: "live",
};

api.init(config);

export type Trade = {
  sequence: string;
  price: string;
  size: string;
  side: "buy" | "sell";
  time: number;
};

export type ApiTradesHistoryResult = {
  code: number;
  data: Trade[];
};

type TradesDelta = {
  status: number;
  message: string;
};

class PairNotFoundError extends Error {}

export async function calculateTradesDelta(
  pairSymbol: string
): Promise<TradesDelta> {
  try {
    const result: ApiTradesHistoryResult = await api.getTradeHistories(
      pairSymbol
    );
    if (result.data.length === 0) {
      throw new PairNotFoundError(
        `${pairSymbol} trading pair doesn't exist on Kucoin. Try reversing the two coins, if it still doesn't work, then this pair isn't listed on Kucoin.`
      );
    }
    let delta = 0;
    result.data.forEach((trade: Trade) => {
      switch (trade.side) {
        case "buy":
          delta += parseFloat(trade.size);
          break;
        case "sell":
          delta -= parseFloat(trade.size);
          break;
      }
    });
    return { status: 200, message: delta.toString() };
  } catch (error) {
    console.error(error);
    if (error instanceof PairNotFoundError) {
      return { status: 404, message: error.message };
    }
    return { status: 500, message: error.message };
  }
}
