import 'package:flutter/material.dart';
import '../services/service-user.dart';
import '../classes/SB_Settings.dart';
import '../colors.dart' as appColors;
import '../widgets/button.dart';
import '../widgets/chat/conversations.dart';

class Home extends StatefulWidget
{
	_HomeState	createState() => _HomeState();
}

class _HomeState extends State<Home>
{
	String 		_title;
	bool	_loaded	= false;
	
	@override
	void initState()
	{
		this._title = 'Hablaqui';
		this._loadData();
	}
	void _loadData() async
	{
		var user = await ServiceUsers().getCurrentUser();
		print(user);
		if( user != null )
		{
			this._title = 'Hola ' + user.name;
		}
		this.setState(()
		{
			this._loaded = true;
		});
	}
	@override
	Widget build(BuildContext context)
	{
		return Scaffold(
			appBar: AppBar(title: Text(this._title)),
			endDrawer: Drawer(
				child: ListView(
					children: [
						ListTile(
							title: Text('Cerrar Sesion'),
							onTap: this._closeSession
						)
					]
				)
			),
			body: Container(
				padding: EdgeInsets.all(10),
				child: this._loaded ? ChatConversations() : SizedBox(height: 0),
			)
		);
	}
	void _closeSession() async
	{
		await ServiceUsers().closeSession();
		Navigator.of(this.context).pushNamedAndRemoveUntil('/', (_) => false);
	}
}
