import app from "./src/app.js";
import { PORT } from "./src/configs/constant.js";
import { connectToMongoDB } from "./src/configs/mongodb.js";

await connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});