import { start } from "@clinq/bridge";
import { ICloudAdapter } from "./ICloudAdapter";

const redisUrl: string = process.env.REDIS_URL;

start(new ICloudAdapter(redisUrl));
