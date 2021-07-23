import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/service-hablaqui.dart';
import '../../classes/Psychologist.dart';
import '../../classes/Chat.dart';
import '../../colors.dart' as appColors;
import '../button.dart';
import '../../pages/chat.dart' as chatPage;

class ChatConversations extends StatefulWidget
{
	final	Function(bool)	onHasChats;
	
	ChatConversations({this.onHasChats});
	@override
	_ChatConversationsState	createState() => _ChatConversationsState();
}
class _ChatConversationsState extends State<ChatConversations>
{
	int		_requests = 0;
	List<Chat>		_items = [];
	List<Chat>		_myItems = [];
	
	@override
	void initState()
	{
		this._items = [];
		this._loadData();
		super.initState();
	}
	void _loadData() async
	{
		this._items = await ServiceHablaqui().getChats();
		this.setState((){});
		
	}
	@override
	Widget build(BuildContext context)
	{
		return Container(
			child: ListView(
				children: [
					Column(
						crossAxisAlignment: CrossAxisAlignment.stretch,
						children: [
							Text('Mis psicólogos', style: TextStyle(color: appColors.mainColors['blue']),),
							SizedBox(height: 10),
							Divider(color: appColors.mainColors['blue']),
							SizedBox(height: 10),
							for(var myItem in this._myItems)
								Column(
									children: [
										this._buildItem(myItem),
										SizedBox(height: 0),
									]
								),
							Text('General'),
							Divider(),
							SizedBox(height: 10),
							for(var item in this._items)
								Column(
									children: [
										this._buildItem(item),
										SizedBox(height: 0),
									]
								),
							/*
							Container(
								child: Column(
									children: [
										
										
										this._items.length <= 0 ? this._noData() : ListView.builder(
											itemCount: this._items.length,
											itemBuilder: (_, index)
											{
												return ;
											}
										)
									]
								)
							)
							*/
						]
					)
				]
			),
			/*
			child: StreamBuilder(
				stream: this._getConversations(),
				builder: (ctx, snapshot)
				{
					if( !snapshot.hasData  )
						return Center(child: CircularProgressIndicator());
						
					if( this._items.length <= 0 )
						return this._noData();
						
					return ListView.builder(
						itemCount: this._items.length,
						itemBuilder: (_, index)
						{
							return this._buildItem(this._items[index]);
						}
					);
				}
			)
			*/
		);
	}
	Widget _noData()
	{
		return Column(
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
		);
	}
	void _searchPsychologists() async
	{
		//Navigator.of(this.context).pushNamed('/psychologists/search');
		String url = 'https://hablaqui.cl/psicologos';
		if (await canLaunch(url)) 
		{
			await launch(url);
		} 
		else 
		{
			print('Could not launch $url');
		}
	}
	Stream<List> _getConversations() async*
	{
		var chats = await ServiceHablaqui().getChats();
		print(chats);
		this._items.addAll( chats );
		yield this._items;
	}
	Widget _buildItem(Chat chat)
	{
		return Card(
			elevation: 0,
			child: Container(
				child: ListTile(
					leading: CircleAvatar(
						backgroundImage: NetworkImage(chat.psychologist.avatar),
						backgroundColor: Colors.grey,
					),
					title: Text(chat.psychologist.fullName),
					subtitle: Column(
						crossAxisAlignment: CrossAxisAlignment.stretch,
						children: [
							Text('Psicologo - Activo')
						]
					),
					//trailing: Image.network(psycho.avatar)
					onTap: ()
					{
						Navigator.push(this.context, MaterialPageRoute(builder: (_) => chatPage.ChatPage(psycho: chat.psychologist)));
					}
				)
			)
		);
	}
}
