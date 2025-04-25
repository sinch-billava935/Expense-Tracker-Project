const { default: mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    transaction: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    remarks: {
      type: String,
      required: [true, "Remarks are required"],
    },
  },
  {
    timestamps: true,
  }
);
const transactionModel = mongoose.model("transactions", transactionSchema);

module.exports = transactionModel;
