This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To Start, use lattest version of node : v20.14.0

```bash
npm install
npm run build
npm run start
```

## Pricing API

POST : https://smrt-app.vercel.app/api/getPrice

Body:

```json
{
  "startDateTime": "2021-11-13T09:24:00",
  "endDateTime": "2021-11-15T15:13:00",
  "pricePerHour": 13,
  "overwritePrice": [
    {
      "startDateTime": "2021-11-14T12:00:00",
      "endDateTime": "2021-11-14T14:01:00",
      "pricePerHour": "5"
    },
    {
      "startDateTime": "2021-11-15T09:00:00",
      "endDateTime": "2021-11-17T00:00:00",
      "pricePerHour": 15.2
    }
  ]
}
```
