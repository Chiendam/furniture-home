const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});

const stringConnect = process.env.DB_URL + process.env.DB_NAME;
mongoose.connect(stringConnect).then(() => {
  console.log(`DB connect success ${process.env.DB_NAME}`);
}).catch(err=>console.log(err));

//create port default
const port = process.env.PORT || 8088; 
//listen server follow port default 
app.listen(port, ()=> {
    console.log(`App đang chạy trên cổng ${port} ...`);
}); 