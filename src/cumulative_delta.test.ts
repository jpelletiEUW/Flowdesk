import { describe, expect, jest, test } from "@jest/globals";
import {
  calculateTradesDelta,
  Trade,
  ApiTradesHistoryResult,
} from "./cumulative_delta";
import * as api from "kucoin-node-api";

jest.mock("kucoin-node-api");

type expectedResult = {
  status: number;
  message: string;
};

type individualTest = {
  name: string;
  tradedPair: string;
  data: Trade[];
  expectedResult: expectedResult;
};

const testArrayOfTrades: individualTest[] = [
  {
    name: "calculateTradesDelta calculates the delta correctly when given correct pair symbol",
    tradedPair: "BTC-USDT",
    data: [
      {
        sequence: "14582653",
        price: "40000",
        size: "1",
        side: "sell",
        time: 1675960017,
      },
      {
        sequence: "14582654",
        price: "40000",
        size: "5",
        side: "buy",
        time: 1675960017,
      },
      {
        sequence: "14582655",
        price: "40000",
        size: "3",
        side: "buy",
        time: 1675960017,
      },
    ],
    expectedResult: { status: 200, message: "7" },
  },
  {
    name: "calculateTradesDelta sends the right error message when given incorrect pair symbol",
    tradedPair: "ETH-RANDOMCOIN",
    data: [],
    expectedResult: {
      status: 404,
      message:
        "ETH-RANDOMCOIN trading pair doesn't exist on Kucoin. Try reversing the two coins, if it still doesn't work, then this pair isn't listed on Kucoin.",
    },
  },
];

testArrayOfTrades.forEach((testLayout) => {
  test(testLayout.name, async () => {
    const resp: ApiTradesHistoryResult = {
      code: 200000,
      data: testLayout.data,
    };
    //@ts-ignore
    api.getTradeHistories = jest.fn().mockResolvedValue(resp);
    const result = await calculateTradesDelta(testLayout.tradedPair);
    expect(result).toEqual(testLayout.expectedResult);
  });
});
