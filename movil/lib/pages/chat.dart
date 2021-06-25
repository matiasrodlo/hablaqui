import 'package:flutter/material.dart';
import 'package:flutter_pusher/pusher.dart';
import 'package:flutter/services.dart';

import '../classes/Psychologist.dart';
import '../classes/Chat.dart';
import '../classes/ChatMessage.dart';
import '../colors.dart' as appColors;
import '../widgets/chat/message.dart';
import '../services/service-hablaqui.dart';
import '../classes/SB_Settings.dart';
import '../classes/User.dart';
import '../helpers/WidgetHelper.dart';
import '../config.dart';

class ChatPage extends StatefulWidget
{
	final Psychologist	psycho;
	
	ChatPage({@required this.psycho});
	
	@override
	_ChatPageState	createState() => _ChatPageState();
}
class _ChatPageState extends State<ChatPage>
{
	TextEditingController	_ctrlMessage 		= TextEditingController();
	TextEditingController	channelController	= TextEditingController(text: 'my-channel');
	TextEditingController	eventController 	= TextEditingController(text: "my-event");
	TextEditingController	triggerController 	= TextEditingController(text: "client-trigger");
  
	FocusNode				_focusNode		= FocusNode();
	User					_user;
	
	List<ChatMessage>		_messages = [];
	double msgWidth;
	
	Channel channel;
	
	@override
	void initState()
	{
		this.loadData();
		super.initState();
	}
	@override
	void dispose()
	{
		this._focusNode.dispose();
		if( this.channel != null )
			channel.unbind(this.eventController.text);
		Pusher.unsubscribe(this.channelController.text);
		super.dispose();
	}
	void loadData() async
	{
		await this.initPusher();
		this._user = new User.fromMap( await SB_Settings.getObject('user')) ;
		var items = await ServiceHablaqui().getChatMessages(this.widget.psycho.id, this._user.id);
		this._messages.addAll( items );
		this.setState((){});
	}
	Future<void> initPusher() async 
	{
		try 
		{
			await Pusher.init(
				appConfig['PUSHER_API_KEY'],
				PusherOptions(
					cluster: appConfig['PUSHER_CLUSTER'],
				),
				enableLogging: true
			);
			Pusher.connect(onConnectionStateChange: (x) async 
			{
				print('lastConnectionState = ${x.currentState}');
				try
				{
					this.channel = await Pusher.subscribe(this.channelController.text);
				}
				on PlatformException catch (e) 
				{
					print('SUBSCRIBE ERROR');
					print(e.message);
				}
				
				await this.channel.bind(this.eventController.text, (x) 
				{
					print('lastEvent: $x');
				});
				
			}, onError: (x) {
			  debugPrint("Error: ${x.message}");
			});
		} 
		on PlatformException catch (e) 
		{
			print('ERROR');
		  print(e.message);
		}
	}
	@override
	Widget build(BuildContext context)
	{
		var size = MediaQuery.of(context).size;
		this.msgWidth = size.width * 0.7;
		
		return Scaffold(
			appBar: AppBar(
				elevation: 0,
				title: Row(
					children: [
						Container(
							height: 50,
							child: CircleAvatar(
								backgroundImage: NetworkImage(this.widget.psycho.avatar),
							)
						),
						SizedBox(width: 10),
						Text(this.widget.psycho.fullName)
					],
				)
			),
			body: Container(
				color: appColors.mainColors['blue'],
				child: Container(
					padding: EdgeInsets.all(10),
					decoration: BoxDecoration(
						
						color: Colors.white,
						borderRadius: BorderRadius.only(
							topRight: Radius.circular(20),
							topLeft: Radius.circular(20),
						)
					),
					child: Column(
						children: [
							Expanded(
								child: this._withListView(),
							),
							Container(
								height: 55,
								padding: EdgeInsets.only(top: 10),
								child: TextFormField(
									focusNode: this._focusNode,
									controller: this._ctrlMessage,
									decoration: WidgetHelper.getTextFieldDecoration('Mensaje a ${this.widget.psycho.name}').copyWith(
										suffixIcon: Container(
											width: 100,
											child: Row(
												children: [
													IconButton(
														padding: EdgeInsets.all(8),
														icon: Icon(Icons.mic_none, color: Colors.grey),
														onPressed: ()
														{
														}
													),
													IconButton(
														padding: EdgeInsets.all(8),
														icon: Icon(Icons.send, color: appColors.mainColors['blue']),
														onPressed: this._sendMessage,
													)
												]
											)
										)
									),
								),
							)
						]
					)
				)
			)
		);
	}
	Stream<List> _getMessages() async*
	{
		var items = await ServiceHablaqui().getChatMessages(this.widget.psycho.id, this._user.id);
		this._messages.addAll( items );
		
		yield this._messages;
	}
	Widget _withStreamBuilder()
	{
		return StreamBuilder(
			stream: this._getMessages(),
			builder: (ctx, snapshot)
			{
				if( !snapshot.hasData )
					return Center(child: CircularProgressIndicator());
				
				return this._getListView();
			}
		);
	}
	Widget _withListView()
	{
		return this._getListView();
	}
	Widget _getListView()
	{
		return ListView.builder(
			itemCount: this._messages.length,
			itemBuilder: (_, index)
			{
				return WidgetChatMessage(
					message: this._messages[index],
					isMine: this._user.id == this._messages[index].sentBy,
					width: msgWidth,
					from: this._user.id == this._messages[index].sentBy ? this._user.name : this.widget.psycho.fullName,
				);
			}
		);
	}
	void _sendMessage() async
	{
		if( this._ctrlMessage.text.trim().isEmpty )
			return;
			
		var message = await ServiceHablaqui().sendChatMessage(this.widget.psycho.id, this._user.id, this._ctrlMessage.text.trim());
		this._messages.add( message );
		this._ctrlMessage.text = '';
		this._focusNode.unfocus();
		this.setState((){});
	}
}
