'use client';
import type { Message, SocketMessage } from '@/app/lib/type/Messages';
import { deleteMessage, getMessages, sendMessage, updateMessage } from '@/app/lib/utils/messages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@ui/components/ui/form';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type Socket, io } from 'socket.io-client';
import * as z from 'zod';

const messageSchema = z.object({
  message: z
    .string()
    .min(1, 'Le message doit contenir au moins 1 caractère')
    .max(255, 'Le message doit contenir au plus 255 caractères'),
});

export default function ChatView() {
  const [messages, setMessages] = React.useState<{ data: Message[]; count: number }>({ data: [], count: 0 });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [socket, setSocket] = React.useState<Socket>();
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const id = user.id;

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' },
  });

  const editForm = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages();
      if (!messages) return;
      setMessages(messages);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '');
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receivedMessage', (payload: SocketMessage) => {
        const fetchData = async () => {
          if (payload.event === 'INSERT') {
            setMessages((prev) => ({ ...prev, data: [...prev.data, payload.new as Message] }));
          } else if (payload.event === 'UPDATE') {
            setMessages((prev) => ({
              ...prev,
              data: prev?.data.map((m) => (m.id === payload.new?.id ? (payload.new as Message) : m)),
            }));
          } else if (payload.event === 'DELETE') {
            setMessages((prev) => ({
              ...prev,
              data: prev?.data.filter((m) => m.id !== payload.old?.id),
            }));
          }
        };
        fetchData();
      });

      return () => {
        if (socket) {
          socket.off('receivedMessage');
        }
      };
    }
  }, [socket]);

  const handleSubmit = form.handleSubmit(async (data) => {
    const message = await sendMessage({ id_sender: id, message: data.message });
    if (message) {
      form.reset();
    }
  });

  const handleEditSubmit = editForm.handleSubmit(async (data) => {
    if (editingId === null) return;
    if (!data.message) return;
    const message = await updateMessage(editingId, data.message);
    if (message) {
      setEditingId(null);
      editForm.reset();
    }
  });

  const handleDelete = async (messageId: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    await deleteMessage(messageId);
  };

  const startEditing = (message: Message) => {
    setEditingId(message.id);
    editForm.reset({ message: message.message });
  };

  return (
    <div className="flex flex-col flex-grow bg-gray-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
      <main className="flex-1 overflow-auto p-4 space-y-2" style={{ scrollBehavior: 'smooth' }}>
        {messages?.data.map((message) => (
          <div key={message.id} className={`flex ${message.id_sender === id ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`relative max-w-[70%] min-w-[20%] rounded-lg p-2 ${
                message.id_sender === id ? 'bg-blue-500 text-white' : 'bg-white dark:bg-zinc-700 dark:text-white'
              }`}
            >
              {message.id_sender === id && (
                <button
                  className="absolute top-1 right-1 text-red-400 hover:text-red-800"
                  onClick={() => handleDelete(message.id)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <span
                className={`text-lg line-clamp-1 font-semibold ${message.id_sender === id ? 'text-white' : 'text-black'}`}
              >
                {message.name}
              </span>
              {editingId === message.id ? (
                <Form {...editForm}>
                  <form onSubmit={handleEditSubmit} className="space-y-2">
                    <FormField
                      control={editForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="w-full bg-white text-black" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        Annuler
                      </Button>
                      <Button type="submit" size="sm" disabled={!editForm.formState.isValid}>
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <p>{message.message}</p>
                  <div className="text-xs opacity-75 mt-1 flex justify-between items-center">
                    <div className="flex gap-2">
                      {new Date(message.created_at).toDateString() !== new Date().toDateString() && (
                        <span>{new Date(message.created_at).toLocaleDateString().slice(0, 5)}</span>
                      )}
                      <span>{new Date(message.created_at).toLocaleTimeString().slice(0, 5)}</span>
                    </div>
                    {message.id_sender === id && (
                      <Button size="sm" variant="ghost" onClick={() => startEditing(message)}>
                        Modifier
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </main>
      <footer className="bg-white dark:bg-zinc-800 p-4">
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Votre message" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button type="submit">Envoyer</Button>
            </div>
          </form>
        </Form>
      </footer>
    </div>
  );
}
