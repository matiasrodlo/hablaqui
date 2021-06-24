import 'package:flutter/material.dart';
import '../services/service-user.dart';
import '../classes/SB_Settings.dart';
import '../colors.dart' as appColors;
import '../widgets/button.dart';

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
				padding: EdgeInsets.all(10),
				child: Column(
					mainAxisAlignment: MainAxisAlignment.center,
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						Text('Comienza a hablar con nuestros psicólogos', 
							textAlign: TextAlign.center,
							style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: appColors.mainColors['blue'])
						),
						SizedBox(height: 20),
						Text('Lorem ipsum dolor sit amet, consectetuer adipscing elit, sed diam nonumy nibh euismod tincidunt ut laoreet',
							textAlign: TextAlign.center,
						),
						SizedBox(height: 20),
						WidgetButton(
							text: 'Buscar ahora',
							callback: this._searchPsychologists,
							color: appColors.mainColors['blue'],
						),
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
	void _searchPsychologists()
	{
		Navigator.of(this.context).pushNamed('/psychologists/search');
	}
}
