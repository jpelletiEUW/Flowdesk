import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { calculateTradesDelta } from "./cumulative_delta";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get(
  "/cumulative-delta/:pairSymbol",
  async (req: express.Request, res: express.Response) => {
    const result = await calculateTradesDelta(req.params.pairSymbol);
    res.status(result.status).send(result.message);
  }
);

app.listen(3001, () => {
  console.log("listening on port 3001");
});
