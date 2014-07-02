package com.invalid.player;

import java.util.HashMap;
import java.util.Map;

public class Players {
	
	private static Map<String, Player> players = new HashMap<>();
	
	public static Map<String, Player> getPlayers(){
		return players;
	}
	
	public static void addPlayer(String id){
		players.put(id, new Player());
	}
	
	public static Player getPlayer(String id){
		if(players.get(id) == null){
			players.put(id, new Player());
		}
		return players.get(id);
	}
	
	public static void removePlayer(String id){
		players.remove(id);
	}

}
