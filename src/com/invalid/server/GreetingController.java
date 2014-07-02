package com.invalid.server;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {

    @MessageMapping("/move")
    @SendTo("/topic/greetings")
    public PlayerMessage greeting(PlayerMessage message) throws Exception {
    	return message;
    }
    
    @MessageMapping("/fire")
    @SendTo("/topic/fiered")
    public BulletMessage handleFireInfo(BulletMessage message) throws Exception {
    	return message;
    }

}
