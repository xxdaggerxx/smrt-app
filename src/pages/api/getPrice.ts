// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { calculatePrice } from "./pricing_algo";

export interface OverwritePrice {
  startDateTime: string;
  endDateTime: string;
  pricePerHour: string;
}

interface CustomApiRequest extends NextApiRequest {
  body: {
    startDateTime: string;
    endDateTime: string;
    pricePerHour: string;
    overwritePrice?: OverwritePrice[];
  };
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse<number | unknown>
) {
  try {
    const price = calculatePrice(
      new Date(req.body.startDateTime),
      new Date(req.body.endDateTime),
      parseFloat(req.body.pricePerHour),
      req.body.overwritePrice?.map((x) => ({
        startDateTime: new Date(x.startDateTime),
        endDateTime: new Date(x.endDateTime),
        pricePerHour: parseFloat(x.pricePerHour),
      }))
    );
    res.status(200).json(price);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
}
