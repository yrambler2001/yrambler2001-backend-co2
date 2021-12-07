import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create User Schema
const AirSchema = new Schema({}, { strict: false });

const AirModel = mongoose.model('air', AirSchema);
AirModel.findLast = async () => {
  return AirModel.findOne({}).sort({ _id: -1 }).lean().exec();
};
AirModel.findInRange = async (start, end) => {
  return AirModel.find({
    $and: [{ date: { $gte: new Date(start) } }, { date: { $lte: new Date(end) } }],
  })
    .lean()
    .exec();
};
export default AirModel;
