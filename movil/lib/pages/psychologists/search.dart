import 'package:flutter/material.dart';
import '../../classes/Psychologist.dart';
import '../../services/service-hablaqui.dart';
import 'profile.dart';
import '../../helpers/WidgetHelper.dart';

class SearchPsychologists extends StatefulWidget
{
	@override
	_SearchPsychologists	createState() => _SearchPsychologists();
}

class _SearchPsychologists extends State<SearchPsychologists>
{
	List<Psychologist>		_items = [];
	
	@override
	void initState()
	{
		super.initState();
	}
	@override
	Widget build(BuildContext context)
	{
		return Scaffold(
			appBar: AppBar(title: Text('Busqueda de Psicologo')),
			body: Container(
				padding: EdgeInsets.all(10),
				child: Column(
					children: [
						TextFormField(
							decoration: WidgetHelper.getTextFieldDecoration('Buscar', Colors.grey.withOpacity(0.6)),
						),
						SizedBox(height: 10),
						Expanded(
							child: StreamBuilder(
								stream: this._getPsychologists(),
								builder: (ctx, snapshot)
								{
									if( !snapshot.hasData )
										return Center(child: CircularProgressIndicator());
										
									if( snapshot.data.length <= 0 )
										return Center(child: Text('No se encontraron resultados'));
										
									return ListView.builder(
										itemCount: this._items.length,
										itemBuilder: (_ctx, index)
										{
											return this._buildItem(this._items[index]);
										}
									);
								}
							)
						)
					]
				)
			),
		);
	}
	Stream<List> _getPsychologists() async*
	{
		var items = await ServiceHablaqui().getPsychologists();
		
		this._items.addAll( items );
		
		yield this._items;
	}
	Widget _buildItem(Psychologist psycho)
	{
		return Card(
			elevation: 0,
			child: Container(
				child: ListTile(
					leading: CircleAvatar(
						backgroundImage: NetworkImage(psycho.avatar),
						backgroundColor: Colors.grey,
					),
					title: Text(psycho.fullName),
					subtitle: Column(
						crossAxisAlignment: CrossAxisAlignment.stretch,
						children: [
							Text('Psicologo - Activo')
						]
					),
					//trailing: Image.network(psycho.avatar)
					onTap: ()
					{
						Navigator.push(this.context, MaterialPageRoute(builder: (_) => PsychologistProfile(psycho: psycho)));
					}
				)
			)
		);
	}
}
