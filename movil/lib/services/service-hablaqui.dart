import 'dart:convert';
import 'service.dart';
import '../classes/Psychologist.dart';

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
}
