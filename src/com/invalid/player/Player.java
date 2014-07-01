package com.invalid.player;

import org.springframework.web.socket.WebSocketSession;

public class Player {

	private String id;
	private int x;
	private int y;
	
	public Player(WebSocketSession session){
		this.id = session.getId();
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public String getId() {
		return id;
	}
	
}
