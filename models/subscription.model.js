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
    type:String,
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
      validDate: (value)=> value <=new Date(),
      message:'Start date must be in the past'
    }
  },
  renewalDate: {
    type: Date,
    required: true,
    validDate: {
      validator: function(value){
        return value > this.startDate;
      },
      message:'Renewal dat must be after start date'
    }
  },
  user: {
    type:mongoose.Schema.Types.ObjectsId,
    ref:'User',
    required: true,
    index: true,
  }

}, { timestamps:true});

subscriptionSchema.pre('save', function(next){
  if(!this.renewalDate){
    const renewalPeriods = {
      daily:1,
      weekly:7,
      montly:30,
      yearly:365
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  if (this.renewalDate < new Date()){
    this.status = 'exdpired';

  }

  next();
});

const Subscription = mongoose.model('Subcription', subscriptionSchema);

export default Subscription;