import corn from "node-cron";
import { addProductsService } from "../services/product.service.ts";

corn.schedule("* * 1 * *", async () => {
  console.log("Data Updation Started");
  try {
    await addProductsService();
  } catch (err: any) {
    return console.log("Error :- ", err.message);
  }
  console.log("Data Updation task completed.");
});
