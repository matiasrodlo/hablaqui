class ChatMessage
{
	String		id;
	bool		read;
	String		sentBy;
	String		message;
	DateTime	updatedAt;
	DateTime	createdAt;
	
	
	ChatMessage();
	
	ChatMessage.fromMap(Map data)
	{
		this.loadData(data);
	}
	void loadData(Map data)
	{
		try
		{
			this.id				= data['_id'];
			this.read			= data['read'];
			this.sentBy			= data['sentBy'];
			this.message		= data['message'];
			this.updatedAt		= DateTime.parse(data['updatedAt']);
			this.createdAt		= DateTime.parse(data['createdAt']);
		}
		catch(e)
		{
			print('CHAT MESSAGE ERROR LOADING DATA');
			print(e);
		}
	}
}
