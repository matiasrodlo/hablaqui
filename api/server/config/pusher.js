import Pusher from "pusher";
import {
  pusher_app_id,
  pusher_key,
  pusher_secret,
  pusher_cluster,
} from "./dotenv";

const pusher = new Pusher({
  appId: pusher_app_id,
  key: pusher_key,
  secret: pusher_secret,
  cluster: pusher_cluster,
  useTLS: true,
});

export default pusher;
