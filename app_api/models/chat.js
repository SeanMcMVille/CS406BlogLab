var mongoose = require( 'mongoose' );

var chatSchema = new mongoose.Schema({ 
	chat: String,
	name: String
});

mongoose.model('Chat', chatSchema);