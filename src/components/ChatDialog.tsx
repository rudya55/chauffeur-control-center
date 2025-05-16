
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface Message {
  id: string;
  text: string;
  sender: 'driver' | 'dispatcher';
  timestamp: Date;
  translated?: boolean;
  original?: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispatcher: string;
}

export const ChatDialog = ({ open, onOpenChange, dispatcher }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Simuler des messages initiaux
  useEffect(() => {
    if (open && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        text: `Bonjour, je suis ${dispatcher}. Comment puis-je vous aider ?`,
        sender: 'dispatcher',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
    
    // Focus sur l'input quand le dialogue s'ouvre
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, dispatcher, messages.length]);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulation de traduction
  const translateText = async (text: string, to: string): Promise<string> => {
    // Simuler un délai de traduction
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulation simplifiée de traduction
    if (to === 'en') {
      const translations: Record<string, string> = {
        'Bonjour': 'Hello',
        'Comment allez-vous ?': 'How are you?',
        'Je suis en route': 'I am on my way',
        'Je serai là dans 5 minutes': 'I will be there in 5 minutes',
        'Merci': 'Thank you',
        'Au revoir': 'Goodbye',
        'Le client est informé de votre arrivée imminente.': 'The client has been informed of your imminent arrival.',
        'J\'informe le client du retard. Merci.': 'I am informing the client about the delay. Thank you.',
        'L\'adresse a été confirmée avec le client.': 'The address has been confirmed with the client.',
        'Bonjour ! Comment puis-je vous aider aujourd\'hui ?': 'Hello! How can I help you today?',
        'Je vous réponds dès que possible.': 'I will respond to you as soon as possible.'
      };
      
      // Vérifier si le texte est dans notre dictionnaire de traduction
      for (const [fr, en] of Object.entries(translations)) {
        if (text.includes(fr)) {
          return text.replace(fr, en);
        }
      }
      
      // Si pas de correspondance exacte, simuler une traduction simple
      return `[TRANSLATED] ${text}`;
    } else {
      const translations: Record<string, string> = {
        'Hello': 'Bonjour',
        'How are you?': 'Comment allez-vous ?',
        'I am on my way': 'Je suis en route',
        'I will be there in 5 minutes': 'Je serai là dans 5 minutes',
        'Thank you': 'Merci',
        'Goodbye': 'Au revoir',
        'The client has been informed of your imminent arrival.': 'Le client est informé de votre arrivée imminente.',
        'I am informing the client about the delay. Thank you.': 'J\'informe le client du retard. Merci.',
        'The address has been confirmed with the client.': 'L\'adresse a été confirmée avec le client.',
        'Hello! How can I help you today?': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'I will respond to you as soon as possible.': 'Je vous réponds dès que possible.'
      };
      
      for (const [en, fr] of Object.entries(translations)) {
        if (text.includes(en)) {
          return text.replace(en, fr);
        }
      }
      
      return `[TRADUIT] ${text}`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Ajouter le message du chauffeur
    const driverMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'driver',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, driverMessage]);
    setInputValue('');
    
    // Simuler un délai avant la réponse
    setTimeout(async () => {
      // Simuler un message du dispatcher
      let dispatcherText = "Je vous réponds dès que possible.";
      
      // Simuler des réponses basées sur des mots clés
      if (inputValue.toLowerCase().includes('arrivée') || inputValue.toLowerCase().includes('arrive')) {
        dispatcherText = "Le client est informé de votre arrivée imminente.";
      } else if (inputValue.toLowerCase().includes('retard')) {
        dispatcherText = "J'informe le client du retard. Merci.";
      } else if (inputValue.toLowerCase().includes('adresse') || inputValue.toLowerCase().includes('destination')) {
        dispatcherText = "L'adresse a été confirmée avec le client.";
      } else if (inputValue.toLowerCase().includes('bonjour') || inputValue.toLowerCase().includes('salut')) {
        dispatcherText = `Bonjour ! Comment puis-je vous aider aujourd'hui ?`;
      }
      
      // Traduire si l'auto-traduction est activée
      let translatedText = dispatcherText;
      let original = '';
      
      if (autoTranslate) {
        // Détecter la langue (simulé - dans une vraie app on utiliserait une API)
        const needsTranslation = Math.random() > 0.5; // Simulation
        
        if (needsTranslation) {
          original = dispatcherText;
          translatedText = await translateText(dispatcherText, 'en');
        }
      }
      
      const dispatcherMessage: Message = {
        id: Date.now().toString(),
        text: translatedText,
        sender: 'dispatcher',
        timestamp: new Date(),
        translated: original ? true : false,
        original: original || undefined
      };
      
      setMessages(prev => [...prev, dispatcherMessage]);
    }, 1000);
  };
  
  const toggleTranslation = (message: Message) => {
    if (!message.translated || !message.original) return;
    
    setMessages(prev => 
      prev.map(m => 
        m.id === message.id 
          ? { 
              ...m, 
              text: m.original || m.text, 
              original: m.text, 
            } 
          : m
      )
    );
  };

  const toggleAutoTranslate = () => {
    setAutoTranslate(prev => !prev);
    toast({
      title: autoTranslate ? "Traduction automatique désactivée" : "Traduction automatique activée",
      duration: 2000
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Chat avec {dispatcher}</span>
            <Button 
              variant={autoTranslate ? "default" : "outline"} 
              onClick={toggleAutoTranslate}
              size="sm"
              className="text-xs"
            >
              {autoTranslate ? "Traduction auto: ON" : "Traduction auto: OFF"}
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Zone de messages */}
        <div className="h-[400px] overflow-y-auto p-2 bg-gray-50 rounded-md">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-3 ${message.sender === 'driver' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block rounded-lg px-3 py-2 max-w-[80%] break-words ${
                  message.sender === 'driver' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => toggleTranslation(message)}
              >
                <div>{message.text}</div>
                {message.translated && (
                  <div className="text-xs opacity-70 mt-1 italic">
                    Cliquer pour voir {message.original ? 'la traduction' : 'l\'original'}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Zone de saisie */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            ref={inputRef}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Tapez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
