import 'dart:convert';
import 'service.dart';
import '../classes/Psychologist.dart';
import '../classes/Chat.dart';
import '../classes/ChatMessage.dart';

class ServiceHablaqui extends Service
{
	static	ServiceHablaqui	_instance	= ServiceHablaqui._constructor();
	
	ServiceHablaqui._constructor();
	
	factory	ServiceHablaqui() => _instance;
	
	Future<List<Psychologist>>	getPsychologists() async
	{
		String _json 	= await this.get('/psychologists/all');
		var items 		= <Psychologist>[];
		var obj 		= json.decode(_json);
		
		obj['psychologists'].forEach( (d) => items.add( new Psychologist.fromMap(d) ));
		
		return items;
	}
	Future<List<Chat>> getChats() async
	{
		String _json	= await this.get('/chat/get-chats');
		print(_json);
		var obj			= json.decode(_json);
		var items		= <Chat>[];
		obj['chats'].forEach( (c) => items.add( new Chat.fromMap(c) ) );
		
		return items;
	}
	Future<List<ChatMessage>> getChatMessages(String psychoId, String userId) async
	{
		String _json	= await this.get('/chat/get-messages/' + psychoId + '/' + userId);
		var obj			= json.decode(_json);
		
		var items = <ChatMessage>[];
		obj['messages']['messages'].forEach( (m) => items.add( new ChatMessage.fromMap(m) ) );
		
		return items;
	}
	Future<ChatMessage> sendChatMessage(String psychoId, String userId, String message) async
	{
		var data = {
			'content': message,
		};
		String _json = await this.post('/chat/send-message/$psychoId/$userId', data, {'Content-Type': 'application/x-www-form-urlencoded'});
		
		var obj = json.decode(_json);
		
		return new ChatMessage.fromMap( obj['chat']['messages'].last );
	}
}
