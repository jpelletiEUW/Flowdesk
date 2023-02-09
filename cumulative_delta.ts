import * as express from "express";
import * as api from "kucoin-node-api";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const config = {
  environment: "live",
};

api.init(config);

const app = express();
app.use(bodyParser.json());
app.use(cors());

type Trade = {
  sequence: string;
  price: string;
  size: string;
  side: "buy" | "sell";
  time: Date;
};

type ApiTradesHistoryResult = {
  code: number;
  data: Trade[];
};

class PairNotFoundError extends Error {}

app.get(
  "/cumulative-delta/:pairSymbol",
  (req: express.Request, res: express.Response) => {
    const pairSymbol = req.params.pairSymbol;
    api
      .getTradeHistories(pairSymbol)
      .then((result: ApiTradesHistoryResult) => {
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
        res.status(200).send(delta.toString());
      })
      .catch((error: Error) => {
        console.error(error);
        if (error instanceof PairNotFoundError) {
          return res.status(404).send(error.message);
        }
        return res.status(500).send(error.message);
      });
  }
);

app.listen(3001, () => {
  console.log("listening on port 3001");
});
