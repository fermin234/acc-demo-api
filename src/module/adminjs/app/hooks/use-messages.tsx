import { useCurrentAdmin } from 'adminjs';
import { useEffect, useState } from 'react';

import { axiosInstance } from '../config/axios';
import { IDatabaseInfo } from '../interfaces/chat/IDatabaseInfo';
import { IMessage } from '../interfaces/chat/IMessage';
import { apiService } from '../services/api.service';
import { notificationService } from '../services/notification.service';

export const useMessages = (urlApi: string) => {
  const [admin] = useCurrentAdmin();
  const [databaseInfo, setDatabaseInfo] = useState<IDatabaseInfo>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const initializeToken = async () => {
      if (admin?.token) {
        apiService.setBaseUrl(urlApi);
        apiService.setAuthentication(admin.token);
        fetchDatabaseInfo();
      } else {
        notificationService.error('Could not get authentication token');
      }
    };

    initializeToken();
  }, [admin]);

  const fetchDatabaseInfo = async () => {
    try {
      const response = await axiosInstance.get('/database');
      setDatabaseInfo(response.data.databaseInfo);
    } catch (error) {
      notificationService.error('Error fetching database info');
    }
  };

  const handleSend = async () => {
    if (!input.trim().length) return;

    if (!databaseInfo) {
      return notificationService.error('No databa info provided');
    }

    try {
      setLoading(true);
      if (input.trim()) {
        setInput('');
        const { data } = await axiosInstance.post<IDatabaseInfo>('/chat/send', {
          message: input.trim(),
          language: 'english',
          databaseInfo: databaseInfo,
          history: messages,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Math.random() * 100, text: input, sender: 'user' },
          {
            id: Math.random() * 100,
            text: data.response,
            sender: 'bot',
          },
        ]);
      }
    } catch (error) {
      notificationService.error('No api-key provided');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return {
    messages,
    input,
    loading,
    handleSend,
    handleInputChange,
    handleKeyDown,
  };
};
