package com.invalid.server;

import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SendingInfoThread extends Thread {

	@Override
	public void run() {
		while(true){
			sendPlayersInfo();
			System.out.println("sending");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	@SendTo("/topic/greetings")
    public String sendPlayersInfo(){
    	return "lulz";
    }
	
}
