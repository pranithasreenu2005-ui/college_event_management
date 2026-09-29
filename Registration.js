const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    registrationDate: { type: Date, default: Date.now },
    attendance: { type: String, enum: ["pending", "present", "absent"], default: "pending" },
    status: { type: String, enum: ["registered", "cancelled"], default: "registered" }
  },
  { timestamps: true }
);

registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
