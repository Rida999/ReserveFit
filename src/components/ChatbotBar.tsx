"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm your personal fitness assistant. I can help you find the perfect trainer, learn about our programs, or answer any fitness questions!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const predefinedResponses = [
    "Great question! 🎯 I'd recommend booking a consultation with one of our expert trainers to create a personalized plan just for you.",
    "Our trainers are amazing! 💪 Sarah specializes in Strength Training & HIIT, while Mike is your go-to for Bodybuilding & Nutrition. Want me to help you book with one of them?",
    "We've got 6 awesome programs! 🔥 From HIIT and Strength Training to Weight Loss and Athletic Performance. Which goal are you working towards?",
    "That's the spirit! 🚀 Fitness is all about progress, not perfection. Our trainers will help you build sustainable habits that last.",
    "Ready to book? 📅 Just scroll up to our booking section or I can guide you through the process right here!",
    "Perfect! 🌟 Whether you're a beginner or advanced, we'll match you with the right trainer and program for your fitness level."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickActions = [
    'Book a session',
    'View trainers',
    'Training programs',
    'Pricing info'
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleOpen = () => {
    if (!isOpen) setIsMinimized(false);
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {isOpen && (
        <div className={`fixed bottom-20 right-4 w-80 z-40 transition-all duration-300 ${
          isMinimized ? 'h-19' : 'h-[60vh]'
        }`}>
          <Card className="h-full flex flex-col border-none">
            <CardHeader className="p-3 bg-gradient-to-r from-primary rounded via-energy to-primary text-white relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardTitle className="relative z-10 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bot className="h-6 w-6" />
                    <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
                  </div>
                  <div>
                    <div className="font-semibold">FitTrainer Assistant</div>
                    <div className="text-xs text-white/80 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Online & ready to help
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="flex flex-col h-[50vh] p-0">
                <div className="flex-1 flex flex-col min-h-0">
                  <ScrollArea className="flex-1 px-4 py-2">
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                          <div className={`flex items-end gap-2 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                              msg.isBot ? 'bg-gradient-to-r from-primary to-energy text-white' : 'bg-gradient-to-r from-power to-success text-white'
                            }`}>
                              {msg.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </div>
                            <div className={`px-3 py-2 rounded-2xl shadow-sm ${
                              msg.isBot ? 'bg-muted/70 text-foreground rounded-bl-md' : 'bg-gradient-to-r from-primary to-energy text-white rounded-br-md'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              <div className={`text-xs mt-1 ${msg.isBot ? 'text-muted-foreground' : 'text-white/70'}`}> {msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-end gap-2 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-energy text-white shadow-md flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted/70 p-3 rounded-2xl rounded-bl-md">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {messages.length === 1 && (
                    <div className="px-4 py-2">
                      <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map(a => (
                          <Button key={a} variant="outline" size="sm" className="text-xs h-7 px-3 hover:bg-primary/10 hover:border-primary/30" onClick={() => handleQuickAction(a)}>
                            {a}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t bg-background/90 backdrop-blur-sm px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about fitness..."
                      className="flex-1 focus:outline-none bg-muted/10 rounded px-3 py-2"
                      disabled={isTyping}
                    />
                    <Button onClick={handleSendMessage} size="icon" variant="energy" disabled={!inputValue.trim() || isTyping} className="h-10 w-10 rounded-xl shadow-md">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center">Powered by FitTrainer Pro AI</div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      <Button onClick={toggleOpen} className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-50 transition-all duration-200 group ${isOpen ? 'scale-90 shadow-lg' : 'scale-100 hover:scale-110 shadow-2xl'}`} variant="energy" size="icon">
        <div className="relative">
          {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />}
          {!isOpen && (
            <>  
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500/30 rounded-full animate-ping"></div>
            </>
          )}
        </div>
      </Button>
    </>
  );
};

export default ChatbotBar;
