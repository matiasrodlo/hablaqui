import 'package:flutter/material.dart';
import '../../classes/Psychologist.dart';
import '../../colors.dart' as appColors;
import '../../widgets/button.dart';


class PsychologistProfile extends StatefulWidget
{
	final	Psychologist	psycho;
	
	PsychologistProfile({@required this.psycho});
	
	@override
	_PsychologistProfileState	createState() => _PsychologistProfileState();
}

class _PsychologistProfileState extends State<PsychologistProfile>
{
	@override
	void initState()
	{
		super.initState();
	}
	Widget build(BuildContext context)
	{
		
		return Scaffold(
			appBar: AppBar(title: Text('Perfil del Psicólogo')),
			body: Container(
				padding: EdgeInsets.all(10),
				child: ListView(
					children: [
						Center(
							child: Container(
								width: 100,
								height: 100,
								child: CircleAvatar(
									backgroundImage: NetworkImage(this.widget.psycho.avatar),
								)
							)
						),
						SizedBox(height: 10),
						Text('Codigo: ${this.widget.psycho.code}', textAlign: TextAlign.center,
							style: TextStyle(fontWeight: FontWeight.bold, color: appColors.mainColors['blue'])
						),
						SizedBox(height: 10),
						this._buildFormation(),
						SizedBox(height: 10),
						this._buildSpecialties(),
						SizedBox(height: 20),
						WidgetButton(
							text: 'Agendar cita online',
							callback: this._bookNow,
							color: appColors.mainColors['blue'],
						),
					]
				)
			)
		);
	}
	Widget _buildFormation()
	{
		return Card(
			child: Container(
				padding: EdgeInsets.all(8),
				child: Column(
					children: [
						Text('Formación', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: appColors.mainColors['blue'])),
						SizedBox(height: 10),
						Text( this.widget.psycho.formation.map<String>( (f) => f).toList().join(', ') )
					]
				)
			)
		);
	}
	Widget _buildSpecialties()
	{
		return Card(
			child: Container(
				padding: EdgeInsets.all(8),
				child: Column(
					children: [
						Text('Especialidades', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: appColors.mainColors['blue'])),
						SizedBox(height: 10),
						Text( this.widget.psycho.specialties.map<String>( (f) => f).toList().join(', ') )
					]
				)
			)
		);
	}
	void _bookNow()
	{
	}
}
