"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles, User, LogOut, Plus, MessageSquare, Trash2, Menu, X, Pencil, Check, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

type ChatSession = {
    id: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    title?: string;
};

export default function OOHExpertPage() {
    const { data: session, status } = useSession();
    const t = useTranslations('oohExpert');

    const SUGGESTIONS = [
        {
            title: t('suggestions.recommend.title'),
            subtitle: t('suggestions.recommend.subtitle')
        },
        {
            title: t('suggestions.optimize.title'),
            subtitle: t('suggestions.optimize.subtitle')
        },
        {
            title: t('suggestions.compare.title'),
            subtitle: t('suggestions.compare.subtitle')
        },
        {
            title: t('suggestions.promotions.title'),
            subtitle: t('suggestions.promotions.subtitle')
        }
    ];
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load saved chats when user logs in
    useEffect(() => {
        if (session) {
            loadChats();
        }
    }, [session]);

    const loadChats = async () => {
        setIsLoadingChats(true);
        try {
            const response = await fetch('/api/chats');
            if (response.ok) {
                const data = await response.json();
                if (data.sessions && data.sessions.length > 0) {
                    // Store all sessions for sidebar
                    setChatSessions(data.sessions);
                    // Load the most recent chat session
                    const latestSession = data.sessions[data.sessions.length - 1];
                    setMessages(latestSession.messages);
                    setSessionId(latestSession.id);
                }
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setIsLoadingChats(false);
        }
    };

    const selectChatSession = (chatSession: ChatSession) => {
        setMessages(chatSession.messages);
        setSessionId(chatSession.id);
        setSidebarOpen(false);
    };

    const startNewChat = () => {
        setMessages([]);
        setSessionId(`chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        setSidebarOpen(false);
    };

    const getChatTitle = (chatSession: ChatSession) => {
        if (chatSession.title) {
            return chatSession.title;
        }
        if (chatSession.messages.length > 0) {
            const firstUserMessage = chatSession.messages.find(m => m.role === 'user');
            if (firstUserMessage) {
                return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
            }
        }
        return 'New conversation';
    };

    const deleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            // Delete from server
            const response = await fetch(`/api/chats?sessionId=${chatId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat');
            }

            // Update local state
            setChatSessions(prev => prev.filter(s => s.id !== chatId));

            // If deleting current chat, start a new one
            if (chatId === sessionId) {
                startNewChat();
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            alert('Failed to delete chat. Please try again.');
        }
    };

    const startEditingChat = (chat: ChatSession, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingChatId(chat.id);
        setEditingTitle(getChatTitle(chat));
    };

    const saveEditedTitle = (chatId: string) => {
        if (!editingTitle.trim()) {
            setEditingChatId(null);
            return;
        }

        setChatSessions(prev => prev.map(s =>
            s.id === chatId ? { ...s, title: editingTitle.trim() } : s
        ));
        setEditingChatId(null);

        // TODO: Add API endpoint to update title on server
    };

    // Save chat to database whenever messages change
    useEffect(() => {
        if (session && messages.length > 0) {
            saveChat();
        }
    }, [messages, session]);

    const saveChat = async () => {
        if (!session) return;

        try {
            await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    messages,
                }),
            });

            // Update local chat sessions
            setChatSessions(prev => {
                const existingIndex = prev.findIndex(s => s.id === sessionId);
                const updatedSession: ChatSession = {
                    id: sessionId,
                    messages,
                    createdAt: existingIndex >= 0 ? prev[existingIndex].createdAt : new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = updatedSession;
                    return updated;
                } else {
                    return [...prev, updatedSession];
                }
            });
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    };

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to get response');
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Create a placeholder for the AI response
            const aiResponseId = (Date.now() + 1).toString();
            const aiResponse: Message = {
                id: aiResponseId,
                role: "assistant",
                content: "",
            };

            setMessages((prev) => [...prev, aiResponse]);

            // Read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let isComplete = false;

            // Producer: Read stream
            const readStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            isComplete = true;
                            break;
                        }
                        const chunk = decoder.decode(value, { stream: true });
                        fullText += chunk;
                    }
                } catch (error) {
                    console.error("Error reading stream:", error);
                    isComplete = true;
                }
            };

            // Consumer: Type out text
            const typeText = async () => {
                let currentLength = 0;
                while (true) {
                    if (currentLength < fullText.length) {
                        // Type faster by adding multiple characters if we're falling behind
                        const diff = fullText.length - currentLength;
                        const step = diff > 50 ? 5 : (diff > 20 ? 2 : 1);

                        currentLength += step;
                        const textToDisplay = fullText.slice(0, currentLength);

                        setMessages((prev) =>
                            prev.map(msg =>
                                msg.id === aiResponseId
                                    ? { ...msg, content: textToDisplay }
                                    : msg
                            )
                        );
                        // Fast delay for smooth typing
                        await new Promise(resolve => setTimeout(resolve, 10));
                    } else if (isComplete) {
                        break;
                    } else {
                        // Wait for more data
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            };

            // Run both concurrently
            await Promise.all([readStream(), typeText()]);
        } catch (error: any) {
            console.error('Error:', error);
            let errorContent = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";

            if (error.message?.includes('quota') || error.message?.includes('429')) {
                errorContent = "I'm currently unavailable due to API quota limits. Please contact the administrator or try again later.";
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: errorContent,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Show loading state
    if (status === "loading") {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
            {/* Sidebar for chat history */}
            {session && (
                <>
                    {/* Mobile sidebar overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <div className={cn(
                        "fixed md:relative z-50 h-full bg-slate-50 border-r flex flex-col transition-all duration-300",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                        sidebarCollapsed ? "md:w-16" : "w-72"
                    )}>
                        {/* Sidebar header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b">
                            {!sidebarCollapsed && (
                                <h2 className="font-semibold text-slate-800">{t('sidebar.chatHistory')}</h2>
                            )}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className="hidden md:flex"
                                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                >
                                    {sidebarCollapsed ? (
                                        <PanelLeft className="h-4 w-4" />
                                    ) : (
                                        <PanelLeftClose className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    className="md:hidden"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* New chat button */}
                        <div className={cn("p-3 border-b", sidebarCollapsed && "px-2")}>
                            <Button
                                onClick={startNewChat}
                                className={cn(
                                    "w-full gap-2",
                                    sidebarCollapsed ? "justify-center px-2" : "justify-start"
                                )}
                                variant="outline"
                                title="New Chat"
                            >
                                <Plus className="h-4 w-4" />
                                {!sidebarCollapsed && t('sidebar.newChat')}
                            </Button>
                        </div>

                        {/* Chat sessions list */}
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {chatSessions.length === 0 ? (
                                    !sidebarCollapsed && <p className="text-sm text-slate-500 text-center py-4">{t('sidebar.noHistory')}</p>
                                ) : (
                                    [...chatSessions].reverse().map((chat) => (
                                        <div
                                            key={chat.id}
                                            onClick={() => editingChatId !== chat.id && selectChatSession(chat)}
                                            className={cn(
                                                "w-full text-left rounded-lg text-sm transition-colors cursor-pointer group",
                                                sidebarCollapsed ? "p-2 flex justify-center" : "p-3",
                                                sessionId === chat.id
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-slate-100 text-slate-700"
                                            )}
                                            title={sidebarCollapsed ? getChatTitle(chat) : undefined}
                                        >
                                            {sidebarCollapsed ? (
                                                <MessageSquare className="h-4 w-4" />
                                            ) : editingChatId === chat.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={editingTitle}
                                                        onChange={(e) => setEditingTitle(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveEditedTitle(chat.id);
                                                            if (e.key === 'Escape') setEditingChatId(null);
                                                        }}
                                                        className="h-7 text-sm"
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            saveEditedTitle(chat.id);
                                                        }}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4 shrink-0" />
                                                        <span className="truncate flex-1">{getChatTitle(chat)}</span>
                                                        <div className="hidden group-hover:flex items-center gap-1">
                                                            <button
                                                                onClick={(e) => startEditingChat(chat, e)}
                                                                className="p-1 hover:bg-slate-200 rounded"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => deleteChat(chat.id, e)}
                                                                className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1 ml-6">
                                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col relative",
                !session && "max-w-4xl mx-auto w-full"
            )}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 w-full">
                    <div className="flex items-center gap-2">
                        {session && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {t('title')}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {session ? (
                            <>
                                <span className="text-sm text-slate-600 hidden sm:inline">{session.user?.name}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut()}
                                    className="text-slate-600 hover:text-slate-900"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => signIn('google')}
                                className="text-slate-600 hover:text-slate-900"
                            >
                                Sign in
                            </Button>
                        )}
                    </div>
                </div>


                {messages.length === 0 ? (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
                        <div className="mb-6 bg-white p-4 rounded-full shadow-sm border">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 text-center mb-2">
                            {t('greeting')}
                        </h1>
                        <p className="text-sm text-slate-600 text-center mb-8 max-w-xl mx-auto">
                            {t('intro')}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 max-w-2xl w-full">
                            {SUGGESTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSendMessage(`${suggestion.title} ${suggestion.subtitle}`)}
                                    className="text-left p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="font-medium text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                        {suggestion.title}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {suggestion.subtitle}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Chat History
                    <ScrollArea className="flex-1" ref={scrollAreaRef}>
                        <div className="w-full mx-auto space-y-0">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "w-full",
                                        message.role === "user" ? "bg-slate-50" : "bg-white"
                                    )}
                                >
                                    <div className={cn(
                                        "flex gap-4 max-w-3xl mx-auto px-4 py-6",
                                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        <Avatar className="h-8 w-8 mt-1 shrink-0">
                                            {message.role === "user" && session?.user?.image && session.user.image.trim() !== "" ? (
                                                <AvatarImage src={session.user.image} />
                                            ) : null}
                                            <AvatarFallback className={cn(
                                                message.role === "assistant" ? "bg-primary text-white" : "bg-slate-700 text-white"
                                            )}>
                                                {message.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className={cn(
                                            "flex-1 space-y-2",
                                            message.role === "user" ? "text-right" : "text-left"
                                        )}>
                                            <div className="font-semibold text-sm text-slate-900">
                                                {message.role === "assistant" ? "Jason" : "You"}
                                            </div>
                                            <div className={cn(
                                                "leading-relaxed whitespace-pre-wrap",
                                                message.role === "user" ? "text-slate-900" : "text-slate-700"
                                            )}>
                                                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:p-2 prose-pre:rounded-lg">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="w-full bg-white">
                                    <div className="flex gap-4 max-w-3xl mx-auto px-4 py-6">
                                        <Avatar className="h-8 w-8 mt-1 shrink-0">
                                            <AvatarFallback className="bg-primary text-white">
                                                <Sparkles className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="font-semibold text-sm text-slate-900">Jason</div>
                                            <div className="flex items-center gap-1 h-6">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-center">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t('placeholder')}
                                className="pr-12 py-6 text-base rounded-2xl border-slate-300 shadow-sm focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary"
                                autoFocus
                            />
                            <Button
                                size="icon"
                                className={cn(
                                    "absolute right-2 h-9 w-9 rounded-lg transition-all duration-200",
                                    inputValue.trim() ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                )}
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-3">
                            {!session && (
                                <span>
                                    <button onClick={() => signIn('google')} className="text-primary hover:text-primary/80">Sign in</button>
                                    {" "}{t('signInPrompt')}{" "}
                                </span>
                            )}
                            {t('disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
