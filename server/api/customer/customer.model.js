
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CustomerSchema = new Schema({
	

  UDID: String,
  name: String,
  timezone:String,
  distinct_id:String,
  email: String,
  phone: String,
  country_code: String,
  city:String,
  region:String,
  info: String,
  blocked: Boolean,
  last_seen:String,
  last_checkin:String,
  last_checkout:String,
  Yozio_MetaData:String,
  Current_Language:String,
  Check_out_Date:Date,
  Check_in_Date:Date,
  Count_of_Confirmed_Bookings:Number,
  Count_of_Online_Checkouts:Number,
  User_Type:String,
  ip:String,
  user_ios:{
    ios_app_release: String,
    ios_app_version: String,
    ios_device_model: String,
    ios_lib_version: String ,
    ios_version: String,
  },
  user_android:{
    android_app_version: String,
    android_app_version_code: String,
    android_brand: String,
    android_devices: String ,
    android_lib_version: String,  	
    android_manufacturer: String,
    android_model: String,
    android_os: String ,
    android_os_version: String
  },

  transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
  callLogs: [{type: Schema.Types.ObjectId, ref: 'CallLog'}]
 
});

module.exports = mongoose.model('Customer', CustomerSchema);
