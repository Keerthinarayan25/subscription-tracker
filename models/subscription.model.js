import mongoose  from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  price:{
    type:Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price must be grater than 0']
  },
  currency: {
    type: String,
    enum:['USD', 'IND'],
    default:['IND']
  },
  frequency: {
    type:String,
    enum: ['daily', 'weekly','monthly','yearly'],
  },
  category:{
    type:String,
    enum:['sports','news','entertainment','lifestyle','technologia','fincace','politics','other'],
    required: true
  },
  paymentMethod:{
    type:String,
    required:true,
    trim:true,
  },
  status:{
    type:String,
    enum:['active','cancelled','expired'],
    default:'active'
  },
  startDate:{
    type:String,
    required: true,
    validDate: {
      validator: (value)=> value <=new Date(),
      message:'Start date must be in the past'
    }
  },
  renewalDate: {
    type: Date,
    validDate: {
      validator: function(value){
        return value > this.startDate;
      },
      message:'Renewal date must be after start date'
    }
  },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
    index: true,
  }

}, { timestamps:true});

subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate && this.startDate && this.frequency) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const days = renewalPeriods[this.frequency];
    if (days) {
      this.renewalDate = new Date(this.startDate);
      this.renewalDate.setDate(this.renewalDate.getDate() + days);
    }
  }
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;