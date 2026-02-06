// route imports
import userRouter from "./routes/user.routes.ts";
import adminRouter from "./routes/admin.routes.ts";
import productRouter from "./routes/product.routes.ts";
import purchaseRouter from "./routes/purchase.routes.ts";
import transactionRouter from "./routes/transaction.routes.ts";
import paymentRouter from "./routes/payment.routes.ts";

// cron imports
import "./utils/dataUpdate.ts";

// pakage imports
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/payment",paymentRouter)
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/purchase", purchaseRouter);
app.use("/transaction", transactionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
