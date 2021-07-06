import 'package:flutter/material.dart';
import '../../widgets/button.dart';
import '../../colors.dart' as appColors;
import '../../helpers/WidgetHelper.dart';
import '../../services/service-user.dart';
import '../../classes/User.dart';

class Login extends StatefulWidget
{
	
	@override
	_LoginState	createState() => _LoginState();
}
class _LoginState extends State<Login>
{
	GlobalKey<FormState>		_keyForm 		= GlobalKey<FormState>();
	TextEditingController		_ctrlEmail		= TextEditingController();
	TextEditingController		_ctrlPass		= TextEditingController();
	bool						_processing		= false;
	
	@override
	void initState()
	{
		super.initState();
	}
	@override
	Widget build(BuildContext context)
	{
		return Scaffold(
			appBar: AppBar(
				title: Text(''), backgroundColor: Colors.white, elevation: 0,
				actionsIconTheme: IconThemeData(
					color: Theme.of(context).primaryColor,
				),
				iconTheme: IconThemeData(
					color: Theme.of(context).primaryColor,
				)
			),
			body: Container(
				color: Colors.white,
				padding: EdgeInsets.all(10),
				child: Center(
					child: ListView(
					shrinkWrap: true,
					children: [
						//SizedBox(height: 15),
						Center(
							child: Image.asset('images/logo-text.png', fit: BoxFit.cover, height: 40),
						),
						SizedBox(height: 15),
						Text('¡Me alegra que estés aqui!', 
							textAlign: TextAlign.center,
							style: TextStyle(fontSize: 20, color: appColors.mainColors['blue'])
						),
						SizedBox(height: 15),
						Text('Ingresa y continua tu viaje de desarrollo personal ahora mismo',
							textAlign: TextAlign.center,
							style: TextStyle(
								color: appColors.mainColors['gray'],
							),
						),
						SizedBox(height: 25),
						this._getForm(),
										
					]
				)
				)
			)
		);
	}
	Widget _getForm()
	{
		return Form(
			key: this._keyForm,
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.stretch,
				children:[
					TextFormField(
						controller: this._ctrlEmail,
						keyboardType: TextInputType.emailAddress,
						decoration: WidgetHelper.getTextFieldDecoration('Email'),
						validator:(v)
						{
							if( v.isEmpty )
								return 'Debe ingresar su email';
						}
					),
					SizedBox(height: 10),
					TextFormField(
						controller: this._ctrlPass,
						keyboardType: TextInputType.text,
						obscureText: true,
						decoration: WidgetHelper.getTextFieldDecoration('Contraseña'),
						validator:(v)
						{
							if( v.isEmpty )
								return 'Debe ingresar su contraseña';
						}
					),
					SizedBox(height: 10),
					TextButton(
						child: Text('¿Olvido la contraseña?', textAlign: TextAlign.left),
						style: ButtonStyle(
							alignment: Alignment.topLeft,
						),
						onPressed: (){}
					),
					SizedBox(height: 15),
					if( !this._processing )
					WidgetButton(
						text: 'Entra',
						callback: this._doLogin,
						color: appColors.mainColors['blue'],
					),
					if( this._processing )
					Center(child: CircularProgressIndicator()),
					SizedBox(height: 25),
					TextButton(
						child: Text('Política de privacidad y condiciones de uso', textAlign: TextAlign.left),
						onPressed: (){}
					),
					SizedBox(height: 10),
					Text('2021 Hablaqui', textAlign: TextAlign.center),
				]
			)
		);
	}
	void _doLogin() async
	{
		if( !this._keyForm.currentState.validate() )
			return;
		try
		{
			this.setState(()
			{
				this._processing = true;
			});
			var user = await ServiceUsers().login(this._ctrlEmail.text.trim(), this._ctrlPass.text.trim());
			print(user);
			Navigator.of(this.context).pushNamedAndRemoveUntil('/home', (_) => false);
		}
		catch(e)
		{
			this.setState(()
			{
				this._processing = false;
			});
			print(e);
			ScaffoldMessenger.of(this.context).showSnackBar(SnackBar(content: Text('Credenciales invalidas')));
		}
	}
}
