const api = require("kucoin-node-api");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = {
  environment: "live",
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

api.init(config);

type ApiTradesHistoryResult = {
  code: number;
  data: Record<string, string>[];
};

class PairNotFoundError extends Error {}

app.get("/cumulative-delta/:pairSymbol", (req, res) => {
  const pairSymbol = req.params.pairSymbol;
  api
    .getTradeHistories(pairSymbol)
    .then((result: ApiTradesHistoryResult) => {
      if (result.data.length === 0) {
        throw new PairNotFoundError("This pair doesn't exist on kucoin");
      }
      let delta = 0;
      result.data.forEach((trade) => {
        console.log(trade.size);
        if (trade.side === "buy") {
          delta += parseFloat(trade.size);
        } else {
          delta -= parseFloat(trade.size);
        }
      });
      console.log(delta);
      res.status(200).send(delta.toString());
    })
    .catch((error: Error) => {
      console.error(error);
      if (error instanceof PairNotFoundError) {
        return res.status(404).send(error);
      }
      return res.status(500).send(error);
    });
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
