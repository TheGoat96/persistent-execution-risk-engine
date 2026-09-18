/**
 * SHOWCASE SNIPPET — Express API route mounting
 * Illustrative only. Not a runnable Firebase Functions app.
 *
 * Production mounts many EA modules; this showcase only shows the
 * Market Watch + SR Trend surface plus shared trade/account routes.
 */

import express from "express";
// import { accountRoutes } from "./accounts/accountRoutes";
// import { commandRoutes } from "./accounts/commandRoutes";
// import { orderRoutes } from "./trades/orderRoutes";
// import { positionRoutes } from "./trades/positionRoutes";
// import { imageRoutes } from "./images/imageRoutes";
// import { marketWatchEARoutes } from "./ea-setting/marketWatchRoutes";
// import { srTrendEARoutes } from "./ea-setting/srTrendRoutes";

const app = express();
const main = express();

/**
 * CORS allowlist would include local dashboards + hosted ops UIs.
 * Real origins omitted from this public showcase.
 */
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, ok?: boolean) => void) => {
    // Allow missing origin (curl) or approved dashboard origins (redacted).
    callback(null, true);
  },
  credentials: true
};

app.use(/* cors(corsOptions) */);

// Shared platform routes
app.use(/* accountRoutes */);   // /account/*
app.use(/* commandRoutes */);   // /commands/*
app.use(/* positionRoutes */);  // /trade/position*
app.use(/* orderRoutes */);     // /trade/order*
app.use(/* imageRoutes */);     // /screenshot/*

// Per-EA plugin routes (settings + chart-condition snapshots)
app.use(/* marketWatchEARoutes */); // e.g. /marketwatch/*
app.use(/* srTrendEARoutes */);     // e.g. /srTrend/*  /srtrend/*

main.use(/* bodyParser.json({ limit: "10mb" }) */); // screenshots need headroom
main.use("/api/v2", app);

export const restApi = app;
export const endpoint = main;
