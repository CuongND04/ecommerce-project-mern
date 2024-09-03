const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn.connection.readyState === 1) console.log("Kết nối thành công");
    else console.log("DB connecting");
  } catch (error) {
    console.log("Kết nối thất bại");
    throw new Error(error);
  }
};

module.exports = dbConnect;
