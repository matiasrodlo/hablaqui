import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import '../../widgets/button.dart';
import '../../colors.dart' as appColors;
import '../../helpers/WidgetHelper.dart';
import '../../services/service-user.dart';

class Register extends StatefulWidget
{
	@override
	_RegisterState	createState() => _RegisterState();
}

class _RegisterState extends State<Register>
{
	GlobalKey<FormState>		_keyForm 		= GlobalKey<FormState>();
	bool						_termsAgree 	= false;
	TextEditingController		_ctrlName		= TextEditingController();
	TextEditingController		_ctrlEmail		= TextEditingController();
	TextEditingController		_ctrlPass		= TextEditingController();
	
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
				padding: EdgeInsets.all(10),
				child: ListView(
					children: [
						SizedBox(height: 15),
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
						controller: this._ctrlName,
						keyboardType: TextInputType.text,
						decoration: WidgetHelper.getTextFieldDecoration('Nombre'),
						validator:(v)
						{
							if( v.isEmpty )
								return 'Debe ingresar su nombre';
						}
					),
					SizedBox(height: 10),
					TextFormField(
						controller: this._ctrlEmail,
						keyboardType: TextInputType.emailAddress,
						decoration: WidgetHelper.getTextFieldDecoration('Correo electrónico'),
						validator:(v)
						{
							if( v.isEmpty )
								return 'Debe ingresar su correo electronico';
						}
					),
					SizedBox(height: 10),
					TextFormField(
						controller: this._ctrlPass,
						keyboardType: TextInputType.text,
						obscureText: true,
						decoration: WidgetHelper.getTextFieldDecoration('Contraseña'),
						validator: (v)
						{
							if( v.isEmpty )
								return 'Debe ingresar una contraseña';
						}
						
					),
					SizedBox(height: 10),
					TextFormField(
						keyboardType: TextInputType.text,
						decoration: WidgetHelper.getTextFieldDecoration('Código de invitación'),
					),
					SizedBox(height: 10),
					Row(
						children: [
							Checkbox(
								value: this._termsAgree,
								onChanged: (val)
								{
									this.setState(()
									{
										this._termsAgree = val;
									});
								}
							),
							SizedBox(width: 10),
							Expanded(
								child: RichText(
									text: TextSpan(
										text: 'He leido y acepto los ',
										style: TextStyle(color: appColors.mainColors['gray']),
										children: [
											TextSpan(
												text: 'Terminos y Condiciones y ',
												style: TextStyle(color: appColors.mainColors['blue']),
												recognizer: TapGestureRecognizer()
													..onTap = ()
												{
													
												}
												
											),
											TextSpan(
												text: 'la Politica de privacidad',
												style: TextStyle(color: appColors.mainColors['blue']),
												recognizer: TapGestureRecognizer()
													..onTap = ()
												{
													
												}
												
											)
										]
									),
								)
							)
						]
					),
					TextButton(
						child: Text('¿Olvido la contraseña?', textAlign: TextAlign.left),
						style: ButtonStyle(
							alignment: Alignment.topLeft,
						),
						onPressed: (){}
					),
					SizedBox(height: 15),
					WidgetButton(
						text: 'Crear mi cuenta',
						callback: this._doRegister,
						color: appColors.mainColors['blue'],
					),
					SizedBox(height: 25),
					
					SizedBox(height: 10),
					Text('2021 Hablaqui', textAlign: TextAlign.center),
				]
			)
		);
	}
	void _doRegister() async
	{
		if( !this._keyForm.currentState.validate() )
			return;
		try
		{
			if( !this._termsAgree )
				throw new Exception('Debe aceptar los terminos');
			var user = await ServiceUsers().register({
				'name': this._ctrlName.text.trim(),
				'email': this._ctrlEmail.text.trim(),
				'password': this._ctrlPass.text.trim(),
			});
			this._showSuccess();
		}
		catch(e)
		{
			print(e);
			ScaffoldMessenger.of(this.context).showSnackBar(SnackBar(content: Text('Ocurrio un error en el proces de registro')));
		}
	}
	void _showSuccess()
	{
		showDialog(context: this.context, barrierDismissible: false,
			builder: (ctx)
			{
				return AlertDialog(
					title: Text('Registro completado'),
					content: SingleChildScrollView(
						child: ListBody(
							children: [
								Text('Tu registro se ha completado correctamente, ahora puedes iniciar sesion'),
								
							],
							
						)
					),
					actions: [
						TextButton(
							child: Text('Iniciar Sesion'),
							onPressed: ()
							{
								Navigator.of(this.context).pushNamedAndRemoveUntil('/login', (_) => false);
							}
						)
					]
				);
			}
		);
	}
}
