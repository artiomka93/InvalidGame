package com.invalid.server;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.annotation.WebServlet;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import com.invalid.player.Player;

/**
 * Servlet implementation class ServerImpl
 */
@WebServlet("/hello/info")
public class ServerImpl extends WebSocketHandlerDecorator {
	
	private Map<String, Player> players = new ConcurrentHashMap<>();

	public ServerImpl(WebSocketHandler delegate) {
		super(delegate);
	}
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session)
			throws Exception {
		
		Player player = new Player(session);
		players.put(player.getId(), player);
		System.out.println("New player joined - " + player.getId());
		
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session,
			CloseStatus closeStatus) throws Exception {
		Player player = players.get(session.getId());
		players.remove(player.getId());
		System.out.println("Player left - " + player.getId());
	}
	
}
