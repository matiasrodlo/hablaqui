import 'package:flutter/material.dart';
import '../services/service-user.dart';
import '../classes/SB_Settings.dart';

class Home extends StatefulWidget
{
	_HomeState	createState() => _HomeState();
}

class _HomeState extends State<Home>
{
	String 		_title;
	
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
			this.setState(()
			{
				this._title = 'Hola ' + user.name;
			});
		}
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
				child: ListView(
					children:[
					]
				)
			)
		);
	}
	void _closeSession() async
	{
		await ServiceUsers().closeSession();
		Navigator.of(this.context).pushNamedAndRemoveUntil('/', (_) => false);
	}
}
