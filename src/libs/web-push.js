import pkg  from "web-push";
const webPush = pkg

webPush.setVapidDetails(
  "mailto:labarbada23@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default webPush